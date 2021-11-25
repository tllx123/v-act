import Language from "../model/Language";
import LanguageItem from "../model/LanguageItem";
import { init } from '../init'
/**
 * 多语言工厂
 */
class I18nFactory {
    pool: {
        [proName: string]: {
            obj: Language,
            items?: LanguageItem[]
        }
    } = {}
    /**
     * 注册语言
     * @param language 语言对象或者固定格式的语言数据
     * @param items 语言项列表
     */
    register(language: Language|{
        [proName:string]:{
            [proName:string]:string
        }
    }[], items?: LanguageItem[]): void {
        if(language instanceof Language){//根据对象注册
            const code = language.getCode();
            this.pool[code] = {
                obj: language,
                items: items
            }
        }else{//根据固定格式注册
            for (let i = 0; i < language.length; i++) {
                const config = language[i];
                for (const code in config) {
                    if (Object.prototype.hasOwnProperty.call(config, code)) {
                        const itemMap = config[code];
                        const items = [];
                        for (const itemCode in itemMap) {
                            if (Object.prototype.hasOwnProperty.call(itemMap, itemCode)) {
                                items.push(new LanguageItem(itemCode, itemCode, itemMap[itemCode]))
                            }
                        }
                        this.register(new Language(code), items);
                    }
                }
            }
            //根据配置注册的语言需要默认初始化i18n，否则首页无法直接获取多语言数据
            init();
            // language.map((config)=>{
            //     for (const code in config) {
            //         if (Object.prototype.hasOwnProperty.call(config, code)) {
            //             const itemMap = config[code];
            //             const items = [];
            //             for (const itemCode in itemMap) {
            //                 if (Object.prototype.hasOwnProperty.call(itemMap, itemCode)) {
            //                     items.push(new LanguageItem(itemCode, itemMap[itemCode]))
            //                 }
            //             }
            //             this.register(new Language(code), items);
            //         }
            //     }
            // })
        }
    }
    /**
     * 注销语言
     * @param languageCode 语言编码
     */
    unRegister(languageCode:string):void{
        delete this.pool[languageCode];
    }
    /**
     * 获取全部语言列表
     * @returns 语言列表
     */
    getLanguages():Language[]{
        const languages:Language[] = [];
        for (const code in this.pool) {
            if (Object.prototype.hasOwnProperty.call(this.pool, code)) {
                const element = this.pool[code];
                languages.push(element.obj);
            }
        }
        return languages;
    }
    /**
     * 根据语言编码获取语言对象
     * @param languageCode 获取语言
     * @returns 语言对象
     */
    getLanguage(languageCode:string):Language|null{
        if(this.pool.hasOwnProperty(languageCode)){
            return this.pool[languageCode].obj;
        }
        return null;
    }
    /**
     * 根据语言编码获取语言项列表
     * @param languageCode 语言编码
     * @returns 语言项列表
     */
    getLanguageItems(languageCode:string):LanguageItem[]|null{
        if(this.pool.hasOwnProperty(languageCode) && this.pool[languageCode].items){
            return this.pool[languageCode].items || null;
        }
        return null;
    }
}
export default new I18nFactory();