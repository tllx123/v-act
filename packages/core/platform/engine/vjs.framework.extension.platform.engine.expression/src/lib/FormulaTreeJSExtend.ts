// $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\itop5.0\\My Dropbox\\svn\\Trunk\\03Component\\01ITOP\\12itop-formula\\WebContent\\itop\\formula\\com.toone.itop.formula.FormulaTreeJS.g 2011-08-24 14:59:55

com.toone.itop.formula.FormulaTreeJSExtend = function (context, input, state) {
  ;(function () {
    this._setContext(context)
  }.call(this))

  com.toone.itop.formula.FormulaTreeJSExtend.superclass.constructor.call(
    this,
    input,
    state
  )
}

org.antlr.lang.extend(
  com.toone.itop.formula.FormulaTreeJSExtend,
  com.toone.itop.formula.FormulaTreeJS,
  {}
)

org.antlr.lang.augmentObject(
  com.toone.itop.formula.FormulaTreeJSExtend.prototype,
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
