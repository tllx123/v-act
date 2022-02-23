import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import DotToken from '../../../tokenizer/punctuation/DotToken'
import Token from '../../../tokenizer/Token'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import Syntax from '../../Syntax'

class ForeachVarSyntax extends Syntax {
  varCode: string

  fieldCode: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof DotToken) {
      let tokens = context.getTokens()
      let index = context.getIndex()
      let prefixTokens = tokens.slice(index - 2, index)
      if (prefixTokens.join('') == 'LV') {
        let varTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
        if (varTokens.length > 0) {
          index += varTokens.length
          let tk = tokens[++index]
          if (tk instanceof DotToken) {
            let fieldTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
            return fieldTokens.length > 0
          }
        }
      }
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let startIndex = index - 2
    let varTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
    let varCode = varTokens.join('')
    let fieldTokens = getVarIdentifierTokens(
      index + 2 + varTokens.length,
      <Token[]>tokens
    )
    let fieldCode = fieldTokens.join('')
    let endIndex = index + 1 + varTokens.length + fieldTokens.length
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new ForeachVarSyntax(
      startIndex,
      endIndex,
      varCode,
      fieldCode,
      position,
      context
    )
  }

  static getWeight = function () {
    return 1100
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    varCode: string,
    fieldCode: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.varCode = varCode
    this.fieldCode = fieldCode
  }

  getVarCode() {
    return this.varCode
  }

  getFieldCode() {
    return this.fieldCode
  }

  format() {
    return this.toString()
  }

  toString() {
    return `LV.${this.getVarCode()}.${this.getFieldCode()}`
  }
}

export default ForeachVarSyntax
