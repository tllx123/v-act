/**
 * 实体变量操作
 * vjs名称：vjs.framework.extension.platform.services.window.variable.operation
 * vjs服务：vjs.framework.extension.platform.services.window.EntityVarOperation
 */

import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourcePuller as puller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

// 复制类型
const COPY_TYPE = {
  SELECTEDROWS: '1', // 选中行
  ALLRECORDS: '2', // 所有行
  SELECTEDROWS_CURRENTROW: '3', //当前行和选中行
  CURRENTROW: '4' //当前行
}

// 字段映射关系中的源数据来源类型
const SOURCE_TYPE = {
  ENTITY: '1', // 实体字段
  SYSTEMconst: '2', // 系统变量
  COMPONENTconst: '3', // 组件变量
  EXPRESSION: '4' // 表达式
}

// 源和目标记录重复时的操作类型
const OPERATOR_TYPE = {
  APPEND: '1', // 追加
  IGNORE: '2', // 忽略
  REPLACE: '3', // 替换
  MERGE: '4' // 合并
}

const ENTITY_TYPE = {
  ENTITY: 'window', //界面实体
  WINDOWINPUT: 'windowInput', //窗体输入实体变量
  WINDOWOUTPUT: 'windowOutput', //窗体输出实体变量
  RULESETINPUT: 'ruleSetInput', //方法输入实体变量
  RULESETVARIANT: 'ruleSetVar', //方法实体变量
  RULESETOUTPUT: 'ruleSetOutput', //方法输出实体变量
  EXPRESSION: 'expression' //表达式
}

const VALUE_SOURCE_TYPE = {
  //值来源类型
  EXPRESSION: 'expression', //表达式
  ENTITYFIELD: 'entityField' //实体字段
}
export { COPY_TYPE, ENTITY_TYPE, OPERATOR_TYPE, SOURCE_TYPE, VALUE_SOURCE_TYPE }
/**
 * 复制实体（变量实体及界面实体）记录(jsonVersion>=1.0)
 * @param	params			赋值映射信息
 * {
 * 		sourceName		{String}	来源实体编码
 * 		sourceType		{String}	来源实体类型
 * 		destName		{String}	目标实体编码
 * 		destType		{String}	目标实体类型
 * 		condition		{String}	来源实体数据复制的条件（表达式）
 * 		copyType		{String}	来源实体数据的复制类型,建议使用COPY_TYPE
 * 		operationType	{String}	操作类型：源和目标记录重复时的操作类型,建议使用OPERATOR_TYPE
 * 		checkItems		{Array}		重复记录判断字段，值格式：实体编码.字段编码，值前提：operationType不等于APPEND。示例：["BaseEntity.id","BaseEntity.code",...]
 * 		mergeItems		{Array}		合并的字段信息，值格式：实体编码.字段编码，值前提：operationType为MERGE。示例：["BaseEntity.xs","BaseEntity.zs",...]
 * 		isAddRecord		{Boolean}	是否新增记录，前提：operationType为REPLACE或MERGE
 * 		items			{Object}	字段复制映射信息
 * 			[{
 * 				destName	{String}	目标编码，值格式：实体编码.字段编码
 * 				sourceName	{String}	来源编码：表达式或者实体字段(实体编码.字段编码)
 * 				type		{String}	值类型：entityField(实体字段)、expression(表达式)
 * 			},...]
 * }
 * @param	routeContext	路由上下文//从规则上下文可取：ruleContext.getRouteContext()，若无规则上下文，则可为空
 * */
export function copyEntity(params, routeContext) {
  const sourceType = params.sourceType
  const sourceName = params.sourceName
  const sourceDatasource = _getEntityDS(sourceType, sourceName, routeContext)
  params.sourceDs = sourceDatasource
  copyByEntity(params, routeContext)
}

