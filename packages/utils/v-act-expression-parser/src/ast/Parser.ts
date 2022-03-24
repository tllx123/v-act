import { parse as parse2ken, Token } from '@v-act/tokenizer'

import Position from './Position'
import BracketSyntax from './syntax/block/BracketSyntax'
import BooleanIdentifierSyntax from './syntax/identifiers/BooleanIdentifierSyntax'
import NumberIdentifierSyntax from './syntax/identifiers/NumberIdentifierSyntax'
import StringIdentifierSyntax from './syntax/identifiers/StringIdentifierSyntax'
import AddSyntax from './syntax/operators/calculator/AddSyntax'
import DivideSyntax from './syntax/operators/calculator/DivideSyntax'
import MultiplySyntax from './syntax/operators/calculator/MultiplySyntax'
import SubtractSyntax from './syntax/operators/calculator/SubtractSyntax'
import EqualSyntax from './syntax/operators/comparator/impls/EqualSyntax'
import GreaterOrEqualSyntax from './syntax/operators/comparator/impls/GreaterOrEqualSyntax'
import GreaterThanSyntax from './syntax/operators/comparator/impls/GreaterThanSyntax'
import LessOrEqualSyntax from './syntax/operators/comparator/impls/LessOrEqualSyntax'
import LessThanSyntax from './syntax/operators/comparator/impls/LessThanSyntax'
import NotEqualSyntax from './syntax/operators/comparator/impls/NotEqualSyntax'
import AndSyntax from './syntax/operators/logic/impls/AndSyntax'
import NotSyntax from './syntax/operators/logic/impls/NotSyntax'
import OrSyntax from './syntax/operators/logic/impls/OrSyntax'
import ParseResultSyntax from './syntax/ParseResultSyntax'
import Syntax from './syntax/Syntax'
import UnknownSyntax from './syntax/UnknownSyntax'
import EntityFieldSyntax from './syntax/vplatform/entity/EntityFieldSyntax'
import FunctionSyntax from './syntax/vplatform/func/FunctionSyntax'
import ForeachVarSyntax from './syntax/vplatform/logic/ForeachVarSyntax'
import RuleBusinessResultSyntax from './syntax/vplatform/rule/RuleBusinessResultSyntax'
import RulesetEntityFieldInputSyntax from './syntax/vplatform/ruleset/entity/RulesetEntityFieldInputSyntax'
import RulesetEntityFieldOutputSyntax from './syntax/vplatform/ruleset/entity/RulesetEntityFieldOutputSyntax'
import RulesetEntityFieldVarSyntax from './syntax/vplatform/ruleset/entity/RulesetEntityFieldVarSyntax'
import RulesetInputSyntax from './syntax/vplatform/ruleset/primitive/RulesetInputSyntax'
import RulesetOutputSyntax from './syntax/vplatform/ruleset/primitive/RulesetOutputSyntax'
import RulesetVarSyntax from './syntax/vplatform/ruleset/primitive/RulesetVarSyntax'
import ComponentVarSyntax from './syntax/vplatform/var/ComponentVarSyntax'
import WindowVarSyntax from './syntax/vplatform/var/WindowVarSyntax'
import BusinessWidgetPropertySyntax from './syntax/vplatform/widget/BusinessWidgetPropertySyntax'
import WidgetPropertySyntax from './syntax/vplatform/widget/WidgetPropertySyntax'
import WorkflowVarSyntax from './syntax/vplatform/workflow/WorkflowVarSyntax'
import SyntaxParseContext from './SyntaxParseContext'

let Synatx_Constructor_Cache = [
  UnknownSyntax,
  ComponentVarSyntax,
  EntityFieldSyntax,
  FunctionSyntax,
  WidgetPropertySyntax,
  BusinessWidgetPropertySyntax,
  WindowVarSyntax,
  BracketSyntax,
  BooleanIdentifierSyntax,
  NumberIdentifierSyntax,
  StringIdentifierSyntax,
  AddSyntax,
  DivideSyntax,
  MultiplySyntax,
  SubtractSyntax,
  GreaterOrEqualSyntax,
  GreaterThanSyntax,
  LessOrEqualSyntax,
  LessThanSyntax,
  NotEqualSyntax,
  AndSyntax,
  EqualSyntax,
  NotSyntax,
  OrSyntax,
  RulesetEntityFieldInputSyntax,
  RulesetEntityFieldOutputSyntax,
  RulesetEntityFieldVarSyntax,
  RulesetInputSyntax,
  RulesetOutputSyntax,
  RulesetVarSyntax,
  ForeachVarSyntax,
  RuleBusinessResultSyntax,
  WorkflowVarSyntax
]

Synatx_Constructor_Cache = Synatx_Constructor_Cache.sort((item1, item2) => {
  return item2.getWeight() - item1.getWeight()
})

const getSyntaxs = function () {
  return Synatx_Constructor_Cache
}

/**
 *
 */
const parseToToken = function (expression: string) {
  return parse2ken(expression)
}

