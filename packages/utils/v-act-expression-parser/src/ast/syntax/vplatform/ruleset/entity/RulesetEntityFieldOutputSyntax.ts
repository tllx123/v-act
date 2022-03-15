import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import RulesetEntitySyntax from '../RulesetEntitySyntax'

class RulesetEntityFieldOutputSyntax extends RulesetEntitySyntax {
  static PREFIX: string = 'BR_OUT_PARENT'
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
    return RulesetEntityFieldOutputSyntax.PREFIX
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printRulesetEntityFieldOutputSyntax) {
      return printer.printRulesetEntityFieldOutputSyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return super.toString()
    }
  }
  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    if (visitor && visitor.visitRulesetEntityFieldOutputSyntax) {
      visitor.visitRulesetEntityFieldOutputSyntax(this)
    }
  }
}

export default RulesetEntityFieldOutputSyntax
