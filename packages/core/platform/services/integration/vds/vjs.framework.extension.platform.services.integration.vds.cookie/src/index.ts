/**
 * cookie相关的方法
 * @desc 提供与cookie相关的一系列接口，使用前请先import：vds.import("vds.cookie.*")
 * @namespace vds/cookie
 * @module cookie
 * @catalog 工具方法/cookie
 * @example
 * vds.import("vds.cookie.*");
 * vds.cookie.set("yindangu","123456");
 */
define('./index', function (require, exports, module) {
  var vds = window.vds
  if (!vds) {
    vds = {}
    window.vds = vds
  }
  var cookie = vds.cookie
  if (!cookie) {
    cookie = {}
    vds.cookie = cookie
  }

  exports = cookie

  var sandbox, cookieUtil

  exports.initModule = function (sBox) {
    sandbox = sBox
    cookieUtil = sandbox.getService(
      'vjs.framework.extension.platform.services.domain.cookie.cookieUtil'
    )
  }
  /**
   * 删除cookie
   * @param {String} code 需要删除的cookie编码
   * @param {Object} options 可选参数
   * {
   * 	path {String} cookie服务器路径
   *  domain {String} cookie域名
   * }
   * @example
   * vds.cookie.remove("yindangu");
   * */
  exports.remove = function (code, options) {
    cookieUtil.vcookie({
      name: code,
      value: null,
      options: options
    })
  }
  /**
   * 获取cookie
   * @param {String} code cookie编码
   * @returns {String}
   * @example
   * vds.cookie.get("yindangu");
   * */
  exports.get = function (code) {
    var cookieVal = cookieUtil.vcookie({
      name: code
    })
    return cookieVal
  }

  /**
   * 设置cookie
   * @param {String} code cookie编码
   * @param {String} value cookie值
   * @param {Object} options 可选参数
   * {
   * 	path {String} cookie服务器路径
   *  domain {String} cookie域名
   *  expires {Date} 有效期
   *  secure {Boolean} 是否通过安全的HTTPS，false表示HTTP，true表示HTTPS，缺省值：false
   *  HttpOnly {Boolean} 是否可以通过客户端脚本访问,缺省值：true
   * }
   * @example
   * vds.cookie.set("yindangu","123456");
   * */
  exports.set = function (code, value, options) {
    cookieUtil.vcookie({
      name: code,
      value: value,
      options: options
    })
  }

  module.exports = exports
})
