import Token from '../Token'

class TagName extends Token {
  tagName: string[] = []
  position: number = 0
  constructor(ch: string) {
    super()
    this.tagName.push(ch)
  }
  getPosition() {
    return this.position
  }
  append(val: string) {
    this.tagName.push(val)
  }
  getTagName() {
    return this.tagName.join('')
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

export default TagName
