/**
 * 根据输入格式获取日期时间(获取当前时间,返回指定格式的时间字符串) 参数数量:1 参数1 格式串(字符串类型) 参数2 想转换的时间(时间类型) 返回符合格式的日期时间(字符串类型)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { object, date, string }

const main = function (fromatStr, dateStr) {
  if (vds.object.isUndefOrNull(fromatStr)) return ''
  if (vds.string.isEmpty(dateStr) || typeof dateStr != 'string') return null

  if (typeof dateStr == 'string') {
    var reg = /^(\d{1,2}):(\d{1,2})$/
    var r = dateStr.match(reg)
    if (r == null) dateStr = vds.date.valueOf(dateStr)
    else {
      dateStr = new Date()
      dateStr.setHours(r[1])
      dateStr.setMinutes(r[2])
    }
  }

  try {
    var value = vds.date.format(dateStr, fromatStr)
    return value
  } catch (e) {
    throw new Error('提供的格式串无法格式，请检查')
  }
}
export { main }
