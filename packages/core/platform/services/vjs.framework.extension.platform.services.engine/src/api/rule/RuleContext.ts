import VObject from './VObject'

function RuleContext(mock) {
  this.mock = mock
}

RuleContext.prototype = {
  getInput: function (code) {
    if (this.mock) {
      return this.mock._getInput(code)
    }
    //获取真实配置值
  },

  getVObject: function () {
    return new VObject(this)
  }
}

export default RuleContext
