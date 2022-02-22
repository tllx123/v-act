import ComparatorSyntax from '../ComparatorSyntax'
import EqualToken from '../../../../tokenizer/operator/comparator/EqualToken'
import LessToken from '../../../../tokenizer/operator/comparator/LessToken'
import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'

class GreaterThanSyntax extends ComparatorSyntax {
  static SYMBOL: string = '>'
  static extraAccept = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let token = tokens[index + 1]
    if (!(token instanceof EqualToken)) {
      token = tokens[index - 1]
      return !(token instanceof LessToken)
    }
    return false
  }

  static getWeight = function () {
    return 500
  }
  constructor(
    tokenStartIndex: number,
    tokenEndIndex: number,
    left: Syntax,
    right: Syntax,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(tokenStartIndex, tokenEndIndex, left, right, position, context)
  }

  getSymbol(): string {
    return GreaterThanSyntax.SYMBOL
  }
}

export default GreaterThanSyntax
