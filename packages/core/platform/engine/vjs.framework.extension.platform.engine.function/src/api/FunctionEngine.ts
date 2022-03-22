import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

const execute = function (params: {
  functionName: string
  context?: FunctionContext
  args?: any[]
}) {
  let functionName = params.functionName,
    context = params.context,
    args = params.args
  //let functionDef = sb.getService(functionName)
  const windowScope = scopeManager.getWindowScope()
  const funcDefines = windowScope.get('funcDefines')
  const functionDef = funcDefines[functionName]
  if (!functionDef) {
    let exception = exceptionFactory.create({
      message:
        '函数【' +
        functionName +
        '】不存在，请检查是否已部署对应函数，并打包到functionLib模块中。',
      exceptionDatas: genExceptionData(
        (context && context.args) || '',
        functionName
      ),
      type: exceptionFactory.TYPES.System
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
    } catch (e: any) {
      if (exceptionFactory.isException(e)) {
        //属于平台异常对象就直接抛出，如：函数调用后台报错
        throw e
      } else {
        let exception = exceptionFactory.create({
          message:
            '函数【' + functionName + '】执行失败，错误原因：' + e.message,
          type: exceptionFactory.getExceptionTypeByError(
            e,
            exceptionFactory.TYPES.System
          ),
          exceptionDatas: genExceptionData(
            (context && context.args) || '',
            functionName
          ),
          error: e
        })
        throw exception
      }
    }
  } else {
    let exception = exceptionFactory.create({
      message:
        '函数【' +
        functionName +
        '】的实现不符合规范，没有实现主入口main方法，请检查内部逻辑。',
      type: exceptionFactory.TYPES.System,
      exceptionDatas: genExceptionData(
        (context && context.args) || '',
        functionName
      ),
      error: e
    })
    throw exception
  }
}

let genExceptionData = function (args: any, functionName: string) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()
  let windowCode = scopeManager.isWindowScope(scope.getInstanceId())
    ? scope.getWindowCode()
    : null
  return [
    {
      name: '构件编码',
      code: 'componentCode',
      value: componentCode
    },
    {
      name: '窗体编码',
      code: 'windowCode',
      value: windowCode
    },
    {
      name: '函数编码',
      code: 'functionCode',
      value: functionName
    },
    {
      name: '函数参数',
      code: 'functionParams',
      value: args
    }
  ]
}

export { execute }