/**
 * 语义解析
 * 优先级(参考java)如下,越往下走,优先级越低
 * ====================================================================================================================
 * 1400:    字符串（"**"）
 * ====================================================================================================================
 * 1300:    构件变量(@@**:要在窗体变量前)
 * ====================================================================================================================
 * 1200：   方法变量(BR_VAR_PARENT.**或BR_VAR_PARENT.[**].[**]),
 *          方法输入(BR_IN_PARENT.**或BR_IN_PARENT.[**].[**]),
 *          方法输出（BR_OUT_PARENT.**或BR_OUT_PARENT.[**].[**]）
 * ====================================================================================================================
 * 1100:    函数(**(**)),
 *          实体字段([**].[**]),
 *          循环变量(LV.**.**),
 *          规则业务返回值(BR_OUT.**.**),
 *          窗体变量(@**),
 *          控件属性(CC.**.**),
 *          流程变量(#**)
 * ====================================================================================================================
 * 1000:    布尔（True/False:要在平台变量后，防止平台变量名中字符被识别成布尔）,
 *          数值（要在平台变量后，防止平台变量名中字符被识别成数值）
 * ====================================================================================================================
 * 900:     括号,
 * ====================================================================================================================
 * 800:     非
 * ====================================================================================================================
 * 700:     乘,除
 * ====================================================================================================================
 * 600:     加,减
 * ====================================================================================================================
 * 500:     大于等于,小于等于,大于,小于
 * ====================================================================================================================
 * 400:     等于,不等于
 * ====================================================================================================================
 * 300:     与,或
 * ====================================================================================================================
 * @param {Array<Word>} tokens
 */
const parseToSyntax = function (
  tokens: Array<Token | Syntax>,
  parentContext?: SyntaxParseContext
): Syntax {
  if (!tokens || tokens.length == 0) {
    return null
  }
  let syntaxList = getSyntaxs()
  const parseContext = new SyntaxParseContext()
  parseContext.joinParentContext(parentContext)
  for (let i = 0, l = syntaxList.length; i < l; i++) {
    let SyntaxConstructor = syntaxList[i]
    let tokenNotSyntaxed = true
    for (let j = 0; j < tokens.length; j++) {
      let token = tokens[j]
      if (token instanceof Syntax) {
        continue
      } else {
        tokenNotSyntaxed = false
        parseContext.setIndex(j)
        parseContext.setTokens(tokens)
        if (SyntaxConstructor.accept(parseContext)) {
          let syntax = SyntaxConstructor.parse(parseContext)
          let startIndex = syntax.getTokenStartIndex()
          let endIndex = syntax.getTokenEndIndex()
          let deleteCount = endIndex - startIndex + 1
          tokens.splice(startIndex, deleteCount, syntax)
          j = startIndex
        }
      }
    }
    if (tokenNotSyntaxed) {
      break
    }
  }
  //检查没有被解析的token
  let unknownTokens = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (token instanceof Token) {
      tokens.splice(i, 1)
      i--
      if (!token.isCanSkip()) {
        unknownTokens.push(token)
      }
    } else if (unknownTokens.length != 0) {
      let position = new Position()
      position.parseStartToken(unknownTokens[0])
      position.parseEndToken(unknownTokens[unknownTokens.length - 1])
      parseContext.setIndex(i)
      parseContext.setTokens(tokens)
      let syntax = new UnknownSyntax(
        i - unknownTokens.length,
        i--,
        '未识别表达式',
        unknownTokens,
        position,
        parseContext
      )
      tokens.splice(i - unknownTokens.length, unknownTokens.length, syntax)
      unknownTokens = []
    }
  }
  if (unknownTokens.length > 0) {
    let position = new Position()
    position.parseStartToken(unknownTokens[0])
    position.parseEndToken(unknownTokens[unknownTokens.length - 1])
    parseContext.setIndex(0)
    parseContext.setTokens(tokens)
    let syntax = new UnknownSyntax(
      tokens.length - unknownTokens.length,
      tokens.length - 1,
      '未识别表达式',
      unknownTokens,
      position,
      parseContext
    )
    tokens.splice(
      tokens.length - unknownTokens.length,
      unknownTokens.length,
      syntax
    )
  }
  const syntaxs: Syntax[] = []
  tokens.forEach((token) => {
    if (token instanceof Syntax) {
      syntaxs.push(token)
    } else {
      throw Error('表达式识别失败！')
    }
  })
  parseContext.setIndex(0)
  parseContext.setTokens(syntaxs)
  return new ParseResultSyntax(syntaxs, parseContext)
}

/**
 * 解析表达式
 * @param {String} expression 表达式
 * @param {SyntaxContext} context 解析上下文
 * @returns {Syntax}
 */
const parse = function (expression: string) {
  if (expression.trim() != '') {
    try {
      let tokens = parseToToken(expression)
      return parseToSyntax(tokens)
    } catch (e) {
      throw Error('表达式识别失败！表达式：' + expression)
    }
  }
  return null
}

export { parse, parseToSyntax }
