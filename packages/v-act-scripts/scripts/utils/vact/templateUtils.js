/**
 * 模板相关的工具方法
 */
const juicer = require("juicer");
juicer.set({
    strip: false//设置不清除空白、换行字符
});
class NewJuicer {
    constructor(templateData) {
        this.templateData = templateData;
        this.options = {
            "slot": []
        };
    }
    addSlot(start, end, tempData) {
        this.options.slot.push({
            "start": start,
            "end": end,
            "tempData": tempData//指定模板数据
        });
    }
    parse(template) {
        let newData = template;
        if(this.options.slot.length > 0){
            this.options.slot.forEach((slot) => {
                juicer.set({
                    "tag::interpolateOpen": slot.start,
                    "tag::interpolateClose": slot.end
                });
                newData = juicer(newData, slot.tempData || this.templateData);
            });
        }else{
            newData = juicer(newData, this.templateData);
        }
        return newData;
    }
    setTemplateData(templateData){
        this.templateData = templateData;
    }
};
function create(templateData){
    let nj = new NewJuicer(templateData);
    return nj;
}
module.exports = {
    create
}