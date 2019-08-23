"use strict";
/* global angular DEFAULT */
angular
    .module(DEFAULT.MAIN_PKG)
    .factory("Week", function () {
    var Week = /** @class */ (function () {
        function Week() {
            this.advanceToDate(arguments[0] ? arguments[0] : new Date());
        }
        Week.prototype.advanceToDate = function (date) {
            var startEnd = Week.getStartEnd(date);
            this.initWeek(startEnd[0], startEnd[1]);
        };
        Week.prototype.getDay = function (index) {
            return this.days[index];
        };
        Week.prototype.nextWeek = function () {
            var dates = Week.getStartEnd(this.days[0].getTime() + 604800000);
            this.initWeek(dates[0], dates[1]);
        };
        Week.prototype.prevWeek = function () {
            var dates = Week.getStartEnd(this.days[0].getTime() - 604800000);
            this.initWeek(dates[0], dates[1]);
        };
        Week.prototype.initWeek = function (sDate) {
            this.days = [];
            for (var i = 0; i < 7; i++) {
                var d = new Date(sDate.toString());
                d.setDate(sDate.getDate() + i);
                this.days.push(d);
            }
        };
        Week.prototype.toString = function () {
            var months = ["January", "February",
                "March", "April", "May", "June",
                "July", "August", "September", "October",
                "November", "December"];
            var year = this.days[0].getFullYear();
            if (this.days[0].getMonth() === this.days[this.days.length - 1].getMonth()) {
                var month = months[this.days[this.days.length - 1].getMonth()];
                return month + " " + year;
            }
            else {
                var mStart = months[this.days[0].getMonth()].slice(0, 3);
                var mEnd = months[this.days[6].getMonth()].slice(0, 3);
                return mStart + " - " + mEnd + " " + year;
            }
        };
        return Week;
    }());
    Week.getStartEnd = function () {
        var sDate;
        var eDate;
        var currentDate = new Date(arguments[0]);
        sDate = new Date(currentDate.toString());
        sDate.setDate(currentDate.getDate() - currentDate.getDay());
        eDate = new Date(currentDate.toString());
        eDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
        return [sDate, eDate];
    };
    return new Week();
});
