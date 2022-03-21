import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

const create = function (ruleCode: string) {
  let windowScope = scopeManager.getWindowScope()
  const ruleDefines = windowScope.get('ruleDefines')
  let formula = ruleDefines[ruleCode]
  /*if (windowScope) {
    //先从各个插件系统中查找实现版本
    let series = windowScope.getSeries()
    formula = sb.getService(ruleCode, { type: series })
  }
  formula = formula || sb.getService(ruleCode)*/
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

const createRuleException = function (params) {
  let ruleContext = params.ruleContext,
    e = params.exception,
    message = params.message
  if (factory.isException(e)) {
    return e
  }
  return ruleContext.createRuleException(params)
}

export { create, createRuleException }
