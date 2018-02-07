/* eslint-disable */

angular.module(DEFAULT.MAIN_PKG).
  controller('schedCtrl', [
      '$scope',
      '$Scheduler',
      function ($scope, $Scheduler) {

        $scope.week = $Scheduler.week;

        $scope.cache = $Scheduler.cache;

        $scope.nextWeek = function () {
          $Scheduler.nextWeek();
        }

        $scope.prevWeek = function () {
          $Scheduler.prevWeek();
        }

        $scope.formDisplay = {val: false};

      }
    ]);
