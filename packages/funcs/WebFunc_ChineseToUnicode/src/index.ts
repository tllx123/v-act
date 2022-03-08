/**
 *
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { object }

var toUnicode = function (data) {
  if (vds.object.isUndefOrNull(data)) return ''
  var res = []
  for (var i = 0; i < data.length; i++) {
    res[i] = ('00' + data.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')
}
var main = function (arg1) {
  if (vds.object.isUndefOrNull(arg1)) return ''

  arg1 = String(arg1)
  var retVal = toUnicode(arg1)
  return retVal
}
export { main }
