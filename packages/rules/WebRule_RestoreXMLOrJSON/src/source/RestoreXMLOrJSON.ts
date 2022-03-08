import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ArrayUtil as util } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sBox) {}
const main = function (ruleContext) {
  let ruleInstId = ruleContext.getRuleCfg()['ruleInstId']
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])

  let restoreDataSrc = inParams['RestoreDataSrc']
  let restoreDataType = inParams['RestoreDataType']
  let restoreDataDetail = inParams['RestoreDataDetail']

  if (restoreDataType != 'JSON' && restoreDataType != 'XML') {
    throw new Error(
      '[RestoreXMLOrJSON.main]规则json配置有误,还原数据来源未设置，无法进行配置数据还原'
    )
  }

  if (typeof restoreDataSrc != 'string' || restoreDataSrc == '') {
    throw new Error(
      '[RestoreXMLOrJSON.main]规则json配置有误,数据来源表达式值不为JSON和XML，无法进行配置数据还原'
    )
  }

  if (!util.isArray(restoreDataDetail) || restoreDataDetail.length <= 0) {
    throw new Error(
      '[RestoreXMLOrJSON.main]规则json配置有误,还原数据内容未指定，无法进行配置数据还原'
    )
  }

  //配置数据内容值
  //		var restoreDataValue = formulaUtil.evalExpression(restoreDataSrc);
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let restoreDataValue = engine.execute({
    expression: restoreDataSrc,
    context: context
  })
  if (typeof restoreDataValue != 'string' || restoreDataValue == '') {
    throw new Error(
      '[RestoreXMLOrJSON.main]' +
        '执行规则配置的数据来源表达式:' +
        restoreDataValue +
        ',返回值不允许为空且必须为字符串'
    )
  }

  //元素名到字段名的映射Map
  let elementNameToFieldNameMap = {}
  let elementNames = []

  for (let index = 0; index < restoreDataDetail.length; index++) {
    let restoreDataElement = restoreDataDetail[index]
    let elementNameSrc = restoreDataElement['ElementNameSrc']
    let elementValueDestField = restoreDataElement['ElementValueDestField']

    if (typeof elementNameSrc != 'string' || elementNameSrc == '') {
      throw new Error(
        '[RestoreXMLOrJSON.main]规则json配置有误,还原数据内容中，元素名来源表达式串不允许为空且必须为字符串。'
      )
    }
    if (
      typeof elementValueDestField != 'string' ||
      elementValueDestField == '' ||
      elementValueDestField.indexOf('.') == -1
    ) {
      throw new Error(
        '[RestoreXMLOrJSON.main]' +
          '规则json配置有误,还原数据内容中，元素值对应的实体字段未设置，或字段名格式有误。'
      )
    }

    //			var elementNameValue = formulaUtil.evalExpression(elementNameSrc);
    let contextSecond = new ExpressionContext()
    contextSecond.setRouteContext(ruleContext.getRouteContext())
    let elementNameValue = engine.execute({
      expression: elementNameSrc,
      context: contextSecond
    })
    if (typeof elementNameValue != 'string' || elementNameValue == '') {
      throw new Error(
        '[RestoreXMLOrJSON.main]' +
          '执行规则配置的元素名来源表达式:' +
          elementNameValue +
          ',返回值不允许为空且必须为字符串'
      )
    }

    elementNameToFieldNameMap[elementNameValue] = elementValueDestField
    elementNames.push(elementNameValue)
  }

  let reqData = _generateRequestData(
    restoreDataType,
    restoreDataValue,
    elementNames
  )

  // 构建后台规则参数
  let inParamsObj = {}
  let scope = scopeManager.getWindowScope()
  inParamsObj.moduleId = scope.getWindowCode()
  //		inParamsObj.moduleId = viewContext.getModuleId();
  inParamsObj.datas = reqData

  /*
    // 后台规则获取数据
    var result = operationLib.executeRule(viewContext.getModuleId(), ruleInstId, inParamsObj);
    if (result.success != true) {
        log.error("[RestoreXMLOrJSON.main]配置数据还原规则执行失败: " + result.errorMsg);
        throw new Error("[RestoreXMLOrJSON.main]配置数据还原规则执行失败: " + result.errorMsg);
    }
    
    var responseData = result.data;
    if (!responseData) {
        log.error("[RestoreXMLOrJSON.main]配置数据还原规则执行失败，返回待还原数据值为空");
        throw new Error("[RestoreXMLOrJSON.main]配置数据还原规则执行失败，返回待还原数据值为空");
    }
    
    var jsonData = responseData;
    var elementNameToValueMap = {};
    
    for (var index = 0; index < elementNames.length; index++) {
        var elementName = elementNames[index];
        var elementValue = jsonData[elementName];
        var elementValueArr = [];
        if (jsTool.isArray(elementValue)) {				
            for (var subIndex = 0; subIndex < elementValue.length; subIndex++) {
                var elementCellValue = elementValue[subIndex];
                elementValueArr.push(elementCellValue);
            }
        } else {
            elementValueArr.push(elementValue);
        }
        elementNameToValueMap[elementName] = elementValueArr;
    }
    
    var tableToFieldArr = {};
    for (var elementName in elementNameToFieldNameMap) {
        var fieldName = elementNameToFieldNameMap[elementName];
        if (!elementNameToValueMap[elementName]) {
            continue;
        }
        var table = fieldName.substring(0, fieldName.indexOf("."));
        var field = fieldName.substring(fieldName.indexOf(".") + 1);
        if (!jsTool.isArray(tableToFieldArr[table])) {
            tableToFieldArr[table] = [];
        }
        tableToFieldArr[table].push(
            {
                "field" : field, 
                "element" : elementName
            }
        );
    }
    
    for (var table in tableToFieldArr) {
        var fieldObjArr = tableToFieldArr[table];
        fieldObjArr.sort(function(a, b) {				
            var aField = a.field;
            var aElement = a.element;
            
            var bField = b.field;
            var bElement = b.element;
            
            var aElementValueArr = elementNameToValueMap[aElement];
            var bElementValueArr = elementNameToValueMap[bElement];
            if (
                jsTool.isArray(aElementValueArr) 
                && jsTool.isArray(bElementValueArr)) {
                if (aElementValueArr.length > bElementValueArr.length) {
                    return 1;
                } else if (aElementValueArr.length < bElementValueArr.length) {
                        return -1;
                } else {
                        return 0;
                }
            } else if (!jsTool.isArray(aElementValueArr)) {
                return -1;
            } else if (!jsTool.isArray(bElementValueArr)) {
                return 1;
            }					
        });
        var largestSizeFieldObj = fieldObjArr[fieldObjArr.length - 1];
        var largestSizeElement = largestSizeFieldObj.element;
        var largestSizeElementValueArr = elementNameToValueMap[largestSizeElement];
        var largestSize = largestSizeElementValueArr.length;
                    
        var emptyRecords = [];
        var emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(table,true,true);
        for (var index = 0; index < largestSize; index++) {
            var record = emptyRecord.createNew();
            emptyRecords.push(record);
        }
                                
        for (var index = 0; index < fieldObjArr.length; index++) {
            var fieldObj = fieldObjArr[index];
            var field = fieldObj.field;
            var element = fieldObj.element;
            var elementValueArr = elementNameToValueMap[element];
                            
            for (var subIndex = 0; subIndex < largestSize; subIndex++) {
                if (subIndex >= elementValueArr.length) {
                    break;
                }
                
                var elementValue = elementValueArr[subIndex];
                emptyRecords[subIndex].set(field, elementValue);
            }
        }
        
        var elementValue = elementValueArr[subIndex];
        viewModel.getDataModule().insertByDS(
            table, 
            emptyRecords, 
            true, 
            true);
    }
    */
  let inputParams = {
    // ruleSetCode为活动集编号
    ruleSetCode: 'CommonRule_RestoreXMLOrJSON',
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
    let outputResult = responseObj.OutputMessage
    let jsonData = jsonUtil.json2obj(outputResult)
    let elementNameToValueMap = {}

    for (let index = 0; index < elementNames.length; index++) {
      let elementName = elementNames[index]
      let elementValue = jsonData[elementName]
      let elementValueArr = []
      if (util.isArray(elementValue)) {
        for (let subIndex = 0; subIndex < elementValue.length; subIndex++) {
          let elementCellValue = elementValue[subIndex]
          elementValueArr.push(elementCellValue)
        }
      } else {
        elementValueArr.push(elementValue)
      }
      elementNameToValueMap[elementName] = elementValueArr
    }

    let tableToFieldArr = {}
    for (let elementName in elementNameToFieldNameMap) {
      let fieldName = elementNameToFieldNameMap[elementName]
      if (!elementNameToValueMap[elementName]) {
        continue
      }
      let table = fieldName.substring(0, fieldName.indexOf('.'))
      let field = fieldName.substring(fieldName.indexOf('.') + 1)
      if (!util.isArray(tableToFieldArr[table])) {
        tableToFieldArr[table] = []
      }
      tableToFieldArr[table].push({
        field: field,
        element: elementName
      })
    }

    for (let table in tableToFieldArr) {
      let fieldObjArr = tableToFieldArr[table]
      fieldObjArr.sort(function (a, b) {
        let aField = a.field
        let aElement = a.element

        let bField = b.field
        let bElement = b.element

        let aElementValueArr = elementNameToValueMap[aElement]
        let bElementValueArr = elementNameToValueMap[bElement]
        if (util.isArray(aElementValueArr) && util.isArray(bElementValueArr)) {
          if (aElementValueArr.length > bElementValueArr.length) {
            return 1
          } else if (aElementValueArr.length < bElementValueArr.length) {
            return -1
          } else {
            return 0
          }
        } else if (!util.isArray(aElementValueArr)) {
          return -1
        } else if (!util.isArray(bElementValueArr)) {
          return 1
        }
      })
      let largestSizeFieldObj = fieldObjArr[fieldObjArr.length - 1]
      let largestSizeElement = largestSizeFieldObj.element
      let largestSizeElementValueArr = elementNameToValueMap[largestSizeElement]
      let largestSize = largestSizeElementValueArr.length

      let emptyRecords = []
      let datasource = manager.lookup({ datasourceName: table })
      let emptyRecord = datasource.createRecord()
      //				var emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(table,true,true);

      for (let index = 0; index < largestSize; index++) {
        //var record = emptyRecord.createNew();

        let tempRecord = emptyRecord.clone()
        if (tempRecord.getMetadata().isContainField('id')) {
          tempRecord.set('id', uuid.generate())
        }
        let record = tempRecord

        emptyRecords.push(record)
      }

      for (let index = 0; index < fieldObjArr.length; index++) {
        let fieldObj = fieldObjArr[index]
        let field = fieldObj.field
        let element = fieldObj.element
        let elementValueArr = elementNameToValueMap[element]

        for (let subIndex = 0; subIndex < largestSize; subIndex++) {
          if (subIndex >= elementValueArr.length) {
            break
          }

          let elementValue = elementValueArr[subIndex]
          emptyRecords[subIndex].set(field, elementValue)
        }
      }

      let elementValue = elementValueArr[subIndex]
      //				viewModel.getDataModule().insertByDS(
      //					table,
      //					emptyRecords,
      //					true,
      //					true);
      let datasource = manager.lookup({ datasourceName: table })
      datasource.insertRecords({ records: emptyRecords })
    }
    //释放规则链
    callBackFunc()
  }
  let sConfig = {
    isAsyn: true,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    transactionId: ruleContext.getRouteContext().getTransactionId(),
    ruleSetCode: 'CommonRule_RestoreXMLOrJSON',
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
  //		operationLib.executeRuleSet(inputParams, callback);
  remoteMethodAccessor.invoke(sConfig)
  //卡住规则链
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 生成请求后台规则数据体
 * @param {Object} restoreDataType
 * @param {Object} restoreDataValue
 * @param {Object} elementNames
 */
let _generateRequestData = function (
  restoreDataType,
  restoreDataValue,
  elementNames
) {
  let reqData = {}
  reqData.restoreDataType = restoreDataType
  reqData.restoreDataValue = restoreDataValue
  reqData.elementNames = elementNames
  return reqData
}

export { main }
