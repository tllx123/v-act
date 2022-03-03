import { log as log } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourcePuller as puller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'

let undefined
let undefined
let undefined
let viewModel
let ruleContext
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}
// 复制类型
let COPY_TYPE = {
  SELECTEDROWS: '1', // 选中行
  ALLRECORDS: '2' // 所有行
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

let main = function (ruleCtxt) {
  ruleContext = ruleCtxt
  let inParams = jsonUtil.json2obj(ruleCtxt.getRuleCfg().inParams)

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
    if (puller.getFieldName(destField).toLowerCase() == 'id') {
      if (
        checkItems == null ||
        checkItems.length != 1 ||
        checkItems[0] != destField
      ) {
        // throw new
        // Error("配置错误！字段映射关系中目标字段如果设置id，那么id就必须唯一用于重复判断字段，否则，多次操作很容易导致id重复");
        // FIXME 考虑已发布的规则数据升级的原因，异常改为警告，在发布阶段检查
        log.warn(
          '警告：实体间复制记录规则配置有误！字段映射关系中目标字段如果设置id，那么id就必须唯一用于重复判断字段，否则，多次操作很容易导致id重复'
        )
        break
      }
    }
  }

  // 1.0版本json结构处理逻辑
  let jsonVersion = inParams.jsonVersion
  if (!stringUtil.isEmpty(jsonVersion) && jsonVersion == '1.0') {
    _copy(inParams)
    return
  }

  // 选择符合条件的来源记录
  let sourceRecords = _getSourceEntityRecords(sourceName, copyType, condition)
  if (sourceRecords == null || sourceRecords.length == 0) {
    return
  }
  // 根据字段映射关系转换后的来源记录
  let mappingRecords = _mappingRecords(sourceRecords, fieldMapping)

  let changedRecords = null
  // 如果操作类型为追加，则不需要进行重复判定，简单insert即可。
  if (operatorType == OPERATOR_TYPE.APPEND) {
    changedRecords = _appendToDest(destName, mappingRecords, fieldMapping)
  }
  // 否则其他的操作类型，都需要检查重复判定，根据重复结果进行不同操作
  else {
    changedRecords = _copyToDest(
      destName,
      mappingRecords,
      fieldMapping,
      operatorType,
      checkItems,
      mergeItems
    )
  }

  // 如果复制到目标实体记录不为空，默认选中第一条
  if (changedRecords != null && changedRecords.length > 0) {
    //			viewModel.getDataModule().setCurrentRowByDS(destName, changedRecords[0]);
    let datasource = manager.lookup({ datasourceName: destName })
    datasource.setCurrentRecord({ record: changedRecords[0] })
  }
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
let _getSourceEntityRecords = function (sourceName, copyType, condition) {
  if (!manager.exists({ datasourceName: sourceName })) {
    throw new Error('来源实体不存在！sourceName=' + sourceName)
  }

  // 源记录集合
  let records = []
  if (copyType == COPY_TYPE.ALLRECORDS) {
    //			records = viewModel.getDataModule().getAllRecordsByDS(sourceName);
    let datasource = manager.lookup({ datasourceName: sourceName })
    records = datasource.getAllRecords().toArray()
  } else if ((copyType = COPY_TYPE.SELECTEDROWS)) {
    let datasource = manager.lookup({ datasourceName: sourceName })
    //			records = viewModel.getDataModule().getSelectedOrCurrentRowByDS(sourceName);
    //			records = datasourcePuller.getSelectedAndCurrentRecords({"datasourceName":sourceName});
    records = datasource.getSelectedRecords().toArray()
  }

  if (records == null || records.length == 0) {
    log.warn(
      '要复制的源实体没有符合条件的记录！sourceName=' +
        sourceName +
        ',copyType=' +
        copyType
    )
    return records
  }

  if (condition == null || stringUtil.trim(condition) === '') {
    return records
  }

  // 过滤后的记录集合
  let result = []

  // 按条件对源记录集合进行过滤
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    try {
      //				var ret = formulaUtil.evalExpressionByRecords(condition, record);
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      context.setRecords([record])
      let ret = engine.execute({ expression: condition, context: context })

      if (typeof ret != 'boolean') {
        throw new Error('条件必须返回布尔类型')
      }
      if (ret == true) {
        result.push(record)
      }
    } catch (e) {
      let message =
        '表达式执行错误！condition=' + condition + '错误信息：' + e.message
      log.error(message)
      throw new Error('实体过滤条件不正确！' + message)
    }
  }

  if (result.length == 0) {
    log.log('过滤后的源实体没有符合条件的记录！condition=' + condition)
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
let _mappingRecords = function (sourceRecords, fieldMapping) {
  try {
    let result = []
    let cache = {
      variable: {},
      systemVariable: {}
    }
    for (let i = 0; i < sourceRecords.length; i++) {
      result.push(_mappingRecord(sourceRecords[i], fieldMapping, cache))
    }
    return result
  } catch (e) {
    let message =
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
let _mappingRecord = function (sourceRecord, fieldMapping, cache) {
  let result = {}
  let variable = cache.variable
  let systemVariable = cache.systemVariable
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
        //				value = formulaUtil.evalExpressionByRecords(sourceField, sourceRecord);
        var context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
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
 * 用于重复记录操作方式为：追加
 */
let _appendToDest = function (destName, mappingRecords, fieldMapping) {
  if (!manager.exists({ datasourceName: destName })) {
    throw new Error('目标实体不存在！destName=' + destName)
  }

  let insertRecords = []
  if (mappingRecords.length > 0) {
    //			var emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(destName, true);
    let datasource = manager.lookup({ datasourceName: destName })
    let emptyRecord = datasource.createRecord()

    for (let i = 0, mappingRecord; (mappingRecord = mappingRecords[i]); i++) {
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      //var record = emptyRecord.createNew();

      let tempRecord = emptyRecord.clone()
      if (tempRecord.getMetadata().isContainField('id')) {
        tempRecord.set('id', uuid.generate())
      }
      let record = tempRecord

      record = _setRecordValue(record, mappingRecords[i], fieldMapping)
      insertRecords.push(record)
    }
  }

  if (insertRecords.length > 0) {
    //			viewModel.getDataModule().insertByDS(destName, insertRecords, true, false);
    let datasource = manager.lookup({ datasourceName: destName })
    let rs = datasource.insertRecords({ records: insertRecords })
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
 */
let _copyToDest = function (
  destName,
  mappingRecords,
  fieldMapping,
  operatorType,
  checkItems,
  mergeItems
) {
  if (!manager.exists({ datasourceName: destName })) {
    throw new Error('目标实体不存在！destName=' + destName)
  }

  // 为避免多次触发事件，在操作完成后一次性将变动的记录插入、或者修改到目标实体
  let insertRecords = []
  let updateRecords = []
  // 目标实体的已有记录（用来做重复比较）
  //		var destRecords = viewModel.getDataModule().getAllRecordsByDS(destName);
  let datasource = manager.lookup({ datasourceName: destName })
  let destRecords = datasource.getAllRecords().toArray()

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
        //					emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(destName, true);/
        let datasource = manager.lookup({ datasourceName: destName })
        let emptyRecord = datasource.createRecord()
      }
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      //				var record = emptyRecord.createNew()
      let tempRecord = emptyRecord.clone()
      if (tempRecord.getMetadata().isContainField('id')) {
        tempRecord.set('id', uuid.generate())
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
      let destRecord = insertRecords[indexOfInsert]
    } else if (indexOfUpdate != -1) {
      let destRecord = updateRecords[indexOfUpdate]
    } else {
      let destRecord = destRecords[indexOfDest]
      updateRecords.push(destRecord)
      destRecords.splice(indexOfDest, 1)
    }

    if (operatorType == OPERATOR_TYPE.REPLACE) {
      // 复制源记录信息到目标记录，不包含比较字段
      _copyRecord(destRecord, mappingRecord, fieldMapping, checkItems)
    } else if (operatorType == OPERATOR_TYPE.MERGE) {
      // 复制源记录信息到目标记录，不包含比较字段，合并需要合并字段
      _copyRecord(
        destRecord,
        mappingRecord,
        fieldMapping,
        checkItems,
        mergeItems
      )
    }
  }

  if (insertRecords.length > 0) {
    //			viewModel.getDataModule().insertByDS(destName, insertRecords, true, false);
    let datasource = manager.lookup({ datasourceName: destName })
    let rs = datasource.insertRecords({ records: insertRecords })
  }
  if (updateRecords.length > 0) {
    //			viewModel.getDataModule().setBaseValueByDS(destName, updateRecords);

    datasourceUtil.setBaseValue(destName, updateRecords)
  }

  return insertRecords.concat(updateRecords)
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
let _setRecordValue = function (record, mappingRecord, fieldMapping) {
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
 * 复制源记录信息到目标记录，不包含比较字段
 */
let _copyRecord = function (
  destRecord,
  mappingRecord,
  fieldMapping,
  checkItems,
  mergeItems
) {
  for (let i = 0; i < fieldMapping.length; i++) {
    let destField = fieldMapping[i].destName
    let value = mappingRecord[destField]
    if (checkItems.indexOf(destField) != -1) {
      continue
    }

    if (puller.getFieldName(destField).toLowerCase() == 'id') {
      throw new Error('替换或合并情况下，不允许对主键标识字段进行更新！')
    }

    if (mergeItems != null && mergeItems.indexOf(destField) != -1) {
      let field = destRecord
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

/**
 * 复制源记录信息到目标记录，不包含比较字段(一个列表)
 */
let _copyRecordList = function (
  destRecordList,
  mappingRecord,
  fieldMapping,
  checkItems,
  mergeItems
) {
  for (let _i = 0; _i < destRecordList.length; _i++) {
    let destRecord = destRecordList[_i]
    for (let i = 0; i < fieldMapping.length; i++) {
      let destField = fieldMapping[i].destName
      let value = mappingRecord[destField]
      if (checkItems.indexOf(destField) != -1) {
        continue
      }

      if (puller.getFieldName(destField).toLowerCase() == 'id') {
        throw new Error('替换或合并情况下，不允许对主键标识字段进行更新！')
      }

      if (mergeItems != null && mergeItems.indexOf(destField) != -1) {
        let field = destRecord
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
let _indexOfDestRecord = function (destRecords, mappingRecord, checkItems) {
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
        //					var fileItems = checkItem.split(".");
        //					var destValue = destRecord[fileItems[fileItems.length-1]];

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
  } catch (e) {
    log.error('查找匹配记录错误！' + e.message)
    throw e
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
  destRecords,
  mappingRecord,
  checkItems
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
        //					var fileItems = checkItem.split(".");
        //					var destValue = destRecord[fileItems[fileItems.length-1]];

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
 * 2015-04-07 以下为新版本json结构处理逻辑，使用jsonVersion来标识，起始值为1.0 旧版本只支持界面实体间的复制
 *
 * 2015-04-07 jsonVersion：1.0 新版本支持以下实体间的复制： 来源实体：界面实体、窗体输入实体、方法输入实体、方法变量实体
 * 目标实体：界面实体、窗体输出实体、方法输出实体、方法变量实体
 */

// ------1.0 Start------
let _copy = function (ruleConfig) {
  // 根据条件获取来源实体中的记录
  let copyType = ruleConfig.copyType
  let condition = ruleConfig.condition
  let sourceType = ruleConfig.sourceType
  let sourceName = ruleConfig.sourceName
  let isAddRecord = ruleConfig.isAddRecord //是否新增不存在的记录，仅在替换/合并的方式下起作用。
  //		// 如果来源对象不是一个db对象，则创建一个空的db并赋值
  //		var source = _getEntityDS(sourceType, sourceName);
  //		if (!_isDB(source)) {
  //			var mapping = ruleConfig.items;
  //			var dbMeta = _createMetaByMapping(mapping);
  //			var db = _createBlankDB(dbMeta);
  //			_setEntityRecords(sourceType, sourceName, db);
  //		}
  let sourceRecords = _getEntityRecords(
    sourceType,
    sourceName,
    copyType,
    condition
  )
  if (sourceRecords == null || sourceRecords.length == 0) {
    return
  }

  // 获取目录实体所有记录，不带任何条件
  let destType = ruleConfig.destType
  let destName = ruleConfig.destName
  //		// 如果目标对象不是一个db对象，则创建一个空的db并赋值
  //		var dest = _getEntityDS(destType, destName);
  //		if (!_isDB(dest)) {
  //			var mapping = ruleConfig.items;
  //			var dbMeta = _createMetaByMapping(mapping);
  //			var db = _createBlankDB(dbMeta);
  //			_setEntityRecords(destType, destName, db);
  //		}
  let destRecords = _getEntityRecords(
    destType,
    destName,
    COPY_TYPE.ALLRECORDS,
    null
  )

  // 调用旧版本的映射转换接口
  // 获取映射转换后的记录
  let fieldMapping = ruleConfig.items
  let sourceMappingRecords = _mappingRecords(sourceRecords, fieldMapping)

  // 如果目标对象不是db对象，则创建一个空的db对象
  let dest = _getEntityDS(destType, destName)

  // 操作类型：追加、忽略、替换、合并
  let operType = ruleConfig.type
  if (operType == OPERATOR_TYPE.APPEND) {
    changedRecords = _append2Dest(
      destType,
      destName,
      sourceMappingRecords,
      fieldMapping
    )
  } else {
    let checkItems = ruleConfig.checkitems
    let mergeItems = ruleConfig.mageitems
    changedRecords = _copy2Dest(
      destType,
      destName,
      sourceMappingRecords,
      fieldMapping,
      operType,
      checkItems,
      mergeItems,
      isAddRecord
    )
  }
}

// 获取实体数据源
let _getEntityDS = function (entityType, entityName) {
  let ds
  if (entityType == 'window') {
    //			ds = dbManager.getDB(entityName);
    let ds = manager.lookup({ datasourceName: entityName })
  } else if (entityType == 'windowInput') {
    //			ds = viewContext.getVariableValue(entityName);
    ds = windowParam.getInput({ code: entityName })
  } else if (entityType == 'windowOutput') {
    //			ds = viewContext.getWindowOutputValue(entityName);
    ds = windowParam.getOutput({ code: entityName })
  } else if (entityType == 'ruleSetInput') {
    ds = ruleContext.getRouteContext().getInputParam(entityName)
  } else if (entityType == 'ruleSetOutput') {
    ds = ruleContext.getRouteContext().getOutPutParam(entityName)
  } else if (entityType == 'ruleSetVar') {
    ds = ruleContext.getRouteContext().getVariable(entityName)
  }
  if (undefined == ds)
    throw new Error('找不到类型为[' + entityType + ']的实体：' + entityName)
  return ds
}

// 判断对象是否db对象
//	var _isDB = function(entityType, entityName) {
//		var isdb = false;
//		var dataType;
//		if (destType == "window") {
//			isdb = true;
//			dataType = "entity";
//		} else if (destType == "windowInput") {
//			dataType = viewContext.getWindowVariantType(entityName);
//		} else if (destType == "windowOutput") {
//			dataType = viewContext.getWindowOutputType(entityName);
//		} else if (destType == "ruleSetInput") {
//			dataType = viewContext.getInputParamType(entityName);
//		} else if (destType == "ruleSetOutput") {
//			dataType = viewContext.getOutPutParamType(entityName);
//		} else if (destType == "ruleSetVar") {
//			dataType = viewContext.getVariableType(entityName);
//		}
//		if (dataType == "entity")
//			isdb = true;
//	}

// 获取实体中的记录
let _getEntityRecords = function (entityType, entityName, copyType, condition) {
  let ds = _getEntityDS(entityType, entityName)
  let records = []
  if (entityType == 'window') {
    if (copyType == COPY_TYPE.ALLRECORDS) {
      //				records = viewModel.getDataModule().getAllRecordsByDS(entityName);
      let datasource = manager.lookup({ datasourceName: entityName })
      records = datasource.getAllRecords().toArray()
    } else if (copyType == COPY_TYPE.SELECTEDROWS) {
      let datasource = manager.lookup({ datasourceName: entityName })
      //				records = viewModel.getDataModule().getSelectedOrCurrentRowByDS(entityName);
      //				records = datasourcePuller.getSelectedAndCurrentRecords({"datasourceName":entityName});
      records = datasource.getSelectedRecords().toArray()
    }
  } else if (entityType == 'windowInput') {
    records = ds.getAllRecords().toArray()
  } else if (entityType == 'windowOutput') {
    records = ds.getAllRecords().toArray()
  } else if (entityType == 'ruleSetInput') {
    records = ds.getAllRecords().toArray()
  } else if (entityType == 'ruleSetOutput') {
    records = ds.getAllRecords().toArray()
  } else if (entityType == 'ruleSetVar') {
    records = ds.getAllRecords().toArray()
  }
  // 过滤不符合条件的记录
  records = _filterRecords(records, condition)
  return records
}

// 直接设置目标对象的值
let _setEntityRecords = function (destType, destName, sourceRecords) {
  if (destType == 'window') {
    throw new Error('isDB()判断错误')
  } else if (destType == 'windowInput') {
    //			viewContext.setVariableValue(destName, sourceRecords);
    windowParam.setInput({ code: destName, value: sourceRecords })
  } else if (destType == 'windowOutput') {
    //			viewContext.setWindowOutputValue(destName, sourceRecords);
    windowParam.setOutput({ code: destName, value: sourceRecords })
  } else if (destType == 'ruleSetInput') {
    ruleContext.getRouteContext().setInputParam(destName, sourceRecords)
  } else if (destType == 'ruleSetOutput') {
    ruleContext.getRouteContext().setOutputParam(destName, sourceRecords)
  } else if (destType == 'ruleSetVar') {
    ruleContext.getRouteContext().setVariable(destName, sourceRecords)
  }
}

// 过滤不符合条件的记录
let _filterRecords = function (records, condition) {
  if (stringUtil.isEmpty(condition)) return records
  let result = []
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    //			var flag = formulaUtil.evalExpressionByRecords(condition, record);
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    context.setRecords([record])
    let flag = engine.execute({ expression: condition, context: context })

    if (flag) result.push(record)
  }
  return result
}

// 追加：直接把记录insert到目标数据源中
let _append2Dest = function (
  destType,
  destName,
  sourceMappingRecords,
  fieldMapping
) {
  let dest = _getEntityDS(destType, destName)
  let insertRecords = []
  if (sourceMappingRecords.length > 0) {
    let emptyRecord = dest.createRecord(true)
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
    // 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    if (destType == 'entity' || destType == 'window') {
      //				viewModel.getDataModule().insertByDS(destName, insertRecords, true, false);
      let datasource = manager.lookup({ datasourceName: destName })
      datasource.insertRecords({ records: insertRecords })
    } else {
      dest.insertRecords({ records: insertRecords })
    }
  }
  return insertRecords
}

// 忽略、替换、合并：重复判断、合并处理
let _copy2Dest = function (
  destType,
  destName,
  sourceMappingRecords,
  fieldMapping,
  operatorType,
  checkItems,
  mergeItems,
  isAddRecord
) {
  let dest = _getEntityDS(destType, destName)
  // 为避免多次触发事件，在操作完成后一次性将变动的记录插入、或者修改到目标实体
  let insertRecords = []
  let updateRecords = []
  // 目标实体的已有记录（用来做重复比较）
  let destRecords = _getEntityRecords(
    destType,
    destName,
    COPY_TYPE.ALLRECORDS,
    null
  )
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
        let emptyRecord = dest.createRecord(true)
      }
      // 使用克隆，防止调用createEmptyRecordByDS接口重新设置默认中，消耗性能
      //				var record = emptyRecord.createNew()
      let tempRecord = emptyRecord.clone()
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
      //				_copyRecord(destRecord, mappingRecord, fieldMapping, checkItems);
      _copyRecordList(destRecordList, mappingRecord, fieldMapping, checkItems)
    } else if (operatorType == OPERATOR_TYPE.MERGE) {
      // 复制源记录信息到目标记录，不包含比较字段，合并需要合并字段
      //				_copyRecord(destRecord, mappingRecord, fieldMapping, checkItems, mergeItems);
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
    // 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    if (destType == 'entity' || destType == 'window') {
      //				viewModel.getDataModule().insertByDS(destName, insertRecords, true, false);
      let datasource = manager.lookup({ datasourceName: destName })
      let rs = datasource.insertRecords({ records: insertRecords })
    } else {
      dest.insertRecords({ records: insertRecords })
    }
  }
  if (updateRecords.length > 0) {
    // 如果是界面实体，则调用前端框架提供的接口，这样会调用控件的刷新事件
    if (destType == 'entity' || destType == 'window') {
      //				viewModel.getDataModule().setBaseValueByDS(destName, updateRecords, true);
      datasourceUtil.setBaseValue(destName, updateRecords)
    } else {
      dest.updateRecords({ records: updateRecords })
    }
  }

  return insertRecords.concat(updateRecords)
}

export {
  main,
  _getSourceEntityRecords,
  _mappingRecords,
  _mappingRecord,
  _copyToDest,
  _indexOfDestRecord
}
