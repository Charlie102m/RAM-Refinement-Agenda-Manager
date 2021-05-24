const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const storage = require("electron-json-storage");

console.log(storage.getDataPath());

require("@electron/remote/main").initialize();

let win;

function createWindow() {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "./")
    : path.join(__dirname, "./");

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  win = new BrowserWindow({
    width: 1024,
    height: 1024,
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

const isEmptyObject = (obj) =>
  obj && Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * Saves base url to storage
 */
ipcMain.on("save-url", (event, url) => {
  console.log("save-url", url);
  storage.set("url", url, (error) => {
    if (error) throw new Error(error);
    event.reply("get-url-response", url);
  });
});

/**
 * Retrieves base url from storage
 */
ipcMain.on("get-url", (event) => {
  console.log("get-url");
  storage.get("url", (error, data) => {
    if (error) throw new Error(error);
    const response = isEmptyObject(data) ? "" : data;
    event.reply("get-url-response", response);
  });
});

/**
 * Saves token to storage
 */
ipcMain.on("save-token", (event, token) => {
  console.log("save-token", token);
  storage.set("token", token, (error) => {
    if (error) throw new Error(error);
    event.reply("get-token-response", token);
  });
});

/**
 * Retrieves token from storage
 */
ipcMain.on("get-token", (event) => {
  console.log("get-token");
  storage.get("token", (error, data) => {
    if (error) throw new Error(error);
    const response = isEmptyObject(data) ? "" : data;
    event.reply("get-token-response", response);
  });
});

/**
 * Saves agenda to storage
 */
ipcMain.on("save-agenda", (event, agenda) => {
  console.log("save-agenda", agenda);
  storage.get("agendas", (error, data) => {
    if (error) throw new Error(error);
    const newAgendas = isEmptyObject(data)
      ? []
      : data.filter((a) => a.id !== agenda.id);
    storage.set("agendas", [agenda, ...newAgendas], (error) => {
      if (error) throw new Error(error);
      event.reply("get-agenda-response", agenda);
    });
  });
});

ipcMain.on("delete-agenda", (event, id) => {
  console.log("delete-agenda", id);
  storage.get("agendas", (error, data) => {
    if (error) throw new Error(error);
    const newAgendas = isEmptyObject(data)
      ? []
      : data.filter((a) => a.id !== id);
    storage.set("agendas", newAgendas, (error) => {
      if (error) throw new Error(error);

      event.reply("get-agendas-response", newAgendas);
    });
  });
});

ipcMain.on("get-agenda", (event, id) => {
  console.log("get-agenda", id);
  storage.get("agendas", (error, data) => {
    if (error) throw new Error(error);
    event.reply(
      "get-agenda-response",
      isEmptyObject(data) ? null : data.find((agenda) => agenda.id === id)
    );
  });
});

ipcMain.on("get-agendas", (event) => {
  console.log("get-agendas");
  storage.get("agendas", (error, data) => {
    if (error) throw new Error(error);
    console.log("data from store", data);
    event.reply("get-agendas-response", isEmptyObject(data) ? [] : data);
  });
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
