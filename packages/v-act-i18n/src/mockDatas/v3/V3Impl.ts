/**
 * v3对接vact多语言
 */
import ILanguageProvider from "../../interface/ILanguageProvider"
import Language from "../../model/Language";
import LanguageItem from "../../model/LanguageItem";
import languageConfig from "./V3Language.json";

//语言列表
const languages: Array<{
    "code": string,
    "name": string,
    "items": Array<{
        "code":string,
        "name":string,
        "value":string
    }>
}> = languageConfig.languages;
//语言编码与语言项的映射信息
const languageMap: {
    [proName: string]: LanguageItem[]
} = {};
//语言对象列表
const languageObjs: Language[] = languages.map((item) => {
    const { code, name, items } = item;
    const lItems: LanguageItem[] = [];
    items.map((item)=>{
        lItems.push(new LanguageItem(item.code, item.name, item.value));
    })
    languageMap[code] = lItems;
    return new Language(code, name);
});
class V3Impl implements ILanguageProvider {
    getCode(): string {
        return "V3";
    }
    getLanguageItems(languageCode: string): LanguageItem[] {
        return languageMap[languageCode];
    }
    getLanguages(): Language[] {
        return languageObjs;
    }
}

const instance = new V3Impl();

export default instance as V3Impl;