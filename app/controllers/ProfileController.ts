import {
    IHoundDog,
    IHoundBooking,
    DEFAULT,
} from "@happyhoundhotel/hounds-ts";
import * as dates from "date-fns";
import { HoundsService } from "../services/Hounds.service";
import { SchedulerWeek } from "../services/Week.service";
import { HoundsSettings } from "../services/Settings.service";

/** AngularJs controller for the dog profile view */
export class ProfileController implements ng.IComponentController {

    /** Declare dependencies for AngularJs injection */
    protected static $inject = [
        "$scope",
        "HoundsService",
        "WeekService",
        "HoundsSettings"
    ];

    /** string to search dog bookings */
    public bookingSearch: string = "";
    /** boolean value for whether or not to edit the profile */
    public editMode: boolean = false;
    /** Object to store profile data about dog */
    public dogProfile?: IHoundDog = undefined;
    /** Object to store unedited dog profile */
    public oldDogProfile?: IHoundDog = undefined;

    constructor(
        private $scope: ng.IScope,
        private hounds: HoundsService,
        private week: SchedulerWeek,
        private $settings: HoundsSettings
    ) {

        const self = this;
        /** 
         * Updates the dogProfile from API
         * @param id dog id to retrieve
         */
        // tslint:disable-next-line: completed-docs
        async function updateProfile(id: string) {
            const newProfile = await hounds.retrieveDog(id);
            self.dogProfile = newProfile;
            self.oldDogProfile = newProfile;

            self.$scope.$apply();
        }

        this.$scope.$on("open-profile", (openEvent, dogId) => {
            updateProfile(dogId);
        });

        this.$scope.$on("load", () => {
            if(!this.editMode && this.dogProfile) {
                updateProfile(this.dogProfile.id);
            }
        });
    }

    /**
     * Gets a string for the given booking
     * @param booking booking to get string for
     * 
     * @returns string representing the booking
     */
    public displayBooking(booking: IHoundBooking): string {
        if (!(booking.startDate instanceof Date)) {
            return "";
        }

        const sameTOD =
            booking.startDate.getHours() >= 12 ===
            booking.endDate.getHours() >= 12;

        switch (booking.type) {
            case DEFAULT.CONSTANTS.BOARDING:
                if (sameTOD) {
                return (
                    dates.format(booking.startDate, "MM/d/y") +
                        " - " +
                        dates.format(booking.endDate, "MM/d/y b")
                );
            } else {
                return (
                    dates.format(booking.startDate, "MM/d/y b") +
                        " - " +
                        dates.format(booking.endDate, "MM/d/y b")
                );
            }
            case DEFAULT.CONSTANTS.DAYCARE:
                if (sameTOD) {
                return dates.format(booking.startDate, "MM/d/y b");
            } else {
                return (
                    dates.format(booking.startDate, "MM/d/y b") +
                        " - " +
                        dates.format(booking.endDate, "b")
                );
            }
            default:
                return "Error";
        }
    }

    /**
     * Tests if a given user should be shown the delete dog button
     * @param username username to test for 
     */
    public canShowDeleteButton(username: string) {
        const APPROVED_USERS = ["admin", "linda"];
        return APPROVED_USERS.indexOf(username.toLowerCase()) >= 0;
    }

    /**
     * Closes the dog profile popup
     */
    public closeDogProfile() {
        this.dogProfile = undefined;
        this.oldDogProfile = undefined;
        this.editMode = false;
        this.bookingSearch = "";
    }

    /**
     * Updates the API with the edited dogProfile information
     */
    public saveProfile() {
        if (!this.dogProfile || !this.oldDogProfile) { return; }

        this.hounds.editDog(this.dogProfile);
    }

    /**
     * Deletes a dog
     * @param id to delete
     */
    public deleteDog(id: string) {
        this.hounds.removeDog(id);
        this.closeDogProfile();
    }

    /**
     * Deletes an event 
     * @param id to delete
     */
    public removeEvent(id: string) {
        this.hounds.removeEvent(id);
    }

    /**
     * Deactivates a dog 
     * @param id to deactivate
     */
    public deactivate(id: string) {
        this.hounds.deactivateDog(id);
    }

    /**
     * reactivates a dog 
     * @param id to reactivate
     */
    public reactivate(id: string) {
        this.hounds.reactivateDog(id);
    }
}
