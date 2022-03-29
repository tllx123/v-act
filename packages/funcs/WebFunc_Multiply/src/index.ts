import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { math }

const main = function (...args: any[]) {
  argsLen = args ? args.length : 0

  if (argsLen > 0) {
    var result = 0
    for (var i = 0, argsLen; i < argsLen; i++) {
      var tmpArg = args[i]
      if (undefined === tmpArg || null === tmpArg || tmpArg === '') return 0
      else {
        if (i === 0) {
          result = tmpArg
          continue
        }

        try {
          result = Number(vds.math.multiply(result, tmpArg))
        } catch (e) {
          return NaN
        }
      }
    }

    return result
  } else return NaN
}
export { main }
