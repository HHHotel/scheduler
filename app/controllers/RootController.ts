import { ILocationService, IIntervalService, IPromise } from "angular";
import { HoundsService } from "../services/Hounds.service";
import { HoundsSettings } from "../services/Settings.service";
import { IHoundDog, IScheduleEvent, IHoundEvent } from "@happyhoundhotel/hounds-ts";
import { SchedulerWeek } from "../services/Week.service";
import * as dates from "date-fns";

/** Root controller for the Hounds app */
export class RootController implements ng.IController {
    /** Declare dependencies for AngularJs injection */
    protected static $inject = [
        "$scope",
        "$location",
        "HoundsService",
        "WeekService",
        "HoundsSettings",
        "$interval"
    ];

    /** Variable to hold load interval */
    public loadInterval: IPromise<any>;

    constructor(
        private $scope: ng.IScope,
        private $location: ILocationService,
        private hounds: HoundsService,
        private week: SchedulerWeek,
        private $settings: HoundsSettings,
        private $interval: IIntervalService
    ) {
        // Check the authentication and logout if not valid
        this.hounds
        .checkAuth()
        .then(() => {
            this.$location.path("/main");

            /* Make sure you are unable to drag all the images */
            const images = document.querySelectorAll("img");
            images.forEach((img) => {
                img.ondragstart = () => false;
            });

            this.$scope.$apply();
        })
        .catch(() => {
            this.logout();
            this.$scope.$apply();
        });

        // Save settings before the window is closed
        window.addEventListener("beforeunload", () => {
            this.$settings.save();
            this.$interval.cancel(this.loadInterval);
        });

        this.loadInterval = this.$interval(() => {
            this.$scope.$broadcast("load");
        }, 5000); // Load data from API every 5 seconds
    }

    /**
     * Moves week to given date and loads from API
     * @param date date to jump to
     */
    public async jumpToWeek(date: Date | number) {
        date = new Date(date);
        this.week.advanceToDate(date);
        return this.hounds.load(this.week.getDay(0));
    }

    /**
     * Removes an event and loads the API
     * @param id id to remove
     */
    public removeEvent(id: string) {
        this.hounds.removeEvent(id);
    }

    /**
     * Retrieves a dog from the API and opens the dog profile modal
     * @param dogId id to lookup
     */
    public async dogLookup(dogId: string) {
        this.$scope.$broadcast("open-profile", dogId);
    }

    /**
     * Move the schedule to the week of this event
     * @param event event to go to
     */
    public goTo(event: IHoundEvent) {
        this.jumpToWeek(event.startDate).then(() => {
            const el = document.getElementById(event.id);
            if (el) {
                const opts: ScrollIntoViewOptions = {
                    behavior: "smooth",
                    block: "center",
                    inline: "start",
                };

                /* Can't use vanilla el.scrollIntoView because it was scrolling the body
                 * despite overflow being set to hidden, this library works fine */
                const scrollIntoView = require("scroll-into-view");
                scrollIntoView(el, {time: 150});
            }
        });

    }

    /**
     * Copys an event from the week view into the sidebar to edit
     * @param event to copy to sidebar
     */
    public eventCopy(event: IScheduleEvent) {
        const houndEvent: IHoundEvent = {
            startDate: event.startDate || new Date(),
            endDate: event.endDate || new Date(),
            ...event,
        }
        this.$settings.sidebarOpen = true;
        this.$scope.$broadcast("copy-event", houndEvent);
    }

    /**
     * Logsout of the application
     */
    public logout() {
        this.$location.path("/");
        this.$scope.$broadcast("logout");
        this.$interval.cancel(this.loadInterval);
        this.$scope.$apply();
    }

    /**
     * Gets a time stamp for the current time
     * @returns a date string for the current time
     */
    public getTimestamp(): string {
        return dates.format(new Date(), "MMM d @ hh:mm");
    }
}
