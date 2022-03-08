import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

const main = function (param: FunctionContext) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg1)) return ''

  arg1 = String(arg1)
  let retVal = toAscii(arg1)
  return retVal
}

function toAscii(data: string) {
  if (mathUtil.isEmpty(data)) return ''
  let code = data.match(/&#(\d+);/g)
  let retVal = ''
  if (code !== null) {
    for (let i = 0; i < code.length; i++) {
      //@ts-ignore
      retVal += String.fromCharCode(code[i].replace(/[&#;]/g, ''))
    }
  }
  return retVal
}

export { main }
