import * as Context from './api/expression/Context'
let sandBox

exports.initModule = function (sb) {
  sandBox = sb
}

const execute = function (params) {
  let expressionEngine = sandBox.getService(
    'vjs.framework.extension.platform.engine.expression.ExpressionEngine'
  )
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
  let expressionEngine = sandBox.getService(
    'vjs.framework.extension.platform.engine.expression.ExpressionEngine'
  )
  return expressionEngine.execute(p)
}

const parseVars = function (params) {
  let expressionEngine = sandBox.getService(
    'vjs.framework.extension.platform.engine.expression.ExpressionEngine'
  )
  let p = {
    expression: params.expression,
    context: params.context.getExpressionContext()
  }
  return expressionEngine.parseVars(p)
}

export { execute, excuteRouteExp, parseVars }
