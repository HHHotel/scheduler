/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
    .factory('$Scheduler', [
      'Socket',
      'Week',
      function (Socket, Week) {

       class SchedulerService {

          constructor (Socket, Week) {

            let self = this;
            
            self.socket = Socket;

            self.socket.on('disconnect', () => console.log('Disconnected from the server'));

            self.week = Week;

            self.cache = {
              events: [],
              searchEvents: []
            }

            self.load();

            self.socket.on('update', function () {
              self.load();
            });

          }

          load () {
            let self = this;

            self.socket.emit('load', self.week.days[0], function (response) {
                self.cache.events = response;
            });
          }

          nextWeek () {
            this.week.nextWeek();
            this.load();
          }

          prevWeek () {
            this.week.prevWeek();
            this.load();
          }

          jumpToWeek (date) {
            this.week.advanceToDate(date);
            this.load();
          }

          addEvent(evt) {

            let self = this;

            self.socket.emit('add', evt); 

          }

          findEvents (eventText) {
            let self = this;

            self.socket.emit('find', eventText, function (response) {
              self.cache.searchEvents = response;
            });

          }

          removeEvent(evtID) {

            let self = this;

            self.socket.emit('remove_event', evtID);

          }
        }

        return new SchedulerService(Socket, Week);

    }]);
