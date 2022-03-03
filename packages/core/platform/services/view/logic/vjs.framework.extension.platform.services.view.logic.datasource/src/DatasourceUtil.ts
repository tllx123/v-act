import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WindowVMMappingManager as vmmappingManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { datasource as datasourceEventBinding } from '@v-act/vjs.framework.extension.platform.binding.data'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let getDatasource = function (datasourceName) {
  if (undefined == datasourceName || null == datasourceName) return null
  let datasource = datasourceManager.lookup({
    datasourceName: datasourceName
  })
  return datasource
}

let getDatasourceField = function (datasourceName, datasourceFieldCode) {
  let datasource = getDatasource(datasourceName)
  return datasource.getMetadata().getFieldByCode(datasourceFieldCode)
}

let resetDatasource = function (datasourceName) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.reset()
}

let resultsetToMapArray = function (resultset) {
  let mapArray = []
  resultset.iterate(function (record, i) {
    mapArray.push(record.toMap())
  })
  return mapArray
}

let setBaseValue = function (datasourceName, records) {
  let datasource = getDatasource(datasourceName)
  datasource.updateRecords({
    records: records
  })
}

let getSingleValue = function (datasourceName, field) {
  let datasource = getDatasource(datasourceName)
  let currentRecord = datasource.getCurrentRecord()
  return currentRecord.get(field)
}

let getWidgetCodesByDatasource = function (datasourceName, datasourceField) {
  return vmmappingManager.getWidgetCodesByFieldCode({
    datasourceName: datasourceName,
    fieldCode: datasourceField
  })
}

let addDatasourceLoadEventHandler = function (datasourceName, eventHandler) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.LOAD,
    handler: function (params) {
      eventHandler(params)
    }
  })
}

let addDatasourceUpdateEventHandler = function (datasourceName, eventHandler) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.UPDATE,
    handler: function (params) {
      eventHandler(params)
    }
  })
}

let addDatasourceFieldUpdateEventHandler = function (
  datasourceName,
  datasourceFields,
  eventHandler
) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  if (undefined == datasourceFields || null == datasourceFields)
    datasourceFields = getBindDatasourceFields(widgetId, datasourceName)
  if (!arrayUtil.isArray(datasourceFields))
    datasourceFields = [datasourceFields]
  datasource.on({
    eventName: datasource.Events.UPDATE,
    handler: function (params) {
      let result = params.resultSet
      let iterator = result.iterator()
      let isChanged = false
      while (iterator.hasNext() && !isChanged) {
        let record = iterator.next()
        let changedData = record.getChangedData()
        for (let i = 0; i < datasourceFields.length; i++) {
          let field = datasourceFields[i]
          if (changedData.hasOwnProperty(field)) {
            isChanged = true
            break
          }
        }
      }
      if (isChanged) {
        eventHandler(params)
      }
    }
  })
}

let addDatasourceCurrentRecordUpdateEventHandler = function (
  datasourceName,
  eventHandler
) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.UPDATE,
    handler: function (params) {
      let result = params.resultSet
      let iterator = result.iterator()
      while (iterator.hasNext()) {
        let record = iterator.next()
        let flag = ds.isCurrentRecord({
          record: record
        })
        if (flag) {
          eventHandler(params)
        }
      }
    }
  })
}

let addDatasourceCurrentRecordFieldUpdateEventHandler = function (
  datasourceName,
  datasourceFields,
  eventHandler
) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  if (undefined == datasourceFields || null == datasourceFields)
    datasourceFields = getBindDatasourceFields(widgetId, datasourceName)
  if (!arrayUtil.isArray(datasourceFields))
    datasourceFields = [datasourceFields]
  datasource.on({
    eventName: datasource.Events.UPDATE,
    handler: function (params) {
      let result = params.resultSet
      let iterator = result.iterator()
      while (iterator.hasNext()) {
        let record = iterator.next()
        let flag = ds.isCurrentRecord({
          record: record
        })
        if (flag) {
          let changed = record.getChangedData()
          if (undefined != changed && null != changed) {
            if (arrayUtil.isArray(datasourceFields)) {
              let isDatasourceFieldUpdated = false
              for (let i = 0; i < datasourceFields.length; i++) {
                if (changed.hasOwnProperty(datasourceFields[i])) {
                  isDatasourceFieldUpdated = true
                }
              }
              if (isDatasourceFieldUpdated) {
                eventHandler(params)
              }
            } else {
              if (changed.hasOwnProperty(datasourceFields)) {
                eventHandler(params)
              }
            }
          }
        }
      }
    }
  })
}

