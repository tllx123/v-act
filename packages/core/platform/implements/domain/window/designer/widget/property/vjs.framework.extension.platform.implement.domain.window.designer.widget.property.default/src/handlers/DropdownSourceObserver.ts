import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DropdownSourceObserver } from '@v-act/vjs.framework.extension.ui.common.plugin.services.widget'

export function getHandlerName() {
  return 'DropdownSourceObserver'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        return new DropdownSourceObserver(params)
      }
    })
    widgetProperty[property.code] = handler
  }
}
