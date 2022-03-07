import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'

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
