import { Settings, DEFAULT } from "../default";
import { SchedulerService } from "../services/Scheduler.service";

interface IDayEvent {
    text: string;
    type: string;
    id: string;
    date: Date;
}
interface IDayEventBindings {
    scheduleEvent?: IDayEvent;
    $Scheduler: SchedulerService;
}

interface IDayEventController extends IDayEventBindings {
    getEventText(): string;
    lookup(): void;
}

class DayEventController implements IDayEventController {

    public scheduleEvent?: IDayEvent;
    public $Scheduler: SchedulerService;

    constructor($Scheduler: SchedulerService) {
        this.$Scheduler = $Scheduler;
    }

    public getEventText(): string {
        if (this.scheduleEvent) {
            const date: Date | null = this.scheduleEvent.date ? new Date(this.scheduleEvent.date) : null;
            const text = this.scheduleEvent.text;

            if (date) {

                const hours = convertHours(date.getHours());
                // let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

                return "(" + hours + getClosing(date) + getTimeExtension(date) + ") " + text;

            } else {
                return text;
            }
        } else {
            return "";
        }
    }

    public lookup() {
        if (!this.scheduleEvent || !this.$Scheduler) {
            return null;
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
        this.template = `<div ng-click = "$ctrl.lookup($ctrl.scheduleEvent)"
                         class = "{{$ctrl.scheduleEvent.type}}"
                         id = "{{$ctrl.scheduleEvent.id}}">{{$ctrl.getEventText()}}</div> `;
    }

}

function getClosing(date: Date) {
    if (date.getHours() === Settings.OPENING_HOUR_AM || date.getHours() === Settings.OPENING_HOUR_PM) {
        return "-" + (date.getHours() >= 12 ? convertHours(Settings.CLOSING_HOUR_PM) :
            convertHours(Settings.CLOSING_HOUR_AM));
    } else {
        return ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
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
