import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

import { processorUtils } from '@v-act/vjs.framework.extension.platform.application.window.web.designer.utils'

export function getHandlerName() {
  return 'webDesign.cloneProps'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (designerMenuDatas, items, itemCodeMap) {
        processorUtils.cloneProps(designerMenuDatas, items, itemCodeMap)
      }
    })
    widgetProperty[property.code] = handler
  }
}
