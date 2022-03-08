/**
 * 从指定的界面实体获取当前记录的某字段数值(从指定的界面实体获取当前记录的字段值) 参数数量:2 参数1 表名称(字符串类型) 参数2 字段名称(字符串类型) 返回值为任意类型
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { ds, exception, log, expression }

var main = function (dsName, fieldName) {
  var datasource = null
  if (dsName == null)
    throw vds.exception.newConfigException('实体名称不允许为空，请检查')
  if (fieldName == null)
    throw vds.exception.newConfigException('实体字段名称不允许为空，请检查')
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
    throw vds.exception.newConfigException('实体【' + dsName + '】不存在！')
  var record = datasource.getCurrentRecord()
  if (!record) return null

  var recValue = record.get(fieldName)
  if (undefined == recValue || recValue.length == 0) {
    vds.log.log('获取当前记录的某字段值函数当前记录某字段的值为空，请检查')
    return null
  }

  return recValue
}
export { main }
