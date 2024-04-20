"use strict";

async function setDeviceListOptions() {
    const selectElement = document.getElementById('midiOutSelect');
    const deviceList = await window.WebMidiAPI.openMidiDeviceSelection();

    deviceList.forEach(function(device) {
        const node = document.createElement("option");
        const textnode = document.createTextNode(device.name);
        node.appendChild(textnode);
        node.setAttribute('value', device.id);
        selectElement.appendChild(node);
    });
}

function closeWindow() {
    const selectElement = document.getElementById('midiOutSelect');
    window.WebMidiAPI.setMidiOutputId(selectElement.value);
    //alert(selectElement.value + typeof selectElement.value);
    window.WebMidiAPI.closeDevicePopup();
}

setDeviceListOptions();


