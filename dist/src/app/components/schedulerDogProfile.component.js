"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var EventData_service_1 = require("../services/EventData.service");
var SchedulerDogProfileController = (function () {
    function SchedulerDogProfileController($Scheduler) {
        this.bookingSearch = "";
        this.editMode = false;
        this.$Scheduler = $Scheduler;
    }
    SchedulerDogProfileController.prototype.displayBooking = function (booking) {
        if (!(booking.startDate instanceof Date)) {
            return "";
        }
        function formatDate(date) {
            return date.toDateString() + getAmPm(date);
        }
        function getAmPm(date) {
            return date.getHours() < 12 ? " AM" : " PM";
        }
        switch (booking.type) {
            case default_1.DEFAULT.CONSTANTS.BOARDING:
                return formatDate(booking.startDate) + " - " + formatDate(booking.endDate);
            case default_1.DEFAULT.CONSTANTS.DAYCARE:
                return formatDate(booking.startDate);
            default:
                return "Error";
        }
    };
    SchedulerDogProfileController.prototype.saveProfile = function () {
        var _this = this;
        if (!this.dogProfile) {
            return;
        }
        var newDog = {
            bookings: [],
            clientName: this.dogProfile.clientName,
            id: this.dogProfile.id,
            name: this.dogProfile.name
        };
        for (var _i = 0, _a = this.dogProfile.bookings; _i < _a.length; _i++) {
            var booking = _a[_i];
            try {
                newDog.bookings.push(EventData_service_1.EventData.toApiEvent(booking));
            }
            catch (e) {
                alert("Invalid Date: " + e.message);
            }
        }
        if (newDog.name && newDog.clientName) {
            this.$Scheduler.editDog(newDog, function () {
                _this.updateDogProfile();
            });
        }
        else {
            alert("Error: Details not provided");
        }
    };
    SchedulerDogProfileController.prototype.exitProfile = function () {
        this.$Scheduler.cache.dogProfile = null;
    };
    SchedulerDogProfileController.prototype.removeEvent = function (id) {
        var _this = this;
        this.$Scheduler.removeEvent(id, function () { return _this.updateDogProfile(); });
    };
    SchedulerDogProfileController.prototype.removeDog = function (id) {
        var _this = this;
        this.$Scheduler.removeDog(id, function () {
            _this.$Scheduler.cache.dogProfile = null;
        });
    };
    SchedulerDogProfileController.prototype.updateDogProfile = function () {
        if (this.dogProfile) {
            this.$Scheduler.retrieveDog(this.dogProfile.id);
        }
    };
    return SchedulerDogProfileController;
}());
var SchedulerDogProfileComponent = (function () {
    function SchedulerDogProfileComponent() {
        this.bindings = {
            dogProfile: "<"
        };
        this.controller = SchedulerDogProfileController;
        this.templateUrl = "views/templates/schedulerDogProfile.template.html";
    }
    return SchedulerDogProfileComponent;
}());
exports.SchedulerDogProfileComponent = SchedulerDogProfileComponent;
