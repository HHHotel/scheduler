"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var SETTINGS_PATH;
var SETTINGS_BASEDIR = ".";
function setSettingsPath(basedir) {
    SETTINGS_BASEDIR = path_1["default"].join(process.cwd(), basedir);
    SETTINGS_PATH = path_1["default"].join(SETTINGS_BASEDIR, "settings.json");
    if (typeof window !== "undefined") {
        console.log(SETTINGS_PATH);
    }
    loadSettings();
}
var winPath;
var unixPath;
var devPath;
if (process.env.NODE_ENV === "development") {
    devPath = path_1["default"].join("build/config/");
    setSettingsPath(devPath);
}
else if (os_1["default"].platform() === "win32") {
    winPath = path_1["default"].join(process.env.APPDATA, "Hounds");
    setSettingsPath(winPath);
}
else {
    unixPath = path_1["default"].join(process.env.HOME, ".hounds");
    setSettingsPath(unixPath);
}
var package_json_1 = __importDefault(require("../package.json"));
exports.DEFAULT = {
    CONSTANTS: {
        ARRIVING: "arriving",
        BOARDING: "boarding",
        DEPARTING: "departing",
        DAYCARE: "daycare",
        BOOKING: "booking",
        DOG: "dog",
        USER_CONSTANT: (_a = {},
            _a["Admin"] = 10,
            _a["Inputer"] = 5,
            _a["Viewer"] = 0,
            _a)
    },
    MAIN_PKG: package_json_1["default"].name + ".App",
    VERSION: package_json_1["default"].version
};
function loadSettings() {
    if (fs_1["default"].existsSync(path_1["default"].join(SETTINGS_PATH))) {
        exports.Settings = JSON.parse(fs_1["default"].readFileSync(SETTINGS_PATH).toString());
    }
    if (typeof window !== "undefined") {
        console.log(exports.Settings);
    }
}
exports.loadSettings = loadSettings;
function saveSettings() {
    fs_1["default"].writeFileSync(SETTINGS_PATH, JSON.stringify(exports.Settings));
}
exports.saveSettings = saveSettings;
