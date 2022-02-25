import Token from '../Token'
import { isNumberChar } from '../../utils/VarUtils'

class NumberToken extends Token {
  static accept = function (char: string) {
    return isNumberChar(char)
  }

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default NumberToken
