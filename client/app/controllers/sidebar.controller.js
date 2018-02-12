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
        console.log($scope.form)
        $Scheduler.addBooking($scope.form);
        $scope.form = {};
        $Scheduler.cache.resEvents = $scope.findEvents();
      }

      $scope.findEvents = function (search) {
        $Scheduler.findEvents(search);
      }

      $scope.jumpToWeek = function (date) {
        $Scheduler.jumpToWeek(date);
      }


    }
  ]);
