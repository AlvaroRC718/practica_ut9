const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("node:path");

let ventanaIndex;
let ventanaPlay;

const createVentanaIndex = (height, width) => {
  ventanaIndex = new BrowserWindow({
    height: height,
    width: width,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), 
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  ventanaIndex.loadFile("index.html");
};

const createVentanaPlay = (height, width) => {
  ventanaPlay = new BrowserWindow({
    height: height,
    width: width,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), 
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  ventanaPlay.loadFile("play.html");
};

app.whenReady().then(() => {
  createVentanaIndex(1080, 1920);
});

// Manejo de la navegación entre las ventanas
ipcMain.on("navigate-to-play", () => {
  if (ventanaIndex) {
    ventanaIndex.close();
  }
  createVentanaPlay(1080, 1920);
});

ipcMain.on("navigate-to-index", () => {
  if (ventanaPlay) {
    ventanaPlay.close();
  }
  createVentanaIndex(1080, 1920);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});