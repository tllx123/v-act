define('./windowRelation.update', function (require, exports, module) {
  var scopeManager, windowRelation

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    windowRelation = sb.getService(
      'vjs.framework.extension.platform.services.view.relation.WindowContainerManager'
    )
  }

  export function getHandlerName() {
    return 'windowRelation.update'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (container, params) {
          windowRelation.updateWindowInfo(container, params)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
