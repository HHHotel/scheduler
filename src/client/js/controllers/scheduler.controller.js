/* eslint-disable */

angular.module('scheduler').
  controller('schedCtrl', [
      '$scope',
      'ServerInterface',
      function ($scope, ServerInterface) {
        $scope.week = new Week(new Date());

        $scope.getEvents = function (date) {
          return [{text: 'Blitzen H', color: 'boarding', id: 'ABCDEFG'}];
        }


        $scope.formDisplay = {val: false};

      }
    ]);
