import { cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs()

  let argsLen = args ? args.length : 0

  let CookieName = argsLen >= 1 ? args[0] : null // 必需。cookie名称。
  let CookieValue = argsLen >= 2 ? args[1] : null // 必需。cookie值。
  let Expires = argsLen >= 3 ? args[2] : '2500-01-01 00:00:00' // 可选。cookie有效期。
  let Path = argsLen >= 4 ? args[3] : '/' // 可选。 cookie服务器路径
  let Domain = argsLen >= 5 ? args[4] : null // 可选。cookie域名。
  let Secure = argsLen >= 6 ? args[5] : false // 可选。是否通过安全的HTTPS 连接来传输cookie。值cookie是否仅通过安全的https,值为0或1，如果值为1，则cookie只能在https连接上有效，默认值为0，表示cookei在http和https连接上都有效。
  let HttpOnly = argsLen >= 7 ? args[6] : true // 可选。指定Cookie是否可以通过客户端脚本访问

  if (stringUtil.isEmpty(CookieName)) throw new Error('cookie名称为空，请检查')
  if (mathUtil.isEmpty(CookieValue)) throw new Error('cookie值为空，请检查')

  //console.log(args);

  try {
    let options = {}

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

    cookieUtil.vcookie({
      name: CookieName,
      value: CookieValue,
      options: options
    })
    return true
  } catch (e) {
    return false
  }
}

export { main }
