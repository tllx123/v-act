import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

let Channel = function () {
  this.type = 'POST'
  this.isAsync = true
  this.timeout = 30000
  this.url = 'module-operation!executeMultiOperation'
}

Channel.prototype = {
  initModule: function (sb) {},

  /**
   * 设置提交类型
   *
   * @param {Object} type
   */
  setType: function (type) {
    this.type = type
  },
  /**
   * 设置是否异步
   *
   * @param {Object} async
   */
  setAsync: function (async) {
    this.isAsync = async
  },
  /**
   * 设置超时时间
   *
   * @param {Object} timeout
   */
  setTimeout: function (timeout) {
    this.timeout = timeout
  },
  getTimeout: function () {
    return environment.isDebug() ? 999999999 : this.timeout
  },
  /**
   * 设置请求url
   *
   * @param {Object} url
   */
  setUrl: function (url) {
    this.url = url
  },

  buildRequest: function (operation, contract) {},

  processResponse: function (res, status, requestInfo) {},

  request: function (operation, contract) {},

  log: function (params) {}
}

return Channel

export { getCurrentChannelService, injectCurrentChannel }
