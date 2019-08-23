import { module } from "angular";

export interface IDayEvent {
    text: string;
    type: string;
    id: string;
    date: Date;
}

class DayEventController {

    private event: IDayEvent;

    constructor(event: IDayEvent) {
        "ngInject";

        this.event = event;
    }

    public getEventText() {

        const date: Date | null = this.event.date ? new Date(this.event.date) : null;
        const text = this.event.text;

        if (date) {

            const hours = convertHours(date.getHours());
            // let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

            return "(" + hours + getClosing(date) + getTimeExtension(date) + ") " + text;

        } else {
            return text;
        }
    }
}

module(DEFUALT.MAIN_PKG).component("dayEvent", {
    bindings: {
        event: "<",
    },
    controller: DayEventController,
    template: `<pre ng-click = "$ctrl.lookup($ctrl.event)" class = "{{$ctrl.event.type}}" id = "{{$ctrl.event.id}}">
        $ctrl.getEventText()
    </pre> `,
});

function getClosing(date) {
    if (date.getHours() === Settings.OPENING_HOUR_AM || date.getHours() === Settings.OPENING_HOUR_PM) {
        return "-" + (date.getHours() >= 12 ? convertHours(Settings.CLOSING_HOUR_PM) : 
        convertHours(Settings.CLOSING_HOUR_AM));
    } else {
        return ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    }
}

function getTimeExtension(date) {
    return !Settings.TWENTY_FOUR_HOUR ? getAmPm(date) : "";
}

function getAmPm(date) {
    return date.getHours() >= 12 ? " PM" : " AM";
}

function convertHours(hours) {
    return !Settings.TWENTY_FOUR_HOUR ? hours <= 12 ? hours : hours - 12 : hours;
}
