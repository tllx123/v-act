import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'

//主入口(必须有)
let main = function (param: any) {
  //获取函数传入的参数
  let args = param.getArgs()
  if (!args || args.length == 0) {
    throw new Error(
      '[PrdSetFrameWindowEnable.main]设置框架窗体使能属性异常，PrdSetFrameWindowEnable函数需要传入参数！'
    )
  }

  // 获取当前域信息ID
  let currentScopeId = scopeManager.getCurrentScopeId()
  // 当前窗体实例Id
  let currentWindowScopeId
  // 当前是否窗体域
  let isWindowScope = true
  // 若是ComponentScope，获取窗体域。这种是后台前端方法调用的情况
  if (scopeManager.isComponentScope(currentScopeId)) {
    // 获取窗体域信息
    let parentWindowScope = scopeManager.getParentWindowScope()
    if (!parentWindowScope) {
      throw new Error(
        '[PrdSetFrameWindowEnable.main]设置框架窗体使能属性异常，获取不到窗体信息！'
      )
    }
    // 获取窗体实例Id
    currentWindowScopeId = parentWindowScope.getInstanceId()
    // 赋值非窗体域
    isWindowScope = false
  }
  // 若当前是WindowScope，直接获取窗体域信息。这种是直接在窗体中调用的情况
  if (scopeManager.isWindowScope(currentScopeId)) {
    // 获取窗体实例Id
    currentWindowScopeId = currentScopeId
  }
  let scope = scopeManager.getScope(currentWindowScopeId)
  let windowCode = scope.getWindowCode()

  // 获取框架窗体的域Id
  let frameWindowScopeId = scopeManager.getParentScopeId(currentWindowScopeId)
  if (!frameWindowScopeId) {
    console.info('获取不到框架窗体信息，不执行设置框架状态信息！')
    return
  }
  let frameWindowScope = scopeManager.getScope(frameWindowScopeId)
  let frameActionComponentCode = frameWindowScope.getComponentCode()
  let frameActionWindow = frameWindowScope.getWindowCode()

  // 设置使能情况
  let setEnable = function () {
    let currentWindowInputParams: any = windowParam.getInputs()
    if (!currentWindowInputParams) {
      return
    }
    let isWorkflowFrame = false
    let instance_componentCode = currentWindowInputParams.instance_componentCode
    // 非业务单据实例,不允许设置,直接返回
    if (!instance_componentCode) {
      // 若非业务单据先判断是否是流程框架中打开的单据
      isWorkflowFrame = scopeManager.createScopeHandler({
        scopeId: frameWindowScopeId,
        handler: function () {
          var isExist = windowParam.getInput({
            code: 'isProcessFrmeWindow'
          })
          return isExist
        }
      })()
      // 即不是单据实例打开，也不是流程框架打开，直接返回
      if (isWorkflowFrame === false) {
        return
      }
    }

    /** 流程框架打开不考虑权限情况 **/
    // 获取业务单权限信息
    if (instance_componentCode) {
      let isBizWindowPrivilege = currentWindowInputParams.biz_window_privilege
      if (isBizWindowPrivilege === false) {
        return
      }
    }

    // 获取入参
    let isEnable = args[0]
    // 业务单若是有权限或者无开启权限，进行设置
    if (isEnable === true) {
      // 设置使能,允许设置后，在窗体可对控件使能只读等进行控制，resetable要传true
      widgetAction.executeComponentAction(
        'setReadOnly',
        windowCode,
        false,
        true
      )
    } else {
      // 设置非使能,允许设置后，在窗体可对控件使能只读等进行控制，resetable要传true
      widgetAction.executeComponentAction('setReadOnly', windowCode, true, true)
    }
    // 设置框架窗体动作
    let _func = scopeManager.createScopeHandler({
      scopeId: frameWindowScopeId,
      handler: function () {
        // 获取窗体所有的实体信息
        let datasource = datasourceManager.lookup({
          datasourceName: 'FrameMenu'
        })
        if (datasource) {
          let records = datasource.getAllRecords()
          let datas = records.datas
          let bizFrameInputParams = new Array()
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            let isItem = data['isItem']
            let menuItemCode = data['menuItemCode']
            if (isItem == true) {
              // 业务框架
              let frameInputParam = {}
              frameInputParam['actionCode'] = menuItemCode
              frameInputParam['isEnabled'] = isEnable
              bizFrameInputParams.push(frameInputParam)
              let frameParamsDataJson = {
                datas: {
                  recordCount: 1, //实体总记录数
                  values: bizFrameInputParams //实体数据
                },
                metadata: {
                  model: [
                    {
                      datasource: 'frameActionInfo', //实体编码
                      /* 字段列表 */
                      fields: [
                        { code: 'actionCode', type: 'char' },
                        { code: 'isEnabled', type: 'boolean' },
                        { code: 'isVisible', type: 'boolean' }
                      ]
                    }
                  ]
                }
              }
              let frameParamDataValue =
                DBFactory.unSerialize(frameParamsDataJson)
              let frameInputParams = {}
              frameInputParams['frameActionInfo'] = frameParamDataValue
              let instanceRefs = new Array()
              instanceRefs.push(frameWindowScopeId)
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
                      '[PrdSetFrameWindowEnable.main]设置框架窗体使能属性异常:' +
                        output
                    )
                  }
                }
              }
              routeEngine.execute(ruleSetParams)
            }
          }
        }
      }
    })

    // 设置流程框架窗体动作
    let _workflowActionFunc = scopeManager.createScopeHandler({
      scopeId: frameWindowScopeId,
      handler: function () {
        // 获取窗体所有的实体信息
        let datasource = datasourceManager.lookup({
          datasourceName: 'ProcessMenu'
        })
        if (datasource) {
          let records = datasource.getAllRecords()
          let datas = records.datas
          let bizFrameInputParams = new Array()
          let attributeValue = isEnable === true ? 'True' : 'False'
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            let isItem = data['isItem']
            let menuItemCode = data['menuItemCode']
            if (isItem == true) {
              // 业务框架
              let frameInputParam = {}
              frameInputParam['menuCode'] = menuItemCode
              // 属性
              frameInputParam['attributeKey'] = 'Enabled'
              // 属性值
              frameInputParam['attributeValue'] = attributeValue
              bizFrameInputParams.push(frameInputParam)
              let frameParamsDataJson = {
                datas: {
                  recordCount: 1, //实体总记录数
                  values: bizFrameInputParams //实体数据
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
              let frameParamDataValue =
                DBFactory.unSerialize(frameParamsDataJson)
              let frameInputParams = {}
              frameInputParams['FrameMenu'] = frameParamDataValue
              let instanceRefs = new Array()
              instanceRefs.push(frameWindowScopeId)
              let ruleSetParams = {
                targetConfig: {
                  //client-ruleSet(客户端)，server-ruleSet(服务端)
                  sourceType: 'client-ruleSet',
                  invokeType: 'api',
                  componentCode: frameActionComponentCode,
                  windowCode: frameActionWindow,
                  ruleSetCode: 'API_WorkflowChangeFrameDatas'
                },
                inputParam: frameInputParams,
                config: {
                  instanceRefs: instanceRefs,
                  success: function (output: any) {},
                  error: function (output: any) {
                    throw new Error(
                      '[PrdSetFrameWindowEnable.main]设置框架窗体使能属性异常:' +
                        output
                    )
                  }
                }
              }
              routeEngine.execute(ruleSetParams)
            }
          }
        }
      }
    })
    if (instance_componentCode) {
      _func()
    }
    if (isWorkflowFrame == true) {
      _workflowActionFunc()
    }
  }

  // 非窗体域，开域执行
  if (isWindowScope == false) {
    let _func = scopeManager.createScopeHandler({
      scopeId: currentWindowScopeId,
      handler: function () {
        setEnable()
      }
    })
    _func()
  } else {
    setEnable()
  }
}

export { main }
