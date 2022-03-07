define('./getTableNameFormVM', function (require, exports, module) {
  var scopeManager, windowVmManager

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    windowVmManager = sb.getService(
      'vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager'
    )
  }

  export function getHandlerName() {
    return 'getTableNameFormVM'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetId) {
          if (!widgetId) {
            widgetId = this.code
          }
          var datasourceNames = windowVmManager.getDatasourceNamesByWidgetCode({
            widgetCode: widgetId
          })
          var dsName = datasourceNames ? datasourceNames[0] : null
          return dsName
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
