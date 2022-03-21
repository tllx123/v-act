import * as parser from '@v-act/expression-parser'

const ParseExpression = function (exp: string) {
  let syntax = parser.parse(exp)

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

export { ParseExpression }
