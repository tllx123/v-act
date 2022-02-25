import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'
import ComparatorSyntax from '../ComparatorSyntax'

class LessOrEqualSyntax extends ComparatorSyntax {
  static SYMBOL: string = '<='
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
    return LessOrEqualSyntax.SYMBOL
  }
  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printLessOrEqualSyntax) {
      return printer.printLessOrEqualSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
}

export default LessOrEqualSyntax
