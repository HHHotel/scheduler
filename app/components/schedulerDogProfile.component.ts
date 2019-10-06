import { DEFAULT } from "../default";
import * as HHH from "../types/HHHTypes";
import * as API from "../types/HHHAPITypes";
import { SchedulerService } from "../services/Scheduler.service";
import { EventData } from "../services/EventData.service";

interface ISchedulerDogProfileBindings {
    dogProfile?: HHH.ISchedulerDog;
    bookingSearch: string;
    editMode: boolean;
    $Scheduler: SchedulerService;
}

interface ISchedulerDogProfileController extends ISchedulerDogProfileBindings {
    displayBooking(booking: HHH.ISchedulerBooking): string;
    saveProfile(): void;
    exitProfile(): void;
}

class SchedulerDogProfileController implements ISchedulerDogProfileController {

    public dogProfile?: HHH.ISchedulerDog;
    public bookingSearch: string = "";
    public editMode: boolean = false;
    public $Scheduler: SchedulerService;

    constructor($Scheduler: SchedulerService) {
        this.$Scheduler = $Scheduler;
    }

    public displayBooking(booking: HHH.ISchedulerBooking): string {
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

    public saveProfile(): void {
        if (!this.dogProfile) {
            return;
        }

        const newDog: API.ISchedulerApiDog = {
            bookings: [],
            clientName: this.dogProfile.clientName,
            id: this.dogProfile.id,
            name: this.dogProfile.name,
        };

        for (const booking of this.dogProfile.bookings) {
            try {
                newDog.bookings.push(EventData.toApiEvent(booking));
            } catch (e) {
                alert("Invalid Date: " + e.message);
            }
        }

        if (newDog.name && newDog.clientName) {
            this.$Scheduler.editDog(newDog, () => {
                this.updateDogProfile();
            });
        } else {
            alert("Error: Details not provided");
        }

    }

    public exitProfile() {
        this.$Scheduler.cache.dogProfile = null;
    }

    public removeEvent(id: string) {
        this.$Scheduler.removeEvent(id, () => this.updateDogProfile());
    }

    public removeDog(id: string) {
        this.$Scheduler.removeDog(id, () => {
            this.$Scheduler.cache.dogProfile = null;
        });
    }

    private updateDogProfile() {
        if (this.dogProfile) {
            this.$Scheduler.retrieveDog(this.dogProfile.id);
        }
    }

}

// tslint:disable-next-line: max-classes-per-file
export class SchedulerDogProfileComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            dogProfile: "<",
        };
        this.controller = SchedulerDogProfileController;
        this.templateUrl = "views/templates/schedulerDogProfile.template.html";
    }

}
