import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'

import Context from './Context'

const execute = function (params) {
  let ctx = params.context ? params.context.getExpressionContext() : null
  let p = { expression: params.expression, context: ctx }
  return expressionEngine.execute(p)
}

const excuteRouteExp = function (params) {
  let context = new Context()
  context.setRouteContext(params.routeContext)
  let p = {
    expression: params.expression,
    context: context.getExpressionContext()
  }
  return expressionEngine.execute(p)
}

const parseVars = function (params) {
  let p = {
    expression: params.expression,
    context: params.context.getExpressionContext()
  }
  return expressionEngine.parseVars(p)
}

export { excuteRouteExp, execute, parseVars }