let addDatasourceDeleteEventHandler = function (datasourceName, eventHandler) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.DELETE,
    handler: function (params) {
      eventHandler(params)
    }
  })
}

let addDatasourceInsertEventHandler = function (datasourceName, eventHandler) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.INSERT,
    handler: function (params) {
      eventHandler(params)
    }
  })
}

let addDatasourceCurrentEventHandler = function (datasourceName, eventHandler) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.CURRENT,
    handler: function (params) {
      eventHandler(params)
    }
  })
}

let addDatasourceSelectEventHandler = function (datasourceName, eventHandler) {
  let datasource = getDatasource(datasourceName)
  if (undefined == datasource || null == datasource) return
  datasource.on({
    eventName: datasource.Events.SELECT,
    handler: function (params) {
      eventHandler(params)
    }
  })
}

/**
 * 重新绑定数据源事件，适用于销毁DB后重新注册事件
 */
let rebindDatasourceEvent = function (datasourceName) {
  datasourceEventBinding.bindByDatasourceName(datasourceName)
}

/**
 * <b>插入或更新指定数据到实体<b> <b>本函数可能需要操作到方法输出、输入等变量，所以需要从外部传入规则上下文ruleContext<b>
 *
 * 操作类型：新增或更新 或 空（"insertOrUpdateBySameId" || ""）<br>
 * 1. 如果来源记录中包含id，则根据id更新目标实体的记录，匹配不上id的记录则新增<br>
 * 2. 新增时，如果来源记录包含id，则把id也新增过去，否则创建一个新的id<br>
 *
 * 操作类型：更新（"updateRecord"）<br>
 * 1. 忽略来源记录中的id字段<br>
 * 2. 不管isClearDatas传什么，强制设置为false（不清空目标实体）<br>
 * 2. 取来源记录中的第一条记录去更新目标实体的当前记录<br>
 * 3. 如果目标实体没有当前记录，则更新其第一条记录<br>
 * 3. 如果目标实体没有任何记录，则不作任何动作<br>
 *
 * 操作类型：加载数据（"loadRecord"）<br>
 * 1. 不管isClearDatas传什么，强制设置为true<br>
 * 2. 把来源记录新增到目标实体中<br>
 *
 * @param entityName
 *            目标实体名称
 * @param entityType
 *            目标实体类型
 * @param records
 *            需要新增或更新到目标实体的记录
 * @param mappings
 *            目标实体与来源记录的映射关系
 * @param operType
 *            操作类型
 * @param isClearDatas
 *            是否清空目标实体数据
 * @param ruleContext
 *            规则上下文
 */
let insertOrUpdateRecords2Entity = function (
  entityName,
  entityType,
  records,
  mappings,
  operType,
  isClearDatas,
  ruleContext,
  extraParams
) {
  if (undefined == ruleContext || null == ruleContext)
    throw new Error('规则上下文获取失败，请传入正确的ruleContext')

  // 如果目标不是一个实体对象
  if (!isEntity(entityName, entityType, ruleContext))
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
  let isNotFieldEntity = !extraParams || extraParams.sourceType != 'fieldEntity'
  //新版的网页窗体（纯div）没有Array事件
  if (
    undefined != records &&
    null != records &&
    typeof records.toArray == 'function'
  ) {
    records = records.toArray()
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
  let epImpInfo = extraParams ? extraParams.epImpInfo : {}
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
      let value
      if (!isNotFieldEntity) {
        if (srcValueType == 'expression') {
          let context = new ExpressionContext()
          context.setRouteContext(ruleContext.getRouteContext())
          value = expressionEngine.execute({
            expression: srcValue,
            context: context
          })
        } else if (epImpInfo.hasOwnProperty(srcValue)) {
          value = epImpInfo[srcValue]
        } else if (
          extraParams &&
          extraParams.returnDatas &&
          extraParams.returnDatas.hasOwnProperty(srcValue)
        ) {
          value = extraParams.returnDatas[srcValue]
        }
      } else if (srcValue.indexOf('#') != -1) {
        value = epImpInfo[srcValue]
      } else {
        value = _getValueByMapping(record, srcValueType, srcValue, ruleContext)
      }
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
    context.setRecords([record])
    context.setRouteContext(ruleContext.getRouteContext())
    value = expressionEngine.execute({
      expression: srcColumn,
      context: context
    })
  } else {
    value = record.get(srcColumn)
  }
  if (value == undefined) {
    value = null
  }
  return value
}

