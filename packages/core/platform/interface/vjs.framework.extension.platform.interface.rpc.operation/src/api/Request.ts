import { ExceptionHandler as exceptionHandler } from '@v-act/vjs.framework.extension.platform.interface.exception'

/**
 *@class Request
 * @desc 前端请求定义<br/>
 * 前端对后台发起一次请求时({@link Request}),可以包含有多次操作({@link Operation})。<br/>
 * vjs名称：vjs.framework.extension.platform.interface.rpc.operation<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.rpc.operation.Request<br/>
 */
let Request = function (isAsync, operations, success, error, host, timeout) {
  this.async = isAsync
  this.operations = operations
  this.success = success
  this.error = error
  this.host = host
  this.timeout = timeout
}

Request.prototype = {
  initModule: function (sb) {},

  /**
   *  设置请求操作
   * @param {Array<@link Operation>} operations 请求动作
   */
  setOperations: function (operations) {
    this.operations = operations
  },

  /**
   * 获取请求动作
   * @return Array<{@link Operation}>
   */
  getOperations: function () {
    return this.operations
  },

  /**
   *  设置请求成功回调
   * @param {Function} fn 回调
   */
  setSuccessCallback: function (fn) {
    this.success = fn
  },

  /**
   * 调用请求成功回调
   */
  callSuccessCallback: function () {
    if (typeof this.success == 'function') {
      this.success.apply(this, arguments)
    }
  },

  /**
   *  设置请求失败回调
   * @param {Function} fn 回调
   */
  setErrorCallback: function (fn) {
    this.error = fn
  },

  /**
   * 调用请求失败回调
   */
  callErrorCallback: function () {
    if (typeof this.error == 'function') {
      this.error.apply(this, arguments)
    } else {
      exceptionHandler.handle.apply(this, arguments)
    }
  },

  /**
   *  设置是否异步请求
   * @param {Boolean} isAsync 是否异步
   */
  setAsync: function (isAsync) {
    this.async = isAsync
  },

  /**
   * 是否异步请求
   * @return Boolean
   */
  isAsync: function () {
    return this.async
  },

  /**
   *  设置站点地址
   * @param {String} host 站点地址
   */
  setHost: function (host) {
    this.host = host
  },

  /**
   * 获取站点地址
   * @return String
   */
  getHost: function () {
    return this.host
  },
  /**
   * 设置超时时间
   */
  setTimeout: function (timeout) {
    this.timeout = timeout
  },
  /**
   * 获取超时时间
   */
  getTimeout: function (timeout) {
    return this.timeout
  }
}
return Request
