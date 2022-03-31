import { JsonUtil as jsonUtil } from 'packages/core/WebRule_WorkFlowProcessMenuActionExecute/src/source/node_modules/packages/core/WebFunc_PrdBizWindowInstance/src/source/node_modules/packages/core/WebFunc_WorkFlowGetProcessInstanceData/src/source/node_modules/packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { RouteEngine as routeEngine } from 'packages/core/WebRule_WorkFlowProcessMenuActionExecute/src/source/node_modules/packages/core/WebFunc_WFSetBizStateValue/src/source/node_modules/packages/core/WebFunc_WFSetBizCodeValue/src/source/node_modules/packages/core/WebFunc_PrdSetFrameWindowEnable/src/source/node_modules/packages/core/WebFunc_PrdSetBizFormStateInfo/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.route'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { log as log } from 'packages/core/WebRule_WorkFlowProcessMenuActionExecute/src/source/node_modules/packages/core/WebFunc_PrdBizWindowInstance/src/source/node_modules/packages/core/WebFunc_WorkFlowGetProcessInstanceData/src/source/node_modules/packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

const initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  // 获取配置的信息实体
  let inputParams = inParams['inputParams']
  if (null == inputParams || undefined == inputParams) {
    throw new Error(
      '[PrdTriggerBizFrameActionChange.main]触发业务框架动作数据变化异常，配置信息错误，获取不到配置信息！'
    )
  }
  let datas = inputParams['datas']
  let values = datas['values']
  if (null == values || undefined == values || values.length == 0) {
    throw new Error(
      '[PrdTriggerBizFrameActionChange.main]触发业务框架动作数据变化异常，配置信息错误，获取不到配置信息！'
    )
  }
  // 触发
  triggerActionChange(values, ruleContext)
}

let triggerActionChange = function (values, ruleContext) {
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
let executeAPI = function (frameInputParams, ruleContext) {
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
        '[PrdTriggerBizFrameActionChange.executeAPI]触发业务框架动作数据变化异常，获取不到窗体信息！'
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
      '[PrdTriggerBizFrameActionChange.executeAPI]触发业务框架动作数据变化异常，获取不到窗体信息！'
    )
  }
  // 获取业务框架窗体域信息
  let parentWindowScopeId = getCurrentFrameWindowScopeId(
    currentWindowScopeId,
    'FrameMenu'
  )

  let isBizFrame = false
  let isWorkFlowFrame = false
  // 获取不到域信息，不再执行
  if (parentWindowScopeId == undefined || parentWindowScopeId == '') {
    // 获取流程框架窗体域信息
    parentWindowScopeId = getCurrentFrameWindowScopeId(
      currentWindowScopeId,
      'ProcessMenu'
    )
    if (parentWindowScopeId == undefined || parentWindowScopeId == '') {
      return
    }
    isWorkFlowFrame = true
  } else {
    isBizFrame = true
  }
  //			// 执行修改动作信息
  if (isBizFrame == true) {
    executeBizFrameWindowActionChange(
      parentWindowScopeId,
      ruleContext,
      frameInputParams
    )
  }
  if (isWorkFlowFrame == true) {
    executeWorkFlowFrameWindowActionChange(
      parentWindowScopeId,
      ruleContext,
      frameInputParams
    )
  }
}

/**
 * 获取框架窗体的域ID
 */
