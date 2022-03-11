﻿/**
 * 实体间复制记录
 *
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

const vds = { ds, exception, expression, log, string, window }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      let inParams = ruleContext.getVplatformInput()

      // 复制数据来源实体
      let sourceName = inParams.sourceName
      // 复制类型：选中行/所有行
      let copyType = inParams.copyType
      // 源实体过滤条件
      let condition = inParams.condition

      // 字段赋值对应关系
      let fieldMapping = inParams.items
      if (!fieldMapping || fieldMapping.length == 0) {
        throw new Error('配置有误！实体间复制记录，必须配置字段映射关系！')
      }

      // 要复制到的目标实体
      let destName = inParams.destName
      // 源和目标记录重复时的操作类型
      let operatorType = inParams.type
      // 源和目标重复判定字段
      let checkItems = inParams.checkitems
      // 源和目标合并时，需要合并的字段，必须是数值类型
      let mergeItems = inParams.mageitems

      // 检测：id如果在字段映射关系中有设置，那么id就必须唯一用于重复判断字段，
      // 否则，多次操作必然导致id重复
      for (let i = 0; i < fieldMapping.length; i++) {
        let destField = fieldMapping[i].destName
        if (getFieldName(destField).toLowerCase() == 'id') {
          if (
            checkItems == null ||
            checkItems.length != 1 ||
            checkItems[0] != destField
          ) {
            // throw new
            // Error("配置错误！字段映射关系中目标字段如果设置id，那么id就必须唯一用于重复判断字段，否则，多次操作很容易导致id重复");
            // FIXME 考虑已发布的规则数据升级的原因，异常改为警告，在发布阶段检查
            vds.log.warn(
              '警告：实体间复制记录规则配置有误！字段映射关系中目标字段如果设置id，那么id就必须唯一用于重复判断字段，否则，多次操作很容易导致id重复'
            )
            break
          }
        }
      }

      // 1.0版本json结构处理逻辑
      let jsonVersion = inParams.jsonVersion
      if (!vds.string.isEmpty(jsonVersion) && jsonVersion == '1.0') {
        inParams.mergeItems = inParams.mageitems
        delete inParams.mageitems

        inParams.checkItems = inParams.checkitems
        delete inParams.checkitems

        inParams.operationType = inParams.type
        delete inParams.type

        copyEntity(inParams, ruleContext)
        resolve()
        return
      }

      // 选择符合条件的来源记录
      let sourceRecords = _getSourceEntityRecords(
        sourceName,
        copyType,
        condition,
        ruleContext
      )
      if (sourceRecords == null || sourceRecords.length == 0) {
        resolve()
        return
      }
      // 根据字段映射关系转换后的来源记录
      let mappingRecords = _mappingRecords(
        sourceRecords,
        fieldMapping,
        ruleContext
      )

      let changedRecords = null

      //是否重新设置当前行
      let resetCurrent = getResetCurrent(inParams)

      // 如果操作类型为追加，则不需要进行重复判定，简单insert即可。
      if (operatorType == OPERATOR_TYPE.APPEND) {
        changedRecords = _appendToDest(
          destName,
          mappingRecords,
          fieldMapping,
          resetCurrent
        )
      }
      // 否则其他的操作类型，都需要检查重复判定，根据重复结果进行不同操作
      else {
        changedRecords = _copyToDest(
          destName,
          mappingRecords,
          fieldMapping,
          operatorType,
          checkItems,
          mergeItems,
          resetCurrent
        )
      }

      // 如果复制到目标实体记录不为空，默认选中第一条
      if (changedRecords != null && changedRecords.length > 0 && resetCurrent) {
        let datasource = vds.ds.lookup(destName)
        datasource.setCurrentRecord(changedRecords[0])
      }
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

/**
 * 从来源实体选择符合条件的记录数据
 *
 * @param sourceName
 *            源实体名
 * @param copyType
 *            源实体数据选择方式：选中行/所有行
 * @param condition
 *            源实体的数据过滤条件
 */