/**
 * 复制实体（变量实体及界面实体）记录(jsonVersion>=1.0)
 * @param	params			赋值映射信息
 * {
 * 		sourceDs		{String}	来源数据源
 * 		destName		{String}	目标实体编码
 * 		destType		{String}	目标实体类型
 * 		condition		{String}	来源实体数据复制的条件（表达式）
 * 		copyType		{String}	来源实体数据的复制类型,建议使用COPY_TYPE
 * 		operationType	{String}	操作类型：源和目标记录重复时的操作类型,建议使用OPERATOR_TYPE
 * 		checkItems		{Array}		重复记录判断字段，值格式：实体编码.字段编码，值前提：operationType不等于APPEND。示例：["BaseEntity.id","BaseEntity.code",...]
 * 		mergeItems		{Array}		合并的字段信息，值格式：实体编码.字段编码，值前提：operationType为MERGE。示例：["BaseEntity.xs","BaseEntity.zs",...]
 * 		isAddRecord		{Boolean}	是否新增记录，前提：operationType为REPLACE或MERGE
 * 		items			{Object}	字段复制映射信息
 * 			[{
 * 				destName	{String}	目标编码，值格式：实体编码.字段编码
 * 				sourceName	{String}	来源编码：表达式或者实体字段(实体编码.字段编码)
 * 				type		{String}	值类型：entityField(实体字段)、expression(表达式)
 * 			},...]
 * }
 * @param	routeContext	路由上下文//从规则上下文可取：ruleContext.getRouteContext()，若无规则上下文，则可为空
 * */
export function copyByEntity(params, routeContext) {
  // 根据条件获取来源实体中的记录
  const copyType = params.copyType
  const condition = params.condition
  const isAddRecord = params.isAddRecord //是否新增不存在的记录，仅在替换/合并的方式下起作用。
  const sourceDatasource = params.sourceDs
  if (!sourceDatasource) {
    return
  }
  const sourceRecords = _getEntityRecords(
    sourceDatasource,
    routeContext,
    copyType,
    condition
  )
  if (sourceRecords == null || sourceRecords.length == 0) {
    log.log('来源数据源无数据或者无符合条件的数据，已忽略复制逻辑.')
    return
  }
  // 获取目录实体所有记录，不带任何条件
  const destType = params.destType
  const destName = params.destName
  // 如果目标对象不是db对象，则创建一个空的db对象
  const dest = _getEntityDS(destType, destName, routeContext)
  const destRecords = _getEntityRecords(
    dest,
    routeContext,
    COPY_TYPE.ALLRECORDS
  )
  // 获取映射转换后的记录
  const fieldMapping = params.items
  const sourceMappingRecords = _mappingRecords(
    sourceRecords,
    fieldMapping,
    routeContext
  )
  // 操作类型：追加、忽略、替换、合并
  const operType = params.operationType
  if (operType == OPERATOR_TYPE.APPEND) {
    _append2Dest(dest, sourceMappingRecords, fieldMapping)
  } else {
    const checkItems = params.checkItems
    const mergeItems = params.mergeItems
    _copy2Dest(
      dest,
      sourceMappingRecords,
      fieldMapping,
      operType,
      checkItems,
      mergeItems,
      isAddRecord,
      destRecords
    )
  }
}

/**
 * 按照字段映射关系转换原始记录为目标字段的集合
 *
 * @param sourceRecords
 *            原始记录的集合
 * @param fieldMapping
 *            字段映射关系
 */
const _mappingRecords = function (sourceRecords, fieldMapping, routeContext) {
  try {
    const result = []
    const cache = {
      variable: {},
      systemVariable: {}
    }
    for (let i = 0; i < sourceRecords.length; i++) {
      result.push(
        _mappingRecord(sourceRecords[i], fieldMapping, cache, routeContext)
      )
    }
    return result
  } catch (e) {
    const message =
      '按照字段映射关系取值失败！错误信息：' +
      e.message +
      ',映射关系：' +
      jsonUtil.obj2json(fieldMapping)
    log.error(message)
    throw e
  }
}

/**
 * 转换一条记录<br>
 * 按照字段映射关系转换原始记录为目标字段的集合
 *
 * @param sourceRecord
 *            原始记录
 * @param fieldMapping
 *            字段映射关系
 */
const _mappingRecord = function (
  sourceRecord,
  fieldMapping,
  cache,
  routeContext
) {
  const result = {}
  const variable = cache.variable
  const systemVariable = cache.systemVariable
  for (let i = 0; i < fieldMapping.length; i++) {
    const destField = fieldMapping[i].destName
    const sourceField = fieldMapping[i].sourceName
    const sourceType = fieldMapping[i].type
    let value = null
    switch ('' + sourceType) {
      case 'entityField':
        // 来源
        value = sourceRecord.get(sourceField)
        break
      case 'expression':
        // 来源表达式
        //				value = formulaUtil.evalExpressionByRecords(sourceField, sourceRecord);
        const context = new ExpressionContext()
        context.setRouteContext(routeContext)
        context.setRecords([sourceRecord])
        value = engine.execute({ expression: sourceField, context: context })

        break
      default:
        throw new Error(
          '配置错误！字段映射关系中类型无效：fieldMapping.type=' + sourceType
        )
    }

    result[destField] = value
  }

  return result
}

