import i18n from "i18next";
import { I18nextProvider ,Trans, useTranslation, Translation ,withTranslation, initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "Welcome to React": "Welcome to React and react-i18next"
                }
            }
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export {
    Trans,
    Translation,
    useTranslation,
    withTranslation,
    initReactI18next,
    I18nextProvider
}