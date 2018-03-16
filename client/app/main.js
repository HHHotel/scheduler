/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG, [

    require('angular-route')

  ])

  .config(function ($routeProvider) {

     // To-DO add login.html
     $routeProvider
     .when('/', {
       templateUrl: 'views/main.html'
     });

   })

  .controller('bodyCtrl', function () {

  });
