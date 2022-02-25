import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import RulesetEntitySyntax from '../RulesetEntitySyntax'

class RulesetEntityFieldInputSyntax extends RulesetEntitySyntax {
  static PREFIX: string = 'BR_IN_PARENT'

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
    return RulesetEntityFieldInputSyntax.PREFIX
  }
  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRulesetEntityFieldInputSyntax) {
      return printer.printRulesetEntityFieldInputSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return super.toString()
    }
  }
}

export default RulesetEntityFieldInputSyntax
