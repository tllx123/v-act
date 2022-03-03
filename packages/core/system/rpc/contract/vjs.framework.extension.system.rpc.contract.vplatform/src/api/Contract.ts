import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'

let undefined

/**
 * @class Contract
 * @desc 前后端请求协议
 */
let Contract = function () {
  this.headers = {}
}

Contract.prototype = {
  initModule: function (sb) {
    var manager = sb.getService(
      'vjs.framework.extension.system.rpc.contract.Manager'
    )
    manager.injectCurrentContract(Contract, null)
  },

  /**
   * 设置头信息
   * @param {Object} pName
   * @param {Object} value
   */
  setHeader: function (pName, value) {
    this.headers[pName] = value
  },
  /**
   *批量设置头信息
   * @param {Object} data
   */
  setHeaders: function (data) {
    if (data) {
      for (let attr in data) {
        if (data.hasOwnProperty(attr)) {
          this.setHeader(attr, data[attr])
        }
      }
    }
  },
  /**
   *生成请求数据
   * @param {Object} operation
   */
  generate: function (operation) {},
  /**
   *序列化请求数据（对请求数据进行加工）
   */
  serializeRequest: function (data) {
    return encodeURIComponent(jsonUtil.obj2json(data))
  },
  /**
   * 结构化返回值
   * @param {Object} responseData
   */
  deserializeResponse: function (responseData) {
    return responseData
  }
}

return Contract
