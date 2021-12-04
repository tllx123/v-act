/**
 * Vact默认多语言
 */
import ILanguageProvider from "../../interface/ILanguageProvider"
import Language from "../../model/Language";
import LanguageItem from "../../model/LanguageItem";
import languageConfig from "./VActLanguage.json";

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

const languageObjs: Language[] = languages.map((item) => {
    const { code, name, items } = item;
    const lItems: LanguageItem[] = [];
    items.map((item)=>{
        lItems.push(new LanguageItem(item.code, item.name, item.value));
    })
    languageMap[code] = lItems;
    return new Language(code, name);
});
class VactImpl implements ILanguageProvider {
    getCode(): string {
        return "VAct"
    }
    getLanguageItems(languageCode: string): LanguageItem[] {
        return languageMap[languageCode];
    }
    getLanguages(): Language[] {
        return languageObjs;
    }
}

const instance = new VactImpl();

export default instance as VactImpl;