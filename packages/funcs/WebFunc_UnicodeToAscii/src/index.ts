/**
 *
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

var toAscii = function (data: any) {
  if (vds.object.isUndefOrNull(data)) return ''

  var code = data.match(/&#(\d+);/g)
  if (!code) {
    return ''
  }
  var retVal = ''
  for (var i = 0; i < code.length; i++) {
    retVal += String.fromCharCode(code[i].replace(/[&#;]/g, ''))
  }
  return retVal
}
const main = function (arg1: any) {
  if (vds.object.isUndefOrNull(arg1)) return ''

  arg1 = String(arg1)
  var retVal = toAscii(arg1)
  return retVal
}
export { main }
