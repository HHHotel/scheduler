/* eslint-disable */

angular.module('scheduler').
  controller('schedCtrl', [
      '$scope',
      function ($scope) {
        $scope.week = new Week(new Date());

        $scope.getEvents = function (date) {
          return [{text: 'Bob', color: 'boarding', id: 'ABCDEFG'}];
        }

        $scope.formDisplay = {val: true};

      }
    ]);
