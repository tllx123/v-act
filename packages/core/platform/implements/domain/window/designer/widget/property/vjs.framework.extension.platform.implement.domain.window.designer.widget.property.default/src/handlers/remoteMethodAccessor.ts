define('./remoteMethodAccessor', function (require, exports, module) {
  var scopeManager, remoteMethodAccessor

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    remoteMethodAccessor = sb.getService(
      'vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor'
    )
  }

  export function getHandlerName() {
    return 'remoteMethodAccessor'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (params) {
          return remoteMethodAccessor.invoke(params)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