/**
 * 设置记录值
 *
 * @param record
 *            记录
 * @param mappingRecord
 *            源字段信息
 * @param fieldMapping
 *            字段映射信息：决定需要复制哪些字段
 */
const _setRecordValue = function (record, mappingRecord, fieldMapping) {
  for (let i = 0; i < fieldMapping.length; i++) {
    const destField = fieldMapping[i].destName
    const value = mappingRecord[destField]
    // id字段也可赋值
    // 注意这儿不检测value是否符合字段要求类型，而是由record.set内在进行适配
    record.set(destField, value)
  }
  return record
}

/**
 * 复制源记录信息到目标记录，不包含比较字段(一个列表)
 */
const _copyRecordList = function (
  destRecordList,
  mappingRecord,
  fieldMapping,
  checkItems,
  mergeItems
) {
  for (let _i = 0; _i < destRecordList.length; _i++) {
    const destRecord = destRecordList[_i]
    for (let i = 0; i < fieldMapping.length; i++) {
      const destField = fieldMapping[i].destName
      const value = mappingRecord[destField]
      if (checkItems.indexOf(destField) != -1) {
        continue
      }

      if (puller.getFieldName(destField).toLowerCase() == 'id') {
        throw new Error(
          '替换或合并情况下，不允许对主键标识字段进行更新！',
          undefined,
          undefined,
          exceptionFactory.TYPES.Config
        )
      }

      if (mergeItems != null && mergeItems.indexOf(destField) != -1) {
        const field = destRecord
          .getMetadata()
          .getFieldByCode(puller.getFieldName(destField))
        if (field == null) {
          throw new Error(
            '配置错误！要合并的字段在目标实体不存在！destEntity=' + //
              destRecord.getDataSourceName() +
              ', destField=' +
              destField
          )
        }

        const fieldType = String(field.getType()).toLowerCase()
        if (['char', 'text', 'number', 'integer'].indexOf(fieldType) == -1) {
          throw new Error(
            '配置错误！合并字段只支持char/text/number/integer，不支持字段类型：' +
              fieldType
          )
        }

        if (value == null) {
          // 要合并的值为null，则跳过
          continue
        }

        const oldValue = destRecord.get(destField)
        if (oldValue == null) {
          // 注意这儿不检测value是否符合字段要求类型，而是由record.set内在进行适配
          destRecord.set(destField, value)
          continue
        }

        if (fieldType == 'char' || fieldType == 'text') {
          destRecord.set(destField, oldValue + String(value))
        } else {
          // 数值类型：number / integer
          const avalue = parseFloat(value)
          if (avalue == null || isNaN(avalue)) {
            log.warn(
              '要合并的值不是合法的数值类型！已忽略。合并字段=' +
                destField +
                ', 合并值=' +
                value
            )
            continue
          }
          destRecord.set(destField, oldValue + avalue)
        }
      } else {
        // 替换
        // 注意这儿不检测value是否符合字段要求类型，而是由record.set内在进行适配
        destRecord.set(destField, value)
      }
    }
  }
}

/**
 * 根据匹配条件在目标记录集合中查找记录(返回全部重复的记录)
 *
 * @param destRecords
 *            目标记录集合
 * @param mappingRecord
 *            要查找的原始记录
 * @param checkItems
 *            记录匹配的判定条件
 * @return 查找到的记录索引列表， 如果未找到匹配记录，返回[-1]
 */
