/**
 * 删除cookie
 */
import * as cookie from '@v-act/vjs.framework.extension.platform.services.integration.vds.cookie'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { cookie, object, exception }

var main = function (name, path, domain) {
  if (vds.object.isUndefOrNull(name))
    throw vds.exception.newConfigException('传入cookie名称为空，请检查')

  try {
    var options = {
      path: path,
      domain: domain
    }
    // 可选。cookie服务器路径
    vds.cookie.remove(name, null, options)

    return true
  } catch (e) {
    return false
  }
}
export { main }
