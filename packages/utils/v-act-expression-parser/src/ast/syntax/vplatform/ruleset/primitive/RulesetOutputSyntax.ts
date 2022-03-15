import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import RulesetPrimitiveSyntax from '../RulesetPrimitiveSyntax'

class RulesetOutputSyntax extends RulesetPrimitiveSyntax {
  static PREFIX: string = 'BR_OUT_PARENT'
  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    code: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, code, position, context)
  }

  getPrefix(): string {
    return RulesetOutputSyntax.PREFIX
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRulesetOutputSyntax) {
      return printer.printRulesetOutputSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    if (visitor && visitor.visitRulesetOutputSyntax) {
      visitor.visitRulesetOutputSyntax(this)
    }
  }
}

export default RulesetOutputSyntax
