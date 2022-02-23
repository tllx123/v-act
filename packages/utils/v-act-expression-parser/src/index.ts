import { parse as p } from './ast/Parser'
import Syntax from './ast/syntax/Syntax'
import Printer from './Printer'

const parse = function (exp: string): Syntax {
  return p(exp)
}

const print = function (syntax: Syntax, printer: Printer): string {
  //todo
  return ''
}

export { parse, print, Printer }
