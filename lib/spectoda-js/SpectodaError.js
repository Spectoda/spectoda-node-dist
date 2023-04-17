"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getError = exports.SpectodaError = void 0;
const errorLibrary_1 = require("./errors/errorLibrary");
const errorLibrary_2 = require("./errors/errorLibrary");
class SpectodaError extends Error {
    code;
    isOperational;
    constructor(code, isOperational = true) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = code;
        this.isOperational = isOperational;
    }
}
exports.SpectodaError = SpectodaError;
const getError = (errorCode, env) => {
    if (env == "nara" && errorCode in errorLibrary_2.nara)
        return errorLibrary_2.nara[errorCode] || errorLibrary_1.unknownError;
    if (env == "studio" && errorCode in errorLibrary_2.studio)
        return errorLibrary_2.studio[errorCode] || errorLibrary_1.unknownError;
    if (errorCode in errorLibrary_2.general)
        return errorLibrary_2.general[errorCode] || errorLibrary_1.unknownError;
    else
        return errorLibrary_1.unknownError;
};
exports.getError = getError;
