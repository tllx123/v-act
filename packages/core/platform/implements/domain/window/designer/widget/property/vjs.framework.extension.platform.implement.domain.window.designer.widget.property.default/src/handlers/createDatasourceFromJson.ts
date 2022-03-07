define('./createDatasourceFromJson', function (require, exports, module) {
  var scopeManager, datasourceFactory

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    datasourceFactory = sb.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
  }

  export function getHandlerName() {
    return 'createDatasourceFromJson'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (json) {
          return datasourceFactory.unSerialize(json)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
