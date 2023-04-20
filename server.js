"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseota = exports.sse = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const communication_1 = require("./communication");
const cors_1 = __importDefault(require("cors"));
const express_sse_ts_1 = __importDefault(require("express-sse-ts"));
const fs_1 = __importDefault(require("fs"));
const jsonParser = body_parser_1.default.json();
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8888;
app.use(jsonParser);
app.use(urlencodedParser);
app.use((0, cors_1.default)());
exports.sse = new express_sse_ts_1.default();
exports.sseota = new express_sse_ts_1.default();
app.get("/events", exports.sse.init);
communication_1.spectodaDevice.on("emitted_events", (events) => {
    for (const event of events) {
        exports.sse.send(JSON.stringify(event));
    }
});
app.get("/ota-progress", exports.sseota.init);
communication_1.spectodaDevice.on("ota_progress", (progress) => {
    exports.sse.send(JSON.stringify(progress));
});
app.get("/scan", async (req, res) => {
    // TODO
    // const devices = await spectodaDevice.interface?.scan();
    // res.json(devices);
    res.json("Not implemented");
});
app.post("/connect", async (req, res) => {
    const { key, signature, mac, name, remember } = req.body;
    try {
        if (signature) {
            communication_1.spectodaDevice.assignOwnerSignature(signature);
        }
        if (key) {
            communication_1.spectodaDevice.assignOwnerKey(key);
        }
        if (mac) {
            //@ts-ignore
            const result = await communication_1.spectodaDevice.connect([{ mac: mac }], true, null, null, false, "", true);
            remember && fs_1.default.writeFileSync("assets/mac.txt", mac);
            return res.json({ status: "success", result: result });
        }
        if (name) {
            const controllers = await communication_1.spectodaDevice.scan([{ name: name }]);
            controllers.length != 0 && controllers[0].mac && remember && fs_1.default.writeFileSync("assets/mac.txt", controllers[0].mac);
            const result = await communication_1.spectodaDevice.connect(controllers, true, null, null, false, "", true);
            return res.json({ status: "success", result: result });
        }
        const controllers = await communication_1.spectodaDevice.scan([{}]);
        controllers.length != 0 && controllers[0].mac && remember && fs_1.default.writeFileSync("assets/mac.txt", controllers[0].mac);
        const result = await communication_1.spectodaDevice.connect(controllers, true, null, null, false, "", true);
        return res.json({ status: "success", result: result });
    }
    catch (error) {
        res.statusCode = 405;
        return res.json({ status: "error", error: error });
    }
});
app.post("/disconnect", async (req, res) => {
    try {
        const result = await communication_1.spectodaDevice.disconnect();
        return res.json({ status: "success", result: result });
    }
    catch (error) {
        res.statusCode = 405;
        return res.json({ status: "error", error: error });
    }
});
app.post("/event", async (req, res) => {
    const event = req.body;
    try {
        if (event.label === undefined || event.label === null) {
            res.statusCode = 400;
            return res.json({ status: "error", result: "no label specified" });
        }
        if (event.value === undefined || event.value === null) {
            const result = await communication_1.spectodaDevice.emitEvent(event.label, event.destination);
            return res.json({ status: "success", result: result });
        }
        switch (event.type) {
            case "percentage": {
                const result = await communication_1.spectodaDevice.emitPercentageEvent(event.label, event.value, event.destination);
                return res.json({ status: "success", result: result });
            }
            case "color": {
                const result = await communication_1.spectodaDevice.emitColorEvent(event.label, event.value, event.destination);
                return res.json({ status: "success", result: result });
            }
            case "timestamp": {
                const result = await communication_1.spectodaDevice.emitTimestampEvent(event.label, event.value, event.destination);
                return res.json({ status: "success", result: result });
            }
            default: {
                const result = await communication_1.spectodaDevice.emitEvent(event.label, event.destination);
                return res.json({ status: "success", result: result });
            }
        }
    }
    catch (error) {
        res.statusCode = 405;
        return res.json({ status: "error", error: error });
    }
});
app.post("/tngl", (req, res) => {
    // TODO: implement, type for write/sync tngl
});
app.get("/tngl-fingerprint", (req, res) => {
    // TODO return finger print of the device
});
app.post("/notifier", async (req, res) => {
    const { message } = req.body;
    try {
        let parsed = {};
        message.split(" ").forEach(c => {
            const [key, value] = c.split("=");
            if (key && value) {
                parsed[key.toLowerCase()] = value;
            }
        });
        console.log(parsed);
        const label = parsed["label"] ?? undefined;
        const value = parsed["value"] ?? undefined;
        const type = parsed["type"] ?? undefined;
        if (label === undefined || label === null) {
            res.statusCode = 400;
            return res.json({ status: "error", result: "no label specified" });
        }
        if (value === undefined || value === null) {
            const result = await communication_1.spectodaDevice.emitEvent(label);
            return res.json({ status: "success", result: result });
        }
        if (label) {
            switch (type) {
                case "percentage": {
                    const result = await communication_1.spectodaDevice.emitPercentageEvent(label, Number(value));
                    return res.json({ status: "success", result: result });
                }
                case "color": {
                    const result = await communication_1.spectodaDevice.emitColorEvent(label, value);
                    return res.json({ status: "success", result: result });
                }
                case "timestamp": {
                    const result = await communication_1.spectodaDevice.emitTimestampEvent(label, Number(value));
                    return res.json({ status: "success", result: result });
                }
                default: {
                    const result = await communication_1.spectodaDevice.emitEvent(label);
                    return res.json({ status: "success", result: result });
                }
            }
            const result = await communication_1.spectodaDevice.emitEvent(label.substring(0, 5), 255);
            return res.json({ status: "success", result: result });
        }
    }
    catch (error) {
        res.statusCode = 405;
        return res.json({ status: "error", error: error });
    }
});
app.post("/upload-fw", async (req, res) => {
    try {
        const filePath = "/home/pi/spectoda/fw.enc";
        const fileData = fs_1.default.readFileSync(filePath);
        const uint8Array = new Uint8Array(fileData);
        const result = await communication_1.spectodaDevice.updateDeviceFirmware(uint8Array);
        return res.json({ status: "success", result: result });
    }
    catch (error) {
        res.statusCode = 405;
        return res.json({ status: "error", error: error });
    }
});
//An error handling middleware
// @ts-ignore
app.use(function (err, req, res, next) {
    res.status(500);
    res.send("Oops, something went wrong.");
});
app.use("/assets", express_1.default.static('assets'));
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
