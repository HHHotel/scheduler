/* global angular DEFAULT */

angular.module(DEFAULT.MAIN_PKG).factory("EventData", [
    "Week",
    function (Week) { return new EventData(Week); }]);

class EventData {

    constructor (Week) {

        let self = this;

        self.week = Week;
        self.events = [[]];
    }

    loadEventData (serverEventResponse) {
        let self = this;

        self.events = [];

        for (let i = 0; i < 7; i++) self.events[i] = [];

        for (let event of serverEventResponse) {
            event.startDate = new Date(event.startDate);
            event.endDate = new Date(event.endDate);

            let startDay = (event.startDate <= self.week.getDay(0)) ?
                0 : event.startDate.getDay();

            let endDay = (event.endDate >= self.week.getDay(6)) ?
                6 : event.endDate.getDay();

            for (let i = startDay; i <= endDay; i++) {

                let record = {
                    text: event.text,
                    type: event.type,
                    id: event.dogId ? event.dogId : event.eventId,
                    date: event.startDate,
                };

                if (event.type === DEFAULT.CONSTANTS.BOARDING &&
                    self.week.getDay(i).toDateString() === event.startDate.toDateString())
                {
                    record.date = event.startDate;
                    record.type = DEFAULT.CONSTANTS.ARRIVING;
                } else if (event.type === DEFAULT.CONSTANTS.BOARDING &&
                    self.week.getDay(i).toDateString() === event.endDate.toDateString())
                {
                    record.date = event.endDate;
                    record.type = DEFAULT.CONSTANTS.DEPARTING;
                }
                else if (event.type === DEFAULT.CONSTANTS.BOARDING)
                {
                    record.date = null;
                }

                self.events[i].push(record);
            }

        }

    }
}

