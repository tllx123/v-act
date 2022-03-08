import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { ContainerRelation as containerRelation } from '@v-act/vjs.framework.extension.ui.common.plugin.services.container'

export function getHandlerName() {
  return 'containerParent'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (prewindowCode) {
        return containerRelation.getParent(prewindowCode)
      }
    })
    widgetProperty[property.code] = handler
  }
}
