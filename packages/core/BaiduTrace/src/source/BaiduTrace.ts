import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { Baidutrace as BaiduTrace } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'

let undefined
exports.initModule = function (sBox) {
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  let entity = experssFunc(inParamObj.entity, routeContext)
  let operation = inParamObj.operation
  if (operation == 'start') {
    startGather(entity, ruleContext)
  } else {
    stopGather(entity, ruleContext)
  }
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 开始上传轨迹
 */
let startGather = function (entityName, ruleContext) {
  let successCB = function (success) {
    setBusinessRuleResult(ruleContext, true, '')
    ruleContext.fireRouteCallback()
  }
  let errorCB = function (errorMsg) {
    setBusinessRuleResult(ruleContext, false, errorMsg)
    ruleContext.fireRouteCallback()
  }
  BaiduTrace.startGather(entityName, successCB, errorCB)
}

/**
 * 停止上传轨迹
 */
let stopGather = function (entityName, ruleContext) {
  let successCB = function (success) {
    setBusinessRuleResult(ruleContext, true, '')
    ruleContext.fireRouteCallback()
  }
  let errorCB = function (errorMsg) {
    setBusinessRuleResult(ruleContext, false, errorMsg)
    ruleContext.fireRouteCallback()
  }
  BaiduTrace.stopGather(entityName, successCB, errorCB)
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, result, errorMsg) {
  errorMsg = errorMsg ? errorMsg : ''
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isSuccess: result,
      errorMsg: errorMsg
    })
  }
}

/**
 * desc 执行表达式
 * experss 表达式
 * routeContext 路由上下文
 * vjs:
 * 		"vjs.framework.extension.platform.services.engine":null,
 * services:
 * 		ExpressionContext = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionContext");
 * 		engine = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionEngine");
 *
 * */
function experssFunc(experss, routeContext) {
  if (experss == null || experss == '') {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}

export { main }
