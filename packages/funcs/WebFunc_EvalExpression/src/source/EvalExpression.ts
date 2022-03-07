import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    expressionSrc = argsLen >= 1 ? args[0] : null

  let context = new ExpressionContext()
  context.setRouteContext(param.routeContext)
  let value = engine.execute({
    expression: expressionSrc,
    context: context
  })
  return value
}

export { main }
