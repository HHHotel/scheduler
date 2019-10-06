"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var ctrls = __importStar(require("./controllers/SchedulerControllers"));
var Api_service_1 = require("./services/Api.service");
var default_1 = require("./default");
var EventData_service_1 = require("./services/EventData.service");
var angular_1 = require("angular");
var Week_service_1 = require("./services/Week.service");
var Scheduler_service_1 = require("./services/Scheduler.service");
var dayEvent_component_1 = require("./components/dayEvent.component");
var schedulerDogProfile_component_1 = require("./components/schedulerDogProfile.component");
var electron_1 = require("electron");
electron_1.remote.globalShortcut.register("CommandOrControl+Shift+I", function () {
    var win = electron_1.remote.BrowserWindow.getFocusedWindow();
    if (win) {
        win.webContents.openDevTools();
    }
});
electron_1.remote.globalShortcut.register("CommandOrControl+P", function () {
    var ipcRenderer = require("electron").ipcRenderer;
    ipcRenderer.send("print-schedule");
});
window.onbeforeunload = function () {
    electron_1.remote.globalShortcut.unregisterAll();
    default_1.saveSettings();
};
angular_1.module(default_1.DEFAULT.MAIN_PKG, [require("angular-route")])
    .config(function ($routeProvider) {
    $routeProvider
        .when("/", {
        templateUrl: "views/login.html"
    })
        .when("/main", {
        templateUrl: "views/main.html"
    });
});
angular_1.module(default_1.DEFAULT.MAIN_PKG).factory("Api", ["$http", "$location",
    function (http, loc) { return new Api_service_1.ApiService(http, loc); }]);
angular_1.module(default_1.DEFAULT.MAIN_PKG).factory("Week", function () { return new Week_service_1.SchedulerWeek(new Date()); });
angular_1.module(default_1.DEFAULT.MAIN_PKG).factory("EventData", ["Week", function (week) { return new EventData_service_1.EventData(week); }]);
angular_1.module(default_1.DEFAULT.MAIN_PKG).factory("$Scheduler", [
    "Week",
    "Api",
    "EventData",
    "$location",
    function (week, api, eventData, $location) {
        return new Scheduler_service_1.SchedulerService(week, api, eventData, $location);
    },
]);
angular_1.module(default_1.DEFAULT.MAIN_PKG).controller("loginCtrl", [
    "$scope",
    "$location",
    "$Scheduler",
    ctrls.LoginController,
]);
angular_1.module(default_1.DEFAULT.MAIN_PKG).controller("schedCtrl", [
    "$scope",
    "$rootScope",
    "$Scheduler",
    ctrls.SchedulerController,
]);
angular_1.module(default_1.DEFAULT.MAIN_PKG).controller("sidebarCtrl", [
    "$scope",
    "$rootScope",
    "$Scheduler",
    ctrls.SidebarController,
]);
angular_1.module(default_1.DEFAULT.MAIN_PKG).component("dayEvent", new dayEvent_component_1.DayEventComponent());
angular_1.module(default_1.DEFAULT.MAIN_PKG).component("schedulerDogProfile", new schedulerDogProfile_component_1.SchedulerDogProfileComponent());
angular_1.module(default_1.DEFAULT.MAIN_PKG)
    .controller("titleBar", [
    "$scope",
    function ($scope) {
        var win = electron_1.remote.getCurrentWindow();
        $scope.minimize = function () {
            if (win) {
                win.minimize();
            }
        };
        $scope.maximize = function () {
            if (win && win.isMaximized()) {
                win.unmaximize();
            }
            else if (win) {
                win.maximize();
            }
        };
        $scope.close = function () {
            if (win) {
                win.close();
            }
            default_1.saveSettings();
        };
    }
]);
