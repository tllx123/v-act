import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import langs from "./locales";
import vactI18n from "v-act-i18n";

const namespace = vactI18n.getComponentNamespace("Demo");

vactI18n.register(namespace,langs);


const watcher = vactI18n.getLanguageWacther(namespace);

const language = watcher.getLanguage();

const locale:{[proName: string]:{}} = {};

if(language!=null){
    locale[namespace] = language.getMessages();
}

i18n.use(initReactI18next)
    .init({
        resources: {
            "zh-CN": locale
        },
        lng: "zh-CN"
    });

watcher.onLanguageChanged((language) => {
    let langCode = language.getCode();
    let message = language.getMessages();
    i18n.addResourceBundle(langCode, namespace, message);
    i18n.changeLanguage(langCode);
});