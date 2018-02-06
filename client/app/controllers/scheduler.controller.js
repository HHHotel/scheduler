/* eslint-disable */

angular.module(DEFAULT.MAIN_PKG).
  controller('schedCtrl', [
      '$scope',
      '$Scheduler',
      function ($scope, $Scheduler) {

        $scope.week = new Week();

        $scope.weekEvents = [];

        $Scheduler.attach($scope.weekEvents, 'load');

        $scope.formDisplay = {val: false};

      }
    ]);
