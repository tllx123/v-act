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
  visitFunctionSyntax?: (syntax: FunctionSyntax) => void | boolean

  /**
   * 打印括号语法
   */
  visitBacketSyntax?: (syntax: BracketSyntax) => void | boolean

  /**
   * 打印布尔关键字语法
   */
  visitBooleanIdentifierSyntax?: (
    syntax: BooleanIdentifierSyntax
  ) => void | boolean

  /**
   * 打印构件变量语法
   */
  visitComponentVarSyntax?: (syntax: ComponentVarSyntax) => void | boolean

  /**
   * 打印数值语法
   */
  visitNumberIdentifierSyntax?: (
    syntax: NumberIdentifierSyntax
  ) => void | boolean

  /**
   * 打印字符串常量语法
   */
  visitStringIdentifierSyntax?: (
    syntax: StringIdentifierSyntax
  ) => void | boolean

  /**
   * 打印加法运算符语法
   */
  visitAddSyntax?: (syntax: AddSyntax) => void | boolean

  /**
   * 打印除运算符语法
   */
  visitDivideSyntax?: (syntax: DivideSyntax) => void | boolean

  /**
   * 打印乘运算符语法
   */
  visitMultiplySyntax?: (syntax: MultiplySyntax) => void | boolean

  /**
   * 打印减运算符语法
   */
  visitSubtractSyntax?: (syntax: SubtractSyntax) => void | boolean

  /**
   * 打印 Equal 语法
   */
  visitEqualSyntax?: (syntax: EqualSyntax) => void | boolean

  /**
   * 打印 GreaterOrEqual 语法
   */
  visitGreaterOrEqualSyntax?: (syntax: GreaterOrEqualSyntax) => void | boolean

  /**
   * 打印 GreaterThan 语法
   */
  visitGreaterThanSyntax?: (syntax: GreaterThanSyntax) => void | boolean

  /**
   * 打印 LessOrEqual 语法
   */
  visitLessOrEqualSyntax?: (syntax: LessOrEqualSyntax) => void | boolean

  /**
   * 打印 LessThan 语法
   */
  visitLessThanSyntax?: (syntax: LessThanSyntax) => void | boolean

  /**
   * 打印 NotEqual 语法
   */
  visitNotEqualSyntax?: (syntax: NotEqualSyntax) => void | boolean

  /**
   * 打印 And 语法
   */
  visitAndSyntax?: (syntax: AndSyntax) => void | boolean

  /**
   * 打印 Not 语法
   */
  visitNotSyntax?: (syntax: NotSyntax) => void | boolean

  /**
   * 打印 Or 语法
   */
  visitOrSyntax?: (syntax: OrSyntax) => void | boolean

  /**
   * 打印 EntityField 语法
   */
  visitEntityFieldSyntax?: (syntax: EntityFieldSyntax) => void | boolean

  /**
   * 打印 ForeachVar 语法
   */
  visitForeachVarSyntax?: (syntax: ForeachVarSyntax) => void | boolean

  /**
   * 打印 RuleBusinessResult 语法
   */
  visitRuleBusinessResultSyntax?: (
    syntax: RuleBusinessResultSyntax
  ) => void | boolean

  /**
   * 打印 RulesetEntityFieldInput 语法
   */
  visitRulesetEntityFieldInputSyntax?: (
    syntax: RulesetEntityFieldInputSyntax
  ) => void | boolean

  /**
   * 打印 RulesetEntityFieldOutput 语法
   */
  visitRulesetEntityFieldOutputSyntax?: (
    syntax: RulesetEntityFieldOutputSyntax
  ) => void | boolean

  /**
   * 打印 RulesetEntityFieldVar 语法
   */
  visitRulesetEntityFieldVarSyntax?: (
    syntax: RulesetEntityFieldVarSyntax
  ) => void | boolean

  /**
   * 打印 RulesetInput 语法
   */
  visitRulesetInputSyntax?: (syntax: RulesetInputSyntax) => void | boolean

  /**
   * 打印 RulesetOutput 语法
   */
  visitRulesetOutputSyntax?: (syntax: RulesetOutputSyntax) => void | boolean

  /**
   * 打印 RulesetVar 语法
   */
  visitRulesetVarSyntax?: (syntax: RulesetVarSyntax) => void | boolean

  /**
   * 打印 WindowVar 语法
   */
  visitWindowVarSyntax?: (syntax: WindowVarSyntax) => void | boolean

  /**
   * 打印 BusinessWidgetProperty 语法
   */
  visitBusinessWidgetPropertySyntax?: (
    syntax: BusinessWidgetPropertySyntax
  ) => void | boolean

  /**
   * 打印 WidgetProperty 语法
   */
  visitWidgetPropertySyntax?: (syntax: WidgetPropertySyntax) => void | boolean

  /**
   * 打印 WorkflowVar 语法
   */
  visitWorkflowVarSyntax?: (syntax: WorkflowVarSyntax) => void | boolean

  /**
   * 打印 ParseResult 语法
   */
  visitParseResultSyntax?: (syntax: ParseResultSyntax) => void | boolean

  /**
   * 打印 Unknown 语法
   */
  visitUnknownSyntax?: (syntax: UnknownSyntax) => void | boolean
}

export default ExpressionVisitor
