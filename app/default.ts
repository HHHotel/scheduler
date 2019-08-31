import { remote } from "electron";

remote.globalShortcut.register("CommandOrControl+Shift+I", () => {
    const win = remote.BrowserWindow.getFocusedWindow();
    if (win) {
        win.webContents.openDevTools();
    }
});

remote.globalShortcut.register("CommandOrControl+P", () => {
    const { ipcRenderer } = require("electron");
    ipcRenderer.send("print-schedule");
});

window.onbeforeunload = () => {
    remote.globalShortcut.unregisterAll();
    saveSettings();
    // TODO Maybe Add a cancel close
};

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

// Set the basedir of settingsm to users home directory
if (os.platform() === "win32") {
    SETTINGS_BASEDIR = path.join(process.env.APPDATA as string, "HHH Scheduler");
} else {
    SETTINGS_BASEDIR = path.join(os.homedir(), ".hhhscheduler");
}

// Set the settings path
SETTINGS_PATH = path.join(SETTINGS_BASEDIR, "settings.json");

console.log(SETTINGS_PATH);

loadSettings();

interface IDefaults {
    CONSTANTS: {
        ARRIVING: string;
        BOARDING: string,
        DEPARTING: string,
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
        USER_CONSTANT: {
            ["Admin"]: 10,
            ["Inputer"]: 5,
            ["Viewer"]: 0,
        },
    },
    MAIN_PKG: "HHH.Scheduler.App",
    /*PKG: (suffix: string) => {
        if (suffix != null && suffix.length) {
            return DEFAULT.MAIN_PKG + "." + suffix;
        } else {
            return DEFAULT.MAIN_PKG;
        }
    }, */
    VERSION: "0.3.1",
};

export function loadSettings() {
    if (fs.existsSync(path.join(SETTINGS_PATH))) {
        Settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
    }
    console.log(Settings);
}

export function saveSettings() {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(Settings));
}