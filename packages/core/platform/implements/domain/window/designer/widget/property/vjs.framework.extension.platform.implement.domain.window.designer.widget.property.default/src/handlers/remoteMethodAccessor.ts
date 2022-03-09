import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'

export function getHandlerName() {
  return 'remoteMethodAccessor'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        return remoteMethodAccessor.invoke(params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
