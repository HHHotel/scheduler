/* eslint-disable */

angular.module(DEFAULT.MAIN_PKG).
  controller('schedCtrl', [
      '$scope',
      '$Scheduler',
      function ($scope, $Scheduler) {

        $scope.sidebar = {
          open: false
        };

        $scope.dogProfile = {
          open: true,
          name: 'Moose',
          clientName: 'Dickhead',
          breed: 'Shitzu',
          bookings: [
            {
              start: '8/17/2018',
              end: '8/25/2018'
            },
            {
              start: '9/17/2018',
              end: '9/25/2018'
            }
          ],
          dogID: ''
        }

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
          $scope.sidebar.open = !$scope.sidebar.open;
        }

      }
    ]);
