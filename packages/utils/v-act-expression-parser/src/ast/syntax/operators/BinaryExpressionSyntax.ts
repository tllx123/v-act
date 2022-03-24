import { BlankToken, Token } from '@v-act/tokenizer'

import { parseToSyntax } from '../../Parser'
import Position from '../../Position'
import SyntaxParseContext from '../../SyntaxParseContext'
import Syntax from '../Syntax'

const getLeftSyntax = function (index: number, tokens: Array<Token | Syntax>) {
  let result
  while (true) {
    index--
    if (index > -1) {
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

/**
 * 二元表达式基类
 */
abstract class BinaryExpressionSyntax extends Syntax {
  left: Syntax

  right: Syntax

  static SYMBOL = ''

  static accept = function (context: SyntaxParseContext) {
    let tokens = context.getTokens()
    let index = context.getIndex()
    let symbols = tokens.slice(index, index + this.SYMBOL.length)
    return symbols.join('') == this.SYMBOL && this.extraAccept(context)
  }

  static extraAccept = function (context: SyntaxParseContext) {
    return true
  }

  static parse = function (context: SyntaxParseContext) {
    let tokens = context.getTokens()
    let index = context.getIndex()
    let left = getLeftSyntax(index, tokens)
    let tokenStartIndex, tokenEndIndex, leftSyntax, rightSyntax
    let position = new Position()
    if (left) {
      tokenStartIndex = left.index
      leftSyntax = left.syntax
    } else {
      tokenStartIndex = 0
      leftSyntax = parseToSyntax(tokens.slice(0, index), context)
    }
    let right = getRightSyntax(index + this.SYMBOL.length - 1, <Token[]>tokens)
    if (right) {
      tokenEndIndex = right.index
      rightSyntax = right.syntax
    } else {
      tokenEndIndex = tokens.length - 1
      rightSyntax = parseToSyntax(
        tokens.slice(index + 1, tokens.length),
        context
      )
    }
    position.parseStartToken(<Token>tokens[index])
    position.parseEndToken(<Token>tokens[index + this.SYMBOL.length - 1])
    return new this(
      tokenStartIndex,
      tokenEndIndex,
      leftSyntax,
      rightSyntax,
      position,
      context
    )
  }

  constructor(
    tokenStartIndex: number,
    tokenEndIndex: number,
    left: Syntax,
    right: Syntax,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(tokenStartIndex, tokenEndIndex, position, context)
    this.left = left
    this.right = right
  }

  getLeft() {
    return this.left
  }

  getRight() {
    return this.right
  }

  abstract getSymbol(): string

  toString() {
    let script = []
    let leftSyntax = this.getLeft()
    if (leftSyntax) {
      //script.push(' ')
      script.push(leftSyntax.toString())
    }
    this.constructor.toString()
    script.push(this.getSymbol())
    let rightSyntax = this.getRight()
    if (rightSyntax) {
      script.push(rightSyntax.toString())
      //script.push(' ')
    }
    return script.join('')
  }
}

export default BinaryExpressionSyntax
