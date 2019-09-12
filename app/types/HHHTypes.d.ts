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
    startDate: Date;
    endDate: Date;
    type: string;
    text: string;
    id: string;
}

export interface ISchedulerBooking extends ISchedulerEvent {
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

export interface ISQLDog {
    id: string;
    dog_name: string;
    client_name: string;
}

export interface ISQLEvent extends ISQLDog {
    event_id: string;
    event_type: string;
    event_text: string;
    event_start: string;
    event_end: string;
}
