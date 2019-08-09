/* global angular DEFAULT saveSettings Settings */
'use strict';

angular.module(DEFAULT.MAIN_PKG).factory('$Scheduler', [
    'Week',
    'Api',
    'EventData',
    '$location',
    function (Week, Api, EventData, $location) {
        return new SchedulerService(Week, Api, EventData, $location);
    }]);

class SchedulerService {

    constructor (Week, Api, EventData, $location) {

        this.api = Api;
        this.week = Week;
        this.init();
        this.cache.eventData = EventData;
        if (Settings.iDate) this.week.advanceToDate(new Date(parseInt(Settings.iDate)));
        this.loc = $location;

        setInterval(() => this.load(), 1000);
        setInterval(() => {
            if (this.cache.dogProfile.open) {
                this.retrieveDog(this.cache.dogProfile.id);
            }
        }, 500);
    }

    init () {
        this.cache = {};

        // TODO: Refractor the loading of settings so its a service implemented
        // by this class
        this.cache.searchEvents = [];
        this.cache.searchText = '';
        this.cache.dogProfile = { open: false };

        this.checkToken();
    }

    login(username, password) {
        this.api.login(username, password);
    }

    checkToken() {
        let self = this;

        if (Settings.user && Settings.user.token) {
            self.api.post('/login', Settings.user, (response) => {
                if (response && response.data !== 'Login Failed') {
                    self.loc.path('/main');
                } else {
                    self.loc.path('/');
                }
            });
        }

    }

    logout () {
        this.init();
        this.loc.path('/');
        Settings.user = {};
        saveSettings();
    }

    load () {
        let self = this;
        self.api.get('/api/week', 'date=' + self.week.days[0],
            (response) => self.cache.eventData.loadEventData(response.data));
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

        // TODO: make a popup notification with the server response
        self.api.post('/api/dogs', dog);
    }

    addEvent(event) {
        let self = this;

        if (event.event_start) event.event_start = event.event_start.valueOf();
        if (event.event_end) event.event_end = event.event_end.valueOf();
        else event.event_end = event.event_start;

        self.api.post('/api/events', event);
    }

    findEvents (eventText) {
        let self = this;

        self.api.get('/api/find', 'searchText=' + eventText, function (response) {
            self.cache.searchEvents = response.data;
        });

    }

    removeEvent(eventId, callback) {
        this.api.get('/api/events/' + eventId + '/delete', callback);
    }

    removeDog(dogId, callback) {
        this.api.get('/api/events/' + dogId + '/delete', callback);
    }

    editDog(dogProfile) {
        // TODO: make a popup notification with the server response
        this.api.put('/api/dogs', dogProfile);
    }

    retrieveDog (dogId) {
        let self = this;

        self.api.get('/api/dogs/' + dogId, '', function (res) {

            (function (callback) {
                for (let booking of res.data.bookings) {
                    booking.startDate = new Date(booking.startDate);
                    booking.endDate = new Date(booking.endDate);
                }

                callback();
            }(() => {
                self.cache.dogProfile = res.data;
                self.cache.dogProfile.open = true;
                self.cache.dogProfile.id = dogId;
            }));
        });

    }

    // TODO : Add user changing requests
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
