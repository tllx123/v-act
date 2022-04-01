/**
 *	检查是否为空值
 *  代码示例:IsEmpty('abcd') 返回值为 false
 *  参数数量:1
 *  参数1(字符串类型)
 *  返回值为布尔类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

const main = function (...args: any[]) {
  const argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  return vds.object.isUndefOrNull(str)
}
export { main }
