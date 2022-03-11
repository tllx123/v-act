import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { ApplicationParam as AppData } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'

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

export { handleWindowMapping }

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
