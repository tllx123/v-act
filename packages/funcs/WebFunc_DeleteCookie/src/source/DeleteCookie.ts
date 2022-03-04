import { cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    name = argsLen >= 1 ? args[0] : null

  if (stringUtil.isEmpty(name)) throw new Error('传入cookie名称为空，请检查')

  try {
    cookieUtil.vcookie({
      name: name,
      value: null
    })
    return true
  } catch (e) {
    return false
  }
}

export { main }
