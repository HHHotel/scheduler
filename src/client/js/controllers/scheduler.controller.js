/* eslint-disable */

angular.module('scheduler').
  controller('schedCtrl', [
      '$scope',
      'ServerInterface',
      function ($scope, ServerInterface) {
        $scope.week = new Week();

        ServerInterface.queryServer($scope.week.days[0]);


        $scope.events = {list: ServerInterface.week};

        $scope.formDisplay = {val: false};

      }
    ]);
