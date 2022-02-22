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
}

export default RulesetVarSyntax
