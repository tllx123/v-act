import * as log from 'module'
import * as viewModel from 'module'
import * as viewContext from 'module'
import * as operationLib from 'module'
let undefined
let undefined
let undefined
let undefined
exports.initModule = function () {}
/**
 * 主入口
 * @param type 类型(USER,ROLE,METHOD)
 * @param ruleChainId 规则ID
 * @param tableName 业务表名称
 * @param columnName 业务表字段名
 */
let main = function (type, ruleChainId, tableName, columnName) {
  //alert('cccccccccc')
  //从DB中取值业务表中的ID
  let records = viewModel.getDataModule().getAllRecordsByDS(tableName)
  let busID = new Array()
  if (null != records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      busID[i] = '"' + record.get(columnName) + '"'
    }
  }

  busID.join(',')

  let xml =
    '<root><rulechain><evaluate id="' +
    ruleChainId +
    '"/></rulechain>' +
    '<ruleInstances><ruleInstance><instanceId>' +
    ruleChainId +
    '</instanceId>' +
    '<ruleName>FindActivityExecutor</ruleName><condition/><ruleConfig>' +
    '<![CDATA[{"Config":'

  if (type == 'USER') {
    xml += '{"USER":[' + busID + ']}'
  }

  if (type == 'ROLE') {
    xml += '{"ROLE":[' + busID + ']}'
  }

  if (type == 'METHOD') {
    xml += '{"METHOD":[' + busID + ']}'
  }

  xml += '}]]></ruleConfig></ruleInstance></ruleInstances></root>'
  //alert(xml)
  return xml
}

export { main }
