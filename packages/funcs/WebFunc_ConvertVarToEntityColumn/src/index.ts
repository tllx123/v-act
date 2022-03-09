/**
 * 字符串数据转成实体记录
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { exception, ds, log, expression }

const main = function (sourceValue, entityCode, fieldCode, separate) {
  //获取参数示例：
  if (undefined == sourceValue || null == sourceValue || sourceValue == '') {
    vds.log.log('来源字符串为空，不做处理！')
    return false
  }
  //获取实体对象
  var datasource
  if (vds.ds.isDatasource(entityCode)) {
    datasource = entityCode
  } else {
    if (entityCode.indexOf('.') == -1 && entityCode.indexOf('@') == -1) {
      datasource = vds.ds.lookup(entityCode)
    } else {
      datasource = vds.expression.execute(entityCode)
    }
  }
  if (!datasource) {
    throw vds.exception.newConfigException(
      '实体【' + entityCode + '】不存在，请检查配置.'
    )
  }
  var records = []
  var singleItem = sourceValue.split(separate)
  for (var i = 0; i < singleItem.length; i++) {
    var emptyRecord = datasource.createRecord()
    emptyRecord.set(fieldCode, singleItem[i])
    records.push(emptyRecord)
  }
  datasource.insertRecords(records)
}
export { main }
