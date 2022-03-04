import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    name = argsLen >= 1 ? args[0] : null,
    defaultVal = argsLen >= 2 ? args[1] : null
  let get_name = 'toone_v3_mobile_localStorage_itemName_' + name

  if (stringUtil.isEmpty(name)) throw new Error('传入cookie名称为空，请检查')
  if (mathUtil.isEmpty(defaultVal))
    throw new Error('传入cookie值的默认值为空，请检查')

  let cookieVal = window.localStorage
    ? localStorage.getItem(get_name)
    : Cookie.read(get_name)

  if (mathUtil.isEmpty(cookieVal)) return defaultVal

  return cookieVal
}

export { main }
