class Token {
  value: string

  lineIndex: number

  colIndex: number

  static ORDER = 10

  static TOKEN: string | null = null

  static accept = function (char: string) {
    return char == this.TOKEN
  }

  static toExpression = function (start: number, end: number, tokens: Token[]) {
    let list = tokens.slice(start, end)
    return list.join('')
  }

  static parse = function (char: string, lineIndex: number, colIndex: number) {
    return new this(char, lineIndex, colIndex)
  }
  constructor(value: string, lineIndex: number, colIndex: number) {
    this.value = value
    this.lineIndex = lineIndex
    this.colIndex = colIndex
  }

  getValue() {
    return this.value
  }

  getLineIndex() {
    return this.lineIndex
  }

  getColIndex() {
    return this.colIndex
  }

  isLineBreaked() {
    return false
  }

  toString() {
    return this.value
  }

  isCanSkip() {
    return false
  }

  /**
   * 如果当前词后面跟‘-’字符时，true识别成减号，false识别为负号
   */
  isSubtractAhead() {
    return true
  }
}

export default Token
