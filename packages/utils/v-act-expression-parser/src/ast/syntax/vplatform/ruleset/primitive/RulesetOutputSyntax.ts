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
}

export default RulesetOutputSyntax
