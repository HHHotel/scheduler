import * as ctrls from "./controllers/SchedulerControllers";
import { ApiService } from "./services/Api.service";
import { DEFAULT, saveSettings, Settings } from "./default";
import { EventData } from "./services/EventData.service";
import { IHttpService, ILocationService, module } from "angular";
import { SchedulerWeek } from "./services/Week.service";
import { SchedulerService } from "./services/Scheduler.service";
import { DayEventComponent } from "./components/dayEvent.component";

// tslint:disable-next-line: no-var-requires
module(DEFAULT.MAIN_PKG, [require("angular-route")]).config(($routeProvider: ng.route.IRouteProvider) => {
    $routeProvider
        .when("/", {
            templateUrl: "views/login.html",
        })
        .when("/main", {
            templateUrl: "views/main.html",
        });
});

module(DEFAULT.MAIN_PKG).factory("Api", ["$http", (http: IHttpService) => new ApiService(http)]);

module(DEFAULT.MAIN_PKG).factory("Week", () => new SchedulerWeek(new Date()));

module(DEFAULT.MAIN_PKG).factory("EventData", [ "Week", (week: SchedulerWeek) => new EventData(week)]);

module(DEFAULT.MAIN_PKG).factory("$Scheduler", [
    "Week",
    "Api",
    "EventData",
    "$location",
    (week: SchedulerWeek, api: ApiService, eventData: EventData, $location: ILocationService) =>
        new SchedulerService(week, api, eventData, $location),
]);

module(DEFAULT.MAIN_PKG)
    .controller("loginCtrl", [
        "$scope",
        "$location",
        "$Scheduler",
        ctrls.LoginController,
    ]);

module(DEFAULT.MAIN_PKG)
    .controller("schedCtrl", [
        "$scope",
        "$rootScope",
        "$Scheduler",
        ctrls.SchedulerController,
    ]);

module(DEFAULT.MAIN_PKG).controller("sidebarCtrl", [
    "$scope",
    "$rootScope",
    "$Scheduler",
    ctrls.SidebarController,
]);

module(DEFAULT.MAIN_PKG).component("dayEvent", new DayEventComponent());

import { BrowserWindow } from "electron";

module(DEFAULT.MAIN_PKG)
    .controller("titleBar", [
        "$scope",
        ($scope) => {
            $scope.minimize = () => {
                const win = BrowserWindow.getFocusedWindow();
                if (win) {
                    win.minimize();
                }
            };

            $scope.maximize = () => {
                const win = BrowserWindow.getFocusedWindow();
                if (win && win.isMaximized()) {
                    win.unmaximize();
                } else if (win) {
                    win.maximize();
                }
            };

            $scope.close = () => {
                const win = BrowserWindow.getFocusedWindow();
                if (win) {
                    win.close();
                }
                saveSettings();
            };

}]);
