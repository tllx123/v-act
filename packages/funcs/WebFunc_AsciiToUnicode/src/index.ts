/**
 *
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { object }

function toUnicode(data) {
  if (vds.object.isUndefOrNull(data)) return ''

  var retVal = ''
  for (var i = 0; i < data.length; i++) {
    retVal += '&#' + data.charCodeAt(i) + ';'
  }
  return retVal
}
var main = function () {
  var argsLen = arguments.length
  var arg1 = argsLen >= 1 ? arguments[0] : null

  if (vds.object.isUndefOrNull(arg1)) return ''

  arg1 = String(arg1)
  var retVal = toUnicode(arg1)
  return retVal
}
export { main }
