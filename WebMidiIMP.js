"use strict";

const { WebMidi } = require("webmidi");

const midiOutputDevice = (() => {
  let outputdevice = null;
  return {
    getInstance: () => { return outputdevice; },
    setInstance: (device) => { outputdevice = device; }
  }
})();

function setActiveMidiOutputDevice(outputDevice){
  midiOutputDevice.setInstance(outputDevice);
}

function getActiveMidiOutputDevice() {
  return midiOutputDevice.getInstance();
}

// Initialize WebMidi

function onMidiEnabled() {

  console.log("WebMidi- API Version: " + WebMidi.version)
  /*
  displayInputOutputDevices()

  //console.log("\nInput Devices:" + getInputDeviceDetails());
  console.log(getInputDeviceDetails());
  console.log(getOutputDeviceDetails());

  sendCC(getOutputDevices()[0], 1, 1, 1);
  */
  
  //midiOutputDevice = getOutputDevices()[1];
  //console.log(getOutputDeviceDetails()[1])
  //const outputCC = sendCC(midiOutputDevice, 16, 127, 126);
  //console.log(outputCC);
  // const outputPC = sendPC(midiOutputDevice, 16, 127);
  // console.log(outputPC);
}

function sendCC(outputDevice, channel, cc, value) {

  let options = {};
  options.channels = [channel];
  try { 
    const result = outputDevice.sendControlChange(cc, value, options);
    return result;
  } catch (error) {
      console.log(error);
  }
}

function sendCCselectedOut(channel, cc, value) {
  sendCC(midiOutputDevice.getInstance(), channel, cc, value);
}

function sendPC(outputDevice, channel, pc) {
  let options = {};
  options.channels = [channel];
  try {
    const result = outputDevice.sendProgramChange(pc, options);
    return result;
  } catch (error) {
      console.log(error);
  }
}

function getInputDevices() {
  let devices = [];
  WebMidi.inputs.forEach((device) => {
    devices.push(device);
  });
  return devices
}

function getInputDeviceDetails() {
  let deviceList = [];
  getInputDevices().forEach((device) => {
    deviceList.push({ 
      id: device.id,
      name: device.name,
      manufacturer: device.manufacturer,
      state: device.state
    });
  });
  return deviceList
}

function getOutputDevices() {
  let devices = [];
  WebMidi.outputs.forEach((device) => {
    devices.push(device);
  });
  return devices
}

function getOutputDeviceDetails() {
  let deviceList = [];
  getOutputDevices().forEach((device) => {
    deviceList.push({ 
      id: device.id,
      name: device.name,
      manufacturer: device.manufacturer,
      state: device.state
    });
  });
  return deviceList
}

function displayInputOutputDevices() {
  // Display available MIDI input devices
  console.log("Input Devices:")
  if (WebMidi.inputs.length < 1) {
    console.log("No input device detected.");
  } else {
      WebMidi.inputs.forEach((device, index) => {
        console.log(`${index}: ${device.name}`);
    });
  }

  console.log("\nOutput Devices:")
  if (WebMidi.outputs.length < 1) {
    console.log("No output device detected.");
  } else {
      WebMidi.outputs.forEach((device, index) => {
        console.log(`${index}: ${device.name}`);
    });
  }
}

function startWebMidi() {
  WebMidi
    .enable()
    .then(onMidiEnabled)
    .catch(err => console.log(err));
}

function disableWebMidi() {
  WebMidi.disable();
}

module.exports= {
  onMidiEnabled,
  sendCCselectedOut,
  startWebMidi,
  disableWebMidi,
  getOutputDevices,
  getActiveMidiOutputDevice,
  setActiveMidiOutputDevice
}
