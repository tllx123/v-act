/**
 * V平台对象定义
 * @constructor
 * @alias VObject
 * @catalog 二次开发/规则
 */
class VObject {
  vObject: any

  constructor(vObject: any) {
    this.vObject = vObject
  }

  /**
   * 获取规则输入配置
   * @param {String} code 配置编号
   * @returns Any
   */
  getInput(code: string) {
    return this.vObject.getInput(code)
  }
}

export default VObject
