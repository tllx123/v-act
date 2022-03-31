import { JsonUtil as jsonUtil } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteEngine as routeEngine } from 'packages/core/WebFunc_PrdSetFrameWindowEnable/src/source/node_modules/packages/core/WebFunc_PrdSetBizFormStateInfo/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.route'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { BrowserUtil as browserUtil } from '@v-act/vjs.framework.extension.platform.services.browser'
import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ExceptionHandler as exceptionHandler } from '@v-act/vjs.framework.extension.platform.interface.exception'
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let sandbox

const initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  // 获取输入参数
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  // 获取配置的信息实体
  let openBizWindowInstanceInfo = inParams['openBizWindowInstanceInfo']
  if (
    null == openBizWindowInstanceInfo ||
    undefined == openBizWindowInstanceInfo
  ) {
    throw new Error(
      '[PrdOpenBizWindowInstance.main]打开组件异常，配置信息错误，获取不到配置信息！'
    )
  }
  let datas = openBizWindowInstanceInfo['datas']
  let values = datas['values']
  if (null == values || undefined == values || values.length == 0) {
    throw new Error(
      '[PrdOpenBizWindowInstance.main]打开组件异常，配置信息错误，获取不到配置信息！'
    )
  }
  // 拿到配置信息
  let value = values[0]
  // 打开窗体
  openBizWindowInstance(value, ruleContext)
}
// 打开业务单据实例
let openBizWindowInstance = function (value, ruleContext) {
  // 获取打开的容器编码
  let windowContainer = value['windowContainer']
  // 获取业务单据实例构件编码
  let instanceComponentCode = value['instanceComponentCode']
  // 获取业务单据实例编码
  let instanceCode = value['instanceCode']
  // 获取业务单据实例参数
  let requestParams = value['requestParams']
  if (!windowContainer) {
    throw new Error(
      '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，获取不到容器编码【windowContainer】配置信息！'
    )
  }
  if (!instanceComponentCode) {
    throw new Error(
      '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，获取不到业务单据实例构件编码【instanceComponentCode】配置信息！'
    )
  }
  if (!instanceCode) {
    throw new Error(
      '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，获取不到业务单据实例编码【instanceCode】配置信息！'
    )
  }
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  // 解析业务单据实例构件编码
  instanceComponentCode = formulaUtil.execute({
    expression: instanceComponentCode,
    context: context
  })
  // 解析业务单据实例编码
  instanceCode = formulaUtil.execute({
    expression: instanceCode,
    context: context
  })
  // 解析入参
  let bizWindowInstanceInputParams = {}
  if (requestParams) {
    requestParams = formulaUtil.execute({
      expression: requestParams,
      context: context
    })
    if (requestParams) {
      params = requestParams.split('&')
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('=')
        bizWindowInstanceInputParams['FRAME_WINDOW_CODE_' + param[0]] = param[1]
      }
    }
  }
  ruleContext.markRouteExecuteUnAuto()

  // 获取获取业务单据实例
  let defferend = componentParam.getMetadata(
    instanceComponentCode,
    'BizWindowInstanceData'
  )
  try {
    // 开域封装
    let _func = scopeManager.createScopeHandler({
      handler: function (metadatas) {
        let frameInputParams
        if (!metadatas) {
          throw new Error(
            '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，获取不到业务单据实例【metadatas】信息！'
          )
        }
        // 根据编码获取业务窗体单据实例
        let bizWindowInstance = metadatas[instanceCode]
        if (null == bizWindowInstance || undefined == bizWindowInstance) {
          throw new Error(
            '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，根据业务单据实例编码【' +
              bizWindowInstance +
              '】获取不到业务单据实例信息！'
          )
        }
        let openFrame = function (
          instanceComponentCode,
          instanceCode,
          currentWindowInputParams,
          bizWindowInstance
        ) {
          if (currentWindowInputParams) {
            bizWindowInstanceInputParams = currentWindowInputParams
          }
          // 获取框架窗体所在构件编码
          let frameComponentCode = bizWindowInstance['frameComponentCode']
          // 获取框架窗体编码
          let frameWindowCode = bizWindowInstance['frameWindowCode']
          // 校验
          if (!frameComponentCode) {
            throw new Error(
              '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，获取不到配置需要打开的框架窗体所在构件编码【frameComponentCode】信息！'
            )
          }
          if (!frameWindowCode) {
            throw new Error(
              '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，获取不到配置需要打开的框架窗体编码【frameWindowCode】信息！'
            )
          }
          // 获取业务窗体列表
          let frameBizWindows = bizWindowInstance['windows']
          if (!frameBizWindows) {
            throw new Error(
              '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，获取不到配置需要打开的业务窗体【windows】信息！'
            )
          }
          let frameWindowNameMap = {}
          // 构造框架API输入参数
          frameInputParams = getFrameInputParams(
            frameBizWindows,
            bizWindowInstanceInputParams,
            frameWindowNameMap,
            instanceComponentCode,
            instanceCode
          )
          // 设置默认名称
          let title = frameWindowNameMap['frameWindowName']
          // 设置默认打开方式
          let componentOpen = 'SpecifiedContainer'
          if (!componentOpen) {
            throw new Error(
              '[PrdOpenBizWindowInstance.openBizWindowInstance]打开业务单据实例异常，配置信息错误，无框架打开方式类型【componentOpen 】信息！'
            )
          }
          // 根据类型以不同的方式打开
          let componentVariable = {}
          if ('NewWindow' == componentOpen) {
            alert('业务框架当前不支持【NewWindow】类型菜单打开方式！')
          } else if ('SpecifiedWindow' == componentOpen) {
            alert('业务框架当前不支持【SpecifiedWindow】类型菜单打开方式！')
          } else if ('SpecifiedContainer' == componentOpen) {
            componentVariable['variable'] = {
              OrgEdgeTypeCode: 'systemOrg',
              formulaOpenMode: 'container',
              closeTabId: windowContainer
            }
            componentVariable['variable']['formulaOpenMode'] = 'container'
            componentVariable.variable.closeTabId = windowContainer
            for (let key in bizWindowInstanceInputParams) {
              componentVariable['variable'][key] =
                bizWindowInstanceInputParams[key]
            }
            let containerId = widgetAction.executeWidgetAction(
              windowContainer,
              'getContainerIdByInfo',
              {
                componentCode: frameComponentCode,
                windowCode: frameWindowCode,
                title: title,
                otherInfo: ''
              }
            )
            if (containerId) {
              let seriesService = sandbox.getService(
                'vjs.framework.extension.ui.common.plugin.services.series.Series'
              )
              if (seriesService.getSeries() == 'bootstrap') {
                widgetAction.executeWidgetAction(
                  windowContainer,
                  'activeByComponentId',
                  frameComponentCode,
                  frameWindowCode,
                  title,
                  '',
                  componentVariable,
                  {
                    containerId: containerId
                  }
                )
              } else {
                let moduleUrl = browser.getWindowUrl({
                  windowCode: frameWindowCode,
                  inputParams: componentVariable
                })
                widgetAction.executeWidgetAction(
                  windowContainer,
                  'reloadSingleTab',
                  frameComponentCode,
                  frameWindowCode,
                  title,
                  '',
                  moduleUrl,
                  false,
                  true
                )
                widgetAction.executeWidgetAction(
                  windowContainer,
                  'active',
                  frameComponentCode,
                  frameWindowCode,
                  title,
                  '',
                  {
                    containerId: containerId
                  }
                )
              }
            } else {
              widgetAction.executeWidgetAction(windowContainer, 'add', {
                id: frameWindowCode,
                isComponent: true,
                otherInfo: '',
                title: title,
                componentCode: frameComponentCode,
                componentVariable: componentVariable,
                callback: function () {
                  executeAPI(frameInputParams, ruleContext)
                },
                closed: function (output) {
                  closeFrameWindow(output)
                },
                vjsContext: {
                  frameworkComponentCode: instanceComponentCode, //构件编码
                  frameworkInstanceCode: instanceCode //业务单据实例编码
                }
                //													"rendered": item.rendered
              })
            }
          } else if ('DialogWindow' == componentOpen) {
            //增加DialogWindow(对话框窗体)打开方式
            componentVariable['variable'] = {
              OrgEdgeTypeCode: 'systemOrg',
              formulaOpenMode: 'container',
              closeTabId: windowContainer
            }
            for (let key in bizWindowInstanceInputParams) {
              componentVariable['variable'][key] =
                bizWindowInstanceInputParams[key]
            }
            componentVariable['variable']['formulaOpenMode'] = 'dialog'
            browser.showModalModule({
              componentCode: frameComponentCode,
              windowCode: frameWindowCode,
              operation: frameComponentCode,
              title: title,
              inputParam: componentVariable,
              loaded: function () {
                // 窗体渲染后执行框架API
                executeAPI(frameInputParams, ruleContext)
              },
              closed: function (output) {
                closeFrameWindow(output)
              },
              vjsContext: {
                frameworkComponentCode: instanceComponentCode, //构件编码
                frameworkInstanceCode: instanceCode //业务单据实例编码
              }
            })
          }
        }
        executePermission(
          ruleContext,
          instanceComponentCode,
          instanceCode,
          openFrame,
          bizWindowInstance
        )
      }
    })
    // 解析获取获取业务单据实例，并打开框架窗体
    defferend.then(_func)
  } catch (e) {}
}