let _getSourceEntityRecords = function (
  sourceName: string,
  copyType: string,
  condition: string,
  ruleContext: RuleContext
) {
  if (!vds.ds.exists(sourceName)) {
    throw new Error('来源实体不存在！sourceName=' + sourceName)
  }

  // 源记录集合
  let records = []
  let datasource = vds.ds.lookup(sourceName)
  if (copyType == COPY_TYPE.ALLRECORDS) {
    records = datasource.getAllRecords().toArray()
  } else if ((copyType = COPY_TYPE.SELECTEDROWS)) {
    records = datasource.getSelectedRecords().toArray()
  } else if (copyType == COPY_TYPE.SELECTEDROWS_CURRENTROW) {
    records = datasource.getSelectedRecords().toArray() //勾选的数据
    let currentSelected = datasource.getCurrentRecord() //当前选中数据（高亮）
    if (currentSelected) {
      if (null == records) records = []

      let exist = false
      //去重（勾选和高亮可能重复）
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        if (record.getSysId() == currentSelected.getSysId()) {
          exist = true
          break
        }
      }
      if (!exist) records.push(currentSelected)
    }
  } else if (copyType == COPY_TYPE.CURRENTROW) {
    let currentSelected = datasource.getCurrentRecord() //当前选中数据（高亮）
    if (currentSelected) records.push(currentSelected)
  }

  if (records == null || records.length == 0) {
    vds.log.warn(
      '要复制的源实体没有符合条件的记录！sourceName=' +
        sourceName +
        ',copyType=' +
        copyType
    )
    return records
  }

  if (condition == null || vds.string.trim(condition) === '') {
    return records
  }

  // 过滤后的记录集合
  let result = []

  // 按条件对源记录集合进行过滤
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    try {
      let ret = vds.expression.execute(condition, {
        ruleContext: ruleContext,
        records: [record]
      })
      if (typeof ret != 'boolean') {
        throw new Error('条件必须返回布尔类型')
      }
      if (ret == true) {
        result.push(record)
      }
    } catch (e: any) {
      let message =
        '表达式执行错误！condition=' + condition + '错误信息：' + e.message
      vds.log.error(message)
      throw new Error('实体过滤条件不正确！' + message)
    }
  }

  if (result.length == 0) {
    vds.log.log('过滤后的源实体没有符合条件的记录！condition=' + condition)
  }
  return result
}

/**
 * 按照字段映射关系转换原始记录为目标字段的集合
 *
 * @param sourceRecords
 *            原始记录的集合
 * @param fieldMapping
 *            字段映射关系
 */
