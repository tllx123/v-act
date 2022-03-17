import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'
import { Decimal as BigDecimal } from 'decimal.js'

type argType = number | string

const processValue = (val: argType | null) =>
  val == null ? '0' : val.toString()

/**
 * 加法运算
 *
 * @param {String|Number}
 *            arg1 被加数
 * @param {String|Number}
 *            arg1 加数
 * @return {String} 运算结果
 */
let add = function (arg1: argType, arg2: argType) {
  let a1 = new BigDecimal(processValue(arg1))
  let a2 = new BigDecimal(processValue(arg2))
  return a1.add(a2).toString()
}

/**
 * 减法运算
 *
 * @param {String|Number}
 *            arg1 被减数
 * @param {String|Number}
 *            arg1 减数
 * @return {String} 运算结果
 */
let subtract = function (arg1: argType, arg2: argType) {
  let a1 = new BigDecimal(processValue(arg1))
  let a2 = new BigDecimal(processValue(arg2))
  return a1.sub(a2).toString()
}

/**
 * 乘法运算
 *
 * @param {String|Number}
 *            arg1 被乘数
 * @param {String|Number}
 *            arg1 乘数
 * @return {String} 运算结果
 */
let multiply = function (arg1: argType, arg2: argType) {
  let a1 = new BigDecimal(processValue(arg1))
  let a2 = new BigDecimal(processValue(arg2))
  return a1.mul(a2).toString()
}

/**
 * 除法运算<br />
 * 运算结果作四舍五入
 *
 * @param {String|Number}
 *            arg1 被除数
 * @param {String|Number}
 *            arg1 除数
 * @param {String|Number}
 *            arg3 需要保留的小数位数
 * @return {String} 运算结果
 */
let divide = function (
  arg1: string | number,
  arg2: string | number,
  arg3?: string | number
) {
  let a1 = new BigDecimal(processValue(arg1))
  if (processValue(arg2) == '0') {
    throw Error('数值计算有误, 除数不能为0')
  }
  let a2 = new BigDecimal(processValue(arg2))
  return _rmNumLastZore(
    a1
      .div(a2)
      .toFixed(arg3 ? Number(arg3) : 6, BigDecimal.ROUND_HALF_UP)
      .toString()
  )
}

/**
 * 判断是否数字
 *
 * @param {String|Number}
 *            arg1 数字
 * @return {Boolean} 是否数字
 */
let isNum = function (arg1: string): boolean {
  let re = /^(\+|-)?\d+(?:\.\d+)?$/
  return re.test(arg1)
}

/**
 * 获取圆周率（3.141592653589793）
 */
let getPI = () => Math.PI

/**
 * 获取e（2.718281828459045）
 */
let getE = () => Math.E

/**
 * 获取整数商
 */
let divrem = function (arg1: argType, arg2: argType): number {
  return truncate(divide(arg1, arg2))
}

/**
 * 获取余数
 */
let getRemainder = function (arg1: argType, arg2: argType): number {
  return Number(arg1) % Number(arg2)
}

/**
 * 返回数的绝对值
 *
 * @param {String|Number}
 *            arg1 数字
 * @return {Boolean} 数字的绝对值
 */
let abs = function (arg1: argType) {
  return new BigDecimal(arg1).abs().toString()
}

// 角度转弧度
let angleToRadian = function (arg1: number): number {
  return (arg1 * Math.PI) / 180
}
//
// 弧度转角度
let radianToAngle = function (arg: number): number {
  return (180 * arg) / Math.PI
}

/**
 * 返回数的反余弦值
 */
let acos = function (arg: argType): number {
  return radianToAngle(Math.acos(Number(arg)))
}

/**
 * 返回数的反正弦值
 */
let asin = function (arg: argType): number {
  return radianToAngle(Math.asin(Number(arg)))
}

/**
 * 以介于 -PI/2 与 PI/2 弧度之间的数值来返回反正切值
 */
let atan = function (arg: argType): number {
  return radianToAngle(Math.atan(Number(arg)))
}

/**
 * 返回从 x 轴到点 (x,y) 的角度（介于 -PI/2 与 PI/2 弧度之间）
 */
let atan2 = function (arg: number, arg2: number): number {
  return radianToAngle(Math.atan2(arg, arg2))
}

/**
 * 对数进行向上取整
 *
 * @param {String|Number}
 *            arg1 数字
 * @return {Boolean} 向上取整的数字
 */
let ceil = function (arg: argType): number {
  let result = new BigDecimal(arg).ceil()
  return Number(result.toString())
}

/**
 * 返回数的余弦
 */
let cos = function (arg: argType): number {
  return Math.cos(angleToRadian(Number(arg)))
}

/**
 * 返回 e 的指数
 */
let exp = function (arg: argType): number {
  return Math.exp(Number(arg))
}

/**
 * 对数进行向下取整
 *
 * @param {String|Number}
 *            arg1 数字
 * @return {Boolean} 向下取整的数字
 */
let floor = function (arg1: argType): number {
  let result = new BigDecimal(arg1).floor()
  return Number(result.toString())
}

