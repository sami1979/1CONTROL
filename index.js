'use strict';

const SOAK_LABEL = 'soak-label';

function updateDisplay (nameElement, rangeElement, valueElement, switchElement) {
  let value = rangeElement.value;
  if (switchElement.checked) {
    value = parseInt(value / 1.27).toFixed(0);
    value = String(value).concat(' %');
  }
  valueElement.textContent = value;

  if (nameElement === 'Soak') {
    const soakLabel = document.getElementById(SOAK_LABEL);
    if (rangeElement.value < 65) {
      soakLabel.innerText = 'SOAK Home';
    } else if (rangeElement.value > 64) {
      soakLabel.innerText = 'SOAK Stage';
    }
  }
}

function setControlDial (nameElement, rangeElement, valueElement, switchElement, webMidiAPISend) {
  updateDisplay(nameElement, rangeElement, valueElement, switchElement);
  rangeElement.addEventListener('input', function () {
    updateDisplay(nameElement, rangeElement, valueElement, switchElement);
    webMidiAPISend(rangeElement.value);
  });
}

const controlDials = [
  {
    name: 'Soak',
    rangeElement: document.getElementById('soak-knob'),
    valueElement: document.getElementById('soak-value'),
    webMidiAPISend: window.WebMidiAPI.sendCCPowerSoak
  },
  {
    name: 'Gain',
    rangeElement: document.getElementById('gain-knob'),
    valueElement: document.getElementById('gain-value'),
    webMidiAPISend: window.WebMidiAPI.sendCC2ndGAIN
  },
  {
    name: 'Master',
    rangeElement: document.getElementById('master-knob'),
    valueElement: document.getElementById('master-value'),
    webMidiAPISend: window.WebMidiAPI.sendCC2ndMASTER
  }
];

const switchElement = document.getElementById('switch-percent-nominal');
switchElement.addEventListener('change', function () {
  controlDials.forEach(function (controlDial) {
    updateDisplay(
      controlDial.name,
      controlDial.rangeElement,
      controlDial.valueElement,
      switchElement);
  });
});

controlDials.forEach(function (controlDial) {
  setControlDial(
    controlDial.name,
    controlDial.rangeElement,
    controlDial.valueElement,
    switchElement,
    controlDial.webMidiAPISend);
});
