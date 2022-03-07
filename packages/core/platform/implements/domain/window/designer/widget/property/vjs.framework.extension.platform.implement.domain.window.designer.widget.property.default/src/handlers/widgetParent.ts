import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'

export function getHandlerName() {
  return 'widgetParent'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (widgetCode) {
        return widgetRelation.getParent(widgetCode)
      }
    })
    widgetProperty[property.code] = handler
  }
}