const _indexOfDestRecord_List = function (
  destRecords,
  mappingRecord,
  checkItems
) {
  //保存全部重复的记录
  const result_list = []
  if (!checkItems || checkItems.length == 0) {
    throw new Error(
      '配置错误！当操作类型为忽略、替换、合并时，重复检查字段必须提供！checkItems=' +
        checkItems
    )
  }
  try {
    for (let i = 0; i < destRecords.length; i++) {
      const destRecord = destRecords[i]
      let isMatch = true
      for (let j = 0; j < checkItems.length; j++) {
        const checkItem = checkItems[j]
        const destValue = destRecord.get(checkItem)
        //					const fileItems = checkItem.split(".");
        //					const destValue = destRecord[fileItems[fileItems.length-1]];

        const mappingValue = mappingRecord[checkItem]
        if (mappingValue === undefined) {
          throw new Error(
            '配置错误！重复检查字段必须包括在字段映射关系中！checkItem=' +
              checkItems[j]
          )
        }

        // 全等判断，避免0==''这种情况
        if (destValue !== mappingValue) {
          isMatch = false
          break
        }
      }
      if (isMatch) {
        result_list.push(i)
        //					return i;
      }
    }
    if (result_list.length < 1) {
      result_list.push(-1)
    }
    return result_list
  } catch (e) {
    log.error('查找匹配记录错误！' + e.message)
    throw e
  }
}

/**
 * 获取实体数据源
 * @param	entityType		{String}	实体类型
 * @param	entityName		{String}	实体编码
 * @param	routeContext	{Object}	路由上下文
 * */
const _getEntityDS = function (entityType, entityName, routeContext) {
  let ds
  let errMsg = ''
  if (entityType == ENTITY_TYPE.ENTITY) {
    const ds = manager.lookup({ datasourceName: entityName })
  } else if (entityType == ENTITY_TYPE.WINDOWINPUT) {
    ds = windowParam.getInput({ code: entityName })
    errMsg = '窗体输入'
  } else if (entityType == ENTITY_TYPE.WINDOWOUTPUT) {
    ds = windowParam.getOutput({ code: entityName })
    errMsg = '窗体输出'
  } else if (entityType == ENTITY_TYPE.RULESETINPUT) {
    ds = routeContext.getInputParam(entityName)
    errMsg = '方法输入'
  } else if (entityType == ENTITY_TYPE.RULESETOUTPUT) {
    ds = routeContext.getOutPutParam(entityName)
    errMsg = '方法输出'
  } else if (entityType == ENTITY_TYPE.RULESETVARIANT) {
    ds = routeContext.getVariable(entityName)
    errMsg = '方法变量'
  }
  if (undefined == ds)
    throw new Error(
      errMsg + '实体【' + entityName + '】不存在，请检查配置',
      undefined,
      undefined,
      exceptionFactory.TYPES.Config
    )
  return ds
}

// 获取实体中的记录
const _getEntityRecords = function (
  datasource,
  routeContext,
  copyType,
  condition
) {
  let records = []
  switch (copyType) {
    case COPY_TYPE.SELECTEDROWS:
      records = datasource.getSelectedRecords().toArray()
      break
    case COPY_TYPE.SELECTEDROWS_CURRENTROW:
      records = datasource.getSelectedRecords().toArray() //勾选的数据
      const currentSeld = datasource.getCurrentRecord() //当前选中数据（高亮）
      if (currentSeld) {
        if (null == records) records = []
        let exist = false
        //去重（勾选和高亮可能重复）
        for (let i = 0; i < records.length; i++) {
          const record = records[i]
          if (record.getSysId() == currentSeld.getSysId()) {
            exist = true
            break
          }
        }
        if (!exist) records.push(currentSeld)
      }
      break
    case COPY_TYPE.CURRENTROW:
      const currentSelected = datasource.getCurrentRecord() //当前选中数据（高亮）
      if (currentSelected) records.push(currentSelected)
      break
    default:
      records = datasource.getAllRecords().toArray()
      break
  }
  // 过滤不符合条件的记录
  records = _filterRecords(records, condition, routeContext)
  return records
}

// 过滤不符合条件的记录
const _filterRecords = function (records, condition, routeContext) {
  if (stringUtil.isEmpty(condition)) return records
  const result = []
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const context = new ExpressionContext()
    context.setRouteContext(routeContext)
    context.setRecords([record])
    const flag = engine.execute({ expression: condition, context: context })
    if (flag) result.push(record)
  }
  return result
}

// 追加：直接把记录insert到目标数据源中
const _append2Dest = function (dest, sourceMappingRecords, fieldMapping) {
  const insertRecords = []
  if (sourceMappingRecords.length > 0) {
    const emptyRecord = dest.createRecord(true)
    for (
      let i = 0, mappingRecord;
      (mappingRecord = sourceMappingRecords[i]);
      i++
    ) {
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      let record = dest.createRecord()
      record = _setRecordValue(record, sourceMappingRecords[i], fieldMapping)
      insertRecords.push(record)
    }
  }
  if (insertRecords.length > 0) {
    //			// 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    //			if (destType == "entity" || destType == "window") {
    ////				viewModel.getDataModule().insertByDS(destName, insertRecords, true, false);
    //				const datasource = manager.lookup({"datasourceName":destName});
    //				datasource.insertRecords({"records":insertRecords});
    //			}
    //			else {
    //				dest.insertRecords({"records":insertRecords});
    //			}
    dest.insertRecords({ records: insertRecords })
  }
  return insertRecords
}

