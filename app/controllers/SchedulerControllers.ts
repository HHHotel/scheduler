import { ILocationService } from "angular";
import { DEFAULT, Settings, saveSettings } from "../default";
import * as HHH from "../types/HHHTypes";
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
    $scope.addUser = (username: string, password: string, permissionType: any) => {
        const permissionLevel: number | null = DEFAULT.CONSTANTS.USER_CONSTANT[permissionType];

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
    $scope.addDog = (dog: HHH.ISchedulerApiDog) => {
        if (dog.name && dog.clientName) {
            $Scheduler.addDog(dog);
            clearForm();
        } else {
            alert("Insufficent dog details");
        }
    };

    // TODO: ADD TYPINGS & refractor
    $scope.addEvent = (event: HHH.ISQLEvent, repeatOptions: any) => {

        if (!event || !(event.event_text || event.id) || !event.event_start || !event.event_type) {
            alert("Insufficent event details");
            return;
        }

        function getRepeatIncrement(repeatOpt: string) {
            switch (repeatOpt) {
                case "daily":
                    return 86400000;
                case "weekly":
                    return 604800000;
                default:
                    return -1;
            }
        }

        if (event.event_type === DEFAULT.CONSTANTS.DAYCARE && repeatOptions && repeatOptions.stopDate) {
            const inc = getRepeatIncrement(repeatOptions.frequency);
            if (inc < 0) {
                alert("Enter repeat frequency");
                return;
            }

            const duration = new Date(event.event_end).valueOf() -
                                     new Date(event.event_start).valueOf();

            for (let i = event.event_start.valueOf();
                i < repeatOptions.stopDate.valueOf() + inc;
                i += inc) {
                event.event_start = i;
                event.event_end = i + duration;
                $Scheduler.addEvent(event);
            }
        } else {
            $Scheduler.addEvent(event);
        }
        clearForm();
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
