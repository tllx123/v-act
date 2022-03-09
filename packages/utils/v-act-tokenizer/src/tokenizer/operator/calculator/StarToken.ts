import OperatorToken from '../OperatorToken'

class StarToken extends OperatorToken {
  static TOKEN = '*'

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default StarToken
