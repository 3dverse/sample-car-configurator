import { config } from "./config.js";
import { subscribeToEntityChanges } from "./utils-3dverse.js";

let rotationOn = false;

function render() {
  /** @type {HTMLElement} */ (
    document.getElementById("rotate-toggle")
  ).classList.toggle("active", rotationOn);
}

export function initUI() {
  render();
}

/** @type {Entity} */
let isAnimationActiveTokenEntity;

export async function setup() {
  // It's possible to subscribe to changes in animation state, but not yet
  // possible to ask if an animation is already taking place when joining a
  // session.
  //
  // In order to keep the UI in sync for all clients, the easiest
  // workaround is to keep an extra blank entity with a toggled 'tags'
  // component. Tags can be used to store custom data that isn't necessarily
  // able to be queried from 3dverse otherwise.
  [isAnimationActiveTokenEntity] =
    await SDK3DVerse.engineAPI.findEntitiesByNames(
      config.isAnimationActiveTokenEntityName,
    );
  subscribeToEntityChanges(isAnimationActiveTokenEntity, () => {
    rotationOn = isAnimationActiveTokenEntity
      .getComponent("tags")
      .value.includes("animationIsActive");
    render();
  });
}

export function toggleRotationOn() {
  rotationOn = !rotationOn;
  render();

  if (rotationOn) {
    SDK3DVerse.engineAPI.playAnimationSequence(
      config.rotationAnimationSequenceUUID,
    );
  } else {
    SDK3DVerse.engineAPI.pauseAnimationSequence(
      config.rotationAnimationSequenceUUID,
    );
  }

  // We are going to use a blank entity in the scene to track the
  // rotation state until we have a way to query animation state
  isAnimationActiveTokenEntity.setComponent("tags", {
    value: rotationOn ? ["animationIsActive"] : [],
  });
  SDK3DVerse.engineAPI.commitChanges();
}
