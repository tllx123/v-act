import * as jsTool from 'module'
import * as mathUtil from 'module'
import * as viewModel from 'module'

import * as record from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'

const vds = { jsTool, mathUtil, viewModel, record }

// 主入口(必须有)
const main = function (
  srcEntityName: string,
  destEntityName: string,
  destKeyColumn: string,
  destValueColumn: string
) {
  //@ts-ignore
  if (vds.mathUtil.isEmpty(srcEntityName)) {
    throw new Error('源实体名为空，请检查')
  }
  //@ts-ignore
  if (vds.mathUtil.isEmpty(destEntityName)) {
    throw new Error('目标实体为空，请检查')
  }
  //@ts-ignore
  if (vds.mathUtil.isEmpty(destKeyColumn)) {
    throw new Error('目标标识字段名为空，请检查')
  }
  //@ts-ignore
  if (vds.mathUtil.isEmpty(destValueColumn)) {
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
  srcEntityName: string,
  destEntityName: string,
  srcKeyColumn: string,
  srcValueColumn: string
) {
  //@ts-ignore
  if (!vds.viewModel.getMetaModule().isDataSourceExist(srcEntityName)) {
    throw new Error('来源实体不存在！srcEntityName=' + srcEntityName)
  }

  // 源记录集合
  //@ts-ignore
  let srcResult = vds.viewModel.getDataModule().getAllRecordsByDS(srcEntityName)

  if (srcResult == null || srcResult.length == 0) {
    //log.warn("要复制的源实体没有符合条件的记录！srcEntityName=" + srcEntityName);
  }
  //@ts-ignore
  if (!vds.viewModel.getMetaModule().isDataSourceExist(destEntityName)) {
    throw new Error('目标实体不存在！destEntityName=' + destEntityName)
  }

  if (srcResult != null && srcResult.length > 0) {
    vds.record = srcResult[0]
  }

  // 目标实体字段
  //@ts-ignore
  let srcFields: any[] = vds.viewModel
    .getMetaModule()
    .getMetadataFieldsByDS(srcEntityName)

  let insertRecords: any[] = []
  for (let i = 0; i < srcFields.length; i++) {
    //@ts-ignore
    let srcCode: string = vds.jsTool.getFieldName(srcFields[i].code)
    if (srcCode.toLowerCase() != 'id') {
      let insertRecord: Record<string, any> = vds.viewModel
        //@ts-ignore
        .getDataModule()
        .createEmptyRecordByDS(destEntityName, true)
      insertRecord.set(srcKeyColumn, srcCode)
      //@ts-ignore
      insertRecord.set(srcValueColumn, vds.record.get(srcCode))
      insertRecords.push(insertRecord)
    }
  }
  //@ts-ignore
  vds.viewModel.getDataModule().insertByDS(destEntityName, insertRecords)
}

export { main }
