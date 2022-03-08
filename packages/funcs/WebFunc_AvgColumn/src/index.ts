/**
 * 获取表的一列数据并且返回平均值
 *
 * @author tianwc
 * @param tableName
 *            表名
 * @param columnName
 *            列名
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
const vds = { object, math, string, exception, ds }

const main = function (dsName, columnName) {
  var datasource = null
  if (dsName == null) {
    throw vds.exception.newConfigException('实体名称不允许为空，请检查')
  }
  if (columnName == null) {
    throw vds.exception.newConfigException('实体字段名称不允许为空，请检查')
  }
  if (vds.ds.isDatasource(dsName)) {
    datasource = dsName
  } else {
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = vds.ds.lookup(dsName)
    } else {
      datasource = vds.expression.execute(dsName)
    }
  }
  if (!datasource) {
    vds.exception.newConfigException(
      '实体【' + dsName + '】不存在, 请检查配置！'
    )
  }
  var records = datasource.getAllRecords().toArray()
  var resultValue = 0.0
  var avgNum = 1
  if (null != records && records.length > 0) {
    for (var i = 0; i < records.length; i++) {
      var record = records[i]
      var temValue = record.get(columnName)
      if (vds.object.isUndefOrNull(temValue)) {
        temValue = 0
      }
      temValue = temValue * 1
      if (!vds.string.isEmpty(temValue)) {
        resultValue = resultValue + temValue
      } else {
        throw new Error('平均值列不是数字，请检查')
      }
    }
    avgNum = records.length
  }
  return vds.math.divide(resultValue, avgNum)
}
export { main }
