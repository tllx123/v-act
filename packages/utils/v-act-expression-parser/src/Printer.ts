import BracketSyntax from './ast/syntax/block/BracketSyntax'
import BooleanIdentifierSyntax from './ast/syntax/identifiers/BooleanIdentifierSyntax'

interface ExpressionPrinter {
  /**
   * 打印括号语法
   */
  printBacketSyntax?: (syntax: BracketSyntax) => string

  /**
   * 打印布尔关键字语法
   */
  printBooleanIdentifierSyntax?: (syntax: BooleanIdentifierSyntax) => string
}

export default ExpressionPrinter
