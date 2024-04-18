const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('WebMidiAPI', {
  sendCC2ndMASTER: (value) => {
    if (value > -1 && value < 128) {
      ipcRenderer.send('send-CC', 1, 7, value);
    }
  },
  sendCC2ndGAIN: (value) => {
    if (value > -1 && value < 128) {
      ipcRenderer.send('send-CC', 1, 20, value);
    }
  },
  sendCCPowerSoak: (value) => {
    if (value > -1 && value < 128) {
      ipcRenderer.send('send-CC', 1, 30, value);
    }
  },
  openMidiDeviceSelection: () => ipcRenderer.invoke('open-DeviceSelection')
})