import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Syntax from '../../Syntax'
import BinaryExpressionSyntax from '../BinaryExpressionSyntax'

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

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printDivideSyntax) {
      return printer.printDivideSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }

  visit() {
    const ctx = this.getContext()
    const visitor = ctx.getVisitor()
    if (visitor && visitor.visitDivideSyntax) {
      return visitor.visitDivideSyntax(this, (syntax) => syntax.visit())
    } else {
      return super.visit()
    }
  }
}

export default DivideSyntax
