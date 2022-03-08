import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { math }

const main = function () {
  var args = arguments,
    argsLen = args ? args.length : 0

  if (argsLen > 0) {
    var result = 0
    for (var i = 0; i < argsLen; i++) {
      var tmpArg = args[i]
      if (undefined === tmpArg || null === tmpArg || tmpArg === '') return NaN
      else {
        if (i === 0) {
          result = tmpArg
          continue
        }

        try {
          result = Number(vds.math.subtract(result, tmpArg))
        } catch (e) {
          return NaN
        }
      }
    }

    return result
  } else return NaN
}
export { main }
