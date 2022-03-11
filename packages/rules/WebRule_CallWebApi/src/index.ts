/**
 * 调用WebAPI
 */

import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

interface obj {
  [key: string]: any
}

// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { promises } from 'fs-extra'
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      // 获取开发系统配置的参数
      var params = ruleContext.getVplatformInput()
      var webAPISite = params['webAPISite']
      webAPISite = expression.execute(webAPISite, {
        ruleContext: ruleContext
      })
      var timeOut = Number(params['timeOut']) * 1000
      var serviceProvider = params['serviceProvider']
      var tenantCode = params['tenantCode']
      var inputParams = params['inputParams']
      var returnMapping = params['returnMapping']
      //第三方返回值参数
      var invokeTargetType = params['invokeTargetType']
      var invokeTarget = params['invokeTarget']
      var respondTargetType = params['respondTargetType']
      var respondTarget = params['respondTarget']

      var returnInputParams: obj = getInputParams(inputParams, ruleContext)
      if (tenantCode != '') {
        //租户信息放到参数内
        tenantCode = expression.execute(tenantCode, {
          ruleContext: ruleContext
        })
        if (tenantCode != '') {
          returnInputParams['tenantCode'] = tenantCode
        }
      }
      //api请求
      requestApi(
        webAPISite,
        returnInputParams,
        timeOut,
        serviceProvider,
        returnMapping,
        invokeTargetType,
        invokeTarget,
        respondTargetType,
        respondTarget,
        ruleContext,
        resolve,
        reject
      )
    } catch (ex) {
      reject(ex)
    }
  })
}

var requestApi = function (
  webAPISite: string,
  returnInputParams: obj,
  timeOut: number,
  serviceProvider: string,
  returnMapping: obj,
  invokeTargetType: string,
  invokeTarget: string,
  respondTargetType: string,
  respondTarget: string,
  ruleContext: RuleContext,
  resolve: (value: void | PromiseLike<void>) => void,
  reject: (reason?: any) => void
) {
  if (webAPISite == '') {
    throw new Error('CallWebApi规则:[WebAPI地址]不能为空！')
  }
  var host, componentCode, apiCode
  if (serviceProvider == 'WebAPI') {
    //平台api
    //webAPISite 拆分参数
    var startHost = 0
    var endHost = webAPISite.indexOf('/webapi/')
    var startComp = endHost + 8
    var endComp = webAPISite.lastIndexOf('/')
    var startApiCode = endComp + 1
    var endApiCode = webAPISite.indexOf('?')
    if (endApiCode == -1) {
      endApiCode = webAPISite.length
    }
    host = webAPISite.substring(startHost, endHost)
    componentCode = webAPISite.substring(startComp, endComp)
    apiCode = webAPISite.substring(startApiCode, endApiCode)
    if (host != '' && componentCode != '' && apiCode != '') {
      invokeV3Webapi(
        webAPISite,
        returnInputParams,
        timeOut,
        returnMapping,
        ruleContext,
        resolve,
        reject
      )
    } else {
      throw new Error('地址格式错误，api地址：' + webAPISite)
    }
  } else {
    //第三方api
    invokeOtherApi(
      webAPISite,
      returnInputParams,
      timeOut,
      invokeTargetType,
      invokeTarget,
      respondTargetType,
      respondTarget,
      ruleContext,
      resolve,
      reject
    )
  }
}

var invokeOtherApi = function (
  webAPISite: string,
  returnInputParams: obj,
  timeOut: number,
  invokeTargetType: string | boolean,
  invokeTarget: string,
  respondTargetType: string,
  respondTarget: string,
  ruleContext: RuleContext,
  resolve: (value: void | PromiseLike<void>) => void,
  reject: (reason?: any) => void
) {
  var setReturn = function (
    invokeSourceValue: string | boolean,
    respondSourceValue: string
  ) {
    setVarValue(invokeTarget, invokeTargetType, invokeSourceValue, ruleContext)
    setVarValue(
      respondTarget,
      respondTargetType,
      respondSourceValue,
      ruleContext
    )
    resolve()
  }
  var invokeSourceValue, respondSourceValue
  $.ajax({
    url: webAPISite,
    data: returnInputParams,
    timeout: timeOut,
    type: 'Get',
    dataType: 'jsonp',
    success: function (param: string) {
      invokeSourceValue = true
      setReturn(invokeSourceValue, param)
    },
    error: function (re: any) {
      invokeSourceValue = false
      if (re.statusText == 'timeout') {
        var exception = new Error('第三方Api访问超时')
        reject(exception)
        respondSourceValue = 'CallWebApi规则:第三方Api访问超时'
      } else {
        respondSourceValue = 'CallWebApi规则:' + re.statusText
      }
      setReturn(invokeSourceValue, respondSourceValue)
    }
  })
}

