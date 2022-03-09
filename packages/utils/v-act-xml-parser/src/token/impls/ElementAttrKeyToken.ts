import Token from '../Token'

class ElementAttrKeyToken extends Token {
  value: string[] = []
  position: number = 0
  constructor(ch: string) {
    super()
    this.value.push(ch)
  }
  getPosition() {
    return this.position
  }
  append(val: string) {
    this.value.push(val)
  }
  getKey() {
    return this.value.join('')
  }
  isMatch(str: string, index: number): boolean {
    return true
  }
  getOffset(): number {
    return 1
  }
  static getWeight(): number {
    return 0
  }
}
export default ElementAttrKeyToken
