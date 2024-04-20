const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('WebMidiAPI', {
  openMidiDeviceSelection: () => ipcRenderer.invoke('open-DeviceSelection'),
  setMidiOutputId: (midiOutputId) => ipcRenderer.send('set-MidiOutputId', midiOutputId),
  closeDevicePopup: () => ipcRenderer.send('close-DevicePopup')
})