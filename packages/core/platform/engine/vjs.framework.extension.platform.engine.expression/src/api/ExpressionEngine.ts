import * as formulaEngine from 'module'

import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import * as ExpressionContext from './ExpressionContext'

const execute = function (params) {
  let context = params.context,
    exp = params.expression
  // 使用函数执行器
  //TODO xiedh
  //context.put('executor', ruleExecutor['functionHandler']);
  //TODO xiedh
  //context.put('sandBox', sandbox);
  let ctx = new formulaEngine.Map()
  context = context || new ExpressionContext()
  ctx.put('expressionContext', context)
  let result
  if (!exp) {
    let exception = exceptionFactory.create({
      message: '不支持空表达式,请检查相关配置!',
      exceptionDatas: genExceptionData(),
      type: exceptionFactory.TYPES.Config
    })
    throw exception
  }
  try {
    result = formulaEngine.Formula.eval(exp, ctx)
  } catch (e) {
    if (exceptionFactory.isException(e)) {
      throw e
    } else {
      throw new Error(
        '执行表达式【' + exp + '】出现错误,错误原因：' + e.message,
        undefined,
        undefined,
        exceptionFactory.getExceptionTypeByError(e)
      )
    }
  }
  return result
}

const parseVars = function (params) {
  let context = params.context,
    exp = params.expression
  let result
  if (!exp) {
    let error = exceptionFactory.create({
      type: exceptionFactory.TYPES.Config,
      exceptionDatas: genExceptionData(),
      message: '不支持空表达式,请检查相关配置!'
    })
    throw error
  }
  let ctx = new formulaEngine.Map()
  context = context || new ExpressionContext()
  ctx.put('expressionContext', context)
  try {
    result = formulaEngine.Formula.varFinder(exp, ctx)
  } catch (e) {
    throw new Error(
      '解释表达式【' + exp + '】中的变量出现错误,错误原因：' + e.message
    )
  }
  return result
}

let genExceptionData = function (exp) {
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
      name: '表达式',
      code: 'experssion',
      value: exp
    }
  ]
}
export { execute, parseVars }
