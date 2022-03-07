import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowContainerManager as windowRelation } from '@v-act/vjs.framework.extension.platform.services.view.relation'

export function getHandlerName() {
  return 'windowRelation.update'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (container, params) {
        windowRelation.updateWindowInfo(container, params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
