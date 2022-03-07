define('./window.destroy', function (require, exports, module) {
  var scopeManager

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
  }

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
})
