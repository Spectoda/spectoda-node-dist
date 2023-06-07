"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spectodaDevice = void 0;
// import esPkg from 'essentia.js';
const Spectoda_1 = require("./lib/spectoda-js/Spectoda");
const Logging_1 = require("./lib/spectoda-js/Logging");
const fs_1 = __importDefault(require("fs"));
const functions_1 = require("./lib/spectoda-js/functions");
const spectodaDevice = new Spectoda_1.Spectoda("nodebluetooth", 0, true);
exports.spectodaDevice = spectodaDevice;
spectodaDevice.setDebugLevel(4);
spectodaDevice.assignOwnerSignature("a06cd5c4d5741b61fee69422f2590926");
spectodaDevice.assignOwnerKey("bfd39c89ccc2869f240508e9a0609420");
// spectodaDevice.assignConnector("dummy");
// if (typeof window !== "undefined") {
//   spectodaDevice.assignOwnerSignature(localStorage.getItem("ownerSignature") || "a06cd5c4d5741b61fee69422f2590926");
//   spectodaDevice.assignOwnerKey(localStorage.getItem("ownerKey") || "bfd39c89ccc2869f240508e9a0609420");
//   // @ts-ignore
//   window.spectodaDevice = spectodaDevice;
//   process.env.NODE_ENV === "development" && setLoggingLevel(4);
//   const url = new URL(location.href);
//   const params = new URLSearchParams(url.search);
//   if (params.get("demo")) {
//     setTimeout(() => {
//       spectodaDevice.assignConnector("dummy");
//     }, 300);
//   }
// }
// @ts-ignore
globalThis.spectodaDevice = spectodaDevice;
spectodaDevice.on("connected", async () => {
    Logging_1.logging.info("> Checking for updates...");
    await (0, functions_1.sleep)(1000);
    // upload latest FW
    if (fs_1.default.existsSync("assets/fw.txt")) {
        try {
            do {
                const fwFilePath = fs_1.default.readFileSync("assets/fw.txt", "utf8");
                const controllerFwInfo = await spectodaDevice.getFwVersion();
                const fwFileMatch = fwFilePath.match(/(\d+\.\d+\.\d+)_(\d+)/);
                if (!fwFileMatch) {
                    Logging_1.logging.error("Invalid firmware file format in fw.txt.");
                    break;
                }
                const controllerFwMatch = controllerFwInfo.match(/(\d+\.\d+\.\d+)_(\d+)/);
                if (!controllerFwMatch) {
                    Logging_1.logging.error("Invalid firmware version format from spectodaDevice.");
                    break;
                }
                const fwFileVersionDate = parseInt(fwFileMatch[2], 10);
                const controllerFwVersionDate = parseInt(controllerFwMatch[2], 10);
                if (controllerFwVersionDate >= fwFileVersionDate) {
                    Logging_1.logging.info("FW is up to date.");
                    break;
                }
                const filePath = `assets/${fwFilePath.trim()}`;
                if (!fs_1.default.existsSync(filePath)) {
                    Logging_1.logging.error(`Firmware file not found at: ${filePath}`);
                    break;
                }
                const fileData = fs_1.default.readFileSync(filePath);
                const uint8Array = new Uint8Array(fileData);
                await spectodaDevice.updateNetworkFirmware(uint8Array);
                Logging_1.logging.info("Firmware successfully updated.");
                return;
            } while (0);
        }
        catch (error) {
            Logging_1.logging.error(`Error updating firmware: ${error}`);
        }
    }
    if (fs_1.default.existsSync("assets/tngl.txt")) {
        // upload latest TNGL
        try {
            await spectodaDevice.syncTngl(fs_1.default.readFileSync("assets/tngl.txt", "utf8").toString());
        }
        catch (error) {
            Logging_1.logging.error(`Error updating TNGL: ${error}`);
        }
    }
    // // emit event that indicates the orange pi is connected
    // await spectodaDevice.emitEvent("READY");
});
spectodaDevice.on("ota_progress", (percentages) => {
    Logging_1.logging.info("OTA progress", percentages);
});
spectodaDevice.on("ota_status", (status) => {
    Logging_1.logging.info("OTA status", status);
});
