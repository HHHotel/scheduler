/* eslint-disable */

angular
  .module('scheduler')
    .factory('ServerInterface', [
      'socket',
      function (socket) {

        let self = {};

        let storage = {
          days: [],


        }



        socket.on('load', function (data) {
          // storage.load(data);
        });

        return self;
    }]);
