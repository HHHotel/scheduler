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
    public repeatOptions: IRepeatOptions = {
        showRepeat: false,
        stopDate: new Date(),
        frequency: "daily"
    };
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
        this.hounds.addEvent(newEvent);
        this.event = this.zeroEvent();
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
        this.hounds.load(date);
    }

    public eventSearchComparator(a: any, b: any) {
        if (a.value.type === DEFAULT.CONSTANTS.DOG) {
            return 1;
        } else if (b.value.type === DEFAULT.CONSTANTS.DOG) {
            return -1;
        } else {
            return a.value.startDate < b.value.startDate ? -1 : 1;
        }
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
            endDate: new Date(new Date().toDateString()),
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
