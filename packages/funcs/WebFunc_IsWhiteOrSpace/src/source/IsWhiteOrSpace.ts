import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(str)) {
    if (str === null) return true
    else throw new Error('传入参数不存在，请检查!')
  } else {
    //替换掉前后空格
    str = stringUtil.ltrim(stringUtil.rtrim(String(str)))
    if (str.length > 0) return false
    else return true
  }
}

export { main }
