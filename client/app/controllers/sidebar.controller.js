/* eslint-disable */
angular
  .module(DEFAULT.MAIN_PKG)
  .controller('sidebarCtrl', [
    '$scope',
    '$Scheduler',
    function ($scope, $Scheduler) {

      $scope.form = {};

      $scope.cache = $Scheduler.cache;

      $scope.index = 0;

      $scope.addEvent = function () {
        $Scheduler.addEvent($scope.form.event, $scope.form.type);
        $scope.form = {};
      }

      $scope.addBooking = function () {
        $Scheduler.addBooking($scope.form);
        $scope.form = {};
        $Scheduler.cache.resEvents = $scope.findEvents();
      }

      $scope.removeEvent = function (id) {
        $Scheduler.removeEvent(id);
      }

      $scope.findEvents = function (search) {
        $Scheduler.findEvents(search);
      }

      $scope.jumpToWeek = function (date) {
        $Scheduler.jumpToWeek(date);
      }

      $scope.getDate = function (event) {
          // event.date ||
          // event.bookings[event.bookings.length - 1].date ||
          // event.bookings[event.bookings.length - 1].start + ' - ' + event.bookings[event.bookings.length - 1].end;

          if (event.date) {return new Date(event.date).toDateString();}

          else if (event.bookings[event.bookings.length - 1]) {
            let lastBooking = event.bookings[event.bookings.length - 1];
            if (lastBooking.date) return new Date(lastBooking.date).toDateString();
            else if (lastBooking.start) return new Date(lastBooking.start).toDateString() + ' - ' + new Date(lastBooking.end).toDateString();
          }
      }


    }
  ]);