// 设置权限信息
let executePermission = function (
  ruleContext,
  instanceComponentCode,
  instanceCode,
  openFrame,
  bizWindowInstance
) {
  ruleContext.markRouteExecuteUnAuto()
  // 获取权限信息的方法
  let actionAPIComponentCode = 'vbase_prd_perm_api'
  let actionAPI = 'API_PermGetUseBizWindowInstancePrivilegeByInstanceCode'
  let privilegeInfo = {}
  // 设置回调信息
  let apiCallBackFunc = function (result) {
    let isSettingPrivilege = result['isSettingPrivilege']
    let functionResource = result['functionResource']
    let isLogined = result['isLogined']
    privilegeInfo['__isSettingPrivilege__'] = isSettingPrivilege
    privilegeInfo['__functionResource__'] = functionResource
    let hasQueryBizWindowInstancePrivilege
    let hasEditBizWindowInstancePrivilege
    if (isSettingPrivilege == true) {
      if (isLogined === false) {
        let e = exceptionFactory.create({
          error: 'Exception',
          message: '异常信息',
          type: exceptionFactory.TYPES['Unlogin']
        })
        ruleContext.handleException(e)
        return
      }
      if (functionResource) {
        let functionResourceDatas = functionResource.getAllRecords().datas
        let datas = new Array()
        if (functionResourceDatas) {
          for (let i = 0; i < functionResourceDatas.length; i++) {
            let instancePrivilege = functionResourceDatas[i]
            let isPrivilege = instancePrivilege['isPrivilege']
            let isEnable = instancePrivilege['isEnable']
            let resourceId = instancePrivilege['resourceId']
            let canEdit = instancePrivilege['canEdit']
            let canQuery = instancePrivilege['canQuery']
            // 拥有单据实例权限，即拥有所有权限
            if (resourceId == instanceComponentCode + '|' + instanceCode) {
              // 若是不启用，即不开权限
              if (isEnable == false) {
                isSettingPrivilege = false
                privilegeInfo['__isSettingPrivilege__'] = false
                break
              }
              if (canEdit === true && canQuery === true) {
                hasEditBizWindowInstancePrivilege = isPrivilege
                // 设置有单据实例编辑权
                privilegeInfo['__hasEditBizWindowInstancePrivilege__'] =
                  isPrivilege
              } else if (canEdit === false && canQuery === true) {
                // 设置有单据实例编辑权
                hasQueryBizWindowInstancePrivilege = isPrivilege
                privilegeInfo['__hasQueryBizWindowInstancePrivilege__'] =
                  isPrivilege
              }
              // 这里仅处理单据权限编辑权限和查询权限，若是都已找到，直接退出
              if (
                hasEditBizWindowInstancePrivilege != undefined &&
                hasQueryBizWindowInstancePrivilege != undefined
              ) {
                break
              }
            }
          }
        }
      }
      if (
        isSettingPrivilege &&
        hasEditBizWindowInstancePrivilege !== true &&
        hasQueryBizWindowInstancePrivilege !== true
      ) {
        let prefix = 'FRAME_WINDOW_CODE_'
        let currentWindowInputParams = {}
        currentWindowInputParams[
          prefix +
            'vbase_prd_perm.PrdPermNoBizWindowInstancePrivilege' +
            '|' +
            'instanceComponentCode'
        ] = instanceComponentCode
        currentWindowInputParams[
          prefix +
            'vbase_prd_perm.PrdPermNoBizWindowInstancePrivilege' +
            '|' +
            'instanceCode'
        ] = instanceCode
        currentWindowInputParams[
          prefix +
            'vbase_prd_perm.PrdPermNoBizWindowInstancePrivilege' +
            '|' +
            'privilegeType'
        ] = 'bizWindowInstance'
        instanceComponentCode = 'vbase_prd_perm_inst'
        instanceCode = 'PrdPermNoBizWindowInstancePrivilegeInstance'
        bizWindowInstance = getPrivilegeWindow()
      }
    }
    openFrame(
      instanceComponentCode,
      instanceCode,
      currentWindowInputParams,
      bizWindowInstance
    )
  }
  // 设置入参
  let ruleInputParams = {}
  ruleInputParams['componentCode'] = instanceComponentCode
  ruleInputParams['instanceCode'] = instanceCode
  let ruleSetParams = {
    targetConfig: {
      sourceType: 'server-ruleSet', //client-ruleSet(客户端)，server-ruleSet(服务端)
      invokeType: 'api',
      componentCode: actionAPIComponentCode,
      windowCode: '',
      ruleSetCode: actionAPI
    },
    inputParam: ruleInputParams,
    config: {
      success: function (result) {
        apiCallBackFunc(result)
      },
      error: function (output) {
        throw new Error(
          '[PrdOpenBizFrameReturnData.getPrivilegeInfo]获取权限信息失败：' +
            output
        )
      }
    }
  }
  // 执行获取权限信息方法
  routeEngine.execute(ruleSetParams)
}

