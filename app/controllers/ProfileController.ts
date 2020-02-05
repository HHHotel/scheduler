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

    constructor(
        private $scope: ng.IScope,
        private hounds: HoundsService,
        private week: SchedulerWeek,
        private $settings: HoundsSettings
    ) {
        this.$scope.$on("profile-close", () => {
            this.editMode = false;
            this.bookingSearch = "";
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
     * Deactivates a dog 
     * @param id to deactivate
     */
    public deactivate(id: string) {
        this.hounds.deactivateDog(id);
    }
}