/**
 * <b>判断变量是否实体对象<b>
 *
 * @param entityName
 *            实体名称
 * @param entityType
 *            实体类型
 * @param ruleContext
 *            规则上下文
 * @return boolean 变量是否实体对象
 */
let isEntity = function (entityName, entityType, ruleContext) {
  if (undefined == ruleContext || null == ruleContext)
    throw new Error('规则上下文获取失败，请传入正确的ruleContext')

  let isEntity = false

  // 界面实体：开发系统中，有的规则用entity有的规则用window，此处做兼容
  if (entityType == 'entity' || entityType == 'window') {
    isEntity = true
  }

  // 窗体输入变量：开发系统中，有的规则用windowVariant有的规则用windowInput，此处做兼容
  else if (entityType == 'windowVariant' || entityType == 'windowInput') {
    let input = windowParam.getInputDefine({
      code: entityName
    })
    if (input) {
      let varType = input.getType()
      isEntity = varType == 'entity' ? true : false
    }
  }

  // 窗体输出变量
  else if (entityType == 'windowOutput') {
    let output = windowParam.getOutputDefine({
      code: entityName
    })
    if (output) {
      let varType = output.getType()
      isEntity = varType == 'entity' ? true : false
    }
  }

  // 方法输入变量
  else if (entityType == 'ruleSetInput') {
    let varType = ruleContext.getRouteContext().getInputParamType(entityName)
    isEntity = varType == 'entity' ? true : false
  }

  // 方法输出变量
  else if (entityType == 'ruleSetOutput') {
    let varType = ruleContext.getRouteContext().getOutPutParamType(entityName)
    isEntity = varType == 'entity' ? true : false
  }

  // 方法变量：开发系统中，有的规则用ruleSetVariant有的规则用ruleSetVar，此处做兼容
  else if (entityType == 'ruleSetVariant' || entityType == 'ruleSetVar') {
    let varType = ruleContext.getRouteContext().getVariableType(entityName)
    isEntity = varType == 'entity' ? true : false
  }

  // 系统变量：开发系统中目前不支持实体类型的系统变量
  else if (entityType == 'systemVariant') {
    isEntity = false
  }
  return isEntity
}

/**
 * <b>获取指定实体对象<b>
 *
 * @param entityName
 *            实体名称
 * @param entityType
 *            实体类型
 * @param ruleContext
 *            规则上下文
 * @return db 实体对象
 */
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

export {
  insertOrUpdateRecords2Entity,
  isEntity,
  getDatasource,
  getDatasourceField,
  resetDatasource,
  resultsetToMapArray,
  setBaseValue,
  getSingleValue,
  getWidgetCodesByDatasource,
  addDatasourceLoadEventHandler,
  addDatasourceUpdateEventHandler,
  addDatasourceFieldUpdateEventHandler,
  addDatasourceCurrentRecordUpdateEventHandler,
  addDatasourceCurrentRecordFieldUpdateEventHandler,
  addDatasourceDeleteEventHandler,
  addDatasourceInsertEventHandler,
  addDatasourceCurrentEventHandler,
  addDatasourceSelectEventHandler,
  rebindDatasourceEvent
}
