import { getSelectedCarIndex } from "./CarSelection.js";
import { config } from "./config.js";
import {
  getAssetDescription,
  subscribeToAssetEditorAPI,
} from "./utils-3dverse.js";

/** @type {[number, number, number]} */
let selectedColor = config.colorChoices[0];
/** @type {(typeof config.materials)[number] | null} */
let selectedMaterial = config.materials[0];

const colorsTemplate = Handlebars.compile(
  /** @type {HTMLElement} */ (
    document.getElementById("colors-selection-template")
  ).innerHTML,
);

const cssToSdkColorChoicesMap = config.colorChoices.reduce(
  (colorsMap, sdkColor) => {
    const cssColorString = `rgb(${sdkColor
      .map((value) => Math.round(value * 255))
      .join(",")})`;
    return colorsMap.set(cssColorString, sdkColor);
  },
  /** @type {Map<string, [number, number, number]>} */ (new Map()),
);

function renderColors() {
  /** @type {HTMLElement} */ (
    document.getElementById("colors-selection")
  ).innerHTML = colorsTemplate({
    colors: [...cssToSdkColorChoicesMap.entries()].map(
      ([cssColor, sdkColor]) => {
        const averageRgb =
          sdkColor.reduce((total, value) => total + value, 0) / 3;
        // All the colors are pretty dark but we display them in the menu
        // with double brightness, so we want to check if their average is
        // above 0.25, not 0.5.
        const useDarkAccent = averageRgb > 0.25;
        return {
          cssColor,
          isActive: sdkColor === selectedColor,
          useDarkAccent,
        };
      },
    ),
  });
}

function renderMaterials() {
  document
    .querySelectorAll("#materials-selection .material-icon")
    .forEach((icon, i) => {
      icon.classList.toggle(
        "active-material",
        Boolean(
          selectedMaterial &&
            config.materials.indexOf(selectedMaterial) === i,
        ),
      );
    });
}

export function initUI() {
  renderColors();
  renderMaterials();
}

/** @type {import("./AssetEditorAPI.js").default[]} */
let paintAssetEditors;

/** @type {AssetDescription[]} */
let sourceAssetDescriptions = [];
/** @type {AssetDescription[]} */
let paintAssetDescriptions = [];

export async function setup() {
  // The source assets aren't expected to change so we fetch them once
  await Promise.all(
    config.materials.map(async ({ matUUID }, i) => {
      sourceAssetDescriptions[i] = await getAssetDescription(
        "materials",
        matUUID,
      );
    }),
  );

  // Each car has its own paint material which gets updated by copying the
  // source asset descriptions. The current state of the color and material
  // selections is based on the paint asset description.
  paintAssetEditors = config.cars.map((car, i) =>
    subscribeToAssetEditorAPI(car.paintMaterialUUID, "material", (desc) => {
      paintAssetDescriptions[i] = desc;

      const carPaintDataJson = desc.dataJson;
      selectedColor = config.colorChoices.find((color) => {
        return (
          // albedo might be empty, defaults to 1,1,1,
          // although if our scene is properly configured
          // this should never happen.
          (carPaintDataJson.albedo || [1, 1, 1]).every((v, i) => color[i] === v)
        );
      }) ||
        // we shouldn't need to fall back but in case we changed the color
        // in the scene to something we don't recognize, we want to store it
        // so that this color is used when we switch cars.
        carPaintDataJson.albedo || [1, 1, 1];

      selectedMaterial =
        config.materials.find((_, i) => {
          const sourceMaterialDataJson = sourceAssetDescriptions[i].dataJson;
          const { clearCoatRoughness, clearCoatStrength } = carPaintDataJson;
          return (
            sourceMaterialDataJson.clearCoatRoughness === clearCoatRoughness &&
            sourceMaterialDataJson.clearCoatStrength === clearCoatStrength
          );
        }) || null;

      renderColors();
      renderMaterials();
    }),
  );
}

function applySelectedMaterial() {
  const desc = selectedMaterial
    ? sourceAssetDescriptions[config.materials.indexOf(selectedMaterial)]
    : // If we can't identify which of the model materials was used to
      // create the current paint material, just copy the description from
      // the car paint. This allows users to modify materials in the
      // scene editor without breaking the app. This will also deselect
      // all material options in the UI, until a new option is clicked.
      paintAssetDescriptions[getSelectedCarIndex()];

  desc.dataJson.albedo = selectedColor;
  config.cars.forEach((_, i) => {
    paintAssetEditors[i].updateAsset(desc);
  });
}

/** @param {string} cssColor */
export function changeSelectedColor(cssColor) {
  const newSelectedColor = cssToSdkColorChoicesMap.get(cssColor);
  if (newSelectedColor) {
    selectedColor = newSelectedColor;
    renderColors();
    applySelectedMaterial();
  } else {
    throw new Error(`Unrecognized color: ${cssColor}`);
  }
}

/** @param {number} materialIndex */
export function changeSelectedMaterial(materialIndex) {
  selectedMaterial = config.materials[materialIndex];
  renderMaterials();

  applySelectedMaterial();
}
