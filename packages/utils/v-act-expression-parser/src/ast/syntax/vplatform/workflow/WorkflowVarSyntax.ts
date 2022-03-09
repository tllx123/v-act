import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import { HashToken } from '@v-act/tokenizer'
import { Token } from '@v-act/tokenizer'
import { getVarIdentifierTokens } from '../../../utils/TokenUtils'
import Syntax from '../../Syntax'

class WorkflowVarSyntax extends Syntax {
  code: string

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof HashToken) {
      let index = context.getIndex()
      let tokens = context.getTokens()
      let varTokens = getVarIdentifierTokens(index, <Token[]>tokens)
      return varTokens.length > 0
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let startIndex = index
    let tokens = context.getTokens()
    let varTokens = getVarIdentifierTokens(index, <Token[]>tokens)
    let endIndex = index + varTokens.length
    let code = varTokens.join('')
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[endIndex])
    return new WorkflowVarSyntax(startIndex, endIndex, code, position, context)
  }

  static getWeight = function () {
    return 1100
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    code: string,
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.code = code
  }

  getCode() {
    return this.code
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printWorkflowVarSyntax) {
      return printer.printWorkflowVarSyntax(this, (syntax) => syntax.toString())
    } else {
      return `#${this.getCode()}`
    }
  }

  visit() {
    const ctx = this.getContext()
    const visitor = ctx.getVisitor()
    if (visitor && visitor.visitWorkflowVarSyntax) {
      return visitor.visitWorkflowVarSyntax(this, (syntax) => syntax.visit())
    } else {
      return false
    }
  }
}

export default WorkflowVarSyntax
