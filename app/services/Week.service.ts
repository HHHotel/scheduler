import { module } from "angular";
import { DEFAULT } from "../default";


export class SchedulerWeek {

    public static getStartEnd(currentDate: Date) {

        let sDate;
        let eDate;

        sDate = new Date(currentDate.toString());
        sDate.setDate(currentDate.getDate() - currentDate.getDay());

        eDate = new Date(currentDate.toString());
        eDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

        return [sDate, eDate];

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

        const dates = SchedulerWeek.getStartEnd(new Date(this.days[0].getTime() + 604800000));
        this.initWeek(dates[0]);

    }
    public prevWeek() {

        const dates = SchedulerWeek.getStartEnd(new Date(this.days[0].getTime() - 604800000));
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