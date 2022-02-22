import Syntax from '../Syntax'
import Token from '../../tokenizer/Token'
import Position from '../../Position'
import SyntaxParseContext from '../../SyntaxParseContext'

/**
 * 布尔常量
 * 规范：True，False
 */
class BooleanIdentifierSyntax extends Syntax {
  value: boolean

  static getWeight = function () {
    return 1000
  }

  static parse = function (context: SyntaxParseContext) {
    let token = context.getToken()
    let index = context.getIndex()
    let tokens = context.getTokens()
    let tokenStr = token.toString()
    let value, endToken, endIndex
    if (tokenStr == 'T') {
      value = true
      endIndex = index + 3
      endToken = tokens[endIndex]
    } else {
      value = false
      endIndex = index + 4
      endToken = tokens[endIndex]
    }
    let position = new Position()
    position.parseStartToken(<Token>token)
    position.parseEndToken(<Token>endToken)
    return new BooleanIdentifierSyntax(
      index,
      endIndex,
      value,
      position,
      context
    )
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    value: boolean,
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
    return this.getValue() ? 'True' : 'False'
  }
}

BooleanIdentifierSyntax.accept = function (context) {
  let token = context.getToken()
  let str = token.toString()
  if (str == 'T' || str == 'F') {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let exp = tokens.slice(index, index + 4).join('')
    if (exp == 'True') {
      return true
    } else if (
      exp == 'Fals' &&
      index + 4 < tokens.length &&
      tokens[index + 4].toString() == 'e'
    ) {
      return true
    }
  }
  return false
}

export default BooleanIdentifierSyntax
