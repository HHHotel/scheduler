import { EventData } from "./EventData.service";
import { SchedulerWeek } from "./Week.service";
import * as HHH from "../types/HHHTypes";

import { expect } from "chai";
import { describe } from "mocha";

describe("EventData Service", () => {
    it("#toApiEvent(daycare)", () => {
        const schedulerEvent: HHH.ISchedulerEvent = {
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare",
        };

        const apiEvent: HHH.ISchedulerApiEvent = {
            desc: "",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare",
        };

        expect(apiEvent).to.deep.equal(EventData.toApiEvent(schedulerEvent));
    });

    it("#toApiEvent(boarding)", () => {
        const schedulerEvent: HHH.ISchedulerEvent = {
            endDate: new Date("2019-09-15T15:00:00.000Z"),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "boarding",
        };

        const apiEvent: HHH.ISchedulerApiEvent = {
            desc: "",
            endDate: new Date("2019-09-15T15:00:00.000Z").valueOf(),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "boarding",
        };

        expect(apiEvent).to.deep.equal(EventData.toApiEvent(schedulerEvent));
    });

    it("#toApiBooking()", () => {
        const schedulerBooking: HHH.ISchedulerBooking = {
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare",
        };

        const apiBooking: HHH.ISchedulerApiBooking = {
            desc: "",
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare",
        };

        expect(apiBooking).to.deep.equal(EventData.toApiBooking(schedulerBooking));
    });

    it("#toApiDog()", () => {
        const apiDog: HHH.ISchedulerApiDog = {
            bookings: [
                {
                    desc: "",
                    endDate: new Date("2019-05-07T15:00:00.000Z").valueOf(),
                    startDate: new Date("2019-05-07T15:00:00.000Z").valueOf(),
                    id: "98354372299207123",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    desc: "",
                    endDate: new Date("2019-05-08T23:00:00.000Z").valueOf(),
                    startDate: new Date("2019-05-02T15:00:00.000Z").valueOf(),
                    id: "98354372299207122",
                    text: "undefined",
                    type: "boarding",
                },
                {
                    desc: "",
                    startDate: new Date("2019-04-30T15:00:00.000Z").valueOf(),
                    endDate: new Date("2019-04-30T15:00:00.000Z").valueOf(),
                    id: "98354372299207121",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    desc: "",
                    endDate: new Date("2019-04-23T15:00:00.000Z").valueOf(),
                    startDate: new Date("2019-04-23T15:00:00.000Z").valueOf(),
                    id: "98354372299207120",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    desc: "",
                    endDate: new Date("2019-04-16T15:00:00.000Z").valueOf(),
                    startDate: new Date("2019-04-16T15:00:00.000Z").valueOf(),
                    id: "98354372299207119",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    desc: "",
                    endDate: new Date("2019-04-15T23:00:00.000Z").valueOf(),
                    startDate: new Date("2019-04-05T15:00:00.000Z").valueOf(),
                    id: "98354372299207118",
                    text: "undefined",
                    type: "boarding",
                },
            ],
            clientName: "undefined",
            id: "98354372299207068",
            name: "Blitzen H",
        };

        const schedulerDog: HHH.ISchedulerDog = {
            bookings: [
                {
                    endDate: new Date("2019-05-07T15:00:00.000Z"),
                    startDate: new Date("2019-05-07T15:00:00.000Z"),
                    id: "98354372299207123",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    endDate: new Date("2019-05-08T23:00:00.000Z"),
                    startDate: new Date("2019-05-02T15:00:00.000Z"),
                    id: "98354372299207122",
                    text: "undefined",
                    type: "boarding",
                },
                {
                    endDate: new Date("2019-04-30T15:00:00.000Z"),
                    startDate: new Date("2019-04-30T15:00:00.000Z"),
                    id: "98354372299207121",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    endDate: new Date("2019-04-23T15:00:00.000Z"),
                    startDate: new Date("2019-04-23T15:00:00.000Z"),
                    id: "98354372299207120",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    endDate: new Date("2019-04-16T15:00:00.000Z"),
                    startDate: new Date("2019-04-16T15:00:00.000Z"),
                    id: "98354372299207119",
                    text: "undefined",
                    type: "daycare",
                },
                {
                    endDate: new Date("2019-04-15T23:00:00.000Z"),
                    startDate: new Date("2019-04-05T15:00:00.000Z"),
                    id: "98354372299207118",
                    text: "undefined",
                    type: "boarding",
                },
            ],
            clientName: "undefined",
            id: "98354372299207068",
            name: "Blitzen H",
        };

        expect(apiDog).to.deep.equal(EventData.toApiDog(schedulerDog));
    });

    it("#fromApiBooking()", () => {
        const schedulerBooking: HHH.ISchedulerBooking = {
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare",
        };

        const apiBooking: HHH.ISchedulerApiBooking = {
            desc: "",
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare",
        };

        expect(schedulerBooking).to.deep.equal(EventData.fromApiBooking(apiBooking));
    });

    it("#fromApiEvent()", () => {
        const schedulerEvent: HHH.ISchedulerEvent = {
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare",
        };

        const apiEvent: HHH.ISchedulerApiEvent = {
            desc: "",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare",
        };

        expect(schedulerEvent).to.deep.equal(EventData.fromApiEvent(apiEvent));
    });

    it("#loadEventData()", () => {
        const serverRes: HHH.ISchedulerApiBooking[] = [
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299206991",
                endDate: new Date("2019-09-13T23:00:00.000Z").valueOf(),
                id: "98354372299206999",
                startDate: new Date("2019-09-03T15:00:00.000Z").valueOf(),
                text: "Bentley H",
                type: "boarding",
            },
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299207008",
                endDate: new Date("2019-09-18T15:00:00.000Z").valueOf(),
                id: "98354372299207034",
                startDate: new Date("2019-09-10T23:00:00.000Z").valueOf(),
                text: "Beyla F",
                type: "boarding",
            },
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299207068",
                endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
                id: "98354372299207133",
                startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
                text: "Blitzen H",
                type: "daycare",
            },
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299207068",
                endDate: new Date("2019-09-18T19:00:00.000Z").valueOf(),
                id: "98354372299207134",
                startDate: new Date("2019-09-12T15:00:00.000Z").valueOf(),
                text: "Blitzen H",
                type: "boarding",
            },
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299207302",
                endDate: new Date("2019-09-13T23:00:00.000Z").valueOf(),
                id: "98354372299207344",
                startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
                text: "Bruce & Leila V",
                type: "boarding",
            },
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299207509",
                endDate: new Date("2019-09-10T23:00:00.000Z").valueOf(),
                id: "98354372299207510",
                startDate: new Date("2019-09-05T15:00:00.000Z").valueOf(),
                text: "Cash S",
                type: "boarding",
            },
        ];

        const expectedResult: HHH.ISchedulerEvent[][] = [
            [],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "arriving",
                    text: "Bentley H",
                    id: "98354372299206991",
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991",
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991",
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "arriving",
                    text: "Cash S",
                    id: "98354372299207509",
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991",
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "boarding",
                    text: "Cash S",
                    id: "98354372299207509",
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991",
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "boarding",
                    text: "Cash S",
                    id: "98354372299207509",
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991",
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "boarding",
                    text: "Cash S",
                    id: "98354372299207509",
                },
            ],
        ];
        const ed = new EventData(new SchedulerWeek(new Date("2019-09-09"))).valueOf() as EventData;
        expect(ed.loadEventData(serverRes)).to.deep.equal(expectedResult);
    });
});
