define('./expression', function (require, exports, module) {
  var scopeManager, expEngine, ExpContext

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    expEngine = sb.getService(
      'vjs.framework.extension.platform.services.engine.expression.ExpressionEngine'
    )
    ExpContext = sb.getService(
      'vjs.framework.extension.platform.services.engine.expression.ExpressionContext'
    )
  }

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
})
