import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'

const vds = { math }

const main = function () {
  let args = arguments,
    argsLen = args ? args.length : 0

  if (argsLen > 0) {
    let result = 0
    for (let i = 0; i < argsLen; i++) {
      let tmpArg = args[i]
      if (undefined === tmpArg || null === tmpArg || tmpArg === '') return NaN
      else if (i > 0 && (tmpArg === '0' || tmpArg === 0)) return NaN
      else {
        if (i === 0) {
          result = tmpArg
          continue
        }

        try {
          result = Number(vds.math.divide(result, tmpArg, undefined))
        } catch (e) {
          return NaN
        }
      }
    }

    return result
  } else return NaN
}
export { main }
