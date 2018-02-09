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
            open: false
          };

        }

        submit (evt, type) {
          this.$scheduler.addEvent({obj: evt, type: type});
        }

        closeForms () {
          this.forms.open = false;
        }

      }

      return new FormService($Scheduler);

  }]);
