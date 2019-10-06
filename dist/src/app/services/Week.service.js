"use strict";
exports.__esModule = true;
var SchedulerWeek = (function () {
    function SchedulerWeek(currentDate) {
        this.days = [];
        this.advanceToDate(currentDate);
    }
    SchedulerWeek.getStartEnd = function (currentDate) {
        var sDate;
        var eDate;
        sDate = new Date(currentDate.toDateString());
        sDate.setDate(currentDate.getDate() - SchedulerWeek.getDay(currentDate));
        eDate = new Date(currentDate.toDateString());
        eDate.setDate(currentDate.getDate() + (6 - SchedulerWeek.getDay(currentDate)));
        return [sDate, eDate];
    };
    SchedulerWeek.getDay = function (date) {
        if (date.getDay() === 0) {
            return 6;
        }
        else {
            return (date.getDay() - 1);
        }
    };
    SchedulerWeek.prototype.advanceToDate = function (date) {
        var startEnd = SchedulerWeek.getStartEnd(date);
        this.initWeek(startEnd[0]);
    };
    SchedulerWeek.prototype.getDay = function (index) {
        return this.days[index];
    };
    SchedulerWeek.prototype.nextWeek = function () {
        var dates = SchedulerWeek.getStartEnd(new Date(this.days[0].getTime() + SchedulerWeek.WEEK_INC));
        this.initWeek(dates[0]);
    };
    SchedulerWeek.prototype.prevWeek = function () {
        var dates = SchedulerWeek.getStartEnd(new Date(this.days[6].getTime() - SchedulerWeek.WEEK_INC));
        this.initWeek(dates[0]);
    };
    SchedulerWeek.prototype.initWeek = function (sDate) {
        this.days = [];
        for (var i = 0; i < 7; i++) {
            var d = new Date(sDate.toString());
            d.setDate(sDate.getDate() + i);
            this.days.push(d);
        }
    };
    SchedulerWeek.prototype.toString = function () {
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
    SchedulerWeek.WEEK_INC = 8 * 24 * 60 * 60 * 1000;
    return SchedulerWeek;
}());
exports.SchedulerWeek = SchedulerWeek;
