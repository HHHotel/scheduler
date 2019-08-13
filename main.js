/* eslint semi: ["error", "always"] */

const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const os = require("os");
const fs = require("fs");

// Second window for intializing settings on the first launch
let configWindow;

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      experimentalFeatures: true
    },
    icon: "client/images/icon.png",
    backgroundColor: "#386351"
  });

  mainWindow.setMinimumSize(800, 600);
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "client/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", startWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
const { ipcMain } = require("electron");

ipcMain.on("config-complete", () => {
  createWindow();
  configWindow.close();
});

ipcMain.on("print-schedule", () => {
  mainWindow.webContents.print({
    printBackground: false
  });
});

let SETTINGS_PATH, SETTINGS_BASEDIR;

// Set the basedir of settingsm to users home directory
if (os.platform() === "win32")
  SETTINGS_BASEDIR = path.join(process.env.APPDATA, "HHH Scheduler");
else SETTINGS_BASEDIR = path.join(os.homedir(), ".hhhscheduler");

// Set the settings path
SETTINGS_PATH = path.join(SETTINGS_BASEDIR, "settings.json");

// Make the settings directory if it doesn"t already exist
if (!fs.existsSync(SETTINGS_BASEDIR)) {
  fs.mkdirSync(SETTINGS_BASEDIR);
}

function startWindow() {
  if (fs.existsSync(SETTINGS_PATH)) {
    createWindow();
  } else {
    initSettings();
  }
}

function initSettings() {
  configWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      experimentalFeatures: true
    },
    icon: "client/images/icon.png",
    backgroundColor: "#386351"
  });

  configWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "client/init-settings.html"),
      protocol: "file:",
      slashes: true
    })
  );

  configWindow.on("closed", function() {
    configWindow = null;
  });
}
