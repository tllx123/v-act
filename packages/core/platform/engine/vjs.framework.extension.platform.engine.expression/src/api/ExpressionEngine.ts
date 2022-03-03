import * as formulaEngine from 'module'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import * as ExpressionContext from './api/ExpressionContext'

let undefined

exports.initModule = function (sb) {}

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
      message: '[ExpressionEngine.execute]不支持空表达式,请检查相关配置!',
      type: exceptionFactory.TYPES.UnExpected
    })
    throw exception
  }
  try {
    result = formulaEngine.Formula.eval(exp, ctx)
  } catch (e) {
    let exception = exceptionFactory.create({
      message:
        '[ExpressionEngine.execute]执行表达式【' +
        exp +
        '】出现错误,错误原因：' +
        e.message,
      type: exceptionFactory.TYPES.UnExpected,
      error: e
    })
    throw exception
  }
  return result
}

const parseVars = function (params) {
  let context = params.context,
    exp = params.expression
  let result
  if (!exp) {
    let error = exceptionFactory.create({
      type: exceptionFactory.TYPES.Expression,
      message: '[RemoteOperation.findExpVar]不支持空表达式,请检查相关配置!'
    })
    throw error
  }
  let ctx = new formulaEngine.Map()
  context = context || new ExpressionContext()
  ctx.put('expressionContext', context)
  try {
    result = formulaEngine.Formula.varFinder(exp, ctx)
  } catch (e) {
    let error = exceptionFactory.create({
      type: exceptionFactory.TYPES.Expression,
      message:
        '解释表达式【' + exp + '】中的变量出现错误,错误原因：' + e.message,
      error: e
    })
    throw error
  }
  return result
}

export { execute, parseVars }
