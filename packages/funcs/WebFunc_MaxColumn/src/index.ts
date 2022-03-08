/**
 * 获取表的一列数据并且返回最大值
 * @author tianwc
 * @param tableName 表名
 * @param columnName 列名
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { object, ds, exception, expression }

var main = function (tableName, columnName) {
  if (vds.object.isUndefOrNull(tableName)) {
    throw vds.exception.newConfigException('参数1-实体编码不能为空')
  }
  if (vds.object.isUndefOrNull(columnName)) {
    throw vds.exception.newConfigException('参数2-列编码不能为空')
  }
  //		var datasource = vds.ds.lookup(tableName);
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
  if (!datasource)
    throw vds.exception.newConfigException(
      '无法获取实体【' + tableName + '】, 请检查实体是否存在'
    )
  var records = datasource.getAllRecords()
  var resultValue = 0.0

  if (null != records && records.toArray().length > 0) {
    records = records.toArray()
    resultValue = records[0].get(columnName) * 1
    for (var i = 1; i < records.length; i++) {
      var record = records[i]
      var temValue = record.get(columnName) * 1
      var reg = /^(-?)[0-9]+(.[0-9]*)?$/

      if (reg.test(temValue)) {
        if (temValue * 1 > resultValue * 1) resultValue = temValue
      } else throw new Error('返回最大值列不是数字，请检查')
    }
  }
  return resultValue
}
export { main }
