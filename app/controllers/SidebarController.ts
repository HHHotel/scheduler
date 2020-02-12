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
    public repeatOptions: IRepeatOptions;
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
        this.repeatOptions = {
            stopDate: undefined as any,
            frequency: "daily",
            showRepeat: false,
        };

        this.searchEvents = [];

        this.$scope.$on("load", async () => {
            this.searchEvents = await this.hounds.findEvents(this.searchText);
        });

        this.$scope.$on("copy-event", (ev, data: IHoundEvent) => {
            this.index = 1;
            const time = dates.differenceInMilliseconds(
                data.endDate,
                dates.startOfDay(data.endDate),
            );
            data.endDate = dates.addMilliseconds(new Date("1-1-1970"), time);
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
        this.clearSidebar();
    }

    /**
     * Checks that all required event details are present
     * and returns a new event with properly formatted dates
     * @param event
     * @returns {IHoundEvent} null when there is insufficent detail
     */
    public prepareEvent(event: IHoundEvent): IHoundEvent | null {
        if (!event || !event.type) {
            alert("Please enter all details");
            return null;
        }

        let eventDuration = 0;
        if (event.type !== DEFAULT.CONSTANTS.BOARDING) {
            const startTime = dates.differenceInMilliseconds(
                event.startDate,
                dates.startOfDay(event.startDate),
            );
            const endTime = dates.differenceInMilliseconds(
                event.endDate,
                dates.startOfDay(event.endDate),
            );
            eventDuration = endTime - startTime;
        } else {
            eventDuration = dates.differenceInMilliseconds(
                event.endDate,
                event.startDate,
            );
        }

        if (eventDuration < 0) {
            alert("Please enter a valid end time");
            return null;
        }

        return {
            text: event.text,
            type: event.type,
            id: event.id,
            startDate: event.startDate,
            endDate: dates.addMilliseconds(event.startDate, eventDuration),
        };
    } 

    /**
     * Adds a new event using the API
     * @param newEvent event to add
     */
    public async addEvent(event: IHoundEvent) {
        const newEvent = this.prepareEvent(event);
        if (!newEvent || !newEvent.text) {
            alert("Please enter all details");
            return;
        }

        if (newEvent.id) {
            const res = await this.hounds.removeEvent(newEvent.id);
            newEvent.id = "";
        }

        this.hounds.addEvent(newEvent);
        this.clearSidebar();
    }

    /**
     * Adds a new booking using the API allowing repeating given the options
     * @param newBooking booking to add
     * @param repeatOptions repeat options for the booking
     */
    public addBooking(booking: IHoundBooking, repeatOptions?: IRepeatOptions) {
        const newBooking = this.prepareEvent(booking) as IHoundBooking;
        if (!booking.dogId) {
            alert("Please pick a dog for this booking");
            return;
        }
        newBooking.id = booking.dogId; // Overwrite id field with dogId
        // It will get a unique id serverside

        if (!repeatOptions || !repeatOptions.stopDate || !repeatOptions.frequency) { // Booking is not repeated
            this.hounds.addEvent(newBooking);
        } else { // Booking is repeated
            const allowedFrequencies = ["daily", "weekly", "monthly", "yearly"];
            if (allowedFrequencies.indexOf(repeatOptions.frequency) < 0) {
                alert("Please enter a repeat frequency");
                return;
            }

            const bookingDuration = dates.differenceInMilliseconds(
                newBooking.endDate, // end - start
                newBooking.startDate
            );

            getIntervalDates(
                newBooking.startDate,
                repeatOptions.stopDate,
                repeatOptions.frequency,
            ).map((date) => { // Create an array of IHoundBooking
                return { 
                    ...newBooking,
                    startDate: date, // Set start and end dates properly
                    endDate: new Date(date.valueOf() + bookingDuration),
                };
            }).forEach((intervalBooking) => { // add each event to api
                this.hounds.addEvent(intervalBooking);
            });

        }

        this.clearSidebar();

        /**
         * Get an array of dates for each type of increment from start to end inclusive
         * @param start Date
         * @param end Date
         * @param repeatType 'daily' | 'weekly' | 'monthly' | 'yearly'
         */
        // tslint:disable-next-line: completed-docs
        function getIntervalDates(start: Date, end: Date, repeatType: string): Date[] {
            // tslint:disable-next-line: completed-docs
            function incrementDate(date: Date) {
                switch (repeatType) {
                    case "daily":
                        return dates.addDays(date, 1);
                    case "weekly":
                        return dates.addWeeks(date, 1);
                    case "monthly":
                        return dates.addMonths(date, 1);
                    case "yearly":
                        return dates.addYears(date, 1);
                    default:
                        return dates.addDays(date, 1);
                }
            }

            let d0 = new Date(start);
            const datesInterval: Date[] = [d0];
            while(dates.differenceInCalendarDays(end, d0) > 0) {
                d0 = incrementDate(d0);
                datesInterval.push(d0);
            }
            return datesInterval;
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
        this.clearSidebar();
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
        this.clearSidebar();
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

        this.clearSidebar();
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
            startDate: undefined as any as Date,
            endDate: undefined as any as Date, // Needs to be the same as the
            id: "",
            type: "boarding",
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

    /**
     * Clears all the fields in this object
     */
    private clearSidebar() {
        this.newUser = {
            username: "",
            password: "",
            permissionsLevel: 0
        };
        this.booking = this.zeroBooking();
        this.repeatOptions = {
            stopDate: undefined as any,
            frequency: "daily",
            showRepeat: false,
        };
        this.dog = this.zeroDog();
        this.event = this.zeroEvent();
    }
}
