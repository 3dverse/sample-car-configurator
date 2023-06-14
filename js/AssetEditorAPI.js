// @ts-nocheck
// (we will externalize this so no use spending time typing it right now)

const baseUrl = `wss://${new URL(SDK3DVerse.webAPI.apiURL).host}/legacy`;

export default class AssetEditorAPI {
  constructor(userToken, callback) {
    this.callstack = [];
    this.socket = null;
    this.callback = callback;
    this.webSocketURL = `${baseUrl}/asset/edit?token=${userToken}`;
  }

  async connect(assetType, assetUUID) {
    return new Promise((resolve, reject) => {
      this.disconnect();
      let resolved = false;
      this.socket = new WebSocket(
        `${this.webSocketURL}&assetType=${assetType}&assetUUID=${assetUUID}&sessionUUID=${SDK3DVerse.webAPI.sessionId}`,
      );
      this.socket.binaryType = "arraybuffer";
      this.socket.onmessage = (message) => {
        const payload = JSON.parse(message.data);
        const error =
          (payload.type === "error" && payload.message) ||
          (payload.errorNum && payload);
        if (error) {
          console.error(error);
          if (!resolved) {
            reject(error);
          }
          return;
        }
        switch (payload.type) {
          case "create-asset":
            this.handleRequestResponse(payload.data);
            break;
          case "update-asset":
          case "update-properties":
            this.callback("assetUpdated", payload.data);
            break;
          case "connect-confirmation":
            resolved = true;
            resolve(payload.data);
            break;
          case "next-undo-redo":
            this.callback("nextUndoRedo", payload.data);
            break;
        }
      };
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.callstack = [];
      this.socket = null;
    }
  }

  updateAsset(description, doCommit = false) {
    this.sendRequest("update-asset", { description, doCommit });
  }

  sendRequest(type, data = {}) {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          type: type,
          data: data,
        }),
      );
    }
  }

  handleRequestResponse(data) {
    const callback = this.callstack.shift();
    callback && callback(data);
  }
}
