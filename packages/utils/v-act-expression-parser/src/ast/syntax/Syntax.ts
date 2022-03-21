import Position from '../Position'
import SyntaxParseContext from '../SyntaxParseContext'

abstract class Syntax {
  tokenStartIndex: number

  tokenEndIndex: number

  position: Position

  context: SyntaxParseContext

  static accept = function (context: SyntaxParseContext) {
    return false
  }

  static parse = function (context: SyntaxParseContext): Syntax | null {
    return null
  }

  static INDENT_CHAR = '\t'

  constructor(
    tokenStartIndex: number,
    tokenEndIndex: number,
    position: Position,
    context: SyntaxParseContext
  ) {
    this.tokenStartIndex = tokenStartIndex
    this.tokenEndIndex = tokenEndIndex
    this.position = position
    this.context = context
  }

  getPosition() {
    return this.position
  }

  getContext() {
    return this.context
  }

  toString() {
    return ''
  }

  getTokenStartIndex() {
    return this.tokenStartIndex
  }

  getTokenEndIndex() {
    return this.tokenEndIndex
  }

  abstract visit(): void | boolean
}

export default Syntax
