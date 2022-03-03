// $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g 2018-10-31 15:44:04

com.toone.itop.formula.FormulaJSParser = function (input, state) {
  if (!state) {
    state = new org.antlr.runtime.RecognizerSharedState()
  }

  ;(function () {}.call(this))

  com.toone.itop.formula.FormulaJSParser.superclass.constructor.call(
    this,
    input,
    state
  )

  this.dfa7 = new com.toone.itop.formula.FormulaJSParser.DFA7(this)

  /* @todo only create adaptor if output=AST */
  this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor()
}

org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSParser, {
  EOF: -1,
  POS: 4,
  NEG: 5,
  CALL: 6,
  CONTROL: 7,
  BUSSINESSRULERESULT: 8,
  EVENTACTION: 9,
  KEYBOARD: 10,
  AND: 11,
  OR: 12,
  LT: 13,
  LTEQ: 14,
  GT: 15,
  GTEQ: 16,
  EQ: 17,
  NOTEQ: 18,
  CONCAT: 19,
  SUB: 20,
  ADD: 21,
  DIV: 22,
  MULT: 23,
  EXP: 24,
  NOT: 25,
  CONTROLPROPERTY: 26,
  COMPONENTVARIABLE: 27,
  KEYBOARDS: 28,
  SYSTEMVARIABLE: 29,
  FIELDVARIABLE: 30,
  LVVARIABLE: 31,
  DB: 32,
  USERVAR: 33,
  QUERY: 34,
  BUSSINESSRULE: 35,
  EVENTACTIONPROPERTY: 36,
  I18NVARIABLE: 37,
  ARRAY: 38,
  LPAREN: 39,
  RPAREN: 40,
  FUNCNAME: 41,
  COMMA: 42,
  NUMBER: 43,
  STRING: 44,
  TRUE: 45,
  FALSE: 46,
  LETTER: 47,
  PERCENT: 48,
  DIGIT: 49,
  ESCAPE_SEQUENCE: 50,
  WHITESPACE: 51,
  POINT: 52,
  BROUTRULE: 53,
  OUTPARENT: 54,
  VARPARENT: 55,
  INPARENT: 56,
  VARPARENTVARIABLE: 57,
  INPARENTVARIABLE: 58,
  OUTPARENTVARIABLE: 59,
  BRREPORT: 60,
  STR: 61
})

