
const v3Configs = require("../../../config/vactConfig.json");
/**
 * 获取模版占位符信息
 */
function getTemplateSlot(){
    return v3Configs["TemplateSlot"];
}
module.exports = {
    getTemplateSlot
}