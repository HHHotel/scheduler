import { ILocationService, IIntervalService, IPromise } from "angular";
import { HoundsService } from "../services/Hounds.service";
import { HoundsSettings } from "../services/Settings.service";
import { IHoundDog, IHoundAuth, IScheduleEvent, getTimePrepend,
         retrieveDog, DEFAULT } from "@happyhoundhotel/hounds-ts";
import { compareAsc } from "date-fns";
import { SchedulerWeek } from "../services/Week.service";

export class RootController implements ng.IController {

    protected static $inject = ["$scope", "$location", "HoundsService", "WeekService", "HoundsSettings"];

    public dogProfile?: IHoundDog;
    public weekEvents: IScheduleEvent[][];

    constructor(private $scope: ng.IScope, private $location: ILocationService, private hounds: HoundsService,
                private week: SchedulerWeek, private $settings: HoundsSettings) {
        this.weekEvents = [[]];

        this.hounds.checkAuth().then(() => {
            this.$location.path("/main");
        }).catch(() => {
            this.$location.path("/");
        });

        window.addEventListener("beforeunload", () => {
            this.$settings.save();
        });
    }

    public jumpToWeek(date: Date) {
        this.week.advanceToDate(date);
        this.hounds.load(this.week.getDay(0));
    }

    public removeEvent(id: string) {
        this.hounds.removeEvent(id);
    }
    public async dogLookup(id: string) {
        this.dogProfile = await this.hounds.retrieveDog(id);
        this.$scope.$apply();
    }

    public saveProfile(dog: IHoundDog) {
        this.hounds.editDog(dog);
        this.hounds.load(this.week.getDay(0));
    }
}
