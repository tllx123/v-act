import { cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    name = argsLen >= 1 ? args[0] : null,
    defaultVal = argsLen >= 2 ? args[1] : null

  if (stringUtil.isEmpty(name)) throw new Error('传入cookie名称为空，请检查')
  if (mathUtil.isEmpty(defaultVal))
    throw new Error('传入cookie值的默认值为空，请检查')

  let cookieVal = cookieUtil.vcookie({
    name: name
  })

  if (mathUtil.isEmpty(cookieVal)) return defaultVal

  return cookieVal
}

export { main }
