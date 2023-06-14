import { config } from "./config.js";
import { subscribeToEntityChanges } from "./utils-3dverse.js";

let rgbGradientOn = false;

function render() {
  /** @type {HTMLInputElement} */ (
    document.getElementById("rgb-gradient")
  ).checked = rgbGradientOn;
}

export function initUI() {
  render();
}

/** @type {Entity} */
let platformEntity;
/** @type {Entity} */
let gradientPlatformEntity;

export async function setup() {
  // We turn the RGB platform on and off by removing or replacing its
  // mesh ref. Because the main car platform uses the same mesh, we can just
  // read its mesh ref and assign it to the RGB platform.
  [platformEntity, gradientPlatformEntity] =
    await SDK3DVerse.engineAPI.findEntitiesByNames(
      config.platformEntityName,
      config.gradientPlatformEntityName,
    );
  subscribeToEntityChanges(gradientPlatformEntity, () => {
    rgbGradientOn =
      gradientPlatformEntity.getComponent("mesh_ref").value ===
      platformEntity.getComponent("mesh_ref").value;
    render();
  });
}

export function toggleRgbGradientOn() {
  rgbGradientOn = !rgbGradientOn;
  render();

  gradientPlatformEntity.setComponent("mesh_ref", {
    value: rgbGradientOn
      ? platformEntity.getComponent("mesh_ref").value
      : SDK3DVerse.utils.invalidUUID,
  });
  SDK3DVerse.engineAPI.commitChanges();
}
