import { JsonUtil as jsonUtil } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourcePusher as dbUtil } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { FrontEndAlerter as frontEndAlerterUtil } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { UUID as UUID } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { RouteEngine as routeEngine } from 'packages/core/WebFunc_PrdSetFrameWindowEnable/src/source/node_modules/packages/core/WebFunc_PrdSetBizFormStateInfo/src/source/node_modules/@v-act/vjs.framework.extension.platform.services.engine.route'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { EncryptUtil as math } from '@v-act/vjs.framework.extension.platform.services.domain.encrypt'
import { WindowRenderer as windowRenderer } from '@v-act/vjs.framework.extension.platform.services.view.window.renderer'
import { DesUtil as desUtil } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ExceptionHandler as exceptionHandler } from '@v-act/vjs.framework.extension.platform.interface.exception'
let sandbox

const initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleContext.getRuleCfg()['inParams']
  let inParamObjs = jsonUtil.json2obj(inParams)
  if (null == inParamObjs || undefined == inParamObjs) {
    throw new Error('打开业务框架异常，配置信息错误，获取不到配置信息！')
  }
  // 打开框架窗体
  openFrameWindow(ruleContext, inParamObjs)
}

/**
 * 产生目标窗体的窗体变量信息
 */
let getOpenWindowInputParams = function (
  routeContext,
  inputParams,
  frameWindowInputParams,
  ruleContext,
  scopeComponentCode
) {
  let variable = {}
  getInputVariable(
    variable,
    routeContext,
    inputParams,
    ruleContext,
    true,
    scopeComponentCode
  )
  getInputVariable(
    variable,
    routeContext,
    frameWindowInputParams,
    ruleContext,
    false,
    scopeComponentCode
  )
  let retValue = {
    variable: variable
  }
  return retValue
}

let getInputVariable = function (
  variable,
  routeContext,
  mappingItems,
  ruleContext,
  isBizWindowInput,
  scopeComponentCode
) {
  // 业务窗体入参的前缀，用于区分框架窗体入参
  let prefix = 'FRAME_WINDOW_CODE_'
  if (mappingItems) {
    for (let i = 0; i < mappingItems.length; i++) {
      let mappingItem = mappingItems[i]
      let target = mappingItem['paramName']
      let source = mappingItem['paramValue']
      let type = mappingItem['paramType']
      let bizWindowCode = mappingItem['bizWindowCode']
      switch (type + '') {
        case 'expression':
          var context = new ExpressionContext()
          context.setRouteContext(ruleContext.getRouteContext())
          var expressionValue
          if (null != source && undefined != source) {
            expressionValue = expressionEngine.execute({
              expression: source,
              context: context
            })
          }
          if (isBizWindowInput) {
            if (bizWindowCode.indexOf('.') != -1) {
              variable[prefix + bizWindowCode + '|' + target] = expressionValue
            } else {
              // 入参无构件信息,这里添加上
              variable[
                prefix + scopeComponentCode + '.' + bizWindowCode + '|' + target
              ] = expressionValue
            }
          } else {
            variable[target] = expressionValue
          }
          break
        case 'entity':
          var sourceName = mappingItem['paramValue']
          var sourceType = mappingItem['paramEntityType']
          var sourceRecords = null
          var fieldMappings = mappingItem['entityFieldMapping']
          var sourceDB = null
          if ('window' == sourceType) {
            // 来源是窗体实体的情况
            sourceDB = datasourceManager.lookup({
              datasourceName: sourceName
            })
          } else {
            if ('ruleSetVar' == sourceType) {
              // 来源是活动集上下文变量
              sourceDB = routeContext.getVariable(sourceName)
            } else if ('ruleSetInput' == sourceType) {
              // 来源是活动集输入变量
              sourceDB = routeContext.getInputParam(sourceName)
            }
            if (null == sourceDB) {
              throw new Error(
                '[PrdOpenBizFrameReturnData.getOpenWindowInputParams]来源变量不存在:' +
                  sourceName
              )
            }
          }

          var freeDBName = 'freeDB_' + UUID.generate()
          var scope = scopeManager.getWindowScope()
          var series = scope.getSeries()
          var fieldsMapping = getFreeDBFieldsMapping(fieldMappings)
          var freeDBInput = {
            metadata: {
              model: [
                {
                  datasource: freeDBName,
                  fields: fieldsMapping
                }
              ]
            }
          }
          var freeDB = DBFactory.unSerialize(freeDBInput)

          //实体间数据拷贝
          var copyFieldsMapping = getFreeDBCopyFieldsMapping(fieldMappings)
          freeDB = dbUtil.copyBetweenEntities({
            sourceEntity: sourceDB,
            destEntity: freeDB,
            valuesMapping: copyFieldsMapping,
            dataFilterType: 'all',
            routeContext: routeContext
          })
          if (isBizWindowInput) {
            if (bizWindowCode.indexOf('.') != -1) {
              variable[prefix + bizWindowCode + '|' + target] = freeDB
            } else {
              // 入参无构件信息,这里添加上
              variable[
                prefix + scopeComponentCode + '.' + bizWindowCode + '|' + target
              ] = freeDB
            }
          } else {
            variable[target] = freeDB
          }
          break
      }
    }
  }
}

