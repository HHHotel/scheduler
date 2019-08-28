"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var EventData = (function () {
    function EventData(week) {
        this.week = week;
    }
    EventData.toApiEvent = function (event) {
        if (event.date) {
            return {
                startDate: event.date.valueOf(),
                endDate: event.date.valueOf(),
                id: event.id,
                text: event.text,
                type: event.type,
                desc: ""
            };
        }
        else {
            throw new TypeError();
        }
    };
    EventData.toApiBooking = function (booking) {
        if (booking.type === "daycare") {
            booking.endDate = booking.startDate;
        }
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
            bookings: dog.bookings.map(function (ev) { return EventData.toApiBooking(ev); }),
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
            date: new Date(event.startDate),
            id: event.id,
            text: event.text,
            type: event.type
        };
    };
    EventData.prototype.loadEventData = function (serverEventResponse) {
        var events = [];
        for (var i = 0; i < 7; i++) {
            events[i] = [];
        }
        for (var _i = 0, serverEventResponse_1 = serverEventResponse; _i < serverEventResponse_1.length; _i++) {
            var responseEvent = serverEventResponse_1[_i];
            var event_1 = EventData.fromApiBooking(responseEvent);
            var startDay = (event_1.startDate <= this.week.getDay(0)) ?
                0 : event_1.startDate.getDay();
            var endDay = (event_1.endDate >= this.week.getDay(6)) ?
                6 : event_1.endDate.getDay();
            for (var i = startDay; i <= endDay; i++) {
                var record = {
                    date: event_1.startDate,
                    id: event_1.dogId ? event_1.dogId : event_1.id,
                    text: event_1.text,
                    type: event_1.type
                };
                if (event_1.type === default_1.DEFAULT.CONSTANTS.BOARDING &&
                    this.week.getDay(i).toDateString() === event_1.startDate.toDateString()) {
                    record.date = event_1.startDate;
                    record.type = default_1.DEFAULT.CONSTANTS.ARRIVING;
                }
                else if (event_1.type === default_1.DEFAULT.CONSTANTS.BOARDING &&
                    this.week.getDay(i).toDateString() === event_1.endDate.toDateString()) {
                    record.date = event_1.endDate;
                    record.type = default_1.DEFAULT.CONSTANTS.DEPARTING;
                }
                else if (event_1.type === default_1.DEFAULT.CONSTANTS.BOARDING) {
                    record.date = undefined;
                }
                events[i].push(record);
            }
        }
        return events;
    };
    return EventData;
}());
exports.EventData = EventData;
