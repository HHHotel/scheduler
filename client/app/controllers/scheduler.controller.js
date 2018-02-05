/* eslint-disable */

angular.module('scheduler').
  controller('schedCtrl', [
      '$scope',
      'ServerInterface',
      function ($scope, ServerInterface) {

        $scope.formDisplay = {val: false};

      }
    ]);
