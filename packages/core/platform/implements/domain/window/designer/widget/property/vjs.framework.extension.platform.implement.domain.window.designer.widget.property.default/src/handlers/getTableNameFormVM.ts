import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

export function getHandlerName() {
  return 'getTableNameFormVM'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (widgetId) {
        if (!widgetId) {
          widgetId = this.code
        }
        var datasourceNames = windowVmManager.getDatasourceNamesByWidgetCode({
          widgetCode: widgetId
        })
        var dsName = datasourceNames ? datasourceNames[0] : null
        return dsName
      }
    })
    widgetProperty[property.code] = handler
  }
}
