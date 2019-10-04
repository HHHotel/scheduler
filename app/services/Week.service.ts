export class SchedulerWeek {

    public static getStartEnd(currentDate: Date) {

        let sDate;
        let eDate;

        sDate = new Date(currentDate.toDateString());
        sDate.setDate(currentDate.getDate() - SchedulerWeek.getDay(currentDate));

        eDate = new Date(currentDate.toDateString());
        eDate.setDate(currentDate.getDate() + (6 - SchedulerWeek.getDay(currentDate)));

        return [sDate, eDate];

    }

    public static getDay(date: Date) {
        if (date.getDay() === 0) {
            return 6;
        } else {
            return (date.getDay() - 1);
        }
    }

    // 8 Because of daylight savings time
    private static WEEK_INC = 8 * 24 * 60 * 60 * 1000;
    private days: Date[] = [];

    constructor(currentDate: Date) {
        this.advanceToDate(currentDate);
    }

    public advanceToDate(date: Date) {
        const startEnd = SchedulerWeek.getStartEnd(date);
        this.initWeek(startEnd[0]);
    }

    public getDay(index: number) {
        return this.days[index];
    }

    public nextWeek() {

        const dates = SchedulerWeek.getStartEnd(new Date(this.days[0].getTime() + SchedulerWeek.WEEK_INC));
        this.initWeek(dates[0]);

    }
    public prevWeek() {

        // Increment from the last day of the week to land somewhere in the middle of the prev week
        // Otherwise it can happen where you skip a week
        const dates = SchedulerWeek.getStartEnd(new Date(this.days[6].getTime() - SchedulerWeek.WEEK_INC));
        this.initWeek(dates[0]);
    }

    public initWeek(sDate: Date) {
        this.days = [];

        for (let i = 0; i < 7; i++) {

            const d = new Date(sDate.toString());
            d.setDate(sDate.getDate() + i);
            this.days.push(d);

        }

    }

    public toString() {
        const months = ["January", "February",
            "March", "April", "May", "June",
            "July", "August", "September", "October",
            "November", "December"];

        const year = this.days[0].getFullYear();

        if (this.days[0].getMonth() === this.days[this.days.length - 1].getMonth()) {

            const month = months[this.days[this.days.length - 1].getMonth()];
            return month + " " + year;

        } else {

            const mStart = months[this.days[0].getMonth()].slice(0, 3);
            const mEnd = months[this.days[6].getMonth()].slice(0, 3);
            return mStart + " - " + mEnd + " " + year;

        }

    }

}
