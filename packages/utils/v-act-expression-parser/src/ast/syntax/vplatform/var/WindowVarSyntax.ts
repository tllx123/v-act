import Syntax from '../../Syntax'
import Position from '../../../Position'
import AtToken from '../../../tokenizer/punctuation/AtToken'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Token from '../../../tokenizer/Token'

class WindowVarSyntax extends Syntax {
  code: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof AtToken) {
      let index = context.getIndex()
      let tokens = context.getTokens()
      let varTokens = getVarIdentifierTokens(index, <Token[]>tokens)
      return varTokens.length > 0
    }
    return false
  }

  /**
   * 变量定义规范
   * 由a-z，A-Z,0-9及_组成，只能以字母开头且不能以_结尾
   */
  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let startIndex = index
    let tokens = context.getTokens()
    let varTokens = getVarIdentifierTokens(index, <Token[]>tokens)
    let endIndex = index + varTokens.length
    let code = varTokens.join('')
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new WindowVarSyntax(startIndex, endIndex, code, position, context)
  }

  static getWeight = function () {
    return 1100
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

  toString() {
    return `@${this.getCode()}`
  }
}

export default WindowVarSyntax
