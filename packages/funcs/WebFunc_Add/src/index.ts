import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { math }

var main = function () {
  if (arguments.length > 0) {
    var result = 0
    for (var i = 0, l = arguments.length; i < l; i++) {
      var tmpArg = arguments[i]
      if (undefined === tmpArg || null === tmpArg || tmpArg === '') {
        tmpArg = 0
      } else {
        try {
          result = Number(vds.math.add(result, tmpArg))
        } catch (e) {
          return NaN
        }
      }
    }
    return result
  } else {
    return NaN
  }
}

export { main }
