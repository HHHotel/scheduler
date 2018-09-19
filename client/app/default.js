/* eslint-disable */

const {remote} = require('electron');

remote.globalShortcut.register('CommandOrControl+Shift+I', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

const fs = require('fs');
const path = require('path');

let Settings;

const SETTINGS_PATH = path.join(__dirname, '../../settings.json');
console.log(SETTINGS_PATH)

loadSettings();

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

function saveSettings(callback) {
  fs.writeFile(SETTINGS_PATH, JSON.stringify(Settings), function (err) {
    if (err) throw err;
    console.log('Settings saved');
    callback();
  });
}

