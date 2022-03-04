import { Math as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

let main = function (param: FunctionContext) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(str)) return ''
  else {
    //替换掉前空格
    str = String(str)
    return stringUtil.ltrim(str)
  }
}

export { main }
