define('./getCurrencyField', function (require, exports, module) {
  var scopeManager

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
  }

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
})
