import { appConfig } from "./appConfig.js";
import { subscribeToEntityChanges } from "./utils-3dverse.js";

/** @typedef {(typeof appConfig)['cubemaps'][number]} Cubemap */

const template = Handlebars.compile(
  /** @type {HTMLElement} */ (
    document.getElementById("cubemap-selection-template")
  ).innerHTML,
);

function initialRender() {
  /** @type {HTMLElement} */ (
    document.getElementById("cubemap-selection")
  ).innerHTML = template({
    cubemaps: appConfig.cubemaps.map((cubemap) => ({
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
          selectedCubemap && appConfig.cubemaps.indexOf(selectedCubemap) === i,
        ),
      );
    });
}

export function initUI() {
  initialRender();
  updateRender({ selectedCubemap: appConfig.cubemaps[0] });
}

/** @type {Entity} */
let environmentEntity;

export async function setup() {
  [environmentEntity] = await SDK3DVerse.engineAPI.findEntitiesByNames(
    appConfig.environmentEntityName,
  );
  subscribeToEntityChanges(environmentEntity, () => {
    updateRender({
      selectedCubemap: appConfig.cubemaps.find(({ skyboxUUID }) => {
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
  updateRender({ selectedCubemap: appConfig.cubemaps[cubemapIndex] });

  const { skyboxUUID, radianceUUID, irradianceUUID } =
    appConfig.cubemaps[cubemapIndex];
  environmentEntity.setComponent("environment", {
    skyboxUUID,
    radianceUUID,
    irradianceUUID,
  });
  SDK3DVerse.engineAPI.commitChanges();
}
