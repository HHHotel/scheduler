const {remote} = require('electron');

remote.globalShortcut.register('CommandOrControl+Shift+I', () => {
        remote.BrowserWindow.getFocusedWindow().webContents.openDevTools();
});

window.onbeforeunload = () => {
        remote.globalShortcut.unregisterAll();
        saveSettings();
        // TODO Maybe Add a cancel close
};

const fs = require('fs');
const path = require('path');
const os = require('os');

let Settings, SETTINGS_PATH, SETTINGS_BASEDIR;

// Set the basedir of settingsm to users home directory
SETTINGS_BASEDIR = path.join(os.homedir(), '.hhhscheduler');

// Set the settings path
SETTINGS_PATH = path.join(SETTINGS_BASEDIR, 'settings.json');

// eslint-disable-next-line
console.log(SETTINGS_PATH);

loadSettings();

// eslint-disable-next-line
console.log(Settings);

const DEFAULT = {
        MAIN_PKG: 'HHH.Scheduler.App',

        API: {
                BASE_URL: Settings ? Settings.BASE_URL : ''
        },

        PKG: function (suffix) {
                if (suffix != null && suffix.length) {
                        return DEFAULT.MAIN_PKG + '.' + suffix;
                } else {
                        return DEFAULT.MAIN_PKG;
                }
        }
};

function loadSettings () {
        if (fs.existsSync(path.join(SETTINGS_PATH)))
                Settings = JSON.parse(fs.readFileSync(SETTINGS_PATH));
}

// eslint-disable-next-line
function saveSettings() {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(Settings));
}
