import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Manager as manager } from '@v-act/vjs.framework.extension.system.rpc.contract'
import Contract from './Contract'

/**
 * @class VPlatformContract
 * @desc v平台前后端请求协议
 */
class VPlatformContract extends Contract {
  componentCode: string | null = null
  windowCode: string | null = null
  scopeId: string | null = null
  headers: { [code: string]: any } = {}

  /**
   * 设置构件编号
   */
  setComponentCode(componentCode: string) {
    this.componentCode = componentCode
  }

  /**
   * 设置窗体编号
   */
  setWindowCode(windowCode: string) {
    this.windowCode = windowCode
  }
  /**
   * 设置域id
   */
  setScopeId(scopeId: string) {
    this.scopeId = scopeId
  }
  /**
   *生成请求数据
   * @param {Object} operation
   */
  generate(request: any) {
    let operation = request.getOperations()[0]
    this.setHeader('ajaxRequest', true)
    this.setHeader('operation', operation.getOperation())
    this.setHeader('scopeId', scopeManager.getCurrentScopeId())
    let transactionId = operation.getTransactionId()
    if (transactionId != null && typeof transactionId != 'undefined') {
      this.setHeader('transaction_id', transactionId)
    }
    let data: { [code: string]: any } = {}
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

export default VPlatformContract
