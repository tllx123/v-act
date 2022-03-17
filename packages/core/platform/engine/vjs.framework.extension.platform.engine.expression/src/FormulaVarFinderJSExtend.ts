com.toone.itop.formula.FormulaVarFinderJSExtend = function (
  context,
  input,
  state
) {
  ;(function () {
    this._setContext(context)
  }.call(this))

  com.toone.itop.formula.FormulaVarFinderJSExtend.superclass.constructor.call(
    this,
    input,
    state
  )
}

org.antlr.lang.extend(
  com.toone.itop.formula.FormulaVarFinderJSExtend,
  com.toone.itop.formula.FormulaVarFinderJS,
  {}
)

org.antlr.lang.augmentObject(
  com.toone.itop.formula.FormulaVarFinderJSExtend.prototype,
  {
    _map: null,

    _getContext: function () {
      return this._map
    },

    _setContext: function (map) {
      this._map = map
    }
  }
)
