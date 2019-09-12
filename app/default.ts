import fs from "fs";
import os from "os";
import path from "path";

export interface IHHHSettings {
    TWENTY_FOUR_HOUR: boolean;
    SIDEBAR_OPEN: boolean;
    BASE_URL: string;
    OPENING_HOUR_AM: number;
    CLOSING_HOUR_AM: number;
    OPENING_HOUR_PM: number;
    CLOSING_HOUR_PM: number;
    user: {
        username: string;
        token: string;
    };
    iDate: string;
}

export let Settings: IHHHSettings;
let SETTINGS_PATH: string;
let SETTINGS_BASEDIR: string;

// Set the basedir of settings to users home directory
if (os.platform() === "win32") {
    SETTINGS_BASEDIR = path.join(process.env.APPDATA as string, "Hounds");
} else {
    SETTINGS_BASEDIR = path.join(os.homedir(), ".hounds");
}

// Set the settings path
SETTINGS_PATH = path.join(SETTINGS_BASEDIR, "settings.json");

if (typeof window !== "undefined") {
    console.log(SETTINGS_PATH);
}

loadSettings();

import packjson from "../package.json";

interface IDefaults {
    CONSTANTS: {
        ARRIVING: string;
        BOARDING: string,
        DEPARTING: string,
        DAYCARE: string,
        USER_CONSTANT: {
            [key: string]: number,
        },
    };
    MAIN_PKG: string;
    VERSION: string;
}

export const DEFAULT: IDefaults = {
    CONSTANTS: {
        ARRIVING: "arriving",
        BOARDING: "boarding",
        DEPARTING: "departing",
        DAYCARE: "daycare",
        USER_CONSTANT: {
            ["Admin"]: 10,
            ["Inputer"]: 5,
            ["Viewer"]: 0,
        },
    },
    MAIN_PKG: packjson.name + ".App",
    VERSION: packjson.version,
};

export function loadSettings() {
    if (fs.existsSync(path.join(SETTINGS_PATH))) {
        Settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
    }
    if (typeof window !== "undefined") {
        console.log(Settings);
    }
}

export function saveSettings() {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(Settings));
}
