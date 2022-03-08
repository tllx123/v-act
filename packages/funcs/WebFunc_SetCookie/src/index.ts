/**
 * 设置cookie
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as cookie from '@v-act/vjs.framework.extension.platform.services.integration.vds.cookie'
const vds = { object, exception, cookie }

const main = function (
  CookieName,
  CookieValue,
  Expires,
  Path,
  Domain,
  Secure,
  HttpOnly
) {
  CookieName = vds.object.isUndefOrNull(CookieName) ? null : CookieName // 必需。cookie名称。
  CookieValue = vds.object.isUndefOrNull(CookieValue) ? null : CookieValue // 必需。cookie值。
  Expires = vds.object.isUndefOrNull(Expires) ? '2500-01-01 00:00:00' : Expires // 可选。cookie有效期。
  Path = vds.object.isUndefOrNull(Path) ? '/' : Path // 可选。 cookie服务器路径
  Domain = vds.object.isUndefOrNull(Domain) ? null : Domain // 可选。cookie域名。
  Secure = vds.object.isUndefOrNull(Secure) ? false : Secure // 可选。是否通过安全的HTTPS 连接来传输cookie。值cookie是否仅通过安全的https,值为0或1，如果值为1，则cookie只能在https连接上有效，默认值为0，表示cookei在http和https连接上都有效。
  HttpOnly = vds.object.isUndefOrNull(HttpOnly) ? true : HttpOnly // 可选。指定Cookie是否可以通过客户端脚本访问

  if (vds.object.isUndefOrNull(CookieName))
    throw vds.exception.newConfigException('cookie名称为空，请检查！')
  if (vds.object.isUndefOrNull(CookieValue))
    throw vds.exception.newConfigException('cookie值为空，请检查')

  try {
    var options = {}

    // 兼容处理IE日期转换报错
    if (Expires) Expires = Expires.replace(new RegExp(/-/gm), '/')

    options.expires = new Date(Expires) //cookie有效期。

    // 可选。cookie服务器路径
    if (Path != null) {
      options.path = Path
    }
    // 可选。cookie域名。
    if (Domain != null) {
      options.domain = Domain
    }
    // 可选。是否通过安全的 HTTPS
    if (typeof Secure == 'string')
      Secure = Secure.toLowerCase() == 'true' ? true : false

    if (typeof Secure == 'number') Secure = Secure == 1

    if (Secure != null) {
      options.secure = Secure
    }
    // 可选。指定Cookie是否可以通过客户端脚本访问
    if (typeof HttpOnly == 'string')
      HttpOnly = HttpOnly.toLowerCase() == 'true' ? true : false

    if (typeof HttpOnly == 'number') HttpOnly = HttpOnly == 1

    if (HttpOnly != null) {
      options.HttpOnly = HttpOnly
    }

    vds.cookie.set(CookieName, CookieValue, options)
    return true
  } catch (e) {
    return false
  }
}
export { main }
