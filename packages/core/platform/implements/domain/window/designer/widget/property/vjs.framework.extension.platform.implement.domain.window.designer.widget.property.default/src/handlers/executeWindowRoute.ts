define('./executeWindowRoute', function (require, exports, module) {
  var scopeManager, routeEngine

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    routeEngine = sb.getService(
      'vjs.framework.extension.platform.services.engine.route.RouteEngine'
    )
  }

  export function getHandlerName() {
    return 'executeWindowRoute'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (params) {
          return routeEngine.executeWindowRoute(params)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
