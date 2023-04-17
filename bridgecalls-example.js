"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.emitEvent = exports.spectodaEventSource = void 0;
const functions_1 = require("./lib/spectoda-js/functions");
const BASE_URL = "http://localhost:8888";
// TODO check performance, if slow switch to using subscription per "event" basis or throtthling
const evs = new EventSource(`${BASE_URL}/events`);
exports.spectodaEventSource = (0, functions_1.createNanoEvents)();
evs.onmessage = v => exports.spectodaEventSource.emit("event", JSON.parse(v.data));
function emitEvent(event) {
    return fetch(`${BASE_URL}/event`, { method: "POST", body: JSON.stringify(event), headers: { "Content-Type": "application/json" } }).then(v => v.json());
}
exports.emitEvent = emitEvent;
function connect(params) {
    return fetch(`${BASE_URL}/connect`, { method: "POST", body: JSON.stringify(params), headers: { "Content-Type": "application/json" } }).then(v => v.json());
}
exports.connect = connect;
