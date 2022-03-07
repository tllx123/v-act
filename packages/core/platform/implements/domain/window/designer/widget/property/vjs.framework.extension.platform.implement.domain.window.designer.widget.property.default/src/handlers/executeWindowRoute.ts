import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'

export function getHandlerName() {
  return 'executeWindowRoute'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        return routeEngine.executeWindowRoute(params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
