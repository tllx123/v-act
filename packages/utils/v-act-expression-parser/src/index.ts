import { parse as p } from './ast/Parser'
import Syntax from './ast/syntax/Syntax'
import FunctionSyntax from './ast/syntax/vplatform/func/FunctionSyntax'
import type Printer from './Printer'
import type Visitor from './Visitor'

const parse = function (exp: string): Syntax {
  return p(exp)
}

const print = function (syntax: Syntax, printer: Printer): string {
  const ctx = syntax.getContext()
  ctx.setPrinter(printer)
  return syntax.toString()
}
const visit = function (syntax: Syntax, visitor: Visitor): void | boolean {
  const ctx = syntax.getContext()
  ctx.setVisitor(visitor)
  return syntax.visit()
}
/**
 * 从表达式中解析出用到的函数
 * @param exp
 */
const getFuncs = function (exp: string) {
  const syntax = parse(exp)
  const funcs: string[] = []
  visit(syntax, {
    visitFunctionSyntax: function (syntax: FunctionSyntax) {
      const funcCode = syntax.getCode()
      if (funcs.indexOf(funcCode) == -1) {
        funcs.push(funcCode)
      }
    }
  })
  return funcs
}

export { getFuncs, parse, print, Printer, visit, Visitor }
