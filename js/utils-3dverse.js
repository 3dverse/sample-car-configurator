import AssetEditorAPI from "./AssetEditorAPI.js";
import { config } from "./config.js";

/**
 * @param {[number, number, number]} destinationPosition
 * @param {[number, number, number, number]} destinationOrientation
 */
export function changeCameraPosition(
  destinationPosition,
  destinationOrientation,
) {
  const { cameraAPI } = SDK3DVerse.engineAPI;
  const viewport =
    cameraAPI.currentViewportEnabled || cameraAPI.getActiveViewports()[0];

  cameraAPI.travel(
    viewport,
    destinationPosition,
    destinationOrientation,
    10,
  );
}

function getCamera() {
  const { cameraAPI } = SDK3DVerse.engineAPI;
  const viewport =
    cameraAPI.currentViewportEnabled || cameraAPI.getActiveViewports()[0];
  return viewport.getCamera();
}

export function getCameraSettings() {
  const camera = getCamera();
  return camera.getComponent("camera").dataJSON;
}

/** @param {Record<string, any>} settings */
export function setCameraSettings(settings) {
  const camera = getCamera();
  const cameraComponent = camera.getComponent("camera");
  Object.assign(cameraComponent.dataJSON, settings);
  camera.setComponent("camera", settings);
  SDK3DVerse.engineAPI.commitChanges();
}

/**
 * @param {string} assetType
 * @param {string} assetUUID
 * @returns {Promise<AssetDescription>}
 */
export async function getAssetDescription(assetType, assetUUID) {
  const res = await fetch(
    `${SDK3DVerse.webAPI.apiURL}/assets/${assetType}/${assetUUID}/description`,
    {
      headers: {
        User_token: config.publicUserToken || "",
      },
    },
  );
  const data = await res.json();
  if (res.status >= 400) {
    throw data;
  }
  return data;
}

/**
 * @param {string} assetUUID
 * @param {string} assetType
 * @param {(desc: AssetDescription) => void} callback
 * @returns {AssetEditorAPI}
 */
export function subscribeToAssetEditorAPI(assetUUID, assetType, callback) {
  const api = new AssetEditorAPI(
    config.publicUserToken,
    /**
     * @param {string} event
     * @param {AssetDescription} desc
     */
    (event, desc) => {
      if (event === "assetUpdated") {
        callback(desc);
      }
    },
  );
  api
    .connect(assetType, assetUUID)
    .then(({ description }) => callback(description));
  return api;
}

export async function showClientAvatars() {
  const clientDisplayEX = await SDK3DVerse.installExtension(
    SDK3DVerse_ClientDisplay_Ext,
  );
  const clientAvatarContent = await fetch("img/client-avatar.svg").then((res) =>
    res.text(),
  );
  clientDisplayEX.showClientAvatars({
    // depending on the size of your scene you might want to adjust the radius
    radius: 80,
    /** @param {{ color: string }} params */
    getClientAvatarSrc({ color }) {
      const svgContent = clientAvatarContent
        .replace(/FG_COLOR/g, color)
        .replace(/BG_COLOR/g, "#ffffff");
      const url = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
      return url;
    },
    /** @param {{ clientUUID: string }} params */
    getClientDisplayName({ clientUUID }) {
      // Convert the UUID to something that looks sort of like a word
      const name = [...clientUUID]
        .filter((s) => /[a-zA-Z]/.test(s))
        .slice(0, 5)
        .join("");
      const nameCapitalized = `${name[0].toUpperCase()}${name.slice(1)}`;
      return `User ${nameCapitalized}`;
    },
  });
}

/**
 * @param {Entity} entity
 * @param {() => void} callback
 */
export function subscribeToEntityChanges(entity, callback) {
  callback();
  SDK3DVerse.notifier.on(
    "onEntitiesUpdated",
    /** @param  {Entity[] | Record<string, Entity>} update */
    (update) => {
      const updatedEntities =
        update instanceof Array ? update : Object.values(update);
      if (updatedEntities.includes(entity)) {
        callback();
      }
    },
  );
}