let getPrivilegeWindow = function () {
  let groups = new Array()
  let group = {
    actions: [],
    groupCode: 'frameGroupCode',
    groupControlType: '',
    groupName: '功能区',
    id: '8a819b297392f8dd017394c17a7e544b',
    instanceBizId: '8a819b297392f8dd017394c17a7e544a',
    instanceId:
      'vbase_prd_perm_inst_PrdPermNoBizWindowInstancePrivilegeInstance',
    isLeaf: true,
    order: 1,
    pid: null
  }
  groups.push(group)
  let windows = new Array()
  let window = {
    bizComponentCode: 'vbase_prd_perm',
    bizWindowCode: 'PrdPermNoBizWindowInstancePrivilege',
    bizWindowName: '',
    bizWindowOrder: 1,
    bizWindowTitle: '',
    groups: groups,
    id: '8a819b297392f8dd017394c17a7e544a',
    instanceId:
      'vbase_prd_perm_inst_PrdPermNoBizWindowInstancePrivilegeInstance',
    isDefaultSelected: true
  }
  windows.push(window)
  let bizWindowInstance = {
    frameComponentCode: 'vbase_prdbizframe',
    frameWindowCode: 'BR_BG_Action_FrameWindow',
    frameWindowName: '框架窗体_右下按钮组',
    id: 'vbase_prd_perm_inst_PrdPermNoBizWindowInstancePrivilegeInstance',
    instanceCode: 'PrdPermNoBizWindowInstancePrivilegeInstance',
    instanceComponentCode: 'vbase_prd_perm_inst',
    instanceIcon: '',
    instanceIconType: '',
    instanceName: '',
    windows: windows
  }
  return bizWindowInstance
}

