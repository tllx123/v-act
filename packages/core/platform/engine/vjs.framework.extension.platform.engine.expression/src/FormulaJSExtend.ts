com.toone.itop.formula.ext = {
  FormulaJSLexer: {},
  Util: {}
}

// 目前公式引擎的FormulaJSLexer中存在耗时循环操作,暂时使用setTimeout切片逻辑 TODO-后期考虑优化FormulaJSLexer的原有算法
com.toone.itop.formula.ext.Util.chunk = function (array, process, context) {
  if (array) {
    if (
      window.jQuery &&
      jQuery.browser.msie &&
      jQuery.inArray(jQuery.browser.version, ['5.0', '6.0', '7.0', '8.0']) > -1
    ) {
      seajs.ready = false
      var items = array.concat()
      setTimeout(function () {
        let item = items.shift()
        process.call(context, item)

        if (items.length > 0) {
          setTimeout(arguments.callee, 0)
        } else {
          //init.js 框架执行入口依赖这个状态
          seajs.ready = true
        }
      }, 0)
    } else {
      for (var i = 0; i < array.length; i++) {
        process.call(context, array[i])
      }
    }
  }
}

com.toone.itop.formula.ext.FormulaJSLexer.processDFATransition = function (
  item
) {
  var dfaTransition = com.toone.itop.formula.FormulaJSLexer[this.key]
  if (!dfaTransition) {
    com.toone.itop.formula.FormulaJSLexer[this.key] = []
  } else {
    dfaTransition.push(org.antlr.runtime.DFA.unpackEncodedString(item))
  }
}
