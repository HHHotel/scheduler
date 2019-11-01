import fs from "fs";
import os from "os";
import path from "path";
import { HoundsConfig, IHoundAuth } from "@happyhoundhotel/hounds-ts";

/*  DEFAULT VALUES */
export const HOUNDS_MAIN_PKG = "Hounds.App";
export const HOUNDS_API_URL = "http://localhost:8080";
export const HOUNDS_API_VERSION = "0.3.2";

interface IHoundsSettingsFile {
    TWENTY_FOUR_HOUR: boolean;
    SIDEBAR_OPEN: boolean;
    BASE_URL: string;
    AUTH: IHoundAuth;
    OPENING_HOUR_AM: number;
    CLOSING_HOUR_AM: number;
    OPENING_HOUR_PM: number;
    CLOSING_HOUR_PM: number;
}

export class HoundsSettings {

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

        function joinSettingsName(basedir: string) {
            // Set the settings path
            const SETTINGS_PATH = path.join(basedir, "settings.json");

            if (typeof window !== "undefined") { // Dont log settings when running tests
                console.log(SETTINGS_PATH);
            }

            return SETTINGS_PATH;
        }
    }

    private static readSettingsFile(filePath: string): IHoundsSettingsFile {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data.toString());
    }

    public sidebarOpen: boolean;
    public apiConfig: HoundsConfig;
    public HOURS: {
        CLOSING: { AM: number, PM: number },
        OPENING: { AM: number, PM: number },
    };

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
