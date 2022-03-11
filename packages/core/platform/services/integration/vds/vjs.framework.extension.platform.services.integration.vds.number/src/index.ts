/**
 * 数值工具方法
 * @desc 提供与数值相关的一系列接口，使用前请先import：vds.import("vds.number.*")
 * @namespace vds/number
 * @module number
 * @catalog 工具方法/数值
 * @example
 * vds.import("vds.number.*");
 * vds.number.isInteger(521.54);//false
 */
window.vds = window.vds || {}
window.vds.number = window.vds.number || {}

var number = window.vds.number

exports = number

var mathUtil

export function initModule(sb) {
  mathUtil = sb.getService('vjs.framework.extension.util.Math')
}

/**
 * 判断是否无穷数
 * @param {Any} num 任意值
 * @returns {Boolean}
 * @example
 * vds.number.isInfinity(12);//false
 */
export function isInfinity(num) {
  return mathUtil.isInfinity(num)
}

/**
 * 判断是否整数或者整数字符串
 * @param {Any} num 任意值
 * @returns {Boolean}
 * @example
 * vds.number.isInteger(12);//true
 * vds.number.isInteger("34");//true
 */
export function isInteger(num) {
  return mathUtil.judgeInt(num)
}

/**
 * 四舍五入保留指定小数位数
 * num为非数值时，将抛出异常
 * @param {Number} num  数值
 * @param {Integer} precision 保留小数位数
 * @returns {Number}
 * @example
 * vds.number.toFixed(123.3345,3);//123.335
 * vds.number.toFixed(23.452,2);//23.45
 */
export function toFixed(num, precision) {
  return mathUtil.toDecimal(num, precision)
}

/**
 * 保留指定小数位数，超出部分将被丢弃
 * @param {Number} num 数值
 * @param {Integer} precision 保留小数位数
 * @returns {Number}
 * @example
 * vds.number.toFloorFixed(123.3345,3);//123.334
 * vds.number.toFixed(23.452,2);//23.45
 */
export function toFloorFixed(num, precision) {
  return mathUtil.toDecimalExt(num, precision)
}
