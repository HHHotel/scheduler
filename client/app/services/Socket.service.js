/* global angular DEFAULT io */

angular
  .module(DEFAULT.MAIN_PKG)
  .factory('Socket', function ($rootScope) {

    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };


    const socket = io(DEFAULT.API.BASE_URL);

    return {

      on: function (eventName, callback) {

        socket.on(eventName, function () {
          const args = arguments;

          $rootScope.safeApply(function () {

            callback.apply(socket, args);

          });
        });
      },
      emit: function (eventName, data, callback) {

        socket.emit(eventName, data, function () {
          const args = arguments;

          $rootScope.safeApply(function () {

            if (callback) {
              callback.apply(socket, args);
            }

          });
        });
      },
      disconnect: function () {
        socket.disconnect();
      },
      connect: function () {
        socket.open();
      }
    };
  });
