import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

const main = function (param: { getArgs: () => string }) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    period = argsLen >= 1 ? args[0] : '',
    type = argsLen >= 2 ? args[1] : 0

  let result = ''
  // 传入参数不能为空
  if (math.isEmpty(type) || math.isEmpty(period))
    throw new Error('传入转换类型为空，请检查')
  else if (!math.judgeInt(type)) throw new Error('转换类型不是整数，请检查')
  else if (type > 6)
    throw new Error('参数类型有误、类型参数为(1年、2半年、3季、4月、5旬、6周)')

  period = period.trim()

  switch (type) {
    case 1:
      if (period.length > 4) throw new Error('参数长度有误、格式为4位、如2000')
      else result = period + '年'

      break
    case 2:
      if (period.length > 6)
        throw new Error('参数长度有误、格式为6位、如201201')
      else if (period.substring(4, 6) != '01' && period.substring(4, 6) != '02')
        throw new Error('上下半年必须为01或者02')
      else
        result =
          period.substring(0, 4) +
          '年' +
          (period.substring(4, 6) == '01' ? '上半年' : '下半年')

      break
    case 3:
      if (period.length > 6)
        throw new Error('参数长度有误、格式为6位、如201201')
      else
        result = period.substring(0, 4) + '年' + (period.substring(4, 6) + '季')

      break
    case 4:
      if (period.length > 6)
        throw new Error('参数长度有误、格式为6位、如201201')
      else
        result = period.substring(0, 4) + '年' + (period.substring(4, 6) + '月')

      break
    case 5:
      if (period.length > 8)
        throw new Error('参数长度有误、格式为8位、如20120101')
      else
        result =
          period.substring(0, 4) +
          '年' +
          (period.substring(4, 6) + '月') +
          (period.substring(6, 8) + '旬')

      break
    case 6:
      if (period.length > 6)
        throw new Error('参数长度有误、格式为6位、如201201')
      else
        result = period.substring(0, 4) + '年' + (period.substring(4, 6) + '周')

      break
  }

  return result
}

export { main }
