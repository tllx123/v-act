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
}

export default ParseResultSyntax
