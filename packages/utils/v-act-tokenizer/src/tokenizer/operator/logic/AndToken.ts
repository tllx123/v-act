import OperatorToken from '../OperatorToken'

class AndToken extends OperatorToken {
  static TOKEN = '&'

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default AndToken
