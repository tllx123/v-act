import { ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourcePusher as datasourcePusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RuleEngine as ruleEngine } from '@v-act/vjs.framework.extension.platform.engine.rule'

export function render(params) {
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
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var title = params.title
  var inParams = params.inParams
  var windowInputParams = params.inputs
  var ruleContext = params.ruleContext
  var businessRuleResult = params.businessRuleResult

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
      inParams.widthExp == '' ? '' : getParam(inParams, ruleContext, 'widthExp')
    _dialogParams.widthUnit = inParams.widthUnit
    _dialogParams.isPushMainWindow = inParams.isPushMainWindow
    windowInputParams['dialogParams'] = _dialogParams
    _dialogParams = null
  }
  var height = getOpenWindowHeight(inParams, ruleContext)
  var width = getOpenWindowWidth(inParams, ruleContext)
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
}

/**
 * 获取打开窗体高度
 */
var getOpenWindowHeight = function (inParams, ruleContext) {
  var heightExp = inParams['heightExp']
  if (!heightExp) {
    return null
  }
  var context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  var retValue = formulaUtil.execute({
    expression: heightExp,
    context: context
  })
  return retValue
}

/**
 * 获取打开窗体宽度
 */
var getOpenWindowWidth = function (inParams, ruleContext) {
  var widthExp = inParams['widthExp']
  if (!widthExp) {
    return null
  }
  var context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  var retValue = formulaUtil.execute({
    expression: widthExp,
    context: context
  })
  return retValue
}

/**
 * 处理打开窗体返回信息
 */
var handleOpenWindowReturnValues = function (
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
  var getSourceValue = function (source, sourceType) {
    var sourceValue = null
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

  for (var i = 0; i < returnMappings.length; i++) {
    var mappings = returnMappings[i]
    var destName = mappings['dest']
    var destType = mappings['destType']

    var sourceName = mappings['src']
    var sourceType = mappings['srcType']
    var sourceValue = getSourceValue(sourceName, sourceType)

    var operType = mappings['updateDestEntityMethod']
    var isCleanTarget = mappings['isCleanDestEntityData']

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
var openDialogWindow = function (
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
  var returnMappingsConfig = returnMappings
  // 标注打开方式为dialog模态窗口
  var routeCallback = function (output) {
    businessRuleResult['isConfirmSelectionOnClose'] = false
    if (output && output['config']) {
      //点击了确定选择
      if (output['config']['isSelectionConfirm'] == true) {
        businessRuleResult['isConfirmSelectionOnClose'] = true
      }
      //有返回输出值
      if (output['config']['isReturnValues'] == true) {
        var windowReturnValue = output['values']
        var returnMappings = returnMappingsConfig
        try {
          handleOpenWindowReturnValues(
            ruleContext,
            windowReturnValue,
            returnMappings
          )
        } catch (e) {
          throw ruleEngine.createRuleException({
            ruleContext: ruleContext,
            exception: e
          })
        }
      }
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
  var callBackFunc = function (output) {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback(output)
  }

  var errorCallback = scopeManager.createScopeHandler({
    handler: function (e) {
      throw ruleEngine.createRuleException({
        ruleContext: ruleContext,
        exception: e
      })
    }
  })
  ruleContext.markRouteExecuteUnAuto()

  //var windowInstanceCode = viewModel.getCmpModule().callModalModule(componentCode, windowCode, title, null, null, windowInputParams, callBackFunc);
  var windowInstanceCode = browser.showModalModule({
    componentCode: componentCode,
    windowCode: windowCode,
    title: title,
    inputParam: windowInputParams,
    closeCallback: callBackFunc,
    width: width,
    extraParams: {
      errorCallback: errorCallback
    },
    height: height
  })
  businessRuleResult['windowInstanceCode'] = windowInstanceCode
}

/**
 * 获取模拟框参数
 */
var getParam = function (inParams, ruleContext, valName) {
  var sourceValue = inParams[valName]
  // 默认按表达式取
  var context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  var openParam = formulaUtil.execute({
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
    var _un
    return _un
    //throw new Error("打开组件发生错误，当前为根据参数打开窗体，但参数格式不正确，当前参数：["+openParam+"]," + e);
  }
  return openParam
}
