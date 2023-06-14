import { config } from "./config.js";
import { subscribeToEntityChanges } from "./utils-3dverse.js";

let selectedCarIndex = 0;

export function getSelectedCarIndex() {
  return selectedCarIndex;
}

const template = Handlebars.compile(
  /** @type {HTMLElement} */ (document.getElementById("car-heading-template"))
    .innerHTML,
);

function render() {
  const selectedCar = config.cars[selectedCarIndex];
  var [firstWord, ...otherWords] = selectedCar.name.split(" ");
  /** @type {HTMLElement} */ (
    document.getElementById("car-heading")
  ).innerHTML = template({
    firstWord,
    afterFirstWord: otherWords.join(" "),
    credits: selectedCar.credits,
  });
}

export function initUI() {
  render();
}

/** @type {Entity} */
let carEntity;

export async function setup() {
  [carEntity] = await SDK3DVerse.engineAPI.findEntitiesByNames(
    config.carSceneRefName,
  );
  subscribeToEntityChanges(carEntity, () => {
    selectedCarIndex = config.cars.findIndex(({ sceneUUID }) => {
      return carEntity.getComponent("scene_ref").value === sceneUUID;
    });
    render();
  });
}

export function nextCar() {
  selectedCarIndex = (selectedCarIndex + 1) % config.cars.length;
  render();

  const selectedCar = config.cars[selectedCarIndex];
  carEntity.setComponent("scene_ref", { value: selectedCar.sceneUUID });
  SDK3DVerse.engineAPI.commitChanges();
}
