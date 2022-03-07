import { ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

//加载jsonUtil模块

//加载表达式计算模块
let formulaUtil

let sandBox

export function initModule(sBox) {
  sandBox = sBox
}
//规则主入口(必须有)
const main = function (ruleContext) {
  //获取规则上下文中的规则配置值
  let ruleCfgValue = ruleContext.getRuleCfg()
  //处理规则配置值
  let inParams = ruleCfgValue['inParams']

  let inParamsObj = jsonUtil.json2obj(inParams)
  let expression = inParamsObj['expression'] // 函数/表达式
  //		var retValue = formulaUtil.evalExpression(expression);
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let engine = sandBox.getService(
    'vjs.framework.extension.platform.services.engine.expression.ExpressionEngine'
  )
  let retValue = engine.execute({ expression: expression, context: context })
  try {
    setBusinessRuleResult(ruleContext, retValue + '')
  } catch (e) {
    throw '执行函数/表达式结果不能转为字符串类型,请检查'
  }
  return true
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, retValue) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      retValue: retValue
    })
  }
}

export { main }