/**
 * 返回数的自然对数（底为e）
 */
let log = function (arg: argType): number {
  return Math.log(Number(arg))
}

/**
 * 返回两个数的最大值
 */
let max = function (arg1: argType, arg2: argType): number {
  return Math.max(Number(arg1), Number(arg2))
}

/**
 * 返回两个数的最小值
 */
let min = function (arg1: argType, arg2: argType): number {
  return Math.min(Number(arg1), Number(arg2))
}

/**
 * 返回 x 的 y 次幂
 */
let pow = function (arg1: argType, arg2: argType): number {
  let result = new BigDecimal(arg1).pow(new BigDecimal('' + arg2))
  return Number(result.toString())
}

/**
 * 返回 0 ~ 1 之间的随机数。
 */
let random = function (): number {
  return Math.random()
}

/**
 * 把数四舍五入为最接近的整数
 *
 * @param {String|Number}
 *            arg1 数字
 * @return {Boolean} 四舍五入后的整数
 */
let round = function (arg1: argType): number {
  let result = new BigDecimal(arg1).round()
  return Number(result.toString())
}

/**
 * 返回数的正弦
 */
let sin = function (arg: number): number {
  return Math.sin(angleToRadian(arg))
}

/**
 * 返回数的平方根
 */
let sqrt = function (arg: number): number {
  return Math.sqrt(arg)
}

/**
 * 返回数的正切
 */
let tan = function (arg: number): number {
  return Math.tan(angleToRadian(arg))
}

/**
 * 判断是否数字
 */
let judgeNum = function (arg: any): boolean {
  return judgeNumExt(arg)
}

/**
 * 判断是否数字(非正则表达式方法)
 */
let judgeNumExt = function (arg: any): boolean {
  if (arg == null || typeof arg == 'undefined' || arg === '') {
    return false
  }

  let result = new Number(arg).toString()
  return result.toUpperCase() == 'NAN' ? false : true
}

/**
 * 判断是否整数
 */
let judgeInt = function (arg: number | string): boolean {
  let re = /^(\+|-)?\d+$/
  return re.test(String(arg))
}

/**
 * 四舍五入保留N位小数
 *
 * @param {String|Number}
 *            arg1 需要四舍五入的数字
 * @param {Number}
 *            arg2 需要保留小数的位数
 * @return {Number} 四舍五入后的数字
 */
let toDecimal = function (arg1: argType, arg2: number) {
  let result = new BigDecimal(arg1).toDP(arg2, BigDecimal.ROUND_HALF_UP)
  return Number(result.toString())
}

/**
 * 四舍五入保留N位小数
 *
 * @param {String|Number}
 *            arg1 需要四舍五入的数字
 * @param {String|Number}
 *            arg2 需要保留小数的位数
 * @return {Number} 四舍五入后的数字
 */
let toDecimalPositive = function (arg1: argType, arg2: number) {
  return toDecimal(arg1, arg2)
}

/**
 * 保留N位小数（非四舍五入）
 *
 * @param {String|Number}
 *            arg1 需要四舍五入的数字
 * @param {String|Number}
 *            arg2 需要保留小数的位数
 * @return {Number} 保留小数后的数字
 */
let toDecimalExt = function (arg1: argType, arg2: number) {
  let result = new BigDecimal('' + arg1).toDP(arg2, BigDecimal.ROUND_DOWN)
  return Number(result.toString())
}

/**
 * 求整数部分
 *
 * @param {String|Number}
 *            arg1 需要求整的数字
 * @return {Number} 取整后的数字
 */
let truncate = function (arg1: argType): number {
  let result = new BigDecimal(arg1).truncated()
  return Number(result.toString())
}

/**
 * 求正负值(正数返回1,负数返回-1，0返回0)
 */
let sign = function (arg: number): number {
  return arg != 0 ? arg / Math.abs(arg) : 0
}

/**
 * 字符串转换日期
 */
let toDate = function (arg: string) {
  let reg = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/
  let r: RegExpMatchArray | null = arg.match(reg)
  if (r == null) {
    let reg = /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
    r = arg.match(reg)
  }
  if (r == null) {
    let reg = /^(\d{1,4})\/(\d{1,2})\/(\d{1,2})$/
    r = arg.match(reg)
  }
  if (r == null) {
    let reg = /^(\d{1,4})\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
    r = arg.match(reg)
  }
  if (r == null) {
    throw new Error(
      '时间字串格式必须符合yyyy-MM-dd或者yyyy/MM/dd或者yyyy-MM-dd hh:mm:ss或者yyyy/MM/dd hh:mm:ss,请检查'
    )
  } else {
    let result = true
    // @ts-ignore
    r[2] = r[2] - 1
    if (!r[4]) {
      // @ts-ignore
      r[4] = 0
    }
    if (!r[5]) {
      // @ts-ignore
      r[5] = 0
    }
    if (!r[6]) {
      // @ts-ignore
      r[6] = 0
    }
    let d = new Date(
      Number(r[1]),
      Number(r[2]),
      Number(r[3]),
      Number(r[4]),
      Number(r[5]),
      Number(r[6])
    )
    // @ts-ignore
    if (d.getFullYear() != r[1]) result = false
    // @ts-ignore
    if (d.getMonth() != r[2]) result = false
    // @ts-ignore
    if (d.getDate() != r[3]) result = false
    // @ts-ignore
    if (d.getHours() != r[4]) result = false
    // @ts-ignore
    if (d.getMinutes() != r[5]) result = false
    // @ts-ignore
    if (d.getSeconds() != r[6]) result = false
    if (result == false) {
      throw new Error('日期格式不正确,请检查')
    } else {
      return d
    }
  }
}
// 格式化日期 yyyy-MM-dd
let dateFormat = function (date: Date): string {
  let myyear: number | string = date.getFullYear()
  let mymonth: number | string = date.getMonth() + 1
  let myweekday: number | string = date.getDate()
  if (mymonth < 10) {
    mymonth = '0' + mymonth
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday
  }
  return myyear + '-' + mymonth + '-' + myweekday
}

