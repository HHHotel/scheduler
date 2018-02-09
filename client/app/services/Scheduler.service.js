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
              events: [],
              queriedEvents: []
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

          addEvent(evt) {

            let self = this;

            self.socket.emit('event.new', evt, function (res) {
              console.log(res);
            });

          }

          removeEvent(evtID) {

            let self = this;

            self.socket.emit('event.remove', evtID);

          }
        }

        return new SchedulerService(Socket, Week);

    }]);
