import { ILocationService } from "angular";
import { HoundsService } from "../services/Hounds.service";
import { HoundsSettings } from "../services/Settings.service";
import { IHoundDog, IScheduleEvent } from "@happyhoundhotel/hounds-ts";
import { SchedulerWeek } from "../services/Week.service";

/** Root controller for the Hounds app */
export class RootController implements ng.IController {
    /** Declare dependencies for AngularJs injection */
    protected static $inject = [
        "$scope",
        "$location",
        "HoundsService",
        "WeekService",
        "HoundsSettings"
    ];

    /** Variable to hold dog profile data in */
    public dogProfile?: IHoundDog;

    constructor(
        private $scope: ng.IScope,
        private $location: ILocationService,
        private hounds: HoundsService,
        private week: SchedulerWeek,
        private $settings: HoundsSettings
    ) {
        // Check the authentication and logout if not valid
        this.hounds
            .checkAuth()
            .then(() => {
                this.$location.path("/main");
            })
            .catch(() => {
                this.$location.path("/");
            });

        // Save settings before the window is closed
        window.addEventListener("beforeunload", () => {
            this.$settings.save();
        });

        this.$scope.$on("load", () => {
            if (this.dogProfile) {
                this.dogLookup(this.dogProfile.id);
            }
        });
    }

    /**
     * Moves week to given date and loads from API
     * @param date date to jump to
     */
    public jumpToWeek(date: Date) {
        this.week.advanceToDate(date);
    }

    /**
     * Removes an event and loads the API
     * @param id id to remove
     */
    public removeEvent(id: string) {
        this.hounds.removeEvent(id);
    }

    /**
     * edit dog from the API
     * @param dog dog profile to pass to Hounds service
     */
    public saveProfile(dog: IHoundDog) {
        this.hounds.editDog(dog);
    }

    /**
     * Displays the dog profile of the id given
     * @param id dog id to get
     */
    public async dogLookup(id: string) {
        if (!id) {
            return;
        }

        this.dogProfile = await this.hounds.retrieveDog(id);
        this.$scope.$apply();
    }

    /**
     * Logsout of the application
     */
    public logout() {
        this.$location.path("/");
        this.$scope.$broadcast("logout");
    }
}
