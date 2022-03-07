define('./entity', function (require, exports, module) {
  var scopeManager, datasourceManager

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    datasourceManager = sb.getService(
      'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
    )
  }

  export function getHandlerName() {
    return 'entity'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (dsName) {
          return datasourceManager.lookup({
            datasourceName: dsName
          })
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
