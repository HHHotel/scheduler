import {
    HoundsConfig,
    checkAuthentication,
    addDog,
    IHoundAPIDog,
    IHoundEvent,
    addEvent,
    findEvents,
    IHoundDog,
    removeEvent,
    removeDog,
    editDog,
    retrieveDog,
    toApiDog,
    addUser,
    changePassword,
    deleteUser,
    login,
    getWeek,
    IHoundAuth,
    IScheduleEvent
} from "@happyhoundhotel/hounds-ts";
import { IRootScopeService } from "angular";
import { HoundsSettings } from "./Settings.service";

/*
Wrapper Class for the Hounds api library for angular
*/
export class HoundsService {
    public events: IScheduleEvent[][] = [[]];
    private API_URL: string;
    private loggedIn: boolean = false;

    constructor(
        private $settings: HoundsSettings,
        private $rootScope: IRootScopeService
    ) {
        this.API_URL = $settings.apiConfig.apiURL;
    }

    public async load(date: Date) {
        this.events = await this.getWeek(date);
        this.$rootScope.$apply();
    }

    public async login(username: string, password: string): Promise<boolean> {
        try {
            const auth = await login(username, password, this.API_URL);
            this.$settings.apiConfig.apiAuth = {
                username: auth.username,
                token: auth.token
            };
            this.$rootScope.$apply();
            return true;
        } catch (err) {
            this.$rootScope.$apply();
            return false;
        }
    }

    public async addDog(dog: IHoundAPIDog) {
        const houndsConfig = await this.checkAuth();
        this.handleError(addDog(dog, houndsConfig));
    }

    public async addEvent(event: IHoundEvent) {
        const houndsConfig = await this.checkAuth();
        this.handleError(addEvent(event, houndsConfig));
    }

    public async findEvents(eventText: string): Promise<IHoundEvent | IHoundDog[]> {
        const houndsConfig = await this.checkAuth();
        const events = await findEvents(eventText, houndsConfig);
        return events.data;
    }

    public async removeEvent(eventId: string) {
        const houndsConfig = await this.checkAuth();
        this.handleError(removeEvent(eventId, houndsConfig));
    }

    public async removeDog(dogId: string) {
        const houndsConfig = await this.checkAuth();
        this.handleError(removeDog(dogId, houndsConfig));
    }

    public async editDog(dogProfile: IHoundDog) {
        const houndsConfig = await this.checkAuth();
        this.handleError(editDog(toApiDog(dogProfile), houndsConfig));
    }

    public async retrieveDog(dogId: string): Promise<IHoundDog> {
        const houndsConfig = await this.checkAuth();
        return retrieveDog(dogId, houndsConfig);
    }

    public async addUser(
        username: string,
        password: string,
        permissionLevel: string
    ) {
        const houndsConfig = await this.checkAuth();
        this.handleError(
            addUser(username, password, permissionLevel, houndsConfig)
        );
    }

    public async deleteUser(username: string) {
        const houndsConfig = await this.checkAuth();
        this.handleError(deleteUser(username, houndsConfig));
    }

    public async changePassword(
        username: string,
        oldPassword: string,
        newPassword: string
    ) {
        const houndsConfig = await this.checkAuth();
        this.handleError(
            changePassword(username, oldPassword, newPassword, houndsConfig)
        );
    }

    public async checkAuth(): Promise<HoundsConfig> {
        if (this.loggedIn) {
            return this.$settings.apiConfig;
        }

        const success = await checkAuthentication(this.$settings.apiConfig);

        if (success) {
            this.loggedIn = true;
            return this.$settings.apiConfig;
        } else {
            throw new Error("Hounds configuration error");
        }
    }

    private async getWeek(date: Date) {
        const houndsConfig = await this.checkAuth();
        const week = await getWeek(date, houndsConfig);
        return week;
    }

    private handleError(result: Promise<any>) {
        result
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                this.loggedIn = false;
                console.error(err);
            })
            .finally(() => {
                this.$rootScope.$apply();
            });
    }
}
