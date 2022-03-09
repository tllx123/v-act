import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function getHandlerName() {
  return 'getCurrencyField'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (dsName) {
        var windowScope = scopeManager.getWindowScope()
        return windowScope.getCurrencyField()
      }
    })
    widgetProperty[property.code] = handler
  }
}
