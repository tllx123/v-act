import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'

export function getHandlerName() {
  return 'getParentWidget'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (code) {
        var parentCode = widgetRelation.getParent(code)
        var scope = scopeManager.getChildWindowScope()
        return scope.getWidgets()[parentCode]
      }
    })
    widgetProperty[property.code] = handler
  }
}
