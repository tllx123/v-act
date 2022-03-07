import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetRenderer as widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

export function getHandlerName() {
  return 'componentRender'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function () {
        var func = widgetRenderer.executeComponentRenderAction
        return func.apply(widgetRenderer, arguments)
      }
    })
    widgetProperty[property.code] = handler
  }
}
