import { getTimePrepend, IHoundEvent, DEFAULT, retrieveDog } from "@happyhoundhotel/hounds-ts";

interface IDayEventBindings {
    scheduleEvent?: IHoundEvent;
}

interface IDayEventController extends IDayEventBindings {
    getEventText(): string;
    lookup(): void;
}

class DayEventController implements IDayEventController {

    public scheduleEvent?: IHoundEvent;

    public getEventText(): string {
        if (!this.scheduleEvent) {
            return "";
        }

        return getTimePrepend(this.scheduleEvent) + " " + this.scheduleEvent.text;
    }

    public lookup() {
        if (!this.scheduleEvent) {
            return;
        }

        switch (this.scheduleEvent.type) {
            case DEFAULT.CONSTANTS.ARRIVING:
            case DEFAULT.CONSTANTS.DEPARTING:
            case DEFAULT.CONSTANTS.BOARDING:
            case DEFAULT.CONSTANTS.DAYCARE:
                // retrieveDog(this.scheduleEvent.id, this.cache.houndsConfig);
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
