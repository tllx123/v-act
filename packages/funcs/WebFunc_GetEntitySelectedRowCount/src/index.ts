/**
 * 从指定的界面实体获取记录数 参数数量:1 参数1 实体编码 (字符串类型) 返回值为整数类型
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { ds, exception }

const main = function (dsName) {
  if (dsName == null)
    throw vds.exception.newConfigException('实体名称不允许为空，请检查')
  var datasource = vds.ds.lookup(dsName)
  if (!datasource)
    throw vds.exception.newConfigException(
      '无法获取实体【' + dsName + '】, 请检查实体是否存在'
    )
  var selectedRecords = datasource.getSelectedRecords().toArray()
  return selectedRecords.length
}
export { main }
