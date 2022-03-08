/**
 *	随机数（返回指定区间随机数，并保留精度）
 *  代码示例:Random(1.5,2.5,3)返回值为1.508
 *  参数数量:3
 *  参数1--随机区域的最小值(小数类型),参数2--随机区域的最大值(小数类型),参数3--返回值保留的小数位数(整数)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

var main = function (min, max, fixed) {
  if (!vds.object.isUndefOrNull(max)) {
    if (!vds.object.isNumber(max))
      throw new Error('随机数函数的随机区域的最大值不是数字，请检查')
  }
  if (!vds.object.isUndefOrNull(min)) {
    if (!vds.object.isNumber(min))
      throw new Error('随机数函数的随机区域的最大值不是数字，请检查')
  }
  if (!vds.object.isUndefOrNull(fixed)) {
    if (!vds.number.isInteger(fixed) || fixed < 0)
      throw new Error('随机数函数的返回值保留的小数位不是非负整数，请检查')
  }

  // 0 ~ 1 之间的随机数。
  var randomNum = vds.math.random()
  var num
  // 最大值、最小值存在条件
  if (!vds.object.isUndefOrNull(min) && !vds.object.isUndefOrNull(max)) {
    if (min == max) return min
    if (min > max)
      throw new Error('随机数函数的随机区域最大值小于最小值，请检查')

    //(max - min) * randomNum + min
    var n1 = vds.math.subtract(max, min)
    var n2 = vds.math.multiply(n1, randomNum)
    num = vds.math.add(min, n2)
  } else if (vds.object.isUndefOrNull(min) && !vds.object.isUndefOrNull(max)) {
    //max - max * randomNum
    var n3 = vds.math.multiply(max, randomNum)
    num = vds.math.subtract(max, n3)
  } else if (!vds.object.isUndefOrNull(min) && vds.object.isUndefOrNull(max)) {
    //min + min * randomNum
    var n4 = vds.math.multiply(min, randomNum)
    num = vds.math.subtract(min, n4)
  } else throw new Error('随机数函数的随机区域的最大值与最小值都为空，请检查')

  if (!vds.object.isUndefOrNull(fixed)) {
    var ret = vds.number.toFloorFixed(num, fixed)
    ret = ret * 1
    if (fixed == 0) {
      if (
        vds.number.isInteger(min) &&
        vds.number.isInteger(max) &&
        max - min == 1
      )
        return randomNum < 0.5 ? min : max

      if (max - min < 1) ret = vds.math.ceil(min)
      else {
        if (ret > max) ret = ret - 1
        else if (ret < min) ret = ret + 1
      }

      if (ret > max || ret < min)
        throw new Error('没有符合条件的随机数，请检查')
    }

    return ret
  } else return num
}
export { main }
