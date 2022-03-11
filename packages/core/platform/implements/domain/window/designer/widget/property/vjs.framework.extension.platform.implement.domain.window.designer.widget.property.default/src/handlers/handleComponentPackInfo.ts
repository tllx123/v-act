import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global'

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

export { handleComponentPackInfo }

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
