import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Syntax from '../../Syntax'
import BinaryExpressionSyntax from '../BinaryExpressionSyntax'

/**
 * 乘运算符
 */
class MultiplySyntax extends BinaryExpressionSyntax {
  static SYMBOL: string = '*'
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
    return MultiplySyntax.SYMBOL
  }
}

export default MultiplySyntax
