import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

/**
 * @class VPlatformContract
 * @desc v平台前后端请求协议
 */
let VPlatformContract = function () {
  this.componentCode = null
  this.windowCode = null
  this.scopeId = null
  this.headers = {}
}

VPlatformContract.prototype = {
  initModule: function (sandbox) {
    var manager = sandbox.getService(
      'vjs.framework.extension.system.rpc.contract.Manager'
    )
    manager.injectCurrentContract(VPlatformContract, 'vPlatform')
    var Contract = require('vjs/framework/extension/system/rpc/contract/vplatform/api/Contract')
    var objectUtil = sandbox.util.object
    var initFunc = Contract.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sandbox)
    }
    var prototype = Object.create(Contract.prototype)
    prototype.constructor = VPlatformContract
    objectUtil.extend(prototype, VPlatformContract.prototype)
    VPlatformContract.prototype = prototype
  },

  /**
   * 设置构件编号
   */
  setComponentCode: function (componentCode) {
    this.componentCode = componentCode
  },

  /**
   * 设置窗体编号
   */
  setWindowCode: function (windowCode) {
    this.windowCode = windowCode
  },
  /**
   * 设置域id
   */
  setScopeId: function (scopeId) {
    this.scopeId = scopeId
  },
  /**
   *生成请求数据
   * @param {Object} operation
   */
  generate: function (request) {
    let operation = request.getOperations()[0]
    this.setHeader('ajaxRequest', true)
    this.setHeader('operation', operation.getOperation())
    this.setHeader('scopeId', scopeManager.getCurrentScopeId())
    let transactionId = operation.getTransactionId()
    if (transactionId != null && typeof transactionId != 'undefined') {
      this.setHeader('transaction_id', transactionId)
    }
    let data = {}
    for (let attr in this.headers) {
      if (this.headers.hasOwnProperty(attr)) {
        data[attr] = this.headers[attr]
      }
    }
    let params = operation.getParams()
    params['windowCode'] = operation.getWindowCode()
    params['componentCode'] = operation.getComponentCode()
    if (transactionId != null && typeof transactionId != 'undefined') {
      params['transaction_id'] = transactionId
    }
    data['token'] = this.serializeRequest({ data: params })
    return data
  }
}

return VPlatformContract
