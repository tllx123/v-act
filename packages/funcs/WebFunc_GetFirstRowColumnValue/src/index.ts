/**
 * 获取变量实体中第一行的字段值
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { ds, exception, expression }

const main = function (dsName, columnCode) {
  if (!dsName) {
    throw vds.exception.newConfigException('参数1实体变量不能为空')
  }
  if (!columnCode) {
    throw vds.exception.newConfigException('参数2字段名称不能为空')
  }
  var datasource
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
  var records = datasource.getAllRecords().toArray()
  if (!records || records.length <= 0) return null
  var firstRow = records[0]
  var columnValue = firstRow.get(columnCode)
  return columnValue
}
export { main }
