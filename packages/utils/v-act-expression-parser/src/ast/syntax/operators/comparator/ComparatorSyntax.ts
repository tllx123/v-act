import BinaryExpressionSyntax from '../BinaryExpressionSyntax'
import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Syntax from '../../Syntax'

abstract class ComparatorSyntax extends BinaryExpressionSyntax {
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
}

export default ComparatorSyntax
