"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var EventData = (function () {
    function EventData(week) {
        this.week = week;
    }
    EventData.toApiEvent = function (event) {
        return {
            startDate: event.startDate.valueOf(),
            endDate: event.endDate.valueOf(),
            id: event.id,
            text: event.text,
            type: event.type,
            desc: ""
        };
    };
    EventData.toApiBooking = function (booking) {
        return {
            dogId: booking.dogId,
            startDate: booking.startDate.valueOf(),
            endDate: booking.endDate.valueOf(),
            id: booking.id,
            text: booking.text,
            type: booking.type,
            dogName: booking.dogName,
            clientName: booking.clientName,
            desc: ""
        };
    };
    EventData.toApiDog = function (dog) {
        return {
            bookings: dog.bookings.map(function (ev) { return EventData.toApiEvent(ev); }),
            clientName: dog.clientName,
            id: dog.id,
            name: dog.name
        };
    };
    EventData.fromApiBooking = function (event) {
        return {
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            id: event.id,
            dogId: event.dogId,
            dogName: event.dogName,
            clientName: event.clientName,
            type: event.type,
            text: event.text
        };
    };
    EventData.fromApiEvent = function (event) {
        return {
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            id: event.id,
            text: event.text,
            type: event.type
        };
    };
    EventData.prototype.loadEventData = function (serverEventResponse) {
        var events = [];
        var self = this;
        for (var i = 0; i < 7; i++) {
            events[i] = [];
        }
        function getScheduleEvent(event, index) {
            var record = {
                startDate: event.startDate,
                endDate: event.endDate,
                type: event.type,
                text: event.text,
                id: event.dogId ? event.dogId : event.id
            };
            if (record.type !== default_1.DEFAULT.CONSTANTS.BOARDING) {
                return record;
            }
            switch (self.week.getDay(index).toDateString()) {
                case (record.startDate.toDateString()):
                    record.type = default_1.DEFAULT.CONSTANTS.ARRIVING;
                    break;
                case (record.endDate.toDateString()):
                    record.type = default_1.DEFAULT.CONSTANTS.DEPARTING;
                    break;
                default:
                    record.type = default_1.DEFAULT.CONSTANTS.BOARDING;
                    break;
            }
            return record;
        }
        for (var _i = 0, serverEventResponse_1 = serverEventResponse; _i < serverEventResponse_1.length; _i++) {
            var responseEvent = serverEventResponse_1[_i];
            var event_1 = EventData.fromApiBooking(responseEvent);
            var weekStartTime = this.week.getDay(0).valueOf();
            var msDiffStart = (new Date(event_1.startDate.toDateString()).valueOf() - weekStartTime);
            var msDiffEnd = (new Date(event_1.endDate.toDateString()).valueOf() - weekStartTime);
            var startDay = Math.round(msDiffStart / 1000 / 60 / 60 / 24);
            var endDay = Math.round(msDiffEnd / 1000 / 60 / 60 / 24);
            if (event_1.type === default_1.DEFAULT.CONSTANTS.BOARDING) {
                if (startDay < 0) {
                    startDay = 0;
                }
                if (endDay > 6) {
                    endDay = 6;
                }
                for (var i = startDay; i <= endDay; i++) {
                    var record = getScheduleEvent(event_1, i);
                    events[i].push(record);
                }
            }
            else if (startDay >= 0 && endDay <= 6 && startDay === endDay) {
                events[startDay].push(getScheduleEvent(event_1, startDay));
            }
        }
        return events;
    };
    return EventData;
}());
exports.EventData = EventData;
