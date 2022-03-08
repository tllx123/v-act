/**
 *	比较两个字符串是否一致。
 *  代码示例:Compare('abcd','aBcD',true) 返回值为true
 *  参数数量:3
 *  参数1(字符串类型)，参数2(字符串类型)，参数3(布尔类型)
 *  isSubOrSup：true表示区分大小写false表示不区分大小写
 *  返回值为布尔类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { object, string }

var main = function (firstStr, secondStr, isSubOrSup) {
  if (firstStr === null) firstStr = ''

  firstStr = firstStr + ''
  if (secondStr === null) secondStr = ''

  secondStr = secondStr + ''
  if (vds.object.isUndefOrNull(firstStr)) {
    throw new Error('字符串比较时第一个参数为空，请检查')
  }
  if (vds.object.isUndefOrNull(secondStr))
    throw new Error('字符串比较时第二个参数为空，请检查')

  if (typeof isSubOrSup != 'boolean')
    throw new Error('字符串比较时第三个参数不是布尔型，请检查')

  if (isSubOrSup) {
    //如果不区分大小写则都转换为小写再比较
    firstStr = vds.string.toLowerCase(firstStr)
    secondStr = vds.string.toLowerCase(secondStr)
  }

  return firstStr == secondStr
}
export { main }
