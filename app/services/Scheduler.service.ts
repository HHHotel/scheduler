import { IHttpResponse, ILocationService, module} from "angular";
import { DEFAULT, saveSettings, Settings } from "../default";
import { HHH } from "../types/HHHTypes";
import { ApiService } from "./Api.service";
import { EventData } from "./EventData.service";
import { SchedulerWeek } from "./Week.service";

export class SchedulerService {
    public cache: {
        events?: HHH.SchedulerEvent[][];
        searchEvents?: [];
        searchText?: string;
        dogProfile: HHH.SchedulerDog | null;
    };
    public week: SchedulerWeek;
    private api: ApiService;
    private eventData: EventData;
    private loc: ILocationService;
    private loadInterval?: number;

    constructor(week: SchedulerWeek, api: ApiService, eventData: EventData, $location: ILocationService) {
        // TODO: Refractor the loading of settings so its a service implemented
        // by this class

        this.cache = {
            dogProfile: null,
            events: undefined,
            searchEvents: undefined,
            searchText: "",
        };
        this.api = api;
        this.week = week;
        this.eventData = eventData;
        this.loc = $location;

        if (Settings.iDate) {
            this.week.advanceToDate(new Date(parseInt(Settings.iDate, 10)));
        }

        this.checkToken();
    }

    public setupPolling() {
        if (!this.loadInterval) {
            this.loadInterval = window.setInterval(() => this.load(), 1000);
        }
        /* if (!this.profileInterval) {
            this.profileInterval = setInterval(() => {
                if (this.cache.dogProfile.open) {
                    this.retrieveDog(this.cache.dogProfile.id);
                }
            }, 500);
        } */
    }

    public clearPolling() {
        clearInterval(this.loadInterval);
        // clearInterval(this.profileInterval);
        this.loadInterval = undefined;
    }

    public init() {
        this.cache = {
            dogProfile: null,
            events: undefined,
            searchEvents: undefined,
            searchText: "",
        };
    }

    public login(username: string, password: string, callback: (result: IHttpResponse<unknown>) => void) {
        this.api.login(username, password, (result) => {
            callback(result);
            this.checkToken();
        });
    }

    public checkToken() {
        if (Settings.user && Settings.user.token) {
            this.api.post("/login", Settings.user, (response) => {
                if (response.status === 200) {
                    this.loc.path("/main");
                    this.setupPolling();
                } else {
                    this.logout();
                }
            });
        } else {
            this.logout();
        }
    }

    public logout() {
        this.clearPolling();
        this.init();
        this.loc.path("/");
        Settings.user = {
            token: "",
            username: "",
        };
        saveSettings();
    }

    public load() {
        this.api.get("/api/week", "date=" + this.week.getDay(0), (response) => {
            this.cache.events = this.eventData.loadEventData(response.data as HHH.ResponseSchedulerEvent[]);
        });
    }

    public nextWeek() {
        this.week.nextWeek();
        this.load();
    }

    public prevWeek() {
        this.week.prevWeek();
        this.load();
    }

    public jumpToWeek(date: Date) {
        this.week.advanceToDate(date);
        this.load();
    }

    public addDog(dog: HHH.SchedulerDog) {
        // TODO: make a popup notification with the server response
        this.api.post("/api/dogs", dog, alert);
    }

    public addEvent(event: any) {
        const newEvent = {
            event_end: event.event_end ?
                event.event_end.valueOf() :
                event.event_start.valueOf(),
            event_start: event.event_start.valueOf(),
            event_text: event.event_text,
            event_type: event.event_type,
            id: event.id,
        };

        this.api.post("/api/events", newEvent, alert);
    }

    public findEvents(eventText: string) {
        this.cache.searchText = eventText;
        this.api.get("/api/find", "searchText=" + eventText, (response) => {
            this.cache.searchEvents = response.data as [];
        });
    }

    public removeEvent(eventId: string, callback: (response: IHttpResponse<unknown>) => void) {
        this.api.get("/api/events/" + eventId + "/delete", "", callback);
    }

    public removeDog(dogId: string, callback: (response: IHttpResponse<unknown>) => void) {
        this.api.get("/api/events/" + dogId + "/delete", "", callback);
    }

    public editDog(dogProfile: HHH.SchedulerDog) {
        // TODO: make a popup notification with the server response
        this.api.put("/api/dogs", dogProfile, alert);
    }

    public retrieveDog(dogId: string) {
        this.api.get("/api/dogs/" + dogId, "", (res) => {
                const responseData = res.data as HHH.SchedulerDog;
                for (const booking of responseData.bookings) {
                    booking.startDate = new Date(booking.startDate);
                    booking.endDate = new Date(booking.endDate);
                }

                this.cache.dogProfile = responseData;
                this.cache.dogProfile.id = dogId;
        });
    }

    public addUser(username: string, password: string, permissionLevel: string) {
        const user = {
            password,
            permissions: permissionLevel,
            username,
        };

        this.api.post("/api/users", user, () => {
            alert("Added new user: " + user.username);
        });
    }

    public deleteUser(username: string) {
        this.api.get("/api/users/" + username + "/delete", "", () => {
            alert("Deleted " + username);
        });
    }

    public changePassword(oldPassword: string, newPassword: string) {
        const user = {
            newPassword,
            oldPassword,
            username: Settings.user.username,
        };

        this.api.put("/api/user/password", user, () => {
            alert("Changed Password for " + Settings.user.username);
        });
    }
}
