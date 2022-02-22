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
}

export default RulesetEntityFieldOutputSyntax
