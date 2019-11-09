import {
    IScheduleEvent,
    compareScheduleEvents,
    getTimePrepend,
    DEFAULT
} from "@happyhoundhotel/hounds-ts";
import { HoundsService } from "../services/Hounds.service";
import { SchedulerWeek } from "../services/Week.service";
import { HoundsSettings } from "../services/Settings.service";
import * as dates from "date-fns";
import { IIntervalService, IPromise, ILocationService } from "angular";

/** Angular controller for base view of the Hounds app */
export class WeekController implements ng.IController {
    /** AngularJs dependency injection declaration */
    protected static $inject = [
        "$scope",
        "HoundsService",
        "WeekService",
        "HoundsSettings",
        "$interval",
        "$location"
    ];

    /** interval for loading data for the API */
    private loadInterval: IPromise<any>;

    constructor(
        private $scope: ng.IScope,
        public hounds: HoundsService,
        private week: SchedulerWeek,
        private $settings: HoundsSettings,
        private $interval: IIntervalService,
        private $location: ILocationService
    ) {
        this.loadInterval = this.$interval(() => {
            this.$scope.$emit("load");
        }, 5000); // Load data from API every 5 seconds

        window.addEventListener("beforeunload", () => {
            this.$interval.cancel(this.loadInterval); // Cancel the load interval on close
        });

        this.$scope.$on("logout", () => {
            this.$interval.cancel(this.loadInterval);
        });

        this.$scope.$on("load", async () => {
            try {
                await this.hounds.load(this.week.getDay(0));
            } catch (err) {
                alert("An error has occured loading the week");
                this.$location.path("/");
                this.$interval.cancel(this.loadInterval);
                this.$scope.$apply();
            }
        });

        this.$scope.$emit("load");
    }

    /** Comparator to compare two events inside a day */
    public dayEventComparator(a: any, b: any) {
        return compareScheduleEvents(a.value, b.value);
    }

    /** Advance to the next week and load data */
    public nextWeek() {
        this.week.nextWeek();
        this.$scope.$emit("load");
    }

    /** Go to the previous week and load data */
    public prevWeek() {
        this.week.prevWeek();
        this.$scope.$emit("load");
    }

    /**
     * Get the text from an event to display inside a day
     * @param event Schedule event to get text
     *
     * @returns string to put in day
     */
    public getEventText(event: IScheduleEvent): string {
        if (!event.startDate || !event.endDate) {
            return event.text;
        }

        const startHour = event.startDate.getHours();
        const openingAm = this.$settings.HOURS.OPENING.AM;
        const closingAm = this.$settings.HOURS.CLOSING.AM;
        const openingPm = this.$settings.HOURS.OPENING.PM;
        const closingPm = this.$settings.HOURS.CLOSING.PM;

        // When there is no end time information set it to the closing hours
        if (dates.compareAsc(event.startDate, event.endDate) === 0) {
            if (event.type === DEFAULT.CONSTANTS.DAYCARE) {
                event.endDate.setHours(closingPm);
            } else if (
                this.isInInterval(startHour, openingAm, closingAm) ||
                this.isInInterval(startHour, openingPm, closingPm)
            ) {
                event.endDate = new Date(event.startDate);
                const closingHour =
                    event.startDate.getHours() < 12
                        ? this.$settings.HOURS.CLOSING.AM
                        : this.$settings.HOURS.CLOSING.PM;
                event.endDate.setHours(closingHour);
            }
        }

        // Call hounds library to retrieve time prepend
        return getTimePrepend(event) + " " + event.text;
    }

    /**
     * Returns whether or not x is in interval [a, b] inclusive
     * @param x number to check
     * @param a lower bound
     * @param b upper bound
     */
    private isInInterval(x: number, a: number, b: number): boolean {
        if (a === b) {
            return false;
        } else if (a > b) {
            const temp = b;
            b = a;
            a = temp;
        }

        return x >= a && x <= b;
    }
}
