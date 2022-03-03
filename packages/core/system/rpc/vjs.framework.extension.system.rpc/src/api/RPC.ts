import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Manager as contractManager } from '@v-act/vjs.framework.extension.system.rpc.contract'
import { Manager as channelManager } from '@v-act/vjs.framework.extension.system.rpc.channel'
import { Proxy as Proxy } from '@v-act/vjs.framework.extension.system.rpc.proxy'
import { Operation as Operation } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { Request as Request } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'

let _URI = 'module-operation!'

let SimpleRequestURI = _URI + 'executeOperation'

let MultiRequestURI = _URI + 'executeMultiOperation'

let undefined
let undefined

exports.initModule = function (sb) {}

/**
 * result  后台返回结果 result
 * isAsync 是否异步  异步true  同步false
 */
let exHandler = function (result, isAsync) {
  throw result
}

let rq = function (request, contractType, channelType, config) {
  let Contract = contractManager.getCurrentContractService(contractType)
  let contract = Contract ? new Contract() : null
  let Channel = channelManager.getCurrentChannelService(channelType)
  let channel = Channel ? new Channel() : null
  if (channel && config && config.hasOwnProperty('type')) {
    channel.setType(config.type)
  }
  let proxy = new Proxy()
  proxy.setChannel(channel)
  proxy.setContract(contract)
  return proxy.request(request)
}

let invoke = function (config, contractType, channelType) {
  let opt = new Operation()
  let request = new Request()
  opt.setOperation(config.operationName)
  opt.setComponentCode(config.componentCode)
  opt.setWindowCode(config.windowCode)
  opt.setBeforeRequest(config.beforeRequest)
  opt.setTransactionId(config.transactionId)
  opt.addParams(config.param)
  if (config.param && config.param.$_sourceWindow) {
    opt.setSourceWindow(config.param.$_sourceWindow)
  }
  request.setErrorCallback(
    typeof config.error == 'function' ? config.error : null
  )
  request.setOperations([opt])
  request.setHost(config.host)
  //		request.setSuccessCallback(config.afterResponse);
  let tmpUUID = 'RPC_' + uuid.generate()
  eventManager.fire({
    event: eventManager.Events.BeforeRPC,
    args: [request, tmpUUID]
  })
  let successback = function () {
    eventManager.fire({
      event: eventManager.Events.AfterRPC,
      args: [request, tmpUUID]
    })
    if (typeof config.afterResponse == 'function') {
      config.afterResponse.apply(this, arguments)
    }
  }
  request.setSuccessCallback(successback)
  request.setAsync(!!config.isAsync)
  request.setTimeout(config.timeout)
  return rq(request, contractType, channelType, config)
}

const invokeOperation = function (config) {
  let type = 'vPlatform'
  return invoke(config, type, type)
}

const invokeExtensibleOperation = function (config) {
  return invoke(config, 'extensionVPlatform', 'vPlatform')
}

const request = function (request) {
  let type = 'multiVPlatform'
  return rq(request, type, type)
}

const orginalRequest = function (config) {
  return invoke(config, 'common', 'common')
}

const log = function (params) {
  try {
    let scopeId = params.contract.headers.scopeId
    let scope = scopeManager.getScope(scopeId)
    let isWindowScope = scopeManager.isWindowScope(scopeId)
    let params = {
      isWindowScope: isWindowScope,
      operation: 'AjaxLog',
      componentCode: scope.getComponentCode(),
      request: params.request,
      contract: params.contract,
      response: params.response,
      responseStatus: params.responseStatus
    }
    if (isWindowScope) {
      params.windowCode = scope.getWindowCode()
    }
    exports.invokeOperation(params)
  } catch (e) {
    log.error(e.message)
  }
}

const crossDomainRequest = function (params) {
  if (!params.param) params.param = {}
  params.param._$v3CrossDomainRequest$_ = true
  return invoke(params, 'common', 'crossDomain')
}

//TODO
window.RPC = exports
export {
  invokeOperation,
  invokeExtensibleOperation,
  request,
  orginalRequest,
  log,
  crossDomainRequest
}
