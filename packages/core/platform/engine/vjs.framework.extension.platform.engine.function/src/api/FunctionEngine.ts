import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'

const execute = function (params) {
  let functionName = params.functionName,
    context = params.context,
    args = params.args
  let functionDef = sb.getService(functionName)
  if (!functionDef) {
    let exception = exceptionFactory.create({
      message:
        '[FunctionEngine.execute]函数【' +
        functionName +
        '】不存在，请检查是否已部署对应函数，并打包到functionLib模块中。',
      type: exceptionFactory.TYPES.UnExpected
    })
    throw exception
  }

  // 获取函数的主入口方法
  let mainFunc = functionDef.main
  if (mainFunc) {
    let mainFuncArgs = args ? args : [context]
    // 返回函数执行结果
    try {
      return mainFunc.apply(this, mainFuncArgs)
    } catch (e) {
      let exception = exceptionFactory.create({
        message:
          '[FunctionEngine.execute]函数【' +
          functionName +
          '】执行失败，请检查内部逻辑。' +
          e.message,
        type: exceptionFactory.TYPES.UnExpected,
        error: e
      })
      throw exception
    }
  } else {
    let exception = exceptionFactory.create({
      message:
        '[FunctionEngine.execute]函数【' +
        functionName +
        '】的实现不符合规范，没有实现主入口main方法，请检查内部逻辑。',
      type: exceptionFactory.TYPES.UnExpected,
      error: e
    })
    throw exception
  }
}

export { execute }
