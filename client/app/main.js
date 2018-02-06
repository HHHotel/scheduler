/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG, [

    'ngRoute'

  ])

  .config(function ($routeProvider) {

     // To-DO add login.html
     $routeProvider
     .when('/', {
       templateUrl: 'views/main.html'
     });

   })


  .factory('socket', function ($rootScope) {
    var socket = io(DEFAULT.API.BASE_URL);
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  })

  .controller('bodyCtrl', function () {

  });
