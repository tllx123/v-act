import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'
import LogicSyntax from '../LogicSyntax'

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

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printAndSyntax) {
      return printer.printAndSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    return visitor && visitor.visitAndSyntax
      ? visitor.visitAndSyntax(this, (syntax) => syntax.visit())
      : super.visit()
  }
}

export default AndSyntax
