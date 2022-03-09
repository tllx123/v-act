import NumberToken from './tokenizer/literal/NumberToken'
import WordToken from './tokenizer/literal/WordToken'
import MinusToken from './tokenizer/operator/calculator/MinusToken'
import PlusToken from './tokenizer/operator/calculator/PlusToken'
import SlashToken from './tokenizer/operator/calculator/SlashToken'
import StarToken from './tokenizer/operator/calculator/StarToken'
import EqualToken from './tokenizer/operator/comparator/EqualToken'
import GreateToken from './tokenizer/operator/comparator/GreateToken'
import LessToken from './tokenizer/operator/comparator/LessToken'
import AndToken from './tokenizer/operator/logic/AndToken'
import NotToken from './tokenizer/operator/logic/NotToken'
import OrToken from './tokenizer/operator/logic/OrToken'
import AtToken from './tokenizer/punctuation/AtToken'
import BlankToken from './tokenizer/punctuation/BlankToken'
import CommaToken from './tokenizer/punctuation/CommaToken'
import DotToken from './tokenizer/punctuation/DotToken'
import HashToken from './tokenizer/punctuation/HashToken'
import LeftBracketToken from './tokenizer/punctuation/LeftBracketToken'
import LeftParenToken from './tokenizer/punctuation/LeftParenToken'
import LineBreakToken from './tokenizer/punctuation/LineBreakToken'
import QuoteToken from './tokenizer/punctuation/QuoteToken'
import RightBracketToken from './tokenizer/punctuation/RightBracketToken'
import RightParenToken from './tokenizer/punctuation/RightParenToken'
import UnderScoreToken from './tokenizer/punctuation/UnderScoreToken'
import Token from './tokenizer/Token'
import UnknownToken from './tokenizer/UnknownToken'

let Token_Constructor_Cache = [
  NumberToken,
  WordToken,
  MinusToken,
  PlusToken,
  SlashToken,
  StarToken,
  EqualToken,
  GreateToken,
  LessToken,
  AndToken,
  NotToken,
  OrToken,
  AtToken,
  BlankToken,
  CommaToken,
  DotToken,
  HashToken,
  LeftBracketToken,
  LeftParenToken,
  LineBreakToken,
  QuoteToken,
  RightBracketToken,
  RightParenToken,
  UnderScoreToken,
  UnknownToken
]

Token_Constructor_Cache = Token_Constructor_Cache.sort((item1, item2) => {
  return item2.ORDER - item1.ORDER
})

const getTokenConstructors = function () {
  return Token_Constructor_Cache
}

/**
 *
 */
export function parse(expression: string): Array<Token> {
  let lineIndex = 0,
    colIndex = 0
  let tokenConstructors = getTokenConstructors()
  let tokens = []
  for (let i = 0, l = expression.length; i < l; i++) {
    let chr = expression.charAt(i)
    for (let j = 0, len = tokenConstructors.length; j < len; j++) {
      let constructor = tokenConstructors[j]
      if (constructor.accept(chr)) {
        let token = constructor.parse(chr, lineIndex, colIndex)
        tokens.push(token)
        if (token.isLineBreaked()) {
          lineIndex++
          colIndex = -1
        }
        break
      }
    }
    colIndex++
  }
  return tokens
}

export {
  Token,
  NumberToken,
  WordToken,
  MinusToken,
  PlusToken,
  SlashToken,
  StarToken,
  EqualToken,
  GreateToken,
  LessToken,
  AndToken,
  NotToken,
  OrToken,
  AtToken,
  BlankToken,
  CommaToken,
  DotToken,
  HashToken,
  LeftBracketToken,
  LeftParenToken,
  LineBreakToken,
  QuoteToken,
  RightBracketToken,
  RightParenToken,
  UnderScoreToken,
  UnknownToken
}
