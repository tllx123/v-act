import BinaryExpressionSyntax from '../BinaryExpressionSyntax'
import Syntax from '../../Syntax'
import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'

/**
 * 除运算符
 */
class DivideSyntax extends BinaryExpressionSyntax {
  static SYMBOL: string = '/'
  static getWeight = function () {
    return 700
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
    return DivideSyntax.SYMBOL
  }
}

export default DivideSyntax
