/* global angular DEFAULT saveSettings Settings */

angular.module(DEFAULT.MAIN_PKG).factory('$Scheduler', [
    'Week',
    'Socket',
    '$location',
    function (Week, Socket, $location) { return new SchedulerService(Week, Socket, $location); }]);

// TODO : Create a data service for managing dog data
// & use this for enforcing consistency/managing events
class SchedulerService {

    constructor (Week, Socket, $location) {

        let self = this;

        self.week = Week;
        if (Settings.iDate) self.week.advanceToDate(new Date(parseInt(Settings.iDate)));
        self.socket = Socket;
        self.loc = $location;
        self.init();

        self.conn = { connected: false };
        self.socket.on('connected', () => {
            self.checkToken();
            self.conn.connected = true;
        });
        self.socket.on('disconnect', (reason) => {
            console.log(reason);
            self.logout();
            self.conn.connected = false;
        });
        self.socket.on('update', () => { self.load(); });

    }

    init () {
        let self = this;
        self.cache = {};

        // TODO: Refractor the loading of settings so its a service implemented
        // by this class and socket service
        self.cache.events = [[]];
        self.cache.searchEvents = [];
        self.cache.searchText = '';
        self.cache.dogProfile = { open: false };

    }

    checkToken() {
        let self = this;

        if (Settings.user && Settings.user.token) {
            self.socket.emit('check_token', Settings.user, (response) => {
                if (response) {
                    self.loc.path('/main');
                } else {
                    self.loc.path('/');
                }
            });
        }

    }

    logout () {
        let self = this;
        self.init();
        self.loc.path('/');
        Settings.user = {};
        saveSettings();
    }

    login (username, password, callback) {
        let self = this;

        let user = {
            username: username,
            password: password
        };

        self.socket.emit('login', user, function(response) {
            if (response) {
                Settings.user.username = username;
                Settings.user.permissions = response.permissions;
                Settings.user.token = response.token;
                callback(true);
            } else {
                callback(false);
            }
        });

    }

    load () {
        let self = this;

        self.socket.emit('load', self.week.days[0], function (response) {
            self.cache.events = [];

            for (let i = 0; i < 7; i++) self.cache.events[i] = [];

            // TODO : Clean up and refractor this loop somewhere else
            for (let event of response) {
                event.startDate = new Date(event.startDate);
                event.endDate = new Date(event.endDate);

                let startDay = (event.startDate <= self.week.getDay(0)) ?
                    0 : event.startDate.getDay();

                let endDay = (event.endDate >= self.week.getDay(6)) ?
                    6 : event.endDate.getDay();

                for (let i = startDay; i <= endDay; i++) {

                    let record = {
                        text: event.text,
                        type: event.type,
                        id: event.dogId ? event.dogId : event.eventId,
                        date: event.startDate,
                    };

                    if (event.type === 'boarding' &&
                        self.week.getDay(i).toDateString() === event.startDate.toDateString())
                    {
                        record.date = event.startDate;
                        record.type = 'arriving';
                    } else if (event.type === 'boarding' &&
                        self.week.getDay(i).toDateString() === event.endDate.toDateString())
                    {
                        record.date = event.endDate;
                        record.type = 'departing';
                    }
                    else if (event.type === 'boarding')
                    {
                        record.date = null;
                    }

                    self.cache.events[i].push(record);
                }

            }
        });
    }

    nextWeek () {
        this.week.nextWeek();
        this.load();
    }

    prevWeek () {
        this.week.prevWeek();
        this.load();
    }

    jumpToWeek (date) {
        this.week.advanceToDate(date);
        this.load();
    }

    addDog(dog) {
        let self = this;

        self.socket.emit('add_dog', dog);
    }

    addEvent(event) {
        let self = this;

        if (event.event_start) event.event_start = event.event_start.valueOf();
        if (event.event_end) event.event_end = event.event_end.valueOf();
        else event.event_end = event.event_start;

        self.socket.emit('add_event', event);
    }

    findEvents (eventText) {
        let self = this;

        self.socket.emit('find', eventText, function (response) {
            self.cache.searchEvents = response;
        });

    }

    removeEvent(evtID, callback) {

        let self = this;

        self.socket.emit('remove_event', evtID, callback);

    }

    removeDog(dogID, callback) {

        this.socket.emit('remove_dog', dogID, callback);

    }

    editDog(dogProfile) {

        this.socket.emit('edit_dog', dogProfile);

    }

    retrieveDog (dogID) {
        let self = this;

        self.socket.emit('retrieve_dog', dogID, function (res) {

            (function (callback) {
                for (let booking of res.bookings) {
                    booking.startDate = new Date(booking.startDate);
                    booking.endDate = new Date(booking.endDate);
                }

                callback();
            }(() => {
                self.cache.dogProfile = res;
                self.cache.dogProfile.open = true;
                self.cache.dogProfile.id = dogID;
            }));
        });

    }

    addUser (username, password, permissionLevel) {
        let self = this;
        let user = {
            username: username,
            password: password,
            permissionLevel: permissionLevel
        };

        self.socket.emit('add_user', user);

    }

    deleteUser (username) {
        let self = this;

        self.socket.emit('delete_user', username);
    }

    changePassword (oldPassword, newPassword) {
        let self = this;
        let user = {
            username: Settings.user.username,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        self.socket.emit('change_password', user);

    }

}
