import { RPC as rpc } from '@v-act/vjs.framework.extension.system'

let undefined

let _URI = 'module-operation!'

let MultiRequestURI = _URI + 'executeMultiOperation'

exports.initModule = function (sb) {}

const request = function (params) {
  return rpc.request(params.request)
}

const orginalRequest = function (params) {
  return rpc.orginalRequest(params)
}

const crossDomainRequest = function (params) {
  return rpc.crossDomainRequest(params)
}

export { request, orginalRequest, crossDomainRequest }