/**
 * 关闭窗体
 */
function closeFrameWindow(output) {
  // 获取业务窗体关闭方式,是否为确认退出
  let selectConfirm = output['selectConfirm']

  // 获取框架窗体的打开方式
  let scope = scopeManager.getChildWindowScope()
  if (scope && scope.getOpenMode()) {
    openMode = scope.getOpenMode()
  } else {
    openMode = windowParam.getInput({
      code: 'formulaOpenMode'
    })
  }

  //适配不同的打开方式，使用不同的关闭方式
  switch (openMode + '') {
    case 'locationHref':
      if (scope) {
        scope.set('CloseIden', selectConfirm) //设置关闭标识，容器中退出窗体时，回调要用
      }
      actionHandler.executeComponentAction('closeComponent')
      break
    case 'dialog':
    case 'retrunValues':
      if (true == selectConfirm) {
        // 需要获取业务窗体输出参数赋给框架窗体
        var outParams = output['outParams']
        if (null != outParams && undefined != outParams) {
          for (outParam in outParams) {
            windowParam.setOutput({
              code: outParam,
              value: outParams[outParam]
            })
          }
        }
      }
      // 这里关闭窗体
      browser.closeModalWindow({
        selectConfirm: selectConfirm,
        collectOutput: selectConfirm
      })
      break
    case 'container':
      if (scope) {
        //设置关闭标识，容器中退出窗体时，回调要用
        scope.set('CloseIden', selectConfirm)
      }
      actionHandler.executeComponentAction('closeComponent')
      break
    case scopeManager.OpenMode.ModalContaniner:
      var scopeId
      var winScope = scopeManager.getChildWindowScope()
      if (winScope) {
        scopeId = winScope.getInstanceId()
      } else {
        scopeId = scopeManager.getCurrentScopeId()
      }
      var success = function () {
        scopeManager.destroy(scopeId)
      }
      var error = function () {}
      winScope.fireBeforeClose(success, error)
      break
    case 'vuiWindowContainer':
      var scopeId
      var winScope = scopeManager.getChildWindowScope()
      if (winScope) {
        scopeId = winScope.getInstanceId()
      } else {
        scopeId = scopeManager.getCurrentScopeId()
      }
      scopeManager.destroy(scopeId)
      break
    case 'iemsHomeTab':
      var scopeId = scopeManager.getCurrentScopeId()
      if (scopeId) {
        if (selectConfirm == true) {
          scope.markSelectionConfirmed()
        }
        scopeManager.destroy(scopeId)
      }
      break
    default:
      var success = function () {
        browserUtil.closeWindow({
          isConfirmExit: isClickConfirm
        }) //没有通过打开组件规则打开的，组件变量都不存在，关闭当前窗口
      }
      var error = function () {}
      var winScope = scopeManager.getWindowScope()
      winScope.fireBeforeClose(success, error)
      break
  }
}

