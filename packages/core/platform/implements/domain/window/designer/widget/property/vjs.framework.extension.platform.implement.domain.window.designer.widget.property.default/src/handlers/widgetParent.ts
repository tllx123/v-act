define('./widgetParent', function (require, exports, module) {
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
    return 'widgetParent'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetCode) {
          return widgetRelation.getParent(widgetCode)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
