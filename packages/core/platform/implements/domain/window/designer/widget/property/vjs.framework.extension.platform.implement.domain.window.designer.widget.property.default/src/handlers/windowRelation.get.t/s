import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowContainerManager as windowRelation } from '@v-act/vjs.framework.extension.platform.services.view.relation'

export function getHandlerName() {
  return 'windowRelation.get'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (id) {
        return windowRelation.get(id)
      }
    })
    widgetProperty[property.code] = handler
  }
}
