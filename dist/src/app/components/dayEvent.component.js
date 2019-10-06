"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var DayEventController = (function () {
    function DayEventController($Scheduler) {
        this.$Scheduler = $Scheduler;
    }
    DayEventController.prototype.getEventText = function () {
        if (!this.scheduleEvent) {
            return "";
        }
        return getTimePrepend(this.scheduleEvent) + " " + this.scheduleEvent.text;
    };
    DayEventController.prototype.lookup = function () {
        if (!this.scheduleEvent || !this.$Scheduler) {
            return;
        }
        switch (this.scheduleEvent.type) {
            case default_1.DEFAULT.CONSTANTS.ARRIVING:
            case default_1.DEFAULT.CONSTANTS.DEPARTING:
            case default_1.DEFAULT.CONSTANTS.BOARDING:
            case default_1.DEFAULT.CONSTANTS.DAYCARE:
                this.$Scheduler.retrieveDog(this.scheduleEvent.id);
                break;
        }
    };
    return DayEventController;
}());
var DayEventComponent = (function () {
    function DayEventComponent() {
        this.bindings = {
            scheduleEvent: "<"
        };
        this.controller = DayEventController;
        this.template = "<div ng-click = \"$ctrl.lookup()\"\n                         class = \"{{$ctrl.scheduleEvent.type}}\"\n                         id = \"{{$ctrl.scheduleEvent.id}}\">{{$ctrl.getEventText()}}</div> ";
    }
    return DayEventComponent;
}());
exports.DayEventComponent = DayEventComponent;
function getTimePrepend(record) {
    var event = record;
    var startHour = convertHours(event.startDate.getHours());
    var endHour = convertHours(event.endDate.getHours());
    if (event.startDate.valueOf() === event.endDate.valueOf()) {
        endHour = getClosingHour(event.endDate);
        if (event.type === default_1.DEFAULT.CONSTANTS.DAYCARE) {
            event.endDate = new Date(new Date(event.startDate).setHours(default_1.Settings.CLOSING_HOUR_PM));
        }
    }
    switch (event.type) {
        case default_1.DEFAULT.CONSTANTS.BOARDING:
            return "";
        case default_1.DEFAULT.CONSTANTS.ARRIVING:
            return "(" + startHour + getClosing(event.startDate) + ")";
        case default_1.DEFAULT.CONSTANTS.DEPARTING:
            return "(" + endHour + getClosing(event.endDate) + ")";
        default:
            return "(" + startHour + getTimeExtension(event.startDate) + "-"
                + endHour + getTimeExtension(event.endDate) + ")";
    }
}
function getClosing(date) {
    if (date.getHours() === default_1.Settings.OPENING_HOUR_AM || date.getHours() === default_1.Settings.OPENING_HOUR_PM) {
        return "-" + getClosingHour(date) + getTimeExtension(date);
    }
    else {
        return ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    }
}
function getClosingHour(date) {
    if (date.getHours() < 12) {
        return convertHours(default_1.Settings.CLOSING_HOUR_AM);
    }
    else {
        return convertHours(default_1.Settings.CLOSING_HOUR_PM);
    }
}
function getOpeningHour(date) {
    if (date.getHours() < 12) {
        return convertHours(default_1.Settings.OPENING_HOUR_AM);
    }
    else {
        return convertHours(default_1.Settings.OPENING_HOUR_PM);
    }
}
function getTimeExtension(date) {
    return !default_1.Settings.TWENTY_FOUR_HOUR ? getAmPm(date) : "";
}
function getAmPm(date) {
    return date.getHours() >= 12 ? " PM" : " AM";
}
function convertHours(hours) {
    return !default_1.Settings.TWENTY_FOUR_HOUR ? hours <= 12 ? hours : hours - 12 : hours;
}
