import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

export function getHandlerName() {
  return 'getWidgetContextProperty'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (widgetCode, propertyCode) {
        return widgetContext.get(widgetCode, propertyCode)
      }
    })
    widgetProperty[property.code] = handler
  }
}
