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
  functionEngine.execute({
    functionName: 'VRestoreXMLToEntity',
    context: new FunctionContext(args, null)
  })
}

export { initModule, main }
