define('./handleWindowMapping', function (require, exports, module) {
  var scopeManager, AppData

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    AppData = sb.getService(
      'vjs.framework.extension.platform.data.storage.schema.param.ApplicationParam'
    )
  }

  /**
   * 处理窗体映射信息
   */
  var handleWindowMapping = function (componentCode, windowCode) {
    if (AppData && typeof AppData.getWindowMapping == 'function') {
      /* 获取窗体映射信息 */
      return AppData.getWindowMapping({
        componentCode: componentCode,
        windowCode: windowCode
      })
    }
    return null
  }

  exports.handleWindowMapping = handleWindowMapping

  export function getHandlerName() {
    return 'handleWindowMapping'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (componentCode, windowCode) {
          return handleWindowMapping(componentCode, windowCode)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
