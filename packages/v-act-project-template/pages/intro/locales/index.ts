import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import langs from "./message/index";
import { onLanguageChanged, setLanguageMetadata, getMessage } from "v3-react-i18n-utils";

setLanguageMetadata(langs);

i18n.use(initReactI18next)
    .init({
        resources: {
            "zh-CN": {
                translation: getMessage(),
            }
        },
        lng: "zh-CN",
        interpolation: {
            escapeValue: false
        }
    });

onLanguageChanged((lang) => {
    let langCode = lang.code;
    let message = lang.message;
    i18n.addResourceBundle(langCode, "translation", message);
    i18n.changeLanguage(langCode);
});