"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var DayEventController = (function () {
    function DayEventController($Scheduler) {
        this.$Scheduler = $Scheduler;
    }
    DayEventController.prototype.getEventText = function () {
        if (this.scheduleEvent) {
            var date = this.scheduleEvent.date ? new Date(this.scheduleEvent.date) : null;
            var text = this.scheduleEvent.text;
            if (date) {
                var hours = convertHours(date.getHours());
                return "(" + hours + getClosing(date) + getTimeExtension(date) + ") " + text;
            }
            else {
                return text;
            }
        }
        else {
            return "";
        }
    };
    DayEventController.prototype.lookup = function () {
        if (!this.scheduleEvent || !this.$Scheduler) {
            return null;
        }
        switch (this.scheduleEvent.type) {
            case "arriving":
            case "departing":
            case "boarding":
            case "daycare":
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
        this.template = "<div ng-click = \"$ctrl.lookup($ctrl.scheduleEvent)\"\n                         class = \"{{$ctrl.scheduleEvent.type}}\"\n                         id = \"{{$ctrl.scheduleEvent.id}}\">{{$ctrl.getEventText()}}</div> ";
    }
    return DayEventComponent;
}());
exports.DayEventComponent = DayEventComponent;
function getClosing(date) {
    if (date.getHours() === default_1.Settings.OPENING_HOUR_AM || date.getHours() === default_1.Settings.OPENING_HOUR_PM) {
        return "-" + (date.getHours() >= 12 ? convertHours(default_1.Settings.CLOSING_HOUR_PM) :
            convertHours(default_1.Settings.CLOSING_HOUR_AM));
    }
    else {
        return ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
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
