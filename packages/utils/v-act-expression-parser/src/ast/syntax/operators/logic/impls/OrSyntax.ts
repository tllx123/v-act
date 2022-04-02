import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Syntax from '../../../Syntax'
import LogicSyntax from '../LogicSyntax'

class OrSyntax extends LogicSyntax {
  static SYMBOL: string = '||'

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

  getOperator() {
    return OrSyntax.SYMBOL
  }

  getSymbol(): string {
    return this.getOperator()
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printOrSyntax) {
      return printer.printOrSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    let res: boolean | void = true
    if (visitor && visitor.visitOrSyntax) {
      res = visitor.visitOrSyntax(this)
    }
    if (res !== false) {
      this.getLeft().visit()
      this.getRight().visit()
    }
  }
}

export default OrSyntax
