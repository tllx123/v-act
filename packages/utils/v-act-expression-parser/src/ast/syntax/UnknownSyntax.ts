import Syntax from './Syntax'
import Position from '../Position'
import Token from '../tokenizer/Token'
import SyntaxParseContext from '../SyntaxParseContext'

class UnknownSyntax extends Syntax {
  message: string

  tokens: Token[]

  static accept = function (context: SyntaxParseContext) {
    return false
  }

  static parse = function (context: SyntaxParseContext): null | Syntax {
    return null
  }

  static getWeight = function () {
    return 0
  }

  constructor(
    tokenStartIndex: number,
    tokenEndIndex: number,
    message: string,
    tokens: Token[],
    position: Position,
    context: SyntaxParseContext
  ) {
    super(tokenStartIndex, tokenEndIndex, position, context)
    this.message = message
    this.tokens = tokens
  }

  getMessasge() {
    return this.message
  }

  toString() {
    const script: string[] = []
    if (this.tokens) {
      this.tokens.forEach((token) => {
        script.push(token.toString())
      })
    }
    return script.join('')
  }
}

export default UnknownSyntax
