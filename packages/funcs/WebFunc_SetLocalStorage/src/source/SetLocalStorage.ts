import { cookieUtil as cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    name = argsLen >= 1 ? args[0] : null,
    value = argsLen >= 2 ? args[1] : null
  let set_name = 'toone_v3_mobile_localStorage_itemName_' + name

  if (stringUtil.isEmpty(name)) throw new Error('cookie名称为空，请检查')
  if (mathUtil.isEmpty(value)) throw new Error('cookie值为空，请检查')
  try {
    if (window.localStorage) {
      localStorage.setItem(set_name, value)
    } else {
      Cookie.write(set_name, value)
    }
    return true
  } catch (e) {
    return false
  }
}

export { main }
