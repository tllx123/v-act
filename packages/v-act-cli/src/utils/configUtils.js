/**
 * 配置工具类
*/
const configFile = require("../configs/configs.json");
/**
 * 获取配置信息，若不指定key，则返回全部配置信息
 * @param {String} key 获取指定的配置
 * @returns {Object}
 */
function getConfig(key){
    if(key){
        return configFile[key];
    }
    return configFile;
}
module.exports={
    get: getConfig
}