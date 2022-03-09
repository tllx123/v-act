/**
 * 从映射中获取字段属性
 * */

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

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
