import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { BrowserUtil as browserUtil } from '@v-act/vjs.framework.extension.platform.services.browser'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

//规则主入口(必须有)
let main = function (ruleContext: any) {
  // 获取输入参数
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  // 获取配置的信息实体
  let openWindowInfo = inParams['openWindowInfo']
  if (null == openWindowInfo || undefined == openWindowInfo) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.main]打开组件异常，配置信息错误，获取不到配置信息！'
    )
  }
  let datas = openWindowInfo['datas']
  let values = datas['values']
  if (null == values || undefined == values || values.length == 0) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.main]打开组件异常，配置信息错误，获取不到配置信息！'
    )
  }
  // 拿到配置信息
  let value = values[0]
  // 打开窗体
  openWindow(value, ruleContext)
}

let openWindow = function (value: any, ruleContext: any) {
  // 获取打开类型
  let openType = value['openType']
  // 获取打开的窗体表达式
  let windowNumSource = value['windowNumSource']
  // 获取打开的容器类型
  let targetContainerType = value['targetContainerType']
  // 获取打开的容器
  let windowContainer = value['windowContainer']
  // 获取窗口标题
  let browerWindowTitle = value['browerWindowTitle']

  // 获取单据实例所在构件编码
  let instanceComponentCodeExp = value['instanceComponentCode']
  // 获取单据实例编码
  let instanceCodeExp = value['instanceCode']
  if ('dynamic' != openType) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.openWindow]打开组件异常，配置信息错误，当前只支持动态打开窗体类型！'
    )
  }
  if ('windowContainer' != targetContainerType) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.openWindow]打开组件异常，配置信息错误，当前只支持从容器打开窗体！'
    )
  }
  if (
    null == windowNumSource ||
    undefined == windowNumSource ||
    '' == windowNumSource
  ) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.openWindow]打开组件异常，配置信息错误，无配置打开窗体信息！'
    )
  }
  if (
    null == windowContainer ||
    undefined == windowContainer ||
    '' == windowContainer
  ) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.openWindow]打开组件异常，配置信息错误，无配置指定的容器！'
    )
  }
  let routeContext = ruleContext.getRouteContext()
  // 解析表达式取，获取打开的窗体编码信息
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  // 构件编码.窗体编码
  let targetWindowId = formulaUtil.execute({
    expression: windowNumSource,
    context: context
  })
  let targetComponentCode
  let targetWindowCode
  // 获取构件编码与窗体编码
  if (targetWindowId.indexOf('.') != -1) {
    targetComponentCode = targetWindowId.split('.')[0]
    targetWindowCode = targetWindowId.split('.')[1]
  }
  // 解析单据实例所在构件编码
  let instanceComponentCode
  if (instanceComponentCodeExp) {
    instanceComponentCode = formulaUtil.execute({
      expression: instanceComponentCodeExp,
      context: context
    })
  }
  // 解析单据实例编码
  let instanceCode
  if (instanceCodeExp) {
    instanceCode = formulaUtil.execute({
      expression: instanceCodeExp,
      context: context
    })
  }
  // 获取窗体输入参数值
  let windowInputParams = getOpenWindowInputParams(
    targetComponentCode,
    targetWindowCode,
    ruleContext
  )
  /*获取是否异步属性*/
  let tmpIsAsyn = false
  let businessRuleResult = {}
  executePermission(
    ruleContext,
    businessRuleResult,
    windowContainer,
    targetComponentCode,
    targetWindowCode,
    windowInputParams,
    browerWindowTitle,
    tmpIsAsyn,
    instanceComponentCode,
    instanceCode
  )
}

// 获取要打开的目标窗体的输入参数信息
let getOpenWindowInputParams = function (
  targetComponentCode: string,
  targetWindowCode: string,
  ruleContext: any
) {
  /**
   * 获取当前窗体的输入参数信息
   */
  let variable = {}
  // 获取当前窗体所有窗体入参
  let currentWindowInputParams = windowParam.getInputs()
  // 若是当前窗体的入参为空，直接返回空信息
  if (currentWindowInputParams) {
    for (let currentWindowInputParam in currentWindowInputParams) {
      if (currentWindowInputParam.startsWith('FRAME_WINDOW_CODE_')) {
        let code = currentWindowInputParam.substring(
          'FRAME_WINDOW_CODE_'.length
        )
        let targetComponentId = targetComponentCode + '.' + targetWindowCode
        let meteCode = code.substring(targetComponentId.length + 1)
        variable[meteCode] = currentWindowInputParams[currentWindowInputParam]
      }
    }
  }
  // 设置单据窗体标识
  variable['belongToFrameBizWindow'] = true
  let retValue = {
    variable: variable
  }
  return retValue
}

