"use strict";
/* global angular DEFAULT */
angular.module(DEFAULT.MAIN_PKG).factory("EventData", [
    "Week",
    function (Week) { return new EventData(Week); }
]);
var EventData = /** @class */ (function () {
    function EventData(Week) {
        var self = this;
        self.week = Week;
        self.events = [[]];
    }
    EventData.prototype.loadEventData = function (serverEventResponse) {
        var self = this;
        self.events = [];
        for (var i = 0; i < 7; i++)
            self.events[i] = [];
        for (var _i = 0, serverEventResponse_1 = serverEventResponse; _i < serverEventResponse_1.length; _i++) {
            var event_1 = serverEventResponse_1[_i];
            event_1.startDate = new Date(event_1.startDate);
            event_1.endDate = new Date(event_1.endDate);
            var startDay = (event_1.startDate <= self.week.getDay(0)) ?
                0 : event_1.startDate.getDay();
            var endDay = (event_1.endDate >= self.week.getDay(6)) ?
                6 : event_1.endDate.getDay();
            for (var i = startDay; i <= endDay; i++) {
                var record = {
                    text: event_1.text,
                    type: event_1.type,
                    id: event_1.dogId ? event_1.dogId : event_1.eventId,
                    date: event_1.startDate,
                };
                if (event_1.type === DEFAULT.CONSTANTS.BOARDING &&
                    self.week.getDay(i).toDateString() === event_1.startDate.toDateString()) {
                    record.date = event_1.startDate;
                    record.type = DEFAULT.CONSTANTS.ARRIVING;
                }
                else if (event_1.type === DEFAULT.CONSTANTS.BOARDING &&
                    self.week.getDay(i).toDateString() === event_1.endDate.toDateString()) {
                    record.date = event_1.endDate;
                    record.type = DEFAULT.CONSTANTS.DEPARTING;
                }
                else if (event_1.type === DEFAULT.CONSTANTS.BOARDING) {
                    record.date = null;
                }
                self.events[i].push(record);
            }
        }
    };
    return EventData;
}());
