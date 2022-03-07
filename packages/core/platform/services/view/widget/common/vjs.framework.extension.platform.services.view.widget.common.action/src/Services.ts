import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let sb
/**
 * 获取当前构件体系下的服务
 *
 * @serviceName 服务名
 */
let getService = function (serviceName) {
  let seriesType = scopeManager.getWindowScope().getSeries()
  let service = sb.getService(serviceName, {
    type: seriesType
  })
  if (service == null) {
    throw new Error(
      '[Services.getService]获取服务失败！原因：控件体系[' +
        seriesType +
        ']未找到服务[' +
        serviceName +
        ']'
    )
  }
  return service
}

export { getService }
