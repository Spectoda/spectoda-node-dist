"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const communication_1 = require("./communication");
const Logging_1 = require("./lib/spectoda-js/Logging");
const functions_1 = require("./lib/spectoda-js/functions");
require("./server");
const fs_1 = __importDefault(require("fs"));
async function main() {
    await (0, functions_1.sleep)(1000);
    if (fs_1.default.existsSync("assets/mac.txt")) {
        const mac = fs_1.default.readFileSync("assets/mac.txt").toString();
        Logging_1.logging.info("Connecting to remembered device with MAC: " + mac);
        // @ts-ignore
        await communication_1.spectodaDevice.connect([{ mac: mac }], true, null, null, false, "", true);
    }
}
main();
