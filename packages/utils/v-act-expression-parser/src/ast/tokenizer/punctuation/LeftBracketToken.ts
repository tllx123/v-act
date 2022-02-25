import Token from '../Token'

class LeftBracketToken extends Token {
  static TOKEN = '['

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default LeftBracketToken
