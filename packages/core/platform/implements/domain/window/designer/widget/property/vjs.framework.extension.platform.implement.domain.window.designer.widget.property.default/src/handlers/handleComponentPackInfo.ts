define('./handleComponentPackInfo', function (require, exports, module) {
  var scopeManager, componentPackData

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    componentPackData = sb.getService(
      'vjs.framework.extension.platform.global.data.ComponentPackData'
    )
  }

  /**
   * 处理构件包信息
   */
  var handleComponentPackInfo = function (componentCode, windowCode) {
    var result = null
    var info = {
      componentCode: componentCode,
      code: windowCode
    }
    if (componentPackData.existMapping(info)) {
      var newInfo = componentPackData.getMapping(info)
      if (newInfo) {
        result = {
          componentCode: newInfo.componentCode,
          windowCode: newInfo.windowCode
        }
      }
    }
    return result
  }

  exports.handleComponentPackInfo = handleComponentPackInfo

  export function getHandlerName() {
    return 'handleComponentPackInfo'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (componentCode, windowCode) {
          return handleComponentPackInfo(componentCode, windowCode)
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
