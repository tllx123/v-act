import Syntax from '../../Syntax'
import Position from '../../../Position'
import DotToken from '../../../tokenizer/punctuation/DotToken'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Token from '../../../tokenizer/Token'

abstract class RulesetPrimitiveSyntax extends Syntax {
  code: string

  static PREFIX = ''

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof DotToken) {
      let tokens = context.getTokens()
      let index = context.getIndex()
      let prefixTokens = tokens.slice(index - this.PREFIX.length, index)
      if (prefixTokens.join('') == this.PREFIX) {
        let codeTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
        return codeTokens.length > 0
      }
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let startIndex = index - this.PREFIX.length
    let codeTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
    let code = codeTokens.join('')
    let endIndex = index + codeTokens.length
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new this(startIndex, endIndex, code, position, context)
  }

  static getWeight = function () {
    return 1200
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    code: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.code = code
  }

  getCode() {
    return this.code
  }

  format() {
    return this.toString()
  }

  abstract getPrefix(): string

  toString() {
    return this.getPrefix() + `.${this.getCode()}`
  }
}

export default RulesetPrimitiveSyntax
