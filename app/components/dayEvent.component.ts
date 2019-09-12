import { Settings, DEFAULT } from "../default";
import { SchedulerService } from "../services/Scheduler.service";
import * as HHH from "../types/HHHTypes";

interface IDayEventBindings {
    scheduleEvent?: HHH.ISchedulerEvent | HHH.ISchedulerBooking;
    $Scheduler: SchedulerService;
}

interface IDayEventController extends IDayEventBindings {
    getEventText(): string;
    lookup(): void;
}

class DayEventController implements IDayEventController {

    public scheduleEvent?: HHH.ISchedulerBooking;
    public $Scheduler: SchedulerService;

    constructor($Scheduler: SchedulerService) {
        this.$Scheduler = $Scheduler;
    }

    public getEventText(): string {
        if (!this.scheduleEvent) {
            return "";
        }

        return getTimePrepend(this.scheduleEvent) + " " + this.scheduleEvent.text;
    }

    public lookup() {
        if (!this.scheduleEvent || !this.$Scheduler) {
            return;
        }

        switch (this.scheduleEvent.type) {
            case DEFAULT.CONSTANTS.ARRIVING:
            case DEFAULT.CONSTANTS.DEPARTING:
            case DEFAULT.CONSTANTS.BOARDING:
            case DEFAULT.CONSTANTS.DAYCARE:
                this.$Scheduler.retrieveDog(this.scheduleEvent.id);
                break;
        }
    }

}

// tslint:disable-next-line: max-classes-per-file
export class DayEventComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public template: string;

    constructor() {
        this.bindings = {
            scheduleEvent: "<",
        };
        this.controller = DayEventController;
        this.template = `<div ng-click = "$ctrl.lookup()"
                         class = "{{$ctrl.scheduleEvent.type}}"
                         id = "{{$ctrl.scheduleEvent.id}}">{{$ctrl.getEventText()}}</div> `;
    }

}

function getTimePrepend(record: HHH.ISchedulerBooking) {
    const event = record;
    const startHour = convertHours(event.startDate.getHours());
    let endHour = convertHours(event.endDate.getHours());

    /*
     * The event has no real end time so we give it the end time of the closing hour
     * */
    if (event.startDate.valueOf() === event.endDate.valueOf()) {
        endHour = getClosingHour(event.endDate);

        // Daycare with no end are special and they need to have their end set to closing hour
        if (event.type === DEFAULT.CONSTANTS.DAYCARE) {
            event.endDate = new Date(new Date(event.startDate).setHours(Settings.CLOSING_HOUR_PM));
        }
    }

    switch (event.type) {
        case DEFAULT.CONSTANTS.BOARDING:
            return "";
        case DEFAULT.CONSTANTS.ARRIVING:
            return "(" + startHour + getClosing(event.startDate) + ")";
        case DEFAULT.CONSTANTS.DEPARTING:
            return "(" + endHour + getClosing(event.endDate) + ")";
        default:
            return "(" + startHour + getTimeExtension(event.startDate) + "-"
                + endHour + getTimeExtension(event.endDate) + ")";
    }
}

function getClosing(date: Date) {
    if (date.getHours() === Settings.OPENING_HOUR_AM || date.getHours() === Settings.OPENING_HOUR_PM) {
        return "-" + getClosingHour(date) + getTimeExtension(date);
    } else {
        return ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    }
}

function getClosingHour(date: Date) {
    if (date.getHours() < 12) {
        return convertHours(Settings.CLOSING_HOUR_AM);
    } else {
        return convertHours(Settings.CLOSING_HOUR_PM);
    }
}

function getOpeningHour(date: Date) {
    if (date.getHours() < 12) {
        return convertHours(Settings.OPENING_HOUR_AM);
    } else {
        return convertHours(Settings.OPENING_HOUR_PM);
    }
}

function getTimeExtension(date: Date) {
    return !Settings.TWENTY_FOUR_HOUR ? getAmPm(date) : "";
}

function getAmPm(date: Date) {
    return date.getHours() >= 12 ? " PM" : " AM";
}

function convertHours(hours: number) {
    return !Settings.TWENTY_FOUR_HOUR ? hours <= 12 ? hours : hours - 12 : hours;
}