// 格式化时间 HH:mm:ss
let timeFormat = function (date: Date): string {
  let myhour: number | string = date.getHours()
  if (myhour < 10) {
    myhour = '0' + myhour
  }
  let myminute: number | string = date.getMinutes()
  if (myminute < 10) {
    myminute = '0' + myminute
  }
  let mysecond: number | string = date.getSeconds()
  if (mysecond < 10) {
    mysecond = '0' + mysecond
  }
  return myhour + ':' + myminute + ':' + mysecond
}

// 判断参数是否为空
let isEmpty = (para: any): boolean => undefined == para || null == para

// 判断参数是否为空
let isEmptyEX = function (para: any): boolean {
  return (
    undefined == para ||
    null == para ||
    para == '' ||
    !(typeof para == 'string')
  )
}

// 判断是否无穷数
let isInfinity = (para: number): boolean =>
  para == Infinity || para == -Infinity

/**
 * 编码字符串累加或累减
 *
 * @param {Object}
 *            numberCode
 * @param {Object}
 *            num
 */
let numberCodeAdd = function (numberCode: any, num: number) {
  let numberCodeNum = 0
  let numberCodeSize = 0
  if (typeof num != 'number') {
    logUtil.error(
      '[mathUtil.numberCodeAdd]传入的参数num=' +
        num +
        '不是数值型,无法进行运算,返回原numberCode对象'
    )
    return numberCode
  }

  if (
    numberCode == null ||
    numberCode == '' ||
    typeof numberCode == 'undefined'
  ) {
    numberCodeNum = 0
  } else {
    if (typeof numberCode == 'number') {
      numberCode = numberCode.toString()
    }
    if (typeof numberCode != 'string') {
      logUtil.error(
        '[mathUtil.numberCodeAdd]传入的参数numberCode=' +
          numberCode +
          '无法转换成字符，返回原对象'
      )
      return numberCode
    }

    let isNumber = judgeNumExt(numberCode)
    if (isNumber == false) {
      logUtil.error(
        '[mathUtil.numberCodeAdd]传入的参数numberCode=' +
          numberCode +
          '无法转换成数值,返回原字符串'
      )
      return numberCode
    }

    numberCodeNum = parseFloat(numberCode)

    numberCodeSize = numberCode.length
  }

  let resultNum = numberCodeNum + num

  if (isNaN(resultNum)) {
    logUtil.error(
      '[mathUtil.numberCodeAdd]运算结果超过数值最大限制范围,返回原字符串'
    )
    return numberCode
  }

  if (resultNum < 0) {
    logUtil.warn(
      '[mathUtil.numberCodeAdd]运算结果为:' +
        resultNum +
        ',小于0,默认把结果转换成0处理'
    )
    resultNum = 0
  }

  let resultNumCode = resultNum.toString()

  // 计算补零个数
  let fillZeroCount = numberCodeSize - resultNumCode.length

  // 进行补零操作
  if (fillZeroCount > 0) {
    for (let index = 0; index < fillZeroCount; index++) {
      resultNumCode = '0' + resultNumCode
    }
  }

  return resultNumCode
}

let _rmNumLastZore = function (num: string): string {
  if (num && num.indexOf('.') != -1) {
    let nums = num.split('.'),
      intNum = nums[0],
      floatNum = nums[1],
      newFloatNum = floatNum.replace(/0+$/, '')
    return intNum + (newFloatNum == '' ? '' : '.' + newFloatNum)
  }
  return num
}

export {
  abs,
  acos,
  add,
  asin,
  atan,
  atan2,
  ceil,
  cos,
  dateFormat,
  divide,
  divrem,
  exp,
  floor,
  getE,
  getPI,
  getRemainder,
  isEmpty,
  isEmptyEX,
  isInfinity,
  isNum,
  judgeInt,
  judgeNum,
  judgeNumExt,
  log,
  max,
  min,
  multiply,
  numberCodeAdd,
  pow,
  random,
  round,
  sign,
  sin,
  sqrt,
  subtract,
  tan,
  timeFormat,
  toDate,
  toDecimal,
  toDecimalExt,
  toDecimalPositive,
  truncate
}
