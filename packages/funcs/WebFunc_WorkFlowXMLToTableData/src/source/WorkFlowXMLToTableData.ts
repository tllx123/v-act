let sandbox
export function initModule(sb) {
  sandbox = sb
}

/**
 * 主入口
 * @param arguments 表名集合
 */
const main = function (param: FunctionContext) {
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

export { main }
