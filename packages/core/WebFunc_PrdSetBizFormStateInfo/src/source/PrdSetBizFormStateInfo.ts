import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'

//主入口(必须有)
let main = function (param: any) {
  //获取函数传入的参数
  let args = param.getArgs()
  //获取路由上下文
  let routeContext = param.getRouteContext()
  if (args && (args.length < 3 || args.length > 6)) {
    throw new Error('触发流程框架动作数据变化异常，输入传参数异常！')
  }
  // 获取单据编号
  let bizFormCode = args[0]
  // 获取状态
  let bizState = args[1]
  // 获取状态颜色
  let bizStateColor = args[2]

  let bizFormCodeTitle
  let stateTitle
  let emptyTitle
  // 兼容处理
  if (args.length > 3) {
    // 获取单据编码标题
    bizFormCodeTitle = args[3]
    // 获取状态信息标题
    stateTitle = args[4]
    // 获取状态标题是否可为空
    emptyTitle = args[5]
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
        '[PrdSetBizFormStateInfo.main]触发流程框架动作数据变化异常，获取不到窗体信息！'
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

  // 获取父窗体信息
  let parentWindowScopeId = scopeManager.getParentScopeId(currentWindowScopeId)
  if (!parentWindowScopeId) {
    console.info('获取不到框架窗体信息，不执行设置框架状态信息！')
    return
  }
  let parentWindowScope = scopeManager.getScope(parentWindowScopeId)
  parentWindowScopeId = parentWindowScope.getInstanceId()
  let bizFunc = scopeManager.createScopeHandler({
    scopeId: currentWindowScopeId,
    handler: function () {
      let currentWindowInputParams: any = windowParam.getInputs()
      if (!currentWindowInputParams) {
        return
      }
      let instance_componentCode =
        currentWindowInputParams.instance_componentCode
      if (instance_componentCode) {
        return 'biz'
      }
    }
  })
  let processFunc = scopeManager.createScopeHandler({
    scopeId: parentWindowScopeId,
    handler: function () {
      // 获取是否是流程框架窗体标识，判断是否是流程框架窗体
      let isProcessFrmeWindow = windowParam.getInput({
        code: 'isProcessFrmeWindow'
      })
      if (isProcessFrmeWindow == true) {
        return 'process'
      }
    }
  })
  let windowType = bizFunc()
  if (!windowType) {
    windowType = processFunc()
  }
  if (!windowType) {
    console.info('获取不到框架窗体信息，不执行设置框架状态信息！')
    return
  }
  // 流程框架
  if ('process' == windowType) {
    let frameParams = new Array()
    if (null != bizFormCode && undefined != bizFormCode) {
      let bizCodeParam = {}
      bizCodeParam['paramKey'] = 'bizCode'
      bizCodeParam['paramValue'] = bizFormCode
      frameParams.push(bizCodeParam)
    }
    if (null != bizState && undefined != bizState) {
      let bizStateParam = {}
      bizStateParam['paramKey'] = 'bizState'
      bizStateParam['paramValue'] = bizState
      frameParams.push(bizStateParam)
    }
    if (null != bizStateColor && undefined != bizStateColor) {
      let bizStateColorParam = {}
      bizStateColorParam['paramKey'] = 'bizStateColor'
      bizStateColorParam['paramValue'] = bizStateColor
      frameParams.push(bizStateColorParam)
    }
    if (null != bizFormCodeTitle && undefined != bizFormCodeTitle) {
      let bizFormCodeTitleParam = {}
      bizFormCodeTitleParam['paramKey'] = 'bizCodeTitle'
      bizFormCodeTitleParam['paramValue'] = bizFormCodeTitle
      frameParams.push(bizFormCodeTitleParam)
    }
    if (null != stateTitle && undefined != stateTitle) {
      let stateTitleParam = {}
      stateTitleParam['paramKey'] = 'bizStateTitle'
      stateTitleParam['paramValue'] = stateTitle
      frameParams.push(stateTitleParam)
    }
    if (null != emptyTitle && undefined != emptyTitle) {
      let stateTitleParam = {}
      stateTitleParam['paramKey'] = 'emptyTitle'
      stateTitleParam['paramValue'] = emptyTitle
      frameParams.push(stateTitleParam)
    }
    let frameParamsDataJson = {
      datas: {
        recordCount: 1, //实体总记录数
        values: frameParams //实体数据
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
    let frameInputParams = {}
    frameInputParams['FrameData'] = frameParamDataValue
    // 执行api
    let ruleSetParams = {
      targetConfig: {
        sourceType: 'client-ruleSet', //client-ruleSet(客户端)，server-ruleSet(服务端)
        invokeType: 'api',
        componentCode: 'vbase_prd_workflow',
        windowCode: '',
        ruleSetCode: 'API_WorkflowChangeFrameDatas'
      },
      inputParam: frameInputParams,
      config: {
        success: function () {},
        error: function () {
          throw new Error(
            '[PrdSetBizFormStateInfo.main]触发流程框架动作数据变化异常'
          )
        }
      }
    }
    routeEngine.execute(ruleSetParams)
  } else {
    // 业务框架
    let bizFrameInputParams = new Array()
    let frameInputParam = {}
    if (null != bizFormCode && undefined != bizFormCode) {
      frameInputParam['bizFormCode'] = bizFormCode
    }
    if (null != bizState && undefined != bizState) {
      frameInputParam['stateName'] = bizState
    }
    if (null != bizStateColor && undefined != bizStateColor) {
      frameInputParam['stateColor'] = bizStateColor
    }
    if (null != bizFormCodeTitle && undefined != bizFormCodeTitle) {
      frameInputParam['bizFormCodeTitle'] = bizFormCodeTitle
    }
    if (null != stateTitle && undefined != stateTitle) {
      frameInputParam['stateTitle'] = stateTitle
    }
    if (null != emptyTitle && undefined != emptyTitle) {
      frameInputParam['emptyTitle'] = emptyTitle
    }
    bizFrameInputParams.push(frameInputParam)
    let frameParamsDataJson = {
      datas: {
        recordCount: 1, //实体总记录数
        values: bizFrameInputParams //实体数据
      },
      metadata: {
        model: [
          {
            datasource: 'frameStateInfo', //实体编码
            /* 字段列表 */
            fields: [
              { code: 'stateName', type: 'char' },
              { code: 'stateColor', type: 'char' },
              { code: 'bizFormCode', type: 'char' },
              { code: 'bizFormCodeTitle', type: 'char' },
              { code: 'stateTitle', type: 'char' },
              { code: 'emptyTitle', type: 'boolean' }
            ]
          }
        ]
      }
    }
    let frameParamDataValue = DBFactory.unSerialize(frameParamsDataJson)
    let frameInputParams = {}
    frameInputParams['frameStateInfo'] = frameParamDataValue
    // 获取父窗体的所在构件编码
    let frameActionComponentCode = parentWindowScope.getComponentCode()
    // 获取父窗体的窗体编码
    let frameActionWindow = parentWindowScope.getWindowCode()
    let instanceRefs = new Array()
    instanceRefs.push(parentWindowScopeId)
    let ruleSetParams = {
      targetConfig: {
        //client-ruleSet(客户端)，server-ruleSet(服务端)
        sourceType: 'client-ruleSet',
        invokeType: 'api',
        componentCode: frameActionComponentCode,
        windowCode: frameActionWindow,
        ruleSetCode: 'API_PrdBizFrameActionChange'
      },
      inputParam: frameInputParams,
      config: {
        instanceRefs: instanceRefs,
        success: function (output: any) {},
        error: function (output: any) {
          throw new Error(
            '[PrdSetBizFormStateInfo.main]触发业务框架动作数据变化异常'
          )
        }
      }
    }
    routeEngine.execute(ruleSetParams)
  }
}

export { main }
