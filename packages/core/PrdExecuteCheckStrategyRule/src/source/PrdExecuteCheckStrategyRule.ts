import { JsonUtil as jsonUtil } from 'packages/core/WebRule_WorkFlowProcessMenuActionExecute/src/source/node_modules/packages/core/WebFunc_PrdBizWindowInstance/src/source/node_modules/packages/core/WebFunc_WorkFlowGetProcessInstanceData/src/source/node_modules/packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RouteEngine as routeEngine } from 'packages/core/WebRule_WorkFlowProcessMenuActionExecute/src/source/node_modules/packages/core/WebFunc_WFSetBizStateValue/src/source/node_modules/packages/core/WebFunc_WFSetBizCodeValue/src/source/node_modules/packages/core/WebFunc_PrdSetFrameWindowEnable/src/source/node_modules/packages/core/WebFunc_PrdSetBizFormStateInfo/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.route'

const initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  debugger
  // 获取输入参数
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  // 获取配置的信息实体
  let processBizWindowInfo = inParams['processBizWindowInfo']
  if (null == processBizWindowInfo || undefined == processBizWindowInfo) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.main]执行检查策略规则异常，配置信息错误，获取不到配置信息！'
    )
  }
  let datas = processBizWindowInfo['datas']
  let values = datas['values']
  if (null == values || undefined == values || values.length == 0) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.main]执行检查策略规则异常，配置信息错误，获取不到配置信息！'
    )
  }
  // 拿到配置信息
  let value = values[0]
  // 打开窗体
  executeStrategy(value, ruleContext)
}
// 执行策略
let executeStrategy = function (value, ruleContext) {
  // 获取流程定义ID
  let processDefinitionIdExpression = value['processDefinitionId']
  // 获取活动定义ID
  let activityIdExepression = value['actityId']
  // 获取事件类型
  let strategyEventType = value['strategyEventType']
  // 获取流程实例ID
  let processInstanceIdExepression = value['processInstanceId']
  // 获取活动实例ID
  let executionIdExepression = value['executionId']
  // 表达式校验
  if (!processDefinitionIdExpression) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，配置信息错误，获取不到【processDefinitionId】流程定义Id信息！'
    )
  }
  if (!activityIdExepression) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，配置信息错误，获取不到【actityId】活动定义Id信息！'
    )
  }
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  // 解析流程定义ID
  let processDefinitionId = formulaUtil.execute({
    expression: processDefinitionIdExpression,
    context: context
  })
  // 解析活动定义ID
  let activityId = formulaUtil.execute({
    expression: activityIdExepression,
    context: context
  })
  let processInstanceId
  let executionId
  // 解析流程实例ID
  if (processInstanceIdExepression) {
    processInstanceId = formulaUtil.execute({
      expression: processInstanceIdExepression,
      context: context
    })
  }

  // 解析活动实例ID
  if (executionIdExepression) {
    executionId = formulaUtil.execute({
      expression: executionIdExepression,
      context: context
    })
  }
  // 校验解析信息
  if (!processDefinitionId) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，【processDefinitionId】流程定义Id信息不能为空！'
    )
  }
  if (!activityId) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，【activityId】活动定义Id信息不能为空！'
    )
  }
  if (!strategyEventType) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，【strategyEventType】事件类型信息不能为空！'
    )
  }
  // API所在的构件编码
  let componentCode = 'vbase_prd_workflow_api'
  // API编码
  let metaCode
  // 根据类型获取执行的API信息
  switch (strategyEventType + '') {
    case 'afterOpenBizWindowEvent':
      metaCode = 'API_WorkFlowAfterOpenBizWindowEvent'
      break
    case 'beforeCompleteBizWindowEvent':
      metaCode = 'API_WorkFlowBeforeCompleteBizWindowEvent'
      break
    case 'beforeRejectBizWindowEvent':
      metaCode = 'API_WorkFlowBeforeRejectBizWindowEvent'
      break
    default:
      throw new Error(
        '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，当前不支持【strategyEventType】为【' +
          strategyEventType +
          '】的事件类型！'
      )
  }
  // 获取当前域信息ID
  let currentScopeId = scopeManager.getCurrentScopeId()
  // 当前窗体实例Id
  let currentWindowScopeId
  // 若是ComponentScope，获取窗体域。这种是后台前端方法调用的情况
  if (scopeManager.isComponentScope(currentScopeId)) {
    // 获取窗体域信息
    let parentWindowScope = scopeManager.getParentWindowScope()
    if (!parentWindowScope) {
      throw new Error(
        '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，获取不到窗体信息！'
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
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，获取不到窗体信息！'
    )
  }
  // 获取子域
  let childrenScopes = scopeManager.getChildrenScopes(currentWindowScopeId)
  if (!childrenScopes) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，当前窗体无子窗体信息！'
    )
  }
  // 根据当前窗体的实例ID获取子窗体的实例ID
  let bizWindowScopeId
  for (let i = 0; i < childrenScopes.length; i++) {
    let childrenScope = childrenScopes[i]
    let instanceId = childrenScope.getInstanceId()
    let isWndowScope = scopeManager.isWindowScope(instanceId)
    if (isWndowScope == true) {
      bizWindowScopeId = instanceId
      break
    }
  }
  if (!bizWindowScopeId) {
    throw new Error(
      '[PrdExecuteCheckStrategyRule.executeStrategy]执行检查策略规则异常，当前窗体获取不到子窗体信息！'
    )
  }
  // 构建API入参
  let meteInputParams = {}
  meteInputParams['processDefinitionId'] = processDefinitionId
  meteInputParams['activityId'] = activityId
  meteInputParams['bizWindowScopeId'] = bizWindowScopeId
  meteInputParams['processInstanceId'] = processInstanceId
  meteInputParams['executionId'] = executionId
  // 卡住规则链
  ruleContext.markRouteExecuteUnAuto()
  // 回调释放规则链
  let callBackFunc = function (output) {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
  let routeContext = ruleContext.getRouteContext()
  let _func = scopeManager.createScopeHandler({
    scopeId: bizWindowScopeId,
    handler: function () {
      let ruleSetParams = {
        targetConfig: {
          //client-ruleSet(客户端)，server-ruleSet(服务端)
          sourceType: 'client-ruleSet',
          invokeType: 'api',
          componentCode: componentCode,
          windowCode: '',
          ruleSetCode: metaCode
        },
        inputParam: meteInputParams,
        config: {
          //						"instanceRefs" : instanceRefs,
          success: function (output) {
            callBackFunc()
          },
          error: function (output) {
            alert(output)
          },
          parentRouteContext: routeContext
        }
      }
      routeEngine.execute(ruleSetParams)
    }
  })
  _func()
}
export { initModule, main }
