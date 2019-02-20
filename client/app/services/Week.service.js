/* global angular DEFAULT */

angular
  .module(DEFAULT.MAIN_PKG)
  .factory('Week', function () {
    class Week {

      constructor () {
        this.advanceToDate(arguments[0] ? arguments[0] : new Date());
      }

      advanceToDate(date) {
        let startEnd = Week.getStartEnd(date);
        this.initWeek(startEnd[0], startEnd[1]);
      }

      getDay(index) {
        return this.days[index];
      }

      nextWeek () {

        let dates = Week.getStartEnd(this.days[0].getTime() + 604800000);
        this.initWeek(dates[0], dates[1]);

      }
      prevWeek () {

        let dates = Week.getStartEnd(this.days[0].getTime() - 604800000);
        this.initWeek(dates[0], dates[1]);

      }

      initWeek (sDate) {
        this.days = [];

        for (let i = 0; i < 7; i++) {

          let d = new Date(sDate.toString());
          d.setDate(sDate.getDate() + i);
          this.days.push(d);

        }

      }


      toString () {
        const months = ['January', 'February',
          'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October',
          'November', 'December'];

        let year = this.days[0].getFullYear();

        if (this.days[0].getMonth() === this.days[this.days.length - 1].getMonth()) {

          let month = months[this.days[this.days.length - 1].getMonth()];
          return month + ' ' + year;

        } else {

          let mStart = months[this.days[0].getMonth()].slice(0, 3);
          let mEnd = months[this.days[6].getMonth()].slice(0, 3);
          return mStart + ' - ' + mEnd + ' ' + year;

        }

      }

    }

    Week.getStartEnd = function () {

      let sDate;
      let eDate;

      const currentDate = new Date(arguments[0]);

      sDate = new Date(currentDate.toString());
      sDate.setDate(currentDate.getDate() - currentDate.getDay());

      eDate = new Date(currentDate.toString());
      eDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

      return [sDate, eDate];

    };


    return new Week();

  });