let getFreeDBFieldsMapping = function (fieldMappings) {
  let fieldsMapping = []
  for (let i = 0; i < fieldMappings.length; i++) {
    let configField = fieldMappings[i]
    let code = configField.destFieldName
    let type = 'char' //目前没有取值的来源，只能认为都是char
    fieldsMapping.push({
      code: code,
      type: type
    })
  }
  return fieldsMapping
}

/**
 * 打开框架窗体，并处理窗体返回值
 */
let openFrameWindow = function (ruleContext, inParamObjs) {
  let routeContext = ruleContext.getRouteContext()
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)

  let scopeComponentCode
  let scopeMetaCode
  let inputBizWindowInstanceCode

  let openType = inParamObjs['openType']
  // 默认为appoint
  if (openType == undefined || openType == '' || openType == null) {
    openType = 'appoint'
  }
  // 动态模式
  if ('dynamic' == openType) {
    let bizWindowInstanceSourceExp = inParamObjs['bizWindowInstanceSource']
    let bizWindowInstanceSource = expressionEngine.execute({
      expression: bizWindowInstanceSourceExp,
      context: context
    })
    if (!bizWindowInstanceSource) {
      throw new Error('打开业务框架异常，业务单据实例编码不能为空！')
    }
    let scope = scopeManager.getScope()
    if (bizWindowInstanceSource.indexOf('.') != -1) {
      let bizWindowInstanceSourceSplit = bizWindowInstanceSource.split('.')
      if (bizWindowInstanceSourceSplit.length != 2) {
        throw new Error(
          '打开业务框架异常，业务单据实例编码【' +
            bizWindowInstanceSource +
            '】不符合规范！'
        )
      }
      // 实例来源于引用
      scopeComponentCode = bizWindowInstanceSourceSplit[0]
      scopeMetaCode = bizWindowInstanceSourceSplit[1]
    } else {
      // 实例来源于自身构件
      scopeComponentCode = scope.getComponentCode()
      scopeMetaCode = bizWindowInstanceSource
    }
    inputBizWindowInstanceCode = bizWindowInstanceSource
  } else {
    // 指定模式
    // 获取业务单据实例编码,实例编码或引用构件编码.实例编码(codexxxx或refComponent.codexxxxx)
    let bizWindowInstanceCode = inParamObjs['bizWindowInstanceCode']
    if (null == bizWindowInstanceCode || undefined == bizWindowInstanceCode) {
      throw new Error(
        '[PrdOpenBizFrameReturnData.main]打开业务框架异常，配置信息错误，获取不到指定的业务窗体实例编码【bizWindowInstanceCode】信息！'
      )
    }
    let scope = scopeManager.getScope()
    if (bizWindowInstanceCode.indexOf('.') != -1) {
      // 实例来源于引用
      scopeComponentCode = bizWindowInstanceCode.split('.')[0]
      scopeMetaCode = bizWindowInstanceCode.split('.')[1]
    } else {
      // 实例来源于自身构件
      scopeComponentCode = scope.getComponentCode()
      scopeMetaCode = bizWindowInstanceCode
    }
    inputBizWindowInstanceCode = bizWindowInstanceCode
  }

  // 获取打开窗体的标题
  let browerFrameWindowTitle = inParamObjs['browerFrameWindowTitle']
  // 获取打开窗体高度
  let heightExp = inParamObjs['heightExp']
  // 获取打开窗体高度
  let widthExp = inParamObjs['widthExp']
  // 入参信息
  let inputParams = inParamObjs['inputParams']
  // 返回映射信息
  let returnMappings = inParamObjs['returnMapping']
  // 获取打开的类型
  let targetContainerType = inParamObjs['targetContainerType']
  // 打开的容器编码
  let windowContainer = inParamObjs['windowContainer']
  // 是否动态传入容器编码
  let isDynamicContainer = inParamObjs['isDynamicContainer']
  // 是否并行执行
  let isAsyn = inParamObjs['isAsyn']
  // divCode
  let divCode = inParamObjs['divCode']
  // 框架窗体入参信息
  let frameWindowInputParams = inParamObjs['frameWindowInputParams']

  // 获取框架窗体输入参数
  let windowInputParams = getOpenWindowInputParams(
    routeContext,
    inputParams,
    frameWindowInputParams,
    ruleContext,
    scopeComponentCode
  )
  let businessRuleResult = {}

  // 解析高度
  let height
  if (null != heightExp && undefined != heightExp && '' != heightExp) {
    height = expressionEngine.execute({
      expression: heightExp,
      context: context
    })
  }
  // 解析宽度
  let width
  if (null != widthExp && undefined != widthExp && '' != widthExp) {
    width = expressionEngine.execute({
      expression: widthExp,
      context: context
    })
  }
  // 解析框架标题
  let browerFrameWindowTitleName
  if (
    null != browerFrameWindowTitle &&
    undefined != browerFrameWindowTitle &&
    '' != browerFrameWindowTitle
  ) {
    browerFrameWindowTitleName = expressionEngine.execute({
      expression: browerFrameWindowTitle,
      context: context
    })
  }
  // 获取获取业务单据实例
  let defferend = componentParam.getMetadata(
    scopeComponentCode,
    'BizWindowInstanceData'
  )
  // 卡住规则链
  if (!isAsyn) {
    ruleContext.markRouteExecuteUnAuto()
  }
  // 开域封装
  let _func = scopeManager.createScopeHandler({
    handler: function (metadatas) {
      let frameInputParams
      if (null == metadatas || undefined == metadatas) {
        throw new Error(
          '打开业务框架异常，获取不到业务单据实例【metadatas】信息！'
        )
      }
      // 根据编码获取业务窗体单据实例
      let bizWindowInstance = metadatas[scopeMetaCode]
      if (null == bizWindowInstance || undefined == bizWindowInstance) {
        throw new Error(
          '打开业务框架异常，根据业务单据实例编码【' +
            inputBizWindowInstanceCode +
            '】获取不到业务单据实例信息！'
        )
      }

      let openFrame = function (
        scopeComponentCode,
        scopeMetaCode,
        currentWindowInputParams,
        bizWindowInstance
      ) {
        // 获取框架窗体所在构件编码
        let frameComponentCode = bizWindowInstance['frameComponentCode']
        // 获取框架窗体编码
        let frameWindowCode = bizWindowInstance['frameWindowCode']
        // 校验数据
        if (null == frameComponentCode || undefined == frameComponentCode) {
          throw new Error(
            '[PrdOpenBizFrameReturnData.openFrameWindow]打开业务框架异常，配置信息错误，获取不到配置需要打开的框架窗体所在构件编码【frameComponentCode】信息！'
          )
        }
        if (null == frameWindowCode || undefined == frameWindowCode) {
          throw new Error(
            '[PrdOpenBizFrameReturnData.openFrameWindow]打开业务框架异常，配置信息错误，获取不到配置需要打开的框架窗体编码【frameWindowCode】信息！'
          )
        }
        if (currentWindowInputParams) {
          windowInputParams = currentWindowInputParams
        }
        // 获取业务窗体列表
        let frameBizWindows = bizWindowInstance['windows']
        if (!frameBizWindows) {
          throw new Error(
            '[PrdOpenBizFrameReturnData.openFrameWindow]打开业务框架异常，配置信息错误，获取不到配置需要打开的业务窗体【windows】信息！'
          )
        }
        let frameWindowNameMap = {}
        // 构造框架API输入参数
        frameInputParams = getFrameInputParams(
          frameBizWindows,
          windowInputParams,
          frameWindowNameMap,
          scopeComponentCode,
          scopeMetaCode
        )
        // 获取框架窗体名称,用业务的窗体名称
        let frameWindowName
        if (
          null == browerFrameWindowTitleName ||
          undefined == browerFrameWindowTitleName
        ) {
          frameWindowName = frameWindowNameMap['frameWindowName']
        } else {
          frameWindowName = browerFrameWindowTitleName
        }
        if (null == targetContainerType || undefined == targetContainerType) {
          throw new Error(
            '打开业务框架异常，配置信息错误，无框架打开方式类型【targetContainerType 】信息！'
          )
        }
        // 根据类型以不同的方式打开
        switch (targetContainerType + '') {
          case 'dialogWindow':
            openDialogWindow(
              ruleContext,
              businessRuleResult,
              frameComponentCode,
              frameWindowCode,
              windowInputParams,
              returnMappings,
              frameWindowName,
              height,
              width,
              frameInputParams,
              scopeComponentCode,
              scopeMetaCode
            )
            break
          case 'windowContainer':
            openWindowContainer(
              ruleContext,
              businessRuleResult,
              windowContainer,
              frameComponentCode,
              frameWindowCode,
              windowInputParams,
              returnMappings,
              frameWindowName,
              frameInputParams,
              isAsyn,
              scopeComponentCode,
              scopeMetaCode
            )
            break
          case 'divWindowContainer':
            openDivWindowContainer(
              ruleContext,
              businessRuleResult,
              windowContainer,
              frameComponentCode,
              frameWindowCode,
              windowInputParams,
              frameWindowName,
              frameInputParams,
              isDynamicContainer,
              divCode,
              scopeComponentCode,
              scopeMetaCode
            )
            break
          case 'iemsHomeTab':
            openIemsHomeTabContainer(
              ruleContext,
              businessRuleResult,
              windowContainer,
              frameComponentCode,
              frameWindowCode,
              windowInputParams,
              frameWindowName,
              frameInputParams,
              isDynamicContainer,
              divCode,
              scopeComponentCode,
              scopeMetaCode
            )
            break
          case 'currentWindow':
            openCurrentWindow(
              ruleContext,
              frameComponentCode,
              frameWindowCode,
              windowInputParams,
              frameWindowName,
              frameInputParams,
              scopeComponentCode,
              scopeMetaCode
            )
            break
          default:
            throw new Error(
              '打开业务框架异常，配置信息错误，不支持【' +
                targetContainerType +
                '】打开方式！'
            )
        }
      }
      executePermission(
        ruleContext,
        scopeComponentCode,
        scopeMetaCode,
        openFrame,
        bizWindowInstance
      )
    }
  })
  // 解析获取获取业务单据实例，并打开框架窗体
  defferend.then(_func)
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
    let isLogined = result['isLogined']
    let functionResource = result['functionResource']
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
        let variable = {}
        variable[
          prefix +
            'vbase_prd_perm.PrdPermNoBizWindowInstancePrivilege' +
            '|' +
            'instanceComponentCode'
        ] = instanceComponentCode
        variable[
          prefix +
            'vbase_prd_perm.PrdPermNoBizWindowInstancePrivilege' +
            '|' +
            'instanceCode'
        ] = instanceCode
        variable[
          prefix +
            'vbase_prd_perm.PrdPermNoBizWindowInstancePrivilege' +
            '|' +
            'privilegeType'
        ] = 'bizWindowInstance'
        let currentWindowInputParams = {
          variable: variable
        }
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

