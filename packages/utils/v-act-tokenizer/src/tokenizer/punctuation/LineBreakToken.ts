import Token from '../Token'

class LineBreakToken extends Token {
  static TOKEN = '\n'

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }

  isLineBreaked() {
    return true
  }

  isCanSkip() {
    return true
  }
}

export default LineBreakToken
