define('./containerParent', function (require, exports, module) {
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
    return 'containerParent'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (prewindowCode) {
          return containerRelation.getParent(prewindowCode)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
