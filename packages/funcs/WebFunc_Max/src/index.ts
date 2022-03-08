/**
 *	求两数最大值
 *  代码示例:Max(3,5)返回值为5
 *  参数数量:2
 *  参数1--比较值1(小数类型),参数2--比较值2(小数类型)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

/**
 * 判断是否数字(非正则表达式方法)
 */
var judgeNumExt = function (arg) {
  if (arg == null || typeof arg == 'undefined' || arg === '') {
    return false
  }

  var result = new Number(arg).toString()
  return result.toUpperCase() == 'NAN' ? false : true
}
const main = function (arg1, arg2) {
  if (vds.object.isUndefOrNull(arg1) || vds.object.isUndefOrNull(arg2))
    throw new Error('求两数最大值函数参数为空，请检查')
  if (!judgeNumExt(arg1) || !judgeNumExt(arg2))
    throw new Error('求两数最大值函数参数不是数字，请检查')

  return vds.math.max(arg1, arg2)
}
export { main }
