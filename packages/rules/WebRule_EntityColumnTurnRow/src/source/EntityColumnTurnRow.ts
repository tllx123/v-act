import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

// 主入口(必须有)
const main = function (ruleContext) {
  // 定义行列字段映射
  // var fieldMapping = [ {
  // "desc" : "productCode",
  // "src" : "productCode",
  // "isDyn" : false
  // }, {
  // "desc" : "itemCode",
  // "src" : "itemId",
  // "isDyn" : true
  // }, {
  // "desc" : "id",
  // "src" : "itemId",
  // "isDyn" : true
  // }, {
  // "desc" : "versionName",
  // "src" : "versionCode",
  // "isDyn" : false
  // }, {
  // "desc" : "planNum",
  // "src" : "planNum",
  // "isDyn" : true
  // }, {
  // "desc" : "processNum",
  // "src" : "patchsNum",
  // "isDyn" : true
  // } ];
  let cfgParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  let destName = cfgParams['destName']
  // 加载到的目标表名
  let sourceName = cfgParams['sourceName']
  let fieldMapping = cfgParams['fieldMapping']

  // 获取到来源表的字段结构信息
  let datasource = DatasourceManager.lookup({ datasourceName: sourceName })
  let metadata = datasource.getMetadata()
  let srcDataMete = metadata.getFields()

  // 去获来源表的数据，可以只获取修改过的
  let srcData = datasource.getAllRecords().toArray()

  // 计算出第一个动态列字段
  let firstDynField
  for (let i = 0; i < fieldMapping.length; i++) {
    if (fieldMapping[i].isDyn == true) {
      firstDynField = fieldMapping[i].src.split('.')[1]
      break
    }
  }
  // 计算出一行可以转换成多少列，通过正则表达式判断来源结构的原数据结尾的字段，并解算出转换列的前缀
  // cal one SrcDataRow can trans to how many desc Rows
  let transDataSize = 0
  let fieldPrefix = []
  let s = eval('/' + firstDynField + '$/i')
  for (let i = 0; i < srcDataMete.length; i++) {
    let srcField = srcDataMete[i].code
    if (s.test(srcField) && srcField != firstDynField) {
      fieldPrefix[transDataSize] = srcField.substring(
        0,
        srcField.length - firstDynField.length
      )
      transDataSize = transDataSize + 1
    }
  }
  // 转换处理，其实可以和目标数据生成合并，减少一次for
  let transedData = []
  let transedDataSize = 0
  for (let h = 0; h < srcData.length; h++) {
    let tempData = srcData[h]
    for (let i = 0; i < fieldPrefix.length; i++) {
      let row = []
      for (let j = 0; j < fieldMapping.length; j++) {
        if (fieldMapping[j].isDyn == true) {
          row[j] = tempData.get(
            fieldPrefix[i] + fieldMapping[j]['src'].split('.')[1]
          )
        } else {
          row[j] = tempData.get(fieldMapping[j]['src'].split('.')[1])
        }
      }
      transedData[transedDataSize] = row
      transedDataSize = transedDataSize + 1
    }
  }
  // 下面是将转换后的数据写到目标表中
  let insertRecords = []
  let destDatasource = DatasourceManager.lookup({ datasourceName: destName })
  for (let i = 0; i < transedData.length; i++) {
    let emptyRecord = destDatasource.createRecord()
    //					var emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(destName);
    for (let j = 0; j < fieldMapping.length; j++) {
      emptyRecord.set(fieldMapping[j].desc.split('.')[1], transedData[i][j])
    }
    insertRecords.push(emptyRecord)
  }
  if (insertRecords && insertRecords.length > 0) {
    destDatasource.insertRecords({ records: insertRecords })
    //					viewModel.getDataModule().insertByDS(destName,insertRecords, null, null, null);
  }
}
export { main }
