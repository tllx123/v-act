import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import DotToken from '../../../tokenizer/punctuation/DotToken'
import Token from '../../../tokenizer/Token'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import Syntax from '../../Syntax'

class BusinessWidgetPropertySyntax extends Syntax {
  widgetCode: string

  propertyCode: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof DotToken) {
      let tokens = context.getTokens()
      let index = context.getIndex()
      let prefixTokens = tokens.slice(index - 2, index)
      if (prefixTokens.join('') == 'BC') {
        let widgetCodeTokens = getVarIdentifierTokens(
          index + 1,
          <Token[]>tokens
        )
        if (widgetCodeTokens.length > 0) {
          index += widgetCodeTokens.length
          let tk = tokens[++index]
          if (tk instanceof DotToken) {
            let propertyCodeTokens = getVarIdentifierTokens(
              index + 1,
              <Token[]>tokens
            )
            return propertyCodeTokens.length > 0
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
    let widgetCodeTokens = getVarIdentifierTokens(index + 1, <Token[]>tokens)
    let widgetCode = widgetCodeTokens.join('')
    let propertyCodeTokens = getVarIdentifierTokens(
      index + 2 + widgetCodeTokens.length,
      <Token[]>tokens
    )
    let propertyCode = propertyCodeTokens.join('')
    let endIndex =
      index + 1 + widgetCodeTokens.length + propertyCodeTokens.length
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new BusinessWidgetPropertySyntax(
      startIndex,
      endIndex,
      widgetCode,
      propertyCode,
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
    widgetCode: string,
    propertyCode: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.widgetCode = widgetCode
    this.propertyCode = propertyCode
  }

  getWidgetCode() {
    return this.widgetCode
  }

  getPropertyCode() {
    return this.propertyCode
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printBusinessWidgetPropertySyntax) {
      return printer.printBusinessWidgetPropertySyntax(this, (syntax) =>
        syntax.toString()
      )
    } else {
      return `BC.${this.getWidgetCode()}.${this.getPropertyCode()}`
    }
  }

  visit() {
    return false
  }
}

export default BusinessWidgetPropertySyntax
