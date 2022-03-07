define('./remoteOperation', function (require, exports, module) {
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
    return 'remoteOperation'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (params) {
          if (!params) {
            return
          }
          var windowScope = scopeManager.getWindowScope()
          if (!params.componentCode) {
            params.componentCode = windowScope.getComponentCode()
          }
          if (!params.windowCode) {
            params.windowCode = windowScope.getWindowCode()
          }
          return remoteOperation.request(params)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
