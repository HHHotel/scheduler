import { DEFAULT } from "../default";
import * as HHH from "../types/HHHTypes";
import { SchedulerWeek } from "./Week.service";

export class EventData {

    public static toApiEvent(event: HHH.ISchedulerEvent): HHH.ISchedulerApiEvent {
        return {
            endDate: event.startDate.valueOf(),
            startDate: event.endDate.valueOf(),
            id: event.id,
            text: event.text,
            type: event.type,
            desc: "",
        };
    }

    public static toApiBooking(booking: HHH.ISchedulerBooking): HHH.ISchedulerApiBooking {
        return {
            dogId: booking.dogId,
            startDate: booking.startDate.valueOf(),
            endDate: booking.endDate.valueOf(),
            id: booking.id,
            text: booking.text,
            type: booking.type,
            dogName: booking.dogName,
            clientName: booking.clientName,
            desc: "",
        };
    }

    public static toApiDog(dog: HHH.ISchedulerDog): HHH.ISchedulerApiDog {
        return {
            bookings: dog.bookings.map((ev) => EventData.toApiBooking(ev)),
            clientName: dog.clientName,
            id: dog.id,
            name: dog.name,
        };
    }

    public static fromApiBooking(event: HHH.ISchedulerApiBooking): HHH.ISchedulerBooking {
        return {
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            id: event.id,
            dogId: event.dogId,
            dogName: event.dogName,
            clientName: event.clientName,
            type: event.type,
            text: event.text,
        };
    }

    public static fromApiEvent(event: HHH.ISchedulerApiEvent): HHH.ISchedulerEvent {
        return {
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            id: event.id,
            text: event.text,
            type: event.type,
        };
    }

    private week: SchedulerWeek;

    constructor(week: SchedulerWeek) {
        this.week = week;
    }

    public loadEventData(serverEventResponse: HHH.ISchedulerApiBooking[]): HHH.ISchedulerEvent[][] {
        const events: HHH.ISchedulerEvent[][] = [];
        const self = this;

        // Init events out array
        for (let i = 0; i < 7; i++) {
            events[i] = [];
        }

        function getScheduleEvent(event: HHH.ISchedulerBooking, index: number): HHH.ISchedulerBooking {
            const record: HHH.ISchedulerBooking = {
                startDate: event.startDate,
                endDate: event.endDate,
                type: event.type,
                text: event.text,
                dogName: event.dogName,
                clientName: event.clientName,
                dogId: event.dogId,
                id: event.dogId ? event.dogId : event.id,
            };

            // event is not a boarding no need to do anything special
            if (record.type !== DEFAULT.CONSTANTS.BOARDING) {
                return record;
            }

            // Switch on the day of the current week
            switch (self.week.getDay(index).toDateString()) {
                case (record.startDate.toDateString()): // Record should be an arrival
                    record.type = DEFAULT.CONSTANTS.ARRIVING;
                    break;
                case (record.endDate.toDateString()): // Record should be a departure
                    record.type = DEFAULT.CONSTANTS.DEPARTING;
                    break;
                default: // Record should be boarding
                    record.type = DEFAULT.CONSTANTS.BOARDING;
                    break;
            }

            return record;
        }

        for (const responseEvent of serverEventResponse) {
            const event = EventData.fromApiBooking(responseEvent);

            const weekStartTime = this.week.getDay(0).valueOf();

            const msDiffStart = (new Date(event.startDate.toDateString()).valueOf() - weekStartTime);
            const msDiffEnd = (new Date(event.endDate.toDateString()).valueOf() - weekStartTime);

            let startDay = Math.round(msDiffStart / 1000 / 60 / 60 / 24); // convert to literal days
            let endDay = Math.round(msDiffEnd / 1000 / 60 / 60 / 24); // convert to literal days
            if (event.type === DEFAULT.CONSTANTS.BOARDING) {

                // Ignore days beyond current week
                if (startDay < 0) { startDay = 0; }
                if (endDay > 6) { endDay = 6; }

                // For every day from start->end a new record gets added onto events
                for (let i = startDay; i <= endDay; i++) {
                    const record = getScheduleEvent(event, i);
                    events[i].push(record);
                }
            } else if (startDay >= 0 && endDay <= 6 && startDay === endDay) {
                // Only add the non boarding event if it is in the current week
                events[startDay].push(getScheduleEvent(event, startDay));
            }
        }
        return events;
    }

}
