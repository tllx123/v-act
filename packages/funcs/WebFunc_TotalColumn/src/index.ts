/**
 * 获取表的一列数据并且返回汇总值
 * @author tianwc
 * @param tableName 表名
 * @param columnName 列名
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { object, string, ds, exception, expression }

const main = function (dsName, columnName) {
  if (dsName == null)
    throw vds.exception.newConfigException('实体名称不允许为空，请检查')
  if (columnName == null)
    throw vds.exception.newConfigException('实体字段名称不允许为空，请检查')
  var datasource = null
  if (vds.ds.isDatasource(dsName)) {
    datasource = dsName
  } else {
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = vds.ds.lookup(dsName)
    } else {
      datasource = vds.expression.execute(dsName)
    }
  }
  if (!datasource)
    throw vds.exception.newConfigException(
      '无法获取实体【' + dsName + '】, 请检查实体是否存在'
    )
  var records = datasource.getAllRecords()
  var resultValue = 0.0
  if (null != records && records.toArray().length > 0) {
    records = records.toArray()
    for (var i = 0; i < records.length; i++) {
      var record = records[i]
      var temValue = record.get(columnName) * 1
      //var reg = /^(-?)[0-9]+(.[0-9]*)?$/;
      if (
        !vds.string.isEmpty(temValue) &&
        vds.object.isNumber(temValue) &&
        !isNaN(temValue)
      ) {
        // 处理js浮点问题
        resultValue = calculatorSum(resultValue, temValue)
      } else {
        //不是数字型值的不处理
        continue
      }
    }
  }
  return resultValue
}
var calculatorSum = function (num1, num2) {
  var multiplier1 = multiplier(num1) * 1,
    multiplier2 = multiplier(num2) * 1,
    multiplierTmp = multiplier1 > multiplier2 ? multiplier1 : multiplier2

  return (num1 * multiplierTmp + num2 * multiplierTmp) / multiplierTmp
}

var multiplier = function (num) {
  num = Number(num) + ''
  var position = num.indexOf('.') + 1,
    len = num.length
  for (var result = '1', tmpLen = len - position, i = 0; i < tmpLen; i++) {
    result += '0'
  }
  return result
}
export { main }
