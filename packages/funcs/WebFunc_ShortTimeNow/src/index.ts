/**
 * 短时间(返回当前时间的短时间格式) 代码示例:ShortTimeNow()返回值为{12:05} 无参数 返回值为日期类型
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
const vds = { rpc, date }

var main = function () {
  var value = vds.date.format(vds.rpc.getDate(), 'HH:mm')
  return value
}
export { main }
