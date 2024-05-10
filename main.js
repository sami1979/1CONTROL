const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
//const { WebMidi } = require("webmidi");
const { onMidiEnabled, sendCCselectedOut, disableWebMidi, startWebMidi, getOutputDevices, midiOutputDevice, setActiveMidiOutputDevice, getActiveMidiOutputDevice } = require("./WebMidiIMP")
const path = require('node:path')
const log = require('electron-log/main')

const debuggerToolsEnabled = false;
log.initialize();
log.transports.console.level = 'debug';

const isMac = process.platform === 'darwin'

function createAppMenu() {
  let macTemplate = [];
  if (isMac) {
    macTemplate = [
      {
        label: app.name,
        submenu: [
          { role: 'quit' }
        ]
      }
    ];
  }

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(macTemplate.concat(template));
  Menu.setApplicationMenu(menu);
}


function createMainWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'index-preload.js')
    }
  })

  win.setTitle(`1CONTROL v${app.getVersion()}`);
  
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    if (permission === 'midi' || permission === 'midiSysex') {
      log.debug('Set Midi Permission true');
      callback(true);
    } 
    else {
      log.debug('Don\'t Set Midi Permission true')
      callback(false);
    }
  })
  
  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    if (permission === 'midi' || permission === 'midiSysex') {
      return true;
    }
    return false;
  });
  

  if (debuggerToolsEnabled) { win.webContents.openDevTools(); }

  win.loadFile('index.html');
  return win;
}

function createMidiDeviceSelectWindow(parentWindow) {
  const popup = new BrowserWindow({
    parent: parentWindow,
    modal: true,
    show: false,
    width: 300,
    height: 100,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // Required for dropdown interaction
      preload: path.join(__dirname, 'device-popup-preload.js')
    }
  });

  popup.setTitle(`1CONTROL v${app.getVersion()}`);
  popup.loadFile('device-popup.html'); // Load the popup HTML file

  if (debuggerToolsEnabled) { popup.webContents.openDevTools(); }

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
      deviceList.push(deviceDetails);
      log.debug(`ipcMain.handle(open-DeviceSelection) DeviceList: ${deviceList}`);
    })
    return deviceList;
  });

  ipcMain.on('set-MidiOutputId', (event, midiOutputId) => {
    const devices = getOutputDevices();
    log.debug(`ipcMain.on(set-MidiOutputId ) midiOutputDevice Before: ${midiOutputDevice}`);
    devices.forEach((device) => {
      log.debug(`${device.id} :  ${midiOutputId}`)
      if (device.id === midiOutputId) {
        setActiveMidiOutputDevice(device);
        log.debug(`ipcMain.on(set-MidiOutputId ) midiOutputDevice After: ${getActiveMidiOutputDevice().id}`)
      }
    })
  });

  ipcMain.on('close-DevicePopup', (event) => popupWindow.close());

  startWebMidi();
  const mainWindow = createMainWindow();
  popupWindow = createMidiDeviceSelectWindow(mainWindow);
  log.info('Electron Window started');
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const mainWindow = createMainWindow();
    if (getActiveMidiOutputDevice() == null) {
      createMidiDeviceSelectWindow(mainWindow);
    }
  }
});


app.on('window-all-closed', () => {
  disableWebMidi();
  if (!isMac) {
    app.quit();
  }
})

