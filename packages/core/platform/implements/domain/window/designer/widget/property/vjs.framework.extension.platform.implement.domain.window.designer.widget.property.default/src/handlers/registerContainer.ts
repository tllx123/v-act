define('./registerContainer', function (require, exports, module) {
  var scopeManager, containerRelation

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    containerRelation = sb.getService(
      'vjs.framework.extension.ui.common.plugin.services.container.ContainerRelation'
    )
  }

  export function getHandlerName() {
    return 'registerContainer'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (domID, child, property) {
          return containerRelation.register(domID, child, property)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
