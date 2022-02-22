import Token from '../Token'
import { isWordChar } from '../../utils/VarUtils'

class WordToken extends Token {
  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

WordToken.accept = function (char) {
  return isWordChar(char)
}

export default WordToken
