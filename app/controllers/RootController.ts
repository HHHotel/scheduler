import { ILocationService } from "angular";
import { HoundsService } from "../services/Hounds.service";
import { HoundsSettings } from "../services/Settings.service";
import { IHoundDog, IHoundAuth, IScheduleEvent, getTimePrepend, retrieveDog, DEFAULT } from "@happyhoundhotel/hounds-ts";
import { compareAsc } from "date-fns";

interface IRootScope extends ng.IScope {
    root: any;
}

export class RootController {

    protected static $inject = ["$scope", "$location", "HoundsService", "HoundsSettings"];

    public dogProfile?: IHoundDog;

    constructor(private $scope: IRootScope, private $location: ILocationService, private hounds: HoundsService,
                private $settings: HoundsSettings) {

        window.addEventListener("beforeunload", () => {
            $settings.save();
        });

        hounds.checkAuth().then(() => {
            this.$location.path("/main");
        }).catch(() => {
            this.$location.path("/");
        }).finally(() => {
            $scope.$apply();
        });
    }

    public getEventText(event: IScheduleEvent) {
        if (!event.startDate || !event.endDate) {
            return event.text;
        }

        if (compareAsc(event.startDate, event.endDate) === 0) {
            if (event.type === DEFAULT.CONSTANTS.DAYCARE) {
                event.endDate.setHours(this.$settings.HOURS.CLOSING.PM);
            } else {
                event.endDate = new Date(event.startDate);
                const closingHour = event.startDate.getHours() < 12 ?
                        this.$settings.HOURS.CLOSING.AM : this.$settings.HOURS.CLOSING.PM;
                event.endDate.setHours(closingHour);
            }
        }

        return getTimePrepend(event) + " " + event.text;
    }

    public async dogLookup(id: string) {
        this.hounds.retrieveDog(id).then((dog) => {
            this.dogProfile = dog;
            this.$scope.$apply();
        });
    }
}