let getCurrentFrameWindowScopeId = function (
  currentWindowScopeId,
  datasourceName
) {
  let parentWindowScopeId
  // 判断当前是否是框架窗体
  let result = scopeManager.createScopeHandler({
    scopeId: currentWindowScopeId,
    handler: function () {
      var isExist = datasourceManager.exists({
        datasourceName: datasourceName
      })
      return isExist
    }
  })()
  if (result === true) {
    parentWindowScopeId = currentWindowScopeId
  } else {
    // 根据当前窗体的实例ID获取父窗体的实例ID
    parentWindowScopeId = scopeManager.getParentScopeId(currentWindowScopeId)
    if (!parentWindowScopeId) {
      return
    }
    // 判断是否是框架窗体
    let isFrameWindow = scopeManager.createScopeHandler({
      scopeId: parentWindowScopeId,
      handler: function () {
        var isExist = datasourceManager.exists({
          datasourceName: datasourceName
        })
        return isExist
      }
    })()
    if (isFrameWindow === false) {
      log.log(
        '[PrdTriggerBizFrameActionChange.executeAPI]触发业务框架动作数据变化异常，获取不到框架信息！'
      )
      return
    }
  }
  return parentWindowScopeId
}

/**
 * 业务框架执行动作调整API
 */
let executeBizFrameWindowActionChange = function (
  parentWindowScopeId,
  ruleContext,
  frameInputParams
) {
  let instanceRefs = new Array()
  instanceRefs.push(parentWindowScopeId)
  // 根据父窗体的实例ID获取父窗体的Scope对象
  let parentScope = scopeManager.getScope(parentWindowScopeId)
  // 获取父窗体的所在构件编码
  let frameActionComponentCode = parentScope.getComponentCode()
  // 获取父窗体的窗体编码
  let frameActionWindow = parentScope.getWindowCode()
  // 固定API编码
  let frameActionAPI = 'API_PrdBizFrameActionChange'
  ruleContext.markRouteExecuteUnAuto()
  let callBackFunc = function (output) {
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
      success: function (output) {
        callBackFunc()
      },
      error: function (output) {
        alert(output)
      }
    }
  }
  routeEngine.execute(ruleSetParams)
}

/**
 * 业务框架执行动作调整API
 */
let executeWorkFlowFrameWindowActionChange = function (
  parentWindowScopeId,
  ruleContext,
  frameInputParams
) {
  let instanceRefs = new Array()
  instanceRefs.push(parentWindowScopeId)
  // 根据父窗体的实例ID获取父窗体的Scope对象
  let parentScope = scopeManager.getScope(parentWindowScopeId)
  // 获取父窗体的所在构件编码
  let frameActionComponentCode = parentScope.getComponentCode()
  // 获取父窗体的窗体编码
  let frameActionWindow = parentScope.getWindowCode()
  // 固定API编码
  let frameActionAPI = 'API_WorkflowChangeFrameDatas'
  // 构造参数
  let workFlowInputParams = createInputParams(frameInputParams)
  ruleContext.markRouteExecuteUnAuto()
  let callBackFunc = function (output) {
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
    inputParam: workFlowInputParams,
    config: {
      instanceRefs: instanceRefs,
      success: function (output) {
        callBackFunc()
      },
      error: function (output) {
        alert(output)
      }
    }
  }
  routeEngine.execute(ruleSetParams)
}

