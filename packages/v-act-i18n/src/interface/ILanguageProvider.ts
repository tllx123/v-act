import Language from "../model/Language";
import LanguageItem from "../model/LanguageItem";

/**
 * 语言提供者
 */
 interface ILanguageProvider{
     /**
      * 获取标志
      */
     getCode():string
    /**
     * 获取语言列表
     */
    getLanguages():Language[]

    /**
     * 根据语言编码获取语言项列表
     * @param languageCode 语言编码
     */
    getLanguageItems(languageCode:string):LanguageItem[]

}

export default ILanguageProvider;