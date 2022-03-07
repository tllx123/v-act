import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { EventManager as eventHandler } from '@v-act/vjs.framework.extension.platform.services.view.event'

export function getHandlerName() {
  return 'eventCaller'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (eventName, success, fail) {
        return eventHandler.fireDynamicWidgetEvent(eventName, success, fail)
      }
    })
    widgetProperty[property.code] = handler
  }
}
