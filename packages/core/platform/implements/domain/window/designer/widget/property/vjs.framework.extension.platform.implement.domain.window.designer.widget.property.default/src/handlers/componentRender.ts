define('./componentRender', function (require, exports, module) {
  var scopeManager, widgetRenderer

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    widgetRenderer = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.action.WidgetRenderer'
    )
  }

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
})
