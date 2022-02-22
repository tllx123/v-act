import OperatorToken from '../OperatorToken'

class LessToken extends OperatorToken {
  static TOKEN = '<'

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default LessToken
