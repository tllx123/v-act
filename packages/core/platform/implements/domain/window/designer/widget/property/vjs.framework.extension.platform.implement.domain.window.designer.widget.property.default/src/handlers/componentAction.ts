define('./componentAction', function (require, exports, module) {
  var scopeManager, widgetAction

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    widgetAction = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.action.WidgetAction'
    )
  }

  export function getHandlerName() {
    return 'componentAction'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function () {
          var func = widgetAction.executeComponentAction
          return func.apply(widgetAction, arguments)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
