import * as jsTool from 'module'
import * as mathUtil from 'module'
import * as viewModel from 'module'

// 加载mathUtil模块

export function initModule() {}
// 主入口(必须有)
const main = function (
  srcEntityName,
  destEntityName,
  destKeyColumn,
  destValueColumn
) {
  if (mathUtil.isEmpty(srcEntityName)) {
    throw new Error('源实体名为空，请检查')
  }
  if (mathUtil.isEmpty(destEntityName)) {
    throw new Error('目标实体为空，请检查')
  }
  if (mathUtil.isEmpty(destKeyColumn)) {
    throw new Error('目标标识字段名为空，请检查')
  }
  if (mathUtil.isEmpty(destValueColumn)) {
    throw new Error('目标值字段名为空，请检查')
  }

  // 创建复制record
  _newRecord(srcEntityName, destEntityName, destKeyColumn, destValueColumn)

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
    //log.warn("要复制的源实体没有符合条件的记录！srcEntityName=" + srcEntityName);
  }

  if (!viewModel.getMetaModule().isDataSourceExist(destEntityName)) {
    throw new Error('目标实体不存在！destEntityName=' + destEntityName)
  }

  if (srcResult != null && srcResult.length > 0) {
    record = srcResult[0]
  }

  // 目标实体字段
  let srcFields = viewModel.getMetaModule().getMetadataFieldsByDS(srcEntityName)

  let insertRecords = []
  for (let i = 0; i < srcFields.length; i++) {
    let srcCode = jsTool.getFieldName(srcFields[i].code)
    if (srcCode.toLowerCase() != 'id') {
      let insertRecord = viewModel
        .getDataModule()
        .createEmptyRecordByDS(destEntityName, true)
      insertRecord.set(srcKeyColumn, srcCode)
      insertRecord.set(srcValueColumn, record.get(srcCode))
      insertRecords.push(insertRecord)
    }
  }

  viewModel.getDataModule().insertByDS(destEntityName, insertRecords)
}

export { main }
