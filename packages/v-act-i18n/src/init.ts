/**
 * 1、获取当前语言提供者，从接口获取语言及语言项信息
 * 2、把语言及语言项转换成i18n所需的格式
 * 3、调用i18n接口进行初始化
 */

import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";

import I18nFactory from './manager/I18nFactory';

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
    //获取语言列表
    const languages = I18nFactory.getLanguages();
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
        I18nFactory.getLanguageItems(code)?.map((_item) => {
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
/**
 * 初始化语言
 */
function init(){
    const languages = loadLanguageInfo();
    // i18n.use(LanguageDetector) //嗅探当前浏览器语言：暂不支持根据浏览器语言设置，因为目前是服务端渲染，客户端切换过语言后（存在localStorage），会导致服务端和客户端渲染的内容不一致
    i18n.use(initReactI18next) //init i18next
        .init({
            //引入资源文件
            resources: languages,
            // resources: {
            //   en: {
            //     translation: enUsTrans,
            //   },
            //   zh: {
            //     translation: zhCnTrans,
            //   },
            // },
            //选择默认语言，选择内容为上述配置中的key，即en/zh
            fallbackLng: "zh",
            debug: false,
            interpolation: {
                escapeValue: false, // not needed for react as it escapes by default
            },
        })
}


export {
    init
}