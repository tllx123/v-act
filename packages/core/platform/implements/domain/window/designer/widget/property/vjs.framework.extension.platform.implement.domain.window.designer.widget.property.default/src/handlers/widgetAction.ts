import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

export function getHandlerName() {
  return 'widgetAction'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function () {
        var func = widgetAction.executeWidgetAction
        return func.apply(widgetAction, arguments)
      }
    })
    widgetProperty[property.code] = handler
  }
}
