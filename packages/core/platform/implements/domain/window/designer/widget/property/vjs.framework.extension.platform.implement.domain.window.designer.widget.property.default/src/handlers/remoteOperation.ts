import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'

export function getHandlerName() {
  return 'remoteOperation'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        if (!params) {
          return
        }
        var windowScope = scopeManager.getWindowScope()
        if (!params.componentCode) {
          params.componentCode = windowScope.getComponentCode()
        }
        if (!params.windowCode) {
          params.windowCode = windowScope.getWindowCode()
        }
        return remoteOperation.request(params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
