let aop:any

const _putAop = function (a:any) {
  aop = a
}

const getHook = function () {
  return window.V3PlatformAOP
}

let RuntimeV3PlatformAOP = {
  /**
   * 更新执行系统数据
   */
  update: function (componentCode:string, windowCode:string, ruleSetCode:string, ruleCode:string, json:string) {
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
  exeExp: function (expression:any) {
    var rs = aop.exeExp(expression)
    V3PlatformAOP.ExeExp(rs)
  }
}

if (window) {
  window.RuntimeV3PlatformAOP = RuntimeV3PlatformAOP
}

export { _putAop, getHook }
