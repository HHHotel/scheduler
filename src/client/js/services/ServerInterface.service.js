/* eslint-disable */

angular
  .module('scheduler')
    .factory('Scheduler', [
      'socket',
      function (socket) {

        let self = {};

        self.week = [];

        self.queryServer = function (sDate) {
          socket.emit('getevents', sDate, function (respWeek) {
            self.week = respWeek;
          });
        }

        socket.on('load', function (data) {
          // storage.load(data);
        });

        return self;
    }]);
