/**
 * 从指定的界面实体获取选中行的个数 参数数量:1 参数1 表名 (字符串类型) 返回值为数据源的选中行的个数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
const vds = { object, ds }

var main = function (param) {
  var args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null

  if (vds.object.isUndefOrNull(dsName))
    throw new Error('界面实体名称不能为空，请检查')

  var datasource = vds.ds.lookup(dsName)
  var rs = datasource.getSelectedRecords().toArray() // 注意返回值对象有改变
  return rs.length
}
export { main }
