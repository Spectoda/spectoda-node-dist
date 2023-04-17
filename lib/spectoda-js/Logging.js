"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeLoggingElswhere = exports.setLoggingLevel = exports.logging = exports.DEBUG_LEVEL_VERBOSE = exports.DEBUG_LEVEL_DEBUG = exports.DEBUG_LEVEL_INFO = exports.DEBUG_LEVEL_WARN = exports.DEBUG_LEVEL_ERROR = exports.DEBUG_LEVEL_NONE = void 0;
exports.DEBUG_LEVEL_NONE = 0;
exports.DEBUG_LEVEL_ERROR = 1;
exports.DEBUG_LEVEL_WARN = 2;
exports.DEBUG_LEVEL_INFO = 3;
exports.DEBUG_LEVEL_DEBUG = 4;
exports.DEBUG_LEVEL_VERBOSE = 5;
exports.logging = {
    error: console.error,
    warn: console.warn,
    info: console.log,
    debug: console.log,
    verbose: function (...msg) { },
};
function setLoggingLevel(level) {
    exports.logging.error = level >= 1 ? console.error : function (...msg) { };
    exports.logging.warn = level >= 2 ? console.warn : function (...msg) { };
    exports.logging.info = level >= 3 ? console.log : function (...msg) { };
    exports.logging.debug = level >= 4 ? console.log : function (...msg) { };
    exports.logging.verbose = level >= 5 ? console.log : function (...msg) { };
}
exports.setLoggingLevel = setLoggingLevel;
function routeLoggingElswhere(funcn) {
    exports.logging.error = funcn;
    exports.logging.warn = funcn;
    exports.logging.info = funcn;
    exports.logging.debug = funcn;
    exports.logging.verbose = funcn;
}
exports.routeLoggingElswhere = routeLoggingElswhere;
if (typeof window !== "undefined") {
    window.DEBUG_LEVEL_NONE = exports.DEBUG_LEVEL_NONE;
    window.DEBUG_LEVEL_ERROR = exports.DEBUG_LEVEL_ERROR;
    window.DEBUG_LEVEL_WARN = exports.DEBUG_LEVEL_WARN;
    window.DEBUG_LEVEL_INFO = exports.DEBUG_LEVEL_INFO;
    window.DEBUG_LEVEL_DEBUG = exports.DEBUG_LEVEL_DEBUG;
    window.DEBUG_LEVEL_VERBOSE = exports.DEBUG_LEVEL_VERBOSE;
    window.setLoggingLevel = setLoggingLevel;
}
if (globalThis) {
    globalThis.DEBUG_LEVEL_NONE = exports.DEBUG_LEVEL_NONE;
    globalThis.DEBUG_LEVEL_ERROR = exports.DEBUG_LEVEL_ERROR;
    globalThis.DEBUG_LEVEL_WARN = exports.DEBUG_LEVEL_WARN;
    globalThis.DEBUG_LEVEL_INFO = exports.DEBUG_LEVEL_INFO;
    globalThis.DEBUG_LEVEL_DEBUG = exports.DEBUG_LEVEL_DEBUG;
    globalThis.DEBUG_LEVEL_VERBOSE = exports.DEBUG_LEVEL_VERBOSE;
    globalThis.setLoggingLevel = setLoggingLevel;
}
