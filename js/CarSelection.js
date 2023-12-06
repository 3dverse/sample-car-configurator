import { appConfig } from "./appConfig.js";
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
  const selectedCar = appConfig.cars[selectedCarIndex];
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
    appConfig.carSceneRefName,
  );
  subscribeToEntityChanges(carEntity, () => {
    selectedCarIndex = appConfig.cars.findIndex(({ sceneUUID }) => {
      return carEntity.getComponent("scene_ref").value === sceneUUID;
    });
    render();
  });
}

export function nextCar() {
  selectedCarIndex = (selectedCarIndex + 1) % appConfig.cars.length;
  render();

  const selectedCar = appConfig.cars[selectedCarIndex];
  carEntity.setComponent("scene_ref", { value: selectedCar.sceneUUID });
  SDK3DVerse.engineAPI.commitChanges();
}
