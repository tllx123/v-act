import Syntax from '../../../Syntax'
import Position from '../../../../Position'
import NotToken from '../../../../tokenizer/operator/logic/NotToken'
import BlankToken from '../../../../tokenizer/punctuation/BlankToken'
import { parseToSyntax } from '../../../../Parser'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import Token from '../../../../tokenizer/Token'

const getRightSyntax = function (index: number, tokens: Token[]) {
  let result
  while (true) {
    index++
    if (index < tokens.length) {
      let token = tokens[index]
      if (!(token instanceof BlankToken)) {
        if (token instanceof Syntax) {
          result = {
            syntax: token,
            index: index
          }
        }
        break
      }
    } else {
      break
    }
  }
  return result
}

class NotSyntax extends Syntax {
  right: Syntax

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    return token instanceof NotToken
  }

  static parse = function (context: SyntaxParseContext) {
    let tokens = context.getTokens()
    let index = context.getIndex()
    let right = getRightSyntax(index, <Token[]>tokens)
    let tokenEndIndex, rightSyntax
    if (right) {
      tokenEndIndex = right.index
      rightSyntax = right.syntax
    } else {
      rightSyntax = parseToSyntax(tokens.slice(index + 1, tokens.length))
      tokenEndIndex = tokens.length - 1
    }
    let position = new Position()
    position.parseStartToken(<Token>tokens[index])
    position.parseEndToken(<Token>tokens[index])
    return new NotSyntax(index, tokenEndIndex, rightSyntax, position, context)
  }

  static getWeight = function () {
    return 800
  }
  constructor(
    tokenStartIndex: number,
    tokenEndIndex: number,
    right: Syntax,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(tokenStartIndex, tokenEndIndex, position, context)
    this.right = right
  }

  getRight() {
    return this.right
  }

  toString() {
    let rigthSyntax = this.getRight()
    return `!${rigthSyntax ? rigthSyntax.toString() : ''}`
  }
}

export default NotSyntax
