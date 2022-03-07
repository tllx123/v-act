import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function getHandlerName() {
  return 'menuAction'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (type) {
        var menuAction = sandbox.getService(
          'vjs.framework.extension.platform.services.view.widget.common.logic.menu.action',
          {
            type: type
          }
        )
        if (menuAction) {
          var result = {}
          for (var method in menuAction) {
            if (menuAction.hasOwnProperty(method)) {
              result[method] = scopeManager.createScopeHandler({
                handler: menuAction[method]
              })
            }
          }
          return result
        } else {
          return null
        }
      }
    })
    widgetProperty[property.code] = handler
  }
}
