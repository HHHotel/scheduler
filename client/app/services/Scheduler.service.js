/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
    .factory('$Scheduler', [
      'Socket',
      'Week',
      function (Socket, Week) {

      // // Wrap the socket requests
      //  function wrap (fn) {
      //    return function () {
      //      (fn || angular.noop).apply(self, arguments)
      //    };
      //  };

       class SchedulerService {

          constructor (Socket, Week) {

            let self = this;

            self.socket = Socket;

            self.week = Week;

            self.cache = {
              events: []
            }

            self.socket.on('load', function (data) {

              self.cache.events = data;
              // console.log(self.cache.events);

            });

          }

          nextWeek () {
            this.week.nextWeek();
            this.socket.emit('week.change', this.week.days[0]);

          }

          prevWeek () {
            this.week.prevWeek();
            this.socket.emit('week.change', this.week.days[0]);

          }

          pushEvent(evt) {

            let self = this;

            self.socket.emit('push', evt);

          }

          removeEvent(evtID) {

            let self = this;

            self.socket.emit('remove', evtID);

          }

          getDayEvents(i) {

            return this.cache.events[i];

          }
        }

        return new SchedulerService(Socket, Week);

    }]);
