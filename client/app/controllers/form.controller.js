/* eslint-disable */
let app = angular.module('scheduler');

app.controller('formCtrl', [
  '$scope',
  function ($scope) {
    $scope.event = {};

    $scope.closeForms = function () {
      $scope.$parent.formDisplay.val = false;
    }
  }
]);
