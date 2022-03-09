import Token from '../Token'

class ElementStartToken extends Token {
  position: number = 0
  constructor(position: number) {
    super()
    this.position = position
  }
  getPosition() {
    return this.position
  }
  isMatch(str: string, index: number): boolean {
    return (
      str.charAt(index) == '<' &&
      str.substring(index, index + 9) !== '<![CDATA['
    )
  }
  getOffset(): number {
    return 1
  }
  static getWeight(): number {
    return 999
  }
}

export default ElementStartToken
