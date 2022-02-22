import ComparatorSyntax from '../ComparatorSyntax'
import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'

class NotEqualSyntax extends ComparatorSyntax {
  static SYMBOL: string = '<>'
  static getWeight = function () {
    return 400
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
    return NotEqualSyntax.SYMBOL
  }
}

export default NotEqualSyntax