/**
 * 打开窗体组件容器
 */
let openWindowContainer = function (
  ruleContext: any,
  businessRuleResult: any,
  containerControlCode: string,
  componentCode: string,
  windowCode: string,
  windowInputParams: any,
  title: string,
  tmpIsAsyn: any,
  instanceComponentCode: string,
  instanceCode: string,
  privilegeInfo: any
) {
  let tmpActionHandler = null
  if (
    containerControlCode &&
    widgetContext.isWidgetExist(containerControlCode)
  ) {
    // 组件容器不为空并且对应控件存在则按照正常的方式
    tmpActionHandler = actionHandler
  }
  if (tmpActionHandler == null) {
    throw new Error(
      '[PrdOpenBizWindowReturnData.openWindowContainer]目标组件容器控件，请检查是否移除了此控件。编号:' +
        containerControlCode
    )
  }
  // 卡住规则链不往下执行
  if (tmpIsAsyn == false) {
    ruleContext.markRouteExecuteUnAuto()
  }
  // 若是有权限，需要打开
  if (privilegeInfo) {
    privilegeInfo['bizInstance']
  }
  // 标注打开方式为container
  windowInputParams['variable']['formulaOpenMode'] = 'container'
  // 将标签页的ID传入，以提供给退出事件进行关闭
  windowInputParams['variable']['closeTabId'] = windowCode

  // 此处设置业务单据实例信息,放到打开的业务单窗体中,为后面在业务单窗体获取单据信息提供入口
  windowInputParams['variable']['instance_componentCode'] =
    instanceComponentCode
  windowInputParams['variable']['instance_code'] = instanceCode
  let windowInstanceCode = null
  let callBackFunc = function (windowInstanceCode: string) {
    setPrivilegeInfo(windowInstanceCode)
  }
  // 设置权限信息
  let setPrivilegeInfo = function (windowInstanceCode: string) {
    let currentScopeId: any = scopeManager.getCurrentScopeId()
    // 获取父框架窗体域实例Id
    let parentScopeId = scopeManager.getParentScopeId(currentScopeId)
    if (privilegeInfo) {
      // 单据窗体权限信息
      let bizWindowInstanceresourceId = privilegeInfo['bizWindowInstance']
      if (bizWindowInstanceresourceId) {
        widgetAction.executeComponentAction('setReadOnly', windowCode, true)
        // 无单据实例权限,存放信息
        windowParam.setInput({
          code: 'biz_window_privilege',
          value: false
        })
      }
      // 动作权限信息
      let bizInstanceActions = privilegeInfo['bizInstanceAction']
      if (bizInstanceActions) {
        if (bizInstanceActions.length > 0) {
          // 设置动作权限数据
          let _func = scopeManager.createScopeHandler({
            scopeId: parentScopeId,
            handler: function () {
              // 获取窗体所有的实体信息
              let datasource = datasourceManager.lookup({
                datasourceName: 'privilegeAction'
              })
              if (datasource) {
                datasource.load({
                  datas: bizInstanceActions,
                  dataAmount: bizInstanceActions.length,
                  isAppend: false
                })
              }
            }
          })
          _func()
        }
      }
    }
    let businessRuleResult_new = {}
    businessRuleResult_new['windowInstanceCode'] = windowInstanceCode
    if (ruleContext.setBusinessRuleResult)
      ruleContext.setBusinessRuleResult(businessRuleResult_new)
    ruleContext.fireRuleCallback()
    if (tmpIsAsyn == false) {
      ruleContext.fireRouteCallback()
    }
  }
  let containerId = tmpActionHandler.executeWidgetAction(
    containerControlCode,
    'getContainerIdByInfo',
    {
      componentCode: componentCode,
      windowCode: windowCode,
      title: title,
      otherInfo: ''
    }
  )
  if (containerId) {
    //组件容器中设置为始终隐藏页签时，每次打开组件时，都进行重新加载刷新处理，并且把其它隐藏的多余组件页面都清掉
    //处理逻辑过程：增加判断，当组件容器设置为始终隐藏tab页签时，新打开一个组件时都进行add操作来刷新处理（控件中，当遇到隐藏tab进行增加时,是先进行清空已打开的，然后再进行add）
    //因为可能有数据更新了，要先刷新,刷新后再激活
    let windowInputParams = {}
    windowInputParams['componentCode'] = componentCode
    let scopeIdBack = tmpActionHandler.executeWidgetAction(
      containerControlCode,
      'activeByComponentId',
      componentCode,
      windowCode,
      title,
      '',
      windowInputParams,
      {
        containerId: containerId
      }
    )
    callBackFunc(scopeIdBack)
  } else {
    tmpActionHandler.executeWidgetAction(
      containerControlCode,
      'add',
      {
        componentCode: componentCode,
        id: windowCode,
        isComponent: true,
        title: title,
        otherInfo: '',
        componentVariable: windowInputParams,
        selected: true,
        closed: function (output: any) {
          closeFrameWindow(output)
        },
        callback: callBackFunc
      },
      0
    )
  }
}

