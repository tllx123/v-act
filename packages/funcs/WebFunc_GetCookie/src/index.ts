import * as cookie from '@v-act/vjs.framework.extension.platform.services.integration.vds.cookie'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
/**
 * 获取cookie值(从客户端获取cookie值)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object, exception, cookie }

const main = function (name, defaultVal) {
  if (vds.object.isUndefOrNull(name))
    throw vds.exception.newConfigException('传入cookie名称为空，请检查')
  if (vds.object.isUndefOrNull(defaultVal))
    throw vds.exception.newConfigException('传入cookie值的默认值为空，请检查')

  var cookieVal = vds.cookie.get(name)

  if (vds.object.isUndefOrNull(cookieVal)) return defaultVal

  return cookieVal
}
export { main }
