"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const communication_1 = require("./communication");
const Logging_1 = require("./lib/spectoda-js/Logging");
require("./server");
const fs_1 = __importDefault(require("fs"));
async function main() {
    if (fs_1.default.existsSync("mac.txt")) {
        const mac = fs_1.default.readFileSync("mac.txt").toString();
        Logging_1.logging.info("Connecting to remembered device with MAC: " + mac);
        // @ts-ignore
        await communication_1.spectodaDevice.connect([{ mac: mac }]);
    }
}
main();
