import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { EventManager as eventHandler } from '@v-act/vjs.framework.extension.platform.services.view.event'

export function getHandlerName() {
  return 'eventHandler'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (widgetCode, eventName) {
        return eventHandler.fireEvent(widgetCode, eventName)
      }
    })
    widgetProperty[property.code] = handler
  }
}