/**
 * 模态方式打开
 */
let openDialogWindow = function (
  ruleContext,
  businessRuleResult,
  componentCode,
  windowCode,
  windowInputParams,
  returnMappings,
  title,
  height,
  width,
  frameInputParams,
  instanceComponentCode,
  instanceCode
) {
  // 标注打开方式为dialog模态窗口
  windowInputParams['variable']['formulaOpenMode'] = 'dialog'
  // 映射关系
  let returnMappingsConfig = returnMappings
  // 关闭窗体回调逻辑
  let routeCallback = function (output) {
    businessRuleResult['isConfirmSelectionOnClose'] = false
    if (output && output['config']) {
      //点击了确定选择
      if (output['config']['isSelectionConfirm'] == true) {
        businessRuleResult['isConfirmSelectionOnClose'] = true
      }
      //有返回输出值
      if (output['config']['isReturnValues'] == true) {
        let windowReturnValue = output['values']
        let returnMappings = returnMappingsConfig
        handleOpenWindowReturnValues(
          ruleContext,
          windowReturnValue,
          returnMappings
        )
      }
    }

    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult(businessRuleResult)
    }
    if (!ruleContext.getRouteContext().getScopeId()) {
      ruleContext
        .getRouteContext()
        .setScopeId(businessRuleResult.windowInstanceCode)
    }
  }
  ruleContext.on({
    eventName: ruleContext.Events.ROUTECALLBACK,
    handler: routeCallback
  })
  let callBackFunc = function (output) {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback(output)
  }
  // 卡住规则链
  ruleContext.markRouteExecuteUnAuto()
  let isOpenMaximize = false
  // 若是宽高为空的情况下考虑
  if (
    width == null ||
    width == undefined ||
    height == null ||
    height == undefined
  ) {
    // 判断该业务单窗体信息
    let records = frameInputParams.frameBizWindow.getAllRecords()
    let designerWidth = -1
    let designerHeigth = -1
    if (records && records['datas']) {
      let datas = records['datas']
      scopeManager.createScopeHandler({
        handler: exeFunc(0)
      })()
    } else {
      openWindow()
    }
  } else {
    openWindow()
  }
  function exeFunc(index) {
    let data = datas[index]
    let dtds = []
    let targetBizComponentCode = data['bizComponentCode']
    let targetBizWindowCode = data['bizWindowCode']
    let params = {
      componentCode: targetBizComponentCode,
      windowCode: targetBizWindowCode
    }
    let maximizeDefferend = windowRenderer.isDefaultMaximize(params)
    dtds.push(maximizeDefferend)
    //			if (width==null || width == undefined) {
    //				var widthDefferend = windowRenderer.getDesignerWidth(params);
    //				dtds.push(widthDefferend);
    //			}
    //			if (height==null || height == undefined) {
    //				var heigthDefferend = windowRenderer.getDesignerHeight(params);
    //				dtds.push(heigthDefferend);
    //			}
    $.when
      .apply($.when, dtds)
      .done(function (
        targetWindowIsMaximize,
        targerWindowWidth,
        targerWindowHeigth
      ) {
        if (targetWindowIsMaximize == true) {
          isOpenMaximize = true
        }
        //				if (targerWindowHeigth > designerHeigth) {
        //					designerHeigth = targerWindowHeigth;
        //				}
        //				if (targerWindowWidth > designerWidth) {
        //					designerWidth = targerWindowWidth;
        //				}
        //				if (designerWidth > -1) {
        //					width = designerWidth;
        //				}
        //				if (designerHeigth > -1) {
        //					height = designerHeigth
        //				}
        index++
        if (index < records.size()) {
          exeFunc(index)
        } else {
          //					// 添加框架高度偏移值--当前34px,另外控件间距8px
          //					if (height > -1) {
          //						height = height + 34 + 8;
          //					}
          openWindow()
        }
      })
      .fail(function (e) {
        ruleContext.handleException(e)
      })
  }
  function openWindow() {
    let windowInstanceCode = browser.showModalModule({
      componentCode: componentCode,
      windowCode: windowCode,
      title: title,
      inputParam: windowInputParams,
      max: isOpenMaximize,
      closeCallback: callBackFunc,
      width: width,
      height: height,
      loaded: function () {
        // 窗体渲染后执行框架API
        executeAPI(frameInputParams, ruleContext)
      },
      vjsContext: {
        frameworkComponentCode: instanceComponentCode, //构件编码
        frameworkInstanceCode: instanceCode //业务单据实例编码
      }
    })
    businessRuleResult['windowInstanceCode'] = windowInstanceCode
  }
}

