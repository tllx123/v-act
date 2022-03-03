import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
//加载jsonUtil模块
let undefined
//加载表达式计算模块
let formulaUtil
let undefined
let sandBox

exports.initModule = function (sBox) {
  sandBox = sBox
}
//规则主入口(必须有)
let main = function (ruleContext) {
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
