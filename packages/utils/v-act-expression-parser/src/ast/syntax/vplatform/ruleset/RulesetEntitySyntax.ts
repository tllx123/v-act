import Syntax from '../../Syntax'
import { Token } from '@v-act/tokenizer'
import Position from '../../../Position'
import { DotToken } from '@v-act/tokenizer'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import { RightBracketToken } from '@v-act/tokenizer'
import SyntaxParseContext from '../../../SyntaxParseContext'

abstract class RulesetEntitySyntax extends Syntax {
  static PREFIX = ''

  entityCode: string

  fieldCode: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof DotToken) {
      let tokens = context.getTokens()
      let index = context.getIndex()
      let prefixTokens = tokens.slice(index - this.PREFIX.length, index)
      if (prefixTokens.join('') == this.PREFIX) {
        let entityTokens = getVarIdentifierTokens(index + 2, <Token[]>tokens)
        if (entityTokens.length > 0) {
          index += entityTokens.length
          let tks = tokens.slice(index + 2, index + 5)
          if (tks.join('') == '].[') {
            let fieldTokens = getVarIdentifierTokens(index + 5, <Token[]>tokens)
            if (fieldTokens.length > 0) {
              index += fieldTokens.length
              let tok = tokens[index + 5]
              return tok instanceof RightBracketToken
            }
          }
        }
      }
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let startIndex = index - this.PREFIX.length
    let entityTokens = getVarIdentifierTokens(index + 2, <Token[]>tokens)
    let entityCode = entityTokens.join('')
    let fieldTokens = getVarIdentifierTokens(
      index + 5 + entityTokens.length,
      <Token[]>tokens
    )
    let fieldCode = fieldTokens.join('')
    let endIndex = index + 5 + entityTokens.length + fieldTokens.length
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new this(
      startIndex,
      endIndex,
      entityCode,
      fieldCode,
      position,
      context
    )
  }

  static getWeight = function () {
    return 1200
  }
  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    entityCode: string,
    fieldCode: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.entityCode = entityCode
    this.fieldCode = fieldCode
  }

  getEntityCode() {
    return this.entityCode
  }

  getFieldCode() {
    return this.fieldCode
  }

  format() {
    return this.toString()
  }

  abstract getPrefix(): string

  toString() {
    return (
      this.getPrefix() + `.[${this.getEntityCode()}].[${this.getFieldCode()}]`
    )
  }
  visit() {
    return
  }
}

export default RulesetEntitySyntax
