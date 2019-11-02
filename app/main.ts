import { remote } from "electron";

import * as ctrls from "./controllers/controllers";
import { module, IRootScopeService } from "angular";
import ngroute from "angular-route";
import { HoundsService } from "./services/Hounds.service";
import { SchedulerWeek } from "./services/Week.service";
import { HoundsSettings, HOUNDS_MAIN_PKG, HOUNDS_API_VERSION } from "./services/Settings.service";

module(HOUNDS_MAIN_PKG, [ngroute])
    .config(($routeProvider: ng.route.IRouteProvider) => {
        $routeProvider
            .when("/", {
                templateUrl: "views/login.html",
            })
            .when("/main", {
                templateUrl: "views/main.html",
            });
    });

module(HOUNDS_MAIN_PKG).factory("WeekService", () => new SchedulerWeek(new Date()));
module(HOUNDS_MAIN_PKG).factory("HoundsService", [
    "HoundsSettings",
    "$rootScope",
    ($settings: HoundsSettings, $rootScope: IRootScopeService) => new HoundsService($settings, $rootScope),
]);
module(HOUNDS_MAIN_PKG).factory("HoundsSettings", () => new HoundsSettings());

module(HOUNDS_MAIN_PKG).controller("houndsCtrl", ctrls.RootController);
module(HOUNDS_MAIN_PKG).controller("weekCtrl", ctrls.WeekController);
module(HOUNDS_MAIN_PKG).controller("sidebarCtrl", ctrls.SidebarController);
module(HOUNDS_MAIN_PKG).controller("loginCtrl", ctrls.LoginController);
module(HOUNDS_MAIN_PKG).controller("profileCtrl", ctrls.ProfileController);

module(HOUNDS_MAIN_PKG).controller("titleBar", [
        "$scope",
        ($scope) => {
            const win = remote.getCurrentWindow();

            $scope.minimize = () => {
                if (win) {
                    win.minimize();
                }
            };

            $scope.maximize = () => {
                if (win && win.isMaximized()) {
                    win.unmaximize();
                } else if (win) {
                    win.maximize();
                }
            };

            $scope.close = () => {
                if (win) {
                    win.close();
                }
            };

        }]);

/* SAVE FOR RIGHT CLICK DIRECTIVE
module(HOUNDS_MAIN_PKG).directive("ngRightClick", ($parse) => {
    return (scope, element, attrs) => {
        const fn = $parse(attrs.ngRightClick);
        element.bind("contextmenu", (event) => {
            scope.$apply(() => {
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
});

*/