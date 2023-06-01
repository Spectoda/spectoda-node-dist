"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.getError = exports.SpectodaError = void 0;
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
// Using @ts-ignore as we can guarantee the the error code is always found
const getError = (errorCode, env) => {
    // @ts-ignore
    if (env === "app" && errorCode in errorLibrary_2.app)
        return errorLibrary_2.app[errorCode] || errorLibrary_1.unknownError;
    // @ts-ignore
    if (env === "studio" && errorCode in errorLibrary_2.studio)
        return errorLibrary_2.studio[errorCode] || errorLibrary_1.unknownError;
    if (errorCode in errorLibrary_2.general)
        return errorLibrary_2.general[errorCode] || errorLibrary_1.unknownError;
    else
        return errorLibrary_1.unknownError;
};
exports.getError = getError;
const throwError = (errorCode) => {
    throw new Error(errorCode);
};
exports.throwError = throwError;
