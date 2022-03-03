import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ArrayUtil as jsTool } from '@v-act/vjs.framework.extension.util'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
let undefined
//var viewModel ;
let undefined
let undefined
let undefined
let sandbox
let undefined
let undefined
let undefined
let undefined
exports.initModule = function (sBox) {
  sandbox = sBox
}
let main = function (ruleContext) {
  let ruleInstId = ruleContext.getRuleCfg()['ruleInstId']
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])

  let dataType = inParams['ResultDataType']
  let dataDetail = inParams['ResultDataDetail']
  let rootName = inParams['RootName']

  if (!dataType || '' == dataType) {
    log.error(
      '[GenerateXMLOrJSON.main]生成数据格式未进行设置，请检查配置是否正确'
    )
    return false
  }

  if (!dataDetail || dataDetail.length <= 0 || !jsTool.isArray(dataDetail)) {
    log.error('[GenerateXMLOrJSON.main]数据内容未进行设置，请检查配置是否正确')
    return false
  }

  let datas = generateDatas(dataDetail, ruleContext)

  // 构建后台规则参数
  let inParamsObj = {}
  //	inParamsObj.moduleId = viewContext.getModuleId();
  let scopeManager = sandbox.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  let scope = scopeManager.getWindowScope()
  inParamsObj.moduleId = scope.getWindowCode()
  inParamsObj.dataType = dataType
  inParamsObj.datas = datas
  inParamsObj.rootName = rootName

  /*
    // 后台规则获取数据
    var result = operationLib.executeRule(viewContext.getModuleId(), ruleInstId, inParamsObj);
    if (result.success != true) {
        log.error(result.errorMsg);
        throw new Error("[GenerateXMLOrJSON.main]生成配置数据失败");
    }

    // 业务规则返回值
    var businessRuleResult = {};
    businessRuleResult.Data = result.data;

    // 设置业务返回值
    if (ruleContext.setBusinessRuleResult) {
        ruleContext.setBusinessRuleResult(businessRuleResult);
    }
    */

  let inputParams = {
    // ruleSetCode为活动集编号
    ruleSetCode: 'CommonRule_GenerateXMLOrJSON',
    // params为活动集输入参数
    params: {
      InParams: jsonUtil.obj2json(inParamsObj)
    }
  }
  let callBackFunc = function (output) {
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback(output)
  }
  // 调用完活动集之后的回调方法
  let callback = function (responseObj) {
    //var outputResult = responseObj.data.result;
    let outputMessage = responseObj.OutputMessage
    // 业务规则返回值
    let businessRuleResult = {}
    businessRuleResult.Data = outputMessage

    // 设置业务返回值
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult(businessRuleResult)
    }
    //释放规则链
    callBackFunc()
  }

  let sConfig = {
    isAsyn: true,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    transactionId: ruleContext.getRouteContext().getTransactionId(),
    ruleSetCode: 'CommonRule_GenerateXMLOrJSON',
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: inputParams.params.InParams
      }
    ],
    afterResponse: callback
  }

  //  调用后台活动集
  //operationLib.executeRuleSet(inputParams, callback);
  remoteMethodAccessor.invoke(sConfig)
  //卡住规则链
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 生成配置数据内容
 * @param dataDetail 配置数据内容类源配置
 */
let generateDatas = function (dataDetail, ruleContext) {
  let datas = []
  for (let i = 0; i < dataDetail.length; i++) {
    let dataConfig = dataDetail[i]
    let elementNameSrc = dataConfig['ElementNameSrc']
    let elementValueSrcType = dataConfig['ElementValueSrcType'] + ''
    let elementValue = dataConfig['ElementValue']
    let scope = dataConfig['Scope'] + ''
    let spliceType = dataConfig['SpliceType'] + ''

    let data = {}
    //data.elementName = formulaUtil.evalExpression(elementNameSrc);
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    data.elementName = formulaUtil.execute({
      expression: elementNameSrc,
      context: context
    })
    data.elementScope = scope
    data.elementValue = ''
    data.elementSpliceType = spliceType

    switch (elementValueSrcType) {
      case '0':
        // 表达式
        //data.elementValue = formulaUtil.evalExpression(elementValue);
        data.elementValue = formulaUtil.execute({
          expression: elementValue,
          context: context
        })
        break
      case '1':
        // 表字段
        data.elementValue = getElementValueFromTableColumn(elementValue, scope)
        break
      default:
        throw new Error(
          '[GenerateXMLOrJSON.generateDatas]元素值来源类型不存在:' +
            elementValueSrcType
        )
    }

    datas.push(data)
  }
  return datas
}

/**
 * 从表字段中获取
 * @param {string} tableColumn 表名.字段名
 * @param {string} scope 来源范围
 */
let getElementValueFromTableColumn = function (tableColumn, scope) {
  if (tableColumn.indexOf('.') == -1) {
    throw new Error(
      '[GenerateXMLOrJSON.getElementValueFromTableColumn]来源表字段' +
        tableColumn +
        '格式不正确，应为表名.字段'
    )
  }
  let SCOPE_CURRENT = '0'
  let SCOPE_SELECTED = '1'
  let SCOPR_ALL = '2'

  // 按照取值返回获取的元素值，可能是单值，也可能是列表
  let elementValue = null

  let tableName = tableColumn.split('.')[0]
  let columnName = tableColumn.split('.')[1]

  switch (scope) {
    case SCOPE_CURRENT:
      var datasource = datasourceManager.lookup({ datasourceName: tableName })
      var record = datasource.getCurrentRecord()
      elementValue = record.get(columnName)
      break
    case SCOPE_SELECTED:
      // 选中行
      elementValue = []
      //var selRecords = viewModel.getDataModule().getSelectedRowsByDS(tableName);
      var datasource = datasourceManager.lookup({ datasourceName: tableName })
      var selRecords = datasource.getSelectedRecords().toArray()
      if (selRecords.length > 0) {
        for (var rIndex = 0; rIndex < selRecords.length; rIndex++) {
          var selRecord = selRecords[rIndex]
          var subElementValue = selRecord.get(columnName)
          elementValue.push(subElementValue)
        }
      }
      break
    case SCOPR_ALL:
      // 所有行
      var elementValue = []
      //var records = viewModel.getDataModule().getAllRecordsByDS(tableName);
      var datasource = datasourceManager.lookup({ datasourceName: tableName })
      var records = datasource.getAllRecords().toArray()
      for (var rIndex = 0; rIndex < records.length; rIndex++) {
        var record = records[rIndex]
        var subElementValue = record.get(columnName)
        elementValue.push(subElementValue)
      }
      break
    default:
      throw new Error(
        '[GenerateXMLOrJSON.getElementValueFromTableColumn]元素值来源范围不正确:' +
          scope
      )
  }

  return elementValue
}

export { main }
