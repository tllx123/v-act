import { ProcessorUtils as processorUtils } from '@v-act/vjs.framework.extension.platform.application.window.web.designer.utils'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

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
