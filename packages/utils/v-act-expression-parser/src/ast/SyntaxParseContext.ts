import Printer from '../Printer'
import Syntax from './syntax/Syntax'
import { Token } from '@v-act/tokenizer'
import Visitor from '../Visitor'

class SyntaxParseContext {
  index: number
  tokens: Array<Token | Syntax>
  printer: Printer
  visitor: Visitor
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
  }

  setVisitor(visitor: Visitor) {
    this.visitor = visitor
  }

  getVisitor() {
    return this.visitor
  }
}

export default SyntaxParseContext
