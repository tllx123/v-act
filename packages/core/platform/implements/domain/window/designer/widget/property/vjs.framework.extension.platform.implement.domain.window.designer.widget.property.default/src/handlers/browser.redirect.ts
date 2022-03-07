define('./browser.redirect', function (require, exports, module) {
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
})
