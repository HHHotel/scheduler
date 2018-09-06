angular
  .module(DEFAULT.MAIN_PKG)
  .controller('loginCtrl', [
    '$scope',
    '$location',
    '$Scheduler',
    function ($scope, $location, $Scheduler) {

      $scope.username = '';
      $scope.password = '';

      $scope.cache = $Scheduler.cache;

      $scope.submit = function () {
        $Scheduler.login($scope.username, $scope.password, function (result) {
          if (result) $location.path('main');
          else alert('login failed');
        });
      }

    }
  ]);
