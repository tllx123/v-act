let aop

const _putAop = function (a) {
  aop = a
}

const getHook = function () {
  return window.V3PlatformAOP
}

let RuntimeV3PlatformAOP = {
  /**
   * 更新执行系统数据
   */
  update: function (componentCode, windowCode, ruleSetCode, ruleCode, json) {
    try {
      aop.update(componentCode, windowCode, ruleSetCode, ruleCode, json)
    } catch (e) {
      var msg = typeof e.getMessage == 'function' ? e.getMessage() : e.message
      V3PlatformAOP.handleException(
        componentCode,
        windowCode,
        ruleSetCode,
        ruleCode,
        msg
      )
    }
  },
  /**
   * 执行表达式
   */
  exeExp: function (expression) {
    var rs = aop.exeExp(expression)
    V3PlatformAOP.ExeExp(rs)
  }
}

if (window) {
  window.RuntimeV3PlatformAOP = RuntimeV3PlatformAOP
}

export { _putAop, getHook }
