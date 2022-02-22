import Syntax from '../syntax/Syntax'

class SyntaxParseError {
  error: Error

  syntax: Syntax

  constructor(error: Error, syntax: Syntax) {
    this.error = error
    this.syntax = syntax
  }

  getError() {
    return this.error
  }

  getSyntax() {
    return this.syntax
  }
}

export default SyntaxParseError
