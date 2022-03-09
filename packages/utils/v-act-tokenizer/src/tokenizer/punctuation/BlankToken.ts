import Token from '../Token'

class BlankToken extends Token {
  static TOKEN = ' '

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }

  isCanSkip() {
    return true
  }
}

export default BlankToken
