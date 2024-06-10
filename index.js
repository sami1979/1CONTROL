'use strict';

const SOAK_LABEL = 'soak-label';

/**
 * Updates the knob values and SOAK mode in the UI
 * @param {object} data
 * @param {string} data.nameElement
 * @param {HTMLElement} data.rangeElement
 * @param {HTMLElement} data.valueElement
 * @param {HTMLElement} data.switchElement
 */
function updateDisplay (data) {
  let value = data.rangeElement.value;
  if (data.switchElement.checked) {
    value = parseInt(value / 1.27).toFixed(0);
    value = String(value).concat(' %');
  }
  data.valueElement.textContent = value;

  if (data.nameElement === 'Soak') {
    const soakLabel = document.getElementById(SOAK_LABEL);
    if (data.rangeElement.value < 65) {
      soakLabel.innerText = 'SOAK Home';
    } else if (data.rangeElement.value > 64) {
      soakLabel.innerText = 'SOAK Stage';
    }
  }
}

/**
 * Function to initiate EventListener for knob
 * @param {object} data
 * @param {string} data.nameElement
 * @param {HTMLElement} data.rangeElement
 * @param {HTMLElement} data.valueElement
 * @param {HTMLElement} data.switchElement
 * @param {*} data.webMidiAPISend
 */
function setControlDial (data) {
  // nameElement, rangeElement, valueElement, switchElement, webMidiAPISend
  const updateDisplayData = {
    nameElement: data.nameElement,
    rangeElement: data.rangeElement,
    valueElement: data.valueElement,
    switchElement: data.switchElement
  };
  updateDisplay(updateDisplayData);
  data.rangeElement.addEventListener('input', function () {
    updateDisplay(updateDisplayData);
    data.webMidiAPISend(data.rangeElement.value);
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
      {
        name: controlDial.name,
        rangeElement: controlDial.rangeElement,
        valueElement: controlDial.valueElement,
        switchElement: switchElement
      }
    );
  });
});

controlDials.forEach(function (controlDial) {
  setControlDial(
    {
      nameElement: controlDial.name,
      rangeElement: controlDial.rangeElement,
      valueElement: controlDial.valueElement,
      switchElement: switchElement,
      webMidiAPISend: controlDial.webMidiAPISend
    }
  );
});
