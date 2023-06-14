import * as SceneLoader from "./SceneLoader.js";
import * as CarSelection from "./CarSelection.js";
import * as CarPaint from "./CarPaint.js";
import * as Environment from "./Environment.js";
import * as LightsViewOption from "./LightsViewOption.js";
import * as RotationViewOption from "./RotationViewOption.js";
import * as RGBGradientViewOption from "./RGBGradientViewOption.js";
import * as LuminosityViewOption from "./LuminosityViewOption.js";
import * as SharePrompt from "./SharePrompt.js";
import * as TimeoutOverlay from "./TimeoutOverlay.js";

// Expose UI components to global scope so their exports can handle UI events
// from our HTML
Object.assign(window, {
  UI: {
    CarSelection,
    CarPaint,
    Environment,
    LightsViewOption,
    RotationViewOption,
    RGBGradientViewOption,
    LuminosityViewOption,
    TimeoutOverlay,
  },
});

async function initApp() {
  // Render all of our UI components in their initial states
  for (const uiComponent of [
    SceneLoader,
    CarSelection,
    CarPaint,
    Environment,
    LightsViewOption,
    RotationViewOption,
    RGBGradientViewOption,
    LuminosityViewOption,
    SharePrompt,
    TimeoutOverlay,
  ]) {
    uiComponent.initUI();
  }

  // In order for us to load the current state information in the UI, we first
  // need to connect to 3dverse.
  await SceneLoader.setupLivelinkConnection();

  // Now we run after-connection setup for our UI components that need it
  for (const uiComponent of [
    CarSelection,
    CarPaint,
    Environment,
    LightsViewOption,
    RotationViewOption,
    RGBGradientViewOption,
    LuminosityViewOption,
    TimeoutOverlay,
  ]) {
    uiComponent.setup();
  }
}

initApp();
