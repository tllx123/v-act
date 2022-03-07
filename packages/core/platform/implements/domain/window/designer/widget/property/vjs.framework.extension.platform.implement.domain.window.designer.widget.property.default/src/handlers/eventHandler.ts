define('./eventHandler', function (require, exports, module) {
  var scopeManager, eventHandler

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    eventHandler = sb.getService(
      'vjs.framework.extension.platform.services.view.event.EventManager'
    )
  }

  export function getHandlerName() {
    return 'eventHandler'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetCode, eventName) {
          return eventHandler.fireEvent(widgetCode, eventName)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