;(function () {
  // public class variables
  var EOF = -1,
    POS = 4,
    NEG = 5,
    CALL = 6,
    CONTROL = 7,
    BUSSINESSRULERESULT = 8,
    EVENTACTION = 9,
    KEYBOARD = 10,
    AND = 11,
    OR = 12,
    LT = 13,
    LTEQ = 14,
    GT = 15,
    GTEQ = 16,
    EQ = 17,
    NOTEQ = 18,
    CONCAT = 19,
    SUB = 20,
    ADD = 21,
    DIV = 22,
    MULT = 23,
    EXP = 24,
    NOT = 25,
    CONTROLPROPERTY = 26,
    COMPONENTVARIABLE = 27,
    KEYBOARDS = 28,
    SYSTEMVARIABLE = 29,
    FIELDVARIABLE = 30,
    LVVARIABLE = 31,
    DB = 32,
    USERVAR = 33,
    QUERY = 34,
    BUSSINESSRULE = 35,
    EVENTACTIONPROPERTY = 36,
    I18NVARIABLE = 37,
    ARRAY = 38,
    LPAREN = 39,
    RPAREN = 40,
    FUNCNAME = 41,
    COMMA = 42,
    NUMBER = 43,
    STRING = 44,
    TRUE = 45,
    FALSE = 46,
    LETTER = 47,
    PERCENT = 48,
    DIGIT = 49,
    ESCAPE_SEQUENCE = 50,
    WHITESPACE = 51,
    POINT = 52,
    BROUTRULE = 53,
    OUTPARENT = 54,
    VARPARENT = 55,
    INPARENT = 56,
    VARPARENTVARIABLE = 57,
    INPARENTVARIABLE = 58,
    OUTPARENTVARIABLE = 59,
    BRREPORT = 60,
    STR = 61

  // public instance methods/vars
  org.antlr.lang.extend(
    com.toone.itop.formula.FormulaJSParser,
    org.antlr.runtime.Parser,
    {
      setTreeAdaptor: function (adaptor) {
        this.adaptor = adaptor
      },
      getTreeAdaptor: function () {
        return this.adaptor
      },

      getTokenNames: function () {
        return com.toone.itop.formula.FormulaJSParser.tokenNames
      },
      getGrammarFileName: function () {
        return 'D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g'
      }
    }
  )
  org.antlr.lang.augmentObject(
    com.toone.itop.formula.FormulaJSParser.prototype,
    {
      // inline static return class
      formula_return: (function () {
        com.toone.itop.formula.FormulaJSParser.formula_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.formula_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:29:1: formula : expression ;
      // $ANTLR start "formula"
      formula: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.formula_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var expression1 = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:30:2: ( expression )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:30:4: expression
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_expression_in_formula104
          )
          expression1 = this.expression()

          this.state._fsp--

          this.adaptor.addChild(root_0, expression1.getTree())

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      expression_return: (function () {
        com.toone.itop.formula.FormulaJSParser.expression_return =
          function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.expression_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:34:1: expression : boolExpr ;
      // $ANTLR start "expression"
      expression: function () {
        var retval =
          new com.toone.itop.formula.FormulaJSParser.expression_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var boolExpr2 = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:35:2: ( boolExpr )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:35:4: boolExpr
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_boolExpr_in_expression118
          )
          boolExpr2 = this.boolExpr()

          this.state._fsp--

          this.adaptor.addChild(root_0, boolExpr2.getTree())

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      boolExpr_return: (function () {
        com.toone.itop.formula.FormulaJSParser.boolExpr_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.boolExpr_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:37:1: boolExpr : concatExpr ( ( AND | OR | LT | LTEQ | GT | GTEQ | EQ | NOTEQ ) concatExpr )* ;
      // $ANTLR start "boolExpr"
      boolExpr: function () {
        var retval =
          new com.toone.itop.formula.FormulaJSParser.boolExpr_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var set4 = null
        var concatExpr3 = null
        var concatExpr5 = null

        var set4_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:38:2: ( concatExpr ( ( AND | OR | LT | LTEQ | GT | GTEQ | EQ | NOTEQ ) concatExpr )* )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:38:4: concatExpr ( ( AND | OR | LT | LTEQ | GT | GTEQ | EQ | NOTEQ ) concatExpr )*
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_concatExpr_in_boolExpr128
          )
          concatExpr3 = this.concatExpr()

          this.state._fsp--

          this.adaptor.addChild(root_0, concatExpr3.getTree())
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:38:15: ( ( AND | OR | LT | LTEQ | GT | GTEQ | EQ | NOTEQ ) concatExpr )*
          loop1: do {
            var alt1 = 2
            var LA1_0 = this.input.LA(1)

            if (LA1_0 >= AND && LA1_0 <= NOTEQ) {
              alt1 = 1
            }

            switch (alt1) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:38:16: ( AND | OR | LT | LTEQ | GT | GTEQ | EQ | NOTEQ ) concatExpr
                //                    set4=input.LT(1);
                set4 = this.input.LT(1)
                if (this.input.LA(1) >= AND && this.input.LA(1) <= NOTEQ) {
                  this.input.consume()
                  root_0 = this.adaptor.becomeRoot(
                    this.adaptor.create(set4),
                    root_0
                  )
                  this.state.errorRecovery = false
                } else {
                  var mse = new org.antlr.runtime.MismatchedSetException(
                    null,
                    this.input
                  )
                  throw mse
                }

                this.pushFollow(
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_concatExpr_in_boolExpr164
                )
                concatExpr5 = this.concatExpr()

                this.state._fsp--

                this.adaptor.addChild(root_0, concatExpr5.getTree())

                break

              default:
                break loop1
            }
          } while (true)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      concatExpr_return: (function () {
        com.toone.itop.formula.FormulaJSParser.concatExpr_return =
          function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.concatExpr_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:40:1: concatExpr : sumExpr ( CONCAT sumExpr )* ;
      // $ANTLR start "concatExpr"
      concatExpr: function () {
        var retval =
          new com.toone.itop.formula.FormulaJSParser.concatExpr_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var CONCAT7 = null
        var sumExpr6 = null
        var sumExpr8 = null

        var CONCAT7_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:41:2: ( sumExpr ( CONCAT sumExpr )* )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:41:4: sumExpr ( CONCAT sumExpr )*
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_sumExpr_in_concatExpr176
          )
          sumExpr6 = this.sumExpr()

          this.state._fsp--

          this.adaptor.addChild(root_0, sumExpr6.getTree())
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:41:12: ( CONCAT sumExpr )*
          loop2: do {
            var alt2 = 2
            var LA2_0 = this.input.LA(1)

            if (LA2_0 == CONCAT) {
              alt2 = 1
            }

            switch (alt2) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:41:13: CONCAT sumExpr
                CONCAT7 = this.match(
                  this.input,
                  CONCAT,
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_CONCAT_in_concatExpr179
                )
                CONCAT7_tree = this.adaptor.create(CONCAT7)
                root_0 = this.adaptor.becomeRoot(CONCAT7_tree, root_0)

                this.pushFollow(
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_sumExpr_in_concatExpr182
                )
                sumExpr8 = this.sumExpr()

                this.state._fsp--

                this.adaptor.addChild(root_0, sumExpr8.getTree())

                break

              default:
                break loop2
            }
          } while (true)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      sumExpr_return: (function () {
        com.toone.itop.formula.FormulaJSParser.sumExpr_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.sumExpr_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:43:1: sumExpr : productExpr ( ( SUB | ADD ) productExpr )* ;
      // $ANTLR start "sumExpr"
      sumExpr: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.sumExpr_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var set10 = null
        var productExpr9 = null
        var productExpr11 = null

        var set10_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:44:2: ( productExpr ( ( SUB | ADD ) productExpr )* )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:44:4: productExpr ( ( SUB | ADD ) productExpr )*
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_productExpr_in_sumExpr194
          )
          productExpr9 = this.productExpr()

          this.state._fsp--

          this.adaptor.addChild(root_0, productExpr9.getTree())
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:44:16: ( ( SUB | ADD ) productExpr )*
          loop3: do {
            var alt3 = 2
            var LA3_0 = this.input.LA(1)

            if (LA3_0 >= SUB && LA3_0 <= ADD) {
              alt3 = 1
            }

            switch (alt3) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:44:17: ( SUB | ADD ) productExpr
                //                    set10=input.LT(1);
                set10 = this.input.LT(1)
                if (this.input.LA(1) >= SUB && this.input.LA(1) <= ADD) {
                  this.input.consume()
                  root_0 = this.adaptor.becomeRoot(
                    this.adaptor.create(set10),
                    root_0
                  )
                  this.state.errorRecovery = false
                } else {
                  var mse = new org.antlr.runtime.MismatchedSetException(
                    null,
                    this.input
                  )
                  throw mse
                }

                this.pushFollow(
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_productExpr_in_sumExpr206
                )
                productExpr11 = this.productExpr()

                this.state._fsp--

                this.adaptor.addChild(root_0, productExpr11.getTree())

                break

              default:
                break loop3
            }
          } while (true)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      productExpr_return: (function () {
        com.toone.itop.formula.FormulaJSParser.productExpr_return =
          function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.productExpr_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:46:1: productExpr : expExpr ( ( DIV | MULT ) expExpr )* ;
      // $ANTLR start "productExpr"
      productExpr: function () {
        var retval =
          new com.toone.itop.formula.FormulaJSParser.productExpr_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var set13 = null
        var expExpr12 = null
        var expExpr14 = null

        var set13_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:47:2: ( expExpr ( ( DIV | MULT ) expExpr )* )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:47:4: expExpr ( ( DIV | MULT ) expExpr )*
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_expExpr_in_productExpr218
          )
          expExpr12 = this.expExpr()

          this.state._fsp--

          this.adaptor.addChild(root_0, expExpr12.getTree())
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:47:12: ( ( DIV | MULT ) expExpr )*
          loop4: do {
            var alt4 = 2
            var LA4_0 = this.input.LA(1)

            if (LA4_0 >= DIV && LA4_0 <= MULT) {
              alt4 = 1
            }

            switch (alt4) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:47:13: ( DIV | MULT ) expExpr
                //                    set13=input.LT(1);
                set13 = this.input.LT(1)
                if (this.input.LA(1) >= DIV && this.input.LA(1) <= MULT) {
                  this.input.consume()
                  root_0 = this.adaptor.becomeRoot(
                    this.adaptor.create(set13),
                    root_0
                  )
                  this.state.errorRecovery = false
                } else {
                  var mse = new org.antlr.runtime.MismatchedSetException(
                    null,
                    this.input
                  )
                  throw mse
                }

                this.pushFollow(
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_expExpr_in_productExpr230
                )
                expExpr14 = this.expExpr()

                this.state._fsp--

                this.adaptor.addChild(root_0, expExpr14.getTree())

                break

              default:
                break loop4
            }
          } while (true)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      expExpr_return: (function () {
        com.toone.itop.formula.FormulaJSParser.expExpr_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.expExpr_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:49:1: expExpr : unaryOperation ( EXP unaryOperation )* ;
      // $ANTLR start "expExpr"
      expExpr: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.expExpr_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var EXP16 = null
        var unaryOperation15 = null
        var unaryOperation17 = null

        var EXP16_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:50:2: ( unaryOperation ( EXP unaryOperation )* )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:50:4: unaryOperation ( EXP unaryOperation )*
          root_0 = this.adaptor.nil()

          this.pushFollow(
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_unaryOperation_in_expExpr242
          )
          unaryOperation15 = this.unaryOperation()

          this.state._fsp--

          this.adaptor.addChild(root_0, unaryOperation15.getTree())
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:50:19: ( EXP unaryOperation )*
          loop5: do {
            var alt5 = 2
            var LA5_0 = this.input.LA(1)

            if (LA5_0 == EXP) {
              alt5 = 1
            }

            switch (alt5) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:50:20: EXP unaryOperation
                EXP16 = this.match(
                  this.input,
                  EXP,
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_EXP_in_expExpr245
                )
                EXP16_tree = this.adaptor.create(EXP16)
                root_0 = this.adaptor.becomeRoot(EXP16_tree, root_0)

                this.pushFollow(
                  com.toone.itop.formula.FormulaJSParser
                    .FOLLOW_unaryOperation_in_expExpr248
                )
                unaryOperation17 = this.unaryOperation()

                this.state._fsp--

                this.adaptor.addChild(root_0, unaryOperation17.getTree())

                break

              default:
                break loop5
            }
          } while (true)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      unaryOperation_return: (function () {
        com.toone.itop.formula.FormulaJSParser.unaryOperation_return =
          function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.unaryOperation_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:52:1: unaryOperation : ( NOT operand | ADD o= operand -> ^( POS $o) | SUB o= operand -> ^( NEG $o) | operand );
      // $ANTLR start "unaryOperation"
      unaryOperation: function () {
        var retval =
          new com.toone.itop.formula.FormulaJSParser.unaryOperation_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var NOT18 = null
        var ADD20 = null
        var SUB21 = null
        var o = null
        var operand19 = null
        var operand22 = null

        var NOT18_tree = null
        var ADD20_tree = null
        var SUB21_tree = null
        var stream_SUB = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token SUB'
        )
        var stream_ADD = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token ADD'
        )
        var stream_operand =
          new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
            this.adaptor,
            'rule operand'
          )
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:53:2: ( NOT operand | ADD o= operand -> ^( POS $o) | SUB o= operand -> ^( NEG $o) | operand )
          var alt6 = 4
          switch (this.input.LA(1)) {
            case NOT:
              alt6 = 1
              break
            case ADD:
              alt6 = 2
              break
            case SUB:
              alt6 = 3
              break
            case CONTROLPROPERTY:
            case COMPONENTVARIABLE:
            case KEYBOARDS:
            case SYSTEMVARIABLE:
            case FIELDVARIABLE:
            case LVVARIABLE:
            case DB:
            case USERVAR:
            case QUERY:
            case BUSSINESSRULE:
            case EVENTACTIONPROPERTY:
            case I18NVARIABLE:
            case ARRAY:
            case LPAREN:
            case FUNCNAME:
            case NUMBER:
            case STRING:
            case TRUE:
            case FALSE:
            case LETTER:
            case BROUTRULE:
            case OUTPARENT:
            case VARPARENT:
            case INPARENT:
            case VARPARENTVARIABLE:
            case INPARENTVARIABLE:
            case OUTPARENTVARIABLE:
            case BRREPORT:
              alt6 = 4
              break
            default:
              var nvae = new org.antlr.runtime.NoViableAltException(
                '',
                6,
                0,
                this.input
              )

              throw nvae
          }

          switch (alt6) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:53:4: NOT operand
              root_0 = this.adaptor.nil()

              NOT18 = this.match(
                this.input,
                NOT,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_NOT_in_unaryOperation260
              )
              NOT18_tree = this.adaptor.create(NOT18)
              root_0 = this.adaptor.becomeRoot(NOT18_tree, root_0)

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_operand_in_unaryOperation263
              )
              operand19 = this.operand()

              this.state._fsp--

              this.adaptor.addChild(root_0, operand19.getTree())

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:54:4: ADD o= operand
              ADD20 = this.match(
                this.input,
                ADD,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_ADD_in_unaryOperation268
              )
              stream_ADD.add(ADD20)

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_operand_in_unaryOperation272
              )
              o = this.operand()

              this.state._fsp--

              stream_operand.add(o.getTree())

              // AST REWRITE
              // elements: o
              // token labels:
              // rule labels: retval, o
              // token list labels:
              // rule list labels:
              retval.tree = root_0
              var stream_retval =
                new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
                  this.adaptor,
                  'token retval',
                  retval != null ? retval.tree : null
                )
              var stream_o =
                new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
                  this.adaptor,
                  'token o',
                  o != null ? o.tree : null
                )

              root_0 = this.adaptor.nil()
              // 54:18: -> ^( POS $o)
              {
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:54:21: ^( POS $o)
                {
                  var root_1 = this.adaptor.nil()
                  root_1 = this.adaptor.becomeRoot(
                    this.adaptor.create(POS, 'POS'),
                    root_1
                  )

                  this.adaptor.addChild(root_1, stream_o.nextTree())

                  this.adaptor.addChild(root_0, root_1)
                }
              }

              retval.tree = root_0

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:55:4: SUB o= operand
              SUB21 = this.match(
                this.input,
                SUB,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_SUB_in_unaryOperation286
              )
              stream_SUB.add(SUB21)

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_operand_in_unaryOperation290
              )
              o = this.operand()

              this.state._fsp--

              stream_operand.add(o.getTree())

              // AST REWRITE
              // elements: o
              // token labels:
              // rule labels: retval, o
              // token list labels:
              // rule list labels:
              retval.tree = root_0
              var stream_retval =
                new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
                  this.adaptor,
                  'token retval',
                  retval != null ? retval.tree : null
                )
              var stream_o =
                new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
                  this.adaptor,
                  'token o',
                  o != null ? o.tree : null
                )

              root_0 = this.adaptor.nil()
              // 55:18: -> ^( NEG $o)
              {
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:55:21: ^( NEG $o)
                {
                  var root_1 = this.adaptor.nil()
                  root_1 = this.adaptor.becomeRoot(
                    this.adaptor.create(NEG, 'NEG'),
                    root_1
                  )

                  this.adaptor.addChild(root_1, stream_o.nextTree())

                  this.adaptor.addChild(root_0, root_1)
                }
              }

              retval.tree = root_0

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:56:4: operand
              root_0 = this.adaptor.nil()

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_operand_in_unaryOperation304
              )
              operand22 = this.operand()

              this.state._fsp--

              this.adaptor.addChild(root_0, operand22.getTree())

              break
          }
          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      operand_return: (function () {
        com.toone.itop.formula.FormulaJSParser.operand_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.operand_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:60:1: operand : ( literal | functionExpr | percent | CONTROLPROPERTY | COMPONENTVARIABLE | KEYBOARDS | SYSTEMVARIABLE | FIELDVARIABLE | LVVARIABLE | DB | USERVAR | brParam | QUERY | BUSSINESSRULE | EVENTACTIONPROPERTY | I18NVARIABLE | ARRAY | LPAREN expression RPAREN -> expression );
      // $ANTLR start "operand"
      operand: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.operand_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var CONTROLPROPERTY26 = null
        var COMPONENTVARIABLE27 = null
        var KEYBOARDS28 = null
        var SYSTEMVARIABLE29 = null
        var FIELDVARIABLE30 = null
        var LVVARIABLE31 = null
        var DB32 = null
        var USERVAR33 = null
        var QUERY35 = null
        var BUSSINESSRULE36 = null
        var EVENTACTIONPROPERTY37 = null
        var I18NVARIABLE38 = null
        var ARRAY39 = null
        var LPAREN40 = null
        var RPAREN42 = null
        var literal23 = null
        var functionExpr24 = null
        var percent25 = null
        var brParam34 = null
        var expression41 = null

        var CONTROLPROPERTY26_tree = null
        var COMPONENTVARIABLE27_tree = null
        var KEYBOARDS28_tree = null
        var SYSTEMVARIABLE29_tree = null
        var FIELDVARIABLE30_tree = null
        var LVVARIABLE31_tree = null
        var DB32_tree = null
        var USERVAR33_tree = null
        var QUERY35_tree = null
        var BUSSINESSRULE36_tree = null
        var EVENTACTIONPROPERTY37_tree = null
        var I18NVARIABLE38_tree = null
        var ARRAY39_tree = null
        var LPAREN40_tree = null
        var RPAREN42_tree = null
        var stream_RPAREN = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token RPAREN'
        )
        var stream_LPAREN = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token LPAREN'
        )
        var stream_expression =
          new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
            this.adaptor,
            'rule expression'
          )
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:61:2: ( literal | functionExpr | percent | CONTROLPROPERTY | COMPONENTVARIABLE | KEYBOARDS | SYSTEMVARIABLE | FIELDVARIABLE | LVVARIABLE | DB | USERVAR | brParam | QUERY | BUSSINESSRULE | EVENTACTIONPROPERTY | I18NVARIABLE | ARRAY | LPAREN expression RPAREN -> expression )
          var alt7 = 18
          alt7 = this.dfa7.predict(this.input)
          switch (alt7) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:61:4: literal
              root_0 = this.adaptor.nil()

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_literal_in_operand316
              )
              literal23 = this.literal()

              this.state._fsp--

              this.adaptor.addChild(root_0, literal23.getTree())

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:62:4: functionExpr
              root_0 = this.adaptor.nil()

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_functionExpr_in_operand322
              )
              functionExpr24 = this.functionExpr()

              this.state._fsp--

              this.adaptor.addChild(root_0, functionExpr24.getTree())

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:63:4: percent
              root_0 = this.adaptor.nil()

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_percent_in_operand328
              )
              percent25 = this.percent()

              this.state._fsp--

              this.adaptor.addChild(root_0, percent25.getTree())

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:64:4: CONTROLPROPERTY
              root_0 = this.adaptor.nil()

              CONTROLPROPERTY26 = this.match(
                this.input,
                CONTROLPROPERTY,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_CONTROLPROPERTY_in_operand333
              )
              CONTROLPROPERTY26_tree = this.adaptor.create(CONTROLPROPERTY26)
              this.adaptor.addChild(root_0, CONTROLPROPERTY26_tree)

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:65:4: COMPONENTVARIABLE
              root_0 = this.adaptor.nil()

              COMPONENTVARIABLE27 = this.match(
                this.input,
                COMPONENTVARIABLE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_COMPONENTVARIABLE_in_operand338
              )
              COMPONENTVARIABLE27_tree =
                this.adaptor.create(COMPONENTVARIABLE27)
              this.adaptor.addChild(root_0, COMPONENTVARIABLE27_tree)

              break
            case 6:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:66:4: KEYBOARDS
              root_0 = this.adaptor.nil()

              KEYBOARDS28 = this.match(
                this.input,
                KEYBOARDS,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_KEYBOARDS_in_operand343
              )
              KEYBOARDS28_tree = this.adaptor.create(KEYBOARDS28)
              this.adaptor.addChild(root_0, KEYBOARDS28_tree)

              break
            case 7:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:67:4: SYSTEMVARIABLE
              root_0 = this.adaptor.nil()

              SYSTEMVARIABLE29 = this.match(
                this.input,
                SYSTEMVARIABLE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_SYSTEMVARIABLE_in_operand348
              )
              SYSTEMVARIABLE29_tree = this.adaptor.create(SYSTEMVARIABLE29)
              this.adaptor.addChild(root_0, SYSTEMVARIABLE29_tree)

              break
            case 8:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:68:4: FIELDVARIABLE
              root_0 = this.adaptor.nil()

              FIELDVARIABLE30 = this.match(
                this.input,
                FIELDVARIABLE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_FIELDVARIABLE_in_operand353
              )
              FIELDVARIABLE30_tree = this.adaptor.create(FIELDVARIABLE30)
              this.adaptor.addChild(root_0, FIELDVARIABLE30_tree)

              break
            case 9:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:69:4: LVVARIABLE
              root_0 = this.adaptor.nil()

              LVVARIABLE31 = this.match(
                this.input,
                LVVARIABLE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_LVVARIABLE_in_operand358
              )
              LVVARIABLE31_tree = this.adaptor.create(LVVARIABLE31)
              this.adaptor.addChild(root_0, LVVARIABLE31_tree)

              break
            case 10:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:70:4: DB
              root_0 = this.adaptor.nil()

              DB32 = this.match(
                this.input,
                DB,
                com.toone.itop.formula.FormulaJSParser.FOLLOW_DB_in_operand363
              )
              DB32_tree = this.adaptor.create(DB32)
              this.adaptor.addChild(root_0, DB32_tree)

              break
            case 11:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:71:4: USERVAR
              root_0 = this.adaptor.nil()

              USERVAR33 = this.match(
                this.input,
                USERVAR,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_USERVAR_in_operand369
              )
              USERVAR33_tree = this.adaptor.create(USERVAR33)
              this.adaptor.addChild(root_0, USERVAR33_tree)

              break
            case 12:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:72:4: brParam
              root_0 = this.adaptor.nil()

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_brParam_in_operand374
              )
              brParam34 = this.brParam()

              this.state._fsp--

              this.adaptor.addChild(root_0, brParam34.getTree())

              break
            case 13:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:73:4: QUERY
              root_0 = this.adaptor.nil()

              QUERY35 = this.match(
                this.input,
                QUERY,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_QUERY_in_operand379
              )
              QUERY35_tree = this.adaptor.create(QUERY35)
              this.adaptor.addChild(root_0, QUERY35_tree)

              break
            case 14:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:74:4: BUSSINESSRULE
              root_0 = this.adaptor.nil()

              BUSSINESSRULE36 = this.match(
                this.input,
                BUSSINESSRULE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_BUSSINESSRULE_in_operand384
              )
              BUSSINESSRULE36_tree = this.adaptor.create(BUSSINESSRULE36)
              this.adaptor.addChild(root_0, BUSSINESSRULE36_tree)

              break
            case 15:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:75:4: EVENTACTIONPROPERTY
              root_0 = this.adaptor.nil()

              EVENTACTIONPROPERTY37 = this.match(
                this.input,
                EVENTACTIONPROPERTY,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_EVENTACTIONPROPERTY_in_operand389
              )
              EVENTACTIONPROPERTY37_tree = this.adaptor.create(
                EVENTACTIONPROPERTY37
              )
              this.adaptor.addChild(root_0, EVENTACTIONPROPERTY37_tree)

              break
            case 16:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:76:4: I18NVARIABLE
              root_0 = this.adaptor.nil()

              I18NVARIABLE38 = this.match(
                this.input,
                I18NVARIABLE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_I18NVARIABLE_in_operand394
              )
              I18NVARIABLE38_tree = this.adaptor.create(I18NVARIABLE38)
              this.adaptor.addChild(root_0, I18NVARIABLE38_tree)

              break
            case 17:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:77:4: ARRAY
              root_0 = this.adaptor.nil()

              ARRAY39 = this.match(
                this.input,
                ARRAY,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_ARRAY_in_operand399
              )
              ARRAY39_tree = this.adaptor.create(ARRAY39)
              this.adaptor.addChild(root_0, ARRAY39_tree)

              break
            case 18:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:78:4: LPAREN expression RPAREN
              LPAREN40 = this.match(
                this.input,
                LPAREN,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_LPAREN_in_operand404
              )
              stream_LPAREN.add(LPAREN40)

              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_expression_in_operand406
              )
              expression41 = this.expression()

              this.state._fsp--

              stream_expression.add(expression41.getTree())
              RPAREN42 = this.match(
                this.input,
                RPAREN,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_RPAREN_in_operand408
              )
              stream_RPAREN.add(RPAREN42)

              // AST REWRITE
              // elements: expression
              // token labels:
              // rule labels: retval
              // token list labels:
              // rule list labels:
              retval.tree = root_0
              var stream_retval =
                new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
                  this.adaptor,
                  'token retval',
                  retval != null ? retval.tree : null
                )

              root_0 = this.adaptor.nil()
              // 78:29: -> expression
              {
                this.adaptor.addChild(root_0, stream_expression.nextTree())
              }

              retval.tree = root_0

              break
          }
          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      functionExpr_return: (function () {
        com.toone.itop.formula.FormulaJSParser.functionExpr_return =
          function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.functionExpr_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:82:1: functionExpr : FUNCNAME ( ( boolExpr ) ( COMMA ( boolExpr ) )* )? RPAREN ;
      // $ANTLR start "functionExpr"
      functionExpr: function () {
        var retval =
          new com.toone.itop.formula.FormulaJSParser.functionExpr_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var FUNCNAME43 = null
        var COMMA45 = null
        var RPAREN47 = null
        var boolExpr44 = null
        var boolExpr46 = null

        var FUNCNAME43_tree = null
        var COMMA45_tree = null
        var RPAREN47_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:2: ( FUNCNAME ( ( boolExpr ) ( COMMA ( boolExpr ) )* )? RPAREN )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:4: FUNCNAME ( ( boolExpr ) ( COMMA ( boolExpr ) )* )? RPAREN
          root_0 = this.adaptor.nil()

          FUNCNAME43 = this.match(
            this.input,
            FUNCNAME,
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_FUNCNAME_in_functionExpr425
          )
          FUNCNAME43_tree = this.adaptor.create(FUNCNAME43)
          root_0 = this.adaptor.becomeRoot(FUNCNAME43_tree, root_0)

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:15: ( ( boolExpr ) ( COMMA ( boolExpr ) )* )?
          var alt9 = 2
          var LA9_0 = this.input.LA(1)

          if (
            (LA9_0 >= SUB && LA9_0 <= ADD) ||
            (LA9_0 >= NOT && LA9_0 <= LPAREN) ||
            LA9_0 == FUNCNAME ||
            (LA9_0 >= NUMBER && LA9_0 <= LETTER) ||
            (LA9_0 >= BROUTRULE && LA9_0 <= BRREPORT)
          ) {
            alt9 = 1
          }
          switch (alt9) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:17: ( boolExpr ) ( COMMA ( boolExpr ) )*
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:17: ( boolExpr )
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:18: boolExpr
              this.pushFollow(
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_boolExpr_in_functionExpr432
              )
              boolExpr44 = this.boolExpr()

              this.state._fsp--

              this.adaptor.addChild(root_0, boolExpr44.getTree())

              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:28: ( COMMA ( boolExpr ) )*
              loop8: do {
                var alt8 = 2
                var LA8_0 = this.input.LA(1)

                if (LA8_0 == COMMA) {
                  alt8 = 1
                }

                switch (alt8) {
                  case 1:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:30: COMMA ( boolExpr )
                    COMMA45 = this.match(
                      this.input,
                      COMMA,
                      com.toone.itop.formula.FormulaJSParser
                        .FOLLOW_COMMA_in_functionExpr437
                    )
                    COMMA45_tree = this.adaptor.create(COMMA45)
                    this.adaptor.addChild(root_0, COMMA45_tree)

                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:36: ( boolExpr )
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:83:37: boolExpr
                    this.pushFollow(
                      com.toone.itop.formula.FormulaJSParser
                        .FOLLOW_boolExpr_in_functionExpr440
                    )
                    boolExpr46 = this.boolExpr()

                    this.state._fsp--

                    this.adaptor.addChild(root_0, boolExpr46.getTree())

                    break

                  default:
                    break loop8
                }
              } while (true)

              break
          }

          RPAREN47 = this.match(
            this.input,
            RPAREN,
            com.toone.itop.formula.FormulaJSParser
              .FOLLOW_RPAREN_in_functionExpr448
          )
          RPAREN47_tree = this.adaptor.create(RPAREN47)
          this.adaptor.addChild(root_0, RPAREN47_tree)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      literal_return: (function () {
        com.toone.itop.formula.FormulaJSParser.literal_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.literal_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:95:1: literal : ( NUMBER | STRING | TRUE | FALSE | ( LETTER )+ );
      // $ANTLR start "literal"
      literal: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.literal_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var NUMBER48 = null
        var STRING49 = null
        var TRUE50 = null
        var FALSE51 = null
        var LETTER52 = null

        var NUMBER48_tree = null
        var STRING49_tree = null
        var TRUE50_tree = null
        var FALSE51_tree = null
        var LETTER52_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:96:2: ( NUMBER | STRING | TRUE | FALSE | ( LETTER )+ )
          var alt11 = 5
          switch (this.input.LA(1)) {
            case NUMBER:
              alt11 = 1
              break
            case STRING:
              alt11 = 2
              break
            case TRUE:
              alt11 = 3
              break
            case FALSE:
              alt11 = 4
              break
            case LETTER:
              alt11 = 5
              break
            default:
              var nvae = new org.antlr.runtime.NoViableAltException(
                '',
                11,
                0,
                this.input
              )

              throw nvae
          }

          switch (alt11) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:96:4: NUMBER
              root_0 = this.adaptor.nil()

              NUMBER48 = this.match(
                this.input,
                NUMBER,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_NUMBER_in_literal463
              )
              NUMBER48_tree = this.adaptor.create(NUMBER48)
              this.adaptor.addChild(root_0, NUMBER48_tree)

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:97:4: STRING
              root_0 = this.adaptor.nil()

              STRING49 = this.match(
                this.input,
                STRING,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_STRING_in_literal469
              )
              STRING49_tree = this.adaptor.create(STRING49)
              this.adaptor.addChild(root_0, STRING49_tree)

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:98:4: TRUE
              root_0 = this.adaptor.nil()

              TRUE50 = this.match(
                this.input,
                TRUE,
                com.toone.itop.formula.FormulaJSParser.FOLLOW_TRUE_in_literal475
              )
              TRUE50_tree = this.adaptor.create(TRUE50)
              this.adaptor.addChild(root_0, TRUE50_tree)

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:99:4: FALSE
              root_0 = this.adaptor.nil()

              FALSE51 = this.match(
                this.input,
                FALSE,
                com.toone.itop.formula.FormulaJSParser
                  .FOLLOW_FALSE_in_literal480
              )
              FALSE51_tree = this.adaptor.create(FALSE51)
              this.adaptor.addChild(root_0, FALSE51_tree)

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:100:4: ( LETTER )+
              root_0 = this.adaptor.nil()

              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:100:4: ( LETTER )+
              var cnt10 = 0
              loop10: do {
                var alt10 = 2
                var LA10_0 = this.input.LA(1)

                if (LA10_0 == LETTER) {
                  alt10 = 1
                }

                switch (alt10) {
                  case 1:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:100:5: LETTER
                    LETTER52 = this.match(
                      this.input,
                      LETTER,
                      com.toone.itop.formula.FormulaJSParser
                        .FOLLOW_LETTER_in_literal486
                    )
                    LETTER52_tree = this.adaptor.create(LETTER52)
                    this.adaptor.addChild(root_0, LETTER52_tree)

                    break

                  default:
                    if (cnt10 >= 1) {
                      break loop10
                    }
                    var eee = new org.antlr.runtime.EarlyExitException(
                      10,
                      this.input
                    )
                    throw eee
                }
                cnt10++
              } while (true)

              break
          }
          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      percent_return: (function () {
        com.toone.itop.formula.FormulaJSParser.percent_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.percent_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:102:1: percent : NUMBER PERCENT ;
      // $ANTLR start "percent"
      percent: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.percent_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var NUMBER53 = null
        var PERCENT54 = null

        var NUMBER53_tree = null
        var PERCENT54_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:103:2: ( NUMBER PERCENT )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:103:4: NUMBER PERCENT
          root_0 = this.adaptor.nil()

          NUMBER53 = this.match(
            this.input,
            NUMBER,
            com.toone.itop.formula.FormulaJSParser.FOLLOW_NUMBER_in_percent498
          )
          NUMBER53_tree = this.adaptor.create(NUMBER53)
          this.adaptor.addChild(root_0, NUMBER53_tree)

          PERCENT54 = this.match(
            this.input,
            PERCENT,
            com.toone.itop.formula.FormulaJSParser.FOLLOW_PERCENT_in_percent500
          )
          PERCENT54_tree = this.adaptor.create(PERCENT54)
          root_0 = this.adaptor.becomeRoot(PERCENT54_tree, root_0)

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      },

      // inline static return class
      brParam_return: (function () {
        com.toone.itop.formula.FormulaJSParser.brParam_return = function () {}
        org.antlr.lang.extend(
          com.toone.itop.formula.FormulaJSParser.brParam_return,
          org.antlr.runtime.ParserRuleReturnScope,
          {
            getTree: function () {
              return this.tree
            }
          }
        )
        return
      })(),

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:180:1: brParam : ( BROUTRULE | OUTPARENT | VARPARENT | INPARENT | VARPARENTVARIABLE | INPARENTVARIABLE | OUTPARENTVARIABLE | BRREPORT );
      // $ANTLR start "brParam"
      brParam: function () {
        var retval = new com.toone.itop.formula.FormulaJSParser.brParam_return()
        retval.start = this.input.LT(1)

        var root_0 = null

        var set55 = null

        var set55_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:180:9: ( BROUTRULE | OUTPARENT | VARPARENT | INPARENT | VARPARENTVARIABLE | INPARENTVARIABLE | OUTPARENTVARIABLE | BRREPORT )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:
          root_0 = this.adaptor.nil()

          set55 = this.input.LT(1)
          if (this.input.LA(1) >= BROUTRULE && this.input.LA(1) <= BRREPORT) {
            this.input.consume()
            this.adaptor.addChild(root_0, this.adaptor.create(set55))
            this.state.errorRecovery = false
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            throw mse
          }

          retval.stop = this.input.LT(-1)

          retval.tree = this.adaptor.rulePostProcessing(root_0)
          this.adaptor.setTokenBoundaries(
            retval.tree,
            retval.start,
            retval.stop
          )
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
            retval.tree = this.adaptor.errorNode(
              this.input,
              retval.start,
              this.input.LT(-1),
              re
            )
          } else {
            throw re
          }
        } finally {
        }
        return retval
      }

      // Delegated rules
    },
    true
  ) // important to pass true to overwrite default implementations

  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSParser, {
    DFA7_eotS: '\u0014\uffff',
    DFA7_eofS: '\u0001\uffff\u0001\u0002\u0012\uffff',
    DFA7_minS: '\u0001\u001a\u0001\u000b\u0012\uffff',
    DFA7_maxS: '\u0001\u003c\u0001\u0030\u0012\uffff',
    DFA7_acceptS:
      '\u0002\uffff\u0001\u0001\u0001\u0002\u0001\u0004\u0001\u0005\u0001' +
      '\u0006\u0001\u0007\u0001\u0008\u0001\u0009\u0001\u000a\u0001\u000b\u0001' +
      '\u000c\u0001\u000d\u0001\u000e\u0001\u000f\u0001\u0010\u0001\u0011\u0001' +
      '\u0012\u0001\u0003',
    DFA7_specialS: '\u0014\uffff}>',
    DFA7_transitionS: [
      '\u0001\u0004\u0001\u0005\u0001\u0006\u0001\u0007\u0001\u0008' +
        '\u0001\u0009\u0001\u000a\u0001\u000b\u0001\u000d\u0001\u000e' +
        '\u0001\u000f\u0001\u0010\u0001\u0011\u0001\u0012\u0001\uffff' +
        '\u0001\u0003\u0001\uffff\u0001\u0001\u0004\u0002\u0005\uffff' +
        '\u0008\u000c',
      '\u000e\u0002\u000f\uffff\u0001\u0002\u0001\uffff\u0001\u0002' +
        '\u0005\uffff\u0001\u0013',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ]
  })

  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSParser, {
    DFA7_eot: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSParser.DFA7_eotS
    ),
    DFA7_eof: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSParser.DFA7_eofS
    ),
    DFA7_min: org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(
      com.toone.itop.formula.FormulaJSParser.DFA7_minS
    ),
    DFA7_max: org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(
      com.toone.itop.formula.FormulaJSParser.DFA7_maxS
    ),
    DFA7_accept: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSParser.DFA7_acceptS
    ),
    DFA7_special: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSParser.DFA7_specialS
    ),
    DFA7_transition: (function () {
      var a = [],
        i,
        numStates =
          com.toone.itop.formula.FormulaJSParser.DFA7_transitionS.length
      for (i = 0; i < numStates; i++) {
        a.push(
          org.antlr.runtime.DFA.unpackEncodedString(
            com.toone.itop.formula.FormulaJSParser.DFA7_transitionS[i]
          )
        )
      }
      return a
    })()
  })

  com.toone.itop.formula.FormulaJSParser.DFA7 = function (recognizer) {
    this.recognizer = recognizer
    this.decisionNumber = 7
    this.eot = com.toone.itop.formula.FormulaJSParser.DFA7_eot
    this.eof = com.toone.itop.formula.FormulaJSParser.DFA7_eof
    this.min = com.toone.itop.formula.FormulaJSParser.DFA7_min
    this.max = com.toone.itop.formula.FormulaJSParser.DFA7_max
    this.accept = com.toone.itop.formula.FormulaJSParser.DFA7_accept
    this.special = com.toone.itop.formula.FormulaJSParser.DFA7_special
    this.transition = com.toone.itop.formula.FormulaJSParser.DFA7_transition
  }

  org.antlr.lang.extend(
    com.toone.itop.formula.FormulaJSParser.DFA7,
    org.antlr.runtime.DFA,
    {
      getDescription: function () {
        return '60:1: operand : ( literal | functionExpr | percent | CONTROLPROPERTY | COMPONENTVARIABLE | KEYBOARDS | SYSTEMVARIABLE | FIELDVARIABLE | LVVARIABLE | DB | USERVAR | brParam | QUERY | BUSSINESSRULE | EVENTACTIONPROPERTY | I18NVARIABLE | ARRAY | LPAREN expression RPAREN -> expression );'
      },
      dummy: null
    }
  )

  // public class variables
  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSParser, {
    tokenNames: [
      '<invalid>',
      '<EOR>',
      '<DOWN>',
      '<UP>',
      'POS',
      'NEG',
      'CALL',
      'CONTROL',
      'BUSSINESSRULERESULT',
      'EVENTACTION',
      'KEYBOARD',
      'AND',
      'OR',
      'LT',
      'LTEQ',
      'GT',
      'GTEQ',
      'EQ',
      'NOTEQ',
      'CONCAT',
      'SUB',
      'ADD',
      'DIV',
      'MULT',
      'EXP',
      'NOT',
      'CONTROLPROPERTY',
      'COMPONENTVARIABLE',
      'KEYBOARDS',
      'SYSTEMVARIABLE',
      'FIELDVARIABLE',
      'LVVARIABLE',
      'DB',
      'USERVAR',
      'QUERY',
      'BUSSINESSRULE',
      'EVENTACTIONPROPERTY',
      'I18NVARIABLE',
      'ARRAY',
      'LPAREN',
      'RPAREN',
      'FUNCNAME',
      'COMMA',
      'NUMBER',
      'STRING',
      'TRUE',
      'FALSE',
      'LETTER',
      'PERCENT',
      'DIGIT',
      'ESCAPE_SEQUENCE',
      'WHITESPACE',
      'POINT',
      'BROUTRULE',
      'OUTPARENT',
      'VARPARENT',
      'INPARENT',
      'VARPARENTVARIABLE',
      'INPARENTVARIABLE',
      'OUTPARENTVARIABLE',
      'BRREPORT',
      'STR'
    ],
    FOLLOW_expression_in_formula104: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_boolExpr_in_expression118: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_concatExpr_in_boolExpr128: new org.antlr.runtime.BitSet([
      0x0007f802, 0x00000000
    ]),
    FOLLOW_set_in_boolExpr131: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_concatExpr_in_boolExpr164: new org.antlr.runtime.BitSet([
      0x0007f802, 0x00000000
    ]),
    FOLLOW_sumExpr_in_concatExpr176: new org.antlr.runtime.BitSet([
      0x00080002, 0x00000000
    ]),
    FOLLOW_CONCAT_in_concatExpr179: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_sumExpr_in_concatExpr182: new org.antlr.runtime.BitSet([
      0x00080002, 0x00000000
    ]),
    FOLLOW_productExpr_in_sumExpr194: new org.antlr.runtime.BitSet([
      0x00300002, 0x00000000
    ]),
    FOLLOW_set_in_sumExpr197: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_productExpr_in_sumExpr206: new org.antlr.runtime.BitSet([
      0x00300002, 0x00000000
    ]),
    FOLLOW_expExpr_in_productExpr218: new org.antlr.runtime.BitSet([
      0x00c00002, 0x00000000
    ]),
    FOLLOW_set_in_productExpr221: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_expExpr_in_productExpr230: new org.antlr.runtime.BitSet([
      0x00c00002, 0x00000000
    ]),
    FOLLOW_unaryOperation_in_expExpr242: new org.antlr.runtime.BitSet([
      0x01000002, 0x00000000
    ]),
    FOLLOW_EXP_in_expExpr245: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_unaryOperation_in_expExpr248: new org.antlr.runtime.BitSet([
      0x01000002, 0x00000000
    ]),
    FOLLOW_NOT_in_unaryOperation260: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_operand_in_unaryOperation263: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_ADD_in_unaryOperation268: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_operand_in_unaryOperation272: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_SUB_in_unaryOperation286: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_operand_in_unaryOperation290: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_operand_in_unaryOperation304: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_literal_in_operand316: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_functionExpr_in_operand322: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_percent_in_operand328: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_CONTROLPROPERTY_in_operand333: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_COMPONENTVARIABLE_in_operand338: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_KEYBOARDS_in_operand343: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_SYSTEMVARIABLE_in_operand348: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FIELDVARIABLE_in_operand353: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_LVVARIABLE_in_operand358: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_DB_in_operand363: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_USERVAR_in_operand369: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_brParam_in_operand374: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_QUERY_in_operand379: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BUSSINESSRULE_in_operand384: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_EVENTACTIONPROPERTY_in_operand389: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_I18NVARIABLE_in_operand394: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_ARRAY_in_operand399: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_LPAREN_in_operand404: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_expression_in_operand406: new org.antlr.runtime.BitSet([
      0x00000000, 0x00000100
    ]),
    FOLLOW_RPAREN_in_operand408: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FUNCNAME_in_functionExpr425: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0fbff
    ]),
    FOLLOW_boolExpr_in_functionExpr432: new org.antlr.runtime.BitSet([
      0x00000000, 0x00000500
    ]),
    FOLLOW_COMMA_in_functionExpr437: new org.antlr.runtime.BitSet([
      0xfe300000, 0x1fe0faff
    ]),
    FOLLOW_boolExpr_in_functionExpr440: new org.antlr.runtime.BitSet([
      0x00000000, 0x00000500
    ]),
    FOLLOW_RPAREN_in_functionExpr448: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_NUMBER_in_literal463: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_STRING_in_literal469: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_TRUE_in_literal475: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FALSE_in_literal480: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_LETTER_in_literal486: new org.antlr.runtime.BitSet([
      0x00000002, 0x00008000
    ]),
    FOLLOW_NUMBER_in_percent498: new org.antlr.runtime.BitSet([
      0x00000000, 0x00010000
    ]),
    FOLLOW_PERCENT_in_percent500: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_set_in_brParam0: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ])
  })
})()
