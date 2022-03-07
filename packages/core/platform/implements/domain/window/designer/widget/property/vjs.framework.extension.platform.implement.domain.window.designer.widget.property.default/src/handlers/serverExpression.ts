define('./serverExpression', function (require, exports, module) {
  var scopeManager, remoteOperation

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    remoteOperation = sb.getService(
      'vjs.framework.extension.platform.services.domain.operation.RemoteOperation'
    )
  }

  export function getHandlerName() {
    return 'serverExpression'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var windowCode = scopeManager.getWindowScope().getWindowCode()
      var handler = scopeManager.createScopeHandler({
        handler: function (expression) {
          return remoteOperation.executeFormulaExpression({
            windowCode: windowCode,
            expression: expression
          })
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
