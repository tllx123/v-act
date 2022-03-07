import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

export function getHandlerName() {
  return 'browser.redirect'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        windowRelation.updateWindowInfo(container, params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
