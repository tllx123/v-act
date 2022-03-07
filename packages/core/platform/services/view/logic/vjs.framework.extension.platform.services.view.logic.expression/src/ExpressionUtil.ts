import {
  ExpressionContext,
  ExpressionEngine as expressionEngine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'

export function initModule(sb) {}

let execute = function (expression, expressionContext) {
  return expressionEngine.execute({
    expression: expression,
    context: expressionContext ? expressionContext : new ExpressionContext()
  })
}

export { execute }