/**
 * 处理打开窗体返回信息
 */
let handleOpenWindowReturnValues = function (
  ruleContext,
  windowReturnValue,
  returnMappings
) {
  if (!returnMappings || returnMappings.length <= 0) {
    return
  }

  /**
   * 内部方法，获取赋值来源值
   */
  let getSourceValue = function (source, sourceType) {
    let sourceValue = null
    switch (sourceType) {
      case 'returnValue':
        sourceValue = windowReturnValue[source]
        break
      case 'expression':
        var context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
        if (null != source && undefined != source) {
          sourceValue = expressionEngine.execute({
            expression: source,
            context: context
          })
        }
        break
      default:
        break
    }
    return sourceValue
  }

  for (let i = 0; i < returnMappings.length; i++) {
    let mappings = returnMappings[i]
    let destName = mappings['dest']
    let destType = mappings['destType']

    let sourceName = mappings['src']
    let sourceType = mappings['srcType']
    let sourceValue = getSourceValue(sourceName, sourceType)

    let operType = mappings['updateDestEntityMethod']
    let isCleanTarget = mappings['isCleanDestEntityData']

    if (dbService.isEntity(destName, destType, ruleContext)) {
      // 如果实体不存在 则不执行更新数据
      if (sourceValue) {
        sourceValue = sourceValue.getAllRecords()
        dbService.insertOrUpdateRecords2Entity(
          destName,
          destType,
          sourceValue,
          mappings.destFieldMapping,
          operType,
          isCleanTarget,
          ruleContext
        )
      }
    } else {
      switch (destType) {
        case 'control':
          var dsName = windowVmManager.getDatasourceNamesByWidgetCode({
            widgetCode: destName
          })[0]
          var dataSource = datasourceManager.lookup({
            datasourceName: dsName
          })
          var field = windowVmManager.getFieldCodesByWidgetCode({
            widgetCode: destName,
            datasourceName: dsName
          })[0]
          var datasourcePusher = sandbox.getService(
            'vjs.framework.extension.platform.services.domain.datasource.DatasourcePusher'
          )
          datasourcePusher.setFieldValue({
            datasourceName: dsName,
            fieldCode: field,
            value: sourceValue
          })
          break
        case 'windowVariant':
          windowParam.setInput({
            code: destName,
            value: sourceValue
          })
          break
        case 'systemVariant':
          componentParam.setVariant({
            code: destName,
            value: sourceValue
          })
          break
        case 'ruleSetVariant':
          ruleContext.getRouteContext().setVariable(destName, sourceValue)
          break
        case 'ruleSetOutput':
          ruleContext.getRouteContext().setOutputParam(destName, sourceValue)
          break
        case 'windowOutput':
          windowParam.setOutput({
            code: destName,
            value: sourceValue
          })
          break
        default:
          break
      }
    }
  }
}

