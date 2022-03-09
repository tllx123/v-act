import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WindowContainerManager as windowRelation } from '@v-act/vjs.framework.extension.platform.services.view.relation'

export function getHandlerName() {
  return 'windowRelation.getByCondition'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        return windowRelation.getByConditions(params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
