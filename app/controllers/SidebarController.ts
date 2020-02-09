import {
    DEFAULT,
    IHoundBooking,
    IHoundDog,
    IHoundEvent
} from "@happyhoundhotel/hounds-ts";
import { HoundsService } from "../services/Hounds.service";
import { SchedulerWeek } from "../services/Week.service";

import * as dates from "date-fns";
import { HoundsSettings } from "../services/Settings.service";

const START_OF_TIME = new Date(new Date().toDateString()).valueOf(); // Used for time inputs for event forms

interface IRepeatOptions {
    /** model for whether or not to show the repeat options forms */
    showRepeat: boolean;
    /** Date to repeat booking to, inclusive */
    stopDate: Date;
    /**
     * frequency string to describe how to repeat
     * i.e. "daily", "weekly"
     */
    frequency: string;
}

/**
 * Controller for the sidebar
 */
export class SidebarController {
    /** Declare dependencies for AngularJs injection */
    protected static $inject = [
        "$scope",
        "HoundsService",
        "HoundsSettings",
        "WeekService"
    ];

    /** index of tab for sidebar view */
    public index: number = 0;
    /** model for new user form */
    public newUser = {
        username: "",
        password: "",
        permissionsLevel: 0
    };

    /** model for new booking form */
    public booking: IHoundBooking;
    /** repeat options for Daycare event */
    public repeatOptions?: IRepeatOptions = undefined;
    /** model for new dog form */
    public dog: IHoundDog;
    /** model for new event form */
    public event: IHoundEvent;
    /** model for the search events */
    public searchEvents: IHoundEvent | IHoundDog[];
    /** model for search text in search view and booking view */
    public searchText: string = "";

    constructor(
        private $scope: ng.IScope,
        private hounds: HoundsService,
        private $settings: HoundsSettings,
        private $week: SchedulerWeek
    ) {
        this.dog = this.zeroDog();
        this.event = this.zeroEvent();
        this.booking = this.zeroBooking();

        this.searchEvents = [];

        this.$scope.$on("load", async () => {
            this.searchEvents = await this.hounds.findEvents(this.searchText);
        });

        this.$scope.$on("copy-event", (ev, data: IHoundEvent) => {
            this.index = 1;
            const time = data.endDate.valueOf() - new Date(data.endDate.toDateString()).valueOf();
            data.endDate = new Date(START_OF_TIME + time);
            this.event = data;
        });
    }

    /**
     * Uses api to add a new dog
     * @param newDog dog to add
     */
    public addDog(newDog: IHoundDog) {
        if (!newDog || !newDog.name || !newDog.clientName) {
            alert("Please enter all details");
            return;
        }
        this.hounds.addDog(newDog);
        this.dog = this.zeroDog();
    }

    /**
     * Adds a new event using the API
     * @param newEvent event to add
     */
    public async addEvent(newEvent: IHoundEvent) {
        if (!newEvent || !newEvent.text || !newEvent.type) {
            alert("Please enter all details");
            return;
        }

        const newEventDuration = this.getDurationFromTimeInput(
            newEvent.startDate,
            newEvent.endDate
        );

        if (newEventDuration < 0) {
            alert("Please enter a valid end time");
            return;
        }

        newEvent.endDate = new Date(
            newEvent.startDate.valueOf() + newEventDuration
        );

        if (newEvent.id) {
            const res = await this.hounds.removeEvent(newEvent.id);
            newEvent.id = "";
        }

        this.hounds.addEvent(newEvent);
        this.event = this.zeroEvent();
    }

    /**
     * Adds a new booking using the API allowing repeating given the options
     * @param newBooking booking to add
     * @param repeatOptions repeat options for the booking
     */
    public addBooking(
        newBooking: IHoundBooking,
        repeatOptions: IRepeatOptions
    ) {
        if ( !newBooking || !newBooking.id || !newBooking.startDate || !newBooking.endDate || !newBooking.type) {
            alert("Insufficent newBooking details");
            return;
        }

        const newBookingDuration = this.getDurationFromTimeInput(
            newBooking.startDate,
            newBooking.endDate
        );

        if (newBookingDuration < 0) {
            alert("Please enter a valid end time");
            return;
        }

        if (repeatOptions && repeatOptions.stopDate) {
            const allowedFrequencies = ["daily", "weekly", "monthly", "yearly"];
            if (allowedFrequencies.indexOf(repeatOptions.frequency) < 0) {
                alert("Please enter a repeat frequency");
                return;
            }

            addEventUntil(
                newBooking,
                newBookingDuration,
                repeatOptions,
                this.hounds
            );
        } else {
            if (newBooking.type !== DEFAULT.CONSTANTS.BOARDING) {
                newBooking.endDate = new Date(
                    newBooking.startDate.valueOf() + newBookingDuration
                );
            }
            this.hounds.addEvent(newBooking);
        }

        this.booking = this.zeroBooking();

        /**
         * Repeats an event until stop date, inclusive, using the increment
         * to add each thing
         * @param baseEvent Event details to repeat
         * @param duration duration is the event end - event start
         * @param stopDate date to stop repeating on, inclusive
         * @param increment milliseconds to add to end and start dates
         * @param houndsService API service to add event to
         */
        // tslint:disable-next-line: completed-docs
        function addEventUntil(
            baseEvent: IHoundEvent,
            duration: number,
            repeatOpts: IRepeatOptions,
            houndsService: HoundsService
        ) {

            /**
             * Returns a new date increased by the amount describe by the incString
             * @param d0 date to increment
             * @param incString string that describes how to increment the date
             *        options are [ daily | weekly | monthly | yearly ] case-insensitive
             *        Returns null if incString is not one of those options
             * @returns an incremented date
             */
            // tslint:disable-next-line: completed-docs
            function incrementDate(d0: Date, incString: string): Date | null {
                incString = incString.toLowerCase();
                switch(incString) {
                    case "daily":
                        return dates.addDays(d0, 1);
                    case "weekly":
                        return dates.addDays(d0, 7);
                    case "monthly":
                        return dates.addMonths(d0, 1);
                    case "yearly":
                        return dates.addYears(d0, 1);
                }

                return null;
            }

            let currentDate: Date = baseEvent.startDate;
            while(dates.differenceInDays(currentDate, repeatOpts.stopDate) <= 0) {
                const newEvent = {
                    ...baseEvent,
                    startDate:  new Date(currentDate),
                    endDate: new Date(currentDate.valueOf() + duration),
                };
                houndsService.addEvent(newEvent);

                const nextDate = incrementDate(currentDate, repeatOptions.frequency);
                if (!nextDate) { break; }
                currentDate = nextDate;

            }
        }
    }

