"use strict";

async function setDeviceListOptions() {
    const selectElement = document.getElementById('midioutSelect');
    const deviceList = await window.WebMidiAPI.openMidiDeviceSelection();

    deviceList.forEach(function(device) {
        const node = document.createElement("option");
        const textnode = document.createTextNode(device.name);
        node.appendChild(textnode);
        node.setAttribute('value', device.id);
        selectElement.appendChild(node);
    });
}

setDeviceListOptions();


