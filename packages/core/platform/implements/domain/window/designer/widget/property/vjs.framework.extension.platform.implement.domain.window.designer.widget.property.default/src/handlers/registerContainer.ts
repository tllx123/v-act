import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { ContainerRelation as containerRelation } from '@v-act/vjs.framework.extension.ui.common.plugin.services.container'

export function getHandlerName() {
  return 'registerContainer'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (domID, child, property) {
        return containerRelation.register(domID, child, property)
      }
    })
    widgetProperty[property.code] = handler
  }
}
