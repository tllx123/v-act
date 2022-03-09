import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'
import ComparatorSyntax from '../ComparatorSyntax'

class EqualSyntax extends ComparatorSyntax {
  static SYMBOL: string = '=='

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
    return EqualSyntax.SYMBOL
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printEqualSyntax) {
      return printer.printEqualSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()

    return visitor && visitor.visitEqualSyntax
      ? visitor.visitEqualSyntax(this, (syntax) => syntax.visit())
      : super.visit()
  }
}

export default EqualSyntax
