const data = require('./data')
const parser = require('../dist/index')
const testAll = function () {
  const exps = data.getExps()
  let startTime = new Date().getTime()
  for (let i = 0, l = exps.length; i < l; i++) {
    let exp = exps[i]
    let syntax = parser.parse(exp)
    let exp1 = syntax.toString()
    if (exp1 !== exp) {
      console.log(`表达式解析错误，原始表达式：${exp}，解析后结果：${exp1}`)
    }
  }
  let endTime = new Date().getTime()
  console.log(`表达式个数：${exps.length}，总耗时：${endTime - startTime}毫秒`)
}

const test = function () {
  let startTime = new Date().getTime()
  let exp = 'ConcatStr(BC.JGAddress1.Value,"test")'
  let syntax = parser.parse(exp)
  let endTime = new Date().getTime()
  console.log(`表达式解析完成，总耗时：${endTime - startTime}毫秒`)
  console.log(syntax.visit())
}

const testPrint = function (exp) {
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

const testPrintAll = function () {
  const exps = data.getExps()
  let startTime = new Date().getTime()
  for (let i = 0, l = exps.length; i < l; i++) {
    let exp = exps[i]
    let exp1 = testPrint(exp)
    console.log(`表达式转换，原始表达式：${exp}`)
    console.log(`转换后结果：${exp1}`)
  }
  let endTime = new Date().getTime()
  console.log(`表达式个数：${exps.length}，总耗时：${endTime - startTime}毫秒`)
}

test()
//testAll()
//testPrint()
// testPrintAll()
//console.log(testPrint("IsEmpty(BR_VAR_PARENT.applicationId)||IsEmpty(BR_VAR_PARENT.bizWindow)"))
