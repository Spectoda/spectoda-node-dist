"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = exports.changeLanguage = void 0;
// In apps without i18next included use // import I18 from "https://esm.sh/i18next";
const i18next_1 = __importDefault(require("i18next"));
const translation_json_1 = __importDefault(require("./locales/cs/translation.json"));
const translation_json_2 = __importDefault(require("./locales/en/translation.json"));
const i18 = i18next_1.default.createInstance();
i18.init({
    lng: "en",
    debug: false,
    // supportedLngs: ["cs", "en", "cs-CZ", "en-US"],
    // fallbackLng: "en",
    resources: {
        cs: { translation: translation_json_1.default },
        "cs-CZ": { translation: translation_json_1.default },
        en: { translation: translation_json_2.default },
        "en-US": { translation: translation_json_2.default },
    },
    keySeparator: "__",
    contextSeparator: "__",
}, (err, t) => {
    // TEST
    // console.log("spectodajs translation", "Zpět", t("Zpět"));
    // console.log("spectodajs translation", "Zkusit znovu", t("Zkusit znovu"));
});
exports.changeLanguage = i18.changeLanguage;
exports.t = i18.t;
if (typeof window !== "undefined") {
    window.i18js = i18;
}
