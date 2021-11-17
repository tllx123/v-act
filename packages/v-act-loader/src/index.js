/**
 * 处理vactCfg配置文件中的theme和i18n
 */
const path = require('path');
const fs = require('fs');
const I18nHandler = require("./handler/I18n");
const ThemeHandler = require("./handler/Theme");

/**
 * 获取vact配置文件对象
 * @param {String} configFilePath 配置文件路径
 * @returns 
 */
function getVactCfg(configFilePath) {
  let config;
  const contentStr = fs.readFileSync(configFilePath);
  if (contentStr) {
    config = JSON.parse(new String(contentStr).toString());
  }
  if (!config) {
    return {};
  }
  return config
}
/**
 * 1、判断是否属于项目入口的index文件，若否，直接返回
 * 2、读取项目根目录下的.vactCfg文件
 * 3、调用theme、i18n处理器处理配置，得到处理后的脚本
 * 4、把脚本添加到index文件内容前面并返回
 * @param {String} content index文件内容
 * @returns 
 */
module.exports = function (content) {
  const { resourcePath, rootContext } = this;
  const baseSrc = path.join(rootContext, "\\src");
  const configFilePath = path.join(rootContext, ".vactCfg");
  if (!resourcePath.startsWith(baseSrc) || !fs.existsSync(configFilePath)) {//跳过非项目入口文件或者不存在配置文件的项目
    return content;
  }
  try {
    const datas = [];
    const config = getVactCfg(configFilePath);
    const { theme, i18n } = config;
    let script;
    if (theme) {
      script = ThemeHandler(theme);
      if (script) {
        datas.push(script);
      }
    }
    if (i18n) {
      script = I18nHandler(i18n);
      if (script) {
        datas.push(script);
      }
    }
    if (datas.length > 0) {
      datas.push(content);
      content = datas.join('\n');
    }
  } catch (error) {
    console.error(".vactCfg文件处理出错：", error);
  }
  return content;
}