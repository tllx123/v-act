let sandBox

export function initModule(sb) {
  sandBox = sb
}

const execute = function (params) {
  let FunctionEngine = sandBox.getService(
    'vjs.framework.extension.platform.engine.function.FunctionEngine'
  )
  return FunctionEngine.execute(params)
}

export { execute, excuteRouteExp, parseVars, execute }
