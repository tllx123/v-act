import Syntax from './ast/syntax/Syntax'
import { parse as p } from './ast/Parser'

const parse = function (exp: string): Syntax {
  return p(exp)
}

export { parse }
