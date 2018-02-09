/* eslint-disable */

angular.module(DEFAULT.MAIN_PKG).
  controller('schedCtrl', [
      '$scope',
      '$Scheduler',
      '$form',
      function ($scope, $Scheduler, $form) {

        $scope.week = $Scheduler.week;

        $scope.cache = $Scheduler.cache;

        $scope.nextWeek = function () {
          $Scheduler.nextWeek();
        }

        $scope.prevWeek = function () {
          $Scheduler.prevWeek();
        }

        $scope.forms = $form.forms;

      }
    ]);
