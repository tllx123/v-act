import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

const main = function (param) {
  let args = param.getArgs()
  if (args && args.length > 0) {
    let result = 0
    for (let i = 0, argLength = args.length; i < argLength; i++) {
      let tmpArg = args[i]
      if (undefined === tmpArg || null === tmpArg || tmpArg === '')
        //return NaN;
        tmpArg = 0
      else {
        try {
          result = Number(math.add(result, tmpArg))
        } catch (e) {
          return NaN
        }
      }
    }

    return result
  } else return NaN
}

export { main }