var invokeV3Webapi = function (
  webAPISite: string,
  returnInputParams: obj,
  timeOut: number,
  returnMapping: obj,
  ruleContext: RuleContext,
  resolve: (value: void | PromiseLike<void>) => void,
  reject: (reason?: any) => void
) {
  var success = ruleContext.genAsynCallback((param) => {
    handleReturnValues(ruleContext, param, returnMapping)
    resolve()
  })

  var error = ruleContext.genAsynCallback((param) => {
    var exception = param
    if (!exception.isException(param)) {
      /* 非异常对象，才需要创建异常 */
      exception = exception.newSystemException(param.msg)
    }
    reject(exception)
  })

  var params = { param: returnInputParams, timeout: timeOut }
  var promise = rpc.callWebapi(webAPISite, params)
  promise.then(success).catch(error)
}

var getInputParams = function (inputParams: obj, ruleContext: RuleContext) {
  //入参处理
  var returnInputParams: obj = {}
  if (inputParams == null) return returnInputParams
  for (var i = 0; i < inputParams.length; i++) {
    var inP = inputParams[i]
    var inPName = inP['paramName']
    var inPType = inP['paramType']
    var inSType = inP['srcType']
    var inS = inP['src']
    if (inPType != 'entity') {
      if (inSType == 'expression') {
        //目前只有表达式一种类型
        var srcValue = expression.execute(inS, { ruleContext: ruleContext })
        returnInputParams[inPName] = srcValue
      }
    } else {
      //入参为实体
      var entityDatas: obj = []
      returnInputParams[inPName] = entityDatas
      var dsInfo = getDatasourceInfo(
        inS,
        inSType,
        ruleContext.getMethodContext()
      )
      var entity: obj = []
      if (dsInfo.ds) {
        entity = dsInfo.ds
      }

      var dataFilterType = inP['dataFilterType']
      var paramFieldMapping = inP['paramFieldMapping']
      var mapping: obj = getMapping(paramFieldMapping)
      var resultSet: obj
      if (dataFilterType == 'all') {
        resultSet = entity.getAllRecords()
      } else {
        resultSet = entity.getUpdatedRecords()
      }
      var records = resultSet.toArray()
      for (var j = 0; j < records.length; j++) {
        var datas: obj = {}
        var record = records[j]
        var data = record.toMap()
        for (var key in mapping) {
          var map = mapping[key]
          var fieldType = map['fieldType']
          var value = map[key]
          if (fieldType == 'expression') {
            var exp = expression.execute(value, {
              ruleContext: ruleContext
            })
            datas[key] = exp
          } else {
            datas[key] = data[value]
          }
        }
        entityDatas.push(datas)
      }
      returnInputParams[inPName] = JSON.stringify(entityDatas)
    }
  }
  return returnInputParams
}

var getMapping = function (paramFieldMapping: obj) {
  var mapping: obj = {}
  for (var j = 0; j < paramFieldMapping.length; j++) {
    var field = paramFieldMapping[j]
    var fieldName = field['paramEntityField']
    var fieldType = field['fieldValueType']
    var fieldValue = field['fieldValue']
    var field: any = {}
    field['fieldType'] = fieldType
    if (fieldType != 'expression') {
      field[fieldName] = getFieldColumn(fieldValue)
    } else {
      field[fieldName] = fieldValue
    }
    mapping[fieldName] = field
  }
  return mapping
}

var getFieldColumn = function (field: string) {
  if (field.indexOf('.') > 0) {
    return field.split('.')[1]
  } else {
    return field
  }
}

