"use strict";
angular.module(DEFAULT.MAIN_PKG).factory("$Scheduler", [
    "Week",
    "Api",
    "EventData",
    "$location",
    function (Week, Api, EventData, $location) {
        return new SchedulerService(Week, Api, EventData, $location);
    }
]);
var SchedulerService = (function () {
    function SchedulerService(Week, Api, EventData, $location) {
        this.cache = {};
        this.init();
        this.api = Api;
        this.week = Week;
        this.cache.eventData = EventData;
        this.loc = $location;
        if (Settings.iDate)
            this.week.advanceToDate(new Date(parseInt(Settings.iDate)));
        this.checkToken();
    }
    SchedulerService.prototype.setupPolling = function () {
        var _this = this;
        if (!this.loadInterval)
            this.loadInterval = setInterval(function () { return _this.load(); }, 1000);
    };
    SchedulerService.prototype.clearPolling = function () {
        clearInterval(this.loadInterval);
        this.loadInterval = null;
        this.profileInterval = null;
    };
    SchedulerService.prototype.init = function () {
        this.cache.searchEvents = [];
        this.cache.searchText = "";
        this.cache.dogProfile = {
            open: false
        };
    };
    SchedulerService.prototype.login = function (username, password, callback) {
        var _this = this;
        this.api.login(username, password, function (result) {
            callback(result);
            _this.checkToken();
        });
    };
    SchedulerService.prototype.checkToken = function () {
        var self = this;
        if (Settings.user && Settings.user.token) {
            self.api.post("/login", Settings.user, function (response) {
                if (response.status === 200) {
                    self.loc.path("/main");
                    self.setupPolling();
                }
                else {
                    self.logout();
                }
            });
        }
        else {
            this.logout();
        }
    };
    SchedulerService.prototype.logout = function () {
        this.clearPolling();
        this.init();
        this.loc.path("/");
        Settings.user = {};
        saveSettings();
    };
    SchedulerService.prototype.load = function () {
        var self = this;
        self.api.get("/api/week", "date=" + self.week.days[0], function (response) {
            return self.cache.eventData.loadEventData(response.data);
        });
    };
    SchedulerService.prototype.nextWeek = function () {
        this.week.nextWeek();
        this.load();
    };
    SchedulerService.prototype.prevWeek = function () {
        this.week.prevWeek();
        this.load();
    };
    SchedulerService.prototype.jumpToWeek = function (date) {
        this.week.advanceToDate(date);
        this.load();
    };
    SchedulerService.prototype.addDog = function (dog) {
        var self = this;
        self.api.post("/api/dogs", dog);
    };
    SchedulerService.prototype.addEvent = function (event) {
        var self = this;
        var newEvent = {
            event_start: event.event_start.valueOf(),
            event_end: event.event_end ?
                event.event_end.valueOf() :
                event.event_start.valueOf(),
            event_text: event.event_text,
            event_type: event.event_type,
            id: event.id
        };
        self.api.post("/api/events", newEvent);
    };
    SchedulerService.prototype.findEvents = function (eventText) {
        var self = this;
        self.cache.searchText = eventText;
        self.api.get("/api/find", "searchText=" + eventText, function (response) {
            self.cache.searchEvents = response.data;
        });
    };
    SchedulerService.prototype.removeEvent = function (eventId, callback) {
        this.api.get("/api/events/" + eventId + "/delete", "", callback);
    };
    SchedulerService.prototype.removeDog = function (dogId, callback) {
        this.api.get("/api/events/" + dogId + "/delete", "", callback);
    };
    SchedulerService.prototype.editDog = function (dogProfile) {
        this.api.put("/api/dogs", dogProfile);
    };
    SchedulerService.prototype.retrieveDog = function (dogId) {
        var self = this;
        self.api.get("/api/dogs/" + dogId, "", function (res) {
            (function (callback) {
                for (var _i = 0, _a = res.data.bookings; _i < _a.length; _i++) {
                    var booking = _a[_i];
                    booking.startDate = new Date(booking.startDate);
                    booking.endDate = new Date(booking.endDate);
                }
                callback();
            })(function () {
                self.cache.dogProfile = res.data;
                self.cache.dogProfile.open = true;
                self.cache.dogProfile.id = dogId;
            });
        });
    };
    SchedulerService.prototype.addUser = function (username, password, permissionLevel) {
        var self = this;
        var user = {
            username: username,
            password: password,
            permissions: permissionLevel
        };
        self.api.post("/api/users", user, function () {
            alert("Added new user: " + user.username);
        });
    };
    SchedulerService.prototype.deleteUser = function (username) {
        var self = this;
        self.api.get("/api/users/" + username + "/delete", "", function () {
            alert("Deleted " + username);
        });
    };
    SchedulerService.prototype.changePassword = function (oldPassword, newPassword) {
        var self = this;
        var user = {
            username: Settings.user.username,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        self.api.put("/api/user/password", user, function () {
            alert("Changed Password for " + Settings.user.username);
        });
    };
    return SchedulerService;
}());
