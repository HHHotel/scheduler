import fs from "fs";
import os from "os";
import path from "path";
import log from "electron-log";
import { HoundsConfig, IHoundAuth } from "@happyhoundhotel/hounds-ts";

/*  DEFAULT VALUES */
export const HOUNDS_MAIN_PKG = "Hounds.App";
export const HOUNDS_API_URL = "http://localhost:8080";
export const HOUNDS_API_VERSION = "0.3.4";

interface IHoundsSettingsFile {
    /** Whether or not to use Twenty four hour time */
    TWENTY_FOUR_HOUR: boolean;
    /** Sidebar open setting */
    SIDEBAR_OPEN: boolean;
    /** Url for the Hounds API */
    BASE_URL: string;
    /** Authentication deatils with username and token */
    AUTH: IHoundAuth;
    /** Opening Hour in the morning */
    OPENING_HOUR_AM: number;
    /** Closing hour in the morning */
    CLOSING_HOUR_AM: number;
    /** Opening hour in the evening */
    OPENING_HOUR_PM: number;
    /** Closing hour in the evening */
    CLOSING_HOUR_PM: number;
}

/** Angular service for the Hounds settings */
export class HoundsSettings {

    /** 
     * Get the OS dependent settings path
     * 
     * @returns string which is the path to the settings file
     */
    private static getSettingsPath(): string {
        if (process.env.NODE_ENV === "development") {
            return joinSettingsName(process.cwd());
        } else if (os.platform() === "win32") {
            const winPath = path.join(process.env.APPDATA as string, "Hounds");
            return joinSettingsName(winPath);
        } else {
            const unixPath = path.join(process.env.HOME as string, ".hounds");
            return joinSettingsName(unixPath);
        }

        // tslint:disable-next-line: completed-docs
        function joinSettingsName(basedir: string) {
            // Set the settings path
            const SETTINGS_PATH = path.join(basedir, "settings.json");

            if (typeof window !== "undefined") { // Dont log settings when running tests
                log.info("Settings Path:", SETTINGS_PATH);
            }

            return SETTINGS_PATH;
        }
    }

    /**
     * Read settings file from path and parse json
     * @param filePath path to read from
     */
    private static readSettingsFile(filePath: string): IHoundsSettingsFile {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data.toString());
    }

    /** expose sidebar setting for use in the ui */
    public sidebarOpen: boolean;
    /** Configuration object holding token etc for hounds api */
    public apiConfig: HoundsConfig;
    /** Opening and closing hours for AM and PM */
    public HOURS: {
        // tslint:disable-next-line: completed-docs
        CLOSING: { AM: number, PM: number },
        // tslint:disable-next-line: completed-docs
        OPENING: { AM: number, PM: number },
    };

    /** path to the settings file */
    private settingsPath: string;

    constructor() {
        this.settingsPath = HoundsSettings.getSettingsPath();
        const settingsObj = HoundsSettings.readSettingsFile(this.settingsPath);
        const auth = {
            username: settingsObj.AUTH ? settingsObj.AUTH.username : "",
            token: settingsObj.AUTH ? settingsObj.AUTH.token : "",
        };

        this.sidebarOpen = settingsObj.SIDEBAR_OPEN;
        this.apiConfig = new HoundsConfig({
            apiAuth: auth,
            apiURL: settingsObj.BASE_URL,
            apiVersion: HOUNDS_API_VERSION,
        });

        this.HOURS = {
            OPENING: {
                AM: settingsObj.OPENING_HOUR_AM,
                PM: settingsObj.OPENING_HOUR_PM,
            },
            CLOSING: {
                AM: settingsObj.CLOSING_HOUR_AM,
                PM: settingsObj.CLOSING_HOUR_PM,
            },
        };
    }

    /** Write the settings object in json format to the settings path */
    public save() {
        const settingsObj: IHoundsSettingsFile = {
            TWENTY_FOUR_HOUR: false,
            SIDEBAR_OPEN: this.sidebarOpen,
            BASE_URL: this.apiConfig.apiURL,
            AUTH: this.apiConfig.apiAuth,
            OPENING_HOUR_AM: this.HOURS.OPENING.AM,
            CLOSING_HOUR_AM: this.HOURS.CLOSING.AM,
            OPENING_HOUR_PM: this.HOURS.OPENING.PM,
            CLOSING_HOUR_PM: this.HOURS.CLOSING.PM,
        }

        fs.writeFileSync(this.settingsPath, JSON.stringify(settingsObj));
    }
}
