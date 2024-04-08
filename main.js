const { app, BrowserWindow, ipcMain } = require('electron/main')
//const { WebMidi } = require("webmidi");
const { onMidiEnabled, sendCCselectedOut, disableWebMidi, startWebMidi } = require("./WebMidiIMP")
const path = require('node:path')
const log = require('electron-log/main')

const debuggerTools = true;


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  ipcMain.on('send-CC', (event, channel, cc, value) => {
    sendCCselectedOut(channel, cc, value)
    console.log(`Channel: ${channel}, CC: ${cc}, Value: ${value}`)
  });

  if (debuggerTools) { win.webContents.openDevTools(); }

  win.loadFile('main.html');
}

app.whenReady().then(() => {
  createWindow();
  log.info('Electron Window started');

  startWebMidi();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    startWebMidi();
    createWindow();
  }
});


app.on('window-all-closed', () => {
  disableWebMidi();
  if (process.platform !== 'darwin') {
    app.quit();
  }
})