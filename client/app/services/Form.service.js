/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
  .factory('$form', [
    '$Scheduler',
    function ($Scheduler) {

      class FormService {

        constructor (scheduler) {

          this.$scheduler = scheduler;

          this.forms = {
            open: false,
            index: 1
          };

        }

        addEvent (evt, type) {
          this.$scheduler.addEvent({obj: evt, type: type});
        }

        addBooking (booking) {
          this.$scheduler.addBooking(booking);
        }

        closeForms () {
          this.forms.open = false;
        }

      }

      return new FormService($Scheduler);

  }]);
