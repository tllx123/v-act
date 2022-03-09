import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

export function getHandlerName() {
  return 'entity'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (dsName) {
        return datasourceManager.lookup({
          datasourceName: dsName
        })
      }
    })
    widgetProperty[property.code] = handler
  }
}
