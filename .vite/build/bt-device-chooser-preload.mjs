"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  bleScan: (callback) => electron.ipcRenderer.on("ble-scan", (_event, data) => callback(data)),
  deviceSelected: (deviceId) => electron.ipcRenderer.send("deviceSelected", deviceId)
});
//# sourceMappingURL=bt-device-chooser-preload.mjs.map
