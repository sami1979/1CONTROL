const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('WebMidiAPI', {
  sendCC2ndMASTER: (value) => ipcRenderer.send('send-CC', 1, 7, value),
  sendCC2ndGAIN: (value) => ipcRenderer.send('send-CC', 1, 20, value),
  sendCCPowerSoak: (value) => ipcRenderer.send('send-CC', 1, 30, value)
})