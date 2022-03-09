import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import { EqualToken, GreateToken } from '@v-act/tokenizer'
import Syntax from '../../../Syntax'
import ComparatorSyntax from '../ComparatorSyntax'

class LessThanSyntax extends ComparatorSyntax {
  static SYMBOL: string = '<'

  static extraAccept = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let token = tokens[index + 1]
    return !(token instanceof GreateToken) && !(token instanceof EqualToken)
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
    return LessThanSyntax.SYMBOL
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printLessThanSyntax) {
      return printer.printLessThanSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    return visitor && visitor.visitLessThanSyntax
      ? visitor.visitLessThanSyntax(this, (syntax) => syntax.visit())
      : super.visit()
  }
}

export default LessThanSyntax
