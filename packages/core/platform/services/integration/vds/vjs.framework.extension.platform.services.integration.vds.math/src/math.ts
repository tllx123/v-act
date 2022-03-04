/**
 * 数学计算工具方法
 * @desc 提供与数学计算相关的一系列接口，使用前请先import：vds.import("vds.math.*")
 * @namespace vds/math
 * @module math
 * @catalog 工具方法/数学计算
 * @example
 * vds.import("vds.math.*");
 * vds.math.ceil(521.54);
 */
define('./math', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.math = window.vds.math || {}

  var math = window.vds.math

  exports = math

  var mathUtil

  exports.initModule = function (sb) {
    mathUtil = sb.getService('vjs.framework.extension.util.Math')
  }

  /**
   * 获取反余弦值
   * 如arg值大于1或小于-1，返回值为NaN
   * @param   {Number}    arg 介于 [-1,+1] 区间的浮点值。
   * @returns {Number}    反余弦值
   * @example
   * vds.math.acos(0.5)//60
   */
  exports.acos = function (arg) {
    return mathUtil.acos(arg)
  }

  /**
   * 加法运算
   * 被加数和加数未非数值或非数值字符串时，将抛出异常
   * @param   {String|Number} arg1 被加数
   * @param   {String|Number} arg2 加数
   * @returns {String}    运算结果
   * @example
   * vds.math.add(123,125);//248
   * vds.math.add("12",45);//57
   */
  exports.add = function (arg1, arg2) {
    return mathUtil.add(arg1, arg2)
  }

  /**
   * 获取反正弦值
   * 如arg值大于1或小于-1，返回值为NaN
   * @param   {Number}    arg 介于 [-1,+1] 区间的浮点值。
   * @returns {Number}    反正弦值
   * @example
   * vds.math.asin(0.5);//30
   */
  exports.asin = function (arg) {
    return mathUtil.asin(arg)
  }

  /**
   * 获取反正切值
   * @param   {Number}    arg 必须是一个数值。
   * @returns {Number}
   * @example
   * vds.math.atan(1)//45
   */
  exports.atan = function (arg) {
    return mathUtil.atan(arg)
  }

  /**
   * 对数值进行向上舍入
   * arg为非数值时，将抛出异常
   * @param   {Number}    arg 必须是一个数值
   * @returns {Integer}
   * @example
   * vds.math.ceil(0.60)//1
   * vds.math.ceil(0.40)//1
   */
  exports.ceil = function (arg) {
    return mathUtil.ceil(arg)
  }

  /**
   * 获取余弦值
   * arg为非数值时，返回值为NaN
   * @param   {Number}    arg 必须是一个数值
   * @returns {Number}    余弦值
   * @example
   * vds.math.cos(60)//0.5
   */
  exports.cos = function (arg) {
    return mathUtil.cos(arg)
  }

  /**
   * 除法运算
   * 超出保留小数位数部分作四舍五入
   * 被除数或除数为非数值时，将抛出异常
   * @param {String|Number}   arg1 被除数
   * @param {String|Number}   arg1 除数
   * @param {String|Number}   arg3 需要保留的小数位数
   * @return {String} 运算结果
   * @example
   * vds.math.divide(123,13,3);//9.462
   * vds.math.divide(3.1,2,1);//1.6
   */
  exports.divide = function (arg1, arg2, arg3) {
    return mathUtil.divide(arg1, arg2, arg3)
  }

  /**
   * 获取两数相除后的整数商
   * 非数值运算时，将抛出异常
   * @param {String|Number}   arg1 被除数
   * @param {String|Number}   arg1 除数
   * @return  {Integer}
   * @example
   * vds.math.divrem(54,8);//6
   */
  exports.divrem = function (arg1, arg2) {
    return mathUtil.divrem(arg1, arg2)
  }

  /**
   * 获取e（2.718281828459045）
   * @returns {Number}
   * @example
   * vds.math.e();
   */
  exports.e = function () {
    return mathUtil.getE()
  }

  /**
   * 返回 e 的指数
   * arg为非数值时，返回值NaN
   * @param   {Number}    arg 任意数值,被用作指数
   * @returns {Number}
   * @example
   * vds.math.exp(1);//2.718281828459045
   */
  exports.exp = function (arg) {
    return mathUtil.exp(arg)
  }

  /**
   * 对数值进行下舍入
   * arg为非数值时，将抛出异常
   * @param   {Number}    arg 任意数值
   * @returns {Integer}
   * @example
   * vds.math.floor(0.60);//0
   * vds.math.floor(-5.9);//-6
   */
  exports.floor = function (arg) {
    return mathUtil.floor(arg)
  }

  /**
   * 获取数值的自然对数
   * arg小于0或非数值时，返回NaN
   * @param   {Number}    arg 任意数值, 必须大于 0
   * @returns {Number}
   * @example
   * vds.math.log(2.7183)//1.0000066849139877
   * vds.math.log(-1)//NaN
   */
  exports.log = function (arg) {
    return mathUtil.log(arg)
  }

  /**
   * 获取两个数值中的最大值
   * 参数为非数值时，返回值为NaN
   * @param {Number} arg1 数值
   * @param {Number} arg2 数值
   * @returns {Number}
   * @example
   * vds.math.max(1,4);//4
   * vds.math.max(0,44);//44
   */
  exports.max = function (arg1, arg2) {
    return mathUtil.max(arg1, arg2)
  }

  /**
   * 获取两个数值中的最小值
   * 参数为非数值时，返回值为NaN
   * @param {Number} arg1 数值
   * @param {Number} arg2 数值
   * @returns {Number}
   * @example
   * vds.math.min(34,346);//34
   * vds.math.min(-4,5);//-4
   */
  exports.min = function (arg1, arg2) {
    return mathUtil.min(arg1, arg2)
  }

  /**
   * 乘法运算
   * 参数为非数值时，将抛出异常
   * @param {String|Number} arg1 被乘数
   * @param {String|Number} arg2 乘数
   * @returns {String}
   * @example
   * vds.math.multiply(2,4);//8
   * vds.math.multiply(2.1.5);//3
   */
  exports.multiply = function (arg1, arg2) {
    return mathUtil.multiply(arg1, arg2)
  }

  /**
   * 获取圆周率
   * @returns {Number}
   * @example
   * vds.math.pi();//3.14159
   */
  exports.pi = function () {
    return mathUtil.getPI()
  }

  /**
   * 返回 arg1 的 arg2 次幂
   * 参数为非数值时，将抛出异常
   * @param {Number} arg1  底数,必须是数字
   * @param {Number} arg2  幂数,必须是数字
   * @example
   * vds.math.pow(0,0)//1
   * vds.math.pow(-2,4)//16
   */
  exports.pow = function (arg1, arg2) {
    return mathUtil.pow(arg1, arg2)
  }

  /**
   * 获取 0 ~ 1 之间的随机数
   * @returns {Number}
   * @example
   * vds.math.random();//0.7789492286184359
   */
  exports.random = function () {
    return mathUtil.random()
  }

  /**
   * 获取余数
   * 参数为非数值时，返回NaN
   * @param {Number} arg1  被除数,必须是数字
   * @param {Number} arg2  除数,必须是数字
   * @returns {Number}
   * @example
   * vds.math.remainder(234.34,35);//24.34
   */
  exports.remainder = function (arg1, arg2) {
    return mathUtil.getRemainder(arg1, arg2)
  }

  /**
   * 对数值进行四舍五入
   * 参数为非数值时，将抛出异常
   * @param {String|Number} arg1 数值
   * @returns {Integer}
   * @example
   * vds.math.round(0.6);//1
   * vds.math.round(-4.6);//-5
   */
  exports.round = function (arg1) {
    return mathUtil.round(arg1)
  }

  /**
   * 求正负值(正数返回1,负数返回-1，0返回0)
   * 参数为非数值时，返回NaN
   * @param {Number} arg 数值
   * @return {Integer}
   * @example
   * vds.math.sign(2);//1
   * vds.math.sign(-23);//-1
   * vds.math.sign(0);//0
   */
  exports.sign = function (arg) {
    return mathUtil.sign(arg)
  }

  /**
   * 获取正弦值
   * 参数为非数值时，返回NaN
   * @param {Number} arg 一个以弧度表示的角,将角度乘以 0.017453293 （2PI/360）即可转换为弧度
   * @returns {Number}
   * @example
   * vds.math.sin(3);//0.1411200080598672
   * vds.math.sin(0);//0
   * vds.math.sin(vds.math.pi()/2);//1
   */
  exports.sin = function (arg) {
    return mathUtil.sin(arg)
  }

  /**
   * 获取指定值的平方根
   * 如果arg小于零，则返回NaN
   * @param {Number} arg 必须是大于等于 0 的数
   * @returns {Number}
   * @example
   * vds.math.sqrt(0);//0
   * vds.math.sqrt(0.64);//0.8
   * vds.math.sqrt(-9);//NaN
   */
  exports.sqrt = function (arg) {
    return mathUtil.sqrt(arg)
  }

  /**
   * 减法运算
   * @param {String|Number} arg1 被减数
   * @param {String|Number} arg2 减数
   * @returns {String}
   * @example
   * vds.math.subtract(12,3);//9
   * vds.math.subtract("33",3);//30
   */
  exports.subtract = function (arg1, arg2) {
    return mathUtil.subtract(arg1, arg2)
  }

  /**
   * 获取正切值
   * @param {Number} arg 一个以弧度表示的角,将角度乘以 0.017453293 （2PI/360）即可转换为弧度
   * @returns {Number}
   * @example
   * vds.math.tan(0.50);//0.5463024898437905
   * vds.math.tan(-5);//3.380515006246586
   */
  exports.tan = function (arg) {
    return mathUtil.tan(arg)
  }

  /**
   * 获取数值整数部分值
   * @param {Number} arg 数值
   * @returns {Integer}
   * @example
   * vds.math.truncate(345.4);//345
   */
  exports.truncate = function (arg) {
    return mathUtil.truncate(arg)
  }

  return exports
})
