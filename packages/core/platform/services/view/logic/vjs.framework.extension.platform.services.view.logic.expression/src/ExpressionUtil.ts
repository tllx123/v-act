import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'

let undefined
let undefined

exports.initModule = function (sb) {}

let execute = function (expression, expressionContext) {
  return expressionEngine.execute({
    expression: expression,
    context: expressionContext ? expressionContext : new ExpressionContext()
  })
}

export { execute }
