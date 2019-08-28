"use strict";
exports.__esModule = true;
var default_1 = require("../default");
function SchedulerController($rootScope, $scope, $Scheduler) {
    $rootScope.Settings = default_1.Settings;
    $rootScope.VERSION = default_1.DEFAULT.VERSION;
    $scope.week = $Scheduler.week;
    $scope.cache = $Scheduler.cache;
    $scope.nextWeek = function () {
        $Scheduler.nextWeek();
    };
    $scope.prevWeek = function () {
        $Scheduler.prevWeek();
    };
    $scope.toggleSidebar = function () {
        default_1.Settings.SIDEBAR_OPEN = !default_1.Settings.SIDEBAR_OPEN;
    };
    $scope.formatDate = function (date) {
        if (date) {
            date = new Date();
            return date.toDateString();
        }
    };
    $scope.load = function () { return $Scheduler.load(); };
}
exports.SchedulerController = SchedulerController;
function SidebarController($scope, $rootScope, $Scheduler) {
    $scope.saveSettings = function () { return default_1.saveSettings(); };
    $scope.printSchedule = function () {
        var ipcRenderer = require("electron").ipcRenderer;
        ipcRenderer.send("print-schedule");
    };
    $scope.form = {
        booking: {},
        dog: {},
        event: {}
    };
    $scope.newUser = {};
    $rootScope.search = {};
    $scope.cache = $Scheduler.cache;
    $scope.index = 0;
    $scope.addUser = function (username, password, permissionType) {
        var permissionLevel = default_1.DEFAULT.CONSTANTS.USER_CONSTANT[permissionType];
        if (permissionLevel) {
            $Scheduler.addUser(username, password, permissionLevel.toString());
            $scope.newUser = {};
        }
        else {
            alert("Add a permission level");
        }
    };
    $scope.deleteUser = function (username) {
        $Scheduler.deleteUser(username);
    };
    $scope.changePassword = function (oldPassword, newPassword) {
        if (oldPassword && newPassword) {
            $Scheduler.changePassword(oldPassword, newPassword);
        }
        else {
            alert("Error: Missing fields");
        }
    };
    $scope.logout = function () {
        $Scheduler.logout();
    };
    $scope.addDog = function (dog) {
        if (dog.name && dog.clientName) {
            $Scheduler.addDog(dog);
            $scope.form.dog = {};
        }
        else {
            alert("Insufficent dog details");
        }
    };
    $scope.addEvent = function (event, repeatOptions) {
        if ((event.event_text || event.id) &&
            event.event_start &&
            event.event_type) {
            if (event.event_type === "daycare" && repeatOptions) {
                var inc = void 0;
                switch (repeatOptions.frequency) {
                    case "daily":
                        inc = 86400000;
                        break;
                    case "weekly":
                        inc = 604800000;
                        break;
                    case "once":
                        $Scheduler.addEvent(event);
                        break;
                    default:
                        alert("Enter repeat frequency");
                        break;
                }
                for (var i = event.event_start.valueOf(); i < repeatOptions.stopDate.valueOf(); i += inc) {
                    event.event_start = i;
                    event.event_end = i;
                    $Scheduler.addEvent(event);
                }
            }
            else {
                $Scheduler.addEvent(event);
            }
            $scope.form = {};
        }
        else {
            alert("Insufficent event details");
        }
    };
    $scope.removeEvent = function (id) {
        $Scheduler.removeEvent(id, function (response) { return console.log(response); });
        $Scheduler.findEvents($scope.search.input);
    };
    $scope.findEvents = function (search) {
        $Scheduler.findEvents(search);
    };
    $scope.retrieveDog = function (dogID) {
        $Scheduler.retrieveDog(dogID);
    };
    $scope.jumpToWeek = function (date) {
        $Scheduler.jumpToWeek(date);
    };
}
exports.SidebarController = SidebarController;
function LoginController($scope, $location, $Scheduler) {
    $scope.cache = $Scheduler.cache;
    $scope.submit = function () {
        $Scheduler.login($scope.cache.user.username, $scope.cache.user.password, function (result) {
            $scope.cache.user.password = "";
            if (result.status === 200) {
                $location.path("/main");
            }
            else {
                alert("Login failed: Please Try Again");
            }
        });
    };
}
exports.LoginController = LoginController;
