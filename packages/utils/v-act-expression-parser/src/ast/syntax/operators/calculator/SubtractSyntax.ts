import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Syntax from '../../Syntax'
import BinaryExpressionSyntax from '../BinaryExpressionSyntax'
/**
 * 减运算符
 */
class SubtractSyntax extends BinaryExpressionSyntax {
  static SYMBOL: string = '-'
  static getWeight = function () {
    return 600
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
    return SubtractSyntax.SYMBOL
  }
}

export default SubtractSyntax
