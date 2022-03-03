/**
 * V平台对象定义
 * @constructor
 * @alias VObject
 * @catalog 二次开发/规则
 */
function VObject(vObject) {
  this.vObject = vObject
}

VObject.prototype = {
  /**
   * 获取规则输入配置
   * @param {String} code 配置编号
   * @returns Any
   */
  getInput: function (code: string) {
    return this.vObject.getInput(code)
  }
}

export default VObject
