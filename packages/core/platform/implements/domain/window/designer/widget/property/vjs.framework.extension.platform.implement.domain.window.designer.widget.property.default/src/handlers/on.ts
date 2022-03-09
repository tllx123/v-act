import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { EventManager as eventHandler } from '@v-act/vjs.framework.extension.platform.services.view.event'

export function getHandlerName() {
  return 'on'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (widgetCode, eventName, handler) {
        return eventHandler.addEventHandler(widgetCode, eventName, handler)
      }
    })
    widgetProperty[property.code] = handler
  }
}
