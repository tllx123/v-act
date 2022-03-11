/**
 *	检查字符串是否仅为空白字符组成
 *  代码示例:IsWhiteorSpace('   ') 返回值为 true
 *  参数数量:1
 *  参数1(字符串类型)
 *  返回值为布尔类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { object, string }

const main = function (str: string) {
  if (vds.object.isUndefOrNull(str)) {
    if (str === null) return true
    else throw new Error('传入参数不存在，请检查!')
  } else {
    //替换掉前后空格
    str = vds.string.ltrim(vds.string.rtrim(String(str)))
    if (str.length > 0) return false
    else return true
  }
}
export { main }
