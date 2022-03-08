import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import LeftBracketToken from '../../../tokenizer/punctuation/LeftBracketToken'
import RightBracketToken from '../../../tokenizer/punctuation/RightBracketToken'
import Token from '../../../tokenizer/Token'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import Syntax from '../../Syntax'

class EntityFieldSyntax extends Syntax {
  entityCode: string

  fieldCode: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof LeftBracketToken) {
      let index = context.getIndex()
      let tokens = context.getTokens()
      index++
      let entityCodeTokens = getVarIdentifierTokens(index, <Token[]>tokens)
      if (entityCodeTokens && entityCodeTokens.length > 0) {
        index += entityCodeTokens.length
        let tks = tokens.slice(index, index + 3)
        if (tks.join('') == '].[') {
          index += 3
          let fieldCodeTokens = getVarIdentifierTokens(index, <Token[]>tokens)
          if (fieldCodeTokens && fieldCodeTokens.length > 0) {
            index += fieldCodeTokens.length
            token = tokens[index]
            if (token instanceof RightBracketToken) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let startIndex = index,
      startToken = context.getToken()
    let tokens = context.getTokens()
    index++
    let entityCodeTokens = getVarIdentifierTokens(index, <Token[]>tokens)
    let entityCode = entityCodeTokens.join('')
    //偏移实体编号长度
    index += entityCode.length
    //偏移].[
    index += 3
    let fieldCodeTokens = getVarIdentifierTokens(index, <Token[]>tokens)
    let fieldCode = fieldCodeTokens.join('')
    index += fieldCode.length
    let position = new Position()
    position.parseStartToken(<Token>startToken)
    position.parseEndToken(<Token>tokens[index])
    return new EntityFieldSyntax(
      startIndex,
      index,
      entityCode,
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

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printEntityFieldSyntax) {
      return printer.printEntityFieldSyntax(this, (syntax) => syntax.toString())
    } else {
      return `[${this.getEntityCode()}].[${this.getFieldCode()}]`
    }
  }

  visit() {
    const ctx = this.getContext(),
      visitor = ctx.getVisitor()
    if (visitor && visitor.visitEntityFieldSyntax) {
      visitor.visitEntityFieldSyntax(this, (syntax) => syntax.visit())
    } else {
      return false
    }
  }
}

export default EntityFieldSyntax
