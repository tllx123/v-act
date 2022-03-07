define('./windowVariant', function (require, exports, module) {
  var scopeManager, windowParam

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    windowParam = sb.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
  }

  export function getHandlerName() {
    return 'windowVariant'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (code) {
          return windowParam.getInput({
            code: code
          })
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
