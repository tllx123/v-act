import {
  CommaToken,
  LeftParenToken,
  RightParenToken,
  Token
} from '@v-act/tokenizer'

import { parseToSyntax } from '../../../Parser'
import Position from '../../../Position'
import SyntaxParseContext from '../../../SyntaxParseContext'
import { isVarToken } from '../../../utils/TokenUtils'
import Syntax from '../../Syntax'

const findFunctionName = function (index: number, tokens: Token[]) {
  let funNameTokens = []
  while (true) {
    let token = tokens[--index]
    if (isVarToken(token)) {
      funNameTokens.push(token)
    } else {
      break
    }
    if (index == 0) {
      break
    }
  }
  return funNameTokens.reverse()
}

let findRightParenTokenIndex = function (index: number, tokens: Token[]) {
  let rightParenTokenIndex = -1
  let parenTokens: Token[] = []
  while (true) {
    let token = tokens[index]
    if (token instanceof LeftParenToken) {
      parenTokens.push(token)
    } else if (token instanceof RightParenToken) {
      if (parenTokens.length > 0) {
        let iden = parenTokens.pop()
        if (iden instanceof LeftParenToken) {
          if (parenTokens.length == 0) {
            rightParenTokenIndex = index
            break
          }
        } else {
          if (iden) parenTokens.push(iden)
          parenTokens.push(token)
        }
      } else {
        parenTokens.push(token)
      }
    }
    index++
    if (index == tokens.length) {
      break
    }
  }
  return rightParenTokenIndex
}

let splitArgTokens = function (start: number, end: number, tokens: Token[]) {
  let argTokens = [],
    parenTokens: Token[] = []
  let index = start + 1
  let startIndex = index
  if (startIndex != end) {
    while (true) {
      let token = tokens[index]
      if (token instanceof LeftParenToken) {
        parenTokens.push(token)
      } else if (token instanceof RightParenToken) {
        if (parenTokens.length > 0) {
          let iden = parenTokens.pop()
          if (!(iden instanceof LeftParenToken)) {
            if (iden) parenTokens.push(iden)
            parenTokens.push(token)
          }
        } else {
          parenTokens.push(token)
        }
      } else if (token instanceof CommaToken) {
        if (parenTokens.length == 0) {
          argTokens.push(tokens.slice(startIndex, index))
          startIndex = index + 1
        }
      }
      index++
      if (index == end) {
        if (startIndex != end) {
          argTokens.push(tokens.slice(startIndex, end))
        }
        break
      }
    }
  }
  return argTokens
}

class FunctionSyntax extends Syntax {
  code: string

  args: Syntax[]

  static accept = function (context: SyntaxParseContext) {
    let token = context.getToken()
    if (token instanceof LeftParenToken) {
      let index = context.getIndex()
      let tokens = context.getTokens()
      let funNameTokens = findFunctionName(index, <Token[]>tokens)
      if (funNameTokens.length > 0) {
        let rightParenTokenIndex = findRightParenTokenIndex(
          index,
          <Token[]>tokens
        )
        return rightParenTokenIndex !== -1
      }
    }
    return false
  }

  static parse = function (context: SyntaxParseContext) {
    let index = context.getIndex()
    let tokens = context.getTokens()
    let funNameTokens = findFunctionName(index, <Token[]>tokens)
    let funName = funNameTokens.join('')
    let startIndex = index - funName.length
    let rightParenTokenIndex = findRightParenTokenIndex(index, <Token[]>tokens)
    let argTokens = splitArgTokens(index, rightParenTokenIndex, <Token[]>tokens)
    let args: Syntax[] = []
    argTokens.forEach((argToken) => {
      args.push(parseToSyntax(argToken))
    })
    let position = new Position()
    position.parseStartToken(<Token>tokens[startIndex])
    position.parseEndToken(<Token>tokens[rightParenTokenIndex])
    return new FunctionSyntax(
      startIndex,
      rightParenTokenIndex,
      funName,
      args,
      position,
      context
    )
  }

  static getWeight = function () {
    return 1100
  }

  constructor(
    startTokenIndex: number,
    endTokenIndex: number,
    code: string,
    args: Syntax[],
    position: Position,
    context: SyntaxParseContext
  ) {
    super(startTokenIndex, endTokenIndex, position, context)
    this.code = code
    this.args = args
  }

  getCode() {
    return this.code
  }

  getArgs() {
    return this.args
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printFunctionSyntax) {
      return printer.printFunctionSyntax(this, (syntax) => syntax.toString())
    } else {
      let argScript: string[] = []
      let args = this.getArgs()
      if (args && args.length > 0) {
        args.forEach((arg) => {
          if (arg) {
            argScript.push(arg.toString())
          }
          argScript.push(',')
        })
        argScript.pop()
      }
      return `${this.getCode()}(${
        argScript.length > 0 ? argScript.join('') : ''
      })`
    }
  }

  visit() {
    const ctx = this.getContext()
    const visitor = ctx.getVisitor()
    if (visitor && visitor.visitFunctionSyntax) {
      const res = visitor.visitFunctionSyntax(this)
      if (res !== false) {
        let args = this.getArgs()
        if (args && args.length > 0) {
          args.forEach((arg) => {
            arg.visit()
          })
        }
      }
    }
  }
}

export default FunctionSyntax
