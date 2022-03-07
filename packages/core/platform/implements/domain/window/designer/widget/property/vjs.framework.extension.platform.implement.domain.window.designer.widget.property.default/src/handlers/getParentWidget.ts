define('./getParentWidget', function (require, exports, module) {
  var scopeManager, widgetRelation

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    widgetRelation = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.relation.WidgetRelation'
    )
  }

  export function getHandlerName() {
    return 'getParentWidget'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (code) {
          var parentCode = widgetRelation.getParent(code)
          var scope = scopeManager.getChildWindowScope()
          return scope.getWidgets()[parentCode]
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
