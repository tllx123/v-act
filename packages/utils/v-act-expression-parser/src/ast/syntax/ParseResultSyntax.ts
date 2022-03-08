import Position from '../Position'
import SyntaxParseContext from '../SyntaxParseContext'
import Syntax from './Syntax'

class ParseResultSyntax extends Syntax {
  syntaxs: Syntax[]

  constructor(syntaxs: Syntax[], context: SyntaxParseContext) {
    let tokenStartIndex, tokenEndIndex, position
    if (syntaxs.length > 0) {
      let first = syntaxs[0],
        last = syntaxs[syntaxs.length - 1]
      tokenStartIndex = first.getTokenStartIndex()
      tokenEndIndex = last.getTokenEndIndex()
      let firstPosition = first.getPosition()
      let lastPosition = last.getPosition()
      position = new Position(
        firstPosition.getStartLine(),
        firstPosition.getStartCol(),
        lastPosition.getEndLine(),
        lastPosition.getEndCol()
      )
    } else {
      tokenEndIndex = tokenStartIndex = 0
      position = new Position(0, 0, 0, 0)
    }
    super(tokenStartIndex, tokenEndIndex, position, context)
    this.syntaxs = syntaxs
  }

  toString() {
    const ctx = this.getContext()
    const printer = ctx.getPrinter()
    if (printer && printer.printParseResultSyntax) {
      return printer.printParseResultSyntax(this, (syntax) => syntax.toString())
    } else {
      let script: string[] = []
      this.syntaxs.forEach((syntax) => {
        script.push(syntax.toString())
      })
      return script.join('')
    }
  }

  visit() {
    const ctx = this.getContext()
    const visitor = ctx.getVisitor()
    if (visitor && visitor.visitParseResultSyntax) {
      return visitor.visitParseResultSyntax(
        this,
        (syntax) => <string>syntax.visit()
      )
    } else {
      let script: string[] = []
      this.syntaxs.forEach((syntax) => {
        if (syntax.visit() && syntax.visit() !== 'false') {
          script.push(<string>syntax.visit())
        }
      })

      script = script.toString().split(',')

      for (let i = 0; i < script.length; i++) {
        if (
          script[i] == '' ||
          script[i] == null ||
          String(script[i]) === 'false'
        ) {
          script.splice(i, 1)
          i = i - 1
        }
      }

      let uniqScript: string[] = [] // 去重数组
      for (let i = 0; i < script.length; i++) {
        uniqScript.indexOf(script[i]) == -1 && uniqScript.push(script[i])
      }

      return uniqScript.join(',')
    }
  }
}

export default ParseResultSyntax
