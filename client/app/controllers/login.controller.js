/*global angular DEFAULT*/

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
          $scope.cache.user.password = '';
          if (result) $location.path('main');
          else alert('Login failed');
        });
      };

    }
  ]);
