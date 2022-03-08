import Position from '../../Position'
import SyntaxParseContext from '../../SyntaxParseContext'
import LineBreakToken from '../../tokenizer/punctuation/LineBreakToken'
import QuoteToken from '../../tokenizer/punctuation/QuoteToken'
import Token from '../../tokenizer/Token'
import Syntax from '../Syntax'
import UnknownSyntax from '../UnknownSyntax'

const parseStr = function (
  index: number,
  tokens: Token[],
  context: SyntaxParseContext
) {
  let stringIdentifiers: Token[] = []
  let start = index,
    endIndex = -1
  let strTokens = []
  stringIdentifiers.push(tokens[++index])
  let syntax = null
  let error = null
  while (index < tokens.length) {
    let token = tokens[index]
    if (token instanceof QuoteToken) {
      endIndex = index
      break
    } else if (token instanceof LineBreakToken) {
      error = new Error('字符串未结束')
      let startToken = tokens[start]
      let endToken = tokens[index]
      let position = new Position()
      position.parseStartToken(startToken)
      position.parseEndToken(endToken)
      syntax = new UnknownSyntax(
        start,
        index,
        '字符串未结束',
        tokens.slice(start, index + 1),
        position,
        context
      )
      break
    }
    strTokens.push(token)
    index++
    if (index == tokens.length) {
      error = new Error('字符串未结束')
      let startToken = tokens[start]
      let endToken = tokens[tokens.length - 1]
      let position = new Position()
      position.parseStartToken(startToken)
      if (endToken instanceof Syntax) {
        position.parseEndSyntax(endToken)
      } else {
        position.parseEndToken(endToken)
      }
      syntax = new UnknownSyntax(
        index,
        tokens.length - 1,
        '字符串未结束',
        tokens.slice(index, tokens.length),
        position,
        context
      )
      break
    }
  }
  return {
    syntax,
    error,
    endIndex,
    strTokens
  }
}

/**
 * 字符串常量
 */
class StringIdentifierSyntax extends Syntax {
  value: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    return token instanceof QuoteToken
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let result = parseStr(index, <Token[]>tokens, context)
    if (result.error) {
      return result.syntax
    } else {
      let endIndex = result.endIndex
      let position = new Position()
      position.parseStartToken(<Token>tokens[index])
      if (endIndex == -1) {
        //字符串未结束
        position.parseEndToken(<Token>tokens[tokens.length - 1])
        return new UnknownSyntax(
          index,
          tokens.length - 1,
          '字符串未结束',
          <Token[]>tokens.slice(index, tokens.length),
          position,
          context
        )
      } else {
        position.parseEndToken(<Token>tokens[endIndex])
        return new StringIdentifierSyntax(
          index,
          endIndex,
          result.strTokens.join(''),
          position,
          context
        )
      }
    }
  }

  static getWeight = function () {
    return 1400
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    value: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.value = value
  }

  getValue() {
    return this.value
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printStringIdentifierSyntax) {
      return printer.printStringIdentifierSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return `"${this.getValue()}"`
    }
  }
  visit() {
    const ctx = this.getContext()
    const visitor = ctx.getVisitor()
    if (visitor && visitor.visitStringIdentifierSyntax) {
      return visitor.visitStringIdentifierSyntax(this, (syntax) =>
        syntax.visit()
      )
    } else {
      return false
    }
  }
}

export default StringIdentifierSyntax
