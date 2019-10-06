"use strict";
exports.__esModule = true;
var EventData_service_1 = require("./EventData.service");
var Week_service_1 = require("./Week.service");
var chai_1 = require("chai");
var mocha_1 = require("mocha");
mocha_1.describe("EventData Service", function () {
    it("#toApiEvent(daycare)", function () {
        var schedulerEvent = {
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare"
        };
        var apiEvent = {
            desc: "",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare"
        };
        chai_1.expect(apiEvent).to.deep.equal(EventData_service_1.EventData.toApiEvent(schedulerEvent));
    });
    it("#toApiEvent(boarding)", function () {
        var schedulerEvent = {
            endDate: new Date("2019-09-15T15:00:00.000Z"),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "boarding"
        };
        var apiEvent = {
            desc: "",
            endDate: new Date("2019-09-15T15:00:00.000Z").valueOf(),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "boarding"
        };
        chai_1.expect(apiEvent).to.deep.equal(EventData_service_1.EventData.toApiEvent(schedulerEvent));
    });
    it("#toApiBooking()", function () {
        var schedulerBooking = {
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare"
        };
        var apiBooking = {
            desc: "",
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare"
        };
        chai_1.expect(apiBooking).to.deep.equal(EventData_service_1.EventData.toApiBooking(schedulerBooking));
    });
    it("#toApiDog()", function () {
        var apiDog = {
            bookings: [
                {
                    desc: "",
                    endDate: new Date("2019-05-07T15:00:00.000Z").valueOf(),
                    startDate: new Date("2019-05-07T15:00:00.000Z").valueOf(),
                    id: "98354372299207123",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    desc: "",
                    endDate: new Date("2019-05-08T23:00:00.000Z").valueOf(),
                    startDate: new Date("2019-05-02T15:00:00.000Z").valueOf(),
                    id: "98354372299207122",
                    text: "undefined",
                    type: "boarding"
                },
                {
                    desc: "",
                    startDate: new Date("2019-04-30T15:00:00.000Z").valueOf(),
                    endDate: new Date("2019-04-30T15:00:00.000Z").valueOf(),
                    id: "98354372299207121",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    desc: "",
                    endDate: new Date("2019-04-23T15:00:00.000Z").valueOf(),
                    startDate: new Date("2019-04-23T15:00:00.000Z").valueOf(),
                    id: "98354372299207120",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    desc: "",
                    endDate: new Date("2019-04-16T15:00:00.000Z").valueOf(),
                    startDate: new Date("2019-04-16T15:00:00.000Z").valueOf(),
                    id: "98354372299207119",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    desc: "",
                    endDate: new Date("2019-04-15T23:00:00.000Z").valueOf(),
                    startDate: new Date("2019-04-05T15:00:00.000Z").valueOf(),
                    id: "98354372299207118",
                    text: "undefined",
                    type: "boarding"
                },
            ],
            clientName: "undefined",
            id: "98354372299207068",
            name: "Blitzen H"
        };
        var schedulerDog = {
            bookings: [
                {
                    endDate: new Date("2019-05-07T15:00:00.000Z"),
                    startDate: new Date("2019-05-07T15:00:00.000Z"),
                    id: "98354372299207123",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    endDate: new Date("2019-05-08T23:00:00.000Z"),
                    startDate: new Date("2019-05-02T15:00:00.000Z"),
                    id: "98354372299207122",
                    text: "undefined",
                    type: "boarding"
                },
                {
                    endDate: new Date("2019-04-30T15:00:00.000Z"),
                    startDate: new Date("2019-04-30T15:00:00.000Z"),
                    id: "98354372299207121",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    endDate: new Date("2019-04-23T15:00:00.000Z"),
                    startDate: new Date("2019-04-23T15:00:00.000Z"),
                    id: "98354372299207120",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    endDate: new Date("2019-04-16T15:00:00.000Z"),
                    startDate: new Date("2019-04-16T15:00:00.000Z"),
                    id: "98354372299207119",
                    text: "undefined",
                    type: "daycare"
                },
                {
                    endDate: new Date("2019-04-15T23:00:00.000Z"),
                    startDate: new Date("2019-04-05T15:00:00.000Z"),
                    id: "98354372299207118",
                    text: "undefined",
                    type: "boarding"
                },
            ],
            clientName: "undefined",
            id: "98354372299207068",
            name: "Blitzen H"
        };
        chai_1.expect(apiDog).to.deep.equal(EventData_service_1.EventData.toApiDog(schedulerDog));
    });
    it("#fromApiBooking()", function () {
        var schedulerBooking = {
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare"
        };
        var apiBooking = {
            desc: "",
            dogName: "Blitzen H",
            clientName: "",
            dogId: "98354372299207068",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207133",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare"
        };
        chai_1.expect(schedulerBooking).to.deep.equal(EventData_service_1.EventData.fromApiBooking(apiBooking));
    });
    it("#fromApiEvent()", function () {
        var schedulerEvent = {
            endDate: new Date("2019-09-10T15:00:00.000Z"),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z"),
            text: "Blitzen H",
            type: "daycare"
        };
        var apiEvent = {
            desc: "",
            endDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            id: "98354372299207068",
            startDate: new Date("2019-09-10T15:00:00.000Z").valueOf(),
            text: "Blitzen H",
            type: "daycare"
        };
        chai_1.expect(schedulerEvent).to.deep.equal(EventData_service_1.EventData.fromApiEvent(apiEvent));
    });
    it("#loadEventData()", function () {
        var serverRes = [
            {
                desc: "",
                dogName: "",
                clientName: "",
                dogId: "98354372299206991",
                endDate: new Date("2019-09-13T23:00:00.000Z").valueOf(),
                id: "98354372299206999",
                startDate: new Date("2019-09-03T15:00:00.000Z").valueOf(),
                text: "Bentley H",
                type: "boarding"
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
                type: "boarding"
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
                type: "daycare"
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
                type: "boarding"
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
                type: "boarding"
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
                type: "boarding"
            },
        ];
        var expectedResult = [
            [],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "arriving",
                    text: "Bentley H",
                    id: "98354372299206991"
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991"
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991"
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "arriving",
                    text: "Cash S",
                    id: "98354372299207509"
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991"
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "boarding",
                    text: "Cash S",
                    id: "98354372299207509"
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991"
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "boarding",
                    text: "Cash S",
                    id: "98354372299207509"
                },
            ],
            [
                {
                    startDate: new Date("2019-09-03T15:00:00.000Z"),
                    endDate: new Date("2019-09-13T23:00:00.000Z"),
                    type: "boarding",
                    text: "Bentley H",
                    id: "98354372299206991"
                },
                {
                    startDate: new Date("2019-09-05T15:00:00.000Z"),
                    endDate: new Date("2019-09-10T23:00:00.000Z"),
                    type: "boarding",
                    text: "Cash S",
                    id: "98354372299207509"
                },
            ],
        ];
        var ed = new EventData_service_1.EventData(new Week_service_1.SchedulerWeek(new Date("2019-09-09"))).valueOf();
        chai_1.expect(ed.loadEventData(serverRes)).to.deep.equal(expectedResult);
    });
});
