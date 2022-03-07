define('./fieldValue', function (require, exports, module) {
  var scopeManager, datasourceUtil

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    datasourceUtil = sb.getService(
      'vjs.framework.extension.platform.services.view.logic.datasource.DatasourceUtil'
    )
  }

  export function getHandlerName() {
    return 'fieldValue'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (dsName, fieldCode) {
          return datasourceUtil.getSingleValue(dsName, fieldCode)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
