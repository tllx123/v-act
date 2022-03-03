import * as mathUtil from 'module'
import * as viewModel from 'module'
import * as viewContext from 'module'
import * as jsTool from 'module'
import * as log from 'module'
// 加载mathUtil模块
let undefined
let undefined
let undefined
let undefined
let undefined
exports.initModule = function () {}
// 主入口(必须有)
let main = function (
  srcEntityName,
  destEntityName,
  srcKeyColumn,
  srcValueColumn
) {
  if (mathUtil.isEmpty(srcEntityName)) {
    throw new Error('源实体名为空，请检查')
  }
  if (mathUtil.isEmpty(destEntityName)) {
    throw new Error('目标实体为空，请检查')
  }
  if (mathUtil.isEmpty(srcKeyColumn)) {
    throw new Error('源标识字段名为空，请检查')
  }
  if (mathUtil.isEmpty(srcValueColumn)) {
    throw new Error('源值字段名为空，请检查')
  }

  // 创建复制record
  _newRecord(srcEntityName, destEntityName, srcKeyColumn, srcValueColumn)

  // 插入需要复制的表
}

/**
 * 从来源实体记录数据 创建新记录，并创建列与值
 *
 * @param entityName
 *            目标实体名
 * @param result
 *            源字段列与值信息
 */
let _newRecord = function (
  srcEntityName,
  destEntityName,
  srcKeyColumn,
  srcValueColumn
) {
  if (!viewModel.getMetaModule().isDataSourceExist(srcEntityName)) {
    throw new Error('来源实体不存在！srcEntityName=' + srcEntityName)
  }

  // 源记录集合
  let srcResult = viewModel.getDataModule().getAllRecordsByDS(srcEntityName)

  if (srcResult == null || srcResult.length == 0) {
    log.warn('要复制的源实体没有符合条件的记录！srcEntityName=' + srcEntityName)
  }

  if (!viewModel.getMetaModule().isDataSourceExist(destEntityName)) {
    throw new Error('目标实体不存在！destEntityName=' + destEntityName)
  }

  // 目标实体字段
  let destFields = viewModel
    .getMetaModule()
    .getMetadataFieldsByDS(destEntityName)

  let record = null

  // 源记录集合
  let descResult = viewModel.getDataModule().getAllRecordsByDS(destEntityName)

  let isNew = false
  if (descResult != null && descResult.length > 0) {
    record = descResult[0]
  } else {
    record = viewModel
      .getDataModule()
      .createEmptyRecordByDS(destEntityName, true)
    isNew = true
  }

  for (let i = 0; i < srcResult.length; i++) {
    let re = srcResult[i]
    let destField = re.get(srcKeyColumn)
    if (destField != null && destField != '') {
      let value = re.get(srcValueColumn)
      for (let j = 0; j < destFields.length; j++) {
        if (
          jsTool.getFieldName(destField).toLowerCase() ==
          jsTool.getFieldName(destFields[j].code).toLowerCase()
        ) {
          record.set(destField, value)
        }
      }
    }
  }

  if (isNew) {
    viewModel.getDataModule().insertByDS(destEntityName, [record])
  } else {
    viewModel.getDataModule().setRecordValueByDS(destEntityName, record)
  }
}

export { main }