    /**
     * Formats the date of events in event search
     * @param date date to format
     */
    public formatDate(date: Date) {
        if (!date) {
            return "";
        }

        return dates.format(date, "MMM d y a");
    }

    /**
     * Find events and dogs given the search text
     * @param searchText
     */
    public async findEvents(searchText: string) {
        this.searchEvents = await this.hounds.findEvents(searchText);
        this.$scope.$apply();
    }

    /**
     * Opens the print dialoge for current week
     */
    public printSchedule() {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("print-schedule");
    }

    /**
     * Advances the week to the date given and reloads the API data
     * @param date date to move to
     */
    public advanceToDate(date: Date) {
        this.$week.advanceToDate(date);
        this.hounds.load(this.$week.getDay(0));
    }

    /**
     * Returns 1 if a is greater than b, -1 if b > a
     * @param a
     * @param b
     *
     * Used to sort events in search view
     */
    public eventSearchComparator(a: any, b: any) {
        if (a.value.name) {
            // if a is a dog object
            return 1;
        } else if (b.value.name) {
            // if b is a dog object
            return -1;
        } else {
            // compare on the value of the start date
            return a.value.startDate < b.value.startDate ? -1 : 1;
        }
    }

    /**
     * Adds a user to the API
     * @param username
     * @param password
     * @param permissionType string representing the level of permissions for the new user
     */
    public addUser(username: string, password: string, permissionType: string) {
        if (!username || !password || !permissionType) {
            alert("Please enter all details");
            return;
        }

        const permissions = DEFAULT.CONSTANTS.USER_CONSTANT[permissionType];
        this.hounds.addUser(username, password, permissions);
    }

    /**
     * Deletes a user from the API
     * @param username username to delete
     */
    public deleteUser(username: string) {
        if (!username) {
            alert("Please enter all details");
            return;
        }

        this.hounds.deleteUser(username);
    }

    /**
     * Changes the current user's password
     * @param oldPassword
     * @param newPassword
     */
    public changePassword(oldPassword: string, newPassword: string) {
        if (!oldPassword || !newPassword) {
            alert("Please enter all details");
            return;
        }

        this.hounds.changePassword(
            this.$settings.apiConfig.apiAuth.username,
            oldPassword,
            newPassword
        );
    }

    /**
     * Gets the end date from the input type time
     * @param startDate startDate to get
     * @param endDate date object that is initalized to a known value
     *                and then subtracted from that value to get the time info
     */
    private getDurationFromTimeInput(startDate: Date, endDate: Date) {
        if (dates.isSameDay(startDate, endDate)) {
            return -1;
        }

        const startTime =
            startDate.valueOf() -
            new Date(startDate.toLocaleDateString()).valueOf();
        const endTime = endDate.valueOf() - START_OF_TIME;

        const newBookingDuration = endTime - startTime;

        if (newBookingDuration < 0) {
            return -1;
        }

        return newBookingDuration;
    }

    /**
     * Gets an empty dog
     * @returns an empty IHoundDog object
     */
    private zeroDog(): IHoundDog {
        return {
            activeClient: true,
            name: "",
            clientName: "",
            id: "",
            bookings: []
        };
    }

    /**
     * Gets an empty Hound event
     * @returns an empty IHoundEvent
     */
    private zeroEvent(): IHoundEvent {
        return {
            startDate: new Date(new Date().toDateString()),
            endDate: new Date(START_OF_TIME), // Needs to be the same as the
            id: "",
            type: "",
            text: ""
        };
    }

    /**
     * Gets an empty booking event
     * @returns and empty IHoundBooking
     */
    private zeroBooking(): IHoundBooking {
        return {
            ...this.zeroEvent(),
            dogId: "",
        };
    }
}
