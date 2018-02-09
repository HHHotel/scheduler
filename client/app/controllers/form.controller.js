/* eslint-disable */
angular
  .module(DEFAULT.MAIN_PKG)
  .controller('formCtrl', [
    '$scope',
    '$form',
    function ($scope, $form) {
      $scope.event = {};

      $scope.submit = function () {
        $form.submit($scope.event, 'Dog');
        $scope.event = {};
      }

      $scope.closeForms = $form.closeForms;

    }
  ]);
