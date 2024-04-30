"use strict";

function updateDisplay(rangeElement, valueElement, switchElement) {
    let value = rangeElement.value;
    if (switchElement.checked) {
        value = parseInt(value / 1.27).toFixed(0);
        value = String(value).concat(" %");
    }
    valueElement.textContent = value;
}

function setControlDial(rangeElement, valueElement, switchElement, webMidiAPISend) {
    updateDisplay(rangeElement, valueElement, switchElement);

    rangeElement.addEventListener("input", function() {
        updateDisplay(rangeElement, valueElement,switchElement);
        webMidiAPISend(rangeElement.value);
    });
}

const controlDials = [
    {
        name: "Soak",
        rangeElement: document.getElementById("soak-knob"),
        valueElement: document.getElementById("soak-value"),
        webMidiAPISend: window.WebMidiAPI.sendCCPowerSoak
    },
    {
        name: "Gain",
        rangeElement: document.getElementById("gain-knob"),
        valueElement: document.getElementById("gain-value"),
        webMidiAPISend: window.WebMidiAPI.sendCC2ndGAIN
    },
    {
        name: "Master",
        rangeElement: document.getElementById("master-knob"),
        valueElement: document.getElementById("master-value"),
        webMidiAPISend: window.WebMidiAPI.sendCC2ndMASTER
    }
];

const switchElement = document.getElementById("switch");
switchElement.addEventListener("change", function() {
    controlDials.forEach(function(controlDial){
        updateDisplay(
            controlDial.rangeElement, 
            controlDial.valueElement, 
            switchElement);
    })
});

controlDials.forEach(function(controlDial) {
    setControlDial(
        controlDial.rangeElement, 
        controlDial.valueElement,
        document.getElementById("switch"), 
        controlDial.webMidiAPISend);
});