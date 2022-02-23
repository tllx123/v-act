import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import RulesetEntitySyntax from '../RulesetEntitySyntax'

class RulesetEntityFieldVarSyntax extends RulesetEntitySyntax {
  static PREFIX: string = 'BR_VAR_PARENT'

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    entityCode: string,
    fieldCode: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(
      startTokenIndex,
      endTokenIndex,
      entityCode,
      fieldCode,
      position,
      context
    )
  }

  getPrefix(): string {
    return RulesetEntityFieldVarSyntax.PREFIX
  }
  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRulesetEntityFieldVarSyntax) {
      return printer.printRulesetEntityFieldVarSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return super.toString()
    }
  }
}

export default RulesetEntityFieldVarSyntax
