/**
 * @param {object} params
 * @param {boolean} params.isUserInactive
 * @param {boolean} params.wasDisconnected
 */
function render({ isUserInactive, wasDisconnected }) {
  const timeoutOverlay = /** @type {HTMLElement} */ (
    document.getElementById("timeout-overlay")
  );
  timeoutOverlay.classList.toggle(
    "hidden",
    !isUserInactive && !wasDisconnected,
  );
  /** @type {HTMLElement} */ (
    timeoutOverlay.querySelector(".inactive-message")
  ).classList.toggle("hidden", !isUserInactive);
  /** @type {HTMLElement} */ (
    timeoutOverlay.querySelector(".disconnected-message")
  ).classList.toggle("hidden", !wasDisconnected);
}

/** @type {(() => void) | null} */
let resumeCallback = null;

export function initUI() {
  render({ isUserInactive: false, wasDisconnected: false });
}

export function setup() {
  // @ts-ignore
  SDK3DVerse.setInactivityCallback((callback) => {
    render({ isUserInactive: true, wasDisconnected: false });
    resumeCallback = callback;
  });

  SDK3DVerse.notifier.on("onConnectionClosed", () => {
    render({ isUserInactive: false, wasDisconnected: true });
  });
}

export function stayConnected() {
  render({ isUserInactive: false, wasDisconnected: false });

  if (resumeCallback) {
    resumeCallback();
  }
}
