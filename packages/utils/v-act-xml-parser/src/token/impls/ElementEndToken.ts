import Token from '../Token'

class ElementEndToken extends Token {
  position: number = 0
  constructor(position: number) {
    super()
    this.position = position
  }
  getPosition() {
    return this.position
  }
  isMatch(str: string, index: number): boolean {
    return str.charAt(index) == '>'
  }
  getOffset(): number {
    return 1
  }
  static getWeight(): number {
    return 999
  }
}

export default ElementEndToken
