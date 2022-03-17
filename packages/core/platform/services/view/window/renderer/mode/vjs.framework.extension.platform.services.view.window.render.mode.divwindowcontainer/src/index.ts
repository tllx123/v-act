import { ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

export function render(params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var title = params.title
  var windowInputParams = params.inputs
  var inParams = params.inParams
  var ruleContext = params.ruleContext
  var businessRuleResult = params.businessRuleResult || {}

  windowInputParams['variable']['formulaOpenMode'] = 'vuiWindowContainer'

  //			////////////////////////////////////////////////////////////////////
  var isDynamicContainer = false //是否动态传入
  isDynamicContainer = inParams.isDynamicContainer
  //取Div窗体容器widget-code
  var _$containerCode = inParams.windowContainer
  //如果是动态传入，则按表达式解析
  if (isDynamicContainer) {
    var context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    _$containerCode = formulaUtil.execute({
      expression: _$containerCode,
      context: context
    })
  }
  //			////////////////////////////////////////////////////////////////////

  var widgetId = inParams.divCode
  var __inited = params.inited
  var callBackFunc = function () {
    if (typeof __inited == 'function') {
      __inited(businessRuleResult['windowInstanceCode'] || arguments[0])
    } else {
      ruleContext.fireRuleCallback()
      ruleContext.fireRouteCallback()
    }
  }
  var containerParam = {
    containerCode: _$containerCode /* 这个是标签的code */,
    componentCode: componentCode,
    windowCode: windowCode,
    inputParams: windowInputParams,
    callBackFunc: callBackFunc,
    divCode: widgetId /* 这个是标签所在div的code */,
    title: title
  }
  var scopeId = scopeManager.getCurrentScopeId()
  var _$callback = function (params) {
    var cId = params._iden,
      _windowInstanceCode =
        params.scopeId /* 激活时有值，非激活时，下面重新赋值 */,
      exist = params.existIden
    if (exist) {
      var _fireRuleFunc = containerParam.callBackFunc
      businessRuleResult['windowInstanceCode'] = _windowInstanceCode
      if (!__inited) {
        // 设置业务返回值  	内部有异步逻辑，需重新设置返回值 触发释放规则链之前要设置返回值
        ruleContext.setBusinessRuleResult(businessRuleResult)
      }
      if (typeof _fireRuleFunc == 'function') {
        _fireRuleFunc()
      }
    } else {
      containerParam.containerId = cId
      scopeManager.openScope(scopeId)
      /* 不存在时，重新取窗体实例 */
      _windowInstanceCode = actionHandler.executeWidgetAction(
        widgetId,
        'renderWindowToVuiContainer',
        containerParam
      )
      businessRuleResult['windowInstanceCode'] = _windowInstanceCode
      if (!__inited) {
        // 设置业务返回值  	内部有异步逻辑，需重新设置返回值
        ruleContext.setBusinessRuleResult(businessRuleResult)
      }
      scopeManager.closeScope()
    }
  }
  containerParam.callback = _$callback
  /* 标识为打开规则打开 */
  containerParam.OpenMode = 'OpenRule'
  widgetProperty.set(widgetId, 'openWindowToDivContainer', containerParam)
  ruleContext.markRouteExecuteUnAuto()
}
