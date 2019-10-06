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
            date = new Date(date);
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
    function clearForm() {
        $scope.form = {
            booking: {},
            dog: {},
            event: {}
        };
    }
    clearForm();
    $scope.newUser = {};
    $rootScope.search = {};
    $scope.cache = $Scheduler.cache;
    $scope.index = 0;
    $scope.showRepeat = false;
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
            clearForm();
        }
        else {
            alert("Insufficent dog details");
        }
    };
    $scope.addEvent = function (event, repeatOptions) {
        if (!event || !(event.text || event.id) || !event.startDate || !event.type) {
            alert("Insufficent event details");
            return;
        }
        var startTime = event.startDate.valueOf() - new Date(event.startDate.toLocaleDateString()).valueOf();
        var endTime = event.endDate.valueOf() - new Date("Jan 1 1970").valueOf();
        var eventDuration = endTime - startTime;
        if (eventDuration <= 0) {
            alert("Please enter a valid end time");
            return;
        }
        if (repeatOptions && repeatOptions.stopDate) {
            var inc = getRepeatIncrement(repeatOptions.frequency);
            if (inc < 0) {
                alert("Enter repeat frequency");
                return;
            }
            addEventUntil(event, eventDuration, repeatOptions.stopDate, inc);
        }
        else {
            if (event.type !== default_1.DEFAULT.CONSTANTS.BOOKING) {
                event.endDate = new Date(event.startDate.valueOf() + eventDuration);
            }
            $Scheduler.addEvent(event);
        }
        clearForm();
        function getRepeatIncrement(repeatOpt) {
            var DAILY_INC = 86400000;
            var WEEKLY_INC = 604800000;
            switch (repeatOpt) {
                case "daily":
                    return DAILY_INC;
                case "weekly":
                    return WEEKLY_INC;
                default:
                    return -1;
            }
        }
        function addEventUntil(baseEvent, duration, stopDate, increment) {
            for (var i = event.startDate.valueOf(); i < stopDate.valueOf() + increment; i += increment) {
                baseEvent.startDate = new Date(i);
                baseEvent.endDate = new Date(i + duration);
                $Scheduler.addEvent(baseEvent);
            }
        }
    };
    $scope.removeEvent = function (id) {
        $Scheduler.removeEvent(id, function () { return $Scheduler.findEvents($scope.search.input); });
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
    $scope.eventSearchComparator = function (a, b) {
        if (a.value.type === default_1.DEFAULT.CONSTANTS.DOG) {
            return 1;
        }
        else if (b.value.type === default_1.DEFAULT.CONSTANTS.DOG) {
            return -1;
        }
        else {
            return (a.value.startDate < b.value.startDate) ? -1 : 1;
        }
    };
}
exports.SidebarController = SidebarController;
function LoginController($scope, $location, $Scheduler) {
    $scope.cache = $Scheduler.cache;
    $scope.loginLoading = false;
    $scope.submit = function () {
        $scope.loginLoading = true;
        $Scheduler.login($scope.cache.user.username, $scope.cache.user.password, function (result) {
            $scope.cache.user.password = "";
            $scope.loginLoading = false;
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