let createInputParams = function (frameInputParams) {
  if (undefined == frameInputParams || null == frameInputParams) {
    return
  }
  let returnFrameInputParams = {}
  // 获取动作信息
  let frameActionParams = new Array()
  let frameActionInfos = frameInputParams['frameActionInfo']
  if (frameActionInfos) {
    let dataSource = frameActionInfos.getAllRecords()
    if (dataSource) {
      let datas = dataSource.datas
      if (datas) {
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i]
          let actionCode = data['actionCode']
          let isEnabled = data['isEnabled']
          let isVisible = data['isVisible']
          let actionName = data['actionName']

          if (undefined != isEnabled && null != isEnabled) {
            let frameActionParam = {}
            frameActionParam['menuCode'] = actionCode
            frameActionParam['attributeKey'] = 'Enabled'
            frameActionParam['attributeValue'] =
              isEnabled === true ? 'True' : 'False'
            frameActionParams.push(frameActionParam)
          }
          if (undefined != isVisible && null != isVisible) {
            let frameActionParam = {}
            frameActionParam['menuCode'] = actionCode
            frameActionParam['attributeKey'] = 'Visible'
            frameActionParam['attributeValue'] =
              isVisible === true ? 'True' : 'False'
            frameActionParams.push(frameActionParam)
          }
          if (undefined != actionName && null != actionName) {
            let frameActionParam = {}
            frameActionParam['menuCode'] = actionCode
            frameActionParam['attributeKey'] = 'MenuName'
            frameActionParam['attributeValue'] = actionName
            frameActionParams.push(frameActionParam)
          }
        }
        let frameParamsDataJson = {
          datas: {
            recordCount: frameActionParams.length, //实体总记录数
            values: frameActionParams //实体数据
          },
          metadata: {
            model: [
              {
                datasource: 'FrameMenu', //实体编码
                /* 字段列表 */
                fields: [
                  { code: 'menuCode', type: 'char' },
                  { code: 'attributeKey', type: 'char' },
                  { code: 'attributeValue', type: 'char' }
                ]
              }
            ]
          }
        }
        let frameParamDataValue = DBFactory.unSerialize(frameParamsDataJson)
        returnFrameInputParams['FrameMenu'] = frameParamDataValue
      }
    }
  }

  // 获取状态信息
  let frameStateParams = new Array()
  let frameStateInfos = frameInputParams['frameStateInfo']
  if (frameStateInfos) {
    let dataSource = frameStateInfos.getAllRecords()
    if (dataSource) {
      let datas = dataSource.datas
      if (datas) {
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i]
          let bizFormCode = data['bizFormCode']
          let bizFormCodeTitle = data['bizFormCodeTitle']
          let stateName = data['stateName']
          let stateColor = data['stateColor']
          let stateTitle = data['stateTitle']
          let emptyTitle = data['emptyTitle']

          if (undefined != bizFormCode && null != bizFormCode) {
            let frameStateParam = {}
            frameStateParam['paramKey'] = 'bizCode'
            frameStateParam['paramValue'] = bizFormCode
            frameStateParams.push(frameStateParam)
          }
          if (undefined != stateName && null != stateName) {
            let frameStateParam = {}
            frameStateParam['paramKey'] = 'bizState'
            frameStateParam['paramValue'] = stateName
            frameStateParams.push(frameStateParam)
          }
          if (undefined != stateColor && null != stateColor) {
            let frameStateParam = {}
            frameStateParam['paramKey'] = 'bizStateColor'
            frameStateParam['paramValue'] = stateColor
            frameStateParams.push(frameStateParam)
          }
          if (undefined != bizFormCodeTitle && null != bizFormCodeTitle) {
            let frameStateParam = {}
            frameStateParam['paramKey'] = 'bizCodeTitle'
            frameStateParam['paramValue'] = bizFormCodeTitle
            frameStateParams.push(frameStateParam)
          }
          if (undefined != stateTitle && null != stateTitle) {
            let frameStateParam = {}
            frameStateParam['paramKey'] = 'bizStateTitle'
            frameStateParam['paramValue'] = stateTitle
            frameStateParams.push(frameStateParam)
          }
          if (undefined != emptyTitle && null != emptyTitle) {
            let frameStateParam = {}
            frameStateParam['paramKey'] = 'emptyTitle'
            frameStateParam['paramValue'] = emptyTitle
            frameStateParams.push(frameStateParam)
          }
        }
        let frameParamsDataJson = {
          datas: {
            recordCount: frameStateParams.length, //实体总记录数
            values: frameStateParams //实体数据
          },
          metadata: {
            model: [
              {
                datasource: 'FrameData', //实体编码
                /* 字段列表 */
                fields: [
                  { code: 'paramKey', type: 'char' },
                  { code: 'paramValue', type: 'char' }
                ]
              }
            ]
          }
        }
        let frameParamDataValue = DBFactory.unSerialize(frameParamsDataJson)
        returnFrameInputParams['FrameData'] = frameParamDataValue
      }
    }
  }
  return returnFrameInputParams
}

export { initModule, main }
