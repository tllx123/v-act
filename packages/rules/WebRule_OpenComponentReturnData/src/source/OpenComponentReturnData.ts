import { ApplicationParam as AppData } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import {
  ExpressionContext,
  ExpressionEngine as formulaUtil
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { DatasourcePusher as dbUtil } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import {
  ComponentParam as componentParam,
  WindowParam as windowParam
} from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import {
  WidgetAction as actionHandler,
  WidgetProperty as widgetProperty
} from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { uuid as UUID } from '@v-act/vjs.framework.extension.util.uuid'

let sandBox

let ExpressionEngine
export function initModule(sBox) {
  sandBox = sBox
}

const main = function (ruleContext) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  openWindow(inParams, ruleContext)
  return true
}

/**
 * 获取窗体映射信息（待用）。
 * */
let getMappingWindowInfo_New = function (componentCode, windowCode) {
  let result = {}
  result.componentCode = componentCode
  result.windowCode = windowCode
  if (
    componentCode &&
    windowCode &&
    AppData &&
    typeof AppData.getWindowMapping == 'function'
  ) {
    let tmpResult = AppData.getWindowMapping(result)
    if (tmpResult != null) {
      return tmpResult
    }
  }
  return result
}

let getMappingWindowInfo = function (componentCode, windowCode) {
  let result = {}
  result.componentCode = componentCode
  result.windowCode = windowCode
  if (componentCode && windowCode && window._$V3PlatformWindowMapping) {
    let mapping = window._$V3PlatformWindowMapping
    let key = '__' + componentCode + '__' + windowCode + '__'
    if (mapping[key]) {
      return mapping[key]
    }
  }
  return result
}

