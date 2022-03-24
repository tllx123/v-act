/**
 *
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

var toChinese = function (data: any) {
  if (vds.object.isUndefOrNull(data)) return ''

  data = data.replace(/\\/g, '%')
  var retVal = unescape(data)
  return retVal
}
const main = function (arg1: any) {
  if (vds.object.isUndefOrNull(arg1)) return ''

  arg1 = String(arg1)
  var retVal = toChinese(arg1)
  return retVal
}
export { main }
