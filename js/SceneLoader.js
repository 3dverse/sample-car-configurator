import { appConfig } from "./appConfig.js";
import {
  setCameraSettings,
  changeCameraPosition,
  showClientAvatars,
} from "./utils-3dverse.js";

/**
 * This sets up the canvas display, gets connected with 3dverse,
 * and initializes some camera settings for the user.
 *
 * It updates the loading overlay with info about
 * each async operation, and hides the loading overlay once
 * it's finished.
 */
export async function setupLivelinkConnection() {
  await SDK3DVerse.joinOrStartSession({
    sceneUUID: appConfig.sceneUUID,
    userToken: appConfig.publicUserToken,
    canvas: /** @type {HTMLCanvasElement} */ (
      document.getElementById("display-canvas")
    ),
    isTransient: true,
    viewportProperties: {
      defaultControllerType: SDK3DVerse.controller_type.orbit,
    },
    maxDimension: 1920,
  });

  const mediaQuery = window.matchMedia("(max-width: 890px)");
  mediaQuery.addEventListener("change", repositionCameraOnResize);
  repositionCameraOnResize(mediaQuery);
  // these are the right bloom settings to emphasize
  // the emission of the car headlights
  setCameraSettings({
    bloom: true,
    bloomStrength: 1,
    bloomThreshold: 50,
  });

  await showClientAvatars();

  // hide scene ref cache container (suspended 1000 meters in the air to avoid
  // being seen during page loading)
  const [sceneRefCache] = await SDK3DVerse.engineAPI.findEntitiesByNames(
    "SCENE_REF_CACHE",
  );
  SDK3DVerse.engineAPI.setEntityVisibility(sceneRefCache, false);
}

/** @param {MediaQueryList | MediaQueryListEvent} mediaQuery */
function repositionCameraOnResize(mediaQuery) {
  if (mediaQuery.matches) {
    changeCameraPosition(
      [-4.595289707183838, 1.6792974472045898, 8.23273754119873],
      [
        -0.08518092334270477, -0.2508307993412018, -0.02216341346502304,
        0.9640212059020996,
      ],
    );
    SDK3DVerse.updateControllerSetting({ speed: 1, sensitivity: 0.8 });
  } else {
    changeCameraPosition(
      [-3.3017091751098633, 1.3626002073287964, 4.2906060218811035],
      [
        -0.12355230003595352, -0.3068566918373108, -0.04021146148443222,
        0.9428451061248779,
      ],
    );
    SDK3DVerse.updateControllerSetting({ speed: 1, sensitivity: 0.4 });
  }
}
