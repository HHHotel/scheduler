export module HHH {

    interface SchedulerEvent {
        date: Date | null;
        type: string;
        text: string;
        id: string;
    }

    interface SchedulerBooking extends SchedulerEvent {
        startDate: Date;
        endDate: Date;
        dogName: string;
        clientName: string;
        dogId: string;
    }

    interface SchedulerUser {
        username: string;
        token: string;
        permissions: number;
    }

    interface SchedulerDog {
        name: string;
        clientName: string;
        id: string;
        bookings: SchedulerBooking[];
    }

    interface ResponseSchedulerEvent {
        text: string;
        type: string;
        desc: string;
        dogId: string;
        eventId: string;
        startDate: Date;
        endDate: Date;
    }

}