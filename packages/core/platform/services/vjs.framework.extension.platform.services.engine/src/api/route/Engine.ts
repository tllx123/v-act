import { RouteEngine } from '@v-act/vjs.framework.extension.platform.engine.route'

const execute = function (params) {
  if (params.config && params.config.success) {
    let paramObj = Object.create(params)
    paramObj.config.callback = params.config.success
    params = paramObj
  }
  return RouteEngine.execute(params)
}

const executeWindowRoute = function (params) {
  return RouteEngine.executeWindowRoute(params)
}

export { execute, executeWindowRoute }
