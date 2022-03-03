/**
 * 日期工具方法
 * @desc 提供与日期相关的一系列接口，使用前请先import：vds.import("vds.date.*")
 * @namespace vds/date
 * @module date
 * @catalog 工具方法/日期
 * @example
 * vds.import("vds.date.*");
 * vds.date.add("2012-03-05 18:20:30",30,vds.date.Units.Hour);
 */
define('./index', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.date = window.vds.date || {}

  var date = window.vds.date

  exports = date

  var dateUtil, formatUtil, mathUtil

  exports.initModule = function (sb) {
    dateUtil = sb.getService('vjs.framework.extension.util.date.DateTimeUtil')
    formatUtil = sb.getService('vjs.framework.extension.util.DateFormatUtil')
    mathUtil = sb.getService('vjs.framework.extension.util.Math')
  }

  /**
   * 日期单位枚举
   * @enum {String}
   */
  exports.Units = {
    /**
     * 年
     */
    Year: 'y',
    /**
     * 月
     */
    Month: 'M',
    /**
     * 日
     */
    Day: 'd',
    /**
     * 时
     */
    Hour: 'H',
    /**
     * 分
     */
    Minute: 'm',
    /**
     * 秒
     */
    Second: 's'
  }

  /**
   * 在指定日期添加时间间隔
   * @param {String} date 日期
   * @param {Integer} num 数值
   * @param {date.Units} type 类型
   * @returns  {String}
   * @example
   * vds.date.add("2012-03-05 18:20:30",30,vds.date.Units.Hour);//2012-03-07 00:20:30
   */
  exports.add = function (date, num, type) {
    return dateUtil.dateAdd(date, num, type)
  }

  /**
   * 将一种时间单位转换成另外一种时间单位
   * @param {Integer} num 时间数
   * @param {date.Units} timeUnit 原时间的单位
   * @param {date.Units} destTimeUnit 目标时间的单位
   * @example
   * vds.date.convert(30,"s",vds.date.Units.Minute)//0.5
   */
  exports.convert = function (num, timeUnit, destTimeUnit) {
    return dateUtil.dateConvert(num, timeUnit, destTimeUnit)
  }

  /**
   * 计算目标日期和原日期之间的时间差，并转换成指定事件单位
   * @param {String} src 原日期
   * @param {String} dest 目标日期
   * @param {date.Units} timeUnit 时间单位
   * @returns {String}
   * @example
   * vds.date.diff("2012-11-25 00:00:00","2012-11-26 12:00:00",vds.date.Units.Day)//1.5
   */
  exports.diff = function (src, dest, timeUnit) {
    return dateUtil.datediff(src, dest, timeUnit)
  }

  /**
   * 格式化日期
   * @param {Date} date 日期
   * @param {String} format 日期格式
   * @returns {String}
   * @example
   * vds.date.format(new Date("2021-05-12"),"yyyy-MM-dd");//2021-05-12
   */
  exports.format = function (date, format) {
    var formatter = formatUtil.newInstance(format)
    return formatter.format(date)
  }

  /**
   * 将日期字符串转换成日期
   * @param {String} dateStr 日期字符串,格式必须是yyyy-MM-dd或者yyyy/MM/dd或者yyyy-MM-dd hh:mm:ss或者yyyy/MM/dd hh:mm:ss
   * @returns {Date}
   * @example
   * vds.date.valueOf("2021-05-12");
   */
  exports.valueOf = function (dateStr) {
    return mathUtil.toDate(dateStr)
  }

  return exports
})
