/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
  .controller('loginCtrl', [
    '$scope',
    '$location',
    '$Scheduler',
    function ($scope, $location, $Scheduler) {

      $scope.cache = $Scheduler.cache;

      $scope.submit = function () {
        $Scheduler.login($scope.cache.user.username, $scope.cache.user.password, function (result) {
          if (result) $location.path('main');
          else alert('login failed');
        });
      }

    }
  ]);
