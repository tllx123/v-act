import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'

export function getHandlerName() {
  return 'serverExpression'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var windowCode = scopeManager.getWindowScope().getWindowCode()
    var handler = scopeManager.createScopeHandler({
      handler: function (expression) {
        return remoteOperation.executeFormulaExpression({
          windowCode: windowCode,
          expression: expression
        })
      }
    })
    widgetProperty[property.code] = handler
  }
}
