"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spectodaDevice = void 0;
// import esPkg from 'essentia.js';
const Spectoda_1 = require("./lib/spectoda-js/Spectoda");
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
