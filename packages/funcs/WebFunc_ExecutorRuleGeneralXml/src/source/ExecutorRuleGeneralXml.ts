import * as viewModel from 'module'

/**
 * 主入口
 * @param type 类型(USER,ROLE,METHOD)
 * @param ruleChainId 规则ID
 * @param tableName 业务表名称
 * @param columnName 业务表字段名
 */
const main = function (
  type: string,
  ruleChainId: string,
  tableName: string,
  columnName: string,
  ruleName: string
) {
  if (typeof type == 'undefined' || type === '' || type === null) {
    throw new Error('[ExecutorRuleGeneralXml.main]入参type不允许为空')
  }
  if (
    typeof ruleChainId == 'undefined' ||
    ruleChainId === '' ||
    ruleChainId === null
  ) {
    throw new Error('[ExecutorRuleGeneralXml.main]入参ruleChainId不允许为空')
  }
  if (
    typeof tableName == 'undefined' ||
    tableName === '' ||
    tableName === null
  ) {
    throw new Error('[ExecutorRuleGeneralXml.main]入参tableName不允许为空')
  }
  if (
    typeof columnName == 'undefined' ||
    columnName === '' ||
    columnName === null
  ) {
    throw new Error('[ExecutorRuleGeneralXml.main]入参columnName不允许为空')
  }
  if (typeof ruleName == 'undefined' || ruleName === '' || ruleName === null) {
    throw new Error('[ExecutorRuleGeneralXml.main]入参ruleName不允许为空')
  }

  let records = viewModel.getDataModule().getAllRecordsByDS(tableName)
  let configValues = []

  if (null != records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      configValues.push(record.get(columnName))
    }
  }

  let xml =
    '<actionConfig><rulechain><evaluate id="' +
    ruleChainId +
    '"/></rulechain>' +
    '<ruleInstances><ruleInstance><instanceId>' +
    ruleChainId +
    '</instanceId>' +
    '<ruleName>' +
    ruleName +
    '</ruleName><condition/><ruleConfig>' +
    '<![CDATA[{"Config":'

  if (type == 'USER') {
    xml += '{ "USER" : ['
    for (let index = 0; index < configValues.length; index++) {
      let configValue = configValues[index]
      if (index > 0) {
        xml += ','
      }
      xml += '"' + configValue + '"'
    }
    xml += ']}'
  } else if (type == 'ROLE') {
    xml += '{ "ROLE" : ['
    for (let index = 0; index < configValues.length; index++) {
      let configValue = configValues[index]
      if (index > 0) {
        xml += ','
      }
      xml += '"' + configValue + '"'
    }
    xml += ']}'
  } else if (type == 'METHOD') {
    xml += '{"METHOD" : '
    if (configValues.length > 0) {
      xml += configValues[0]
    } else {
      xml += 'null'
    }
    xml += '}'
  }

  xml += '}]]></ruleConfig></ruleInstance></ruleInstances></actionConfig>'

  return xml
}

export { main }
