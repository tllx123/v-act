import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'
import ComparatorSyntax from '../ComparatorSyntax'

class GreaterOrEqualSyntax extends ComparatorSyntax {
  static SYMBOL: string = '>='
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

  getOperator() {
    return GreaterOrEqualSyntax.SYMBOL
  }

  getSymbol(): string {
    return GreaterOrEqualSyntax.SYMBOL
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printGreaterOrEqualSyntax) {
      return printer.printGreaterOrEqualSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    return visitor && visitor.visitGreaterOrEqualSyntax
      ? visitor.visitGreaterOrEqualSyntax(this, (syntax) => syntax.visit())
      : super.visit()
  }
}

export default GreaterOrEqualSyntax
