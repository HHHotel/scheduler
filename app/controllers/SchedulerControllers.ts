import { ILocationService } from "angular";
import { DEFAULT, Settings, saveSettings } from "../default";
import { HHH } from "../types/HHHTypes";
import { SchedulerService } from "../services/Scheduler.service";

export function SchedulerController($rootScope: any, $scope: any, $Scheduler: SchedulerService) {
    $rootScope.Settings = Settings;
    $rootScope.VERSION = DEFAULT.VERSION;

    $scope.week = $Scheduler.week;
    $scope.cache = $Scheduler.cache;
    $scope.editMode = false;

    $scope.saveProfile = () => {
        const newDog: HHH.SchedulerApiDog = {
            bookings: [],
            clientName: $scope.cache.dogProfile.clientName,
            id: $scope.cache.dogProfile.id,
            name: $scope.cache.dogProfile.name,
        };

        for (let i = 0; i < $scope.cache.dogProfile.bookings.length; i++) {
            try {
                const booking = $scope.cache.dogProfile.bookings[i];
                newDog.bookings[i] = booking;

                newDog.bookings[i].startDate = newDog.bookings[i].startDate.valueOf();
                newDog.bookings[i].endDate = newDog.bookings[i].endDate.valueOf();
            } catch (e) {
                alert("Invalid Date: " + e.message);
            }
        }

        if (newDog.name && newDog.clientName) {
            $Scheduler.editDog(newDog);
        } else {
            alert("Error: Details not provided");
        }

        $Scheduler.retrieveDog(newDog.id);
    };

    $scope.displayBooking = (booking: HHH.SchedulerBooking) => {
        if (!(booking.startDate instanceof Date)) { return null; }
        switch (booking.type) {
            case "boarding":
                return booking.startDate.toDateString() + getAmPm(booking.startDate)
                    + " - " + booking.endDate.toDateString() + getAmPm(booking.endDate);
            case "daycare":
                return booking.startDate.toDateString();
        }
    };

    function getAmPm(date: Date) {
        return date.getHours() < 12 ? " AM" : " PM";
    }

    $scope.lookup = (event: HHH.SchedulerEvent) => {
        switch (event.type) {
            case "arriving":
            case "departing":
            case "boarding":
            case "daycare":
                $Scheduler.retrieveDog(event.id);
                break;
        }
    };

    $scope.removeEvent = (id: string) => {
        $Scheduler.removeEvent(id, (response) => {
            if ($Scheduler.cache.dogProfile) {
                $Scheduler.retrieveDog($Scheduler.cache.dogProfile.id);
            }
            console.log(response);
        });
    };

    $scope.removeDog = (id: string) => {
        $Scheduler.removeDog(id, () => {
            $Scheduler.cache.dogProfile = null;
            $Scheduler.findEvents($scope.cache.searchText);
        });
    };

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
            date = new Date();
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

    /* KEEP TRACK OF INPUTS */
    $scope.form = {
        booking: {},
        dog: {},
        event: {},
    };

    $scope.newUser = {};
    $rootScope.search = {};
    /* MIRROR SCHEDULER CACHE */
    $scope.cache = $Scheduler.cache;
    /* INDEX OF SIDEBAR TAB */
    $scope.index = 0;

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
    $scope.addDog = (dog: HHH.SchedulerApiDog) => {
        if (dog.name && dog.clientName) {
            $Scheduler.addDog(dog);
            $scope.form.dog = {};
        } else {
            alert("Insufficent dog details");
        }
    };

    // ADD TYPINGS
    $scope.addEvent = (event: any, repeatOptions: any) => {
        if ((event.event_text || event.id) &&
            event.event_start &&
            event.event_type
        ) {
            if (event.event_type === "daycare" && repeatOptions) {
                let inc;
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

                for (
                    let i = event.event_start.valueOf(); i < repeatOptions.stopDate.valueOf(); i += inc
                ) {
                    event.event_start = i;
                    event.event_end = i;
                    $Scheduler.addEvent(event);
                }
            } else {
                $Scheduler.addEvent(event);
            }
            $scope.form = {};
        } else {
            alert("Insufficent event details");
        }
    };

    $scope.removeEvent = (id: string) => {
        $Scheduler.removeEvent(id, (response) => console.log(response));
        $Scheduler.findEvents($scope.search.input);
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
}

export function LoginController($scope: any, $location: ILocationService, $Scheduler: SchedulerService) {
    $scope.cache = $Scheduler.cache;

    $scope.submit = () => {
        $Scheduler.login($scope.cache.user.username, $scope.cache.user.password, (result: any) => {
            $scope.cache.user.password = "";
            if (result.status === 200) {
                $location.path("/main");
            } else {
                alert("Login failed: Please Try Again");
            }
        });
    };
}
