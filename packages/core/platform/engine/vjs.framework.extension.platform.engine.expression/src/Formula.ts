com.toone.itop.formula.Formula = {
  cache: {},

  eval: function (formula, context) {
    var _context = context
    if (!_context) {
      _context = new com.toone.itop.formula.Map()
    }
    _context.put('_isExecutable', true)

    // 缓存公式引擎的分词结果
    var formulaCache = com.toone.itop.formula.Formula.cache[formula]
    var cstream, lexer, tstream, parser, formulaTree
    if (formulaCache) {
      tstream = formulaCache['tstream']
      formulaTree = formulaCache['formulaTree']
    } else {
      cstream = new org.antlr.runtime.ANTLRStringStream(formula)
      lexer = new com.toone.itop.formula.FormulaJSLexer(cstream)
      tstream = new org.antlr.runtime.CommonTokenStream(lexer)
      parser = new com.toone.itop.formula.FormulaJSParser(tstream)
      formulaTree = parser.formula().getTree()
      com.toone.itop.formula.Formula.cache[formula] = {
        tstream: tstream,
        formulaTree: formulaTree
      }
    }

    var nodes = new org.antlr.runtime.tree.CommonTreeNodeStream(formulaTree)
    nodes.setTokenStream(tstream)
    var walker = new com.toone.itop.formula.FormulaTreeJSExtend(_context, nodes)
    return walker.eval()
  },

  varFinder: function (formula, context) {
    var _context = context
    if (!_context) {
      _context = new com.toone.itop.formula.Map()
    }
    _context.put('_isExecutable', false)

    // 缓存公式引擎的分词结果
    var formulaCache = com.toone.itop.formula.Formula.cache[formula]
    var cstream, lexer, tstream, parser, formulaTree
    if (formulaCache) {
      tstream = formulaCache['tstream']
      formulaTree = formulaCache['formulaTree']
    } else {
      cstream = new org.antlr.runtime.ANTLRStringStream(formula)
      lexer = new com.toone.itop.formula.FormulaJSLexer(cstream)
      tstream = new org.antlr.runtime.CommonTokenStream(lexer)
      parser = new com.toone.itop.formula.FormulaJSParser(tstream)
      formulaTree = parser.formula().getTree()
      com.toone.itop.formula.Formula.cache[formula] = {
        tstream: tstream,
        formulaTree: formulaTree
      }
    }

    var nodes = new org.antlr.runtime.tree.CommonTreeNodeStream(formulaTree)
    nodes.setTokenStream(tstream)
    var walker = new com.toone.itop.formula.FormulaVarFinderJSExtend(
      _context,
      nodes
    )
    walker.eval()
    return _context.get(
      com.toone.itop.formula.FormulaTreeExtra.VARIABLE_VALUE_KEY
    )
  }
}
