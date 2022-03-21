import { RouteEngine } from '@v-act/vjs.framework.extension.platform.engine.route'

const execute = function (params: any) {
  if (params.config && params.config.success) {
    let paramObj = Object.create(params)
    paramObj.config.callback = params.config.success
    params = paramObj
  }
  return RouteEngine.execute(params)
}

const executeWindowRoute = function (params: any) {
  return RouteEngine.executeWindowRoute(params)
}

export { execute, executeWindowRoute }
