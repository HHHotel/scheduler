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

        // TODO: Refractor the loading of settings so its a service implemented
        // by this class

        this.cache = {};
        this.init();
        this.api = Api;
        this.week = Week;
        this.cache.eventData = EventData;
        this.loc = $location;

        if (Settings.iDate) this.week.advanceToDate(new Date(parseInt(Settings.iDate)));

        this.checkToken();
    }

    init () {
        this.cache.searchEvents = [];
        this.cache.searchText = '';
        this.cache.dogProfile = { open: false };
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

                    this.loadInterval = setInterval(() => this.load(), 1000);
                    this.profileInterval = setInterval(() => {
                        if (this.cache.dogProfile.open) {
                            this.retrieveDog(this.cache.dogProfile.id);
                        }
                    }, 500);
                } else {
                    self.logout();
                }
            });
        }

    }

    logout () {
        clearInterval(this.loadInterval);
        clearInterval(this.profileInterval);
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
        const newEvent = {
            event_start: event.event_start.valueOf(),
            event_end: event.event_end ? event.event_end : event.event_start.valueOf(),
            event_text: event.event_text,
            event_type: event.event_type,
            id: event.id,
        };

        self.api.post('/api/events', newEvent);
    }

    findEvents (eventText) {
        let self = this;

        self.api.get('/api/find', 'searchText=' + eventText, function (response) {
            self.cache.searchEvents = response.data;
        });

    }

    removeEvent(eventId, callback) {
        this.api.get('/api/events/' + eventId + '/delete', '', callback);
    }

    removeDog(dogId, callback) {
        this.api.get('/api/events/' + dogId + '/delete', '', callback);
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

    addUser (username, password, permissionLevel) {
        let self = this;
        let user = {
            username: username,
            password: password,
            permissionLevel: permissionLevel
        };

        self.api.post('/api/users', user, () => {
            alert('Added new user: ' + user.username);
        });

    }

    deleteUser (username) {
        let self = this;

        self.api.get('/api/users/' + username + '/delete', '', () => {
            alert('Deleted ' + username);
        });
    }

    changePassword (oldPassword, newPassword) {
        let self = this;
        let user = {
            username: Settings.user.username,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        self.api.post('/api/user/password', user, () => {
            alert('Changed Password for ' + Settings.user.username);
        });

    }

}
