import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

export function getHandlerName() {
  return 'createDatasourceFromJson'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (json) {
        return datasourceFactory.unSerialize(json)
      }
    })
    widgetProperty[property.code] = handler
  }
}
