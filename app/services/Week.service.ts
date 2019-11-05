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
        for (const day of this.days) {
            day.setDate(day.getDate() + 7);
        }
    }
    public prevWeek() {
        for (const day of this.days) {
            day.setDate(day.getDate() - 7);
        }
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
