import { ILocationService } from "angular";
import { DEFAULT, Settings, saveSettings } from "../default";
import * as HHH from "../types/HHHTypes";
import * as API from "../types/HHHApiTypes";
import { SchedulerService } from "../services/Scheduler.service";

export function SchedulerController($rootScope: any, $scope: any, $Scheduler: SchedulerService) {
    $rootScope.Settings = Settings;
    $rootScope.VERSION = DEFAULT.VERSION;

    $scope.week = $Scheduler.week;
    $scope.cache = $Scheduler.cache;

    /* WEEK FUNCTIONS */
    $scope.nextWeek = () => {
        $Scheduler.nextWeek();
    };

    $scope.prevWeek = () => {
        $Scheduler.prevWeek();
    };

    /* MISC */
    $scope.toggleSidebar = () => {
        Settings.SIDEBAR_OPEN = !Settings.SIDEBAR_OPEN;
    };

    $scope.formatDate = (date: Date) => {
        if (date) {
            date = new Date(date);
            return date.toDateString();
        }
    };

    $scope.dayEventComparator = (a: any, b: any) => {
        if (a.value.type === DEFAULT.CONSTANTS.BOARDING) {
            return -1;
        }

        if (b.value.type === DEFAULT.CONSTANTS.BOARDING) {
            return 1;
        }

        if (!a.value.endDate || !a.value.startDate || !b.value.startDate || !b.value.endDate) {
            return 0;
        }

        const aDate = a.value.type === DEFAULT.CONSTANTS.DEPARTING ? a.value.endDate : a.value.startDate;
        const aTime = aDate.getHours() * 60 + aDate.getMinutes();
        const bDate = b.value.type === DEFAULT.CONSTANTS.DEPARTING ? b.value.endDate : b.value.startDate;
        const bTime = bDate.getHours() * 60 + bDate.getMinutes();

        const timeDiff = aTime - bTime;

        if (timeDiff === 0) {
            const aIndex = DEFAULT.CONSTANTS.EVENT_TYPES.indexOf(a.value.type);
            const bIndex = DEFAULT.CONSTANTS.EVENT_TYPES.indexOf(b.value.type);
            return aIndex - bIndex;
        } else {
            return timeDiff;
        }

    };

    $scope.load = () => $Scheduler.load();

}

export function SidebarController($scope: any, $rootScope: any, $Scheduler: SchedulerService) {
    $scope.saveSettings = () => saveSettings();

    $scope.printSchedule = () => {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("print-schedule");
    };

    function clearForm() {
        $scope.form = {
            booking: {},
            dog: {},
            event: {},
        };
    }

    /* KEEP TRACK OF INPUTS */
    clearForm();

    $scope.newUser = {};
    $rootScope.search = {};
    /* MIRROR SCHEDULER CACHE */
    $scope.cache = $Scheduler.cache;
    /* INDEX OF SIDEBAR TAB */
    $scope.index = 0;

    /* SHOW REPEAT OPTIONS */
    $scope.showRepeat = false;

    /* USER MANAGEMENT */
    $scope.addUser = (username: string, password: string, permissionType: string) => {
        const permissionLevel: number = DEFAULT.CONSTANTS.USER_CONSTANT[permissionType];

        if (permissionLevel) {
            $Scheduler.addUser(username, password, permissionLevel.toString());
            $scope.newUser = {};
        } else {
            alert("Add a permission level");
        }
    };

    $scope.deleteUser = (username: string) => {
        $Scheduler.deleteUser(username);
    };

    $scope.changePassword = (oldPassword: string, newPassword: string) => {
        if (oldPassword && newPassword) {
            $Scheduler.changePassword(oldPassword, newPassword);
        } else {
            alert("Error: Missing fields");
        }
    };

    $scope.logout = () => {
        $Scheduler.logout();
    };

    /* DOG SCHEDULE MANAGEMENT */
    $scope.addDog = (dog: API.ISchedulerApiDog) => {
        if (dog.name && dog.clientName) {
            $Scheduler.addDog(dog);
            clearForm();
        } else {
            alert("Insufficent dog details");
        }
    };

    interface IRepeatOptions {
        stopDate: string;
        frequency: string;
    }

    $scope.addEvent = (event: HHH.ISchedulerEvent, repeatOptions: IRepeatOptions) => {

        // Make sure everyting exists
        if (!event || !(event.text || event.id) || !event.startDate || !event.type) {
            alert("Insufficent event details");
            return;
        }

        const startTime = event.startDate.valueOf() - new Date(event.startDate.toLocaleDateString()).valueOf();
        const endTime = event.endDate.valueOf() - new Date("Jan 1 1970").valueOf();

        const eventDuration = endTime - startTime;

        if (eventDuration <= 0) {
            alert("Please enter a valid end time");
            return;
        }

        if (repeatOptions && repeatOptions.stopDate) {
            const inc = getRepeatIncrement(repeatOptions.frequency);
            if (inc < 0) {
                alert("Enter repeat frequency");
                return;
            }

            addEventUntil(event, eventDuration, repeatOptions.stopDate, inc);
        } else {
            if (event.type !== DEFAULT.CONSTANTS.BOARDING) {
                event.endDate = new Date(event.startDate.valueOf() + eventDuration);
            }
            $Scheduler.addEvent(event);
        }

        clearForm();

        /* End Of Function */

        function getRepeatIncrement(repeatOpt: string) {
            const DAILY_INC = 86400000; // 24 * 60 * 60 * 1000
            const WEEKLY_INC = 604800000; // 7 * 24 * ...
            switch (repeatOpt) {
                case "daily":
                    return DAILY_INC;
                case "weekly":
                    return WEEKLY_INC;
                default:
                    return -1;
            }
        }

        function addEventUntil(baseEvent: HHH.ISchedulerEvent, duration: number, stopDate: any, increment: number) {
            for (let i = event.startDate.valueOf(); i < stopDate.valueOf() + increment; i += increment) {
                baseEvent.startDate = new Date(i);
                baseEvent.endDate = new Date(i + duration);
                $Scheduler.addEvent(baseEvent);
            }
        }
    };

    $scope.removeEvent = (id: string) => {
        $Scheduler.removeEvent(id, () => $Scheduler.findEvents($scope.search.input));
    };

    $scope.findEvents = (search: string) => {
        $Scheduler.findEvents(search);
    };

    $scope.retrieveDog = (dogID: string) => {
        $Scheduler.retrieveDog(dogID);
    };

    /* MOVE AROUND WEEKS */
    $scope.jumpToWeek = (date: Date) => {
        $Scheduler.jumpToWeek(date);
    };

    $scope.eventSearchComparator = (a: any, b: any) => {
        if (a.value.type === DEFAULT.CONSTANTS.DOG) {
            return 1;
        } else if (b.value.type === DEFAULT.CONSTANTS.DOG) {
            return -1;
        } else {
            return (a.value.startDate < b.value.startDate) ? -1 : 1;
        }
    };

}

export function LoginController($scope: any, $location: ILocationService, $Scheduler: SchedulerService) {
    $scope.cache = $Scheduler.cache;
    $scope.loginLoading = false;

    $scope.submit = () => {
        $scope.loginLoading = true;
        $Scheduler.login($scope.cache.user.username, $scope.cache.user.password, (result: any) => {
            $scope.cache.user.password = "";
            $scope.loginLoading = false;
            if (result.status === 200) {
                $location.path("/main");
            } else {
                alert("Login failed: Please Try Again");
            }
        });
    };
}
