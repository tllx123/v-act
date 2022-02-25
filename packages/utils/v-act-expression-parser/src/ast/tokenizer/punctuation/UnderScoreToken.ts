import Token from '../Token'

class UnderScoreToken extends Token {
  static TOKEN = '_'

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default UnderScoreToken