let _mappingRecords = function (
  sourceRecords: Array<Record<string, any>>,
  fieldMapping: Array<Record<string, any>>,
  ruleContext: RuleContext
) {
  try {
    let result = []
    let cache = {
      variable: {},
      systemVariable: {}
    }
    for (let i = 0; i < sourceRecords.length; i++) {
      result.push(
        _mappingRecord(sourceRecords[i], fieldMapping, cache, ruleContext)
      )
    }
    return result
  } catch (e: any) {
    let message =
      '按照字段映射关系取值失败！错误信息：' +
      e.message +
      ',映射关系：' +
      vds.string.toJson(fieldMapping)
    vds.log.error(message)
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
let _mappingRecord = function (
  sourceRecord: Record<string, any>,
  fieldMapping: Array<Record<string, any>>,
  cache: Record<string, any>,
  ruleContext: RuleContext
) {
  let result: Record<string, any> = {}
  for (let i = 0; i < fieldMapping.length; i++) {
    let destField = fieldMapping[i].destName
    let sourceField = fieldMapping[i].sourceName
    let sourceType = fieldMapping[i].type
    let value = null
    switch ('' + sourceType) {
      case 'entityField':
        // 来源
        value = sourceRecord.get(sourceField)
        break
      case 'expression':
        // 来源表达式
        value = vds.expression.execute(sourceField, {
          ruleContext: ruleContext,
          records: [sourceRecord]
        })
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
let _setRecordValue = function (
  record: Record<string, any>,
  mappingRecord: Record<string, any>,
  fieldMapping: Array<Record<string, any>>
) {
  for (let i = 0; i < fieldMapping.length; i++) {
    let destField = fieldMapping[i].destName
    let value = mappingRecord[destField]
    // id字段也可赋值
    // 注意这儿不检测value是否符合字段要求类型，而是由record.set内在进行适配
    record.set(destField, value)
  }
  return record
}

/**
 * 用于重复记录操作方式为：追加
 */
let _appendToDest = function (
  destName: string,
  mappingRecords: Array<Record<string, any>>,
  fieldMapping: Array<Record<string, any>>,
  resetCurrent: any
) {
  if (!vds.ds.exists(destName)) {
    throw new Error('目标实体不存在！destName=' + destName)
  }

  let datasource = vds.ds.lookup(destName)
  let insertRecords = []
  if (mappingRecords.length > 0) {
    let emptyRecord = datasource.createRecord()

    for (let i = 0, mappingRecord; (mappingRecord = mappingRecords[i]); i++) {
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      let tempRecord = emptyRecord.clone()
      if (datasource.getMetadata().contains('id')) {
        tempRecord.set('id', vds.string.uuid(undefined))
      }
      let record = tempRecord

      record = _setRecordValue(record, mappingRecords[i], fieldMapping)
      insertRecords.push(record)
    }
  }

  if (insertRecords.length > 0) {
    datasource.insertRecords(insertRecords, null, resetCurrent)
  }

  return insertRecords
}

/**
 * 将源记录按照操作要求复制到目标实体
 *
 * @param destName
 *            目标实体
 * @param mappingRecords
 *            已转换后的原始数据
 * @param operatorType
 *            重复记录时执行何种操作
 * @param fieldMapping
 *            映射字段（有哪些字段是需要复制或比较的）
 * @param checkItems
 *            用什么来判定重复
 * @param mergeItems
 *            需要合并值的字段
 * @param resetCurrent
 * 			  是否重置当前行
 */
let _copyToDest = function (
  destName: string,
  mappingRecords: Array<Record<string, any>>,
  fieldMapping: Array<Record<string, any>>,
  operatorType: string,
  checkItems: Array<string>,
  mergeItems: Array<string>,
  resetCurrent: any
) {
  if (!vds.ds.exists(destName)) {
    throw new Error('目标实体不存在！destName=' + destName)
  }

  // 为避免多次触发事件，在操作完成后一次性将变动的记录插入、或者修改到目标实体
  let insertRecords = []
  let updateRecords = []
  // 目标实体的已有记录（用来做重复比较）
  let datasource = vds.ds.lookup(destName)
  let destRecords = datasource.getAllRecords().toArray()
  let destRecord

  let emptyRecord
  for (let i = 0; i < mappingRecords.length; i++) {
    let mappingRecord = mappingRecords[i]
    // 根据检查条件，在目标记录集合中查找
    let indexOfDest = _indexOfDestRecord(destRecords, mappingRecord, checkItems)
    let indexOfInsert = _indexOfDestRecord(
      insertRecords,
      mappingRecord,
      checkItems
    )
    let indexOfUpdate = _indexOfDestRecord(
      updateRecords,
      mappingRecord,
      checkItems
    )
    if (indexOfDest == -1 && indexOfInsert == -1 && indexOfUpdate == -1) {
      // 如果依然没有重复，那么就追加
      if (!emptyRecord) {
        emptyRecord = datasource.createRecord()
      }
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      let tempRecord = emptyRecord.clone()
      if (datasource.getMetadata().contains('id')) {
        tempRecord.set('id', vds.string.uuid(undefined))
      }
      let record = tempRecord
      record = _setRecordValue(record, mappingRecords[i], fieldMapping)
      insertRecords.push(record)
      continue
    }

    // 下面是存在重复记录的情况：
    if (operatorType == OPERATOR_TYPE.IGNORE) {
      // 如果是忽略，就啥也不干
      continue
    }

    // 对于替换和合并，找到目标记录
    if (indexOfInsert != -1) {
      destRecord = insertRecords[indexOfInsert]
    } else if (indexOfUpdate != -1) {
      destRecord = updateRecords[indexOfUpdate]
    } else {
      destRecord = destRecords[indexOfDest]
      updateRecords.push(destRecord)
      destRecords.splice(indexOfDest, 1)
    }

    if (operatorType == OPERATOR_TYPE.REPLACE) {
      // 复制源记录信息到目标记录，不包含比较字段
      _copyRecord(
        datasource,
        destRecord,
        mappingRecord,
        fieldMapping,
        checkItems,
        []
      )
    } else if (operatorType == OPERATOR_TYPE.MERGE) {
      // 复制源记录信息到目标记录，不包含比较字段，合并需要合并字段
      _copyRecord(
        datasource,
        destRecord,
        mappingRecord,
        fieldMapping,
        checkItems,
        mergeItems
      )
    }
  }

  if (insertRecords.length > 0) {
    datasource.insertRecords(insertRecords, null, resetCurrent)
  }
  if (updateRecords.length > 0) {
    datasource.updateRecords(updateRecords)
  }

  return insertRecords.concat(updateRecords)
}

/**
 * 复制源记录信息到目标记录，不包含比较字段
 */
let _copyRecord = function (
  destDataSource: Record<string, any>,
  destRecord: Record<string, any>,
  mappingRecord: Record<string, any>,
  fieldMapping: Array<Record<string, any>>,
  checkItems: Array<string>,
  mergeItems: Array<string>
) {
  for (let i = 0; i < fieldMapping.length; i++) {
    let destField = fieldMapping[i].destName
    let value = mappingRecord[destField]
    if (checkItems.indexOf(destField) != -1) {
      continue
    }

    if (getFieldName(destField).toLowerCase() == 'id') {
      throw new Error('替换或合并情况下，不允许对主键标识字段进行更新！')
    }

    if (mergeItems != null && mergeItems.indexOf(destField) != -1) {
      let metaData = destDataSource.getMetadata()
      let field = metaData.getField(getFieldName(destField))
      if (field == null) {
        throw new Error(
          '配置错误！要合并的字段在目标实体不存在！destEntity=' +
            metaData.getCode() +
            ', destField=' +
            destField
        )
      }

      let fieldType = String(field.getType()).toLowerCase()
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

      let oldValue = destRecord.get(destField)
      if (oldValue == null) {
        // 注意这儿不检测value是否符合字段要求类型，而是由record.set内在进行适配
        destRecord.set(destField, value)
        continue
      }

      if (fieldType == 'char' || fieldType == 'text') {
        destRecord.set(destField, oldValue + String(value))
      } else {
        // 数值类型：number / integer
        let avalue = parseFloat(value)
        if (avalue == null || isNaN(avalue)) {
          vds.log.warn(
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

/**
 * 根据匹配条件在目标记录集合中查找记录
 *
 * @param destRecords
 *            目标记录集合
 * @param mappingRecord
 *            要查找的原始记录
 * @param checkItems
 *            记录匹配的判定条件
 * @return 查找到的记录索引， 如果未找到匹配记录，返回-1
 */
let _indexOfDestRecord = function (
  destRecords: Array<Record<string, any>>,
  mappingRecord: Record<string, any>,
  checkItems: Array<string>
) {
  if (!checkItems || checkItems.length == 0) {
    throw new Error(
      '配置错误！当操作类型为忽略、替换、合并时，重复检查字段必须提供！checkItems=' +
        checkItems
    )
  }
  try {
    for (let i = 0; i < destRecords.length; i++) {
      let destRecord = destRecords[i]
      let isMatch = true
      for (let j = 0; j < checkItems.length; j++) {
        let checkItem = checkItems[j]
        let destValue = destRecord.get(checkItem)
        //					let fileItems = checkItem.split(".");
        //					let destValue = destRecord[fileItems[fileItems.length-1]];

        let mappingValue = mappingRecord[checkItem]
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
        return i
      }
    }
    return -1
  } catch (e: any) {
    vds.log.error('查找匹配记录错误！' + e.message)
    throw e
  }
}

let getFieldName = function (fieldName: string) {
  let retvalue = fieldName
  if (fieldName.indexOf('.') != -1) {
    retvalue = fieldName.split('.')[1]
  }
  return retvalue
}

//#region EntityVarOperation 服务提供的方法

// 复制类型
let COPY_TYPE = {
  SELECTEDROWS: '1', // 选中行
  ALLRECORDS: '2', // 所有行
  SELECTEDROWS_CURRENTROW: '3', //当前行和选中行
  CURRENTROW: '4' //当前行
}

// 字段映射关系中的源数据来源类型
let SOURCE_TYPE = {
  ENTITY: '1', // 实体字段
  SYSTEMVAR: '2', // 系统变量
  COMPONENTVAR: '3', // 组件变量
  EXPRESSION: '4' // 表达式
}

// 源和目标记录重复时的操作类型
let OPERATOR_TYPE = {
  APPEND: '1', // 追加
  IGNORE: '2', // 忽略
  REPLACE: '3', // 替换
  MERGE: '4' // 合并
}

let ENTITY_TYPE = {
  ENTITY: 'window', //界面实体
  WINDOWINPUT: 'windowInput', //窗体输入实体变量
  WINDOWOUTPUT: 'windowOutput', //窗体输出实体变量
  RULESETINPUT: 'ruleSetInput', //方法输入实体变量
  RULESETVARIANT: 'ruleSetVar', //方法实体变量
  RULESETOUTPUT: 'ruleSetOutput', //方法输出实体变量
  EXPRESSION: 'expression' //表达式
}

let VALUE_SOURCE_TYPE = {
  //值来源类型
  EXPRESSION: 'expression', //表达式
  ENTITYFIELD: 'entityField' //实体字段
}

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
 * @param	ruleContext	规则上下文可取
 * */
let copyEntity = function (
  params: Record<string, any>,
  ruleContext: RuleContext
) {
  let sourceType = params.sourceType
  let sourceName = params.sourceName
  let sourceDatasource = _getEntityDS(sourceType, sourceName, ruleContext)
  params.sourceDs = sourceDatasource
  copyByEntity(params, ruleContext)
}

/**
 * 获取是否重置当前行配置信息
 * @param {Object} params
 * @returns
 */
let getResetCurrent = function (params: Record<string, any>) {
  return typeof params.resetCurrent == 'boolean' ? params.resetCurrent : true
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
 * @param	ruleContext 规则上下文
 * */
let copyByEntity = function (
  params: Record<string, any>,
  ruleContext: RuleContext
) {
  // 根据条件获取来源实体中的记录
  let copyType = params.copyType
  let condition = params.condition
  let isAddRecord = params.isAddRecord //是否新增不存在的记录，仅在替换/合并的方式下起作用。
  let sourceDatasource = params.sourceDs
  if (!sourceDatasource) {
    return
  }
  let sourceRecords = _getEntityRecords(
    sourceDatasource,
    ruleContext,
    copyType,
    condition
  )
  if (sourceRecords == null || sourceRecords.length == 0) {
    vds.log.log('来源数据源无数据或者无符合条件的数据，已忽略复制逻辑.')
    return
  }
  // 获取目录实体所有记录，不带任何条件
  let destType = params.destType
  let destName = params.destName
  // 如果目标对象不是db对象，则创建一个空的db对象
  let destDatasource = _getEntityDS(destType, destName, ruleContext)
  let destRecords = _getEntityRecords(
    destDatasource,
    ruleContext,
    COPY_TYPE.ALLRECORDS,
    ''
  )
  // 获取映射转换后的记录
  let fieldMapping = params.items
  let sourceMappingRecords = _mappingRecords(
    sourceRecords,
    fieldMapping,
    ruleContext
  )
  // 操作类型：追加、忽略、替换、合并
  let operType = params.operationType
  //是否重置当前行
  let resetCurrent = getResetCurrent(params)
  if (operType == OPERATOR_TYPE.APPEND) {
    _append2Dest(
      destDatasource,
      sourceMappingRecords,
      fieldMapping,
      resetCurrent
    )
  } else {
    let checkItems = params.checkItems
    let mergeItems = params.mergeItems
    _copy2Dest(
      destDatasource,
      sourceMappingRecords,
      fieldMapping,
      operType,
      checkItems,
      mergeItems,
      isAddRecord,
      destRecords,
      resetCurrent
    )
  }
}

/**
 * 复制源记录信息到目标记录，不包含比较字段(一个列表)
 */
let _copyRecordList = function (
  destDataSource: Record<string, any>,
  destRecordList: Array<Record<string, any>>,
  mappingRecord: Record<string, any>,
  fieldMapping: Array<Record<string, any>>,
  checkItems: Array<string>,
  mergeItems: Array<string>
) {
  for (let _i = 0; _i < destRecordList.length; _i++) {
    let destRecord = destRecordList[_i]
    for (let i = 0; i < fieldMapping.length; i++) {
      let destField = fieldMapping[i].destName
      let value = mappingRecord[destField]
      if (checkItems.indexOf(destField) != -1) {
        continue
      }

      if (getFieldName(destField).toLowerCase() == 'id') {
        throw new Error(
          '替换或合并情况下，不允许对主键标识字段进行更新！',
          /* undefined,
          undefined, */
          exceptionFactory.TYPES.Config
        )
      }

      if (mergeItems != null && mergeItems.indexOf(destField) != -1) {
        let metaData = destDataSource.getMetadata()
        let field = metaData.getField(getFieldName(destField))
        if (field == null) {
          throw new Error(
            '配置错误！要合并的字段在目标实体不存在！destEntity=' +
              metaData.getCode() +
              ', destField=' +
              destField
          )
        }

        let fieldType = String(field.getType()).toLowerCase()
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

        let oldValue = destRecord.get(destField)
        if (oldValue == null) {
          // 注意这儿不检测value是否符合字段要求类型，而是由record.set内在进行适配
          destRecord.set(destField, value)
          continue
        }

        if (fieldType == 'char' || fieldType == 'text') {
          destRecord.set(destField, oldValue + String(value))
        } else {
          // 数值类型：number / integer
          let avalue = parseFloat(value)
          if (avalue == null || isNaN(avalue)) {
            vds.log.warn(
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
let _indexOfDestRecord_List = function (
  destRecords: Array<Record<string, any>>,
  mappingRecord: Record<string, any>,
  checkItems: Array<string>
) {
  //保存全部重复的记录
  let result_list = []
  if (!checkItems || checkItems.length == 0) {
    throw new Error(
      '配置错误！当操作类型为忽略、替换、合并时，重复检查字段必须提供！checkItems=' +
        checkItems
    )
  }
  try {
    for (let i = 0; i < destRecords.length; i++) {
      let destRecord = destRecords[i]
      let isMatch = true
      for (let j = 0; j < checkItems.length; j++) {
        let checkItem = checkItems[j]
        let destValue = destRecord.get(checkItem)

        let mappingValue = mappingRecord[checkItem]
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
      }
    }
    if (result_list.length < 1) {
      result_list.push(-1)
    }
    return result_list
  } catch (e: any) {
    vds.log.error('查找匹配记录错误！' + e.message)
    throw e
  }
}

/**
 * 获取实体数据源
 * @param	entityType		{String}	实体类型
 * @param	entityName		{String}	实体编码
 * @param	ruleContext	    {Object}	规则上下文
 * */
let _getEntityDS = function (
  entityType: string,
  entityName: string,
  ruleContext: RuleContext
) {
  let ds
  let errMsg = ''
  if (entityType == ENTITY_TYPE.ENTITY) {
    ds = vds.ds.lookup(entityName)
  } else if (entityType == ENTITY_TYPE.WINDOWINPUT) {
    ds = vds.window.getInput(entityName)
    errMsg = '窗体输入'
  } else if (entityType == ENTITY_TYPE.WINDOWOUTPUT) {
    ds = vds.window.getOutput(entityName)
    errMsg = '窗体输出'
  } else if (entityType == ENTITY_TYPE.RULESETINPUT) {
    ds = ruleContext.getMethodContext().getInput(entityName)
    errMsg = '方法输入'
  } else if (entityType == ENTITY_TYPE.RULESETOUTPUT) {
    ds = ruleContext.getMethodContext().getOutput(entityName)
    errMsg = '方法输出'
  } else if (entityType == ENTITY_TYPE.RULESETVARIANT) {
    ds = ruleContext.getMethodContext().getVariable(entityName)
    errMsg = '方法变量'
  }
  if (undefined == ds)
    throw vds.exception.newConfigException(
      errMsg + '实体【' + entityName + '】不存在，请检查配置'
    )
  return ds
}

// 获取实体中的记录
let _getEntityRecords = function (
  datasource: Record<string, any>,
  ruleContext: RuleContext,
  copyType: string,
  condition: string
) {
  let records: Array<Record<string, any>> = []
  let currentSelected
  switch (copyType) {
    case COPY_TYPE.SELECTEDROWS:
      records = datasource.getSelectedRecords().toArray()
      break
    case COPY_TYPE.SELECTEDROWS_CURRENTROW:
      records = datasource.getSelectedRecords().toArray() //勾选的数据
      currentSelected = datasource.getCurrentRecord() //当前选中数据（高亮）
      if (currentSelected) {
        if (null == records) records = []
        let exist = false
        //去重（勾选和高亮可能重复）
        for (let i = 0; i < records.length; i++) {
          let record = records[i]
          if (record.getSysId() == currentSelected.getSysId()) {
            exist = true
            break
          }
        }
        if (!exist) records.push(currentSelected)
      }
      break
    case COPY_TYPE.CURRENTROW:
      currentSelected = datasource.getCurrentRecord() //当前选中数据（高亮）
      if (currentSelected) records.push(currentSelected)
      break
    default:
      records = datasource.getAllRecords().toArray()
      break
  }
  // 过滤不符合条件的记录
  records = _filterRecords(records, condition, ruleContext)
  return records
}

// 过滤不符合条件的记录
let _filterRecords = function (
  records: Array<Record<string, any>>,
  condition: string,
  ruleContext: RuleContext
) {
  if (vds.string.isEmpty(condition)) return records
  let result: Array<Record<string, any>> = []
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    let flag = vds.expression.execute(condition, {
      ruleContext: ruleContext,
      records: [record]
    })
    if (flag) result.push(record)
  }
  return result
}

// 追加：直接把记录insert到目标数据源中
let _append2Dest = function (
  destDatasource: Record<string, any>,
  sourceMappingRecords: Array<Record<string, any>>,
  fieldMapping: Array<Record<string, any>>,
  resetCurrent: any
) {
  let insertRecords = []
  if (sourceMappingRecords.length > 0) {
    for (
      let i = 0, mappingRecord;
      (mappingRecord = sourceMappingRecords[i]);
      i++
    ) {
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      let record = destDatasource.createRecord()
      record = _setRecordValue(record, sourceMappingRecords[i], fieldMapping)
      insertRecords.push(record)
    }
  }
  if (insertRecords.length > 0) {
    destDatasource.insertRecords(insertRecords, null, resetCurrent)
  }
  return insertRecords
}

// 忽略、替换、合并：重复判断、合并处理
let _copy2Dest = function (
  destDatasource: Record<string, any>,
  sourceMappingRecords: Array<Record<string, any>>,
  fieldMapping: Array<Record<string, any>>,
  operatorType: string,
  checkItems: Array<string>,
  mergeItems: Array<string>,
  isAddRecord: boolean,
  destRecords: Array<Record<string, any>>,
  resetCurrent: any
) {
  // 为避免多次触发事件，在操作完成后一次性将变动的记录插入、或者修改到目标实体
  let insertRecords = []
  let updateRecords = []
  // 目标实体的已有记录（用来做重复比较）
  let emptyRecord
  for (let i = 0; i < sourceMappingRecords.length; i++) {
    let mappingRecord = sourceMappingRecords[i]
    // 根据检查条件，在目标记录集合中查找
    let indexOfDest = _indexOfDestRecord_List(
      destRecords,
      mappingRecord,
      checkItems
    )
    let indexOfInsert = _indexOfDestRecord_List(
      insertRecords,
      mappingRecord,
      checkItems
    )
    let indexOfUpdate = _indexOfDestRecord_List(
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
        emptyRecord = destDatasource.createRecord(true)
      }
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      let tempRecord = emptyRecord.clone()
      if (destDatasource.getMetadata().contains('id')) {
        tempRecord.set('id', vds.string.uuid(undefined))
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
    let destRecordList = []
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
      _copyRecordList(
        destDatasource,
        destRecordList,
        mappingRecord,
        fieldMapping,
        checkItems,
        []
      )
    } else if (operatorType == OPERATOR_TYPE.MERGE) {
      // 复制源记录信息到目标记录，不包含比较字段，合并需要合并字段
      _copyRecordList(
        destDatasource,
        destRecordList,
        mappingRecord,
        fieldMapping,
        checkItems,
        mergeItems
      )
    }
  }

  if (insertRecords.length > 0) {
    destDatasource.insertRecords(insertRecords, null, resetCurrent)
  }
  if (updateRecords.length > 0) {
    destDatasource.updateRecords(updateRecords)
  }
  return insertRecords.concat(updateRecords)
}

//#endregion
export { main }
