import LogicSyntax from '../LogicSyntax'
import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'

class AndSyntax extends LogicSyntax {
  static SYMBOL: string = '&&'
  static getWeight = function () {
    return 300
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
    return AndSyntax.SYMBOL
  }
}

export default AndSyntax
