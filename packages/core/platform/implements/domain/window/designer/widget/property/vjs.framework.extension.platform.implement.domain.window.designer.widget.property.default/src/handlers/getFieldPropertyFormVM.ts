/**
 * 从映射中获取字段属性
 * */
define('./getFieldPropertyFormVM', function (require, exports, module) {
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
    return 'getFieldPropertyFormVM'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetId, fieldCode) {
          var columnId = windowVmManager.getPropertyCodeByFieldCode({
            widgetCode: widgetId,
            fieldCode: fieldCode
          })
          return columnId
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