let getFreeDBCopyFieldsMapping = function (fieldMappings) {
  let copyFieldsMapping = []
  for (let i = 0; i < fieldMappings.length; i++) {
    let configField = fieldMappings[i]
    let paramEntityField = configField.destFieldName
    let fieldValueType =
      configField.srcValueType == 'expression' ? 'expression' : 'field'
    let _srcValueItems = configField.srcValue.split('.')
    let fieldValue = _srcValueItems[_srcValueItems.length - 1]
    if (fieldValueType == 'expression') {
      fieldValue = configField.srcValue
    }
    copyFieldsMapping.push({
      paramEntityField: paramEntityField,
      fieldValueType: fieldValueType,
      fieldValue: fieldValue
    })
  }
  return copyFieldsMapping
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
            {
              code: 'instanceComponentCode',
              type: 'char'
            },
            {
              code: 'instanceCode',
              type: 'char'
            }
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
              //							var instanceId = frameGroupAction["instanceId"];
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
              //								// 业务动作主题设置
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
      let variables = windowInputParams['variable']
      let frameParams = new Array()
      let variableCount = 0
      for (variableCode in variables) {
        let frameParam = {}
        variableCount++
        let variableValue = variables[variableCode]
        // 非实体直接赋值
        if (typeof variableValue != 'object' || null == variableValue) {
          frameParam['paramKey'] = variableCode
          frameParam['paramValue'] = variableValue
        } else {
          // 实体类型
          let entiyValeu = jsonUtil.obj2json(variableValue.serialize())
          frameParam['paramKey'] = variableCode
          // base64加密
          let decryptEntiyValue = math.genHash(entiyValeu, 'base64')
          frameParam['paramValue'] = decryptEntiyValue
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
              {
                code: 'paramKey',
                type: 'char'
              },
              {
                code: 'paramValue',
                type: 'char'
              }
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

let executeAPI = function (frameInputParams, ruleContext) {
  let actionAPIComponentCode = 'vbase_prdbizframe'
  let actionAPI = 'API_AfterOpenBizFrameWindowEvent'
  ruleContext.markRouteExecuteUnAuto()
  let callBackFunc = function (output) {
    ruleContext.fireRuleCallback()
  }
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
}

/**
 * 容器中打开
 */
let openWindowContainer = function (
  ruleContext,
  businessRuleResult,
  containerControlCode,
  componentCode,
  windowCode,
  windowInputParams,
  returnMappings,
  title,
  frameInputParams,
  isAsyn,
  instanceComponentCode,
  instanceCode
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
      '[PrdOpenBizFrameReturnData.openWindowContainer]目标组件容器控件，请检查是否移除了此控件。编号:' +
        containerControlCode
    )
  }
  // 卡住规则链不往下执行
  if (isAsyn == false) {
    ruleContext.markRouteExecuteUnAuto()
  }

  // 标注打开方式为container
  windowInputParams['variable']['formulaOpenMode'] = 'container'
  // 将标签页的ID传入，以提供给退出事件进行关闭
  windowInputParams['variable']['closeTabId'] = windowCode
  let windowInstanceCode = null
  let callBackFunc = function (windowInstanceCode, executeApi) {
    let businessRuleResult_new = {}
    businessRuleResult_new['windowInstanceCode'] = windowInstanceCode
    if (ruleContext.setBusinessRuleResult)
      ruleContext.setBusinessRuleResult(businessRuleResult_new)
    // 新建的容器中打开需要执行
    if (executeApi != false) {
      executeAPI(frameInputParams, ruleContext)
      ruleContext.fireRuleCallback()
      if (isAsyn == false) {
        ruleContext.fireRouteCallback()
      }
    } else {
      ruleContext.fireRuleCallback()
      if (isAsyn == false) {
        ruleContext.fireRouteCallback()
      }
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
    //组件容器中设置为始终隐藏页签时，每次打开业务框架时，都进行重新加载刷新处理，并且把其它隐藏的多余组件页面都清掉
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
    callBackFunc(scopeIdBack, false)
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
        callback: callBackFunc,
        vjsContext: {
          frameworkComponentCode: instanceComponentCode, //构件编码
          frameworkInstanceCode: instanceCode //业务单据实例编码
        }
      },
      0
    )
  }
}

