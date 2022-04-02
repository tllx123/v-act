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

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printSubtractSyntax) {
      return printer.printSubtractSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }

  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    let res: boolean | void = true
    if (visitor && visitor.visitSubtractSyntax) {
      res = visitor.visitSubtractSyntax(this)
    }
    if (res !== false) {
      this.getLeft().visit()
      this.getRight().visit()
    }
  }
}

export default SubtractSyntax
