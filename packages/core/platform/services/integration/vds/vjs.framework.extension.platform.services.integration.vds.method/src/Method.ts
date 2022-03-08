/**
 * 方法对象
 * @constructor
 * @alias Method
 * @catalog 工具方法/方法定义
 */
var Method = function (method) {
  this.method = method
}
Method.prototype = {
  _get: function () {
    return this.method
  },
  /**
   * 获取所有方法输入定义信息
   * */
  getInputs: function () {
    return this._get().getInputs()
  },
  /**
   * 获取指定的方法输入变量定义信息
   * @param {String} inputCode 变量编码
   * @returns {@link ParamConfig} 参数对象
   * */
  getInput: function (inputCode) {
    return this._get().getInput(inputCode)
  }
}

module.exports = Method
