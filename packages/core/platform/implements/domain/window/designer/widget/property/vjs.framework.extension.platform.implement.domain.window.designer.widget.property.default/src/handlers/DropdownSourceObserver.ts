define('./DropdownSourceObserver', function (require, exports, module) {
  var scopeManager, DropdownSourceObserver

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    DropdownSourceObserver = sb.getService(
      'vjs.framework.extension.ui.common.plugin.services.widget.DropdownSourceObserver'
    )
  }

  export function getHandlerName() {
    return 'DropdownSourceObserver'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (params) {
          return new DropdownSourceObserver(params)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
