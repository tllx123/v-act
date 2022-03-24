import { Token } from '@v-act/tokenizer'

import Printer from '../Printer'
import Visitor from '../Visitor'
import Syntax from './syntax/Syntax'

class SyntaxParseContext {
  index: number
  tokens: Array<Token | Syntax>
  printer: Printer
  visitor: Visitor
  children: Array<SyntaxParseContext> = []
  constructor(
    index?: number,
    tokens?: Array<Token | Syntax>,
    printer?: Printer,
    visitor?: Visitor
  ) {
    this.index = index
    this.tokens = tokens
    this.printer = printer
    this.visitor = visitor
  }

  getIndex() {
    return this.index
  }

  setIndex(index: number) {
    this.index = index
  }

  getTokens() {
    return this.tokens
  }

  setTokens(tokens: Array<Token | Syntax>) {
    this.tokens = tokens
  }

  getToken() {
    return this.tokens[this.index]
  }

  getPrinter() {
    return this.printer
  }

  setPrinter(printer: Printer) {
    this.printer = printer
    this.children.forEach((child) => {
      child.setPrinter(printer)
    })
  }

  setVisitor(visitor: Visitor) {
    this.visitor = visitor
    this.children.forEach((child) => {
      child.setVisitor(visitor)
    })
  }

  getVisitor() {
    return this.visitor
  }

  joinParentContext(ctx?: SyntaxParseContext) {
    if (ctx) {
      if (ctx.children.indexOf(this) == -1) {
        ctx.children.push(this)
      }
    }
  }
}

export default SyntaxParseContext
