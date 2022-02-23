import Position from '../Position'
import SyntaxParseContext from '../SyntaxParseContext'
import Token from '../tokenizer/Token'
import Syntax from './Syntax'

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
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printUnknownSyntax) {
      return printer.printUnknownSyntax(this, (syntax) => syntax.toString())
    } else {
      const script: string[] = []
      if (this.tokens) {
        this.tokens.forEach((token) => {
          script.push(token.toString())
        })
      }
      return script.join('')
    }
  }
}

export default UnknownSyntax
