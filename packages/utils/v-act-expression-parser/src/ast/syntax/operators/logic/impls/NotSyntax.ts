import { parseToSyntax } from '../../../../Parser'
import Position from '../../../../Position'
import SyntaxParseContext from '../../../../SyntaxParseContext'
import { Token, BlankToken, NotToken } from '@v-act/tokenizer'
import Syntax from '../../../Syntax'

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
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printNotSyntax) {
      return printer.printNotSyntax(this, (syntax) => syntax.toString())
    } else {
      let rigthSyntax = this.getRight()
      return `!${rigthSyntax ? rigthSyntax.toString() : ''}`
    }
  }

  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    return visitor && visitor.visitNotSyntax
      ? visitor.visitNotSyntax(this, (syntax) => syntax.visit())
      : this.getRight()
      ? this.getRight().visit()
      : false
  }
}

export default NotSyntax
