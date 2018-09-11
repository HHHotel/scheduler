/* eslint-disable */

angular.module(DEFAULT.MAIN_PKG).
  controller('schedCtrl', [
      '$rootScope',
      '$scope',
      '$Scheduler',
      function ($rootScope, $scope, $Scheduler) {
        $rootScope.Settings = Settings;

        $scope.conn = $Scheduler.conn;

        $scope.week = $Scheduler.week;

        $scope.cache = $Scheduler.cache;

        $scope.nextWeek = function () {
          $Scheduler.nextWeek();
        }

        $scope.prevWeek = function () {
          $Scheduler.prevWeek();
        }

        $scope.toggleSidebar = function () {
          Settings.SIDEBAR_OPEN = !Settings.SIDEBAR_OPEN;
        }

        $scope.removeEvent = function (id) {
          $Scheduler.removeEvent(id);
          $Scheduler.retrieveDog($Scheduler.cache.dogProfile.id);
        }

        $scope.removeDog = function (id) {
          $Scheduler.removeDog(id);
        }

        $scope.formatDate = function (date) {
          if (date) {
            date = new Date(date);
            return date.toDateString();
          }
        }

      }
    ]);
