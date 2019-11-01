import { IHoundDog, IHoundBooking, DEFAULT, IHoundAPIDog,
     toApiEvent, editDog, removeEvent, removeDog, retrieveDog } from "@happyhoundhotel/hounds-ts";

interface IHoundDogProfileBindings {
    dogProfile?: IHoundDog;
    bookingSearch: string;
    editMode: boolean;
}

interface IHoundDogProfileController extends IHoundDogProfileBindings {
    displayBooking(booking: IHoundBooking): string;
}

class SchedulerDogProfileController implements IHoundDogProfileController {

    public dogProfile?: IHoundDog;
    public bookingSearch: string = "";
    public editMode: boolean = false;

    public displayBooking(booking: IHoundBooking): string {
        if (!(booking.startDate instanceof Date)) { return ""; }

        function formatDate(date: Date) {
            return date.toDateString() + getAmPm(date);
        }

        function getAmPm(date: Date) {
            return date.getHours() < 12 ? " AM" : " PM";
        }

        switch (booking.type) {
            case DEFAULT.CONSTANTS.BOARDING:
                return formatDate(booking.startDate) + " - " + formatDate(booking.endDate);
            case DEFAULT.CONSTANTS.DAYCARE:
                // TODO format start and end time
                return formatDate(booking.startDate);
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
            removeEvent: "&",
            removeDog: "&",
            updateDogProfile: "&",
        };
        this.controller = SchedulerDogProfileController;
        this.templateUrl = "views/templates/schedulerDogProfile.template.html";
    }

}
