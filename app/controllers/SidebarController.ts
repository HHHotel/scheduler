import {
    DEFAULT,
    IHoundUser,
    toApiDog,
    IHoundBooking,
    IHoundDog,
    IHoundEvent,
    toApiEvent
} from "@happyhoundhotel/hounds-ts";
import { HoundsSettings } from "../services/Settings.service";
import { HoundsService } from "../services/Hounds.service";
import { SchedulerWeek } from "../services/Week.service";

import * as dates from "date-fns";

const START_OF_TIME = new Date("1/1/1970").valueOf(); // Used for time inputs for event forms

interface IRepeatOptions {
    showRepeat: boolean;
    stopDate: Date;
    frequency: string;
}

export class SidebarController {
    protected static $inject = [
        "$scope",
        "HoundsSettings",
        "HoundsService",
        "WeekService"
    ];

    public index: number = 0;
    public newUser = {
        username: "",
        password: "",
        permissionsLevel: 0
    };

    public booking: IHoundBooking;
    public repeatOptions?: IRepeatOptions = undefined;
    public dog: IHoundDog;
    public event: IHoundEvent;
    public searchEvents: IHoundEvent | IHoundDog[];
    public searchText: string = "";

    constructor(
        private $scope: ng.IScope,
        private $settings: HoundsSettings,
        private hounds: HoundsService,
        private $week: SchedulerWeek
    ) {
        this.dog = this.zeroDog();
        this.event = this.zeroEvent();
        this.booking = this.zeroBooking();

        this.searchEvents = [];
    }

    public addDog(newDog: IHoundDog) {
        this.hounds.addDog(toApiDog(newDog));
        this.dog = this.zeroDog();
    }

    public addEvent(newEvent: IHoundEvent) {
        const newEventDuration = this.getEndDateFromTime(newEvent.startDate, newEvent.endDate);

        if (newEventDuration < 0) {
            alert("Please enter a valid end time")
            return;
        }

        newEvent.endDate = new Date(newEvent.startDate.valueOf() + newEventDuration);

        this.hounds.addEvent(newEvent);
        this.event = this.zeroEvent();
    }

    public addBooking(newBooking: IHoundBooking, repeatOptions: IRepeatOptions) {
        if (
            !newBooking ||
            !newBooking.id ||
            !newBooking.startDate ||
            !newBooking.endDate || 
            !newBooking.type
        ) {
            alert("Insufficent newBooking details");
            return;
        }

        const newBookingDuration = this.getEndDateFromTime(newBooking.startDate, newBooking.endDate);

        if (newBookingDuration < 0) {
            alert("Please enter a valid end time")
            return;
        }

        if (repeatOptions && repeatOptions.stopDate) {
            const inc = getRepeatIncrement(repeatOptions.frequency);
            if (inc < 0) {
                alert("Enter repeat frequency");
                return;
            }

            addEventUntil(newBooking, newBookingDuration, repeatOptions.stopDate, inc);
        } else {
            if (newBooking.type !== DEFAULT.CONSTANTS.BOARDING) {
                newBooking.endDate = new Date(
                    newBooking.startDate.valueOf() + newBookingDuration
                );
            }
            this.hounds.addEvent(newBooking);
        }

        this.booking = this.zeroBooking();

        /* End Of Function */

        function getRepeatIncrement(repeatOpt: string) {
            const DAILY_INC = 86400000; // 24 * 60 * 60 * 1000
            const WEEKLY_INC = 604800000; // 7 * 24 * ...
            switch (repeatOpt) {
                case "daily":
                    return DAILY_INC;
                case "weekly":
                    return WEEKLY_INC;
                default:
                    return -1;
            }
        }

        const self = this;

        function addEventUntil(
            baseEvent: IHoundEvent,
            duration: number,
            stopDate: any,
            increment: number
        ) {
            for (
                let i = newBooking.startDate.valueOf();
                i < stopDate.valueOf() + increment;
                i += increment
            ) {
                baseEvent.startDate = new Date(i);
                baseEvent.endDate = new Date(i + duration);
                self.hounds.addEvent(baseEvent);
            }
        }
    }

    public formatDate(date: Date) {
        if (!date) {
            return "";
        }

        return dates.format(date, "MMM d y a");
    }

    public async findEvents(searchText: string) {
        this.searchEvents = await this.hounds.findEvents(searchText);
        this.$scope.$apply();
    }

    public printSchedule() {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("print-schedule");
    }

    public advanceToDate(date: Date) {
        this.$week.advanceToDate(date);
        this.hounds.load(this.$week.getDay(0));
    }

    public eventSearchComparator(a: any, b: any) {
        if (a.value.name) {
            return 1;
        } else if (b.value.name) {
            return -1;
        } else {
            return a.value.startDate < b.value.startDate ? -1 : 1;
        }
    }

    // TODO check that endDate is in the same day as star 
    private getEndDateFromTime(startDate: Date, endDate: Date) {
        const startTime =
            startDate.valueOf() -
            new Date(startDate.toLocaleDateString()).valueOf();
        const endTime =
            endDate.valueOf() - START_OF_TIME;

        const newBookingDuration = endTime - startTime;

        if (newBookingDuration < 0) {
            return -1;
        }

        return newBookingDuration;
    }

    private clearForm() {
        this.dog = this.zeroDog();
        this.event = this.zeroEvent();
        this.booking = this.zeroBooking();
    }

    private zeroDog(): IHoundDog {
        return {
            name: "",
            clientName: "",
            id: "",
            bookings: []
        };
    }

    private zeroEvent(): IHoundEvent {
        return {
            startDate: new Date(new Date().toDateString()),
            endDate: new Date(START_OF_TIME), // Needs to be the same as the 
            id: "",
            type: "",
            text: ""
        };
    }
    private zeroBooking(): IHoundBooking {
        return {
            ...this.zeroEvent(),
            dogId: "",
            dogName: "",
            clientName: ""
        };
    }
}