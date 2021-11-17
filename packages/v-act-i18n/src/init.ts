/**
 * 1、获取当前语言提供者，从接口获取语言及语言项信息
 * 2、把语言及语言项转换成i18n所需的格式
 * 3、调用i18n接口进行初始化
 */

import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";

import LanguageManager from './manager/LanguageManager';

/**
 * 加载语言列表
 * @param languages 语言列表
 * @returns 
 */
function loadLanguageInfo(): {
    [proName: string]: {
        [proName: string]: {
            [proName: string]: string
        }
    }
} {
    //获取当前语言提供者
    const languageProvider = LanguageManager.getCurrentLanguageProvider();
    //获取语言列表
    const languages = languageProvider.getLanguages();
    let result: {
        [proName: string]: {
            [proName: string]: {
                [proName: string]: string
            }
        }
    } = {};
    languages.map((item) => {
        const code = item.getCode();
        const items: {
            [proName: string]: string
        } = {};
        languageProvider.getLanguageItems(code)?.map((_item) => {
            const val = _item.getValue();
            if (typeof val == 'string')
                items[_item.getName()] = val;
        });
        result[code] = {
            "translation": items//默认用translation命名空间
        };
    });
    return result;
}

i18n.use(LanguageDetector) //嗅探当前浏览器语言
    .use(initReactI18next) //init i18next
    .init({
        //引入资源文件
        resources: loadLanguageInfo(),
        // resources: {
        //   en: {
        //     translation: enUsTrans,
        //   },
        //   zh: {
        //     translation: zhCnTrans,
        //   },
        // },
        //选择默认语言，选择内容为上述配置中的key，即en/zh
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    })

export { }