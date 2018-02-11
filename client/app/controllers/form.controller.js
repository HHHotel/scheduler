/* eslint-disable */
angular
  .module(DEFAULT.MAIN_PKG)
  .controller('formCtrl', [
    '$scope',
    '$form',
    function ($scope, $form) {
      $scope.form = {};

      $scope.addEvent = function () {
        $form.addEvent($scope.form.event, $scope.type);
        $scope.form = {};
      }

      $scope.addBooking = function () {

        $form.addBooking($scope.form);
        $scope.form = {};
        $form.$scheduler.cache.resEvents = $scope.findEvents();
      }

      $scope.closeForms = function () {
        $form.closeForms();
        $scope.form = {};
        $form.$scheduler.cache.resEvents = $scope.findEvents();
      }

      $scope.findEvents = function () {
        $form.$scheduler.findEvents($scope.form.dogName);
      }

      $scope.cacheID = function ($event, id) {
        $scope.form.id = id;
      }

      $scope.cache = $form.$scheduler.cache;

    }
  ]);
