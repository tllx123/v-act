import Syntax from './syntax/Syntax'
import Token from './tokenizer/Token'

class SyntaxParseContext {
  index: number
  tokens: Array<Token | Syntax>
  constructor(index: number, tokens: Array<Token | Syntax>) {
    this.index = index
    this.tokens = tokens
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
}

export default SyntaxParseContext
