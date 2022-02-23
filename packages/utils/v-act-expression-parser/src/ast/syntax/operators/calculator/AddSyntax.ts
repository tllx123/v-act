import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import Syntax from '../../Syntax'
import BinaryExpressionSyntax from '../BinaryExpressionSyntax'

/**
 * 加法运算符
 * 规范：**+**
 */
class AddSyntax extends BinaryExpressionSyntax {
  static SYMBOL: string = '+'

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
    return AddSyntax.SYMBOL
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printAddSyntax) {
      return printer.printAddSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
}

export default AddSyntax
