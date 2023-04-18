"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const communication_1 = require("./communication");
const Logging_1 = require("./lib/spectoda-js/Logging");
require("./server");
const fs_1 = __importDefault(require("fs"));

communication_1.spectodaDevice.on("connected", async () => {

   let version = await communication_1.spectodaDevice.getFwVersion();
   console.log(version);

    //     // TODO upload latest FW
    //    if(version != "UNIVERSAL_0.9.0_20230413") {

    //     const filePath = "./UNIVERSAL_0.9.0_20230413.enc";
    //     const fileData = fs_1.readFileSync(filePath);
    //     const uint8Array = new Uint8Array(fileData);
    //     await spectodaDevice.updateDeviceFirmware(uint8Array);

    //     return;
    //    }

   // upload latest TNGL
   await communication_1.spectodaDevice.syncTngl(`
        
    // Light logic
    const light = genSmoothOut(genLastEventParam($light), 1s);
    addLayer(0s, Infinity, {
        addDrawing(0s, Infinity, animFill(Infinity, #ffffff));
    }).modifyBrightness(&light);
    // Update animation
    catchEvent($INJEC).setValue(0%).emitAs($UPDAT);
    const time = mapValue(genLastEventParam($UPDAT), 0%, 100%, 0s, 100s);
    const mask = mapValue(genLastEventParam($UPDAT), 0%, 0.01%, 100%, 0%);
    scaLayer(0s, Infinity, {
        addDrawing(0s, Infinity, animFill(Infinity, #ffffff));
    }).modifyBrightness(&mask);
    addLayer(0s, Infinity, {
        addDrawing(0s, Infinity, animFade(100s, #ff0000, #00ff00).animFill(Infinity, #00ff00));
        scaDrawing(0s, Infinity, animLoadingBar(100s, #ffffff, #000000).animFill(Infinity, #ffffff));
    }).modifyTimeSet(&time);
    
   `);

   // emit event that indicates the orange pi is connected
   await communication_1.spectodaDevice.emitEvent("READY");

});

communication_1.spectodaDevice.setDebugLevel(3);

async function main() {

    if (fs_1.default.existsSync("mac.txt")) {
        const mac = fs_1.default.readFileSync("mac.txt").toString();
        Logging_1.logging.info("Connecting to remembered device with MAC: " + mac);
        
        await communication_1.spectodaDevice.connect([{ mac: mac }], true, null, null, false, "", true);
    }
}
main();
