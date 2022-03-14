import * as dbManager from 'module'
import * as formulaUtil from 'module'
import * as jsTool from 'module'
import * as viewContext from 'module'
import * as viewModel from 'module'

let sandbox

export function initModule(sb: any) {
  sandbox = sb
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
  entityName: string,
  entityType: string,
  records: any[],
  mappings: string,
  operType: string,
  isClearDatas: boolean,
  ruleContext: string
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
    // 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    if (entityType == 'entity' || entityType == 'window') {
      // @ts-ignore
      viewModel.getDataModule().resetDS(entityName)
      // TODO:目前resetDS存在清除后会因为setValue造成一条新记录，所以必须进行remove
      // @ts-ignore
      let existRecords = viewModel.getDataModule().getAllRecordsByDS(entityName)
      if (existRecords && existRecords.length > 0) {
        let removeIds = []
        for (let ei = 0; ei < existRecords.length; ei++) {
          let existRecord = existRecords[ei]
          removeIds.push(existRecord.getSysId())
        }
        // @ts-ignore
        viewModel.getDataModule().removeByDS(entityName, removeIds)
      }
    } else {
      destEntity.removeAllRecord()
    }
  }
  // 如果来源记录为空，则不做任何动作
  if (
    !records ||
    // @ts-ignore
    (jsTool.isArray(records) && records.length < 1) ||
    !mappings ||
    // @ts-ignore
    (jsTool.isArray(mappings) && mappings.length < 1)
  )
    return

  let updateRecords = []
  let insertRecords = []

  let oldRecords
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    let oldRecord = null
    let newRecord = null

    let hasId = false
    let tmpObj = {}
    for (let index = 0; index < mappings.length; index++) {
      // 来源值类型,returnValue:返回值，expression:表达式
      // @ts-ignore
      let srcValueType = mappings[index]['srcValueType']
      // @ts-ignore
      let srcValue = mappings[index]['srcValue']
      // 前台目标实体字段
      // @ts-ignore
      let destField = mappings[index]['destField']
      // srcField = jsTool.getFieldName(srcField);
      let value = _getValueByMapping(record, srcValueType, srcValue)
      // @ts-ignore
      destField = jsTool.getFieldName(destField)
      // @ts-ignore
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
      oldRecords = destEntity.getSelectedRows()
      if (oldRecords.length < 1)
        if (destEntity.getRecords().length > 0)
          oldRecords.push(destEntity.getRecordByIndex(0))
      // 如果操作类型为更新，并且获取不到目标实体的当前选中记录或第一条记录，则跳出
      if (oldRecords.length < 1) break
      // 把新记录的值赋值到旧记录中，id不会赋值过去
      for (let j = 0; j < oldRecords.length; j++) {
        if (undefined == oldRecords[j] || null == oldRecords[j]) continue
        for (let proName in tmpObj) {
          if (proName.toLocaleLowerCase() != 'id')
            oldRecords[j].set(proName, tmpObj[proName])
        }
        updateRecords.push(oldRecords[j])
      }
    } else {
      if (oldRecord != null && oldRecord.getState() == 'delete') {
        // 如果id匹配的记录为删除状态，则报错。
        throw new Error('返回实体不能更新已经删除的记录!')
      }
      // 如果获取不到目标实体的记录，则新增
      if (oldRecord == null) newRecord = destEntity.getEmptyRecord(true)
      for (let proName in tmpObj) {
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
    // 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    if (entityType == 'entity' || entityType == 'window')
      viewModel // @ts-ignore
        .getDataModule()
        .setBaseValueByDS(entityName, updateRecords, true)
    else destEntity.updateRecords(updateRecords, true)
  }

  if (insertRecords != null && insertRecords.length > 0) {
    // 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    if (entityType == 'entity' || entityType == 'window') {
      if (operType == 'loadRecord') {
        viewModel // @ts-ignore
          .getDataModule()
          .loadDataRecords(entityName, insertRecords, true, null, true)
      } else {
        viewModel // @ts-ignore
          .getDataModule()
          .insertByDS(entityName, insertRecords, null, false)
      }
    } else {
      destEntity.insertRecords(insertRecords, true)
    }
  }
}

let _getValueByMapping = function (
  record: any,
  srcColumnType: string,
  srcColumn: string | number
): null | number | string {
  // 来源字段类型,returnValue:返回值，expression:表达式
  let value = null
  // srcColumnType为空时应该是旧数据，兼容处理下
  if (srcColumnType == 'expression') {
    // @ts-ignore
    value = formulaUtil.evalExpressionByRecords(srcColumn, [record])
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
let isEntity = function (
  entityName: string,
  entityType: string,
  ruleContext: any
) {
  if (undefined == ruleContext || null == ruleContext)
    throw new Error('规则上下文获取失败，请传入正确的ruleContext')

  let isEntity = false

  // 界面实体：开发系统中，有的规则用entity有的规则用window，此处做兼容
  if (entityType == 'entity' || entityType == 'window') {
    isEntity = true
  }

  // 窗体输入变量：开发系统中，有的规则用windowVariant有的规则用windowInput，此处做兼容
  else if (entityType == 'windowVariant' || entityType == 'windowInput') {
    // @ts-ignore
    let varType = viewContext.getWindowVariantType(entityName)
    isEntity = varType == 'entity' ? true : false
  }

  // 窗体输出变量
  else if (entityType == 'windowOutput') {
    // @ts-ignore
    let varType = viewContext.getWindowOutputType(entityName)
    isEntity = varType == 'entity' ? true : false
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
let getEntity = function (
  entityName: string,
  entityType: string,
  ruleContext: any
) {
  if (undefined == ruleContext || null == ruleContext)
    throw new Error('规则上下文获取失败，请传入正确的ruleContext')

  let entity
  if (entityType == 'entity' || entityType == 'window') {
    // @ts-ignore
    entity = dbManager.getDB(entityName)
  } else if (entityType == 'windowVariant' || entityType == 'windowInput') {
    // @ts-ignore
    entity = viewContext.getWindowVariantType(entityName)
  } else if (entityType == 'windowOutput') {
    // @ts-ignore
    entity = viewContext.getWindowOutputValue(entityName)
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

export { insertOrUpdateRecords2Entity, isEntity }
