import { config } from "./config.js";
import { subscribeToAssetEditorAPI } from "./utils-3dverse.js";

let lightsOn = true;

function render() {
  /** @type {HTMLElement} */ (
    document.getElementById("light-toggle")
  ).classList.toggle("active", lightsOn);
}

export function initUI() {
  render();
}

/** @type {import("./AssetEditorAPI.js").default[]} */
let headlightAssetEditors;
/** @type {import("./AssetEditorAPI.js").default[]} */
let rearlightAssetEditors;

/** @type {AssetDescription[]} */
let headlightAssetDescriptions = [];
/** @type {AssetDescription[]} */
let rearlightAssetDescriptions = [];

export async function setup() {
  // We assume emission intensity will be 0 for lights off and 100 for lights on
  headlightAssetEditors = config.cars.map((car, i) =>
    subscribeToAssetEditorAPI(car.headLightsMatUUID, "material", (desc) => {
      headlightAssetDescriptions[i] = desc;
      lightsOn = (desc.dataJson.emissionIntensity || 0) > 0;
      render();
    }),
  );
  // We can drive the lights UI state based on the headlights only, and assume<
  // the rearlights are in the same state.
  rearlightAssetEditors = config.cars.map((car, i) =>
    subscribeToAssetEditorAPI(car.rearLightsMatUUID, "material", (desc) => {
      rearlightAssetDescriptions[i] = desc;
    }),
  );
}

export function toggleLightsOn() {
  lightsOn = !lightsOn;
  render();

  const intensity = lightsOn ? 100 : 0;

  // Each car has its own materials for headlights and rearlights, so whenever
  // we toggle this option, we want to update the materials for every car.
  config.cars.forEach((_, i) => {
    const desc1 = headlightAssetDescriptions[i];
    desc1.dataJson.emissionIntensity = intensity;
    headlightAssetEditors[i].updateAsset(desc1);

    const desc2 = rearlightAssetDescriptions[i];
    desc2.dataJson.emissionIntensity = intensity;
    rearlightAssetEditors[i].updateAsset(desc2);
  });
}
