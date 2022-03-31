import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'

//规则主入口(必须有)
let main = function (ruleContext: any) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  // 获取配置的信息实体
  let inputParams = inParams['inputParams']
  if (null == inputParams || undefined == inputParams) {
    throw new Error(
      '[PrdWorkflowChangeFrameDatas.main]改变流程框架数据异常，配置信息错误，获取不到配置信息！'
    )
  }
  let datas = inputParams['datas']
  let values = datas['values']
  if (null == values || undefined == values || values.length == 0) {
    throw new Error(
      '[PrdWorkflowChangeFrameDatas.main]改变流程框架数据异常，配置信息错误，获取不到配置信息！'
    )
  }
  // 拿到配置信息
  // 触发
  debugger
  triggerActionChange(values, ruleContext)
}

let triggerActionChange = function (values: any, ruleContext: any) {
  let frameInputParams = {}
  for (let i = 0; i < values.length; i++) {
    let value = values[i]
    let paramKey = value['paramKey']
    let paramValue = value['paramValue']
    if (!paramValue) {
      continue
    }
    let routeContext = ruleContext.getRouteContext()
    // 解析表达式取，获取打开的窗体编码信息
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    // 解析框架动作
    let frameValue = formulaUtil.execute({
      expression: paramValue,
      context: context
    })
    frameInputParams[paramKey] = frameValue
  }
  executeAPI(frameInputParams, ruleContext)
}

/**
 * 执行api
 */
let executeAPI = function (frameInputParams: any, ruleContext: any) {
  // 获取当前实例ID
  let currentScopeId = scopeManager.getCurrentScopeId()
  // 当前窗体实例Id
  let currentWindowScopeId
  // 若是ComponentScope，获取窗体域。这种是后台前端方法调用的情况
  if (scopeManager.isComponentScope(currentScopeId)) {
    // 获取窗体域信息
    let parentWindowScope = scopeManager.getParentWindowScope()
    if (!parentWindowScope) {
      throw new Error(
        '[PrdWorkflowChangeFrameDatas.executeAPI]改变流程框架数据异常，获取不到窗体信息！'
      )
    }
    // 获取窗体实例Id
    currentWindowScopeId = parentWindowScope.getInstanceId()
  }
  // 若当前是WindowScope，直接获取窗体域信息。这种是直接在窗体中调用的情况
  if (scopeManager.isWindowScope(currentScopeId)) {
    // 获取窗体实例Id
    currentWindowScopeId = currentScopeId
  }
  if (!currentWindowScopeId) {
    throw new Error(
      '[PrdWorkflowChangeFrameDatas.executeAPI]改变流程框架数据异常，获取不到窗体信息！'
    )
  }

  let isProcessFrmeWindow = scopeManager.createScopeHandler({
    scopeId: currentWindowScopeId,
    handler: function () {
      // 获取是否是流程框架窗体标识，判断是否是流程框架窗体
      var isProcessFrmeWindow = windowParam.getInput({
        code: 'isProcessFrmeWindow'
      })
      return isProcessFrmeWindow
    }
  })()
  let instanceRefs = new Array()
  let processFrameWindowScope
  if (!isProcessFrmeWindow) {
    // 根据当前窗体的实例ID获取父窗体的实例ID
    let parentWindowScopeId =
      scopeManager.getParentScopeId(currentWindowScopeId)
    if (!parentWindowScopeId) {
      return
    }
    instanceRefs.push(parentWindowScopeId)
    // 根据父窗体的实例ID获取父窗体的Scope对象
    processFrameWindowScope = scopeManager.getScope(parentWindowScopeId)
  } else {
    // 当前currentWindowScopeId就是流程框架窗体实例。这里直接获取框架窗体
    instanceRefs.push(currentWindowScopeId)
    processFrameWindowScope = scopeManager.getScope(currentWindowScopeId)
  }
  // 获取框架窗体的所在构件编码
  let frameActionComponentCode = processFrameWindowScope.getComponentCode()
  // 获取框架窗体的窗体编码
  let frameActionWindow = processFrameWindowScope.getWindowCode()
  // 固定API编码
  let frameActionAPI = 'API_WorkflowChangeFrameDatas'
  ruleContext.markRouteExecuteUnAuto()
  let callBackFunc = function (output: any) {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
  let ruleSetParams = {
    targetConfig: {
      //client-ruleSet(客户端)，server-ruleSet(服务端)
      sourceType: 'client-ruleSet',
      invokeType: 'api',
      componentCode: frameActionComponentCode,
      windowCode: frameActionWindow,
      ruleSetCode: frameActionAPI
    },
    inputParam: frameInputParams,
    config: {
      instanceRefs: instanceRefs,
      success: function (output: any) {
        callBackFunc(output)
      },
      error: function (output: any) {
        alert(output)
      }
    }
  }
  routeEngine.execute(ruleSetParams)
}
export { main }
