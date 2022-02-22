import Token from '../tokenizer/Token'

const isVarChar = function (chr: string) {
  return isWordChar(chr) || isNumberChar(chr) || isUnderScoreChar(chr)
}

const isVarCharToken = function (token: Token) {}

const isWordChar = function (chr: string) {
  return isLowerCaseWordChar(chr) || isUpperCaseWordChar(chr)
}

const isLowerCaseWordChar = function (chr: string) {
  return chr >= 'a' && chr <= 'z'
}

const isUpperCaseWordChar = function (chr: string) {
  return chr >= 'A' && chr <= 'Z'
}

const isNumberChar = function (chr: string) {
  return chr >= '0' && chr <= '9'
}

const isUnderScoreChar = function (chr: string) {
  return chr == '_'
}

const getWordIdentifier = function (startIndex: number, expression: string) {
  let word = '',
    index = startIndex
  while (true) {
    let chr = expression.charAt(index++)
    if (isWordChar(chr)) {
      word += chr
    } else {
      break
    }
  }
  return word
}

/**
 * 获取非负数值
 */
const getPositiveNumber = function (startIndex: number, expression: string) {
  let code = [],
    index = startIndex
  while (true) {
    let chr = expression.charAt(index++)
    if (isNumberChar(chr) || (chr == '.' && chr.indexOf('.') == -1)) {
      code.push(chr)
    } else {
      break
    }
  }
  let res = ''
  while (code.length > 0) {
    res = code.join('')
    if (res == new Number(res).toString()) {
      break
    } else {
      code.pop()
    }
  }
  return res
}

export {
  isVarChar,
  isVarCharToken,
  isWordChar,
  isLowerCaseWordChar,
  isNumberChar,
  isUnderScoreChar,
  isUpperCaseWordChar,
  getPositiveNumber,
  getWordIdentifier
}