// 设置权限信息
let executePermission = function (
  ruleContext: any,
  businessRuleResult: any,
  containerControlCode: string,
  componentCode: string,
  windowCode: string,
  windowInputParams: any,
  title: string,
  tmpIsAsyn: any,
  instanceComponentCode: string,
  instanceCode: string
) {
  ruleContext.markRouteExecuteUnAuto()
  // 获取权限信息的方法
  let actionAPIComponentCode = 'vbase_prd_perm_api'
  let actionAPI = 'API_PermGetUseBizWindowInstancePrivilegeByInstanceCode'
  let privilegeInfo = {}
  // 设置回调信息
  let apiCallBackFunc = function (result) {
    let isSettingPrivilege = result['isSettingPrivilege']
    if (isSettingPrivilege == true) {
      let functionResource = result['functionResource']
      if (functionResource) {
        let functionResourceDatas = functionResource.getAllRecords().datas
        let datas = new Array()
        if (functionResourceDatas) {
          let hasBizWindowPrivilege = false
          for (let i = 0; i < functionResourceDatas.length; i++) {
            let instancePrivilege = functionResourceDatas[i]
            let isPrivilege = instancePrivilege['isPrivilege']
            let isEnable = instancePrivilege['isEnable']
            let resourceId = instancePrivilege['resourceId']
            let canEdit = instancePrivilege['canEdit']
            let canQuery = instancePrivilege['canQuery']
            // 拥有单据实例权限，即拥有所有权限
            if (resourceId == instanceComponentCode + '|' + instanceCode) {
              if (isEnable == false) {
                // 禁用，直接认为开了权限
                hasBizWindowPrivilege = true
                break
              }
              // 单据编辑权开启，所有权限应都有
              if (canEdit == true && canQuery == true && isPrivilege == true) {
                hasBizWindowPrivilege = true
                break
              }
            }
          }
          if (hasBizWindowPrivilege == false) {
            let hasBizWindowEditPrivilege = false
            let hasBizWindowQueryPrivilege = false
            for (let i = 0; i < functionResourceDatas.length; i++) {
              let instancePrivilege = functionResourceDatas[i]
              let isEnable = instancePrivilege['isEnable']
              let isPrivilege = instancePrivilege['isPrivilege']
              let resourceId = instancePrivilege['resourceId']
              let canEdit = instancePrivilege['canEdit']
              let canQuery = instancePrivilege['canQuery']

              // 单据体权限
              if (
                resourceId ==
                instanceComponentCode +
                  '|' +
                  instanceCode +
                  '|' +
                  componentCode +
                  '|' +
                  windowCode
              ) {
                // 收集单据权限信息
                // 单据体编辑权
                if (
                  canEdit == true &&
                  canQuery == true &&
                  isPrivilege == true
                ) {
                  hasBizWindowEditPrivilege = true
                }
                // 单据体查询权限
                if (
                  canEdit == false &&
                  canQuery == true &&
                  isPrivilege == true
                ) {
                  hasBizWindowQueryPrivilege = true
                }
              }
            }
            for (let i = 0; i < functionResourceDatas.length; i++) {
              let instancePrivilege = functionResourceDatas[i]
              let isEnable = instancePrivilege['isEnable']
              let isPrivilege = instancePrivilege['isPrivilege']
              let resourceId = instancePrivilege['resourceId']
              let canEdit = instancePrivilege['canEdit']
              let canQuery = instancePrivilege['canQuery']

              // 动作启用并且无权限，需要设置不使能,这里进行收集
              if (
                resourceId.contains(
                  instanceComponentCode +
                    '|' +
                    instanceCode +
                    '|' +
                    componentCode +
                    '|' +
                    windowCode +
                    '|'
                ) &&
                isEnable == true &&
                isPrivilege == false
              ) {
                let codes = resourceId.split('|')
                let bizComponentCode = codes[2]
                let bizWindowCode = codes[3]
                let frameActionCode = codes[4]

                let data = {
                  actionCode: frameActionCode,
                  isPrivilege: false,
                  bizComponentCode: bizComponentCode,
                  bizWindowCode: bizWindowCode,
                  id: frameActionCode
                }
                datas.push(data)
              }
            }
            // 既无编辑权限有无查询权限，需要打开无权限窗体
            if (
              hasBizWindowEditPrivilege == false &&
              hasBizWindowQueryPrivilege == false
            ) {
              let variable = {}
              variable['bizWindowComponentCode'] = componentCode
              variable['bizWindowCode'] = windowCode
              variable['privilegeType'] = 'bizWindow'
              windowInputParams = {
                variable: variable
              }
              // 将打开的单据体替换成无权限窗体
              componentCode = 'vbase_prd_perm'
              windowCode = 'PrdPermNoBizWindowInstancePrivilege'
              instanceComponentCode = 'vbase_prd_perm_inst'
              instanceCode = 'PrdPermNoBizWindowInstancePrivilegeInstance'
            }
            // 有查询权，无编辑权限，需要设置只读
            else if (
              hasBizWindowEditPrivilege == false &&
              hasBizWindowQueryPrivilege == true
            ) {
              privilegeInfo['bizWindowInstance'] = resourceId
            }
            if (datas.length > 0) {
              // 收集动作权限信息
              privilegeInfo['bizInstanceAction'] = datas
            }
          }
        }
      }
    }
    // 获取权限信息后在组件容器中打开
    openWindowContainer(
      ruleContext,
      businessRuleResult,
      containerControlCode,
      componentCode,
      windowCode,
      windowInputParams,
      title,
      tmpIsAsyn,
      instanceComponentCode,
      instanceCode,
      privilegeInfo
    )
  }
  // 设置入参
  let frameInputParams = {}
  frameInputParams['componentCode'] = instanceComponentCode
  frameInputParams['instanceCode'] = instanceCode
  let ruleSetParams = {
    targetConfig: {
      sourceType: 'server-ruleSet', //client-ruleSet(客户端)，server-ruleSet(服务端)
      invokeType: 'api',
      componentCode: actionAPIComponentCode,
      windowCode: '',
      ruleSetCode: actionAPI
    },
    inputParam: frameInputParams,
    config: {
      success: function (result) {
        apiCallBackFunc(result)
      },
      error: function (output) {
        throw new Error(
          '[PrdOpenBizWindowReturnData.getPrivilegeInfo]获取权限信息失败：' +
            output
        )
      }
    }
  }
  // 执行获取权限信息方法
  routeEngine.execute(ruleSetParams)
}

/**
 * 关闭窗体
 */
let closeFrameWindow = function (output: any) {
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
          for (let outParam in outParams) {
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
    default:
      var success = function () {
        browserUtil.closeWindow() //没有通过打开组件规则打开的，组件变量都不存在，关闭当前窗口
      }
      var error = function () {}
      var winScope = scopeManager.getWindowScope()
      winScope.fireBeforeClose(success, error)
      break
  }
}

export { main }
