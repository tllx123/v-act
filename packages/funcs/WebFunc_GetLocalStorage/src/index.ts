/**
 * 获取cookie值(从客户端获取cookie值)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

const main = function (name: string, defaultVal: string) {
  var get_name = 'toone_v3_mobile_localStorage_itemName_' + name

  //@ts-ignore
  if (vds.object.isUndefOrNull(name))
    throw new Error('传入cookie名称为空，请检查')
  //@ts-ignore
  if (vds.object.isUndefOrNull(defaultVal))
    throw new Error('传入cookie值的默认值为空，请检查')

  var cookieVal = window.localStorage ? localStorage.getItem(get_name) : null //Cookie.read(get_name);
  //@ts-ignore
  if (vds.object.isUndefOrNull(cookieVal)) return defaultVal

  return cookieVal
}
export { main }
