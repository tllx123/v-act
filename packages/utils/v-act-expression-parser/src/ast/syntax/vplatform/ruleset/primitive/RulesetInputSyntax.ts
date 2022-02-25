import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import RulesetPrimitiveSyntax from '../RulesetPrimitiveSyntax'

class RulesetInputSyntax extends RulesetPrimitiveSyntax {
  static PREFIX: string = 'BR_IN_PARENT'
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
    return RulesetInputSyntax.PREFIX
  }
  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRulesetInputSyntax) {
      return printer.printRulesetInputSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return super.toString()
    }
  }
}

export default RulesetInputSyntax
