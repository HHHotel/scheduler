/* global angular DEFAULT saveSettings */

angular
  .module(DEFAULT.MAIN_PKG)
  .controller('sidebarCtrl', [
    '$scope',
    '$Scheduler',
    function ($scope, $Scheduler) {

      $scope.saveSettings = function () {
        saveSettings();
      };

      $scope.form = {};

      $scope.cache = $Scheduler.cache;

      $scope.index = 0;

      $scope.newUser = {};

      $scope.addUser = function (username, password, permissionType) {
        let permissionLevel = 0;
        if (permissionType === 'Viewer') permissionLevel = 0;
        else if (permissionType === 'Inputer') permissionLevel = 5;
        else if (permissionType === 'Admin') permissionLevel = 10;

        $Scheduler.addUser(username, password, permissionLevel);
        $scope.newUser = {};
      };

      $scope.deleteUser = function (username) {
        $Scheduler.deleteUser(username);
      };

      $scope.changePassword = function (oldPassword, newPassword) {
        $Scheduler.changePassword(oldPassword, newPassword);
      };


      $scope.addEvent = function () {
        $Scheduler.addEvent($scope.form);
        $Scheduler.findEvents();
        $scope.form = {};
        $Scheduler.cache.resEvents = [];
      };

      $scope.removeEvent = function (id) {
        $Scheduler.removeEvent(id);
        $Scheduler.findEvents($scope.search);
      };

      $scope.findEvents = function (search) {
        $Scheduler.findEvents(search);
      };

      $scope.jumpToWeek = function (date) {
        $Scheduler.jumpToWeek(date);
      };

      $scope.retrieveDog = function (dogID) {
        $Scheduler.retrieveDog(dogID);
      };

      $scope.getText = function (event) {
        if (event.dog_name) {
          return event.dog_name + ' ' + event.client_name;
        } else {
          return event.event_text;
        }
      };

    }
  ]);
