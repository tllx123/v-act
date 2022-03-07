define('./getWidgetContextProperty', function (require, exports, module) {
  var scopeManager, widgetContext

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    widgetContext = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext'
    )
  }

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
})
