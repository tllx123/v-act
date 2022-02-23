import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import RulesetPrimitiveSyntax from '../RulesetPrimitiveSyntax'

class RulesetVarSyntax extends RulesetPrimitiveSyntax {
  static PREFIX = 'BR_VAR_PARENT'

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
    return RulesetVarSyntax.PREFIX
  }
  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRulesetVarSyntax) {
      return printer.printRulesetVarSyntax(this, (syntax) => syntax.toString())
    } else {
      return super.toString()
    }
  }
}

export default RulesetVarSyntax
