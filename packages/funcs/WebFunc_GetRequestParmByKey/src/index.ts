import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { object }

var main = function (key, isDeCode) {
  //是否解码,默认解码
  if (vds.object.isUndefOrNull(isDeCode)) {
    isDeCode = false
  }
  var retStr = ''
  var url = window.document.location.href.toString()
  var u = url.split('?')
  var get = {}
  if (typeof u[1] == 'string') {
    u = u[1].split('&')
    for (var i = 0; i < u.length; i++) {
      var j = u[i].split('=')
      get[j[0]] = j[1]
    }
  }
  if (get.hasOwnProperty(key)) {
    var val = get[key]
    if (isDeCode && null != val) {
      retStr = decodeURIComponent(val)
    } else {
      retStr = val
    }
  }
  return retStr
}
export { main }
