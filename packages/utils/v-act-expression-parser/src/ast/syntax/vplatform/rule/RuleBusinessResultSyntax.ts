import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import { DotToken } from '@v-act/tokenizer'
import { Token } from '@v-act/tokenizer'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import Syntax from '../../Syntax'

class RuleBusinessResultSyntax extends Syntax {
  instanceCode: string

  resultCode: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof DotToken) {
      let tokens = context.getTokens()
      let index = context.getIndex()
      let prefixTokens = tokens.slice(index - 6, index)
      if (prefixTokens.join('') == 'BR_OUT') {
        let instanceCodeTokens = getVarIdentifierTokens(
          index + 1,
          <Token[]>tokens
        )
        if (instanceCodeTokens.length > 0) {
          index += instanceCodeTokens.length
          let tk = tokens[++index]
          if (tk instanceof DotToken) {
            let resultCodeTokens = getVarIdentifierTokens(
              index + 1,
              <Token[]>tokens
            )
            return resultCodeTokens.length > 0
          }
        }
      }
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let startIndex = index - 6
    let instanceCodeTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
    let instanceCode = instanceCodeTokens.join('')
    let resultCodeTokens = getVarIdentifierTokens(
      index + 2 + instanceCodeTokens.length,
      <Token[]>tokens
    )
    let resultCode = resultCodeTokens.join('')
    let endIndex =
      index + 1 + instanceCodeTokens.length + resultCodeTokens.length
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new this(
      startIndex,
      endIndex,
      instanceCode,
      resultCode,
      position,
      context
    )
  }

  static getWeight = function () {
    return 1100
  }
  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    instanceCode: string,
    resultCode: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.instanceCode = instanceCode
    this.resultCode = resultCode
  }

  getInstanceCode() {
    return this.instanceCode
  }

  getResultCode() {
    return this.resultCode
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRuleBusinessResultSyntax) {
      return printer.printRuleBusinessResultSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return `BR_OUT.${this.getInstanceCode()}.${this.getResultCode()}`
    }
  }

  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    if (visitor && visitor.visitRuleBusinessResultSyntax) {
      visitor.visitRuleBusinessResultSyntax(this)
    }
  }
}

export default RuleBusinessResultSyntax
