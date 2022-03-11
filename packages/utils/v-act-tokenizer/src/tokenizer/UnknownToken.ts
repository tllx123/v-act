import Token from './Token'

class UnknownToken extends Token {
  static ORDER = 0

  static accept = function (char: string) {
    return true
  }

  static parse = function (char: string, lineIndex: number, colIndex: number) {
    return new UnknownToken(char, lineIndex, colIndex)
  }

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }

  isCanSkip() {
    return false
  }
}

export default UnknownToken
