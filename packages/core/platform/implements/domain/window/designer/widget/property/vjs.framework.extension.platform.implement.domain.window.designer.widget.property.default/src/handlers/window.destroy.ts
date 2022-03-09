import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function getHandlerName() {
  return 'window.destroy'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (scopeId) {
        scopeManager.destroy(scopeId)
      }
    })
    widgetProperty[property.code] = handler
  }
}
