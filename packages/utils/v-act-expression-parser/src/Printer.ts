import BracketSyntax from './ast/syntax/block/BracketSyntax'
import BooleanIdentifierSyntax from './ast/syntax/identifiers/BooleanIdentifierSyntax'
import NumberIdentifierSyntax from './ast/syntax/identifiers/NumberIdentifierSyntax'
import StringIdentifierSyntax from './ast/syntax/identifiers/StringIdentifierSyntax'
import AddSyntax from './ast/syntax/operators/calculator/AddSyntax'
import DivideSyntax from './ast/syntax/operators/calculator/DivideSyntax'
import MultiplySyntax from './ast/syntax/operators/calculator/MultiplySyntax'
import SubtractSyntax from './ast/syntax/operators/calculator/SubtractSyntax'
import EqualSyntax from './ast/syntax/operators/comparator/impls/EqualSyntax'
import GreaterOrEqualSyntax from './ast/syntax/operators/comparator/impls/GreaterOrEqualSyntax'
import GreaterThanSyntax from './ast/syntax/operators/comparator/impls/GreaterThanSyntax'
import LessOrEqualSyntax from './ast/syntax/operators/comparator/impls/LessOrEqualSyntax'
import LessThanSyntax from './ast/syntax/operators/comparator/impls/LessThanSyntax'
import NotEqualSyntax from './ast/syntax/operators/comparator/impls/NotEqualSyntax'
import AndSyntax from './ast/syntax/operators/logic/impls/AndSyntax'
import NotSyntax from './ast/syntax/operators/logic/impls/NotSyntax'
import OrSyntax from './ast/syntax/operators/logic/impls/OrSyntax'
import ParseResultSyntax from './ast/syntax/ParseResultSyntax'
import Syntax from './ast/syntax/Syntax'
import UnknownSyntax from './ast/syntax/UnknownSyntax'
import EntityFieldSyntax from './ast/syntax/vplatform/entity/EntityFieldSyntax'
import FunctionSyntax from './ast/syntax/vplatform/func/FunctionSyntax'
import ForeachVarSyntax from './ast/syntax/vplatform/logic/ForeachVarSyntax'
import RuleBusinessResultSyntax from './ast/syntax/vplatform/rule/RuleBusinessResultSyntax'
import RulesetEntityFieldInputSyntax from './ast/syntax/vplatform/ruleset/entity/RulesetEntityFieldInputSyntax'
import RulesetEntityFieldOutputSyntax from './ast/syntax/vplatform/ruleset/entity/RulesetEntityFieldOutputSyntax'
import RulesetEntityFieldVarSyntax from './ast/syntax/vplatform/ruleset/entity/RulesetEntityFieldVarSyntax'
import RulesetInputSyntax from './ast/syntax/vplatform/ruleset/primitive/RulesetInputSyntax'
import RulesetOutputSyntax from './ast/syntax/vplatform/ruleset/primitive/RulesetOutputSyntax'
import RulesetVarSyntax from './ast/syntax/vplatform/ruleset/primitive/RulesetVarSyntax'
import ComponentVarSyntax from './ast/syntax/vplatform/var/ComponentVarSyntax'
import WindowVarSyntax from './ast/syntax/vplatform/var/WindowVarSyntax'
import BusinessWidgetPropertySyntax from './ast/syntax/vplatform/widget/BusinessWidgetPropertySyntax'
import WidgetPropertySyntax from './ast/syntax/vplatform/widget/WidgetPropertySyntax'
import WorkflowVarSyntax from './ast/syntax/vplatform/workflow/WorkflowVarSyntax'

interface ExpressionPrinter {
  /**
   * 打印括号语法
   */
  printBacketSyntax?: (
    syntax: BracketSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印布尔关键字语法
   */
  printBooleanIdentifierSyntax?: (
    syntax: BooleanIdentifierSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印构件变量语法
   */
  printComponentVarSyntax?: (
    syntax: ComponentVarSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印数值语法
   */
  printNumberIdentifierSyntax?: (
    syntax: NumberIdentifierSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印字符串常量语法
   */
  printStringIdentifierSyntax?: (
    syntax: StringIdentifierSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印加法运算符语法
   */
  printAddSyntax?: (
    syntax: AddSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印除运算符语法
   */
  printDivideSyntax?: (
    syntax: DivideSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印乘运算符语法
   */
  printMultiplySyntax?: (
    syntax: MultiplySyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印减运算符语法
   */
  printSubtractSyntax?: (
    syntax: SubtractSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 Equal 语法
   */
  printEqualSyntax?: (
    syntax: EqualSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 GreaterOrEqual 语法
   */
  printGreaterOrEqualSyntax?: (
    syntax: GreaterOrEqualSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 GreaterThan 语法
   */
  printGreaterThanSyntax?: (
    syntax: GreaterThanSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 LessOrEqual 语法
   */
  printLessOrEqualSyntax?: (
    syntax: LessOrEqualSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 LessThan 语法
   */
  printLessThanSyntax?: (
    syntax: LessThanSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 NotEqual 语法
   */
  printNotEqualSyntax?: (
    syntax: NotEqualSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 And 语法
   */
  printAndSyntax?: (
    syntax: AndSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 Not 语法
   */
  printNotSyntax?: (
    syntax: NotSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 Or 语法
   */
  printOrSyntax?: (
    syntax: OrSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 EntityField 语法
   */
  printEntityFieldSyntax?: (
    syntax: EntityFieldSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 Function 语法
   */
  printFunctionSyntax?: (
    syntax: FunctionSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 ForeachVar 语法
   */
  printForeachVarSyntax?: (
    syntax: ForeachVarSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RuleBusinessResult 语法
   */
  printRuleBusinessResultSyntax?: (
    syntax: RuleBusinessResultSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RulesetEntityFieldInput 语法
   */
  printRulesetEntityFieldInputSyntax?: (
    syntax: RulesetEntityFieldInputSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RulesetEntityFieldOutput 语法
   */
  printRulesetEntityFieldOutputSyntax?: (
    syntax: RulesetEntityFieldOutputSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RulesetEntityFieldVar 语法
   */
  printRulesetEntityFieldVarSyntax?: (
    syntax: RulesetEntityFieldVarSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RulesetInput 语法
   */
  printRulesetInputSyntax?: (
    syntax: RulesetInputSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RulesetOutput 语法
   */
  printRulesetOutputSyntax?: (
    syntax: RulesetOutputSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 RulesetVar 语法
   */
  printRulesetVarSyntax?: (
    syntax: RulesetVarSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 WindowVar 语法
   */
  printWindowVarSyntax?: (
    syntax: WindowVarSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 BusinessWidgetProperty 语法
   */
  printBusinessWidgetPropertySyntax?: (
    syntax: BusinessWidgetPropertySyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 WidgetProperty 语法
   */
  printWidgetPropertySyntax?: (
    syntax: WidgetPropertySyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 WorkflowVar 语法
   */
  printWorkflowVarSyntax?: (
    syntax: WorkflowVarSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 ParseResult 语法
   */
  printParseResultSyntax?: (
    syntax: ParseResultSyntax,
    printer: (syntax: Syntax) => string
  ) => string

  /**
   * 打印 Unknown 语法
   */
  printUnknownSyntax?: (
    syntax: UnknownSyntax,
    printer: (syntax: Syntax) => string
  ) => string
}

export default ExpressionPrinter
