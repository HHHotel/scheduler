import { ILocationService, IIntervalService, IPromise } from "angular";
import { HoundsService } from "../services/Hounds.service";
import { HoundsSettings } from "../services/Settings.service";
import { IHoundDog, IHoundAuth, IScheduleEvent, getTimePrepend,
         retrieveDog, DEFAULT } from "@happyhoundhotel/hounds-ts";
import { compareAsc } from "date-fns";
import { SchedulerWeek } from "../services/Week.service";

export class RootController implements ng.IController {

    protected static $inject = ["$scope", "$location", "HoundsService", "WeekService", "HoundsSettings", "$interval"];

    public dogProfile?: IHoundDog;
    public weekEvents: IScheduleEvent[][];
    private loadInterval: IPromise<any>;

    constructor(private $scope: ng.IScope, private $location: ILocationService, private hounds: HoundsService,
                private week: SchedulerWeek, private $settings: HoundsSettings, private $interval: IIntervalService) {
        this.weekEvents = [[]];
        this.loadInterval = this.$interval(() => {
            this.hounds.load(this.week.getDay(0));
        }, 5000);
    }

    public $onDestroy() {
        this.$interval.cancel(this.loadInterval);
        this.$settings.save();
    }

    public $onInit() {
        this.hounds.checkAuth().then(() => {
            this.$location.path("/main");
        }).catch(() => {
            this.$location.path("/");
        });

        this.hounds.load(this.week.getDay(0));
    }

    public jumpToWeek(date: Date) {
        this.week.advanceToDate(date);
        this.hounds.load(date);
    }

    public removeEvent(id: string) {
        this.hounds.removeEvent(id);
    }

    public saveProfile(newDog: IHoundDog) {
        console.log(newDog);
    }

    public async dogLookup(id: string) {
        this.dogProfile = await this.hounds.retrieveDog(id);
        this.$scope.$apply();
    }

}
