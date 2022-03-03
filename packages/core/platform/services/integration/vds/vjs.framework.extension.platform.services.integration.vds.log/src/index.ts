/**
 * 日志工具方法
 * @desc 提供与日志相关的一系列接口，使用前请先import：vds.import("vds.log.*")
 * @namespace vds/log
 * @module log
 * @catalog 工具方法/日志
 * @example
 * vds.import("vds.log.*");
 * vds.log.warn("打印警告信息！");
 */
define('./index', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.log = window.vds.log || {}

  var log = window.vds.log

  exports = log

  var logUtil

  exports.initModule = function (sb) {
    logUtil = sb.getService('vjs.framework.extension.util.log')
  }

  /**
   * 打印日志信息
   * @param {String} msg 日志信息
   * @example
   * vds.log.log("日志信息");
   */
  exports.log = function (msg) {
    return logUtil.log(msg)
  }

  /**
   * 打印警告信息
   * @param {String} msg 警告信息
   * @example
   * vds.log.warn("警告日志");
   */
  exports.warn = function (msg) {
    return logUtil.warn(msg)
  }

  /**
   * 打印错误信息
   * @param {String} msg 错误信息
   * @example
   * vds.log.error("错误日志");
   */
  exports.error = function (msg) {
    return logUtil.error(msg)
  }

  return exports
})
