import * as stringUtil from '@v-act/vjs.framework.extension.util.string'
import * as viewModel from '@v-act/vjs.framework.extension.platform.services.viewModel'

export function initModule() {}

//主入口(必须有)
const main = function (str:string, separator:string, tableName:string, columnName:string) {
  if (stringUtil.isEmpty(str)) {
    throw new Error('字串不允许为空，请检查')
  }
  if (stringUtil.isEmpty(separator)) {
    throw new Error('分隔符不允许为空，请检查')
  }
  if (stringUtil.isEmpty(tableName)) {
    throw new Error('实体名称不允许为空，请检查')
  }
  if (stringUtil.isEmpty(columnName)) {
    throw new Error('实体的字段名称不允许为空，请检查')
  }
  let strArr = stringUtil.split(str, separator)
  let metadataFields = viewModel
    .getMetaModule()
    .getMetadataFieldsByDS(tableName)

  let flag = false
  for (let m = 0; m < metadataFields.length; m++) {
    let field = metadataFields[m]['code']
    if (field === columnName) {
      flag = true
    }
  }
  if (flag == false) {
    throw new Error('实体中不存在该字段名称，请检查')
  }

  let insertRecords = []
  for (let i = 0; i < strArr.length; i++) {
    let emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(tableName)
    emptyRecord.set(columnName, strArr[i])
    insertRecords.push(emptyRecord)
  }
  if (insertRecords.length > 0) {
    viewModel
      .getDataModule()
      .insertByDS(tableName, insertRecords, null, null, '1')
  }
}
export { main }
