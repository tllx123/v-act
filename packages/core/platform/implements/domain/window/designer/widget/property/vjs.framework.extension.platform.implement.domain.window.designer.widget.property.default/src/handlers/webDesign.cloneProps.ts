define('./webDesign.cloneProps', function (require, exports, module) {
  var scopeManager, datasourceManager, processorUtils

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    datasourceManager = sb.getService(
      'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
    )
    processorUtils = sb.getService(
      'vjs.framework.extension.platform.application.window.web.designer.utils'
    )
  }

  export function getHandlerName() {
    return 'webDesign.cloneProps'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (designerMenuDatas, items, itemCodeMap) {
          processorUtils.cloneProps(designerMenuDatas, items, itemCodeMap)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
