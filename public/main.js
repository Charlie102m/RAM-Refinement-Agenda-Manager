const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

let win;

function createWindow() {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "Assets")
    : path.join(__dirname, "../src/Assets");

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  win = new BrowserWindow({
    width: 1024,
    height: 728,
    icon: getAssetPath("icon.png"),
    title: "RAM",
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.removeMenu();

  if (isDev) win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

let savedToken = "cahhdzi5rz2eagycnjak7uzgbukhkbujt5eprvpvshitisq4jfoa";
let agendas = [];

ipcMain.on("save-token", (event, token) => {
  savedToken = token;
  event.reply("get-token-response", savedToken);
});

ipcMain.on("get-token", (event) => {
  event.reply("get-token-response", savedToken);
});

ipcMain.on("save-agenda", (event, agenda) => {
  agendas = [...agendas.filter((a) => a.id === agenda.id), agenda];
  event.returnValue = agenda;
});

/**
 * OSX specific config
 */
app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
