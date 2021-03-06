/* eslint semi: ["error", "always"] */

const { autoUpdater } = require("electron-updater");

const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        title: "Hounds",
        webPreferences: {
            experimentalFeatures: false,
            nodeIntegration: true
        },
        icon: "dist/res/images/icon.png",
        backgroundColor: "#386351",
    });

    mainWindow.setMinimumSize(800, 600);
    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "dist/res/index.html"),
            protocol: "file:",
            slashes: true
        })
    );

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    autoUpdater.checkForUpdatesAndNotify();

    createWindow();

    const menuTemplate = [
        {
            label: "File",
            submenu: [
                {
                    label: "Print",
                    accelerator: "CmdOrCtrl+P",
                    click: () => printSchedule(),
                },
                {
                    label: "Reload",
                    accelerator: "CmdOrCtrl+R",
                    role: "reload",
                },
                {
                    label: "Dev Tools",
                    accelerator: "CmdOrCtrl+Shift+I",
                    role: "toggleDevTools",
                },
            ],
        },
    ];
    const menu = new electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);

    process.title = "Hounds";
    process.arg0 = "asdfasdf";
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

const { ipcMain } = require("electron");

ipcMain.on("print-schedule", () => {
    printSchedule();
});

function printSchedule() {
    mainWindow.webContents.print({
        printBackground: false
    });
}
