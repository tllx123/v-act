import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

const create = function (ruleCode) {
  let windowScope = scopeManager.getWindowScope()
  let formula
  if (windowScope) {
    //先从各个插件系统中查找实现版本
    let series = windowScope.getSeries()
    formula = sb.getService(ruleCode, { type: series })
  }
  formula = formula || sb.getService(ruleCode)
  if (formula) {
    if (!formula.main) {
      throw factory.create({
        type: factory.TYPES.UnExpected,
        message:
          '[RuleFactory.create]规则【' +
          ruleCode +
          '】不符合规范，没有实现主入口main方法，请检查内部逻辑。'
      })
    }
    return formula
  } else {
    throw factory.create({
      type: factory.TYPES.UnExpected,
      message: '[RuleFactory.create]规则【' + ruleCode + '】加载失败。'
    })
  }
}

export { execute, executeRouteRule, executeWithRouteCallback, create }