let openWindowToDiv = function (params, ruleContext) {
  let callback = function () {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
  params.callback = callback
  browser.openWindowToDiv(params)
  ruleContext.markRouteExecuteUnAuto()
}
/**
 * 获取构件编码（目前调用的地方仅仅是打开窗体到div里面）
 * */
let getComponentCode = function (inParams, ruleContext) {
  //构件Code
  let componentCode = inParams['componentCode']
  if (!componentCode) {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let retValue = formulaUtil.execute({
    expression: componentCode,
    context: context
  })
  return retValue
}
/**
 * 获取打开参数
 * */
let getOpenParam = function (inParams, ruleContext) {
  let sourceValue = inParams['windowNumSource']
  // 默认按表达式取
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  openParam = formulaUtil.execute({
    expression: sourceValue,
    context: context
  })
  try {
    openParam = jsonUtil.json2obj(openParam)
  } catch (e) {
    throw new Error(
      '打开组件发生错误，当前为根据参数打开窗体，但参数格式不正确，当前参数：[' +
        openParam +
        '],' +
        e
    )
  }
  return openParam
}
/**
 * 获取模拟框参数
 */
let getParam = function (inParams, ruleContext, valName) {
  let sourceValue = inParams[valName]
  // 默认按表达式取
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  openParam = formulaUtil.execute({
    expression: sourceValue,
    context: context
  })
  try {
    openParam = jsonUtil.json2obj(openParam)
  } catch (e) {
    console.error(
      '打开组件发生错误，当前为根据参数打开窗体，但参数格式不正确，当前参数：[' +
        openParam +
        '],' +
        e
    )
    let _un
    return _un
    //throw new Error("打开组件发生错误，当前为根据参数打开窗体，但参数格式不正确，当前参数：["+openParam+"]," + e);
  }
  return openParam
}
let openWindow = function (inParams, ruleContext) {
  let openWindowType = inParams['openType']

  let routeContext = ruleContext.getRouteContext()

  let businessRuleResult = {}
  let title = getOpenWindowTitle(inParams, ruleContext)
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()
  let windowCode = getOpenWindowCode(inParams, ruleContext)
  let windowInputParams = getOpenWindowInputParams(
    routeContext,
    inParams['inputParams'],
    ruleContext
  )
  let height = getOpenWindowHeight(inParams, ruleContext)
  let width = getOpenWindowWidth(inParams, ruleContext)
  let openWindowParam = {}
  if (openWindowType == 'fromParam') {
    openWindowParam = getOpenParam(inParams, ruleContext)
  } else {
    // 如果打开窗口编号带有.则拆分并映射到构件编号和窗体编号上
    if (windowCode.indexOf('.') != -1) {
      componentCode = windowCode.split('.')[0]
      windowCode = windowCode.split('.')[1]
    }
  }

  /*
     移除多语言
     // 把语言设置到输入 windowInputParams
    if (inParams['languageCode'] && inParams['languageCode'] != "") {
        if (!windowInputParams)
            windowInputParams = new Object();


        var langCode = inParams['languageCode'];
        // 判断该语言是否支持，如果不支持，则返回默认语言
        curLangCode = resourcepackage.getValidLanguage(componentCode, langCode);
        
        windowInputParams.resourcePackage = {language:langCode}
    }*/
  let newConfig = getMappingWindowInfo(componentCode, windowCode)
  componentCode = newConfig.componentCode
  windowCode = newConfig.windowCode
  if (!(componentCode && windowCode)) {
    log.error(
      '打开的窗体构件code或窗体code为空，构件code为：' +
        componentCode +
        '窗体code为：' +
        windowCode
    )
    return
  }
  let openType = inParams['targetContainerType']
  let series = scopeManager.getWindowScope().getSeries()
  switch (openType) {
    case 'currentWindow':
      //				var nowScope = scopeManager.getWindowScope();
      //				if(!nowScope || nowScope.get("VPlatformTmpOpenMode") != "modal_url"){
      //				}
      windowInputParams['variable']['formulaOpenMode'] = 'locationHref'
      // 当前窗体跳转
      windowInputParams['variable']['windowtitle'] = title
      // actionHandler.executeComponentAction("loadComponent",componentCode,windowCode, windowInputParams);
      //	viewModel.getCmpModule().redirectModule(componentCode, windowCode, {inputParam:windowInputParams});
      browser.redirectModule({
        componentCode: componentCode,
        windowCode: windowCode,
        params: {
          inputParam: windowInputParams
        }
      })
      break
    case 'currentWindowRedirection':
      // 当前窗体跳转
      browser.redirectLocation({
        componentCode: componentCode,
        windowCode: windowCode,
        title:
          title == undefined || title == null
            ? title
            : encodeURIComponent(title),
        inputParam: windowInputParams
      })
      break
    case 'dialogWindow':
      // 模态窗体打开，并处理返回值信息
      /**
       *   dialogType
       *   dialogFlag
       *   openLocation
       *   heightType
       *   heightExp:
       *   heightUnit
       *   widthType
       *   widthExp
       *   widthUnit
       *   isPushMainWindow
       * */
      windowInputParams['variable']['formulaOpenMode'] = 'dialog'
      //移动控件
      if (inParams.dialogType) {
        var _dialogParams = {}
        _dialogParams.dialogType = inParams.dialogType
        _dialogParams.dialogFlag = inParams.dialogFlag
        _dialogParams.openLocation = inParams.openLocation
        _dialogParams.heightType = inParams.heightType
        _dialogParams.heightExp =
          inParams.heightExp == ''
            ? ''
            : getParam(inParams, ruleContext, 'heightExp')
        _dialogParams.heightUnit = inParams.heightUnit
        _dialogParams.widthType = inParams.widthType
        _dialogParams.widthExp =
          inParams.widthExp == ''
            ? ''
            : getParam(inParams, ruleContext, 'widthExp')
        _dialogParams.widthUnit = inParams.widthUnit
        _dialogParams.isPushMainWindow = inParams.isPushMainWindow
        windowInputParams['dialogParams'] = _dialogParams
        _dialogParams = null
      }
      var returnMappings = inParams['returnMapping']
      openDialogWindow(
        ruleContext,
        businessRuleResult,
        componentCode,
        windowCode,
        windowInputParams,
        returnMappings,
        title,
        height,
        width
      )
      break
    case 'newWindow':
      // 总是新窗口打开,标注为非模态打开
      if ('bootstrap_mobile' != series) {
        windowInputParams['variable']['formulaOpenMode'] = 'dialog'
        //viewModel.getCmpModule().callModuleEx(componentCode,windowCode, title, windowInputParams, null, null, false, "_blank");
        browser.callBrowserWindow({
          componentCode: componentCode,
          windowCode: windowCode,
          title: title,
          inputParam: windowInputParams,
          isBlock: false,
          winName: '_blank'
        })
      }

      break
    case 'appointWindow':
      // 标注在指定的窗口打开
      if ('bootstrap_mobile' != series) {
        var flag = inParams['browerWindowFlag']
        windowInputParams['variable']['formulaOpenMode'] = 'dialog'
        // viewModel.getCmpModule().callModuleEx(componentCode,windowCode, title, windowInputParams, null, null, false, flag);
        browser.callBrowserWindow({
          componentCode: componentCode,
          windowCode: windowCode,
          title: title,
          inputParam: windowInputParams,
          isBlock: false,
          winName: flag
        })
      }
      break
    case 'windowContainer':
      /*获取是否异步属性*/
      var tmpIsAsyn = inParams.isAsyn == undefined ? false : inParams.isAsyn
      // 在组件容器中打开
      var containerControlCode = inParams['windowContainer']
      openWindowContainer(
        ruleContext,
        businessRuleResult,
        containerControlCode,
        componentCode,
        windowCode,
        windowInputParams,
        title,
        tmpIsAsyn
      )
      break
    case 'currentContainer':
      windowInputParams['variable']['formulaOpenMode'] = 'container'
      openWindowToDiv(
        {
          componentCode: openWindowParam.componentCode,
          windowCode: openWindowParam.windowCode,
          divId: openWindowParam.divId,
          param: windowInputParams,
          title: title
        },
        ruleContext
      )
      break
    //Div窗体容器
    case 'divWindowContainer':
      windowInputParams['variable']['formulaOpenMode'] = 'vuiWindowContainer'

      ////////////////////////////////////////////////////////////////////
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
      ////////////////////////////////////////////////////////////////////

      var widgetId = inParams.divCode
      var callBackFunc = function () {
        ruleContext.fireRuleCallback()
        ruleContext.fireRouteCallback()
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
          // 设置业务返回值  	内部有异步逻辑，需重新设置返回值 触发释放规则链之前要设置返回值
          ruleContext.setBusinessRuleResult(businessRuleResult)
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
      break
    default:
      throw new Error(
        '[OpenComponentReturnData.openWindow]不正确的打开方式：' + openType
      )
      break
  }

  // 设置业务返回值
  if (ruleContext.setBusinessRuleResult && openType != 'windowContainer') {
    ruleContext.setBusinessRuleResult(businessRuleResult)
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
        sourceValue = formulaUtil.execute({
          expression: source,
          context: context
        })
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

    /**
     * 2015-05-09 liangchaohui：<br>
     * 修改insertOrUpdateRecords2Entity，操作类型为更新时，如果目标实体没有匹配id的记录，则不做任何操作，原来没匹配id时会新增记录<br>
     * 如果目标是实体类型时，走dbService.insertOrUpdateRecords2Entity，如果是其他类型，则走原来直接赋值的逻辑<br>
     * 原来case "entity"分支，由于目标是实体类型，所以已经抽到dbService.insertOrUpdateRecords2Entity中实现，所以在else分支中删除该逻辑<br>
     */
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
          //var record = dataSource.getCurrentRecord();
          var field = windowVmManager.getFieldCodesByWidgetCode({
            widgetCode: destName,
            datasourceName: dsName
          })[0]
          //record.set(field, sourceValue);
          var datasourcePusher = sandBox.getService(
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

/**
 * 打开模态窗体，并处理窗体返回值
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
  width
) {
  let returnMappingsConfig = returnMappings
  // 标注打开方式为dialog模态窗口
  let routeCallback = function (output) {
    businessRuleResult['isConfirmSelectionOnClose'] = false
    //点击了确定选择
    if (output && output['config']['isSelectionConfirm'] == true) {
      businessRuleResult['isConfirmSelectionOnClose'] = true
    }

    //有返回输出值
    if (output && output['config']['isReturnValues'] == true) {
      let windowReturnValue = output['values']
      let returnMappings = returnMappingsConfig
      handleOpenWindowReturnValues(
        ruleContext,
        windowReturnValue,
        returnMappings
      )
    }

    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult(businessRuleResult)
    }
    //dengb:添加域id到路由上下文
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

  ruleContext.markRouteExecuteUnAuto()

  //var windowInstanceCode = viewModel.getCmpModule().callModalModule(componentCode, windowCode, title, null, null, windowInputParams, callBackFunc);
  let windowInstanceCode = browser.showModalModule({
    componentCode: componentCode,
    windowCode: windowCode,
    title: title,
    inputParam: windowInputParams,
    closeCallback: callBackFunc,
    width: width,
    height: height
  })
  businessRuleResult['windowInstanceCode'] = windowInstanceCode
}

/**
 * 打开窗体组件容器
 */
let openWindowContainer = function (
  ruleContext,
  businessRuleResult,
  containerControlCode,
  componentCode,
  windowCode,
  windowInputParams,
  title,
  tmpIsAsyn
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
      '[OpenComponentReturnData.openWindowContainer]目标组件容器控件，请检查是否移除了此控件。编号:' +
        containerControlCode
    )
  }

  // 2015-11-25 卡住规则链不往下执行
  if (tmpIsAsyn == false) ruleContext.markRouteExecuteUnAuto()

  // 标注打开方式为container
  windowInputParams['variable']['formulaOpenMode'] = 'container'
  // 将标签页的ID传入，以提供给退出事件进行关闭
  windowInputParams['variable']['closeTabId'] = windowCode
  let windowInstanceCode = null
  let callBackFunc = function (windowInstanceCode) {
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
        //dengb：不需要传
        //"url" : viewModel.getCmpModule().getModuleUrl(windowCode, windowInputParams),
        selected: true,
        callback: callBackFunc
      },
      0
    )
  }
}

/**
 * 获取打开窗体标题
 */
let getOpenWindowTitle = function (inParams, ruleContext) {
  // 窗体标题
  let titleExp = inParams['browerWindowTitle']
  if (!titleExp) {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let retValue = formulaUtil.execute({
    expression: titleExp,
    context: context
  })
  return retValue
}

/**
 * 获取打开窗体高度
 */
let getOpenWindowHeight = function (inParams, ruleContext) {
  let heightExp = inParams['heightExp']
  if (!heightExp) {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let retValue = formulaUtil.execute({
    expression: heightExp,
    context: context
  })
  return retValue
}

/**
 * 获取打开窗体宽度
 */
let getOpenWindowWidth = function (inParams, ruleContext) {
  let widthExp = inParams['widthExp']
  if (!widthExp) {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let retValue = formulaUtil.execute({
    expression: widthExp,
    context: context
  })
  return retValue
}

/**
 * 获取打开窗体的编号
 */
let getOpenWindowCode = function (inParams, ruleContext) {
  let openType = inParams['openType']
  let windowCode = null
  switch (openType) {
    case 'fromParam':
      var sourceValue = inParams['windowNumSource']
      // 默认按表达式取
      var context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      openParam = formulaUtil.execute({
        expression: sourceValue,
        context: context
      })
      try {
        openParam = jsonUtil.json2obj(openParam)
        windowCode = openParam.windowCode
      } catch (e) {
        throw new Error(
          '打开组件发生错误，当前为根据参数打开窗体，但参数格式不正确，当前参数：[' +
            openParam +
            '],' +
            e
        )
      }
      if (!windowCode) {
        throw new Error(
          '打开组件发生错误，当前为根据参数打开窗体，但窗体编号并没有指定'
        )
      }
      break
    case 'appoint':
      // 指定窗体
      windowCode = inParams['windowCode']
      if (!windowCode) {
        throw new Error(
          '[OpenComponentReturnData.getOpenWindowCode]打开组件发生错误，当前为打开指定窗体，但窗体编号并没有指定'
        )
      }
      break
    case 'dynamic':
      // 动态窗体
      var windowCode = null
      var dynamicType = inParams['windowNumSourceType']
      var dynamicValue = inParams['windowNumSource']
      switch (dynamicType) {
        case 'entityField':
          // 动态来源为表字段
          if (!dynamicValue || dynamicValue.indexOf('.') == -1) {
            throw new Error(
              '[OpenComponentReturnData.getOpenWindowCode]打开组件发生错误，当前为打开动态窗体，但来源字段格式不正确:' +
                dynamicValue +
                '。应为表名.字段名格式'
            )
          }
          var dataSourceName = componentSrcValue.split('.')[0]
          // windowCode = viewModel.getDataModule().getSingleValueByDS(dataSourceName, dynamicValue);
          var datasource = datasourceManager.lookup({
            datasourceName: dataSourceName
          })
          var record = datasource.getCurrentRecord()
          windowCode = record.get(dynamicValue)
          break
        case 'systemVariant':
          // 动态来源为系统变量

          windowCode = componentParam.getVariant({
            code: dynamicValue
          })
          break
        case 'windowVariant':
          // 动态来源为组件变量

          windowCode = windowParam.getInput({
            code: dynamicValue
          })
          break
        default:
          // 默认按表达式取
          var context = new ExpressionContext()
          context.setRouteContext(ruleContext.getRouteContext())
          windowCode = formulaUtil.execute({
            expression: dynamicValue,
            context: context
          })
          break
      }
      if (!windowCode) {
        throw new Error(
          '[OpenComponentReturnData.getOpenWindowCode]打开组件发生错误，当前为打开动态窗体，但窗体编号并没有指定'
        )
      }
      break
    default:
      throw new Error(
        '[OpenComponentReturnData.getOpenWindowCode]打开组件发生错误，无法识别打开目标窗体类型:' +
          openType
      )
      break
  }

  return windowCode
}

/**
 * 产生目标窗体的窗体变量信息
 */
let getOpenWindowInputParams = function (
  routeContext,
  mappingItems,
  ruleContext
) {
  let variable = {}
  if (mappingItems) {
    for (let i = 0; i < mappingItems.length; i++) {
      let mappingItem = mappingItems[i]
      let target = mappingItem['paramName']
      let source = mappingItem['paramValue']
      let type = mappingItem['paramType']
      switch (type + '') {
        case 'expression':
          var context = new ExpressionContext()
          context.setRouteContext(ruleContext.getRouteContext())
          var expressionValue = formulaUtil.execute({
            expression: source,
            context: context
          })
          variable[target] = expressionValue
          break
        case 'entity':
          /*
                    var dataSourceName=source;
                    var orignalDb=dbManager.getDB(dataSourceName); 
                    if(dbManager.isDataSource(orignalDb)){
                        var json = orignalDb.serialize();
                        variable[target] = json
                    }
                    */
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
                '[OpenComponentReturnData.getOpenWindowInputParams]来源变量不存在:' +
                  sourceName
              )
            }
          }

          // 创建游离DB
          //var DBFactory = sandBox.getService("vjs.framework.extension.system.datasource.factory");

          var freeDBName = 'freeDB_' + UUID.generate()
          var scope = scopeManager.getWindowScope()
          var series = scope.getSeries()
          var fieldsMapping = getFreeDBFieldsMapping(fieldMappings)
          //var freeDB = DBFactory.getDBServiceWithType(series).createDBWithDS(freeDBName, fieldsMapping);
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
          //freeDB = dbUtil.copyEntityFromMapping(sourceDB, freeDB, copyFieldsMapping, "all");
          freeDB = dbUtil.copyBetweenEntities({
            sourceEntity: sourceDB,
            destEntity: freeDB,
            valuesMapping: copyFieldsMapping,
            dataFilterType: 'all',
            routeContext: routeContext
          })
          variable[target] = freeDB
          break
      }
    }
  }
  let retValue = {
    variable: variable
  }
  return retValue
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

let getFreeDBCopyFieldsMapping = function (fieldMappings) {
  let copyFieldsMapping = []
  for (let i = 0; i < fieldMappings.length; i++) {
    let configField = fieldMappings[i]
    let paramEntityField = configField.destFieldName
    let fieldValueType =
      configField.srcValueType == 'expression' ? 'expression' : 'field'
    let _srcValueItems = configField.srcValue.split('.')
    let fieldValue = _srcValueItems[_srcValueItems.length - 1]
    //2017-01-16 liangzc：映射字段来源表达式则不需要处理。
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

export { getOpenWindowInputParams, main }
