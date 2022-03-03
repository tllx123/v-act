/**
 * 消息提示方法
 * @desc 提供消息提示接口，使用前请先import：vds.import("vds.message.*")
 * @namespace vds/message
 * @module message
 * @catalog 工具方法/消息提示
 * @example
 * vds.import("vds.message.*");
 * vds.message.error("提示错误信息！");
 */
define('./index', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.message = window.vds.message || {}

  var message = window.vds.message

  exports = message

  var dialogUtil

  exports.initModule = function (sb) {
    dialogUtil = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.dialog.DialogUtil'
    )
  }

  var _exe = function (funName, msg, params) {
    var _this = this
    var func = (function (_this, _funName, _msg, _params) {
      return function (resolve, reject) {
        try {
          var time = _params ? _params.time : null
          dialogUtil[_funName].apply(_this, [_msg, resolve, false, time])
        } catch (e) {
          reject(e)
        }
      }
    })(this, funName, msg, params)
    return new Promise(func)
  }

  /**
   * 显示提示信息
   * @param {String} msg 信息内容
   * @param {Object} params 其他参数（可选）
   * {
   *  "time":{Integer} 提示框显示时间，单位：秒（可选）
   * }
   * @returns Promise
   * @example
   * var promise = vds.message.info("日志信息");
   * promise.then(function(){
   *  console.log("日志信息显示结束.");
   * }).catch(function(err){
   *  console.error("日志信息显示有误.");
   * });
   */
  exports.info = function (msg, params) {
    return _exe('propmtDialog', msg, params)
  }
  /**
   * 显示警告信息
   * @param {String} msg 信息内容
   * @returns Promise
   * @example
   * var promise = vds.message.warn("警告信息");
   * promise.then(function(){
   *  console.log("警告信息结束.");
   * }).catch(function(err){
   *  console.error("警告信息显示有误.");
   * });
   */
  exports.warn = function (msg) {
    return _exe('warnDialog', msg)
  }

  /**
   * 提示错误信息
   * @param {String} msg 错误信息
   * @returns Promise
   * @example
   * var promise = vds.message.error("错误日志");
   * promise.then(function(){
   *  console.log("错误信息显示结束.");
   * }).catch(function(err){
   *  console.error("错误信息显示有误.");
   * });
   */
  exports.error = function (msg) {
    return _exe('errorDialog', msg)
  }

  /**
   * 显示询问框
   * @param {String} msg 显示信息
   * @returns Promise
   * @example
   * var promise = vds.message.confirm("是否保存?");
   * promise.then(function(){
   *  console.log("询问信息显示结束.");
   * }).catch(function(err){
   *  console.error("询问信息显示有误.");
   * });
   */
  exports.confirm = function (msg) {
    return _exe('confirmDialog', msg)
  }

  return exports
})
