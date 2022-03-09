import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let jsonUtil

let MultiContract = function () {
  this.headers = {}
}

MultiContract.prototype = {
  initModule: function (sb) {
    var manager = sb.getService(
      'vjs.framework.extension.system.rpc.contract.Manager'
    )
    manager.injectCurrentContract(MultiContract, 'multiVPlatform')
    var Contract = require('vjs/framework/extension/system/rpc/contract/vplatform/api/Contract')
    var objectUtil = sb.util.object
    var initFunc = Contract.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(Contract.prototype)
    prototype.constructor = MultiContract
    objectUtil.extend(prototype, MultiContract.prototype)
    MultiContract.prototype = prototype
  },
  /**
   *生成请求数据
   * @param {Request} request
   */
  generate: function (request) {
    this.setHeader('ajaxRequest', true)
    this.setHeader('scopeId', scopeManager.getCurrentScopeId())
    let operations = request.getOperations()
    let operation = operations[0]
    this.setHeader('componentCode', operation.getComponentCode())
    let tokenData = []
    let infos = {}
    for (let i = 0, l = operations.length; i < l; i++) {
      let o = operations[i]
      let wCode = o.getWindowCode()
      let cCode = o.getComponentCode()
      let operationData = {
        operation: o.getOperation(),
        componentCode: cCode,
        windowCode: wCode,
        moduleId: wCode,
        transaction_id: o.getTransactionId()
      }
      if (_notBlank(cCode) && _notBlank(wCode)) {
        let windows = infos[cCode]
        if (!windows) {
          windows = {}
          infos[cCode] = windows
        }
        windows[wCode] = true
      }
      let p = o.getParams()
      if (p) {
        for (let key in p) {
          if (p.hasOwnProperty(key)) {
            operationData[key] = p[key]
          }
        }
      }
      tokenData.push({ data: operationData })
    }
    let siglComponent = _keySize(infos) < 2
    if (siglComponent) {
      let wins
      for (let k in infos) {
        wins = infos[k]
      }
      let siglWindow = _keySize(wins) < 2
      if (siglWindow) {
        //单构件、单窗体的批量请求才设置窗体编号，便于后台进行权限校验
        let code
        for (let k in wins) {
          code = k
          break
        }
        this.setHeader('windowCode', code)
      }
    }
    let data = {}
    for (let attr in this.headers) {
      if (this.headers.hasOwnProperty(attr)) {
        data[attr] = this.headers[attr]
      }
    }
    data['token'] = this.serializeRequest(tokenData)
    return data
  }
}

let _notBlank = function (str) {
  return str != null && str != undefined
}

let _keySize = function (obj) {
  let s = 0
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      s++
    }
  }
  return s
}

return MultiContract