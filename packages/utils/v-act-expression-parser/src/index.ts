import { parse as p } from './ast/Parser'
import Syntax from './ast/syntax/Syntax'
import Printer from './Printer'
import Visitor from './Visitor'

const parse = function (exp: string): Syntax {
  return p(exp)
}

const print = function (syntax: Syntax, printer: Printer): string {
  const ctx = syntax.getContext()
  ctx.setPrinter(printer)
  return syntax.toString()
}
const visit = function (syntax: Syntax, visitor: Visitor): string | boolean {
  const ctx = syntax.getContext()
  ctx.setVisitor(visitor)
  return syntax.visit()
}

export { parse, print, Printer, visit, Visitor }
