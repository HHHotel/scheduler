/* eslint-disable */

angular.module(DEFAULT.MAIN_PKG).
  controller('schedCtrl', [
      '$rootScope',
      '$scope',
      '$Scheduler',
      function ($rootScope, $scope, $Scheduler) {
        $rootScope.Settings = Settings;

        $scope.conn = $Scheduler.conn;

        $scope.week = $Scheduler.week;

        $scope.cache = $Scheduler.cache;

        $scope.editMode = false;

        $scope.load = function () {
          $Scheduler.load();
        }

        $scope.saveProfile = function () {
          let dog = $scope.cache.dogProfile;
          let error = false;

          for (let booking of dog.bookings) {
            let start = new Date(booking.start);
            let end = new Date(booking.end);

            if (start.toString() === 'Invalid Date' || end.toString() === 'Invalid Date') {
              error = true;
              alert('Invalid Date');
            }
          }

          if (dog.name && dog.clientName && !error) {
            $Scheduler.editDog(dog);
          }

        }

        $scope.nextWeek = function () {
          $Scheduler.nextWeek();
        }

        $scope.prevWeek = function () {
          $Scheduler.prevWeek();
        }

        $scope.toggleSidebar = function () {
          Settings.SIDEBAR_OPEN = !Settings.SIDEBAR_OPEN;
        }

        $scope.removeEvent = function (id) {
          $Scheduler.removeEvent(id, () => {
            $Scheduler.retrieveDog($Scheduler.cache.dogProfile.id)
          });

        }

        $scope.removeDog = function (id) {
          $Scheduler.removeDog(id, () => {
            $Scheduler.cache.dogProfile = {};
            $Scheduler.cache.dogProfile.open = false;
          });
        }

        $scope.formatDate = function (date) {
          if (date) {
            date = new Date(date);
            return date.toDateString();
          }
        }

        $scope.getEventText = function (event) {
          let date = event.date ? new Date(event.date) : null;
          console.log(event.date);
          let text = event.text;

          if (date) {

            let hours = Settings.TWENTY_FOUR_HOUR ? date.getHours() : convertHours(date.getHours());
            let morningOrNight = !Settings.TWENTY_FOUR_HOUR ? (date.getHours() >= 12 ? ' PM' : ' AM') : '';
            let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

            return '(' + hours + ':' + minutes + morningOrNight + ') ' + text;

          } else {
            return text;
          }


        }

      }
    ]);


function convertHours ( hours ) {
  return hours <= 12 ? hours : hours - 12;
}
