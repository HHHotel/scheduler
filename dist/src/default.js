"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
exports.__esModule = true;
var electron_1 = require("electron");
electron_1.remote.globalShortcut.register("CommandOrControl+Shift+I", function () {
    var win = electron_1.remote.BrowserWindow.getFocusedWindow();
    if (win) {
        win.webContents.openDevTools();
    }
});
electron_1.remote.globalShortcut.register("CommandOrControl+P", function () {
    var ipcRenderer = require("electron").ipcRenderer;
    ipcRenderer.send("print-schedule");
});
window.onbeforeunload = function () {
    electron_1.remote.globalShortcut.unregisterAll();
    saveSettings();
};
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var SETTINGS_PATH;
var SETTINGS_BASEDIR;
if (os_1["default"].platform() === "win32") {
    SETTINGS_BASEDIR = path_1["default"].join(process.env.APPDATA, "HHH Scheduler");
}
else {
    SETTINGS_BASEDIR = path_1["default"].join(os_1["default"].homedir(), ".hhhscheduler");
}
SETTINGS_PATH = path_1["default"].join(SETTINGS_BASEDIR, "settings.json");
console.log(SETTINGS_PATH);
loadSettings();
exports.DEFAULT = {
    CONSTANTS: {
        ARRIVING: "arriving",
        BOARDING: "boarding",
        DEPARTING: "departing",
        USER_CONSTANT: (_a = {},
            _a["Admin"] = 10,
            _a["Inputer"] = 5,
            _a["Viewer"] = 0,
            _a)
    },
    MAIN_PKG: "HHH.Scheduler.App",
    VERSION: "0.3.1"
};
function loadSettings() {
    if (fs_1["default"].existsSync(path_1["default"].join(SETTINGS_PATH))) {
        exports.Settings = JSON.parse(fs_1["default"].readFileSync(SETTINGS_PATH).toString());
    }
    console.log(exports.Settings);
}
exports.loadSettings = loadSettings;
function saveSettings() {
    fs_1["default"].writeFileSync(SETTINGS_PATH, JSON.stringify(exports.Settings));
}
exports.saveSettings = saveSettings;
