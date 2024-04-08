const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('WebMidiAPI', {
  sendCC: (channel, cc, value) => ipcRenderer.send('send-CC', channel, cc, value)
})