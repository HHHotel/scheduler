import { IHoundDog, IHoundBooking, DEFAULT, IHoundAPIDog,
     toApiEvent, editDog, removeEvent, removeDog, retrieveDog } from "@happyhoundhotel/hounds-ts";
import { IComponentController } from "angular";
import * as dates from "date-fns";

interface IHoundDogProfileController extends IComponentController {
    displayBooking(booking: IHoundBooking): string;
}

class SchedulerDogProfileController implements IHoundDogProfileController {

    public dogProfile?: IHoundDog;
    public bookingSearch: string = "";
    public editMode: boolean = false;

    public displayBooking(booking: IHoundBooking): string {
        if (!(booking.startDate instanceof Date)) { return ""; }

        const sameTOD = booking.startDate.getHours() >= 12 === booking.endDate.getHours() >= 12;

        switch (booking.type) {
            case DEFAULT.CONSTANTS.BOARDING:
                if (sameTOD) {
                    return dates.format(booking.startDate, "MM/d/y") + " - " +   dates.format(booking.endDate, "MM/d/y b");
                } else {
                    return dates.format(booking.startDate, "MM/d/y b") + " - " + dates.format(booking.endDate, "MM/d/y b");
                }
            case DEFAULT.CONSTANTS.DAYCARE:
                if (sameTOD) {
                    return dates.format(booking.startDate, "MM/d/y b");
                } else {
                    return dates.format(booking.startDate, "MM/d/y b") + " - " + dates.format(booking.endDate, "b");
                }
            default:
                return "Error";
        }
    }

    public exitProfile() {
        this.dogProfile = undefined;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class SchedulerDogProfileComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            dogProfile: "=",
        };
        this.controller = SchedulerDogProfileController;
        this.templateUrl = "views/templates/schedulerDogProfile.template.html";
    }

}
