import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'

export function getHandlerName() {
  return 'windowVariant'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (code) {
        return windowParam.getInput({
          code: code
        })
      }
    })
    widgetProperty[property.code] = handler
  }
}
