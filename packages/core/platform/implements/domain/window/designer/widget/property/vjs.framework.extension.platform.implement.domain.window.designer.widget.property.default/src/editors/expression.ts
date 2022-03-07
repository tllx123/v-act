import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { ExpressionEngine as expEngine } from '@v-act/vjs.framework.extension.platform.services.engine'

import { ExpressionContext as ExpContext } from '@v-act/vjs.framework.extension.platform.services.engine'

export function getType() {
  return 'expression'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var editor = property.editor
    var handleProp = editor.handleProp
    if (handleProp) {
      var handler = scopeManager.createScopeHandler({
        handler: function (exp) {
          var ctx = new ExpContext()
          return exp == null || exp == ''
            ? ''
            : expEngine.execute({
                expression: exp,
                context: ctx
              })
        }
      })
      widgetProperty[handleProp] = handler
    }
  }
}
