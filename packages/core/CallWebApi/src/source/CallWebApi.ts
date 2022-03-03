import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as ExpressEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { RemoteMethodAccessor as RemoteMethodAccessorUtil } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DatasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { Datasource as Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
// 初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let sandBox
exports.initModule = function (sBox) {
  // sBox:前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandBox = sBox
}

// 规则主入口(必须有)
let main = function (ruleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let params = JSON.parse(inParams)
  let webAPISite = params['webAPISite']
  let expressionContext = new ExpressionContext()
  expressionContext.setRouteContext(ruleContext.getRouteContext())
  webAPISite = ExpressEngine.execute({
    expression: webAPISite,
    context: expressionContext
  })
  let timeOut = Number(params['timeOut']) * 1000
  let serviceProvider = params['serviceProvider']
  let tenantCode = params['tenantCode']

  let inputParams = params['inputParams']
  let returnMapping = params['returnMapping']

  //第三方返回值参数
  let invokeTargetType = params['invokeTargetType'] // "ruleSetOutput",
  let invokeTarget = params['invokeTarget'] // "status",
  let respondTargetType = params['respondTargetType'] // "ruleSetOutput",
  let respondTarget = params['respondTarget'] //"result",

  let returnInputParams = getInputParams(inputParams, ruleContext)
  if (tenantCode != '') {
    //租户信息放到参数内
    tenantCode = ExpressEngine.execute({
      expression: tenantCode,
      context: expressionContext
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
    ruleContext
  )
}

let requestApi = function (
  webAPISite,
  returnInputParams,
  timeOut,
  serviceProvider,
  returnMapping,
  invokeTargetType,
  invokeTarget,
  respondTargetType,
  respondTarget,
  ruleContext
) {
  if (webAPISite == '') {
    throw new Error('CallWebApi规则:[WebAPI地址]不能为空！')
  }
  let host, componentCode, apiCode
  if (serviceProvider == 'WebAPI') {
    //平台api

    //webAPISite 拆分参数
    let startHost = 0
    let endHost = webAPISite.indexOf('/webapi/')
    let startComp = endHost + 8
    let endComp = webAPISite.lastIndexOf('/')
    let startApiCode = endComp + 1
    let endApiCode = webAPISite.indexOf('?')
    if (endApiCode == -1) {
      endApiCode = webAPISite.length
    }
    host = webAPISite.substring(startHost, endHost)
    componentCode = webAPISite.substring(startComp, endComp)
    apiCode = webAPISite.substring(startApiCode, endApiCode)
    if (host != '' && componentCode != '' && apiCode != '') {
      invokeV3Webapi(
        host,
        componentCode,
        apiCode,
        returnInputParams,
        timeOut,
        returnMapping,
        ruleContext
      )
    } else {
      throw new Error('CallWebApi规则:[webAPISite地址]地址错误！')
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
      ruleContext
    )
  }

  return null
}

let invokeOtherApi = function (
  webAPISite,
  returnInputParams,
  timeOut,
  invokeTargetType,
  invokeTarget,
  respondTargetType,
  respondTarget,
  ruleContext
) {
  let setReturn = function (invokeSourceValue, respondSourceValue) {
    setVarValue(invokeTarget, invokeTargetType, invokeSourceValue, ruleContext)
    setVarValue(
      respondTarget,
      respondTargetType,
      respondSourceValue,
      ruleContext
    )
    ruleContext.fireRuleCallback() //继续规则链的执行
    ruleContext.fireRouteCallback() //继续规则链的执行
  }
  let success = ScopeManager.createScopeHandler({
    //成功回调
    handler: function (param) {
      invokeSourceValue = true
      setReturn(invokeSourceValue, param)
    }
  })
  let invokeTarget,
    invokeTargetType,
    invokeSourceValue,
    respondTarget,
    respondTargetType,
    respondSourceValue
  $.ajax({
    url: webAPISite,
    data: returnInputParams,
    timeout: timeOut,
    type: 'Get',
    dataType: 'jsonp',
    success: function (param) {
      invokeSourceValue = true
      setReturn(invokeSourceValue, param)
    },
    error: function (re) {
      invokeSourceValue = false
      if (re.statusText == 'timeout') {
        respondSourceValue = 'CallWebApi规则:第三方Api访问超时'
      } else {
        respondSourceValue = 'CallWebApi规则:' + re.statusText
      }
      setReturn(invokeSourceValue, respondSourceValue)
    }
  })
  ruleContext.markRouteExecuteUnAuto() //暂停规则链
}

let invokeV3Webapi = function (
  host,
  componentCode,
  apiCode,
  returnInputParams,
  timeOut,
  returnMapping,
  ruleContext
) {
  let success = ScopeManager.createScopeHandler({
    //成功回调
    handler: function (param) {
      handleReturnValues(ruleContext, param, returnMapping)
      ruleContext.fireRuleCallback()
      ruleContext.fireRouteCallback()
    }
  })
  let error = ScopeManager.createScopeHandler({
    //失败回调
    handler: function (param) {
      ruleContext.fireRuleCallback()
      ruleContext.fireRouteCallback()
    }
  })
  RemoteMethodAccessorUtil.invokeV3Webapi({
    host: host, //请求host(可不传，默认使用本地服务)
    componentCode: componentCode, //构件编号
    apiCode: apiCode, //webapi编号
    param: returnInputParams, //请求参数
    timeout: timeOut, //超时时间（如果未设置，则默认3000）单位毫秒
    afterResponse: success,
    error: error
  })
  ruleContext.markRouteExecuteUnAuto()
}

let getInputParams = function (inputParams, ruleContext) {
  //入参处理
  let returnInputParams = {}
  if (inputParams == null) return returnInputParams
  for (let i = 0; i < inputParams.length; i++) {
    let inP = inputParams[i]
    let inPName = inP['paramName']
    let inPType = inP['paramType']
    let inSType = inP['srcType']
    let inS = inP['src']
    if (inPType != 'entity') {
      if (inSType == 'expression') {
        //目前只有表达式一种类型
        let expressionContext = new ExpressionContext()
        expressionContext.setRouteContext(ruleContext.getRouteContext())
        let srcValue = ExpressEngine.execute({
          expression: inS,
          context: expressionContext
        })
        returnInputParams[inPName] = srcValue
      }
    } else {
      //入参为实体
      let entityDatas = []
      returnInputParams[inPName] = entityDatas
      let entity = getEntity(inS, inSType, ruleContext)
      let dataFilterType = inP['dataFilterType']
      let paramFieldMapping = inP['paramFieldMapping']
      let mapping = getMapping(paramFieldMapping, ruleContext)
      let resultSet
      if (dataFilterType == 'all') {
        resultSet = entity.getAllRecords()
      } else {
        resultSet = entity.getUpdatedRecords()
      }
      let records = resultSet.toArray()
      for (let j = 0; j < records.length; j++) {
        let datas = {}
        let record = records[j]
        let data = record.toMap()
        for (let key in mapping) {
          let map = mapping[key]
          let fieldType = map['fieldType']
          let value = map[key]
          if (fieldType == 'expression') {
            let expressionContext = new ExpressionContext()
            expressionContext.setRouteContext(ruleContext.getRouteContext())
            let exp = ExpressEngine.execute({
              expression: value,
              context: expressionContext
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
let getMapping = function (paramFieldMapping, ruleContext) {
  let mapping = {}
  for (let j = 0; j < paramFieldMapping.length; j++) {
    let field = paramFieldMapping[j]
    let fieldName = field['paramEntityField']
    let fieldType = field['fieldValueType']
    let fieldValue = field['fieldValue']
    let field = {}
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

let getFieldColumn = function (field) {
  if (field.indexOf('.') > 0) {
    return field.split('.')[1]
  } else {
    return field
  }
}

let handleReturnValues = function (ruleContext, ReturnValue, returnMappings) {
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
  let getSourceValue = function (source, sourceType) {
    let sourceValue = null
    switch (sourceType) {
      case 'returnValue':
        sourceValue = ReturnValue[source]
        break
      case 'expression':
        var context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
        sourceValue = ExpressEngine.execute({
          expression: source,
          context: context
        })
        break
      default:
        break
    }
    return sourceValue
  }
  let insertOrUpdateRecords2Entity = function (
    entityName,
    entityType,
    records,
    mappings,
    operType,
    isClearDatas,
    ruleContext
  ) {
    if (undefined == ruleContext || null == ruleContext)
      throw new Error('规则上下文获取失败，请传入正确的ruleContext')

    // 如果目标不是一个实体对象
    if (!dbService.isEntity(entityName, entityType, ruleContext))
      throw new Error('[' + entityName + ']不是实体对象')

    if (operType == 'updateRecord' && isClearDatas == true)
      throw new Error('更新类型为：更新记录时，不能勾选清空数据，请检查配置')

    if (operType == 'loadRecord' && isClearDatas == false)
      throw new Error('更新类型为：加载数据时，一定要勾选清空数据，请检查配置')

    let destEntity = getEntity(entityName, entityType, ruleContext)
    // 清空目标实体中的数据
    if (isClearDatas) {
      destEntity.clear()
    }
    // 如果来源记录为空，则不做任何动作
    if (
      !records ||
      (arrayUtil.isArray(records) && records.length < 1) ||
      !mappings ||
      (arrayUtil.isArray(mappings) && mappings.length < 1)
    ) {
      return
    }

    let updateRecords = []
    let insertRecords = []

    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let oldRecord = null
      let newRecord = null

      let hasId = false
      let tmpObj = {}
      for (let index = 0; index < mappings.length; index++) {
        // 来源值类型,returnValue:返回值，expression:表达式
        let srcValueType = mappings[index]['srcValueType']
        let srcValue = mappings[index]['srcValue']
        // 前台目标实体字段
        let destField = mappings[index]['destField']
        // srcField = jsTool.getFieldName(srcField);
        let value = _getValueByMapping(
          record,
          srcValueType,
          srcValue,
          ruleContext
        )
        if (destField.indexOf('.') != -1) {
          let destFieldArray = destField.split('.')
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
        oldRecords = []
        oldRecords = destEntity.getSelectedRecords().toArray()
        if (oldRecords.length < 1)
          if (destEntity.getAllRecords().toArray().length > 0)
            oldRecords.push(destEntity.getRecordByIndex(0))
        // 如果操作类型为更新，并且获取不到目标实体的当前选中记录或第一条记录，则跳出
        if (oldRecords.length < 1) break
        // 把新记录的值赋值到旧记录中，id不会赋值过去
        for (let j = 0; j < oldRecords.length; j++) {
          if (undefined == oldRecords[j] || null == oldRecords[j]) continue
          for (proName in tmpObj) {
            if (proName.toLocaleLowerCase() != 'id')
              oldRecords[j].set(proName, tmpObj[proName])
          }
          updateRecords.push(oldRecords[j])
        }
      } else {
        let isOldRecordDeleted = false
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
        for (proName in tmpObj) {
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
      destEntity.updateRecords({
        records: updateRecords
      })
    }

    if (insertRecords != null && insertRecords.length > 0) {
      if (operType == 'loadRecord') {
        let datas = []
        for (let i = 0; i < insertRecords.length; i++) {
          datas.push(insertRecords[i].toMap())
        }
        destEntity.load({
          datas: datas,
          isAppend: false
        })
      } else {
        destEntity.insertRecords({
          records: insertRecords
        })
      }
    }
  }

  let _getValueByMapping = function (
    record,
    srcColumnType,
    srcColumn,
    ruleContext
  ) {
    // 来源字段类型,returnValue:返回值，expression:表达式
    let value = null
    // srcColumnType为空时应该是旧数据，兼容处理下
    if (srcColumnType == 'expression') {
      let context = new ExpressionContext()
      //context.setRecords([ record ]);
      //context.setRecordIndex(params)
      context.setRouteContext(ruleContext.getRouteContext())
      value = ExpressEngine.execute({
        expression: srcColumn,
        context: context
      })
    } else {
      value = record[srcColumn]
    }
    if (value == undefined) {
      value = null
    }
    return value
  }
  for (let i = 0; i < returnMappings.length; i++) {
    let mappings = returnMappings[i]
    let destName = mappings['dest']
    let destType = mappings['destType']

    let sourceName = mappings['return']
    let sourceType = mappings['returnType']
    let sourceValue = getSourceValue(sourceName, sourceType)

    let operType = mappings['updateDestEntityMethod']
    let isCleanTarget = mappings['isCleanDestEntityData']

    if (dbService.isEntity(destName, destType, ruleContext)) {
      // 如果实体不存在 则不执行更新数据]
      insertOrUpdateRecords2Entity(
        destName,
        destType,
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

let setVarValue = function (destName, destType, sourceValue, ruleContext) {
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
      var scope = ScopeManager.getScope()
      var componentCode = scope.getComponentCode()
      componentParam.setVariant(componentCode, destName, sourceValue)
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
let getEntity = function (entityName, entityType, ruleContext) {
  if (undefined == ruleContext || null == ruleContext)
    throw new Error('规则上下文获取失败，请传入正确的ruleContext')

  let entity
  if (entityType == 'entity' || entityType == 'window') {
    entity = getDatasource(entityName)
  } else if (entityType == 'windowVariant' || entityType == 'windowInput') {
    entity = windowParam.getInput({
      code: entityName
    })
  } else if (entityType == 'windowOutput') {
    entity = windowParam.getOutput({
      code: entityName
    })
  } else if (entityType == 'ruleSetInput') {
    entity = ruleContext.getRouteContext().getInputParam(entityName)
  } else if (entityType == 'ruleSetOutput') {
    entity = ruleContext.getRouteContext().getOutPutParam(entityName)
  } else if (entityType == 'ruleSetVariant' || entityType == 'ruleSetVar') {
    entity = ruleContext.getRouteContext().getVariable(entityName)
  }
  if (undefined == entity || null == entity)
    throw new Error('找不到类型为[' + entityType + ']的实体：' + entityName)
  return entity
}

let getDatasource = function (datasourceName) {
  if (undefined == datasourceName || null == datasourceName) return null
  let datasource = datasourceManager.lookup({
    datasourceName: datasourceName
  })
  return datasource
}

export { main }
