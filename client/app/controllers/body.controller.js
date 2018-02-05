/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
   .controller('bodyCtrl', [
    '$routeProvider',
    function ($routeProvider) {

      // To-DO add login.html
      $routeProvider
      .when('/', {
        templateUrl: 'main.html'
      });

    }
 ])