var handleReturnValues = function (
  ruleContext: RuleContext,
  ReturnValue: obj,
  returnMappings: obj
) {
  //返回值处理
  if (!returnMappings || returnMappings.length <= 0) {
    return
  }
  if (ReturnValue == null) {
    return
  }

  /**
   * 内部方法，获取赋值来源值
   */
  var getSourceValue = function (source: string, sourceType: string) {
    var sourceValue = null
    switch (sourceType) {
      case 'returnValue':
        sourceValue = ReturnValue[source]
        break
      case 'expression':
        sourceValue = expression.execute(source, {
          ruleContext: ruleContext
        })
        break
      default:
        break
    }
    return sourceValue
  }

  var insertOrUpdateRecords2Entity = function (
    dsInfo: obj,
    records: obj,
    mappings: obj,
    operType: string,
    isClearDatas: boolean,
    ruleContext: RuleContext
  ) {
    if (undefined == ruleContext || null == ruleContext)
      throw new Error('规则上下文获取失败，请传入正确的ruleContext')

    if (operType == 'updateRecord' && isClearDatas == true)
      throw new Error('更新类型为：更新记录时，不能勾选清空数据，请检查配置')

    if (operType == 'loadRecord' && isClearDatas == false)
      throw new Error('更新类型为：加载数据时，一定要勾选清空数据，请检查配置')

    var destEntity = dsInfo.ds

    // 清空目标实体中的数据
    if (isClearDatas) {
      destEntity.clear()
    }
    // 如果来源记录为空，则不做任何动作
    if (
      !records ||
      (Array.isArray(records) && records.length < 1) ||
      !mappings ||
      (Array.isArray(mappings) && mappings.length < 1)
    ) {
      return
    }

    var updateRecords = []
    var insertRecords = []

    for (var i = 0; i < records.length; i++) {
      var record = records[i]
      var oldRecord = null
      var newRecord = null

      var hasId = false
      var tmpObj: obj = {}
      for (var index = 0; index < mappings.length; index++) {
        // 来源值类型,returnValue:返回值，expression:表达式
        var srcValueType = mappings[index]['srcValueType']
        var srcValue = mappings[index]['srcValue']
        // 前台目标实体字段
        var destField = mappings[index]['destField']
        // srcField = jsTool.getFieldName(srcField);
        var value = _getValueByMapping(
          record,
          srcValueType,
          srcValue,
          ruleContext
        )
        if (destField.indexOf('.') != -1) {
          var destFieldArray = destField.split('.')
          destField = destFieldArray[destFieldArray.length - 1]
        }

        tmpObj[destField] = value
        if (destField.toLocaleLowerCase() == 'id') {
          hasId = true
          if (value != null && value != '') {
            oldRecord = destEntity.getRecordById(value)
          }
        }
      }

      // 为更新当前记录时只取第一个返回值
      if (operType == 'updateRecord') {
        // 操作类型为更新时，如果目标实体没有当前行，则取其第一行
        var oldRecords: Array<any> = []
        oldRecords = destEntity.getSelectedRecords().toArray()
        if (oldRecords.length < 1)
          if (destEntity.getAllRecords().toArray().length > 0)
            oldRecords.push(destEntity.getRecordByIndex(0))
        // 如果操作类型为更新，并且获取不到目标实体的当前选中记录或第一条记录，则跳出
        if (oldRecords.length < 1) break
        // 把新记录的值赋值到旧记录中，id不会赋值过去
        for (var j = 0; j < oldRecords.length; j++) {
          if (undefined == oldRecords[j] || null == oldRecords[j]) continue
          for (var proName in tmpObj) {
            if (proName.toLocaleLowerCase() != 'id')
              oldRecords[j].set(proName, tmpObj[proName])
          }
          updateRecords.push(oldRecords[j])
        }
      } else {
        var isOldRecordDeleted = false
        if (undefined != oldRecord && null != oldRecord) {
          isOldRecordDeleted = destEntity.isDeletedRecord({
            record: oldRecord
          })
        }
        if (oldRecord != null && isOldRecordDeleted) {
          // 如果id匹配的记录为删除状态，则报错。
          throw new Error('返回实体不能更新已经删除的记录!')
        }
        // 如果获取不到目标实体的记录，则新增
        if (oldRecord == null) newRecord = destEntity.createRecord()
        for (var proName in tmpObj) {
          if (oldRecord == null) newRecord.set(proName, tmpObj[proName])
          else if (proName.toLocaleLowerCase() != 'id')
            oldRecord.set(proName, tmpObj[proName])
        }
        if (oldRecord == null) insertRecords.push(newRecord)
        else updateRecords.push(oldRecord)
      }

      // 如果操作类型为更新，则只更新一条记录，所以在处理完第一条记录后跳出循环
      if (operType == 'updateRecord') break
    }

    if (updateRecords != null && updateRecords.length > 0) {
      destEntity.updateRecords(updateRecords)
    }

    if (insertRecords != null && insertRecords.length > 0) {
      if (operType == 'loadRecord') {
        var datas = []
        for (var i = 0; i < insertRecords.length; i++) {
          datas.push(insertRecords[i].toMap())
        }
        destEntity.loadRecords(datas, { isAppend: false })
      } else {
        destEntity.insertRecords(insertRecords)
      }
    }
  }

  var _getValueByMapping = function (
    record: obj,
    srcColumnType: string,
    srcColumn: string,
    ruleContext: RuleContext
  ) {
    // 来源字段类型,returnValue:返回值，expression:表达式
    var value = null
    // srcColumnType为空时应该是旧数据，兼容处理下
    if (srcColumnType == 'expression') {
      value = expression.execute(srcColumn, { ruleContext: ruleContext })
    } else {
      value = record[srcColumn]
    }
    if (value == undefined) {
      value = null
    }
    return value
  }

  for (var i = 0; i < returnMappings.length; i++) {
    var mappings = returnMappings[i]
    var destName = mappings['dest']
    var destType = mappings['destType']

    var sourceName = mappings['return']
    var sourceType = mappings['returnType']
    var sourceValue = getSourceValue(sourceName, sourceType)

    var operType = mappings['updateDestEntityMethod']
    var isCleanTarget = mappings['isCleanDestEntityData']

    var dsInfo = getDatasourceInfo(
      destName,
      destType,
      ruleContext.getMethodContext()
    )
    if (dsInfo.isEntity) {
      // 如果实体不存在 则不执行更新数据
      insertOrUpdateRecords2Entity(
        dsInfo,
        sourceValue,
        mappings['destFieldMapping'],
        operType,
        isCleanTarget,
        ruleContext
      )
    } else {
      setVarValue(destName, destType, sourceValue, ruleContext)
    }
  }
}

