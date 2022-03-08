import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { FunctionEngine as functionEngine } from '@v-act/vjs.framework.extension.platform.services.engine'

/**
 * 主入口
 * @param arguments 表名集合
 */
const main = function (param: FunctionContext) {
  let args = param.getArgs()

  let xml = functionEngine.execute({
    functionName: 'VConvertEntityToXML',
    context: new FunctionContext(args, null)
  })
  return xml
}

export { main }