/**
 * div容器打开
 */
let openDivWindowContainer = function (
  ruleContext,
  businessRuleResult,
  containerControlCode,
  componentCode,
  windowCode,
  windowInputParams,
  title,
  frameInputParams,
  isDynamicContainer,
  divCode,
  instanceComponentCode,
  instanceCode
) {
  windowInputParams['variable']['formulaOpenMode'] = 'vuiWindowContainer'
  //如果是动态传入，则按表达式解析
  if (isDynamicContainer) {
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    containerControlCode = expressionEngine.execute({
      expression: containerControlCode,
      context: context
    })
  }

  let widgetId = divCode
  let callBackFunc = function (executeApi) {
    // 执行框架api,新打开时需要执行
    if (executeApi != false) {
      executeAPI(frameInputParams, ruleContext)
    }
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
  let containerParam = {
    containerCode: containerControlCode,
    /* 这个是标签的code */
    componentCode: componentCode,
    windowCode: windowCode,
    inputParams: windowInputParams,
    callBackFunc: callBackFunc,
    divCode: widgetId,
    /* 这个是标签所在div的code */
    title: title,
    vjsContext: {
      frameworkComponentCode: instanceComponentCode, //构件编码
      frameworkInstanceCode: instanceCode //业务单据实例编码
    }
  }
  let scopeId = scopeManager.getCurrentScopeId()
  let _$callback = function (params) {
    let cId = params._iden,
      _windowInstanceCode = params.scopeId,
      /* 激活时有值，非激活时，下面重新赋值 */
      exist = params.existIden
    if (exist) {
      let _fireRuleFunc = containerParam.callBackFunc
      businessRuleResult['windowInstanceCode'] = _windowInstanceCode
      // 设置业务返回值  	内部有异步逻辑，需重新设置返回值 触发释放规则链之前要设置返回值
      ruleContext.setBusinessRuleResult(businessRuleResult)
      if (typeof _fireRuleFunc == 'function') {
        _fireRuleFunc(false)
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
      // 设置业务返回值  	内部有异步逻辑，需重新设置返回值
      ruleContext.setBusinessRuleResult(businessRuleResult)
      scopeManager.closeScope()
    }
  }
  containerParam.callback = _$callback
  /* 标识为打开规则打开 */
  containerParam.OpenMode = 'OpenRule'
  widgetProperty.set(widgetId, 'openWindowToDivContainer', containerParam)
  ruleContext.markRouteExecuteUnAuto()
}

let setRouteCallBack = function (ruleContext, businessRuleResult) {
  // 关闭窗体回调逻辑
  let routeCallback = function (output) {
    businessRuleResult['isConfirmSelectionOnClose'] = false
    if (output && output['config']) {
      //点击了确定选择
      if (output['config']['isSelectionConfirm'] == true) {
        businessRuleResult['isConfirmSelectionOnClose'] = true
      }

      //有返回输出值
      if (output['config']['isReturnValues'] == true) {
        let windowReturnValue = output['values']
        let returnMappings = returnMappingsConfig
        handleOpenWindowReturnValues(
          ruleContext,
          windowReturnValue,
          returnMappings
        )
      }
    }

    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult(businessRuleResult)
    }
    if (!ruleContext.getRouteContext().getScopeId()) {
      ruleContext
        .getRouteContext()
        .setScopeId(businessRuleResult.windowInstanceCode)
    }
  }
  ruleContext.on({
    eventName: ruleContext.Events.ROUTECALLBACK,
    handler: routeCallback
  })
}
/**
 * 生成输入参数标识
 * */
let genInputParamIden = function (windowInputParams) {
  let idens = []
  if (windowInputParams && windowInputParams.variable) {
    let variable = windowInputParams.variable
    for (let key in variable) {
      if (!variable.hasOwnProperty(key)) {
        continue
      }
      idens.push(key)
      let val = variable[key]
      if (DBFactory.isDatasource(val)) {
        let datas = {}
        let records = val.getAllRecords().toArray()
        for (let i = 0, len = records.length; i < len; i++) {
          let record = records[0]
          datas[record.getSysId()] = records[0].toMap()
        }
      } else if (null != val) {
        idens.push(val)
      }
    }
    return desUtil.toMD5(idens.join('$_$'))
  }
  return ''
}

/**
 * 创建多页签窗体
 */
let openIemsHomeTabContainer = function (
  ruleContext,
  businessRuleResult,
  containerControlCode,
  componentCode,
  windowCode,
  windowInputParams,
  title,
  frameInputParams,
  isDynamicContainer,
  divCode,
  scopeComponentCode,
  scopeMetaCode
) {
  setRouteCallBack(ruleContext, businessRuleResult)

  windowInputParams['variable']['formulaOpenMode'] = 'iemsHomeTab'
  //如果是动态传入，则按表达式解析
  if (isDynamicContainer) {
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    containerControlCode = expressionEngine.execute({
      expression: containerControlCode,
      context: context
    })
  }
  //生成输入参数标识，用于判断是否已经打开过
  let idens = [scopeComponentCode, scopeMetaCode]
  idens.push(genInputParamIden({ variable: frameInputParams }))
  let _$callBackFunc = function (executeApi) {
    // 执行框架api,新打开时需要执行
    //if (executeApi != false) {
    executeAPI(frameInputParams, ruleContext)
    //}
  }

  let newScopeId = null
  let destroyScopeListener = function (scopeId) {
    let winScope = scopeManager.getWindowScope()
    //不需要关闭的场景：框架窗体用模态打开另一个窗体
    if (
      newScopeId &&
      winScope &&
      newScopeId == scopeManager.getParentScopeId(winScope.getInstanceId()) &&
      winScope.getOpenMode() != 'dialog'
    ) {
      let output = winScope.getOutput()
      if (output && output.config && output.config.isSelectionConfirm)
        scopeManager.getScope(newScopeId).markSelectionConfirmed()
      scopeManager.un(scopeManager.EVENTS.DESTROY, destroyScopeListener)
      scopeManager.destroy(newScopeId)
    }
  }
  let renderer = sandbox.getService(
    'vjs.framework.extension.platform.services.view.window.render.mode',
    {
      type: 'iemsHomeTab'
    }
  )
  if (renderer) {
    renderer.render({
      title: title,
      ruleContext: ruleContext,
      inputs: windowInputParams,
      componentCode: componentCode,
      windowCode: windowCode,
      idens: idens,
      destroyScopeListener: destroyScopeListener,
      inited: _$callBackFunc,
      vjsContext: {
        frameworkComponentCode: scopeComponentCode, //构件编码
        frameworkInstanceCode: scopeMetaCode //业务单据实例编码
      }
    })
  } else {
    frontEndAlerterUtil.error({
      title: '错误信息',
      msgHeader: '页面打开失败！',
      msg: '无法获取首页vjs服务',
      detail:
        '无法获取首页vjs服务：vjs.framework.extension.platform.services.view.window.render.mode.iemsHomeTab'
    })
  }
}
/**
 * 当前窗体打开方式
 */
let openCurrentWindow = function (
  ruleContext,
  componentCode,
  windowCode,
  windowInputParams,
  title,
  frameInputParams,
  instanceComponentCode,
  instanceCode
) {
  // 打开方式
  windowInputParams['variable']['formulaOpenMode'] = 'locationHref'
  // 当前窗体跳转
  windowInputParams['variable']['windowtitle'] = title
  let redirectModule = function () {
    browser.redirectModule({
      componentCode: componentCode,
      windowCode: windowCode,
      params: {
        inputParam: windowInputParams
      },
      inited: function () {
        // 窗体渲染后执行框架API
        executeAPI(frameInputParams, ruleContext)
      },
      vjsContext: {
        frameworkComponentCode: instanceComponentCode, //构件编码
        frameworkInstanceCode: instanceCode //业务单据实例编码
      }
    })
  }
  let currentScopeId = scopeManager.getCurrentScopeId()
  if (scopeManager.isWindowScope(currentScopeId)) {
    // 获取单据窗体标识,若是单据窗体，需要在框架窗体中跳转
    let belongToFrameBizWindow = windowParam.getInput({
      code: 'belongToFrameBizWindow'
    })
    if (belongToFrameBizWindow == true) {
      // 获取框架窗体域ID
      currentScopeId = scopeManager.getParentScopeId(currentScopeId)
      if (!currentScopeId) {
        throw new Error(
          '[PrdOpenBizFrameReturnData.openCurrentWindow]当前页面跳转打开单据实例异常，获取不到框架窗体信息！'
        )
      }
      scopeManager.createScopeHandler({
        scopeId: currentScopeId,
        handler: redirectModule
      })()
      return
    }
  }
  redirectModule()
}
export { initModule, main }
