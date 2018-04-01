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
              searchEvents: []
            }

            self.socket.on('update', function () {

              self.socket.emit('load', self.week.days[0], function (response) {
                self.cache.events = response;
              });

            });

          }

          nextWeek () {
            this.week.nextWeek();
          }

          prevWeek () {
            this.week.prevWeek();
          }

          jumpToWeek (date) {
            this.week.advanceToDate(date);
          }

          addEvent(evt, type) {

            let self = this;

            let data = {obj: evt, type: type}

            self.socket.emit('events.new', data); 

          }

          addBooking(booking) {
            let self = this;

            if (booking.start) {
              booking.start = booking.start.toString();
              booking.end = booking.end.toString();
            } else if (booking.date) {
              booking.date = booking.date.toString();
            }

            self.socket.emit('events.new.booking', booking, function (res) {
              console.log(res);
            })
          }

          findEvents (eventText) {
            let self = this;

            self.socket.emit('events.find', eventText, function (response) {
              self.cache.searchEvents = response;
            });
          }

          removeEvent(evtID) {

            let self = this;

            self.socket.emit('events.remove', evtID, function (res) {
              console.log(res);
            });

          }
        }

        return new SchedulerService(Socket, Week);

    }]);