// 忽略、替换、合并：重复判断、合并处理
const _copy2Dest = function (
  dest,
  sourceMappingRecords,
  fieldMapping,
  operatorType,
  checkItems,
  mergeItems,
  isAddRecord,
  destRecords
) {
  // 为避免多次触发事件，在操作完成后一次性将变动的记录插入、或者修改到目标实体
  const insertRecords = []
  const updateRecords = []
  // 目标实体的已有记录（用来做重复比较）
  let emptyRecord
  for (let i = 0; i < sourceMappingRecords.length; i++) {
    const mappingRecord = sourceMappingRecords[i]
    // 根据检查条件，在目标记录集合中查找
    const indexOfDest = _indexOfDestRecord_List(
      destRecords,
      mappingRecord,
      checkItems
    )
    const indexOfInsert = _indexOfDestRecord_List(
      insertRecords,
      mappingRecord,
      checkItems
    )
    const indexOfUpdate = _indexOfDestRecord_List(
      updateRecords,
      mappingRecord,
      checkItems
    )
    if (
      indexOfDest.length == 1 &&
      indexOfDest[0] == -1 &&
      indexOfInsert.length == 1 &&
      indexOfInsert[0] == -1 &&
      indexOfUpdate.length == 1 &&
      indexOfUpdate[0] == -1
    ) {
      if (
        isAddRecord == false &&
        (operatorType == OPERATOR_TYPE.REPLACE ||
          operatorType == OPERATOR_TYPE.MERGE)
      ) {
        //如果没有重复,并且是合并或者是替换的方式
        continue
      }
      // 如果依然没有重复，那么就追加
      if (!emptyRecord) {
        const emptyRecord = dest.createRecord(true)
      }
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      //				const record = emptyRecord.createNew()
      const tempRecord = emptyRecord.clone()
      if (tempRecord.getMetadata().isContainField('id')) {
        tempRecord.set('id', uuid.generate())
      }
      let record = tempRecord
      record = _setRecordValue(record, sourceMappingRecords[i], fieldMapping)
      insertRecords.push(record)
      continue
    }

    // 下面是存在重复记录的情况：
    if (operatorType == OPERATOR_TYPE.IGNORE) {
      // 如果是忽略，就啥也不干
      continue
    }

    // 对于替换和合并，找到目标记录
    const destRecordList = []
    if (indexOfInsert.length > 0 && indexOfInsert[0] != -1) {
      for (let j = 0; j < indexOfInsert.length; j++) {
        destRecordList.push(insertRecords[indexOfInsert[j]])
      }
    } else if (indexOfUpdate.length > 0 && indexOfUpdate[0] != -1) {
      for (let j = 0; j < indexOfUpdate.length; j++) {
        destRecordList.push(updateRecords[indexOfUpdate[j]])
      }
    } else {
      if (indexOfDest.length > 0 && indexOfDest[0] != -1) {
        for (let _i = 0; _i < indexOfDest.length; _i++) {
          destRecordList.push(destRecords[indexOfDest[_i]])
          updateRecords.push(destRecords[indexOfDest[_i]])
        }
      }
    }

    if (operatorType == OPERATOR_TYPE.REPLACE) {
      // 复制源记录信息到目标记录，不包含比较字段
      _copyRecordList(destRecordList, mappingRecord, fieldMapping, checkItems)
    } else if (operatorType == OPERATOR_TYPE.MERGE) {
      // 复制源记录信息到目标记录，不包含比较字段，合并需要合并字段
      _copyRecordList(
        destRecordList,
        mappingRecord,
        fieldMapping,
        checkItems,
        mergeItems
      )
    }
  }

  if (insertRecords.length > 0) {
    dest.insertRecords({ records: insertRecords })
  }
  if (updateRecords.length > 0) {
    dest.updateRecords({ records: updateRecords })
  }
  return insertRecords.concat(updateRecords)
}
