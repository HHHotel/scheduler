import { IScheduleEvent, IHoundDog, compareScheduleEvents } from "@happyhoundhotel/hounds-ts";

import { HoundsService } from "../services/Hounds.service";

import { SchedulerWeek } from "../services/Week.service";
import { ILocationService, IIntervalService, IPromise } from "angular";
import { HoundsSettings } from "../services/Settings.service";

export class WeekController implements ng.IController {

    protected static $inject = ["$scope", "HoundsService", "WeekService", "$location", "$interval", "HoundsSettings"];

    public events: IScheduleEvent[][];
    private loadInterval: IPromise<any>;

    constructor(private $scope: ng.IScope, private $hounds: HoundsService, private $week: SchedulerWeek,
                private $location: ILocationService, private $interval: IIntervalService,
                private $settings: HoundsSettings) {

        this.events = [[]];
        this.load();
        this.loadInterval = this.$interval(() => {
            this.load();
        }, 5000);

        window.addEventListener("beforeunload", () => {
            this.$interval.cancel(this.loadInterval);
        });
    }

    public dayEventComparator(a: any, b: any) {
        return compareScheduleEvents(a.value, b.value);
    }

    public nextWeek() {
        this.$week.nextWeek();
        this.load();
    }

    public prevWeek() {
        this.$week.prevWeek();
        this.load();
    }

    public load() {
        this.$hounds.getWeek(this.$week.getDay(0)).then((res) => {
            this.events = res;
            this.$scope.$apply();
        }).catch((err) => {
            this.$location.path("/");
        })
    }
}