var setVarValue = function (
  destName: string,
  destType: string | boolean,
  sourceValue: string | boolean,
  ruleContext: RuleContext
) {
  switch (destType) {
    case 'control':
      var dsName = widget.getDatasourceCodes(destName)[0]
      var fieldName = widget.getFieldCodes(dsName, destName)[0]
      var dataSource = ds.lookup(dsName)
      var record = dataSource.getCurrentRecord()
      if (!record) {
        record = dataSource.createRecord()
        dataSource.insertRecords([record])
      }
      record.set(fieldName, sourceValue)
      dataSource.updateRecords([record])
      break
    case 'windowVariant':
      window.setInput(destName, sourceValue)
      break
    case 'systemVariant':
      component.setVariant(destName, sourceValue)
      break
    case 'ruleSetVariant':
      ruleContext.getMethodContext().setVariable(destName, sourceValue)
      break
    case 'ruleSetOutput':
      ruleContext.getMethodContext().setOutput(destName, sourceValue)
      break
    case 'windowOutput':
      window.setOutput(destName, sourceValue)
      break
    default:
      break
  }
}

var getDatasourceInfo = function (
  entityName: string,
  entityType: string,
  methodContext: obj
) {
  var info = {
    isEntity: false,
    ds: null
  }
  // 界面实体：开发系统中，有的规则用entity有的规则用window，此处做兼容
  if (entityType == 'entity' || entityType == 'window') {
    info.isEntity = true
    info.ds = ds.lookup(entityName)
  }
  // 窗体输入变量：开发系统中，有的规则用windowVariant有的规则用windowInput，此处做兼容
  else if (entityType == 'windowVariant' || entityType == 'windowInput') {
    var input = window.getInputType(entityName)
    if (input == 'entity') {
      info.isEntity = true
      info.ds = window.getInput(entityName)
    }
  }
  // 窗体输出变量
  else if (entityType == 'windowOutput') {
    var output = window.getOutputType(entityName)
    if (output == 'entity') {
      info.isEntity = true
      info.ds = window.getOutput(entityName)
    }
  }
  // 方法输入变量
  else if (entityType == 'ruleSetInput') {
    var varType = methodContext.getInputType(entityName)
    if (varType == 'entity') {
      info.isEntity = true
      info.ds = methodContext.getInput(entityName)
    }
  }
  // 方法输出变量
  else if (entityType == 'ruleSetOutput') {
    var varType = methodContext.getOutputType(entityName)
    if (varType == 'entity') {
      info.isEntity = true
      info.ds = methodContext.getOutput(entityName)
    }
  }
  // 方法变量：开发系统中，有的规则用ruleSetVariant有的规则用ruleSetVar，此处做兼容
  else if (entityType == 'ruleSetVariant' || entityType == 'ruleSetVar') {
    var varType = methodContext.getVariableType(entityName)
    if (varType == 'entity') {
      info.isEntity = true
      info.ds = methodContext.getVariable(entityName)
    }
  }
  return info
}

export { main }

new Promise((resolve, reject) => {})
