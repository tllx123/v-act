let sandbox

const initModule = function (sb) {
  sandbox = sb
}

/**
 * 主入口
 * @param arguments 表名集合
 */
let main = function (param) {
  let args = param.getArgs()
  let functionEngine = sandbox.getService(
    'vjs.framework.extension.platform.services.engine.function.FunctionEngine'
  )
  let FunctionContext = sandbox.getService(
    'vjs.framework.extension.platform.interface.function.FunctionContext'
  )
  let xml = functionEngine.execute({
    functionName: 'VConvertEntityToXML',
    context: new FunctionContext(args, null)
  })
  return xml
}

export { initModule, main }
