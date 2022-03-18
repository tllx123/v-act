/**
 * 配置数据生成
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, expression, log, object, rpc, string }

interface keyIsString {
  [key: string]: any
}
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var inParams = ruleContext.getVplatformInput()

      var dataType = inParams['ResultDataType']
      var dataDetail = inParams['ResultDataDetail']
      var rootName = inParams['RootName']

      if (!dataType || '' == dataType) {
        vds.log.error(
          '[GenerateXMLOrJSON.main]生成数据格式未进行设置，请检查配置是否正确'
        )
        resolve()
        return false
      }

      if (
        !dataDetail ||
        dataDetail.length <= 0 ||
        !vds.object.isArray(dataDetail)
      ) {
        vds.log.error(
          '[GenerateXMLOrJSON.main]数据内容未进行设置，请检查配置是否正确'
        )
        resolve()
        return false
      }

      var datas = generateDatas(dataDetail, ruleContext)

      // 构建后台规则参数
      var inParamsObj: keyIsString = {}
      inParamsObj.dataType = dataType
      inParamsObj.datas = datas
      inParamsObj.rootName = rootName

      // 调用完活动集之后的回调方法
      var callback = function (responseObj: any) {
        var outputMessage = responseObj.OutputMessage
        // 设置业务返回值
        if (ruleContext.setResult) {
          ruleContext.setResult('Data', outputMessage)
        }
        resolve()
      }

      var sConfig = {
        command: 'CommonRule_GenerateXMLOrJSON',
        datas: [
          {
            code: 'InParams',
            type: 'char',
            value: vds.string.toJson(inParamsObj)
          }
        ],
        params: { isAsyn: true, ruleContext: ruleContext }
      }

      //调用后台活动集
      var promise = vds.rpc.callCommand(
        sConfig.command,
        sConfig.datas,
        sConfig.params
      )
      promise.then(callback).catch(reject)
    } catch (ex) {
      reject(ex)
    }
  })
}

/**
 * 生成配置数据内容
 * @param dataDetail 配置数据内容类源配置
 */
var generateDatas = function (dataDetail: any, ruleContext: any) {
  var datas = []
  for (var i = 0; i < dataDetail.length; i++) {
    var dataConfig = dataDetail[i]
    var elementNameSrc = dataConfig['ElementNameSrc']
    var elementValueSrcType = dataConfig['ElementValueSrcType'] + ''
    var elementValue = dataConfig['ElementValue']
    var scope = dataConfig['Scope'] + ''
    var spliceType = dataConfig['SpliceType'] + ''

    var data: keyIsString = {}
    data.elementName = vds.expression.execute(elementNameSrc, {
      ruleContext: ruleContext
    })
    data.elementScope = scope
    data.elementValue = ''
    data.elementSpliceType = spliceType

    switch (elementValueSrcType) {
      case '0':
        // 表达式
        data.elementValue = vds.expression.execute(elementValue, {
          ruleContext: ruleContext
        })
        break
      case '1':
        // 表字段
        data.elementValue = getElementValueFromTableColumn(elementValue, scope)
        break
      default:
        throw new Error(
          '[GenerateXMLOrJSON.generateDatas]元素值来源类型不存在:' +
            elementValueSrcType
        )
    }

    datas.push(data)
  }
  return datas
}

/**
 * 从表字段中获取
 * @param {string} tableColumn 表名.字段名
 * @param {string} scope 来源范围
 */
var getElementValueFromTableColumn = function (
  tableColumn: string,
  scope: string
) {
  if (tableColumn.indexOf('.') == -1) {
    throw new Error(
      '[GenerateXMLOrJSON.getElementValueFromTableColumn]来源表字段' +
        tableColumn +
        '格式不正确，应为表名.字段'
    )
  }
  var SCOPE_CURRENT = '0'
  var SCOPE_SELECTED = '1'
  var SCOPR_ALL = '2'

  // 按照取值返回获取的元素值，可能是单值，也可能是列表
  var elementValue: any = null

  var tableName = tableColumn.split('.')[0]
  var columnName = tableColumn.split('.')[1]

  switch (scope) {
    case SCOPE_CURRENT:
      var datasource = vds.ds.lookup(tableName)
      var record = datasource.getCurrentRecord()
      elementValue = record.get(columnName)
      break
    case SCOPE_SELECTED:
      // 选中行
      elementValue = []
      var datasource = vds.ds.lookup(tableName)
      var selRecords = datasource.getSelectedRecords().toArray()
      if (selRecords.length > 0) {
        for (var rIndex = 0; rIndex < selRecords.length; rIndex++) {
          var selRecord = selRecords[rIndex]
          var subElementValue = selRecord.get(columnName)
          elementValue.push(subElementValue)
        }
      }
      break
    case SCOPR_ALL:
      // 所有行
      var elementValue: any = []
      var datasource = vds.ds.lookup(tableName)
      var records = datasource.getAllRecords().toArray()
      for (var rIndex = 0; rIndex < records.length; rIndex++) {
        var record = records[rIndex]
        var subElementValue = record.get(columnName)
        elementValue.push(subElementValue)
      }
      break
    default:
      throw new Error(
        '[GenerateXMLOrJSON.getElementValueFromTableColumn]元素值来源范围不正确:' +
          scope
      )
  }

  return elementValue
}

export { main }
