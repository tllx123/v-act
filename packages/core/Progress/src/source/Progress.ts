import * as ProgressBarUtil from '.BarUtil'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let display = inParamsObj['display']
  let msgnote = inParamsObj['msgnote']
  let isGlobal =
    (inParamsObj['displaytype'] + '').toLowerCase() === 'current' ? false : true
  let winScope = scopeManager.getWindowScope()
  let currentScopeId = winScope.getInstanceId()
  if (display) {
    let msg = null,
      series = winScope.getSeries()
    // 处理手机端加载提示信息
    if ('bootstrap_mobile' == series) msg = '正在加载...'
    if (msgnote != null && msgnote != '') {
      msg = experssFunc(msgnote, routeContext)
    }
    if (null == msg || '' == msg) {
      msg = '数据加载中，请稍后...'
    }
    //处理在构件方法中执行报未找到窗体容器实例的问题
    scopeManager.createScopeHandler({
      scopeId: currentScopeId,
      handler: function () {
        ProgressBarUtil.showProgress(msg, isGlobal)
      }
    })()
    //            ProgressBarUtil.showProgress(msg, isGlobal);
    //            var scopeId = scopeManager.getCurrentScopeId();
    let scope = scopeManager.getScope(currentScopeId)
    scope.on(
      scopeManager.EVENTS.DESTROY,
      (function (sId, isG) {
        return function () {
          scopeManager.openScope(sId)
          ProgressBarUtil.hideProgress(isG)
          scopeManager.closeScope()
        }
      })(currentScopeId, isGlobal)
    )
    let routeContext = ruleContext.getRouteContext()
    routeContext.on({
      eventName: routeContext.Events.EXCEPTION,
      handler: function () {
        ProgressBarUtil.hideProgress(isGlobal)
      }
    })
    routeContext.on({
      eventName: routeContext.Events.INTERRUPT,
      handler: function () {
        ProgressBarUtil.hideProgress(isGlobal)
      }
    })
  } else {
    //处理在构件方法中执行报未找到窗体容器实例的问题
    scopeManager.createScopeHandler({
      scopeId: currentScopeId,
      handler: function () {
        ProgressBarUtil.hideProgress(isGlobal)
      }
    })()
  }

  let callbackFunc = function () {
    //ruleContext.fireRuleCallback();
    ruleContext.setRuleStatus(true)
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }

  //TODO 临时解决方案，待规则全部调整后去除
  //ruleContext.setRuleCallbackFireFlag(true);
  ruleContext.markRouteExecuteUnAuto()
  setTimeout(callbackFunc, 100)
  return true
}
/*执行表达式*/
let experssFunc = function (experss, routeContext) {
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  if (undefined == experss || null == experss) return null
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}
export { main }
