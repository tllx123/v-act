import Position from '../../Position'
import SyntaxParseContext from '../../SyntaxParseContext'
import NumberToken from '../../tokenizer/literal/NumberToken'
import MinusToken from '../../tokenizer/operator/calculator/MinusToken'
import BlankToken from '../../tokenizer/punctuation/BlankToken'
import DotToken from '../../tokenizer/punctuation/DotToken'
import Token from '../../tokenizer/Token'
import Syntax from '../Syntax'

const getPositiveNumber = function (index: number, tokens: Token[]) {
  let numbers = []
  while (index < tokens.length) {
    let token = tokens[index]
    if (token instanceof NumberToken || token instanceof DotToken) {
      numbers.push(token)
    } else {
      break
    }
    index++
  }
  return numbers
}

/**
 * 数值常量
 */
class NumberIdentifierSyntax extends Syntax {
  value: number

  static getWeight = function () {
    return 1000
  }

  /**
   * 处理场景:
   * 1-1
   * 1+-1
   * 1>=-1
   */
  static parse = function (context: SyntaxParseContext) {
    let tokens = context.getTokens()
    let index = context.getIndex()
    let startIndex = index
    let numbers = getPositiveNumber(index, <Token[]>tokens)
    let value = parseFloat(numbers.join(''))
    let preToken = tokens[index - 1]
    if (preToken instanceof MinusToken) {
      //判断是否是负数
      let i = index - 1,
        token
      while (true) {
        i--
        if (i > -1) {
          let tk = tokens[i]
          if (tk instanceof Token && !(tk instanceof BlankToken)) {
            token = tk
          }
        } else {
          break
        }
      }
      if (!token || !token.isSubtractAhead()) {
        startIndex--
        value = 0 - value
      }
    }
    let endIndex = index + numbers.length - 1
    let endToken = tokens[endIndex]
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>endToken)
    return new NumberIdentifierSyntax(
      startIndex,
      endIndex,
      value,
      position,
      context
    )
  }

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof NumberToken) {
      let tokens = context.getTokens()
      let index = context.getIndex()
      let numbers = getPositiveNumber(index, <Token[]>tokens)
      let numberStr = numbers.join('')
      return numberStr == new Number(numberStr) + ''
    }
    return false
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    value: number,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.value = value
  }

  getValue() {
    return this.value
  }

  toString() {
    return this.getValue() + ''
  }
}

export default NumberIdentifierSyntax
