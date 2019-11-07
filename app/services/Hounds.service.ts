import {
    HoundsConfig,
    checkAuthentication,
    addDog,
    IHoundEvent,
    addEvent,
    findEvents,
    IHoundDog,
    removeEvent,
    removeDog,
    editDog,
    retrieveDog,
    addUser,
    changePassword,
    deleteUser,
    login,
    getWeek,
    IScheduleEvent} from "@happyhoundhotel/hounds-ts";
import { IRootScopeService } from "angular";
import { HoundsSettings } from "./Settings.service";
import log from "electron-log";
import { AxiosResponse } from "axios";

/**
 * Wrapper for the hounds API in the form of an AngularJs Service
 */
export class HoundsService {
    /** Holds the week events from the API */
    public events: IScheduleEvent[][] = [[]];
    /** URL of the API to query */
    private API_URL: string;
    /** Boolean value of whether or not the API */
    private loggedIn: boolean = false;

    constructor(
        private $settings: HoundsSettings,
        private $rootScope: IRootScopeService
    ) {
        this.API_URL = $settings.apiConfig.apiURL;
    }

    /**
     * Updates the services's events field with the newest data from the API
     * @param {Date} date The date of the week to get from the API
     *
     * Calls Apply to the root scope of the angular app
     */
    public async load(date: Date) {
        this.events = await this.getWeek(date);
        this.$rootScope.$apply();
    }

    /**
     * Logs into the API service storing the API token
     * @param {string} username the username of the user
     * @param {string} password  the password of the user
     *
     * @returns {Promise<boolean>} true on success false on failure
     */
    public async login(username: string, password: string): Promise<boolean> {
        try {
            const auth = await login(username, password, this.API_URL);
            this.$settings.apiConfig.apiAuth = {
                username: auth.username,
                token: auth.token
            };
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Add a new empty dog to the API
     * @param {IHoundDog} dog
     */
    public async addDog(dog: IHoundDog) {
        const houndsConfig = await this.checkAuth();
        this.handleError(addDog(dog, houndsConfig));
    }

    /**
     * Add a new event to the API
     * @param {IHoundEvent} event the event to add
     */
    public async addEvent(event: IHoundEvent) {
        const houndsConfig = await this.checkAuth();
        this.handleError(addEvent(event, houndsConfig));
    }

    /**
     * Get a list of dogs and events from the API
     * @param eventText text to search events for
     *
     * @returns {Promise<IHoundDog | IHoundEvent} list of dogs and events
     */
    public async findEvents(
        eventText: string
    ): Promise<IHoundEvent | IHoundDog[]> {
        const houndsConfig = await this.checkAuth();
        const events = await findEvents(eventText, houndsConfig);
        return events.data;
    }

    /**
     * Remove an event from the API
     * @param eventId event id to remove from the API
     */
    public async removeEvent(eventId: string) {
        const houndsConfig = await this.checkAuth();
        this.handleError(removeEvent(eventId, houndsConfig));
    }

    /**
     * Removes one dog from the API
     * @param dogId dog id to remove from the API
     */
    public async removeDog(dogId: string) {
        const houndsConfig = await this.checkAuth();
        this.handleError(removeDog(dogId, houndsConfig));
    }

    /**
     * Edits the details and bookings of a dog
     * @param dogProfile Dog object with the new details
     */
    public async editDog(dogProfile: IHoundDog) {
        const houndsConfig = await this.checkAuth();
        this.handleError(editDog(dogProfile, houndsConfig));
    }

    /**
     * Gets the profile of a dog from the API
     * @param dogId Id of the dog to get
     */
    public async retrieveDog(dogId: string): Promise<IHoundDog> {
        const houndsConfig = await this.checkAuth();
        return retrieveDog(dogId, houndsConfig);
    }

    /**
     * Adds a new user to the API
     * @param username
     * @param password
     * @param permissions number representing the level of permissions for new user
     *
     * A user's permissions must be greater or equal to the new user's permissions
     */
    public async addUser(
        username: string,
        password: string,
        permissions: number
    ) {
        const houndsConfig = await this.checkAuth();
        this.handleError(
            addUser(username, password, permissions, houndsConfig)
        );
    }

    /**
     * Deletes a user from the API
     * @param username username to delet
     *
     * A user must have permissions >= 10 to alter users
     */
    public async deleteUser(username: string) {
        const houndsConfig = await this.checkAuth();
        this.handleError(deleteUser(username, houndsConfig));
    }

    /**
     * Changes a user's password
     * @param username username of user to change
     * @param oldPassword old password of the user
     * @param newPassword  new password for the user
     */
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

    /**
     * Checks the authentication token of this service
     *
     * @returns {Promise<HoundsConfig>} the config object for the Hounds API
     */
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

    /**
     * Gets a week of Schedule events from the API
     * @param date date of the week to get
     *
     * @returns One week from the API
     */
    private async getWeek(date: Date): Promise<IScheduleEvent[][]> {
        const houndsConfig = await this.checkAuth();
        const week = await getWeek(date, houndsConfig);
        return week;
    }

    /**
     * Logs any errors from API methods
     * @param result result from one of this service's methods
     */
    private handleError(result: Promise<any>) {
        result
            .then((res: AxiosResponse) => {
                log.info("Server Response:", res.data);
                log.info("Status:", res.statusText);
                log.info("Code:", res.status);
                log.debug("Headers:", res.headers);
                log.debug("Config:", res.config);
            })
            .catch((res: AxiosResponse) => {
                this.loggedIn = false;
                if (res) {
                    alert("An error occured " + res.data);

                    log.error("Server Response:", res.data);
                    log.error("Status:", res.statusText);
                    log.error("Code:", res.status);
                    log.debug("Headers:", res.headers);
                    log.debug("Config:", res.config);
                }
            })
            .finally(() => {
                this.$rootScope.$apply();
                this.$rootScope.$broadcast("load");
            });
    }
}