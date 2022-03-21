import * as formulaEngine from 'module'

import * as parser from '@v-act/expression-parser'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import Context from './Context'
import * as ExpressionContext from './ExpressionContext'

const execute = function (params) {
  let context = params.context,
    exp = params.expression
  return exp
  // 使用函数执行器
  //TODO xiedh
  //context.put('executor', ruleExecutor['functionHandler']);
  //TODO xiedh
  //context.put('sandBox', sandbox);
  /*let ctx = new formulaEngine.Map()
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
  return result*/
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

const print = function (exp: string) {
  const syntax = parser.parse(exp)
  return parser.print(syntax, {
    printComponentVarSyntax: function (syntax, print) {
      return 'context.getComponontVar("' + syntax.getCode() + '")'
    },
    printWindowVarSyntax: function (syntax, print) {
      return 'context.getWindowVar("' + syntax.getCode() + '")'
    },
    printEntityFieldSyntax: function (syntax, print) {
      return (
        'context.getRecordValue("' +
        syntax.getEntityCode() +
        '","' +
        syntax.getFieldCode() +
        '")'
      )
    },
    printWidgetPropertySyntax: function (syntax, print) {
      return (
        'context.getWidgetProperty("' +
        syntax.getWidgetCode() +
        '","' +
        syntax.getPropertyCode() +
        '")'
      )
    },
    printFunctionSyntax: function (syntax, print) {
      const script = ['context.executeFunction("']
      script.push('"')
      script.push(',')
      script.push(syntax.getCode())
      script.push('"')
      script.push(',')
      const args = syntax.getArgs()
      if (args && args.length > 0) {
        args.forEach((arg) => {
          script.push(print(arg))
          script.push(',')
        })
      }
      script.pop()
      script.push(')')
      return script.join('')
    },
    printRuleBusinessResultSyntax: function (syntax, print) {
      return (
        'context.getRuleBusinessResult("' +
        syntax.getInstanceCode() +
        '","' +
        syntax.getResultCode() +
        '")'
      )
    },
    printRulesetEntityFieldInputSyntax: function (syntax, print) {
      return (
        'context.getRulesetEntityFieldInput("' +
        syntax.getEntityCode() +
        '","' +
        syntax.getFieldCode() +
        '")'
      )
    },
    printRulesetEntityFieldOutputSyntax: function (syntax, print) {
      return (
        'context.getRulesetEntityFieldOut("' +
        syntax.getEntityCode() +
        '","' +
        syntax.getFieldCode() +
        '")'
      )
    },
    printRulesetEntityFieldVarSyntax: function (syntax, print) {
      return (
        'context.getRulesetEntityFieldVar("' +
        syntax.getEntityCode() +
        '","' +
        syntax.getFieldCode() +
        '")'
      )
    },
    printRulesetInputSyntax: function (syntax, print) {
      return 'context.getRulesetInput("' + syntax.getCode() + '")'
    },
    printRulesetOutputSyntax: function (syntax, print) {
      return 'context.getRulesetOutput("' + syntax.getCode() + '")'
    },
    printRulesetVarSyntax: function (syntax, print) {
      return 'context.getRulesetVar("' + syntax.getCode() + '")'
    },
    printBooleanIdentifierSyntax: function (syntax, print) {
      return `${syntax.getValue()}`
    },
    printNotEqualSyntax: function (syntax, print) {
      return `${print(syntax.getLeft())}!=${print(syntax.getRight())}`
    }
  })
}

const parseMethods = function (params: { expression: any; context: any }) {
  let exp = params.expression

  if (!exp) {
    let error = exceptionFactory.create({
      type: exceptionFactory.TYPES.Config,
      exceptionDatas: genExceptionData(),
      message: '不支持空表达式,请检查相关配置!'
    })
    throw error
  }

  let result: Function = new Function('context', `return ${print(exp)}`)

  let context = params.context || new Context()

  return function () {
    try {
      result(context)
    } catch (e) {
      throw new Error(
        '解释表达式【' + exp + '】中的变量出现错误,错误原因：' + e.message
      )
    }
  }
}

export { execute, parseMethods, parseVars }
