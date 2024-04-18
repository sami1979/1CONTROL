const { app, BrowserWindow, ipcMain } = require('electron/main')
//const { WebMidi } = require("webmidi");
const { onMidiEnabled, sendCCselectedOut, disableWebMidi, startWebMidi, getOutputDevices } = require("./WebMidiIMP")
const path = require('node:path')
const log = require('electron-log/main')

const debuggerTools = true;


function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  

  
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    if (permission === 'midi' || permission === 'midiSysex') {
      console.log('Midi Permission true');
      callback(true);
    } else {
      callback(false);
    }
  })
  
  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    if (permission === 'midi' || permission === 'midiSysex') {
      return true;
    }
    return false;
  });
  

  if (debuggerTools) { win.webContents.openDevTools(); }

  win.loadFile('main.html');
  return win;
}

function createMidiDeviceSelectWindow(parentWindow) {
  const popup = new BrowserWindow({
    parent: parentWindow,
    modal: true,
    show: false,
    width: 300,
    height: 200,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // Required for dropdown interaction
      preload: path.join(__dirname, 'preload.js')
    }
  });

  popup.loadFile('device-popup.html'); // Load the popup HTML file

  popup.webContents.openDevTools();

  popup.once('ready-to-show', () => {
    popup.show();
  });

  return popup;
}

app.whenReady().then(() => {
  ipcMain.on('send-CC', (event, channel, cc, value) => {
    sendCCselectedOut(channel, cc, value)
    console.log(`Channel: ${channel}, CC: ${cc}, Value: ${value}`)
  });
  
  ipcMain.handle('open-DeviceSelection', () => {
    const devices = getOutputDevices();
    const deviceList = [];
    devices.forEach((device) => {
      const deviceDetails = {
        name: device.name,
        id: device.id
      }
      console.log(deviceDetails);
      deviceList.push(deviceDetails);
    })
    return deviceList;
  });

  startWebMidi();
  const mainWindow = createMainWindow();
  createMidiDeviceSelectWindow(mainWindow);
  log.info('Electron Window started');

  
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    startWebMidi();
    createMainWindow();
  }
});


app.on('window-all-closed', () => {
  disableWebMidi();
  if (process.platform !== 'darwin') {
    app.quit();
  }
})