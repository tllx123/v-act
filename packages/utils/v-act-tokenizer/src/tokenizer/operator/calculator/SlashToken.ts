import OperatorToken from '../OperatorToken'

class SlashToken extends OperatorToken {
  static TOKEN = '/'

  constructor(value: string, lineIndex: number, colIndex: number) {
    super(value, lineIndex, colIndex)
  }
}

export default SlashToken
