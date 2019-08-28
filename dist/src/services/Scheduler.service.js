"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var SchedulerService = (function () {
    function SchedulerService(week, api, eventData, $location) {
        this.cache = {
            dogProfile: null,
            events: undefined,
            searchEvents: undefined,
            searchText: ""
        };
        this.api = api;
        this.week = week;
        this.eventData = eventData;
        this.loc = $location;
        if (default_1.Settings.iDate) {
            this.week.advanceToDate(new Date(parseInt(default_1.Settings.iDate, 10)));
        }
        this.checkToken();
    }
    SchedulerService.prototype.setupPolling = function () {
        var _this = this;
        if (!this.loadInterval) {
            this.loadInterval = window.setInterval(function () { return _this.load(); }, 1000);
        }
    };
    SchedulerService.prototype.clearPolling = function () {
        clearInterval(this.loadInterval);
        this.loadInterval = undefined;
    };
    SchedulerService.prototype.init = function () {
        this.cache = {
            dogProfile: null,
            events: undefined,
            searchEvents: undefined,
            searchText: ""
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
        var _this = this;
        if (default_1.Settings.user && default_1.Settings.user.token) {
            this.api.post("/login", default_1.Settings.user, function (response) {
                if (response.status === 200) {
                    _this.loc.path("/main");
                    _this.setupPolling();
                }
                else {
                    _this.logout();
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
        default_1.Settings.user = {
            token: "",
            username: ""
        };
        default_1.saveSettings();
    };
    SchedulerService.prototype.load = function () {
        var _this = this;
        this.api.get("/api/week", "date=" + this.week.getDay(0), function (response) {
            _this.cache.events = _this.eventData.loadEventData(response.data);
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
        this.api.post("/api/dogs", dog, function () { return alert("Success"); });
    };
    SchedulerService.prototype.addEvent = function (event) {
        var newEvent = {
            event_end: event.event_end ?
                event.event_end.valueOf() :
                event.event_start.valueOf(),
            event_start: event.event_start.valueOf(),
            event_text: event.event_text,
            event_type: event.event_type,
            id: event.id
        };
        this.api.post("/api/events", newEvent, function () { return alert("Success"); });
    };
    SchedulerService.prototype.findEvents = function (eventText) {
        var _this = this;
        this.cache.searchText = eventText;
        this.api.get("/api/find", "searchText=" + eventText, function (response) {
            _this.cache.searchEvents = response.data;
        });
    };
    SchedulerService.prototype.removeEvent = function (eventId, callback) {
        this.api["delete"]("/api/events/" + eventId, callback);
    };
    SchedulerService.prototype.removeDog = function (dogId, callback) {
        this.api["delete"]("/api/dogs/" + dogId, callback);
    };
    SchedulerService.prototype.editDog = function (dogProfile, callback) {
        this.api.put("/api/dogs", dogProfile, callback);
    };
    SchedulerService.prototype.retrieveDog = function (dogId) {
        var _this = this;
        this.api.get("/api/dogs/" + dogId, "", function (res) {
            var responseData = res.data;
            for (var _i = 0, _a = responseData.bookings; _i < _a.length; _i++) {
                var booking = _a[_i];
                booking.startDate = new Date(booking.startDate);
                booking.endDate = new Date(booking.endDate);
            }
            _this.cache.dogProfile = responseData;
            _this.cache.dogProfile.id = dogId;
        });
    };
    SchedulerService.prototype.addUser = function (username, password, permissionLevel) {
        var user = {
            password: password,
            permissions: permissionLevel,
            username: username
        };
        this.api.post("/api/users", user, function () {
            alert("Added new user: " + user.username);
        });
    };
    SchedulerService.prototype.deleteUser = function (username) {
        this.api["delete"]("/api/users/" + username, function () {
            alert("Deleted " + username);
        });
    };
    SchedulerService.prototype.changePassword = function (oldPassword, newPassword) {
        var user = {
            newPassword: newPassword,
            oldPassword: oldPassword,
            username: default_1.Settings.user.username
        };
        this.api.put("/api/user/password", user, function () {
            alert("Changed Password for " + default_1.Settings.user.username);
        });
    };
    return SchedulerService;
}());
exports.SchedulerService = SchedulerService;
