//]]>
import Token from '../Token'

class CDDataEndToken extends Token {
  position: number = 0
  constructor(position: number) {
    super()
    this.position = position
  }
  getPosition() {
    return this.position
  }
  isMatch(str: string, index: number): boolean {
    return str.charAt(index) == ']' && str.substring(index, index + 3) == ']]>'
  }
  getOffset(): number {
    return 3
  }
  static getWeight(): number {
    return 500
  }
}

export default CDDataEndToken
