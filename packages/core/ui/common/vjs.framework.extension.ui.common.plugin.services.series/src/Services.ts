import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

let getService = function (serviceName) {
  let widgetSeries = ScopeManager.getProperty('type')
  let service = sandbox.getService(serviceName, { type: widgetSeries })
  if (service == null) {
    throw Error(
      '未能找到服务，原因：未找到，体系为' +
        widgetSeries +
        '的服务名称：' +
        serviceName
    )
  }

  return service
}

export { getSeries, getService }
