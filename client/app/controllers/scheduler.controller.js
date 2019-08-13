/*global angular Settings DEFAULT*/

angular.module(DEFAULT.MAIN_PKG).controller("schedCtrl", [
    "$rootScope",
    "$scope",
    "$Scheduler",
    ($rootScope, $scope, $Scheduler) => {
        $rootScope.Settings = Settings;
        $rootScope.VERSION = DEFAULT.VERSION;

        $scope.conn = $Scheduler.conn;
        $scope.week = $Scheduler.week;
        $scope.cache = $Scheduler.cache;
        $scope.editMode = false;


        /* PROFILE FUNCTIONS */
        $scope.saveProfile = function () {
            let newDog = {
                name: $scope.cache.dogProfile.name,
                clientName: $scope.cache.dogProfile.clientName,
                id: $scope.cache.dogProfile.id,
                bookings: [],
            };

            for (let i = 0; i < $scope.cache.dogProfile.bookings.length; i++) {
                try {
                    let booking = $scope.cache.dogProfile.bookings[i];
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

        $scope.displayBooking = function (booking) {
            if (!(booking.startDate instanceof Date)) { return null; }
            switch (booking.type) {
                case "boarding":
                    return booking.startDate.toDateString() + getAmPm(booking.startDate)
                        + " - " + booking.endDate.toDateString() + getAmPm(booking.endDate);
                case "daycare":
                    return booking.startDate.toDateString();
            }
        };

        $scope.lookup = function (event) {
            switch (event.type) {
                case "arriving":
                case "departing":
                case "boarding":
                case "daycare":
                    $Scheduler.retrieveDog(event.id);
                    break;
            }
        };

        $scope.removeEvent = function (id) {
            $Scheduler.removeEvent(id, () => {
                $Scheduler.retrieveDog($Scheduler.cache.dogProfile.id);
            });
        };

        $scope.removeDog = function (id) {
            $Scheduler.removeDog(id, () => {
                $Scheduler.cache.dogProfile = {};
                $Scheduler.cache.dogProfile.open = false;
                $Scheduler.findEvents($scope.cache.searchText);
            });
        };

        /* WEEK FUNCTIONS */
        $scope.nextWeek = function () {
            $Scheduler.nextWeek();
        };

        $scope.prevWeek = function () {
            $Scheduler.prevWeek();
        };

        /* MISC */
        $scope.toggleSidebar = function () {
            Settings.SIDEBAR_OPEN = !Settings.SIDEBAR_OPEN;
        };

        $scope.formatDate = function (date) {
            if (date) {
                date = new Date(date);
                return date.toDateString();
            }
        };

        $scope.displayEvent = function (event) {
            let date = event.date ? new Date(event.date) : null;
            let text = event.text;

            if (date) {

                let hours = convertHours(date.getHours());
                //let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

                return "(" + hours + getClosing(date) + getTimeExtension(date) + ") " + text;

            } else {
                return text;
            }

        };

        $scope.load = function () { $Scheduler.load(); };

        function getClosing(date) {
            if (date.getHours() === Settings.OPENING_HOUR_AM || date.getHours() === Settings.OPENING_HOUR_PM)
                return "-" + (date.getHours() >= 12 ? convertHours(Settings.CLOSING_HOUR_PM) : convertHours(Settings.CLOSING_HOUR_AM));

            else return ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
        }

        function getTimeExtension(date) {
            return !Settings.TWENTY_FOUR_HOUR ? getAmPm(date) : "";
        }

        function getAmPm(date) {
            return date.getHours() >= 12 ? " PM" : " AM";
        }

        function convertHours(hours) {
            return !Settings.TWENTY_FOUR_HOUR ? hours <= 12 ? hours : hours - 12 : hours;
        }
    }
]);

