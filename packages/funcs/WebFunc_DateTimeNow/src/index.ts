/**
 * 时间日期(返回当前的时间日期) 代码示例:DateTimeNow()返回值为{2011-10-19 12:03:44} 无参数 返回值为日期类型
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
const vds = { rpc, date }

const main = function () {
  var value = vds.date.format(vds.rpc.getDate(), 'yyyy-MM-dd HH:mm:ss')
  return value
}
export { main }
