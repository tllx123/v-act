/**
 * 规则输出定义
 * @constructor
 * @alias RuleOutput
 * @catalog 二次开发/规则
 */
function RuleOutput(output) {
  this.output = output
}

RuleOutput.prototype = {
  /**
   * 获取规则输出
   * @param {String} code 输出编号
   * @returns Any
   */
  get: function (code: string) {
    return this.output.get(code)
  },

  /**
   * 设置规则输出
   * @param {String} code 输出编号
   * @param {Any} value 输出值
   */
  set: function (code: string, value: any) {
    this.output.set(code, value)
  }
}

export default RuleOutput
