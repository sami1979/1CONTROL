"use strict";

function updateDisplay(rangeElement, valueElement, switchElement) {
    let value = rangeElement.value;
    if (switchElement.checked) {
        value = parseInt(value / 1.27).toFixed(0);
        value = String(value).concat(" %");
    }
    valueElement.textContent = value;
}

function start() {
    const switchElement = document.getElementById("switch");
    const rangeElement = document.getElementById("knob");
    const valueElement = document.getElementById("value");

    updateDisplay(rangeElement, valueElement, switchElement);

    rangeElement.addEventListener("change", function() {
        updateDisplay(rangeElement, valueElement, switchElement);
        window.WebMidiAPI.sendCCPowerSoak(rangeElement.value);
    });

    switchElement.addEventListener("change", function() {
        updateDisplay(rangeElement, valueElement, switchElement);
    });
}