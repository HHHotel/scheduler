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
let SETTINGS_BASEDIR: string = ".";

function setSettingsPath(basedir: string) {
    SETTINGS_BASEDIR = basedir;

    // Set the settings path
    SETTINGS_PATH = path.join(SETTINGS_BASEDIR, "settings.json");

    if (typeof window !== "undefined") { // Dont log settings when running tests
        console.log(SETTINGS_PATH);
    }

    loadSettings();
}

if (process.env.NODE_ENV === "development") {
    setSettingsPath(process.cwd());
} else if (os.platform() === "win32") {
    const winPath = path.join(process.env.APPDATA as string, "Hounds");
    setSettingsPath(winPath);
} else {
    const unixPath = path.join(process.env.HOME as string, ".hounds");
    setSettingsPath(unixPath);
}

import packjson from "../package.json";

interface IDefaults {
    CONSTANTS: {
        ARRIVING: string;
        BOARDING: string,
        DEPARTING: string,
        DAYCARE: string,
        DOG: string,
        EVENT_TYPES: string[],
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
        DEPARTING: "departing",
        BOARDING: "boarding",
        DAYCARE: "daycare",
        DOG: "dog",
        EVENT_TYPES: [
            "arriving",
            "departing",
            "daycare",
            "grooming",
            "visit",
            "foster",
            "eval",
            "general",
        ],
        USER_CONSTANT: {
            ["Viewer"]: 1,
            ["Inputer"]: 5,
            ["Admin"]: 10,
        },
    },
    MAIN_PKG: "Hounds.App",
    VERSION: packjson.version,
};

export function loadSettings() {
    if (fs.existsSync(path.join(SETTINGS_PATH))) {
        Settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
    }

    if (typeof window !== "undefined") { // Dont log settings when running tests
        console.log(Settings);
    }
}

export function saveSettings() {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(Settings));
}
