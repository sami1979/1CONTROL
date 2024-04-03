const { app, BrowserWindow } = require('electron/main')
const { WebMidi } = require("webmidi");
const { onMidiEnabled } = require("./WebMidiIMP")
const path = require('node:path')

const debug = false;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (debug) { win.webContents.openDevTools(); }
  win.loadFile('main.html');
}

function startWebMidi() {
  WebMidi
    .enable()
    .then(onMidiEnabled)
    .catch(err => console.log(err));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  WebMidi.disable();
  if (process.platform !== 'darwin') {
    app.quit();
  }
})