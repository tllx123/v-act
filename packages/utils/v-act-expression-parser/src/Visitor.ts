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

interface ExpressionVisitor {
  /**
   * 访问 引用函数
   */
  visitFunctionSyntax?: (
    syntax: FunctionSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印括号语法
   */
  visitBacketSyntax?: (
    syntax: BracketSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印布尔关键字语法
   */
  visitBooleanIdentifierSyntax?: (
    syntax: BooleanIdentifierSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印构件变量语法
   */
  visitComponentVarSyntax?: (
    syntax: ComponentVarSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印数值语法
   */
  visitNumberIdentifierSyntax?: (
    syntax: NumberIdentifierSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印字符串常量语法
   */
  visitStringIdentifierSyntax?: (
    syntax: StringIdentifierSyntax,
    visitor: (syntax: Syntax) => string | boolean
  ) => boolean | string

  /**
   * 打印加法运算符语法
   */
  visitAddSyntax?: (
    syntax: AddSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印除运算符语法
   */
  visitDivideSyntax?: (
    syntax: DivideSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印乘运算符语法
   */
  visitMultiplySyntax?: (
    syntax: MultiplySyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印减运算符语法
   */
  visitSubtractSyntax?: (
    syntax: SubtractSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 Equal 语法
   */
  visitEqualSyntax?: (
    syntax: EqualSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 GreaterOrEqual 语法
   */
  visitGreaterOrEqualSyntax?: (
    syntax: GreaterOrEqualSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 GreaterThan 语法
   */
  visitGreaterThanSyntax?: (
    syntax: GreaterThanSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 LessOrEqual 语法
   */
  visitLessOrEqualSyntax?: (
    syntax: LessOrEqualSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 LessThan 语法
   */
  visitLessThanSyntax?: (
    syntax: LessThanSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 NotEqual 语法
   */
  visitNotEqualSyntax?: (
    syntax: NotEqualSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 And 语法
   */
  visitAndSyntax?: (
    syntax: AndSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 Not 语法
   */
  visitNotSyntax?: (
    syntax: NotSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 Or 语法
   */
  visitOrSyntax?: (
    syntax: OrSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 EntityField 语法
   */
  visitEntityFieldSyntax?: (
    syntax: EntityFieldSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 ForeachVar 语法
   */
  visitForeachVarSyntax?: (
    syntax: ForeachVarSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RuleBusinessResult 语法
   */
  visitRuleBusinessResultSyntax?: (
    syntax: RuleBusinessResultSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RulesetEntityFieldInput 语法
   */
  visitRulesetEntityFieldInputSyntax?: (
    syntax: RulesetEntityFieldInputSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RulesetEntityFieldOutput 语法
   */
  visitRulesetEntityFieldOutputSyntax?: (
    syntax: RulesetEntityFieldOutputSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RulesetEntityFieldVar 语法
   */
  visitRulesetEntityFieldVarSyntax?: (
    syntax: RulesetEntityFieldVarSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RulesetInput 语法
   */
  visitRulesetInputSyntax?: (
    syntax: RulesetInputSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RulesetOutput 语法
   */
  visitRulesetOutputSyntax?: (
    syntax: RulesetOutputSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 RulesetVar 语法
   */
  visitRulesetVarSyntax?: (
    syntax: RulesetVarSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 WindowVar 语法
   */
  visitWindowVarSyntax?: (
    syntax: WindowVarSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 BusinessWidgetProperty 语法
   */
  visitBusinessWidgetPropertySyntax?: (
    syntax: BusinessWidgetPropertySyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 WidgetProperty 语法
   */
  visitWidgetPropertySyntax?: (
    syntax: WidgetPropertySyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 WorkflowVar 语法
   */
  visitWorkflowVarSyntax?: (
    syntax: WorkflowVarSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 ParseResult 语法
   */
  visitParseResultSyntax?: (
    syntax: ParseResultSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string

  /**
   * 打印 Unknown 语法
   */
  visitUnknownSyntax?: (
    syntax: UnknownSyntax,
    visitor: (syntax: Syntax) => boolean | string
  ) => boolean | string
}

export default ExpressionVisitor
