import { RPC as rpc } from '@v-act/vjs.framework.extension.system.rpc'

let _URI = 'module-operation!'

let MultiRequestURI = _URI + 'executeMultiOperation'

// export function initModule(sb) {}

const request = function (params: any) {
  return rpc.request(params.request)
}

const orginalRequest = function (params: unknown) {
  return rpc.orginalRequest(params)
}

const crossDomainRequest = function (params: unknown) {
  return rpc.crossDomainRequest(params)
}

export { crossDomainRequest, orginalRequest, request }
