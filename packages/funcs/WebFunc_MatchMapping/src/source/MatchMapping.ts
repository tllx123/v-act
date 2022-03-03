import * as viewModel from 'module'
import * as viewContext from 'module'
import * as stringUtil from 'module'

let undefined
let undefined
let undefined
exports.initModule = function () {}
/**
 *
 * @param {Object} insertDataSource 待插入的实体名称
 * @param {Object} destSourceName 待插入实体名称，目标数据的下拉框数据源
 * @param {Object} srcSourceName 待插入实体名称，源数据的下拉框数据源
 * @param {Object} fieldPairs 要求插入实体的名称列名必须和下拉框数据源名称的列同名，
 *      格式是字符串："destKeyField" : "11", //目标下拉框的key列的名称
 *               "destNameField" : "22", //目标下拉框的name列的名称
 *               "srcKeyField" : "11",  //源弹出框列的名称
 */
let main = function (
  insertDataSource,
  destSourceName,
  srcSourceName,
  fieldPairs
) {
  let records = viewModel.getDataModule().getAllRecordsByDS(destSourceName)
  let srcRecords = viewModel.getDataModule().getAllRecordsByDS(srcSourceName)
  let fieldPairsObj = parseFieldPairs(fieldPairs)
  let insertRecords = []
  for (let i = 0; i < records.length; i++) {
    let insertRecord = viewModel
      .getDataModule()
      .createEmptyRecordByDS(insertDataSource)
    let record = records[i]
    insertRecord.set(
      fieldPairsObj['destKeyField'],
      record.get(fieldPairsObj['destKeyField'])
    )
    insertRecord.set(
      fieldPairsObj['destNameField'],
      record.get(fieldPairsObj['destNameField'])
    )
    for (let j = 0; j < srcRecords.length; j++) {
      let srcRecord = srcRecords[j]
      if (
        srcRecord.get(fieldPairsObj['srcKeyField']) ===
        record.get(fieldPairsObj['destKeyField'])
      ) {
        insertRecord.set(
          fieldPairsObj['srcKeyField'],
          record.get(fieldPairsObj['destKeyField'])
        )
        break
      }
    }
    insertRecords.push(insertRecord)
  }
  viewModel
    .getDataModule()
    .insertByDS(insertDataSource, insertRecords, null, null, null)
}

let parseFieldPairs = function (fieldPairs) {
  if (
    stringUtil.isEmpty(fieldPairs) ||
    stringUtil.isEmpty(stringUtil.trim(fieldPairs))
  )
    throw new Error('MatchMapping函数fieldPairs不能为空,请检查配置')
  fieldPairs = stringUtil.trim(fieldPairs)
  let pairs = fieldPairs.split(',')
  if (pairs == null || pairs.length == 0)
    throw new Error('MatchMapping函数fieldPairs格式错误:' + fieldPairs)

  let cfgObj = {}
  for (let i = 0; i < pairs.length; i++) {
    let t = stringUtil.trim(pairs[i])
    if (stringUtil.isEmpty(t))
      throw new Error('MatchMapping函数fieldPairs格式错误:' + cfgStr)
    let tmps = t.split(':')
    if (tmps == null || tmps.length == 0 || tmps.length > 2)
      throw new Error(
        'MatchMapping函数fieldPairs格式错误中的[' + t + ']格式错误：' + cfgStr
      )
    let name = stringUtil.trim(tmps[0])
    let value = tmps.length == 2 ? tmps[1] : null
    cfgObj[name] = value
  }
  return cfgObj
}
export { main }
