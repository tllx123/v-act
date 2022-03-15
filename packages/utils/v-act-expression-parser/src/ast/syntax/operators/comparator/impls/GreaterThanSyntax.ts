import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import { LessToken, EqualToken } from '@v-act/tokenizer'
import Syntax from '../../../Syntax'
import ComparatorSyntax from '../ComparatorSyntax'

class GreaterThanSyntax extends ComparatorSyntax {
  static SYMBOL: string = '>'
  static extraAccept = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let token = tokens[index + 1]
    if (!(token instanceof EqualToken)) {
      token = tokens[index - 1]
      return !(token instanceof LessToken)
    }
    return false
  }

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
    return GreaterThanSyntax.SYMBOL
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printGreaterThanSyntax) {
      return printer.printGreaterThanSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }

  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()

    if (visitor && visitor.visitGreaterThanSyntax) {
      const res = visitor.visitGreaterThanSyntax(this)
      if (res !== false) {
        this.getLeft().visit()
        this.getRight().visit()
      }
    }
  }
}

export default GreaterThanSyntax
