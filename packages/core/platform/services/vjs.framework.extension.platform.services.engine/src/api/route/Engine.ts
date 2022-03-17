let sandBox

export function initModule(sb) {
  sandBox = sb
}

const execute = function (params) {
  let RouteEngine = sandBox.getService(
    'vjs.framework.extension.platform.engine.route.RouteEngine'
  )
  if (params.config && params.config.success) {
    let paramObj = Object.create(params)
    paramObj.config.callback = params.config.success
    params = paramObj
  }
  return RouteEngine.execute(params)
}

const executeWindowRoute = function (params) {
  let RouteEngine = sandBox.getService(
    'vjs.framework.extension.platform.engine.route.RouteEngine'
  )
  return RouteEngine.executeWindowRoute(params)
}

export { excuteRouteExp, execute, executeWindowRoute, parseVars }
