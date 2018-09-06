/* eslint-disable */
angular
  .module(DEFAULT.MAIN_PKG)
  .controller('sidebarCtrl', [
    '$scope',
    '$Scheduler',
    function ($scope, $Scheduler) {

      $scope.form = {};

      $scope.cache = $Scheduler.cache;

      $scope.index = 0;

      $scope.addEvent = function () {
        $Scheduler.addEvent($scope.form);
        $Scheduler.findEvents();
        $scope.form = {};
        $Scheduler.cache.resEvents = [];
      }

      $scope.removeEvent = function (id) {
        $Scheduler.removeEvent(id);
        $Scheduler.findEvents($scope.search);
      }

      $scope.findEvents = function (search) {
        $Scheduler.findEvents(search);
      }

      $scope.jumpToWeek = function (date) {
        $Scheduler.jumpToWeek(date);
      }

      $scope.retrieveDog = function (dogID) {
        $Scheduler.retrieveDog(dogID);
      }

      $scope.getText = function (event) {
        if (event.dog_name) {
          return event.dog_name + ' ' + event.client_name;
        } else {
          return event.event_text;
        }
      }

    }
  ]);
