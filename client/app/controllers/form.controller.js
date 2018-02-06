/* eslint-disable */
angular
  .module(DEFAULT.MAIN_PKG)
  .controller('formCtrl', [
    '$scope',
    function ($scope) {
      $scope.event = {};

      $scope.closeForms = function () {
        $scope.$parent.formDisplay.val = false;
      }
    }
  ]);
