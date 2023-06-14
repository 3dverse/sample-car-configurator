import { config } from "./config.js";
import { subscribeToEntityChanges } from "./utils-3dverse.js";

/** @typedef {(typeof config)['cubemaps'][number]} Cubemap */

const template = Handlebars.compile(
  /** @type {HTMLElement} */ (
    document.getElementById("cubemap-selection-template")
  ).innerHTML,
);

function initialRender() {
  /** @type {HTMLElement} */ (
    document.getElementById("cubemap-selection")
  ).innerHTML = template({
    cubemaps: config.cubemaps.map((cubemap) => ({
      displayName: cubemap.name,
      previewSrc: cubemap.previewSrc,
    })),
  });
}

/**
 * @param {object} params
 * @param {Cubemap | undefined} params.selectedCubemap
 */
function updateRender({ selectedCubemap }) {
  document
    .querySelectorAll("#cubemap-selection .cubemap")
    .forEach((cubemap, i) => {
      cubemap.classList.toggle(
        "active-cubemap",
        Boolean(
          selectedCubemap && config.cubemaps.indexOf(selectedCubemap) === i,
        ),
      );
    });
}

export function initUI() {
  initialRender();
  updateRender({ selectedCubemap: config.cubemaps[0] });
}

/** @type {Entity} */
let environmentEntity;

export async function setup() {
  [environmentEntity] = await SDK3DVerse.engineAPI.findEntitiesByNames(
    config.environmentEntityName,
  );
  subscribeToEntityChanges(environmentEntity, () => {
    updateRender({
      selectedCubemap: config.cubemaps.find(({ skyboxUUID }) => {
        return (
          environmentEntity.getComponent("environment").skyboxUUID ===
          skyboxUUID
        );
      }),
    });
  });
}

/** @param {number} cubemapIndex */
export function changeCubemap(cubemapIndex) {
  updateRender({ selectedCubemap: config.cubemaps[cubemapIndex] });

  const { skyboxUUID, radianceUUID, irradianceUUID } =
    config.cubemaps[cubemapIndex];
  environmentEntity.setComponent("environment", {
    skyboxUUID,
    radianceUUID,
    irradianceUUID,
  });
  SDK3DVerse.engineAPI.commitChanges();
}
