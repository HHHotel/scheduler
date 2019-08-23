"use strict";
var remote = require("electron").remote;
remote.globalShortcut.register("CommandOrControl+Shift+I", function () {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools();
});
remote.globalShortcut.register("CommandOrControl+P", function () {
    var ipcRenderer = require("electron").ipcRenderer;
    ipcRenderer.send("print-schedule");
});
window.onbeforeunload = function () {
    remote.globalShortcut.unregisterAll();
    saveSettings();
};
var fs = require("fs");
var path = require("path");
var os = require("os");
var Settings, SETTINGS_PATH, SETTINGS_BASEDIR;
if (os.platform() === "win32") {
    SETTINGS_BASEDIR = path.join(process.env.APPDATA, "HHH Scheduler");
}
else {
    SETTINGS_BASEDIR = path.join(os.homedir(), ".hhhscheduler");
}
SETTINGS_PATH = path.join(SETTINGS_BASEDIR, "settings.json");
console.log(SETTINGS_PATH);
loadSettings();
console.log(Settings);
var DEFAULT = {
    MAIN_PKG: "HHH.Scheduler.App",
    VERSION: "0.3.0",
    CONSTANTS: {
        BOARDING: "boarding",
        ARRIVING: "arriving",
        DEPARTING: "departing",
        USER_CONSTANT: {
            "Viewer": 0,
            "Inputer": 5,
            "Admin": 10,
        }
    },
    API: {
        BASE_URL: Settings ? Settings.BASE_URL : ""
    },
    PKG: function (suffix) {
        if (suffix != null && suffix.length) {
            return DEFAULT.MAIN_PKG + "." + suffix;
        }
        else {
            return DEFAULT.MAIN_PKG;
        }
    }
};
function loadSettings() {
    if (fs.existsSync(path.join(SETTINGS_PATH)))
        Settings = JSON.parse(fs.readFileSync(SETTINGS_PATH));
}
function saveSettings() {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(Settings));
}
