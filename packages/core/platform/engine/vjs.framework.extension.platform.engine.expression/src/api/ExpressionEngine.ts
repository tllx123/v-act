import * as formulaEngine from 'module'

import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import newContext from './Context'
import * as ExpressionContext from './ExpressionContext'
import { ParseExpression } from './ParseExpression'

let _threadFunContext = null

export function _setThreadFunContext(ctx: any) {
  _threadFunContext = ctx
}

export function _clearThreadFunContext() {
  _threadFunContext = null
}

interface IExecuteParams {
  context: any
  expression: any
}

const execute = function (params: IExecuteParams) {
  let { context, expression } = params
  if (!expression) {
    throw exceptionFactory.create({
      type: exceptionFactory.TYPES.Config,
      exceptionDatas: genExceptionData(),
      message: '不支持空表达式,请检查相关配置!'
    })
  }

  // 使用函数执行器
  context = new newContext(context)
  let funMain = `return  ${ParseExpression(expression)}`
  let result: Function = new Function('context', funMain)

  try {
    return result(context)
  } catch (e) {
    throw new Error(
      '解释表达式【' + expression + '】中的变量出现错误,错误原因：' + e.message
    )
  }
}

const parseVars = function (params: IExecuteParams) {
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
