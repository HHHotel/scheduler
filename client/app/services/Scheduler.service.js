/* global angular DEFAULT */

angular
 .module(DEFAULT.MAIN_PKG)
    .factory('$Scheduler', [
      'Socket',
      'Week',
      '$location',
      function (Socket, Week, $location) {

        $location.path('/');

        class SchedulerService {

          constructor (Socket, Week) {

            let self = this;

            self.week = Week;
            self.cache = {
              events: [],
              searchEvents: [],

              dogProfile: {
                open: false
              },

              user: {
                username: '',
                password: ''
              }

            };

            self.socket = Socket;
            self.conn = {
              connected: false
            };

            self.socket.on('connected', () => self.conn.connected = true);
            self.socket.on('disconnect', () => self.conn.connected = false);
            self.socket.on('update', () => self.load());
            self.socket.on('unauthorized_access', () => alert('Permissions for access not met'));

          }

          login (username, password, callback) {
            let self = this;

            let user = {
              username: username,
              password: password
            };

            self.socket.emit('login', user, function(response) {
              callback(response.success);
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

          removeEvent(evtID, callback) {

            let self = this;

            self.socket.emit('remove_event', evtID, callback);

          }

          removeDog(dogID, callback) {

            this.socket.emit('remove_dog', dogID, callback);

          }

          editDog(dogProfile) {

            this.socket.emit('edit_dog', dogProfile);

          }

          retrieveDog (dogID) {

            let self = this;

            self.socket.emit('retrieve_dog', dogID, function (res) {
              self.cache.dogProfile = res;
              for (let booking of self.cache.dogProfile.bookings) {
                booking.start = new Date(booking.start);
                booking.end = new Date(booking.end);
              }
              self.cache.dogProfile.open = true;
            });

          }

          addUser (username, password, permissionLevel) {
            let self = this;
            let user = {
              username: username,
              password: password,
              permissionLevel: permissionLevel
            };

            self.socket.emit('add_user', user);

          }

          deleteUser (username) {
            let self = this;

            self.socket.emit('delete_user', username);
          }

          changePassword (username, oldPassword, newPassword) {
            let self = this;
            let user = {
              username: username,
              oldPassword: oldPassword,
              newPassword: newPassword
            };

            self.socket.emit('change_password', user);

          }

        }

        return new SchedulerService(Socket, Week);

    }]);
