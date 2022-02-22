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
}

export default RulesetEntityFieldInputSyntax
