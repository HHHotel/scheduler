/** Angular service to track the current week */
export class SchedulerWeek {

    /** 
     * Get the start date and end date of the week containing the current date
     * @param currentDate date inside week
     */
    public static getStartEnd(currentDate: Date) {

        let sDate;
        let eDate;

        sDate = new Date(currentDate.toDateString());
        sDate.setDate(currentDate.getDate() - SchedulerWeek.getDay(currentDate));

        eDate = new Date(currentDate.toDateString());
        eDate.setDate(currentDate.getDate() + (6 - SchedulerWeek.getDay(currentDate)));

        return [sDate, eDate];

    }

    /**
     * Get the correct day of the week for the date given
     * @param date date to get the weekday for
     */
    public static getDay(date: Date) {
        if (date.getDay() === 0) {
            return 6;
        } else {
            return (date.getDay() - 1);
        }
    }

    /** array of days in current week */
    private days: Date[] = [];

    constructor(currentDate: Date) {
        this.advanceToDate(currentDate);
    }

    /**
     * Move the week to the given date
     * @param date date of week to advance to
     */
    public advanceToDate(date: Date) {
        const startEnd = SchedulerWeek.getStartEnd(date);
        this.initWeek(startEnd[0]);
    }

    /**
     * Get day inside the week
     * @param index index of day to return
     */
    public getDay(index: number) {
        return this.days[index];
    }

    /**
     * Advance the week 7 days
     */
    public nextWeek() {
        for (const day of this.days) {
            day.setDate(day.getDate() + 7);
        }
    }

    /**
     * Go back one week
     */
    public prevWeek() {
        for (const day of this.days) {
            day.setDate(day.getDate() - 7);
        }
    }

    /**
     * Create the date array with the given date
     * @param sDate start date of week to get
     */
    public initWeek(sDate: Date) {
        this.days = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(sDate.toString());
            d.setDate(sDate.getDate() + i);
            this.days.push(d);
        }
    }

    /**
     * Return a string representing the week
     */
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
