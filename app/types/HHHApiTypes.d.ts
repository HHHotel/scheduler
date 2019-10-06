export interface ISchedulerApiDog {
    name: string;
    clientName: string;
    id: string;
    bookings: ISchedulerApiEvent[];
}

export interface ISchedulerApiBooking extends ISchedulerApiEvent {
    dogName: string;
    clientName: string;
    dogId: string;
}

export interface ISchedulerApiEvent {
    startDate: number;
    endDate: number;
    desc: string;
    type: string;
    text: string;
    id: string;
}
