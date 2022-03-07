import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    min = argsLen >= 1 ? args[0] : null,
    max = argsLen >= 2 ? args[1] : null,
    fixed = argsLen >= 3 ? args[2] : null

  if (!mathUtil.isEmpty(max)) {
    if (!mathUtil.judgeNum(max))
      throw new Error('随机数函数的随机区域的最大值不是数字，请检查')
  }
  if (!mathUtil.isEmpty(min)) {
    if (!mathUtil.judgeNum(min))
      throw new Error('随机数函数的随机区域的最大值不是数字，请检查')
  }
  if (!mathUtil.isEmpty(fixed)) {
    if (!mathUtil.judgeInt(fixed) || fixed < 0)
      throw new Error('随机数函数的返回值保留的小数位不是非负整数，请检查')
  }

  // 0 ~ 1 之间的随机数。
  let randomNum = mathUtil.random()
  let num
  // 最大值、最小值存在条件
  if (!mathUtil.isEmpty(min) && !mathUtil.isEmpty(max)) {
    if (min == max) return min
    if (min > max)
      throw new Error('随机数函数的随机区域最大值小于最小值，请检查')

    //(max - min) * randomNum + min
    let n1 = mathUtil.subtract(max, min)
    let n2 = mathUtil.multiply(n1, randomNum)
    num = mathUtil.add(min, n2)
  } else if (mathUtil.isEmpty(min) && !mathUtil.isEmpty(max)) {
    //max - max * randomNum
    let n3 = mathUtil.multiply(max, randomNum)
    num = mathUtil.subtract(max, n3)
  } else if (!mathUtil.isEmpty(min) && mathUtil.isEmpty(max)) {
    //min + min * randomNum
    let n4 = mathUtil.multiply(min, randomNum)
    num = mathUtil.subtract(min, n4)
  } else throw new Error('随机数函数的随机区域的最大值与最小值都为空，请检查')

  if (!mathUtil.isEmpty(fixed)) {
    let ret = mathUtil.toDecimalExt(num, fixed)
    ret = ret * 1
    if (fixed == 0) {
      if (mathUtil.judgeInt(min) && mathUtil.judgeInt(max) && max - min == 1)
        return randomNum < 0.5 ? min : max

      if (max - min < 1) ret = mathUtil.ceil(min)
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
