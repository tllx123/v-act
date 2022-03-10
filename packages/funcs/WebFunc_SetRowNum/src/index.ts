/**
 *
 *
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
const vds = { ds, exception, expression,log }

const main = function (dsName:string, columnName:string) {
  //...
  //根据参数实现函数处理逻辑
  //todo:
  var records
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
  if (!datasource) throw new Error('实体【' + dsName + '】不存在.')
  records = datasource.getAllRecords()
  var fields = records.getMetadata().getFields()
  var isExists = false
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i]
    if (columnName == field.getCode()) {
      isExists = true
    }
  }
  if (isExists) {
    if (null != records && records.toArray().length > 0) {
      records = records.toArray()
      for (var i = 0; i < records.length; i++) {
        var record = records[i]
        //				var id = record.get("id");
        //				var rownum = datasource.getIndexById(id);
        var rownum = i
        record.set(columnName, rownum + 1)
      }
      datasource.updateRecords(records)
    } else {
      vds.log.warn('目标实体【' + dsName + '】没有数据，已忽略赋值')
    }
  }
}
export { main }
