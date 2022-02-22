import Syntax from './syntax/Syntax'
import Position from './Position'

class SyntaxParseResult {
  syntax: Syntax

  postion: Position

  constructor(syntax: Syntax, postion: Position) {
    this.syntax = syntax
    this.postion = postion
  }

  getSyntax() {
    return this.syntax
  }

  getPosition() {
    return this.postion
  }
}

export default SyntaxParseResult
