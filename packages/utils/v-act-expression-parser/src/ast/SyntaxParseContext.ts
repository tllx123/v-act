import Printer from '../Printer'
import Syntax from './syntax/Syntax'
import Token from './tokenizer/Token'

class SyntaxParseContext {
  index: number
  tokens: Array<Token | Syntax>
  printer: Printer
  constructor(
    index?: number,
    tokens?: Array<Token | Syntax>,
    printer?: Printer
  ) {
    this.index = index
    this.tokens = tokens
    this.printer = printer
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
}

export default SyntaxParseContext
