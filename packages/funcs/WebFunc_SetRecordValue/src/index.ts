/**
 *
 *
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { ds, expression, exception }

var main = function (tableName, index, fields, values) {
  if (tableName == null || tableName == '')
    throw vds.exception.newConfigException(
      '函数[SetRecordValue]：第一个参数不能为空'
    )
  if (index == null || index == '')
    throw vds.exception.newConfigException(
      '函数[SetRecordValue]：第二个参数不能为空'
    )
  if (fields == null)
    throw vds.exception.newConfigException(
      '函数[SetRecordValue]：第三个参数不能为空'
    )
  if (values == null)
    throw vds.exception.newConfigException(
      '函数[SetRecordValue]：第四个参数不能为空'
    )
  if (fields.length != values.length)
    throw vds.exception.newConfigException(
      '函数[SetRecordValue]：第三个参数的长度和第四个参数的长度不一致。\n第三个参数的长度：' +
        fields.length +
        ',第四个参数的长度：' +
        values.length
    )

  //获取数据源
  var datasource = null
  //获取数据源
  if (vds.ds.isDatasource(tableName)) {
    datasource = tableName
  } else {
    if (tableName.indexOf('.') == -1 && tableName.indexOf('@') == -1) {
      datasource = vds.ds.lookup(tableName)
    } else {
      datasource = vds.expression.execute(tableName)
    }
  }
  //获取指定行记录
  var record = datasource.getRecordById(index)

  //给指定行赋值
  if (undefined != record && null != record) {
    for (var columnIndex = 0; columnIndex < fields.length; columnIndex++) {
      var destFieldName = fields[columnIndex]
      var srcVal = values[columnIndex]
      record.set(destFieldName, srcVal)
    }
    datasource.updateRecords([record])
  }
  return null
}
export { main }
