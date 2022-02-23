import Printer from '../Printer'
import Syntax from './syntax/Syntax'
import Token from './tokenizer/Token'

class SyntaxParseContext {
  index: number
  tokens: Array<Token | Syntax>
  printer: Printer
  constructor(index: number, tokens: Array<Token | Syntax>, printer?: Printer) {
    this.index = index
    this.tokens = tokens
    this.printer = printer
  }

  getIndex() {
    return this.index
  }

  getTokens() {
    return this.tokens
  }

  getToken() {
    return this.tokens[this.index]
  }

  getPrinter() {
    return this.printer
  }
}

export default SyntaxParseContext
