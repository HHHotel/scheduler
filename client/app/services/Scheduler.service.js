/* eslint-disable */

angular
  .module('scheduler')
    .factory('Scheduler', [
      'socket',
      function (socket) {

        class SchedulerService {

          constructor (socket) {
            this.socket = socket;
          }


        }

        return new SchedulerService(socket);

    }]);
