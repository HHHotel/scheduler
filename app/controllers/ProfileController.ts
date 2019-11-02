import {
    IHoundDog,
    IHoundBooking,
    DEFAULT,
} from "@happyhoundhotel/hounds-ts";
import * as dates from "date-fns";
import { HoundsService } from "../services/Hounds.service";
import { SchedulerWeek } from "../services/Week.service";
import { HoundsSettings } from "../services/Settings.service";

export class ProfileController implements ng.IComponentController {
    protected static $inject = [
        "$scope",
        "HoundsService",
        "WeekService",
        "HoundsSettings"
    ];

    public bookingSearch: string = "";
    public editMode: boolean = false;

    constructor(
        private $scope: ng.IScope,
        private hounds: HoundsService,
        private week: SchedulerWeek,
        private $settings: HoundsSettings
    ) {}

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
}
