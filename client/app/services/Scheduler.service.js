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

            self.socket.on('load', function (data) {

              self.cache.events = data;
              // console.log(self.cache.events);

            });

            self.socket.on('events.find.response', function (res) {
              self.cache.searchEvents = res;
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

          jumpToWeek (date) {
            this.week.advanceToDate(date);
            this.socket.emit('week.change', this.week.days[0]);
          }

          addEvent(evt, type) {

            let self = this;

            let data = {obj: evt, type: type}

            self.socket.emit('events.new', data, function (res) {
              console.log(res);
            });

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

            self.socket.emit('events.find', eventText);
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
