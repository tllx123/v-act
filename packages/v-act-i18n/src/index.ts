/**
 * 1、初始化i18n
 * 2、定义并导出vact提供的i18n接口
 */

 import { getI18n } from 'react-i18next';

 import Language from './model/Language';
 import LanguageManager from './manager/LanguageManager';
 import LanguageFactory from './manager/LanguageFactory';
 //初始化i18n
 import './init';
 
 //#region vact提供的i18n接口
 /**
  * 获取语言对象
  * @returns 语言对象
  */
 function getLanguage(): Language | undefined {
     const languageProvider = LanguageManager.getCurrentLanguageProvider();
     const languages = languageProvider.getLanguages();
     const i18n = getI18n();
     if (i18n) {
         const code = i18n.language;
         return languages.filter((language: Language) => language.getCode() == code)[0]
     }
 }
 
 /**
  * 设置语言
  * @param language 语言编码或者语言对象
  */
 function setLanguage(language: string | Language): void {
     const code = language instanceof Language ? language.getCode() : language;
     const i18n = getI18n();
     if (i18n) {
         i18n.changeLanguage(code);
     }
 }
 /**
  * 获取语言列表
  * @returns 获取列表
  */
 function getLanguages() {
     const languageProvider = LanguageManager.getCurrentLanguageProvider();
     return languageProvider.getLanguages();
 }
 
 //#endregion
 
 export * from 'react-i18next';
 export {
     Language,
     setLanguage,
     getLanguage,
     LanguageFactory as I18nFactory,
     getLanguages
 };