/**
 * 执行框架固定API
 */
let executeAPI = function (frameInputParams, ruleContext) {
  let actionAPIComponentCode = 'vbase_prdbizframe'
  let actionAPI = 'API_AfterOpenBizFrameWindowEvent'
  let ruleSetParams = {
    targetConfig: {
      sourceType: 'client-ruleSet', //client-ruleSet(客户端)，server-ruleSet(服务端)
      invokeType: 'api',
      componentCode: actionAPIComponentCode,
      windowCode: '',
      ruleSetCode: actionAPI
    },
    inputParam: frameInputParams,
    config: {
      success: function () {
        callBackFunc()
      },
      error: function () {
        //alert("执行异常！");
      }
    }
  }
  routeEngine.execute(ruleSetParams)
  let callBackFunc = function () {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
}
/**
 * 获取框架窗体入参
 */
let getFrameInputParams = function (
  frameBizWindows,
  windowInputParams,
  frameWindowNameMap,
  scopeComponentCode,
  scopeMetaCode
) {
  let frameInputParams = {}
  // 单据实例
  let frameBizWindowInsatnceValues = new Array()
  let frameBizWindowInsatance = {}
  frameBizWindowInsatance['instanceComponentCode'] = scopeComponentCode
  frameBizWindowInsatance['instanceCode'] = scopeMetaCode
  frameBizWindowInsatnceValues.push(frameBizWindowInsatance)
  let frameBizWindowInstanceDataJson = {
    datas: {
      recordCount: 1, //实体总记录数
      values: frameBizWindowInsatnceValues //实体数据
    },
    metadata: {
      model: [
        {
          datasource: 'frameBizWindowInstance', //实体编码
          /* 字段列表 */
          fields: [
            { code: 'instanceComponentCode', type: 'char' },
            { code: 'instanceCode', type: 'char' }
          ]
        }
      ]
    }
  }
  let frameBizWindowInstanceDataValue = DBFactory.unSerialize(
    frameBizWindowInstanceDataJson
  )
  // 解析业务窗体
  if (frameBizWindows) {
    let frameBizWindowValues = new Array()
    let frameGroupValues = new Array()
    let frameActionValues = new Array()
    let actionCount = 0
    let groupCount = 0
    let bizWindowCount = 0
    for (let j = 0; j < frameBizWindows.length; j++) {
      bizWindowCount++
      let frameBizWindowValue = {}
      // 获取业务窗体
      let frameBizWindow = frameBizWindows[j]
      // 获取业务窗体ID
      let frameBizWindowId = frameBizWindow['id']
      // 获取业务窗体所在构件编码
      let bizComponentCode = frameBizWindow['bizComponentCode']
      // 获取业务窗体窗体编码
      let bizWindowCode = frameBizWindow['bizWindowCode']
      // 获取业务窗体名称
      let bizWindowName = frameBizWindow['bizWindowName']
      // 获取业务窗体排序
      let bizWindowOrder = frameBizWindow['bizWindowOrder']
      // 获取业窗体标题
      let bizWindowTitle = frameBizWindow['bizWindowTitle']
      // 获取业务窗体是否默认选中
      let isDefaultSelected = frameBizWindow['isDefaultSelected']
      // 收集业务窗体各个字段信息
      frameBizWindowValue['id'] = frameBizWindowId
      frameBizWindowValue['bizComponentCode'] = bizComponentCode
      frameBizWindowValue['bizWindowCode'] = bizWindowCode
      frameBizWindowValue['bizWindowName'] = bizWindowName
      frameBizWindowValue['bizWindowOrder'] = bizWindowOrder
      frameBizWindowValue['bizWindowTitle'] = bizWindowTitle
      frameBizWindowValue['isDefaultSelected'] = isDefaultSelected
      // 显示默认的业务窗体标题
      if (isDefaultSelected == true) {
        frameWindowNameMap['frameWindowName'] = bizWindowTitle
      }
      // 只有一个业务窗体时显示该业务窗体标题
      if (frameBizWindows.length == 1) {
        frameWindowNameMap['frameWindowName'] = bizWindowTitle
      }
      // 收集业务窗体
      frameBizWindowValues.push(frameBizWindowValue)
      // 获取分组信息
      let groups = frameBizWindow['groups']
      // 解析分组
      if (groups) {
        for (let i = 0; i < groups.length; i++) {
          // 分组数自加1
          groupCount++
          let frameGroupValue = {}
          let frameGroup = groups[i]
          // 获取分组ID
          let frameGroupId = frameGroup['id']
          // 获取分组所属实例ID
          // var instanceId = frameGroup["instanceId"];
          // 获取分组编码
          let frameGroupCode = frameGroup['groupCode']
          // 获取分组名称
          let frameGroupName = frameGroup['groupName']
          // 获取分组控件类型
          let frameGroupControlType = frameGroup['groupControlType']
          // 获取分组父ID
          let pid = frameGroup['pid']
          // 获取分组叶子节点
          let isLeaf = frameGroup['isLeaf']
          // 获取分组排序号
          let order = frameGroup['order']
          // 收集分组个字段信息
          frameGroupValue['id'] = frameGroupId
          frameGroupValue['frameGroupCode'] = frameGroupCode
          frameGroupValue['frameGroupName'] = frameGroupName
          frameGroupValue['frameGroupControlType'] = frameGroupControlType
          frameGroupValue['pid'] = pid
          frameGroupValue['isLeaf'] = isLeaf
          frameGroupValue['frameGroupOrder'] = order
          // 这里要添加分组所在的窗体ID
          frameGroupValue['frameBizWindowId'] = frameBizWindowId
          // 收集分组
          frameGroupValues.push(frameGroupValue)
          // 获取动作
          let frameGroupActions = frameGroup['actions']
          // 解析动作
          if (frameGroupActions) {
            for (let k = 0; k < frameGroupActions.length; k++) {
              actionCount++
              let frameActionValue = {}
              let frameGroupAction = frameGroupActions[k]
              // 获取动作ID
              let actionId = frameGroupAction['id']
              // 获取动作所属实例ID
              //								var instanceId = frameGroupAction["instanceId"];
              // 获取动作所属分组ID
              let frameGroupId = frameGroupAction['groupId']
              // 获取动作编码
              let actionCode = frameGroupAction['actionCode']
              // 获取动作名称
              let actionName = frameGroupAction['actionName']
              // 获取动作执行API
              let actionAPI = frameGroupAction['actionAPI']
              // 获取动作API所在构件编码
              let actionAPIComponentCode =
                frameGroupAction['actionAPIComponentCode']
              // 获取动作执行类型，Client为前端
              let actionAPIType = frameGroupAction['actionAPIType']
              // 获取动作执行SPI
              let actionSPI = frameGroupAction['actionSPI']
              // 获取动作SPI所在构件编码
              let actionSPIComponentCode =
                frameGroupAction['actionSPIComponentCode']
              // 获取动作执行顺序
              let actionOrder = frameGroupAction['actionOrder']
              // 是否使能
              let isEnabled = frameGroupAction['isEnabled']
              // 是否显示
              let isVisible = frameGroupAction['isVisible']
              // 动作类型
              let actionType = frameGroupAction['actionType']

              frameActionValue['id'] = actionId
              frameActionValue['frameGroupCode'] = frameGroupCode
              frameActionValue['actionCode'] = actionCode
              frameActionValue['actionName'] = actionName
              frameActionValue['actionAPI'] = actionAPI
              frameActionValue['actionAPIComponentCode'] =
                actionAPIComponentCode
              frameActionValue['actionAPIType'] = actionAPIType
              frameActionValue['actionSPI'] = actionSPI
              frameActionValue['actionSPIComponentCode'] =
                actionSPIComponentCode
              frameActionValue['actionOrder'] = actionOrder
              frameActionValue['isEnabled'] = isEnabled
              frameActionValue['isVisible'] = isVisible
              frameActionValue['actionType'] = actionType
              frameActionValue['frameGroupId'] = frameGroupId
              // 业务动作主题设置
              let actionDefintion = sandbox.getService(
                'vjs.framework.extension.platform.init.view.schema.component.' +
                  actionSPIComponentCode +
                  '.action.define'
              )
              if (actionDefintion) {
                let actionTheme = actionDefintion.getActionTheme(actionCode)
                frameActionValue['theme'] = actionTheme
              }
              frameActionValues.push(frameActionValue)
            }
          }
        }
      }
    }
    // 构建分组实体字段信息
    let frameGroupFields = getFrameGroupFields()
    let frameActionFields = getFrameActionFields()
    let frameBizWindowFields = getFrameBizWindowFields()
    // 构造业务窗体对象
    let frameBizWindowDataJson = {
      datas: {
        recordCount: bizWindowCount, //实体总记录数
        values: frameBizWindowValues //实体数据
      },
      metadata: {
        model: [
          {
            datasource: 'framGroup', //实体编码
            /* 字段列表 */
            fields: frameBizWindowFields
          }
        ]
      }
    }
    let frameBizWindowDataValue = DBFactory.unSerialize(frameBizWindowDataJson)
    // 构造分组对象
    let frameGroupDataJson = {
      datas: {
        recordCount: groupCount, //实体总记录数
        values: frameGroupValues //实体数据
      },
      metadata: {
        model: [
          {
            datasource: 'framGroup', //实体编码
            /* 字段列表 */
            fields: frameGroupFields
          }
        ]
      }
    }
    let frameGrouDataValue = DBFactory.unSerialize(frameGroupDataJson)
    // 构建执行动作实体字段信息
    let frameActionDataJson = {
      datas: {
        recordCount: actionCount, //实体总记录数
        values: frameActionValues //实体数据
      },
      metadata: {
        model: [
          {
            datasource: 'frameAction', //实体编码
            /* 字段列表 */
            fields: frameActionFields
          }
        ]
      }
    }
    let frameActionDataValue = DBFactory.unSerialize(frameActionDataJson)
    // 构件窗体输入参数实体字段信息
    if (null != windowInputParams && undefined != windowInputParams) {
      //						var variables = windowInputParams["variable"];
      let frameParams = new Array()
      let variableCount = 0
      for (variableCode in windowInputParams) {
        let frameParam = {}
        variableCount++
        let variableValue = windowInputParams[variableCode]
        // 非实体直接赋值
        if (typeof variableValue != 'object' || null == variableValue) {
          frameParam['paramKey'] = variableCode
          frameParam['paramValue'] = variableValue
        } else {
          // 实体类型
          let entiyValeu = jsonUtil.obj2json(variableValue.serialize())
          frameParam['paramKey'] = variableCode
          frameParam['paramValue'] = entiyValeu
        }
        frameParams.push(frameParam)
      }
    }
    let frameParamsDataJson = {
      datas: {
        recordCount: variableCount, //实体总记录数
        values: frameParams //实体数据
      },
      metadata: {
        model: [
          {
            datasource: 'frameAction', //实体编码
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

    // 入参配置
    // 框架动作分组信息
    frameInputParams['frameGroup'] = frameGrouDataValue
    // 框架动作信息
    frameInputParams['frameAction'] = frameActionDataValue
    // 框架动入参信息
    frameInputParams['frameParams'] = frameParamDataValue
    // 业务窗体信息
    frameInputParams['frameBizWindow'] = frameBizWindowDataValue
    // 单据实例信息
    frameInputParams['frameBizWindowInstance'] = frameBizWindowInstanceDataValue
  }
  return frameInputParams
}

/**
 * 构造分组实体字段信息
 */
let getFrameGroupFields = function () {
  let frameGroupFields = new Array()
  // 分组编码字段
  let frameGroupCodeField = {}
  frameGroupCodeField['code'] = 'frameGroupCode'
  frameGroupCodeField['type'] = 'char'
  frameGroupFields.push(frameGroupCodeField)
  // 分组名称字段
  let frameGroupNameField = {}
  frameGroupNameField['code'] = 'frameGroupName'
  frameGroupNameField['type'] = 'char'
  frameGroupFields.push(frameGroupNameField)
  // 分组ID字段
  let frameIdField = {}
  frameIdField['code'] = 'id'
  frameIdField['type'] = 'char'
  frameGroupFields.push(frameIdField)
  // 分组控件类型
  let frameGroupControlTypeField = {}
  frameGroupControlTypeField['code'] = 'frameGroupControlType'
  frameGroupControlTypeField['type'] = 'char'
  frameGroupFields.push(frameGroupControlTypeField)
  // 分组父ID
  let pidField = {}
  pidField['code'] = 'pid'
  pidField['type'] = 'char'
  frameGroupFields.push(pidField)
  // 分组叶子节点
  let isLeafField = {}
  isLeafField['code'] = 'isLeaf'
  isLeafField['type'] = 'boolean'
  frameGroupFields.push(isLeafField)
  let frameGroupOrderField = {}
  frameGroupOrderField['code'] = 'frameGroupOrder'
  frameGroupOrderField['type'] = 'integer'
  frameGroupFields.push(frameGroupOrderField)
  // 业务窗体实例ID
  let frameBizWindowIdField = {}
  frameBizWindowIdField['code'] = 'frameBizWindowId'
  frameBizWindowIdField['type'] = 'char'
  frameGroupFields.push(frameBizWindowIdField)
  return frameGroupFields
}

/**
 * 构造动作实体字段信息
 */
let getFrameActionFields = function () {
  let frameActionFields = new Array()
  let frameGroupCode = {
    code: 'frameGroupCode',
    type: 'char'
  }
  let actionCode = {
    code: 'actionCode',
    type: 'char'
  }
  let actionName = {
    code: 'actionName',
    type: 'char'
  }
  let actionAPI = {
    code: 'actionAPI',
    type: 'char'
  }
  let actionAPIComponentCode = {
    code: 'actionAPIComponentCode',
    type: 'char'
  }
  let actionAPIType = {
    code: 'actionAPIType',
    type: 'char'
  }
  let actionSPI = {
    code: 'actionSPI',
    type: 'char'
  }
  let actionSPIComponentCode = {
    code: 'actionSPIComponentCode',
    type: 'char'
  }
  let actionOrder = {
    code: 'actionOrder',
    type: 'integer'
  }
  let id = {
    code: 'id',
    type: 'char'
  }
  let isEnabled = {
    code: 'isEnabled',
    type: 'boolean'
  }
  let isVisible = {
    code: 'isVisible',
    type: 'boolean'
  }
  let frameGroupId = {
    code: 'frameGroupId',
    type: 'char'
  }
  let theme = {
    code: 'theme',
    type: 'char'
  }
  let actionType = {
    code: 'actionType',
    type: 'char'
  }
  frameActionFields.push(frameGroupCode)
  frameActionFields.push(actionCode)
  frameActionFields.push(actionName)
  frameActionFields.push(actionAPI)
  frameActionFields.push(actionAPIComponentCode)
  frameActionFields.push(actionAPIType)
  frameActionFields.push(actionSPI)
  frameActionFields.push(actionSPIComponentCode)
  frameActionFields.push(actionOrder)
  frameActionFields.push(id)
  frameActionFields.push(isEnabled)
  frameActionFields.push(isVisible)
  frameActionFields.push(frameGroupId)
  frameActionFields.push(theme)
  frameActionFields.push(actionType)
  return frameActionFields
}

// 构造业务窗体字段
let getFrameBizWindowFields = function () {
  let frameBizWindowFields = new Array()
  let id = {
    code: 'id',
    type: 'char'
  }
  let bizComponentCode = {
    code: 'bizComponentCode',
    type: 'char'
  }
  let bizWindowCode = {
    code: 'bizWindowCode',
    type: 'char'
  }
  let bizWindowName = {
    code: 'bizWindowName',
    type: 'char'
  }
  let bizWindowOrder = {
    code: 'bizWindowOrder',
    type: 'integer'
  }
  let bizWindowTitle = {
    code: 'bizWindowTitle',
    type: 'char'
  }
  let isDefaultSelected = {
    code: 'isDefaultSelected',
    type: 'boolean'
  }
  frameBizWindowFields.push(id)
  frameBizWindowFields.push(bizComponentCode)
  frameBizWindowFields.push(bizWindowCode)
  frameBizWindowFields.push(bizWindowName)
  frameBizWindowFields.push(bizWindowOrder)
  frameBizWindowFields.push(bizWindowTitle)
  frameBizWindowFields.push(isDefaultSelected)
  return frameBizWindowFields
}
export { initModule, main }
