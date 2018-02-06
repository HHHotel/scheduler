/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
    .factory('$Scheduler', [
      'socket',
      '$q',
      function (socket, $q) {

      // // Wrap the socket requests
      //  function wrap (fn) {
      //    return function () {
      //      (fn || angular.noop).apply(self, arguments)
      //    };
      //  };

       class SchedulerService {

          constructor (socket) {

            this.socket = socket;

            this.cache = {
              events: []
            }

            this.load(new Date('2/4/2018'));

          }

          pushEvent(evt) {

            let self = this;

            self.socket.emit('push', evt);

          }

          removeEvent(evtID) {

            let self = this;

            self.socket.emit('remove', evtID);

          }

          load(sDate) {

            let self = this;

            self.socket.emit('getevents', sDate, function (response) {

              console.log(response);

              self.cache.events = response;

            });

          }

          getWeekEvents(sDate) {

            return this.cache.events;

          }

          attach (sto, evt) {

            this.socket.on(evt, function (res) {

              console.log(res);
              sto.push(res);

            })

          }




        }

        return new SchedulerService(socket);

    }]);
