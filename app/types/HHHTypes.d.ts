export interface ISchedulerApiDog {
    name: string;
    clientName: string;
    id: string;
    bookings: ISchedulerApiBooking[];
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

export interface ISchedulerEvent {
    date?: Date;
    type: string;
    text: string;
    id: string;
}

export interface ISchedulerBooking extends ISchedulerEvent {
    startDate: Date;
    endDate: Date;
    dogName: string;
    clientName: string;
    dogId: string;
}

export interface ISchedulerUser {
    username: string;
    token: string;
    permissions: number;
}

export interface ISchedulerDog {
    name: string;
    clientName: string;
    id: string;
    bookings: ISchedulerBooking[];
}
