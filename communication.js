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
const { exec } = require('child_process');
const spectodaDevice = new Spectoda_1.Spectoda("nodebluetooth", true, true);
exports.spectodaDevice = spectodaDevice;
spectodaDevice.setDebugLevel(3);
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
    try {
        const controllerName = await spectodaDevice.readControllerName();
        if (fs_1.default.existsSync("assets/name.txt")) {
            const name = fs_1.default.readFileSync("assets/name.txt").toString();
            Logging_1.logging.info("Remembered device name: " + name);
            if (controllerName != name) {
                await spectodaDevice.writeControllerName(name);
            }
        } else {
            fs_1.default.writeFileSync("assets/name.txt", controllerName);
        }
        await (0, functions_1.sleep)(1000);
    } catch (e) {
        Logging_1.logging.info("Naming error", e);
    }
    // upload latest FW
    if (fs_1.default.existsSync("assets/fw.txt")) {
        try {
            do {
                const fwFilePath = fs_1.default.readFileSync("assets/fw.txt", "utf8");
                const controllerFwInfo = await spectodaDevice.getFwVersion().catch(() => { return "UNKNOWN_0.0.0_00000000"; });
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
    // restart moonraker-spectoda-connector so that the events about the state are emitted
    exec('systemctl restart moonraker-spectoda-connector.service', (error, stdout, stderr) => {
        if (error) {
            Logging_1.logging.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            Logging_1.logging.error(`Stderr: ${stderr}`);
            return;
        }
        Logging_1.logging.info(`Stdout: ${stdout}`);
    });
});
spectodaDevice.on("ota_progress", (percentages) => {
    Logging_1.logging.info("OTA progress", percentages);
});
spectodaDevice.on("ota_status", (status) => {
    Logging_1.logging.info("OTA status", status);
});
