import { getCameraSettings, setCameraSettings } from "./utils-3dverse.js";

let userCameraLuminosity = 1;

function render() {
  const luminosityValue = userCameraLuminosity.toString();
  /** @type {HTMLElement} */ (
    document.getElementById("luminosity-value")
  ).innerHTML = luminosityValue;
  /** @type {HTMLInputElement} */ (
    document.getElementById("luminosity-slider")
  ).value = luminosityValue;
}

export function initUI() {
  render();
}

export async function setup() {
  // We just need to get the brightness, no need to subscribe after, because
  // the camera settings are per-client... i.e. only we can change it.
  userCameraLuminosity = getCameraSettings().brightness;
}

/** @param {{ target: HTMLInputElement }} e */
export function changeUserCameraLuminosity(e) {
  userCameraLuminosity = Number(e.target.value);
  render();

  setCameraSettings({
    brightness: userCameraLuminosity,
  });
}
