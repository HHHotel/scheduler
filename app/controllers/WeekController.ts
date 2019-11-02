import { IScheduleEvent, compareScheduleEvents, getTimePrepend, DEFAULT } from "@happyhoundhotel/hounds-ts";
import { HoundsService } from "../services/Hounds.service";
import { SchedulerWeek } from "../services/Week.service";
import { HoundsSettings } from "../services/Settings.service";
import * as dates from "date-fns";

export class WeekController implements ng.IController {

    protected static $inject = ["$scope", "HoundsService", "WeekService", "HoundsSettings"];

    constructor(private $scope: ng.IScope, public hounds: HoundsService, private week: SchedulerWeek,
                private $settings: HoundsSettings) {
    }

    public dayEventComparator(a: any, b: any) {
        return compareScheduleEvents(a.value, b.value);
    }

    public nextWeek() {
        this.week.nextWeek();
        this.hounds.load(this.week.getDay(0));
    }

    public prevWeek() {
        this.week.prevWeek();
        this.hounds.load(this.week.getDay(0));
    }


    public getEventText(event: IScheduleEvent) {
        if (!event.startDate || !event.endDate) {
            return event.text;
        }

        if (dates.compareAsc(event.startDate, event.endDate) === 0) {
            if (event.type === DEFAULT.CONSTANTS.DAYCARE) {
                event.endDate.setHours(this.$settings.HOURS.CLOSING.PM);
            } else {
                event.endDate = new Date(event.startDate);
                const closingHour = event.startDate.getHours() < 12 ?
                    this.$settings.HOURS.CLOSING.AM : this.$settings.HOURS.CLOSING.PM;
                event.endDate.setHours(closingHour);
            }
        }

        return getTimePrepend(event) + " " + event.text;
    }
}