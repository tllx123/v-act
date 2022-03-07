import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0

  if (argsLen > 0) {
    let result = 0
    for (let i = 0, argsLen; i < argsLen; i++) {
      let tmpArg = args[i]
      if (undefined === tmpArg || null === tmpArg || tmpArg === '') return 0
      else {
        if (i === 0) {
          result = tmpArg
          continue
        }

        try {
          result = Number(math.multiply(result, tmpArg))
        } catch (e) {
          return NaN
        }
      }
    }

    return result
  } else return NaN
}

export { main }
