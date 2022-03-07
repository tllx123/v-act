define('./on', function (require, exports, module) {
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
    return 'on'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetCode, eventName, handler) {
          return eventHandler.addEventHandler(widgetCode, eventName, handler)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
