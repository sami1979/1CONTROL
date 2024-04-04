const { app, BrowserWindow } = require('electron/main')
const { WebMidi } = require("webmidi");
const { onMidiEnabled } = require("./WebMidiIMP")
const path = require('node:path')
const log = require('electron-log/main')

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
  log.info('Electron Window started');
  startWebMidi();
  log.info('WebMidi started');
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    startWebMidi();
    log.info('WebMidi started');
  }
});


app.on('window-all-closed', () => {
  WebMidi.disable();
  if (process.platform !== 'darwin') {
    app.quit();
  }
})