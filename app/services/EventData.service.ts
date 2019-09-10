import { DEFAULT } from "../default";
import * as HHH from "../types/HHHTypes";
import { SchedulerWeek } from "./Week.service";

export class EventData {

    public static toApiEvent(event: HHH.ISchedulerEvent): HHH.ISchedulerApiEvent {
        if (event.date) {
            return {
                endDate: event.date.valueOf(),
                startDate: event.date.valueOf(),
                id: event.id,
                text: event.text,
                type: event.type,
                desc: "",
            };
        } else {
            throw new TypeError();
        }
    }

    public static toApiBooking(booking: HHH.ISchedulerBooking): HHH.ISchedulerApiBooking {
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
            date: new Date(event.startDate),
            id: event.id,
            text: event.text,
            type: event.type,
        };
    }

    private week: SchedulerWeek;

    constructor(week: SchedulerWeek) {
        this.week = week;
    }

    public loadEventData(serverEventResponse: HHH.ISchedulerApiBooking[]):
    HHH.ISchedulerEvent[][] {
        const events: HHH.ISchedulerEvent[][] = [];

        for (let i = 0; i < 7; i++) {
            events[i] = [];
        }

        for (const responseEvent of serverEventResponse) {
            const event = EventData.fromApiBooking(responseEvent);

            const startDay = (event.startDate <= this.week.getDay(0)) ?
                0 : SchedulerWeek.getDay(event.startDate);

            const endDay = (event.endDate >= this.week.getDay(6)) ?
                6 : SchedulerWeek.getDay(event.endDate);

            for (let i = startDay; i <= endDay; i++) {

                const record: HHH.ISchedulerEvent = {
                    date: event.startDate,
                    id: event.dogId ? event.dogId : event.id,
                    text: event.text,
                    type: event.type,
                };

                if (event.type === DEFAULT.CONSTANTS.BOARDING &&
                    this.week.getDay(i).toDateString() === event.startDate.toDateString()) {
                    record.date = event.startDate;
                    record.type = DEFAULT.CONSTANTS.ARRIVING;
                } else if (event.type === DEFAULT.CONSTANTS.BOARDING &&
                    this.week.getDay(i).toDateString() === event.endDate.toDateString()) {
                    record.date = event.endDate;
                    record.type = DEFAULT.CONSTANTS.DEPARTING;
                } else if (event.type === DEFAULT.CONSTANTS.BOARDING) {
                    record.date = undefined;
                }

                events[i].push(record);
            }
        }
        return events;
    }

}
