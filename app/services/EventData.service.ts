import { module } from "angular";
import { DEFAULT } from "../default";
import { HHH } from "../types/HHHTypes";
import { SchedulerWeek } from "./Week.service";


export class EventData {

    private week: SchedulerWeek;

    constructor(week: SchedulerWeek) {
        this.week = week;
    }

    public loadEventData(serverEventResponse: HHH.ResponseSchedulerEvent[]): HHH.SchedulerEvent[][] {
        const events: HHH.SchedulerEvent[][] = [];

        for (let i = 0; i < 7; i++) {
            events[i] = [];
        }

        for (const event of serverEventResponse) {
            event.startDate = new Date(event.startDate);
            event.endDate = new Date(event.endDate);

            const startDay = (event.startDate <= this.week.getDay(0)) ?
                0 : event.startDate.getDay();

            const endDay = (event.endDate >= this.week.getDay(6)) ?
                6 : event.endDate.getDay();

            for (let i = startDay; i <= endDay; i++) {

                const record: HHH.SchedulerEvent = {
                    date: event.startDate,
                    id: event.dogId ? event.dogId : event.eventId,
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
                    record.date = null;
                }

                events[i].push(record);
            }
        }
        return events;
    }
}
