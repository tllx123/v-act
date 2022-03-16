import './antlr3-all-min'

let com = { toone: { itop: { formula: {} } } }
//Formula.js

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

//FormulaJSExtend.js

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
        var item = items.shift()
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

//FormulaJSLexer.js

// $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g 2018-10-31 15:44:04

com.toone.itop.formula.FormulaJSLexer = function (input, state) {
  // alternate constructor @todo
  // public com.toone.itop.formula.FormulaJSLexer(CharStream input)
  // public com.toone.itop.formula.FormulaJSLexer(CharStream input, RecognizerSharedState state) {
  if (!state) {
    state = new org.antlr.runtime.RecognizerSharedState()
  }

  ;(function () {}.call(this))

  this.dfa36 = new com.toone.itop.formula.FormulaJSLexer.DFA36(this)
  com.toone.itop.formula.FormulaJSLexer.superclass.constructor.call(
    this,
    input,
    state
  )
}

org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSLexer, {
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
  var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF
  org.antlr.lang.extend(
    com.toone.itop.formula.FormulaJSLexer,
    org.antlr.runtime.Lexer,
    {
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
      STR: 61,
      getGrammarFileName: function () {
        return 'D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g'
      }
    }
  )
  org.antlr.lang.augmentObject(
    com.toone.itop.formula.FormulaJSLexer.prototype,
    {
      // $ANTLR start CONTROL
      mCONTROL: function () {
        try {
          var _type = this.CONTROL
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:9:9: ( 'CC.' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:9:11: 'CC.'
          this.match('CC.')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "CONTROL",

      // $ANTLR start BUSSINESSRULERESULT
      mBUSSINESSRULERESULT: function () {
        try {
          var _type = this.BUSSINESSRULERESULT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:10:21: ( 'BR.' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:10:23: 'BR.'
          this.match('BR.')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "BUSSINESSRULERESULT",

      // $ANTLR start EVENTACTION
      mEVENTACTION: function () {
        try {
          var _type = this.EVENTACTION
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:11:13: ( 'EA.' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:11:15: 'EA.'
          this.match('EA.')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "EVENTACTION",

      // $ANTLR start KEYBOARD
      mKEYBOARD: function () {
        try {
          var _type = this.KEYBOARD
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:12:10: ( 'Keys.' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:12:12: 'Keys.'
          this.match('Keys.')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "KEYBOARD",

      // $ANTLR start NUMBER
      mNUMBER: function () {
        try {
          var _type = this.NUMBER
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:2: ( ( DIGIT )+ ( '.' ( DIGIT )+ )? )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:5: ( DIGIT )+ ( '.' ( DIGIT )+ )?
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:5: ( DIGIT )+
          var cnt1 = 0
          loop1: do {
            var alt1 = 2
            var LA1_0 = this.input.LA(1)

            if (LA1_0 >= '0' && LA1_0 <= '9') {
              alt1 = 1
            }

            switch (alt1) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:6: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt1 >= 1) {
                  break loop1
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  1,
                  this.input
                )
                throw eee
            }
            cnt1++
          } while (true)

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:14: ( '.' ( DIGIT )+ )?
          var alt3 = 2
          var LA3_0 = this.input.LA(1)

          if (LA3_0 == '.') {
            alt3 = 1
          }
          switch (alt3) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:15: '.' ( DIGIT )+
              this.match('.')
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:19: ( DIGIT )+
              var cnt2 = 0
              loop2: do {
                var alt2 = 2
                var LA2_0 = this.input.LA(1)

                if (LA2_0 >= '0' && LA2_0 <= '9') {
                  alt2 = 1
                }

                switch (alt2) {
                  case 1:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:20: DIGIT
                    this.mDIGIT()

                    break

                  default:
                    if (cnt2 >= 1) {
                      break loop2
                    }
                    var eee = new org.antlr.runtime.EarlyExitException(
                      2,
                      this.input
                    )
                    throw eee
                }
                cnt2++
              } while (true)

              break
          }

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "NUMBER",

      // $ANTLR start STRING
      mSTRING: function () {
        try {
          var _type = this.STRING
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:114:2: ( '\\\"' ( options {greedy=false; } : ESCAPE_SEQUENCE | ~ '\\\\' )* '\\\"' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:115:2: '\\\"' ( options {greedy=false; } : ESCAPE_SEQUENCE | ~ '\\\\' )* '\\\"'
          this.match('"')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:116:3: ( options {greedy=false; } : ESCAPE_SEQUENCE | ~ '\\\\' )*
          loop4: do {
            var alt4 = 3
            var LA4_0 = this.input.LA(1)

            if (LA4_0 == '"') {
              alt4 = 3
            } else if (LA4_0 == '\\') {
              alt4 = 1
            } else if (
              (LA4_0 >= '\u0000' && LA4_0 <= '!') ||
              (LA4_0 >= '#' && LA4_0 <= '[') ||
              (LA4_0 >= ']' && LA4_0 <= '\uFFFF')
            ) {
              alt4 = 2
            }

            switch (alt4) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:117:5: ESCAPE_SEQUENCE
                this.mESCAPE_SEQUENCE()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:118:5: ~ '\\\\'
                if (
                  (this.input.LA(1) >= '\u0000' && this.input.LA(1) <= '[') ||
                  (this.input.LA(1) >= ']' && this.input.LA(1) <= '\uFFFF')
                ) {
                  this.input.consume()
                } else {
                  var mse = new org.antlr.runtime.MismatchedSetException(
                    null,
                    this.input
                  )
                  this.recover(mse)
                  throw mse
                }

                break

              default:
                break loop4
            }
          } while (true)

          this.match('"')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "STRING",

      // $ANTLR start WHITESPACE
      mWHITESPACE: function () {
        try {
          var _type = this.WHITESPACE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:124:2: ( ( ' ' | '\\n' | '\\t' | '\\r' | '\\v' | '\\f' | '\\u00A0' )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:124:4: ( ' ' | '\\n' | '\\t' | '\\r' | '\\v' | '\\f' | '\\u00A0' )+
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:124:4: ( ' ' | '\\n' | '\\t' | '\\r' | '\\v' | '\\f' | '\\u00A0' )+
          var cnt5 = 0
          loop5: do {
            var alt5 = 2
            var LA5_0 = this.input.LA(1)

            if (
              (LA5_0 >= '\t' && LA5_0 <= '\n') ||
              (LA5_0 >= '\f' && LA5_0 <= '\r') ||
              LA5_0 == ' ' ||
              LA5_0 == 'v' ||
              LA5_0 == '\u00A0'
            ) {
              alt5 = 1
            }

            switch (alt5) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:
                if (
                  (this.input.LA(1) >= '\t' && this.input.LA(1) <= '\n') ||
                  (this.input.LA(1) >= '\f' && this.input.LA(1) <= '\r') ||
                  this.input.LA(1) == ' ' ||
                  this.input.LA(1) == 'v' ||
                  this.input.LA(1) == '\u00A0'
                ) {
                  this.input.consume()
                } else {
                  var mse = new org.antlr.runtime.MismatchedSetException(
                    null,
                    this.input
                  )
                  this.recover(mse)
                  throw mse
                }

                break

              default:
                if (cnt5 >= 1) {
                  break loop5
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  5,
                  this.input
                )
                throw eee
            }
            cnt5++
          } while (true)

          _channel = HIDDEN

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "WHITESPACE",

      // $ANTLR start TRUE
      mTRUE: function () {
        try {
          var _type = this.TRUE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:127:2: ( ( 't' | 'T' ) ( 'r' | 'R' ) ( 'u' | 'U' ) ( 'e' | 'E' ) )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:127:4: ( 't' | 'T' ) ( 'r' | 'R' ) ( 'u' | 'U' ) ( 'e' | 'E' )
          if (this.input.LA(1) == 'T' || this.input.LA(1) == 't') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'R' || this.input.LA(1) == 'r') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'U' || this.input.LA(1) == 'u') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'E' || this.input.LA(1) == 'e') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "TRUE",

      // $ANTLR start FALSE
      mFALSE: function () {
        try {
          var _type = this.FALSE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:130:2: ( ( 'f' | 'F' ) ( 'a' | 'A' ) ( 'l' | 'L' ) ( 's' | 'S' ) ( 'e' | 'E' ) )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:130:4: ( 'f' | 'F' ) ( 'a' | 'A' ) ( 'l' | 'L' ) ( 's' | 'S' ) ( 'e' | 'E' )
          if (this.input.LA(1) == 'F' || this.input.LA(1) == 'f') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'A' || this.input.LA(1) == 'a') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'L' || this.input.LA(1) == 'l') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'S' || this.input.LA(1) == 's') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'E' || this.input.LA(1) == 'e') {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "FALSE",

      // $ANTLR start NOTEQ
      mNOTEQ: function () {
        try {
          var _type = this.NOTEQ
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:133:17: ( '<>' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:133:19: '<>'
          this.match('<>')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "NOTEQ",

      // $ANTLR start LTEQ
      mLTEQ: function () {
        try {
          var _type = this.LTEQ
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:134:17: ( '<=' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:134:19: '<='
          this.match('<=')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "LTEQ",

      // $ANTLR start GTEQ
      mGTEQ: function () {
        try {
          var _type = this.GTEQ
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:135:17: ( '>=' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:135:19: '>='
          this.match('>=')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "GTEQ",

      // $ANTLR start AND
      mAND: function () {
        try {
          var _type = this.AND
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:136:8: ( '&&' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:136:10: '&&'
          this.match('&&')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "AND",

      // $ANTLR start OR
      mOR: function () {
        try {
          var _type = this.OR
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:137:7: ( '||' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:137:9: '||'
          this.match('||')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "OR",

      // $ANTLR start NOT
      mNOT: function () {
        try {
          var _type = this.NOT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:138:8: ( '!' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:138:10: '!'
          this.match('!')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "NOT",

      // $ANTLR start EQ
      mEQ: function () {
        try {
          var _type = this.EQ
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:139:17: ( '==' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:139:19: '=='
          this.match('==')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "EQ",

      // $ANTLR start LT
      mLT: function () {
        try {
          var _type = this.LT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:140:17: ( '<' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:140:19: '<'
          this.match('<')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "LT",

      // $ANTLR start GT
      mGT: function () {
        try {
          var _type = this.GT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:141:17: ( '>' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:141:19: '>'
          this.match('>')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "GT",

      // $ANTLR start EXP
      mEXP: function () {
        try {
          var _type = this.EXP
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:143:17: ( '^' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:143:19: '^'
          this.match('^')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "EXP",

      // $ANTLR start MULT
      mMULT: function () {
        try {
          var _type = this.MULT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:144:17: ( '*' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:144:19: '*'
          this.match('*')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "MULT",

      // $ANTLR start DIV
      mDIV: function () {
        try {
          var _type = this.DIV
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:145:17: ( '/' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:145:19: '/'
          this.match('/')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "DIV",

      // $ANTLR start ADD
      mADD: function () {
        try {
          var _type = this.ADD
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:146:17: ( '+' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:146:19: '+'
          this.match('+')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "ADD",

      // $ANTLR start SUB
      mSUB: function () {
        try {
          var _type = this.SUB
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:147:17: ( '-' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:147:19: '-'
          this.match('-')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "SUB",

      // $ANTLR start CONCAT
      mCONCAT: function () {
        try {
          var _type = this.CONCAT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:149:17: ( '&' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:149:19: '&'
          this.match('&')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "CONCAT",

      // $ANTLR start LPAREN
      mLPAREN: function () {
        try {
          var _type = this.LPAREN
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:151:17: ( '(' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:151:19: '('
          this.match('(')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "LPAREN",

      // $ANTLR start RPAREN
      mRPAREN: function () {
        try {
          var _type = this.RPAREN
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:152:17: ( ')' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:152:19: ')'
          this.match(')')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "RPAREN",

      // $ANTLR start COMMA
      mCOMMA: function () {
        try {
          var _type = this.COMMA
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:153:17: ( ',' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:153:19: ','
          this.match(',')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "COMMA",

      // $ANTLR start PERCENT
      mPERCENT: function () {
        try {
          var _type = this.PERCENT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:154:17: ( '%' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:154:19: '%'
          this.match('%')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "PERCENT",

      // $ANTLR start POINT
      mPOINT: function () {
        try {
          var _type = this.POINT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:155:7: ( '.' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:155:9: '.'
          this.match('.')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "POINT",

      // $ANTLR start DB
      mDB: function () {
        try {
          var _type = this.DB
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:4: ( '[' ( LETTER | DIGIT )+ ']' ( POINT DB )? )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:6: '[' ( LETTER | DIGIT )+ ']' ( POINT DB )?
          this.match('[')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:10: ( LETTER | DIGIT )+
          var cnt6 = 0
          loop6: do {
            var alt6 = 3
            var LA6_0 = this.input.LA(1)

            if (
              LA6_0 == '$' ||
              (LA6_0 >= 'A' && LA6_0 <= 'Z') ||
              LA6_0 == '_' ||
              (LA6_0 >= 'a' && LA6_0 <= 'z')
            ) {
              alt6 = 1
            } else if (LA6_0 >= '0' && LA6_0 <= '9') {
              alt6 = 2
            }

            switch (alt6) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:11: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:18: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt6 >= 1) {
                  break loop6
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  6,
                  this.input
                )
                throw eee
            }
            cnt6++
          } while (true)

          this.match(']')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:30: ( POINT DB )?
          var alt7 = 2
          var LA7_0 = this.input.LA(1)

          if (LA7_0 == '.') {
            alt7 = 1
          }
          switch (alt7) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:32: POINT DB
              this.mPOINT()
              this.mDB()

              break
          }

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "DB",

      // $ANTLR start ARRAY
      mARRAY: function () {
        try {
          var _type = this.ARRAY
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:7: ( '[' ( ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )* )? ']' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:9: '[' ( ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )* )? ']'
          this.match('[')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:13: ( ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )* )?
          var alt11 = 2
          var LA11_0 = this.input.LA(1)

          if (
            LA11_0 == '"' ||
            (LA11_0 >= '0' && LA11_0 <= '9') ||
            LA11_0 == '_'
          ) {
            alt11 = 1
          }
          switch (alt11) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:14: ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )*
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:14: ( STRING | DIGIT | '_' )
              var alt8 = 3
              switch (this.input.LA(1)) {
                case '"':
                  alt8 = 1
                  break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                  alt8 = 2
                  break
                case '_':
                  alt8 = 3
                  break
                default:
                  var nvae = new org.antlr.runtime.NoViableAltException(
                    '',
                    8,
                    0,
                    this.input
                  )

                  throw nvae
              }

              switch (alt8) {
                case 1:
                  // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:15: STRING
                  this.mSTRING()

                  break
                case 2:
                  // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:22: DIGIT
                  this.mDIGIT()

                  break
                case 3:
                  // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:28: '_'
                  this.match('_')

                  break
              }

              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:33: ( COMMA ( STRING | DIGIT | '_' ) )*
              loop10: do {
                var alt10 = 2
                var LA10_0 = this.input.LA(1)

                if (LA10_0 == ',') {
                  alt10 = 1
                }

                switch (alt10) {
                  case 1:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:35: COMMA ( STRING | DIGIT | '_' )
                    this.mCOMMA()
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:41: ( STRING | DIGIT | '_' )
                    var alt9 = 3
                    switch (this.input.LA(1)) {
                      case '"':
                        alt9 = 1
                        break
                      case '0':
                      case '1':
                      case '2':
                      case '3':
                      case '4':
                      case '5':
                      case '6':
                      case '7':
                      case '8':
                      case '9':
                        alt9 = 2
                        break
                      case '_':
                        alt9 = 3
                        break
                      default:
                        var nvae = new org.antlr.runtime.NoViableAltException(
                          '',
                          9,
                          0,
                          this.input
                        )

                        throw nvae
                    }

                    switch (alt9) {
                      case 1:
                        // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:42: STRING
                        this.mSTRING()

                        break
                      case 2:
                        // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:49: DIGIT
                        this.mDIGIT()

                        break
                      case 3:
                        // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:55: '_'
                        this.match('_')

                        break
                    }

                    break

                  default:
                    break loop10
                }
              } while (true)

              break
          }

          this.match(']')

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "ARRAY",

      // $ANTLR start BUSSINESSRULE
      mBUSSINESSRULE: function () {
        try {
          var _type = this.BUSSINESSRULE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:14: ( BUSSINESSRULERESULT ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:16: BUSSINESSRULERESULT ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.mBUSSINESSRULERESULT()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:36: ( LETTER | DIGIT )+
          var cnt12 = 0
          loop12: do {
            var alt12 = 3
            var LA12_0 = this.input.LA(1)

            if (
              LA12_0 == '$' ||
              (LA12_0 >= 'A' && LA12_0 <= 'Z') ||
              LA12_0 == '_' ||
              (LA12_0 >= 'a' && LA12_0 <= 'z')
            ) {
              alt12 = 1
            } else if (LA12_0 >= '0' && LA12_0 <= '9') {
              alt12 = 2
            }

            switch (alt12) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:37: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:44: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt12 >= 1) {
                  break loop12
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  12,
                  this.input
                )
                throw eee
            }
            cnt12++
          } while (true)

          this.match('.')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:56: ( LETTER | DIGIT )+
          var cnt13 = 0
          loop13: do {
            var alt13 = 3
            var LA13_0 = this.input.LA(1)

            if (
              LA13_0 == '$' ||
              (LA13_0 >= 'A' && LA13_0 <= 'Z') ||
              LA13_0 == '_' ||
              (LA13_0 >= 'a' && LA13_0 <= 'z')
            ) {
              alt13 = 1
            } else if (LA13_0 >= '0' && LA13_0 <= '9') {
              alt13 = 2
            }

            switch (alt13) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:57: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:64: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt13 >= 1) {
                  break loop13
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  13,
                  this.input
                )
                throw eee
            }
            cnt13++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "BUSSINESSRULE",

      // $ANTLR start CONTROLPROPERTY
      mCONTROLPROPERTY: function () {
        try {
          var _type = this.CONTROLPROPERTY
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:16: ( CONTROL ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:18: CONTROL ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.mCONTROL()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:26: ( LETTER | DIGIT )+
          var cnt14 = 0
          loop14: do {
            var alt14 = 3
            var LA14_0 = this.input.LA(1)

            if (
              LA14_0 == '$' ||
              (LA14_0 >= 'A' && LA14_0 <= 'Z') ||
              LA14_0 == '_' ||
              (LA14_0 >= 'a' && LA14_0 <= 'z')
            ) {
              alt14 = 1
            } else if (LA14_0 >= '0' && LA14_0 <= '9') {
              alt14 = 2
            }

            switch (alt14) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:27: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:34: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt14 >= 1) {
                  break loop14
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  14,
                  this.input
                )
                throw eee
            }
            cnt14++
          } while (true)

          this.match('.')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:46: ( LETTER | DIGIT )+
          var cnt15 = 0
          loop15: do {
            var alt15 = 3
            var LA15_0 = this.input.LA(1)

            if (
              LA15_0 == '$' ||
              (LA15_0 >= 'A' && LA15_0 <= 'Z') ||
              LA15_0 == '_' ||
              (LA15_0 >= 'a' && LA15_0 <= 'z')
            ) {
              alt15 = 1
            } else if (LA15_0 >= '0' && LA15_0 <= '9') {
              alt15 = 2
            }

            switch (alt15) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:47: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:54: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt15 >= 1) {
                  break loop15
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  15,
                  this.input
                )
                throw eee
            }
            cnt15++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "CONTROLPROPERTY",

      // $ANTLR start EVENTACTIONPROPERTY
      mEVENTACTIONPROPERTY: function () {
        try {
          var _type = this.EVENTACTIONPROPERTY
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:2: ( EVENTACTION ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:4: EVENTACTION ( LETTER | DIGIT )+
          this.mEVENTACTION()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:16: ( LETTER | DIGIT )+
          var cnt16 = 0
          loop16: do {
            var alt16 = 3
            var LA16_0 = this.input.LA(1)

            if (
              LA16_0 == '$' ||
              (LA16_0 >= 'A' && LA16_0 <= 'Z') ||
              LA16_0 == '_' ||
              (LA16_0 >= 'a' && LA16_0 <= 'z')
            ) {
              alt16 = 1
            } else if (LA16_0 >= '0' && LA16_0 <= '9') {
              alt16 = 2
            }

            switch (alt16) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:17: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:24: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt16 >= 1) {
                  break loop16
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  16,
                  this.input
                )
                throw eee
            }
            cnt16++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "EVENTACTIONPROPERTY",

      // $ANTLR start KEYBOARDS
      mKEYBOARDS: function () {
        try {
          var _type = this.KEYBOARDS
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:2: ( KEYBOARD ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:4: KEYBOARD ( LETTER | DIGIT )+
          this.mKEYBOARD()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:13: ( LETTER | DIGIT )+
          var cnt17 = 0
          loop17: do {
            var alt17 = 3
            var LA17_0 = this.input.LA(1)

            if (
              LA17_0 == '$' ||
              (LA17_0 >= 'A' && LA17_0 <= 'Z') ||
              LA17_0 == '_' ||
              (LA17_0 >= 'a' && LA17_0 <= 'z')
            ) {
              alt17 = 1
            } else if (LA17_0 >= '0' && LA17_0 <= '9') {
              alt17 = 2
            }

            switch (alt17) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:14: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:21: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt17 >= 1) {
                  break loop17
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  17,
                  this.input
                )
                throw eee
            }
            cnt17++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "KEYBOARDS",

      // $ANTLR start QUERY
      mQUERY: function () {
        try {
          var _type = this.QUERY
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:6: ( '##' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:8: '##' ( LETTER | DIGIT )+
          this.match('##')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:12: ( LETTER | DIGIT )+
          var cnt18 = 0
          loop18: do {
            var alt18 = 3
            var LA18_0 = this.input.LA(1)

            if (
              LA18_0 == '$' ||
              (LA18_0 >= 'A' && LA18_0 <= 'Z') ||
              LA18_0 == '_' ||
              (LA18_0 >= 'a' && LA18_0 <= 'z')
            ) {
              alt18 = 1
            } else if (LA18_0 >= '0' && LA18_0 <= '9') {
              alt18 = 2
            }

            switch (alt18) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:13: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:20: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt18 >= 1) {
                  break loop18
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  18,
                  this.input
                )
                throw eee
            }
            cnt18++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "QUERY",

      // $ANTLR start USERVAR
      mUSERVAR: function () {
        try {
          var _type = this.USERVAR
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:8: ( '#' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:10: '#' ( LETTER | DIGIT )+
          this.match('#')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:13: ( LETTER | DIGIT )+
          var cnt19 = 0
          loop19: do {
            var alt19 = 3
            var LA19_0 = this.input.LA(1)

            if (
              LA19_0 == '$' ||
              (LA19_0 >= 'A' && LA19_0 <= 'Z') ||
              LA19_0 == '_' ||
              (LA19_0 >= 'a' && LA19_0 <= 'z')
            ) {
              alt19 = 1
            } else if (LA19_0 >= '0' && LA19_0 <= '9') {
              alt19 = 2
            }

            switch (alt19) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:14: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:21: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt19 >= 1) {
                  break loop19
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  19,
                  this.input
                )
                throw eee
            }
            cnt19++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "USERVAR",

      // $ANTLR start VARPARENTVARIABLE
      mVARPARENTVARIABLE: function () {
        try {
          var _type = this.VARPARENTVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:191:18: ( 'BR_VAR_PARENT.' DB )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:191:20: 'BR_VAR_PARENT.' DB
          this.match('BR_VAR_PARENT.')

          this.mDB()

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "VARPARENTVARIABLE",

      // $ANTLR start INPARENTVARIABLE
      mINPARENTVARIABLE: function () {
        try {
          var _type = this.INPARENTVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:193:17: ( 'BR_IN_PARENT.' DB )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:193:19: 'BR_IN_PARENT.' DB
          this.match('BR_IN_PARENT.')

          this.mDB()

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "INPARENTVARIABLE",

      // $ANTLR start BROUTRULE
      mBROUTRULE: function () {
        try {
          var _type = this.BROUTRULE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:10: ( 'BR_OUT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:12: 'BR_OUT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.match('BR_OUT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:21: ( LETTER | DIGIT )+
          var cnt20 = 0
          loop20: do {
            var alt20 = 3
            var LA20_0 = this.input.LA(1)

            if (
              LA20_0 == '$' ||
              (LA20_0 >= 'A' && LA20_0 <= 'Z') ||
              LA20_0 == '_' ||
              (LA20_0 >= 'a' && LA20_0 <= 'z')
            ) {
              alt20 = 1
            } else if (LA20_0 >= '0' && LA20_0 <= '9') {
              alt20 = 2
            }

            switch (alt20) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:22: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:29: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt20 >= 1) {
                  break loop20
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  20,
                  this.input
                )
                throw eee
            }
            cnt20++
          } while (true)

          this.match('.')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:40: ( LETTER | DIGIT )+
          var cnt21 = 0
          loop21: do {
            var alt21 = 3
            var LA21_0 = this.input.LA(1)

            if (
              LA21_0 == '$' ||
              (LA21_0 >= 'A' && LA21_0 <= 'Z') ||
              LA21_0 == '_' ||
              (LA21_0 >= 'a' && LA21_0 <= 'z')
            ) {
              alt21 = 1
            } else if (LA21_0 >= '0' && LA21_0 <= '9') {
              alt21 = 2
            }

            switch (alt21) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:41: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:48: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt21 >= 1) {
                  break loop21
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  21,
                  this.input
                )
                throw eee
            }
            cnt21++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "BROUTRULE",

      // $ANTLR start BRREPORT
      mBRREPORT: function () {
        try {
          var _type = this.BRREPORT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:9: ( 'BR_REPORT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:11: 'BR_REPORT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.match('BR_REPORT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:23: ( LETTER | DIGIT )+
          var cnt22 = 0
          loop22: do {
            var alt22 = 3
            var LA22_0 = this.input.LA(1)

            if (
              LA22_0 == '$' ||
              (LA22_0 >= 'A' && LA22_0 <= 'Z') ||
              LA22_0 == '_' ||
              (LA22_0 >= 'a' && LA22_0 <= 'z')
            ) {
              alt22 = 1
            } else if (LA22_0 >= '0' && LA22_0 <= '9') {
              alt22 = 2
            }

            switch (alt22) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:24: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:31: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt22 >= 1) {
                  break loop22
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  22,
                  this.input
                )
                throw eee
            }
            cnt22++
          } while (true)

          this.match('.')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:42: ( LETTER | DIGIT )+
          var cnt23 = 0
          loop23: do {
            var alt23 = 3
            var LA23_0 = this.input.LA(1)

            if (
              LA23_0 == '$' ||
              (LA23_0 >= 'A' && LA23_0 <= 'Z') ||
              LA23_0 == '_' ||
              (LA23_0 >= 'a' && LA23_0 <= 'z')
            ) {
              alt23 = 1
            } else if (LA23_0 >= '0' && LA23_0 <= '9') {
              alt23 = 2
            }

            switch (alt23) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:43: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:50: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt23 >= 1) {
                  break loop23
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  23,
                  this.input
                )
                throw eee
            }
            cnt23++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "BRREPORT",

      // $ANTLR start OUTPARENT
      mOUTPARENT: function () {
        try {
          var _type = this.OUTPARENT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:10: ( 'BR_OUT_PARENT.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:12: 'BR_OUT_PARENT.' ( LETTER | DIGIT )+
          this.match('BR_OUT_PARENT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:28: ( LETTER | DIGIT )+
          var cnt24 = 0
          loop24: do {
            var alt24 = 3
            var LA24_0 = this.input.LA(1)

            if (
              LA24_0 == '$' ||
              (LA24_0 >= 'A' && LA24_0 <= 'Z') ||
              LA24_0 == '_' ||
              (LA24_0 >= 'a' && LA24_0 <= 'z')
            ) {
              alt24 = 1
            } else if (LA24_0 >= '0' && LA24_0 <= '9') {
              alt24 = 2
            }

            switch (alt24) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:29: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:36: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt24 >= 1) {
                  break loop24
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  24,
                  this.input
                )
                throw eee
            }
            cnt24++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "OUTPARENT",

      // $ANTLR start OUTPARENTVARIABLE
      mOUTPARENTVARIABLE: function () {
        try {
          var _type = this.OUTPARENTVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:201:18: ( 'BR_OUT_PARENT.' DB )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:201:20: 'BR_OUT_PARENT.' DB
          this.match('BR_OUT_PARENT.')

          this.mDB()

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "OUTPARENTVARIABLE",

      // $ANTLR start VARPARENT
      mVARPARENT: function () {
        try {
          var _type = this.VARPARENT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:10: ( 'BR_VAR_PARENT.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:12: 'BR_VAR_PARENT.' ( LETTER | DIGIT )+
          this.match('BR_VAR_PARENT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:28: ( LETTER | DIGIT )+
          var cnt25 = 0
          loop25: do {
            var alt25 = 3
            var LA25_0 = this.input.LA(1)

            if (
              LA25_0 == '$' ||
              (LA25_0 >= 'A' && LA25_0 <= 'Z') ||
              LA25_0 == '_' ||
              (LA25_0 >= 'a' && LA25_0 <= 'z')
            ) {
              alt25 = 1
            } else if (LA25_0 >= '0' && LA25_0 <= '9') {
              alt25 = 2
            }

            switch (alt25) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:29: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:36: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt25 >= 1) {
                  break loop25
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  25,
                  this.input
                )
                throw eee
            }
            cnt25++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "VARPARENT",

      // $ANTLR start INPARENT
      mINPARENT: function () {
        try {
          var _type = this.INPARENT
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:9: ( 'BR_IN_PARENT.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:11: 'BR_IN_PARENT.' ( LETTER | DIGIT )+
          this.match('BR_IN_PARENT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:26: ( LETTER | DIGIT )+
          var cnt26 = 0
          loop26: do {
            var alt26 = 3
            var LA26_0 = this.input.LA(1)

            if (
              LA26_0 == '$' ||
              (LA26_0 >= 'A' && LA26_0 <= 'Z') ||
              LA26_0 == '_' ||
              (LA26_0 >= 'a' && LA26_0 <= 'z')
            ) {
              alt26 = 1
            } else if (LA26_0 >= '0' && LA26_0 <= '9') {
              alt26 = 2
            }

            switch (alt26) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:27: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:34: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt26 >= 1) {
                  break loop26
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  26,
                  this.input
                )
                throw eee
            }
            cnt26++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "INPARENT",

      // $ANTLR start LVVARIABLE
      mLVVARIABLE: function () {
        try {
          var _type = this.LVVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:11: ( 'LV' ( '.' ( LETTER | DIGIT )+ )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:13: 'LV' ( '.' ( LETTER | DIGIT )+ )+
          this.match('LV')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:17: ( '.' ( LETTER | DIGIT )+ )+
          var cnt28 = 0
          loop28: do {
            var alt28 = 2
            var LA28_0 = this.input.LA(1)

            if (LA28_0 == '.') {
              alt28 = 1
            }

            switch (alt28) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:18: '.' ( LETTER | DIGIT )+
                this.match('.')
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:21: ( LETTER | DIGIT )+
                var cnt27 = 0
                loop27: do {
                  var alt27 = 3
                  var LA27_0 = this.input.LA(1)

                  if (
                    LA27_0 == '$' ||
                    (LA27_0 >= 'A' && LA27_0 <= 'Z') ||
                    LA27_0 == '_' ||
                    (LA27_0 >= 'a' && LA27_0 <= 'z')
                  ) {
                    alt27 = 1
                  } else if (LA27_0 >= '0' && LA27_0 <= '9') {
                    alt27 = 2
                  }

                  switch (alt27) {
                    case 1:
                      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:22: LETTER
                      this.mLETTER()

                      break
                    case 2:
                      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:29: DIGIT
                      this.mDIGIT()

                      break

                    default:
                      if (cnt27 >= 1) {
                        break loop27
                      }
                      var eee = new org.antlr.runtime.EarlyExitException(
                        27,
                        this.input
                      )
                      throw eee
                  }
                  cnt27++
                } while (true)

                break

              default:
                if (cnt28 >= 1) {
                  break loop28
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  28,
                  this.input
                )
                throw eee
            }
            cnt28++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "LVVARIABLE",

      // $ANTLR start SYSTEMVARIABLE
      mSYSTEMVARIABLE: function () {
        try {
          var _type = this.SYSTEMVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:15: ( '@@' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:17: '@@' ( LETTER | DIGIT )+
          this.match('@@')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:21: ( LETTER | DIGIT )+
          var cnt29 = 0
          loop29: do {
            var alt29 = 3
            var LA29_0 = this.input.LA(1)

            if (
              LA29_0 == '$' ||
              (LA29_0 >= 'A' && LA29_0 <= 'Z') ||
              LA29_0 == '_' ||
              (LA29_0 >= 'a' && LA29_0 <= 'z')
            ) {
              alt29 = 1
            } else if (LA29_0 >= '0' && LA29_0 <= '9') {
              alt29 = 2
            }

            switch (alt29) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:22: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:29: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt29 >= 1) {
                  break loop29
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  29,
                  this.input
                )
                throw eee
            }
            cnt29++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "SYSTEMVARIABLE",

      // $ANTLR start FIELDVARIABLE
      mFIELDVARIABLE: function () {
        try {
          var _type = this.FIELDVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:210:14: ( '@' DB )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:210:16: '@' DB
          this.match('@')
          this.mDB()

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "FIELDVARIABLE",

      // $ANTLR start STR
      mSTR: function () {
        try {
          var _type = this.STR
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:5: ( ( LETTER | DIGIT )+ ( POINT ( LETTER | DIGIT )+ )? )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:8: ( LETTER | DIGIT )+ ( POINT ( LETTER | DIGIT )+ )?
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:8: ( LETTER | DIGIT )+
          var cnt30 = 0
          loop30: do {
            var alt30 = 3
            var LA30_0 = this.input.LA(1)

            if (
              LA30_0 == '$' ||
              (LA30_0 >= 'A' && LA30_0 <= 'Z') ||
              LA30_0 == '_' ||
              (LA30_0 >= 'a' && LA30_0 <= 'z')
            ) {
              alt30 = 1
            } else if (LA30_0 >= '0' && LA30_0 <= '9') {
              alt30 = 2
            }

            switch (alt30) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:9: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:16: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt30 >= 1) {
                  break loop30
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  30,
                  this.input
                )
                throw eee
            }
            cnt30++
          } while (true)

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:24: ( POINT ( LETTER | DIGIT )+ )?
          var alt32 = 2
          var LA32_0 = this.input.LA(1)

          if (LA32_0 == '.') {
            alt32 = 1
          }
          switch (alt32) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:26: POINT ( LETTER | DIGIT )+
              this.mPOINT()
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:32: ( LETTER | DIGIT )+
              var cnt31 = 0
              loop31: do {
                var alt31 = 3
                var LA31_0 = this.input.LA(1)

                if (
                  LA31_0 == '$' ||
                  (LA31_0 >= 'A' && LA31_0 <= 'Z') ||
                  LA31_0 == '_' ||
                  (LA31_0 >= 'a' && LA31_0 <= 'z')
                ) {
                  alt31 = 1
                } else if (LA31_0 >= '0' && LA31_0 <= '9') {
                  alt31 = 2
                }

                switch (alt31) {
                  case 1:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:33: LETTER
                    this.mLETTER()

                    break
                  case 2:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:40: DIGIT
                    this.mDIGIT()

                    break

                  default:
                    if (cnt31 >= 1) {
                      break loop31
                    }
                    var eee = new org.antlr.runtime.EarlyExitException(
                      31,
                      this.input
                    )
                    throw eee
                }
                cnt31++
              } while (true)

              break
          }

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "STR",

      // $ANTLR start I18NVARIABLE
      mI18NVARIABLE: function () {
        try {
          var _type = this.I18NVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:214:13: ( 'I18N.' STR )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:214:15: 'I18N.' STR
          this.match('I18N.')

          this.mSTR()

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "I18NVARIABLE",

      // $ANTLR start COMPONENTVARIABLE
      mCOMPONENTVARIABLE: function () {
        try {
          var _type = this.COMPONENTVARIABLE
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:18: ( '@' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:20: '@' ( LETTER | DIGIT )+
          this.match('@')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:23: ( LETTER | DIGIT )+
          var cnt33 = 0
          loop33: do {
            var alt33 = 3
            var LA33_0 = this.input.LA(1)

            if (
              LA33_0 == '$' ||
              (LA33_0 >= 'A' && LA33_0 <= 'Z') ||
              LA33_0 == '_' ||
              (LA33_0 >= 'a' && LA33_0 <= 'z')
            ) {
              alt33 = 1
            } else if (LA33_0 >= '0' && LA33_0 <= '9') {
              alt33 = 2
            }

            switch (alt33) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:24: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:31: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt33 >= 1) {
                  break loop33
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  33,
                  this.input
                )
                throw eee
            }
            cnt33++
          } while (true)

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "COMPONENTVARIABLE",

      // $ANTLR start FUNCNAME
      mFUNCNAME: function () {
        try {
          var _type = this.FUNCNAME
          var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:2: ( ( LETTER | DIGIT )+ LPAREN )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:4: ( LETTER | DIGIT )+ LPAREN
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:4: ( LETTER | DIGIT )+
          var cnt34 = 0
          loop34: do {
            var alt34 = 3
            var LA34_0 = this.input.LA(1)

            if (
              LA34_0 == '$' ||
              (LA34_0 >= 'A' && LA34_0 <= 'Z') ||
              LA34_0 == '_' ||
              (LA34_0 >= 'a' && LA34_0 <= 'z')
            ) {
              alt34 = 1
            } else if (LA34_0 >= '0' && LA34_0 <= '9') {
              alt34 = 2
            }

            switch (alt34) {
              case 1:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:5: LETTER
                this.mLETTER()

                break
              case 2:
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:12: DIGIT
                this.mDIGIT()

                break

              default:
                if (cnt34 >= 1) {
                  break loop34
                }
                var eee = new org.antlr.runtime.EarlyExitException(
                  34,
                  this.input
                )
                throw eee
            }
            cnt34++
          } while (true)

          this.mLPAREN()

          this.state.type = _type
          this.state.channel = _channel
        } finally {
        }
      },
      // $ANTLR end "FUNCNAME",

      // $ANTLR start LETTER
      mLETTER: function () {
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:229:2: ( '\\u0024' | '\\u0041' .. '\\u005a' | '\\u005f' | '\\u0061' .. '\\u007a' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:
          if (
            this.input.LA(1) == '$' ||
            (this.input.LA(1) >= 'A' && this.input.LA(1) <= 'Z') ||
            this.input.LA(1) == '_' ||
            (this.input.LA(1) >= 'a' && this.input.LA(1) <= 'z')
          ) {
            this.input.consume()
          } else {
            var mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }
        } finally {
        }
      },
      // $ANTLR end "LETTER",

      // $ANTLR start DIGIT
      mDIGIT: function () {
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:245:2: ( ( '0' .. '9' ) )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:245:4: ( '0' .. '9' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:245:4: ( '0' .. '9' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:245:5: '0' .. '9'
          this.matchRange('0', '9')
        } finally {
        }
      },
      // $ANTLR end "DIGIT",

      // $ANTLR start ESCAPE_SEQUENCE
      mESCAPE_SEQUENCE: function () {
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:250:2: ( '\\\\' 't' | '\\\\' 'n' | '\\\\' '\\\"' | '\\\\' '\\'' | '\\\\' '\\\\' )
          var alt35 = 5
          var LA35_0 = this.input.LA(1)

          if (LA35_0 == '\\') {
            switch (this.input.LA(2)) {
              case 't':
                alt35 = 1
                break
              case 'n':
                alt35 = 2
                break
              case '"':
                alt35 = 3
                break
              case "'":
                alt35 = 4
                break
              case '\\':
                alt35 = 5
                break
              default:
                var nvae = new org.antlr.runtime.NoViableAltException(
                  '',
                  35,
                  1,
                  this.input
                )

                throw nvae
            }
          } else {
            var nvae = new org.antlr.runtime.NoViableAltException(
              '',
              35,
              0,
              this.input
            )

            throw nvae
          }
          switch (alt35) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:250:4: '\\\\' 't'
              this.match('\\')
              this.match('t')

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:251:4: '\\\\' 'n'
              this.match('\\')
              this.match('n')

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:252:4: '\\\\' '\\\"'
              this.match('\\')
              this.match('"')

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:253:4: '\\\\' '\\''
              this.match('\\')
              this.match("'")

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:254:4: '\\\\' '\\\\'
              this.match('\\')
              this.match('\\')

              break
          }
        } finally {
        }
      },
      // $ANTLR end "ESCAPE_SEQUENCE",

      mTokens: function () {
        // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:8: ( CONTROL | BUSSINESSRULERESULT | EVENTACTION | KEYBOARD | NUMBER | STRING | WHITESPACE | TRUE | FALSE | NOTEQ | LTEQ | GTEQ | AND | OR | NOT | EQ | LT | GT | EXP | MULT | DIV | ADD | SUB | CONCAT | LPAREN | RPAREN | COMMA | PERCENT | POINT | DB | ARRAY | BUSSINESSRULE | CONTROLPROPERTY | EVENTACTIONPROPERTY | KEYBOARDS | QUERY | USERVAR | VARPARENTVARIABLE | INPARENTVARIABLE | BROUTRULE | BRREPORT | OUTPARENT | OUTPARENTVARIABLE | VARPARENT | INPARENT | LVVARIABLE | SYSTEMVARIABLE | FIELDVARIABLE | STR | I18NVARIABLE | COMPONENTVARIABLE | FUNCNAME )
        var alt36 = 52
        alt36 = this.dfa36.predict(this.input)
        switch (alt36) {
          case 1:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:10: CONTROL
            this.mCONTROL()

            break
          case 2:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:18: BUSSINESSRULERESULT
            this.mBUSSINESSRULERESULT()

            break
          case 3:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:38: EVENTACTION
            this.mEVENTACTION()

            break
          case 4:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:50: KEYBOARD
            this.mKEYBOARD()

            break
          case 5:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:59: NUMBER
            this.mNUMBER()

            break
          case 6:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:66: STRING
            this.mSTRING()

            break
          case 7:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:73: WHITESPACE
            this.mWHITESPACE()

            break
          case 8:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:84: TRUE
            this.mTRUE()

            break
          case 9:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:89: FALSE
            this.mFALSE()

            break
          case 10:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:95: NOTEQ
            this.mNOTEQ()

            break
          case 11:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:101: LTEQ
            this.mLTEQ()

            break
          case 12:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:106: GTEQ
            this.mGTEQ()

            break
          case 13:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:111: AND
            this.mAND()

            break
          case 14:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:115: OR
            this.mOR()

            break
          case 15:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:118: NOT
            this.mNOT()

            break
          case 16:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:122: EQ
            this.mEQ()

            break
          case 17:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:125: LT
            this.mLT()

            break
          case 18:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:128: GT
            this.mGT()

            break
          case 19:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:131: EXP
            this.mEXP()

            break
          case 20:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:135: MULT
            this.mMULT()

            break
          case 21:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:140: DIV
            this.mDIV()

            break
          case 22:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:144: ADD
            this.mADD()

            break
          case 23:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:148: SUB
            this.mSUB()

            break
          case 24:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:152: CONCAT
            this.mCONCAT()

            break
          case 25:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:159: LPAREN
            this.mLPAREN()

            break
          case 26:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:166: RPAREN
            this.mRPAREN()

            break
          case 27:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:173: COMMA
            this.mCOMMA()

            break
          case 28:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:179: PERCENT
            this.mPERCENT()

            break
          case 29:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:187: POINT
            this.mPOINT()

            break
          case 30:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:193: DB
            this.mDB()

            break
          case 31:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:196: ARRAY
            this.mARRAY()

            break
          case 32:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:202: BUSSINESSRULE
            this.mBUSSINESSRULE()

            break
          case 33:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:216: CONTROLPROPERTY
            this.mCONTROLPROPERTY()

            break
          case 34:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:232: EVENTACTIONPROPERTY
            this.mEVENTACTIONPROPERTY()

            break
          case 35:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:252: KEYBOARDS
            this.mKEYBOARDS()

            break
          case 36:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:262: QUERY
            this.mQUERY()

            break
          case 37:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:268: USERVAR
            this.mUSERVAR()

            break
          case 38:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:276: VARPARENTVARIABLE
            this.mVARPARENTVARIABLE()

            break
          case 39:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:294: INPARENTVARIABLE
            this.mINPARENTVARIABLE()

            break
          case 40:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:311: BROUTRULE
            this.mBROUTRULE()

            break
          case 41:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:321: BRREPORT
            this.mBRREPORT()

            break
          case 42:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:330: OUTPARENT
            this.mOUTPARENT()

            break
          case 43:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:340: OUTPARENTVARIABLE
            this.mOUTPARENTVARIABLE()

            break
          case 44:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:358: VARPARENT
            this.mVARPARENT()

            break
          case 45:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:368: INPARENT
            this.mINPARENT()

            break
          case 46:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:377: LVVARIABLE
            this.mLVVARIABLE()

            break
          case 47:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:388: SYSTEMVARIABLE
            this.mSYSTEMVARIABLE()

            break
          case 48:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:403: FIELDVARIABLE
            this.mFIELDVARIABLE()

            break
          case 49:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:417: STR
            this.mSTR()

            break
          case 50:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:421: I18NVARIABLE
            this.mI18NVARIABLE()

            break
          case 51:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:434: COMPONENTVARIABLE
            this.mCOMPONENTVARIABLE()

            break
          case 52:
            // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:1:452: FUNCNAME
            this.mFUNCNAME()

            break
        }
      }
    },
    true
  ) // important to pass true to overwrite default implementations

  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSLexer, {
    DFA36_eotS:
      '\u0001\uffff\u0004\u0022\u0001\u0028\u0001\uffff\u0001\u001e\u0002' +
      '\u0022\u0001\u002e\u0001\u0030\u0001\u0032\u000f\uffff\u0001\u0022\u0002' +
      '\uffff\u0003\u0022\u0001\uffff\u0001\u0022\u0001\uffff\u0003\u0022\u0002' +
      '\uffff\u0002\u0022\u000d\uffff\u0001\u0022\u0003\uffff\u0001\u0022\u0001' +
      '\u0049\u0001\u004c\u0001\u0022\u0001\u0053\u0001\u0022\u0001\u0028\u0002' +
      '\u0022\u0002\uffff\u0001\u0022\u0001\uffff\u0002\u0022\u0001\uffff\u0006' +
      '\u0022\u0001\uffff\u0002\u0062\u0001\u0022\u0001\u0064\u0001\u0022\u0002' +
      '\u0066\u0001\u0022\u0002\uffff\u0004\u0022\u0001\uffff\u0001\u006c\u0001' +
      '\uffff\u0001\u006f\u0002\uffff\u0004\u0022\u0001\uffff\u0002\u0077\u0001' +
      '\uffff\u0004\u0022\u0001\uffff\u0002\u0022\u0002\uffff\u0008\u0022\u0001' +
      '\uffff\u0005\u0022\u0001\uffff\u0008\u0022\u0001\uffff\u0001\u0022\u0001' +
      '\uffff\u0001\u0022\u0002\uffff\u0002\u009c\u0002\uffff\u0002\u00a0\u0001' +
      '\uffff\u0002\u00a1\u0003\uffff',
    DFA36_eofS: '\u00a2\uffff',
    DFA36_minS:
      '\u0001\u0009\u0005\u0024\u0001\uffff\u0003\u0024\u0002\u003d\u0001' +
      '\u0026\u000d\uffff\u0001\u0022\u0001\u0023\u0002\u0024\u0001\uffff\u0003' +
      '\u0024\u0001\uffff\u0001\u0024\u0001\uffff\u0003\u0024\u0001\uffff\u0003' +
      '\u0024\u0007\uffff\u0002\u0024\u0004\uffff\u0001\u0024\u0003\uffff\u0009' +
      '\u0024\u0001\uffff\u0002\u0024\u0001\uffff\u0002\u0024\u0001\uffff\u0006' +
      '\u0024\u0001\uffff\u0008\u0024\u0002\uffff\u0004\u0024\u0001\uffff\u0001' +
      '\u0024\u0001\uffff\u0001\u0024\u0001\uffff\u0005\u0024\u0001\uffff\u0002' +
      '\u0024\u0001\uffff\u0007\u0024\u0002\uffff\u0008\u0024\u0001\uffff\u000e' +
      '\u0024\u0001\uffff\u0004\u0024\u0001\uffff\u0003\u0024\u0001\uffff\u0002' +
      '\u0024\u0001\uffff\u0002\u0024\u0003\uffff',
    DFA36_maxS:
      '\u0001\u00a0\u0005\u007a\u0001\uffff\u0003\u007a\u0001\u003e\u0001' +
      '\u003d\u0001\u0026\u000d\uffff\u0004\u007a\u0001\uffff\u0003\u007a\u0001' +
      '\uffff\u0001\u007a\u0001\uffff\u0003\u007a\u0001\uffff\u0003\u007a\u0007' +
      '\uffff\u0002\u007a\u0004\uffff\u0001\u007a\u0003\uffff\u0009\u007a\u0001' +
      '\uffff\u0002\u007a\u0001\uffff\u0002\u007a\u0001\uffff\u0006\u007a\u0001' +
      '\uffff\u0008\u007a\u0002\uffff\u0004\u007a\u0001\uffff\u0001\u007a\u0001' +
      '\uffff\u0001\u007a\u0001\uffff\u0005\u007a\u0001\uffff\u0002\u007a\u0001' +
      '\uffff\u0007\u007a\u0002\uffff\u0008\u007a\u0001\uffff\u000e\u007a\u0001' +
      '\uffff\u0004\u007a\u0001\uffff\u0003\u007a\u0001\uffff\u0002\u007a\u0001' +
      '\uffff\u0002\u007a\u0003\uffff',
    DFA36_acceptS:
      '\u0006\uffff\u0001\u0006\u0006\uffff\u0001\u000e\u0001\u000f\u0001' +
      '\u0010\u0001\u0013\u0001\u0014\u0001\u0015\u0001\u0016\u0001\u0017\u0001' +
      '\u0019\u0001\u001a\u0001\u001b\u0001\u001c\u0001\u001d\u0004\uffff\u0001' +
      '\u0007\u0003\uffff\u0001\u0031\u0001\uffff\u0001\u0034\u0003\uffff\u0001' +
      '\u0005\u0003\uffff\u0001\u000a\u0001\u000b\u0001\u0011\u0001\u000c\u0001' +
      '\u0012\u0001\u000d\u0001\u0018\u0002\uffff\u0001\u001f\u0001\u001e\u0001' +
      '\u0024\u0001\u0025\u0001\uffff\u0001\u002f\u0001\u0030\u0001\u0033\u0009' +
      '\uffff\u0001\u001e\u0002\uffff\u0001\u0001\u0002\uffff\u0001\u0002\u0006' +
      '\uffff\u0001\u0003\u0008\uffff\u0001\u0021\u0001\u0020\u0004\uffff\u0001' +
      '\u0022\u0001\uffff\u0001\u0008\u0001\uffff\u0001\u002e\u0005\uffff\u0001' +
      '\u0004\u0002\uffff\u0001\u0009\u0007\uffff\u0001\u0023\u0001\u0032\u0008' +
      '\uffff\u0001\u0028\u000e\uffff\u0001\u0029\u0004\uffff\u0001\u0027\u0003' +
      '\uffff\u0001\u0026\u0002\uffff\u0001\u002d\u0002\uffff\u0001\u002b\u0001' +
      '\u002c\u0001\u002a',
    DFA36_specialS: '\u00a2\uffff}>',
    DFA36_transitionS: [
      '\u0002\u001e\u0001\uffff\u0002\u001e\u0012\uffff\u0001\u001e' +
        '\u0001\u000e\u0001\u0006\u0001\u001b\u0001\u0020\u0001\u0018' +
        '\u0001\u000c\u0001\uffff\u0001\u0015\u0001\u0016\u0001\u0011' +
        '\u0001\u0013\u0001\u0017\u0001\u0014\u0001\u0019\u0001\u0012' +
        '\u000a\u0005\u0002\uffff\u0001\u000a\u0001\u000f\u0001\u000b' +
        '\u0001\uffff\u0001\u001d\u0001\u0020\u0001\u0002\u0001\u0001' +
        '\u0001\u0020\u0001\u0003\u0001\u0009\u0002\u0020\u0001\u001f' +
        '\u0001\u0020\u0001\u0004\u0001\u001c\u0007\u0020\u0001\u0008' +
        '\u0006\u0020\u0001\u001a\u0002\uffff\u0001\u0010\u0001\u0020' +
        '\u0001\uffff\u0005\u0020\u0001\u0009\u000d\u0020\u0001\u0008' +
        '\u0001\u0020\u0001\u0007\u0004\u0020\u0001\uffff\u0001\u000d' +
        '\u0023\uffff\u0001\u001e',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0002\u0020\u0001\u0021\u0017\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u0025\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0001\u0026\u0019\u0020\u0004\uffff\u0001\u0020' +
        '\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0020\u0001\uffff' +
        '\u0004\u0020\u0001\u0027\u0015\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0029' +
        '\u0001\uffff\u000a\u0005\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0022' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u0015\u0020\u0001\u0007\u0004\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u002a\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u0011\u0020\u0001\u002a\u0008\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0001\u002b\u0019\u0020\u0004\uffff\u0001\u0020' +
        '\u0001\uffff\u0001\u002b\u0019\u0020',
      '\u0001\u002d\u0001\u002c',
      '\u0001\u002f',
      '\u0001\u0031',
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
      '\u0001\u0035\u0001\uffff\u0001\u0036\u000b\uffff\u000a\u0034' +
        '\u0007\uffff\u001a\u0036\u0002\uffff\u0001\u0035\u0001\uffff' +
        '\u0001\u0033\u0001\uffff\u001a\u0036',
      '\u0001\u0037\u0001\u0038\u000b\uffff\u000a\u0038\u0007\uffff' +
        '\u001a\u0038\u0004\uffff\u0001\u0038\u0001\uffff\u001a\u0038',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0015\u0020\u0001\u0039\u0004\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u003c\u000b\uffff\u000a\u003c\u0006\uffff\u0001\u003a' +
        '\u001a\u003c\u0001\u003b\u0003\uffff\u0001\u003c\u0001\uffff' +
        '\u001a\u003c',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u0001\u0023' +
        '\u0001\u003d\u0008\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0020\u0001\uffff' +
        '\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u003e' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0020\u0001\uffff' +
        '\u001a\u0020',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u003f' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0040\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0041' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0020\u0001\uffff' +
        '\u0018\u0020\u0001\u0042\u0001\u0020',
      '',
      '\u0001\u0022\u000b\uffff\u000a\u0043\u0007\uffff\u001a\u0022' +
        '\u0004\uffff\u0001\u0022\u0001\uffff\u001a\u0022',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0014\u0020\u0001\u0044\u0005\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u0014\u0020\u0001\u0044\u0005\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000b\u0020\u0001\u0045\u000e\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u000b\u0020\u0001\u0045\u000e\u0020',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '\u0001\u0036\u0007\uffff\u0001\u0035\u0003\uffff\u000a\u0036' +
        '\u0007\uffff\u001a\u0036\u0002\uffff\u0001\u0046\u0001\uffff' +
        '\u0001\u0036\u0001\uffff\u001a\u0036',
      '\u0001\u0036\u0007\uffff\u0001\u0035\u0003\uffff\u000a\u0036' +
        '\u0007\uffff\u001a\u0036\u0002\uffff\u0001\u0046\u0001\uffff' +
        '\u0001\u0036\u0001\uffff\u001a\u0036',
      '',
      '',
      '',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0047' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u0008\u0023' +
        '\u0001\u0048\u0001\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u004a\u000b\uffff\u000a\u004b\u0007\uffff\u001a\u004a' +
        '\u0004\uffff\u0001\u004a\u0001\uffff\u001a\u004a',
      '\u0001\u004d\u000b\uffff\u000a\u004e\u0007\uffff\u001a\u004d' +
        '\u0004\uffff\u0001\u004d\u0001\uffff\u001a\u004d',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0008\u0020\u0001\u0050\u0005\u0020\u0001\u0051' +
        '\u0002\u0020\u0001\u0052\u0003\u0020\u0001\u004f\u0004\u0020' +
        '\u0004\uffff\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0054\u000b\uffff\u000a\u0055\u0007\uffff\u001a\u0054' +
        '\u0004\uffff\u0001\u0054\u0001\uffff\u001a\u0054',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0020\u0001\uffff' +
        '\u0012\u0020\u0001\u0056\u0007\u0020',
      '\u0001\u0022\u000b\uffff\u000a\u0043\u0007\uffff\u001a\u0022' +
        '\u0004\uffff\u0001\u0022\u0001\uffff\u001a\u0022',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0004\u0020\u0001\u0057\u0015\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u0004\u0020\u0001\u0057\u0015\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0012\u0020\u0001\u0058\u0007\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u0012\u0020\u0001\u0058\u0007\u0020',
      '',
      '\u0001\u0059\u000b\uffff\u000a\u005a\u0007\uffff\u001a\u0059' +
        '\u0004\uffff\u0001\u0059\u0001\uffff\u001a\u0059',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000d\u0020\u0001\u005b\u000c\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u004a\u0009\uffff\u0001\u005c\u0001\uffff\u000a\u004b' +
        '\u0007\uffff\u001a\u004a\u0004\uffff\u0001\u004a\u0001\uffff' +
        '\u001a\u004a',
      '\u0001\u004a\u0009\uffff\u0001\u005c\u0001\uffff\u000a\u004b' +
        '\u0007\uffff\u001a\u004a\u0004\uffff\u0001\u004a\u0001\uffff' +
        '\u001a\u004a',
      '',
      '\u0001\u004d\u0009\uffff\u0001\u005d\u0001\uffff\u000a\u004e' +
        '\u0007\uffff\u001a\u004d\u0004\uffff\u0001\u004d\u0001\uffff' +
        '\u001a\u004d',
      '\u0001\u004d\u0009\uffff\u0001\u005d\u0001\uffff\u000a\u004e' +
        '\u0007\uffff\u001a\u004d\u0004\uffff\u0001\u004d\u0001\uffff' +
        '\u001a\u004d',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0001\u005e\u0019\u0020\u0004\uffff\u0001\u0020' +
        '\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000d\u0020\u0001\u005f\u000c\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0014\u0020\u0001\u0060\u0005\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0004\u0020\u0001\u0061\u0015\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u0054\u000b\uffff\u000a\u0055\u0007\uffff\u001a\u0054' +
        '\u0004\uffff\u0001\u0054\u0001\uffff\u001a\u0054',
      '\u0001\u0054\u000b\uffff\u000a\u0055\u0007\uffff\u001a\u0054' +
        '\u0004\uffff\u0001\u0054\u0001\uffff\u001a\u0054',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0063' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0022' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0004\u0020\u0001\u0065\u0015\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u0004\u0020\u0001\u0065\u0015\u0020',
      '\u0001\u0059\u000b\uffff\u000a\u005a\u0007\uffff\u001a\u0059' +
        '\u0004\uffff\u0001\u0059\u0001\uffff\u001a\u0059',
      '\u0001\u0059\u000b\uffff\u000a\u005a\u0007\uffff\u001a\u0059' +
        '\u0004\uffff\u0001\u0059\u0001\uffff\u001a\u0059',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0067' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u0068\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0069\u0001\uffff' +
        '\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0013\u0020\u0001\u006a\u0006\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000f\u0020\u0001\u006b\u000a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u006d\u000b\uffff\u000a\u006e\u0007\uffff\u001a\u006d' +
        '\u0004\uffff\u0001\u006d\u0001\uffff\u001a\u006d',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0022' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u0070\u000b\uffff\u000a\u0071\u0007\uffff\u001a\u0070' +
        '\u0004\uffff\u0001\u0070\u0001\uffff\u001a\u0070',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u001a\u0020\u0004\uffff\u0001\u0072\u0001\uffff' +
        '\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000f\u0020\u0001\u0073\u000a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0074' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0075\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000e\u0020\u0001\u0076\u000b\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u006d\u000b\uffff\u000a\u006e\u0007\uffff\u001a\u006d' +
        '\u0004\uffff\u0001\u006d\u0001\uffff\u001a\u006d',
      '\u0001\u006d\u000b\uffff\u000a\u006e\u0007\uffff\u001a\u006d' +
        '\u0004\uffff\u0001\u006d\u0001\uffff\u001a\u006d',
      '',
      '\u0001\u0070\u0009\uffff\u0001\u0078\u0001\uffff\u000a\u0071' +
        '\u0007\uffff\u001a\u0070\u0004\uffff\u0001\u0070\u0001\uffff' +
        '\u001a\u0070',
      '\u0001\u0070\u0009\uffff\u0001\u0078\u0001\uffff\u000a\u0071' +
        '\u0007\uffff\u001a\u0070\u0004\uffff\u0001\u0070\u0001\uffff' +
        '\u001a\u0070',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000f\u0020\u0001\u0079\u000a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0001\u007a\u0019\u0020\u0004\uffff\u0001\u0020' +
        '\u0001\uffff\u001a\u0020',
      '\u0001\u007b\u000b\uffff\u000a\u007c\u0007\uffff\u001a\u007b' +
        '\u0004\uffff\u0001\u007b\u0001\uffff\u001a\u007b',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000f\u0020\u0001\u007d\u000a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u007e\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0001\u007f\u0019\u0020\u0004\uffff\u0001\u0020' +
        '\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u0080\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u007b\u0009\uffff\u0001\u0081\u0001\uffff\u000a\u007c' +
        '\u0007\uffff\u001a\u007b\u0004\uffff\u0001\u007b\u0001\uffff' +
        '\u001a\u007b',
      '\u0001\u007b\u0009\uffff\u0001\u0081\u0001\uffff\u000a\u007c' +
        '\u0007\uffff\u001a\u007b\u0004\uffff\u0001\u007b\u0001\uffff' +
        '\u001a\u007b',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0001\u0082\u0019\u0020\u0004\uffff\u0001\u0020' +
        '\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0013\u0020\u0001\u0083\u0006\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u0084\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0004\u0020\u0001\u0085\u0015\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0011\u0020\u0001\u0086\u0008\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0087' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0004\u0020\u0001\u0088\u0015\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000d\u0020\u0001\u0089\u000c\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0004\u0020\u0001\u008a\u0015\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u008b\u000b\uffff\u000a\u008c\u0007\uffff\u001a\u008b' +
        '\u0004\uffff\u0001\u008b\u0001\uffff\u001a\u008b',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000d\u0020\u0001\u008d\u000c\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0013\u0020\u0001\u008e\u0006\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u000d\u0020\u0001\u008f\u000c\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u008b\u0009\uffff\u0001\u0090\u0001\uffff\u000a\u008c' +
        '\u0007\uffff\u001a\u008b\u0004\uffff\u0001\u008b\u0001\uffff' +
        '\u001a\u008b',
      '\u0001\u008b\u0009\uffff\u0001\u0090\u0001\uffff\u000a\u008c' +
        '\u0007\uffff\u001a\u008b\u0004\uffff\u0001\u008b\u0001\uffff' +
        '\u001a\u008b',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0013\u0020\u0001\u0091\u0006\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0092' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0007\uffff\u000a\u0023' +
        '\u0007\uffff\u0013\u0020\u0001\u0093\u0006\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0094' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u0096\u000b\uffff\u000a\u0097\u0007\uffff\u001a\u0096' +
        '\u0001\u0095\u0003\uffff\u0001\u0096\u0001\uffff\u001a\u0096',
      '\u0001\u0020\u0003\uffff\u0001\u0024\u0005\uffff\u0001\u0098' +
        '\u0001\uffff\u000a\u0023\u0007\uffff\u001a\u0020\u0004\uffff' +
        '\u0001\u0020\u0001\uffff\u001a\u0020',
      '\u0001\u009a\u000b\uffff\u000a\u009b\u0007\uffff\u001a\u009a' +
        '\u0001\u0099\u0003\uffff\u0001\u009a\u0001\uffff\u001a\u009a',
      '',
      '\u0001\u0096\u000b\uffff\u000a\u0097\u0007\uffff\u001a\u0096' +
        '\u0004\uffff\u0001\u0096\u0001\uffff\u001a\u0096',
      '\u0001\u0096\u000b\uffff\u000a\u0097\u0007\uffff\u001a\u0096' +
        '\u0004\uffff\u0001\u0096\u0001\uffff\u001a\u0096',
      '\u0001\u009d\u000b\uffff\u000a\u009e\u0007\uffff\u001a\u009d' +
        '\u0001\u009f\u0003\uffff\u0001\u009d\u0001\uffff\u001a\u009d',
      '',
      '\u0001\u009a\u000b\uffff\u000a\u009b\u0007\uffff\u001a\u009a' +
        '\u0004\uffff\u0001\u009a\u0001\uffff\u001a\u009a',
      '\u0001\u009a\u000b\uffff\u000a\u009b\u0007\uffff\u001a\u009a' +
        '\u0004\uffff\u0001\u009a\u0001\uffff\u001a\u009a',
      '',
      '\u0001\u009d\u000b\uffff\u000a\u009e\u0007\uffff\u001a\u009d' +
        '\u0004\uffff\u0001\u009d\u0001\uffff\u001a\u009d',
      '\u0001\u009d\u000b\uffff\u000a\u009e\u0007\uffff\u001a\u009d' +
        '\u0004\uffff\u0001\u009d\u0001\uffff\u001a\u009d',
      '',
      '',
      ''
    ]
  })

  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaJSLexer, {
    DFA36_eot: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSLexer.DFA36_eotS
    ),
    DFA36_eof: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSLexer.DFA36_eofS
    ),
    DFA36_min: org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(
      com.toone.itop.formula.FormulaJSLexer.DFA36_minS
    ),
    DFA36_max: org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(
      com.toone.itop.formula.FormulaJSLexer.DFA36_maxS
    ),
    DFA36_accept: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSLexer.DFA36_acceptS
    ),
    DFA36_special: org.antlr.runtime.DFA.unpackEncodedString(
      com.toone.itop.formula.FormulaJSLexer.DFA36_specialS
    ),
    DFA36_transition: (function () {
      var a = [],
        i,
        numStates =
          com.toone.itop.formula.FormulaJSLexer.DFA36_transitionS.length
      for (i = 0; i < numStates; i++) {
        a.push(
          org.antlr.runtime.DFA.unpackEncodedString(
            com.toone.itop.formula.FormulaJSLexer.DFA36_transitionS[i]
          )
        )
      }
      return a
    })()
  })

  com.toone.itop.formula.FormulaJSLexer.DFA36 = function (recognizer) {
    this.recognizer = recognizer
    this.decisionNumber = 36
    this.eot = com.toone.itop.formula.FormulaJSLexer.DFA36_eot
    this.eof = com.toone.itop.formula.FormulaJSLexer.DFA36_eof
    this.min = com.toone.itop.formula.FormulaJSLexer.DFA36_min
    this.max = com.toone.itop.formula.FormulaJSLexer.DFA36_max
    this.accept = com.toone.itop.formula.FormulaJSLexer.DFA36_accept
    this.special = com.toone.itop.formula.FormulaJSLexer.DFA36_special
    this.transition = com.toone.itop.formula.FormulaJSLexer.DFA36_transition
  }

  org.antlr.lang.extend(
    com.toone.itop.formula.FormulaJSLexer.DFA36,
    org.antlr.runtime.DFA,
    {
      getDescription: function () {
        return '1:1: Tokens : ( CONTROL | BUSSINESSRULERESULT | EVENTACTION | KEYBOARD | NUMBER | STRING | WHITESPACE | TRUE | FALSE | NOTEQ | LTEQ | GTEQ | AND | OR | NOT | EQ | LT | GT | EXP | MULT | DIV | ADD | SUB | CONCAT | LPAREN | RPAREN | COMMA | PERCENT | POINT | DB | ARRAY | BUSSINESSRULE | CONTROLPROPERTY | EVENTACTIONPROPERTY | KEYBOARDS | QUERY | USERVAR | VARPARENTVARIABLE | INPARENTVARIABLE | BROUTRULE | BRREPORT | OUTPARENT | OUTPARENTVARIABLE | VARPARENT | INPARENT | LVVARIABLE | SYSTEMVARIABLE | FIELDVARIABLE | STR | I18NVARIABLE | COMPONENTVARIABLE | FUNCNAME );'
      },
      dummy: null
    }
  )
})()

//FormulaJSParser.js

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

//FormulaTreeExtra.js
com.toone.itop.formula.FormulaTreeExtra = {
  VARIABLE_VALUE_KEY: '_VERIABLE_VALUE_KEY_',
  saveVariableValue: function (content, key, value) {
    var vv = content.get(
      com.toone.itop.formula.FormulaTreeExtra.VARIABLE_VALUE_KEY
    )
    if (!vv) {
      vv = {}
      content.put(
        com.toone.itop.formula.FormulaTreeExtra.VARIABLE_VALUE_KEY,
        vv
      )
    }
    vv[key] = value
  }, // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题

  evaluateSystemVariable: function (context, v) {
    var name = v.getText().substring(2, v.getText().length)
    // 目前传入变量为@@xxx
    var ctx = context.get('expressionContext')
    var componentParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.ComponentParam'
    )
    var scopeManager = ctx.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    var scope = scopeManager.getScope()
    var componentCode = scope.getComponentCode()
    var cvar
    try {
      cvar = componentParam.getVariant({
        componentCode: componentCode,
        code: name
      })
    } catch (e) {
      cvar = componentParam.getOption({
        componentCode: componentCode,
        code: name
      })
    }

    if (typeof cvar == 'undefined') {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '[' + name + ']' + '没有对应的系统变量',
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      cvar
    )
    return cvar
  },
  evaluateNumber: function (context, v) {
    return Number(v)
  },

  evaluateAdd: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.add(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' add type is wrong')
      //$value = com.toone.itop.formula.FormulaTreeExtra.evaluateVariable(this._getContext(),v1)+com.toone.itop.formula.FormulaTreeExtra.evaluateVariable(this._getContext(),v2)
    }
  },

  evaluateSub: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.subtract(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' sub type is wrong')
    }
  },

  evaluateMult: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.multiply(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' Mult type is wrong')
    }
  },

  evaluateDiv: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      var ctx = context.get('expressionContext')
      var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      var val = mathUtil.divide(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' Div type is wrong')
    }
  },

  evaluatePercent: function (context, v) {
    var ctx = context.get('expressionContext')
    var mathUtil = ctx.getService('vjs.framework.extension.util.Math')
    var val = mathUtil.divide(v, 100)
    return Number(val)
  },

  evaluateComponentVariable: function (context, v) {
    var name = v.getText().substring(1, v.getText().length)
    // 目前传入变量为@xxx
    var ctx = context.get('expressionContext')
    var windowParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    var cvar = windowParam.getInput({ code: name })
    //var viewContext = context.get("viewContext");
    //var cvar = viewContext.getVariableValue(name);

    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      cvar
    )
    return cvar
  },

  evaluateWindowFieldVariable: function (context, v) {
    var text = v.getText()
    var param = text.split('.')
    var tablename = param[0].substring(2, param[0].length - 1)
    var fieldname = param[1].substring(1, param[1].length - 1)
    var ctx = context.get('expressionContext')

    var windowParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    var datasource = windowParam.getInput({
      code: tablename
    })

    if (null == datasource) {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '窗体输入变量【' + tablename + '】不存在，请检查配置.',
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }

    var row
    if (ctx.hasCurrentRecord(tablename)) row = ctx.getCurrentRecord(tablename)
    else if (ctx.hasRecordIndex(tablename))
      row = datasource.getRecordById(ctx.getRecordIndex(tablename))
    else row = datasource.getCurrentRecord()

    // 如果上面都取不到记录，则取数据源的第一行记录
    row = row ? row : datasource.getRecordByIndex(0)

    if (row) {
      var cvar = row ? row.get(fieldname) : null
      // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
      com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
        context,
        v.getText(),
        cvar
      )
      return cvar
    }
    return null
  },

  evaluateUserVar: function (context, v) {
    var name = v.getText().substring(1, v.getText().length)
    // 传入变量为#xxx ,暂时没有业务规则 此规则非彼规则

    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      1
    )

    return 1
  },

  evaluateArray: function (context, v) {
    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      v.getText()
    )

    return v.getText()
  },

  evaluateQuery: function (context, v) {
    return v.getText()
  },

  evaluateBrOutRule: function (context, v) {
    var text = v.getText()
    var param = text.split('.')
    var code = param[1]
    var key = param[2]
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      return routeContext.getBusinessRuleResult(code, key)
    } else {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '获取规则业务返回值失败！路由上下文不存在，规则编号：' + code,
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
  },
  //获取活动集输入参数值
  evaluateBrIn: function (context, v) {
    var text = v.getText()
    var param = text.split('.')
    var paramName = param[1]
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      return routeContext.getInputParam(paramName)
    } else {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '获取活动集输入参数失败！路由上下文不存在，参数名称：' + paramName,
        factory.TYPES.Config
      )
    }
  },
  //获取活动集输入实体参数的字段值
  //格式：BR_IN_PARENT.[入參英文名字].[字段名称]
  evaluateBrInFieldVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    var text = v.getText()
    var param = text.split('.')
    var tablename = param[1].substring(1, param[1].length - 1)
    var fieldname = param[2].substring(1, param[2].length - 1)
    if (routeContext) {
      var datasource = routeContext.getInputParam(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      } else {
        var factory = ctx.getService(
          'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
        )
        throw new Error(
          '获取活动集输入实体参数的字段值失败！活动集输入参数实体不存在，数据源名称：' +
            tablename +
            ',字段名称:' +
            fieldname,
          undefined,
          undefined,
          factory.TYPES.Config
        )
      }
    } else {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '获取活动集输入实体参数的字段值失败！路由上下文不存在，数据源名称：' +
          tablename +
          ',字段名称:' +
          fieldname,
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
  },
  //获取活动集输出参数值
  evaluateBrOut: function (context, v) {
    var expContext = context.get('expressionContext')
    var routeContext = expContext.getRouteContext()
    var text = v.getText()
    var param = text.split('.')
    var paramName = param[1]
    if (routeContext) {
      return routeContext.getOutPutParam(paramName)
    } else {
      var factory = expContext.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '获取活动集输出参数失败！路由上下文不存在，参数名称：' + paramName,
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
  },
  //获取活动集输出实体参数的字段值
  //格式：BR_OUT_PARENT.[变量英文名称].[字段名称]
  evaluateBrOutFieldVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var tablename = param[1].substring(1, param[1].length - 1)
      var fieldname = param[2].substring(1, param[2].length - 1)
      var datasource = routeContext.getOutPutParam(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  //获取活动集输出实体参数的字段值
  //格式：BR_OUT_PARENT.[变量英文名称].[字段名称]
  evaluateOutParentVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var tablename = param[1].substring(1, param[1].length - 1)
      var fieldname = param[2].substring(1, param[2].length - 1)
      var datasource = routeContext.getOutPutParam(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  //获取活动集的上下文变量
  evaluateBrVar: function (context, v) {
    var expContext = context.get('expressionContext')
    var routeContext = expContext.getRouteContext()
    var text = v.getText()
    var param = text.split('.')
    var paramName = param[1]
    if (routeContext) {
      return routeContext.getVariable(paramName)
    } else {
      var factory = expContext.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '获取活动集上下文变量失败！路由上下文不存在，参数名称：' + paramName,
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
  },

  //获取活动集上下文实体变量的字段值
  //格式：BR_VAR_PARENT.[变量英文名称].[字段名称]
  evaluateBrVarFieldVariable: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var tablename = param[1].substring(1, param[1].length - 1)
      var fieldname = param[2].substring(1, param[2].length - 1)
      var datasource = routeContext.getVariable(tablename)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },

  //处理报表实体变量  格式 BR_REPORT.a.a1
  evaluateBrReport: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var text = v.getText()
      var param = text.split('.')
      var reportEntityName = param[1]
      var field = param[2]
      var reportEntity = ctx.get('Report@@Entity')
      if (reportEntity != null) {
        var fieldName = reportEntityName + '.' + field
        return reportEntity[fieldName]
      }
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrReport]获取规则业务返回值失败！路由上下文不存在，规则编号：' +
          code
      )
    }
    return null
  },

  evaluateTableChain: function (context, v) {
    var ctx = context.get('expressionContext')
    //var viewModel = context.get("viewModel");
    var name = v.getText()
    // 传入变量为[tablename].[tablename](....省略无数个table....).[字段名]
    // 取当前页面中选定状态的行数据
    // 目前只支持一种[表名].[字段名]
    // 如果出现多个表的数据源，那一定会疯掉，yes
    var t = name.split('.')
    var tablename = t[0].substring(1, t[0].length - 1)
    var fieldname = t[1].substring(1, t[1].length - 1)
    var datasourceManager = ctx.getService(
      'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
    )
    var datasource = datasourceManager.lookup({ datasourceName: tablename })
    if (null == datasource) {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '实体【' + tablename + '】不存在, 请检查配置.',
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }

    var row
    if (ctx.hasCurrentRecord(tablename)) row = ctx.getCurrentRecord(tablename)
    else if (ctx.hasRecordIndex(tablename))
      row = datasource.getRecordById(ctx.getRecordIndex(tablename))
    else row = datasource.getCurrentRecord()

    // 如果上面都取不到记录，则取数据源的第一行记录
    row = row ? row : datasource.getRecordByIndex(0)

    if (row) {
      var fieldValue = ''
      fieldValue = row.get(fieldname)
      // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
      com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
        context,
        v.getText(),
        fieldValue
      )
      return fieldValue
    }
    return null
  },

  evaluateControlProperty: function (context, v) {
    // CC.控件Code.控件属性
    var name = v.getText().substring(3, v.getText().length)
    var strArr = name.split('.')
    var ctx = context.get('expressionContext')
    if (strArr.length == 2) {
      var propertyName = strArr[1]
      var widgetId = strArr[0]
      var widgetProperty = ctx.getService(
        'vjs.framework.extension.platform.services.view.widget.common.action.WidgetProperty'
      )
      var propertyValue = widgetProperty.get(widgetId, propertyName)
      return propertyValue
    } else {
      var factory = ctx.getService(
        'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
      )
      throw new Error(
        '表达式【' + v.getText() + '】设置的控件属性信息不正确！',
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
  },

  evaluateKeyBoards: function (context, v) {
    var expContext = context.get('expressionContext')
    if (expContext) {
      var routeContext = expContext.getRouteContext()
      var expression = v.getText()
      var name = expression.substring(5, expression.length)
      var keyboardKeys = expContext.getService(
        'vjs.framework.extension.platform.interface.enum.KeyboardKeys'
      )
      return keyboardKeys[name]
    }
  },

  evaluateEventAction: function (context, v) {
    var ctx = context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var expression = v.getText()
      var name = expression.substring(3, expression.length)
      return routeContext.getEventArgument(name)
    }
  },

  evaluateI18NVariable: function (context, v) {
    // 格式以 "I18N." 开头
    var langName = v.getText().substr(5)
    var ctx = context.get('expressionContext')
    if (ctx) {
      var scopeManager = ctx.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
      var scopeId = scopeManager.getCurrentScopeId()
      var scope = scopeManager.getScope(scopeId)
      var params
      if (scopeManager.isComponentScope(scopeId)) {
        var language = ctx.getService(
          'vjs.framework.extension.platform.interface.i18n.component'
        )
        params = { componentCode: scope.getComponentCode(), code: langName }
        if (language.hasExpLanguage(params)) {
          return language.getExpLanguage(params)
        }
      } else {
        var language = ctx.getService(
          'vjs.framework.extension.platform.interface.i18n.window'
        )
        params = {
          componentCode: scope.getComponentCode(),
          windowCode: scope.getWindowCode(),
          code: langName
        }
        if (language.hasExpLanguage(params)) {
          return language.getExpLanguage(params)
        }
      }
      var resourcePackage = ctx.getService(
        'vjs.framework.extension.ui.adapter.resourcepackage'
      )
      return resourcePackage.getLanguageItem(langName)
    }
    return ''
  },

  //获取foreach循环变量的值
  //格式：LV.[变量英文名称].[字段名称]
  evaluateForEachVar: function (context, v) {
    var routeContext = context.get('expressionContext').getRouteContext()
    var str = v.getText().split('.')
    if (str && str.length == 3) {
      var code = str[1]
      var field = str[2]
      var record = routeContext.getForEachVarValue(code)
      return record.get(field)
    } else {
      var factory = context
        .get('expressionContext')
        .getService(
          'vjs.framework.extension.platform.interface.exception.ExceptionFactory'
        )
      throw new Error(
        '循环变量表达式取值格式不正确: [' + str + ']',
        undefined,
        undefined,
        factory.TYPES.Config
      )
    }
  },

  callFunction: function (stream, f, argTree, context) {
    var expContext = context.get('expressionContext')
    var handlerName = f.getText().substring(0, f.getText().length - 1)

    // 解析表达式方法参数
    var args = []
    for (var index = 0; index < argTree.length; index++) {
      var walker = new com.toone.itop.formula.FormulaTreeJSExtend(
        context,
        new org.antlr.runtime.tree.CommonTreeNodeStream(argTree[index])
      )
      var cur = walker.eval()

      if (cur == null) {
        if (
          ',' == argTree[index].getText() ||
          ')' == argTree[index].getText()
        ) {
        } else {
          args.push(null)
        }
      } else {
        args.push(cur)
      }
    }

    //判断是否执行表达式
    if (context.get('_isExecutable')) {
      // 获取表达式方法执行器
      var executor = expContext.getService(
        'vjs.framework.extension.platform.engine.function.FunctionEngine'
      )
      var FunctionContext = expContext.getService(
        'vjs.framework.extension.platform.interface.function.FunctionContext'
      )
      //		var executor = context.get("executor");
      if (executor) {
        return executor.execute({
          functionName: handlerName,
          context: new FunctionContext(args, expContext.getRouteContext())
        })
      }
    }
  },

  lt: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) < Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) < String(right)
    }
  },

  lteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) <= Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) <= String(right)
    }
  },

  gt: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) > Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) > String(right)
    }
  },

  gteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) >= Number(right)
    } else {
      if (left == null || right == null) {
        return false
      }
      return String(left) >= String(right)
    }
  },

  eq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) == Number(right)
    } else {
      if (left == null && right == null) {
        return true
      } else if (left == null || right == null) {
        return false
      }
      return String(left) == String(right)
    }
  },

  noteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number') {
      return Number(left) != Number(right)
    } else {
      if (left == null && right == null) {
        return false
      } else if (left == null || right == null) {
        return true
      }
      return String(left) != String(right)
    }
  }
}

com.toone.itop.formula.Map = function () {
  /** Map 大小 * */
  this._size = 0
  /** 对象 * */
  this.entry = new Object()
}

com.toone.itop.formula.Map.prototype = {
  _def_perfix: 'Context_KEY_',

  /** 存 * */
  put: function (key, value) {
    if (!this.containsKey(key)) {
      this._size++
    }
    this.entry[this._def_perfix + key] = value
  },

  /** 取 * */
  get: function (key) {
    return this.containsKey(key) ? this.entry[this._def_perfix + key] : null
  },

  /** 删除 * */
  remove: function (key) {
    if (this.containsKey(key) && delete this.entry[this._def_perfix + key]) {
      this._size--
    }
  },

  /** 是否包含 Key * */
  containsKey: function (key) {
    if (this.entry[this._def_perfix + key]) {
      return true
    } else {
      return false
    }
  },

  /** 是否包含 Value * */
  containsValue: function (value) {
    for (var prop in this.entry) {
      if (this.entry[prop] == value) {
        return true
      }
    }
    return false
  },

  /** 所有 Value * */
  values: function () {
    var values = new Array()
    for (var prop in this.entry) {
      if (this.entry.hasOwnProperty(prop)) {
        values.push(this.entry[prop])
      }
    }
    return values
  },

  /** 所有 Key * */
  keys: function () {
    var keys = new Array()
    for (var prop in this.entry) {
      if (this.entry.hasOwnProperty(prop)) {
        keys.push(prop)
      }
    }
    return keys
  },

  /** Map Size * */
  size: function () {
    return this._size
  },

  /* 清空 */
  clear: function () {
    this._size = 0
    entry = new Object()
  }
}
//FormulaTreeJS.js
// $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g 2018-12-07 15:03:30

com.toone.itop.formula.FormulaTreeJS = function (input, state) {
  if (!state) {
    state = new org.antlr.runtime.RecognizerSharedState()
  }

  ;(function () {}.call(this))

  com.toone.itop.formula.FormulaTreeJS.superclass.constructor.call(
    this,
    input,
    state
  )

  /* @todo only create adaptor if output=AST */
  this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor()
}

org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaTreeJS, {
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
  var UP = org.antlr.runtime.Token.UP,
    DOWN = org.antlr.runtime.Token.DOWN

  // public instance methods/vars
  org.antlr.lang.extend(
    com.toone.itop.formula.FormulaTreeJS,
    org.antlr.runtime.tree.TreeParser,
    {
      getTokenNames: function () {
        return com.toone.itop.formula.FormulaTreeJS.tokenNames
      },
      getGrammarFileName: function () {
        return 'D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g'
      }
    }
  )
  org.antlr.lang.augmentObject(
    com.toone.itop.formula.FormulaTreeJS.prototype,
    {
      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:23:1: eval returns [var value] : v= expression ;
      // $ANTLR start "eval"
      eval: function () {
        var value = null

        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:24:2: (v= expression )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:24:4: v= expression
          this.pushFollow(
            com.toone.itop.formula.FormulaTreeJS.FOLLOW_expression_in_eval60
          )
          v = this.expression()

          this.state._fsp--

          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:26:1: expression returns [var value] : (v= operand | v= operation );
      // $ANTLR start "expression"
      expression: function () {
        var value = null

        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:27:2: (v= operand | v= operation )
          var alt1 = 2
          var LA1_0 = this.input.LA(1)

          if (
            (LA1_0 >= CONTROLPROPERTY && LA1_0 <= ARRAY) ||
            (LA1_0 >= NUMBER && LA1_0 <= FALSE) ||
            (LA1_0 >= BROUTRULE && LA1_0 <= BRREPORT)
          ) {
            alt1 = 1
          } else if (
            (LA1_0 >= POS && LA1_0 <= NEG) ||
            (LA1_0 >= AND && LA1_0 <= NOT) ||
            LA1_0 == FUNCNAME ||
            LA1_0 == PERCENT
          ) {
            alt1 = 2
          } else {
            var nvae = new org.antlr.runtime.NoViableAltException(
              '',
              1,
              0,
              this.input
            )

            throw nvae
          }
          switch (alt1) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:27:4: v= operand
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_operand_in_expression78
              )
              v = this.operand()

              this.state._fsp--

              value = v

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:28:4: v= operation
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_operation_in_expression87
              )
              v = this.operation()

              this.state._fsp--

              value = v

              break
          }
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:30:1: operation returns [var value] : ( ^( POS a= expression ) | ^( NEG a= expression ) | ^( NOT a= expression ) | ^( OR a= expression b= expression ) | ^( AND a= expression b= expression ) | ^( LT a= expression b= expression ) | ^( LTEQ a= expression b= expression ) | ^( GT a= expression b= expression ) | ^( GTEQ a= expression b= expression ) | ^( EQ a= expression b= expression ) | ^( NOTEQ a= expression b= expression ) | ^( ADD a= expression b= expression ) | ^( SUB a= expression b= expression ) | ^( MULT a= expression b= expression ) | ^( DIV a= expression b= expression ) | ^( EXP a= expression b= expression ) | ^( CONCAT a= expression b= expression ) | ^( PERCENT n= NUMBER ) | ^( FUNCNAME (funcArgs+= . )* ) );
      // $ANTLR start "operation"
      operation: function () {
        var value = null

        var n = null
        var FUNCNAME1 = null
        var a = null
        var b = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:31:2: ( ^( POS a= expression ) | ^( NEG a= expression ) | ^( NOT a= expression ) | ^( OR a= expression b= expression ) | ^( AND a= expression b= expression ) | ^( LT a= expression b= expression ) | ^( LTEQ a= expression b= expression ) | ^( GT a= expression b= expression ) | ^( GTEQ a= expression b= expression ) | ^( EQ a= expression b= expression ) | ^( NOTEQ a= expression b= expression ) | ^( ADD a= expression b= expression ) | ^( SUB a= expression b= expression ) | ^( MULT a= expression b= expression ) | ^( DIV a= expression b= expression ) | ^( EXP a= expression b= expression ) | ^( CONCAT a= expression b= expression ) | ^( PERCENT n= NUMBER ) | ^( FUNCNAME (funcArgs+= . )* ) )
          var alt3 = 19
          switch (this.input.LA(1)) {
            case POS:
              alt3 = 1
              break
            case NEG:
              alt3 = 2
              break
            case NOT:
              alt3 = 3
              break
            case OR:
              alt3 = 4
              break
            case AND:
              alt3 = 5
              break
            case LT:
              alt3 = 6
              break
            case LTEQ:
              alt3 = 7
              break
            case GT:
              alt3 = 8
              break
            case GTEQ:
              alt3 = 9
              break
            case EQ:
              alt3 = 10
              break
            case NOTEQ:
              alt3 = 11
              break
            case ADD:
              alt3 = 12
              break
            case SUB:
              alt3 = 13
              break
            case MULT:
              alt3 = 14
              break
            case DIV:
              alt3 = 15
              break
            case EXP:
              alt3 = 16
              break
            case CONCAT:
              alt3 = 17
              break
            case PERCENT:
              alt3 = 18
              break
            case FUNCNAME:
              alt3 = 19
              break
            default:
              var nvae = new org.antlr.runtime.NoViableAltException(
                '',
                3,
                0,
                this.input
              )

              throw nvae
          }

          switch (alt3) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:31:4: ^( POS a= expression )
              this.match(
                this.input,
                POS,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_POS_in_operation105
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation109
              )
              a = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = a

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:33:4: ^( NEG a= expression )
              this.match(
                this.input,
                NEG,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_NEG_in_operation120
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation124
              )
              a = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = a * -1

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:35:4: ^( NOT a= expression )
              this.match(
                this.input,
                NOT,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_NOT_in_operation136
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation140
              )
              a = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = !a

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:37:7: ^( OR a= expression b= expression )
              this.match(
                this.input,
                OR,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_OR_in_operation154
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation158
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation162
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = a || b

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:39:7: ^( AND a= expression b= expression )
              this.match(
                this.input,
                AND,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_AND_in_operation182
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation186
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation190
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = a && b

              break
            case 6:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:41:6: ^( LT a= expression b= expression )
              this.match(
                this.input,
                LT,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_LT_in_operation206
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation210
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation214
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.lt(a, b)

              break
            case 7:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:43:7: ^( LTEQ a= expression b= expression )
              this.match(
                this.input,
                LTEQ,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_LTEQ_in_operation231
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation235
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation239
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.lteq(a, b)

              break
            case 8:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:45:7: ^( GT a= expression b= expression )
              this.match(
                this.input,
                GT,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_GT_in_operation256
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation260
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation264
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.gt(a, b)

              break
            case 9:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:47:7: ^( GTEQ a= expression b= expression )
              this.match(
                this.input,
                GTEQ,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_GTEQ_in_operation281
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation285
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation289
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.gteq(a, b)

              break
            case 10:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:49:7: ^( EQ a= expression b= expression )
              this.match(
                this.input,
                EQ,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_EQ_in_operation306
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation310
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation314
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.eq(a, b)

              break
            case 11:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:51:7: ^( NOTEQ a= expression b= expression )
              this.match(
                this.input,
                NOTEQ,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_NOTEQ_in_operation331
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation335
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation339
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.noteq(a, b)

              break
            case 12:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:53:7: ^( ADD a= expression b= expression )
              this.match(
                this.input,
                ADD,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_ADD_in_operation356
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation360
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation364
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateAdd(
                this._getContext(),
                a,
                b
              )

              break
            case 13:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:57:7: ^( SUB a= expression b= expression )
              this.match(
                this.input,
                SUB,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_SUB_in_operation381
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation385
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation389
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateSub(
                this._getContext(),
                a,
                b
              )

              break
            case 14:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:61:7: ^( MULT a= expression b= expression )
              this.match(
                this.input,
                MULT,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_MULT_in_operation406
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation410
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation414
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateMult(
                this._getContext(),
                a,
                b
              )

              break
            case 15:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:65:7: ^( DIV a= expression b= expression )
              this.match(
                this.input,
                DIV,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_DIV_in_operation431
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation435
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation439
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateDiv(
                this._getContext(),
                a,
                b
              )

              break
            case 16:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:69:7: ^( EXP a= expression b= expression )
              this.match(
                this.input,
                EXP,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_EXP_in_operation456
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation460
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation464
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = Math.pow(
                com.toone.itop.formula.FormulaTreeExtra.evaluateNumber(
                  this._getContext(),
                  a
                ),
                com.toone.itop.formula.FormulaTreeExtra.evaluateNumber(
                  this._getContext(),
                  b
                )
              )

              break
            case 17:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:71:7: ^( CONCAT a= expression b= expression )
              this.match(
                this.input,
                CONCAT,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_CONCAT_in_operation481
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation485
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_expression_in_operation489
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = String(a) + String(b)

              break
            case 18:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:73:7: ^( PERCENT n= NUMBER )
              this.match(
                this.input,
                PERCENT,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_PERCENT_in_operation506
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              n = this.match(
                this.input,
                NUMBER,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_NUMBER_in_operation510
              )

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.evaluatePercent(
                (this._getContext(), n ? n.getText() : null)
              )

              break
            case 19:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:75:7: ^( FUNCNAME (funcArgs+= . )* )
              FUNCNAME1 = this.match(
                this.input,
                FUNCNAME,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_FUNCNAME_in_operation527
              )
              var list_funcArgs = []
              if (this.input.LA(1) == org.antlr.runtime.Token.DOWN) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null)
                // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:75:26: (funcArgs+= . )*
                loop2: do {
                  var alt2 = 2
                  var LA2_0 = this.input.LA(1)

                  if (LA2_0 >= POS && LA2_0 <= STR) {
                    alt2 = 1
                  }

                  switch (alt2) {
                    case 1:
                      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:75:26: funcArgs+= .
                      funcArgs = this.input.LT(1)
                      this.matchAny(this.input)
                      if (org.antlr.lang.isNull(list_funcArgs))
                        list_funcArgs = []
                      list_funcArgs.push(funcArgs)

                      break

                    default:
                      break loop2
                  }
                } while (true)

                this.match(this.input, org.antlr.runtime.Token.UP, null)
              }
              value = com.toone.itop.formula.FormulaTreeExtra.callFunction(
                this.input,
                FUNCNAME1,
                list_funcArgs,
                this._getContext()
              )

              break
          }
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:78:1: operand returns [var value] : v= literal ;
      // $ANTLR start "operand"
      operand: function () {
        var value = null

        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:79:2: (v= literal )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:79:4: v= literal
          this.pushFollow(
            com.toone.itop.formula.FormulaTreeJS.FOLLOW_literal_in_operand556
          )
          v = this.literal()

          this.state._fsp--

          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:81:1: literal returns [var value] : ( NUMBER | s= STRING | TRUE | FALSE | v= COMPONENTVARIABLE | v= FIELDVARIABLE | v= VARPARENTVARIABLE | v= INPARENTVARIABLE | v= SYSTEMVARIABLE | v= OUTPARENTVARIABLE | v= LVVARIABLE | v= DB | v= USERVAR | v= CONTROLPROPERTY | v= I18NVARIABLE | v= ARRAY | v= QUERY | v= BUSSINESSRULE | v= EVENTACTIONPROPERTY | v= KEYBOARDS | v= BROUTRULE | v= OUTPARENT | v= VARPARENT | v= INPARENT | v= BRREPORT );
      // $ANTLR start "literal"
      literal: function () {
        var value = null

        var s = null
        var v = null
        var NUMBER2 = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:82:2: ( NUMBER | s= STRING | TRUE | FALSE | v= COMPONENTVARIABLE | v= FIELDVARIABLE | v= VARPARENTVARIABLE | v= INPARENTVARIABLE | v= SYSTEMVARIABLE | v= OUTPARENTVARIABLE | v= LVVARIABLE | v= DB | v= USERVAR | v= CONTROLPROPERTY | v= I18NVARIABLE | v= ARRAY | v= QUERY | v= BUSSINESSRULE | v= EVENTACTIONPROPERTY | v= KEYBOARDS | v= BROUTRULE | v= OUTPARENT | v= VARPARENT | v= INPARENT | v= BRREPORT )
          var alt4 = 25
          switch (this.input.LA(1)) {
            case NUMBER:
              alt4 = 1
              break
            case STRING:
              alt4 = 2
              break
            case TRUE:
              alt4 = 3
              break
            case FALSE:
              alt4 = 4
              break
            case COMPONENTVARIABLE:
              alt4 = 5
              break
            case FIELDVARIABLE:
              alt4 = 6
              break
            case VARPARENTVARIABLE:
              alt4 = 7
              break
            case INPARENTVARIABLE:
              alt4 = 8
              break
            case SYSTEMVARIABLE:
              alt4 = 9
              break
            case OUTPARENTVARIABLE:
              alt4 = 10
              break
            case LVVARIABLE:
              alt4 = 11
              break
            case DB:
              alt4 = 12
              break
            case USERVAR:
              alt4 = 13
              break
            case CONTROLPROPERTY:
              alt4 = 14
              break
            case I18NVARIABLE:
              alt4 = 15
              break
            case ARRAY:
              alt4 = 16
              break
            case QUERY:
              alt4 = 17
              break
            case BUSSINESSRULE:
              alt4 = 18
              break
            case EVENTACTIONPROPERTY:
              alt4 = 19
              break
            case KEYBOARDS:
              alt4 = 20
              break
            case BROUTRULE:
              alt4 = 21
              break
            case OUTPARENT:
              alt4 = 22
              break
            case VARPARENT:
              alt4 = 23
              break
            case INPARENT:
              alt4 = 24
              break
            case BRREPORT:
              alt4 = 25
              break
            default:
              var nvae = new org.antlr.runtime.NoViableAltException(
                '',
                4,
                0,
                this.input
              )

              throw nvae
          }

          switch (alt4) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:82:4: NUMBER
              NUMBER2 = this.match(
                this.input,
                NUMBER,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_NUMBER_in_literal572
              )
              value = com.toone.itop.formula.FormulaTreeExtra.evaluateNumber(
                this._getContext(),
                NUMBER2 ? NUMBER2.getText() : null
              )

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:83:4: s= STRING
              s = this.match(
                this.input,
                STRING,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_STRING_in_literal581
              )
              value = s.getText().substring(1, s.getText().length - 1)

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:85:4: TRUE
              this.match(
                this.input,
                TRUE,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_TRUE_in_literal591
              )
              value = true

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:86:4: FALSE
              this.match(
                this.input,
                FALSE,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_FALSE_in_literal598
              )
              value = false

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:87:4: v= COMPONENTVARIABLE
              v = this.match(
                this.input,
                COMPONENTVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_COMPONENTVARIABLE_in_literal607
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateComponentVariable(
                  this._getContext(),
                  v
                )

              break
            case 6:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:89:5: v= FIELDVARIABLE
              v = this.match(
                this.input,
                FIELDVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_FIELDVARIABLE_in_literal614
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateWindowFieldVariable(
                  this._getContext(),
                  v
                )

              break
            case 7:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:91:5: v= VARPARENTVARIABLE
              v = this.match(
                this.input,
                VARPARENTVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_VARPARENTVARIABLE_in_literal621
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrVarFieldVariable(
                  this._getContext(),
                  v
                )

              break
            case 8:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:93:5: v= INPARENTVARIABLE
              v = this.match(
                this.input,
                INPARENTVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_INPARENTVARIABLE_in_literal628
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrInFieldVariable(
                  this._getContext(),
                  v
                )

              break
            case 9:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:95:5: v= SYSTEMVARIABLE
              v = this.match(
                this.input,
                SYSTEMVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_SYSTEMVARIABLE_in_literal635
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateSystemVariable(
                  this._getContext(),
                  v
                )

              break
            case 10:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:97:5: v= OUTPARENTVARIABLE
              v = this.match(
                this.input,
                OUTPARENTVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_OUTPARENTVARIABLE_in_literal642
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateOutParentVariable(
                  this._getContext(),
                  v
                )

              break
            case 11:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:99:5: v= LVVARIABLE
              v = this.match(
                this.input,
                LVVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_LVVARIABLE_in_literal649
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateForEachVar(
                  this._getContext(),
                  v
                )

              break
            case 12:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:101:5: v= DB
              v = this.match(
                this.input,
                DB,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_DB_in_literal656
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateTableChain(
                  this._getContext(),
                  v
                )

              break
            case 13:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:103:5: v= USERVAR
              v = this.match(
                this.input,
                USERVAR,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_USERVAR_in_literal663
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateUserVar(
                this._getContext(),
                v
              )

              break
            case 14:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:105:5: v= CONTROLPROPERTY
              v = this.match(
                this.input,
                CONTROLPROPERTY,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_CONTROLPROPERTY_in_literal670
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateControlProperty(
                  this._getContext(),
                  v
                )

              break
            case 15:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:107:5: v= I18NVARIABLE
              v = this.match(
                this.input,
                I18NVARIABLE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_I18NVARIABLE_in_literal677
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateI18NVariable(
                  this._getContext(),
                  v
                )

              break
            case 16:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:109:5: v= ARRAY
              v = this.match(
                this.input,
                ARRAY,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_ARRAY_in_literal684
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateArray(
                this._getContext(),
                v
              )

              break
            case 17:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:111:5: v= QUERY
              v = this.match(
                this.input,
                QUERY,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_QUERY_in_literal691
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateQuery(
                this._getContext(),
                v
              )

              break
            case 18:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:113:5: v= BUSSINESSRULE
              v = this.match(
                this.input,
                BUSSINESSRULE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_BUSSINESSRULE_in_literal698
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateBussineRuleResult(
                  this._getContext(),
                  v
                )

              break
            case 19:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:115:5: v= EVENTACTIONPROPERTY
              v = this.match(
                this.input,
                EVENTACTIONPROPERTY,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_EVENTACTIONPROPERTY_in_literal705
              )

              value =
                com.toone.itop.formula.FormulaTreeExtra.evaluateEventAction(
                  this._getContext(),
                  v
                )

              break
            case 20:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:117:5: v= KEYBOARDS
              v = this.match(
                this.input,
                KEYBOARDS,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_KEYBOARDS_in_literal712
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateKeyBoards(
                this._getContext(),
                v
              )

              break
            case 21:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:119:5: v= BROUTRULE
              v = this.match(
                this.input,
                BROUTRULE,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_BROUTRULE_in_literal719
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateBrOutRule(
                this._getContext(),
                v
              )

              break
            case 22:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:121:5: v= OUTPARENT
              v = this.match(
                this.input,
                OUTPARENT,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_OUTPARENT_in_literal726
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateBrOut(
                this._getContext(),
                v
              )

              break
            case 23:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:123:5: v= VARPARENT
              v = this.match(
                this.input,
                VARPARENT,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_VARPARENT_in_literal733
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateBrVar(
                this._getContext(),
                v
              )

              break
            case 24:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:125:5: v= INPARENT
              v = this.match(
                this.input,
                INPARENT,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_INPARENT_in_literal740
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateBrIn(
                this._getContext(),
                v
              )

              break
            case 25:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaTreeJS.g:127:5: v= BRREPORT
              v = this.match(
                this.input,
                BRREPORT,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_BRREPORT_in_literal747
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateBrReport(
                this._getContext(),
                v
              )

              break
          }
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      }

      // Delegated rules
    },
    true
  ) // important to pass true to overwrite default implementations

  // public class variables
  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaTreeJS, {
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
    FOLLOW_expression_in_eval60: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_operand_in_expression78: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_operation_in_expression87: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_POS_in_operation105: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation109: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_NEG_in_operation120: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation124: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_NOT_in_operation136: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation140: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_OR_in_operation154: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation158: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation162: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_AND_in_operation182: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation186: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation190: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_LT_in_operation206: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation210: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation214: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_LTEQ_in_operation231: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation235: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation239: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_GT_in_operation256: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation260: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation264: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_GTEQ_in_operation281: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation285: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation289: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_EQ_in_operation306: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation310: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation314: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_NOTEQ_in_operation331: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation335: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation339: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_ADD_in_operation356: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation360: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation364: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_SUB_in_operation381: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation385: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation389: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_MULT_in_operation406: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation410: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation414: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_DIV_in_operation431: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation435: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation439: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_EXP_in_operation456: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation460: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation464: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_CONCAT_in_operation481: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation485: new org.antlr.runtime.BitSet([
      0xfffff830, 0x1fe17a7f
    ]),
    FOLLOW_expression_in_operation489: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_PERCENT_in_operation506: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_NUMBER_in_operation510: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_FUNCNAME_in_operation527: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_literal_in_operand556: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_NUMBER_in_literal572: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_STRING_in_literal581: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_TRUE_in_literal591: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FALSE_in_literal598: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_COMPONENTVARIABLE_in_literal607: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FIELDVARIABLE_in_literal614: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_VARPARENTVARIABLE_in_literal621: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_INPARENTVARIABLE_in_literal628: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_SYSTEMVARIABLE_in_literal635: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_OUTPARENTVARIABLE_in_literal642: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_LVVARIABLE_in_literal649: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_DB_in_literal656: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_USERVAR_in_literal663: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_CONTROLPROPERTY_in_literal670: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_I18NVARIABLE_in_literal677: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_ARRAY_in_literal684: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_QUERY_in_literal691: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BUSSINESSRULE_in_literal698: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_EVENTACTIONPROPERTY_in_literal705: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_KEYBOARDS_in_literal712: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BROUTRULE_in_literal719: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_OUTPARENT_in_literal726: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_VARPARENT_in_literal733: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_INPARENT_in_literal740: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BRREPORT_in_literal747: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ])
  })
})()
//FormulaTreeJSExtend.js
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
//FormulaVarFinderJS.js
// $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g 2018-10-25 19:18:48

com.toone.itop.formula.FormulaVarFinderJS = function (input, state) {
  if (!state) {
    state = new org.antlr.runtime.RecognizerSharedState()
  }

  ;(function () {}.call(this))

  com.toone.itop.formula.FormulaVarFinderJS.superclass.constructor.call(
    this,
    input,
    state
  )

  /* @todo only create adaptor if output=AST */
  this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor()
}

org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaVarFinderJS, {
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
  var UP = org.antlr.runtime.Token.UP,
    DOWN = org.antlr.runtime.Token.DOWN

  // public instance methods/vars
  org.antlr.lang.extend(
    com.toone.itop.formula.FormulaVarFinderJS,
    org.antlr.runtime.tree.TreeParser,
    {
      getTokenNames: function () {
        return com.toone.itop.formula.FormulaVarFinderJS.tokenNames
      },
      getGrammarFileName: function () {
        return 'D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g'
      }
    }
  )
  org.antlr.lang.augmentObject(
    com.toone.itop.formula.FormulaVarFinderJS.prototype,
    {
      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:23:1: eval returns [var value] : v= expression ;
      // $ANTLR start "eval"
      eval: function () {
        var value = null

        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:24:2: (v= expression )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:24:4: v= expression
          this.pushFollow(
            com.toone.itop.formula.FormulaVarFinderJS
              .FOLLOW_expression_in_eval60
          )
          v = this.expression()

          this.state._fsp--

          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:26:1: expression returns [var value] : (v= operand | v= operation );
      // $ANTLR start "expression"
      expression: function () {
        var value = null

        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:27:2: (v= operand | v= operation )
          var alt1 = 2
          var LA1_0 = this.input.LA(1)

          if (
            (LA1_0 >= CONTROLPROPERTY && LA1_0 <= DB) ||
            (LA1_0 >= BUSSINESSRULE && LA1_0 <= ARRAY) ||
            (LA1_0 >= NUMBER && LA1_0 <= FALSE) ||
            (LA1_0 >= BROUTRULE && LA1_0 <= BRREPORT)
          ) {
            alt1 = 1
          } else if (
            (LA1_0 >= POS && LA1_0 <= CALL) ||
            (LA1_0 >= AND && LA1_0 <= NOT) ||
            LA1_0 == PERCENT
          ) {
            alt1 = 2
          } else {
            var nvae = new org.antlr.runtime.NoViableAltException(
              '',
              1,
              0,
              this.input
            )

            throw nvae
          }
          switch (alt1) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:27:4: v= operand
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_operand_in_expression78
              )
              v = this.operand()

              this.state._fsp--

              value = v

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:28:4: v= operation
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_operation_in_expression87
              )
              v = this.operation()

              this.state._fsp--

              value = v

              break
          }
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:30:1: operation returns [var value] : ( ^( POS a= expression ) | ^( NEG a= expression ) | ^( NOT a= expression ) | ^( OR a= expression b= expression ) | ^( AND a= expression b= expression ) | ^( LT a= expression b= expression ) | ^( LTEQ a= expression b= expression ) | ^( GT a= expression b= expression ) | ^( GTEQ a= expression b= expression ) | ^( EQ a= expression b= expression ) | ^( NOTEQ a= expression b= expression ) | ^( ADD a= expression b= expression ) | ^( SUB a= expression b= expression ) | ^( MULT a= expression b= expression ) | ^( DIV a= expression b= expression ) | ^( EXP a= expression b= expression ) | ^( CONCAT a= expression b= expression ) | ^( PERCENT n= NUMBER ) | ^( CALL FUNCNAME (funcArgs+= . )* ) );
      // $ANTLR start "operation"
      operation: function () {
        var value = null

        var n = null
        var FUNCNAME1 = null
        var a = null
        var b = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:31:2: ( ^( POS a= expression ) | ^( NEG a= expression ) | ^( NOT a= expression ) | ^( OR a= expression b= expression ) | ^( AND a= expression b= expression ) | ^( LT a= expression b= expression ) | ^( LTEQ a= expression b= expression ) | ^( GT a= expression b= expression ) | ^( GTEQ a= expression b= expression ) | ^( EQ a= expression b= expression ) | ^( NOTEQ a= expression b= expression ) | ^( ADD a= expression b= expression ) | ^( SUB a= expression b= expression ) | ^( MULT a= expression b= expression ) | ^( DIV a= expression b= expression ) | ^( EXP a= expression b= expression ) | ^( CONCAT a= expression b= expression ) | ^( PERCENT n= NUMBER ) | ^( CALL FUNCNAME (funcArgs+= . )* ) )
          var alt3 = 19
          switch (this.input.LA(1)) {
            case POS:
              alt3 = 1
              break
            case NEG:
              alt3 = 2
              break
            case NOT:
              alt3 = 3
              break
            case OR:
              alt3 = 4
              break
            case AND:
              alt3 = 5
              break
            case LT:
              alt3 = 6
              break
            case LTEQ:
              alt3 = 7
              break
            case GT:
              alt3 = 8
              break
            case GTEQ:
              alt3 = 9
              break
            case EQ:
              alt3 = 10
              break
            case NOTEQ:
              alt3 = 11
              break
            case ADD:
              alt3 = 12
              break
            case SUB:
              alt3 = 13
              break
            case MULT:
              alt3 = 14
              break
            case DIV:
              alt3 = 15
              break
            case EXP:
              alt3 = 16
              break
            case CONCAT:
              alt3 = 17
              break
            case PERCENT:
              alt3 = 18
              break
            case CALL:
              alt3 = 19
              break
            default:
              var nvae = new org.antlr.runtime.NoViableAltException(
                '',
                3,
                0,
                this.input
              )

              throw nvae
          }

          switch (alt3) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:31:5: ^( POS a= expression )
              this.match(
                this.input,
                POS,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_POS_in_operation106
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation110
              )
              a = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:33:4: ^( NEG a= expression )
              this.match(
                this.input,
                NEG,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_NEG_in_operation121
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation125
              )
              a = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:35:4: ^( NOT a= expression )
              this.match(
                this.input,
                NOT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_NOT_in_operation137
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation141
              )
              a = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:37:7: ^( OR a= expression b= expression )
              this.match(
                this.input,
                OR,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_OR_in_operation155
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation159
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation163
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:39:7: ^( AND a= expression b= expression )
              this.match(
                this.input,
                AND,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_AND_in_operation183
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation187
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation191
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 6:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:41:6: ^( LT a= expression b= expression )
              this.match(
                this.input,
                LT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_LT_in_operation207
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation211
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation215
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 7:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:43:7: ^( LTEQ a= expression b= expression )
              this.match(
                this.input,
                LTEQ,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_LTEQ_in_operation232
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation236
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation240
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 8:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:45:7: ^( GT a= expression b= expression )
              this.match(
                this.input,
                GT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_GT_in_operation257
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation261
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation265
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 9:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:47:7: ^( GTEQ a= expression b= expression )
              this.match(
                this.input,
                GTEQ,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_GTEQ_in_operation282
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation286
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation290
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 10:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:49:7: ^( EQ a= expression b= expression )
              this.match(
                this.input,
                EQ,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_EQ_in_operation307
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation311
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation315
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 11:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:51:7: ^( NOTEQ a= expression b= expression )
              this.match(
                this.input,
                NOTEQ,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_NOTEQ_in_operation332
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation336
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation340
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 12:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:53:7: ^( ADD a= expression b= expression )
              this.match(
                this.input,
                ADD,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_ADD_in_operation357
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation361
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation365
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 13:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:57:7: ^( SUB a= expression b= expression )
              this.match(
                this.input,
                SUB,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_SUB_in_operation382
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation386
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation390
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 14:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:61:7: ^( MULT a= expression b= expression )
              this.match(
                this.input,
                MULT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_MULT_in_operation407
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation411
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation415
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 15:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:65:7: ^( DIV a= expression b= expression )
              this.match(
                this.input,
                DIV,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_DIV_in_operation432
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation436
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation440
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 16:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:69:7: ^( EXP a= expression b= expression )
              this.match(
                this.input,
                EXP,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_EXP_in_operation457
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation461
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation465
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 17:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:71:7: ^( CONCAT a= expression b= expression )
              this.match(
                this.input,
                CONCAT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_CONCAT_in_operation482
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation486
              )
              a = this.expression()

              this.state._fsp--

              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_expression_in_operation490
              )
              b = this.expression()

              this.state._fsp--

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 18:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:73:7: ^( PERCENT n= NUMBER )
              this.match(
                this.input,
                PERCENT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_PERCENT_in_operation507
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              n = this.match(
                this.input,
                NUMBER,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_NUMBER_in_operation511
              )

              this.match(this.input, org.antlr.runtime.Token.UP, null)

              break
            case 19:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:75:3: ^( CALL FUNCNAME (funcArgs+= . )* )
              this.match(
                this.input,
                CALL,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_CALL_in_operation524
              )

              this.match(this.input, org.antlr.runtime.Token.DOWN, null)
              FUNCNAME1 = this.match(
                this.input,
                FUNCNAME,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_FUNCNAME_in_operation526
              )
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:75:27: (funcArgs+= . )*
              loop2: do {
                var alt2 = 2
                var LA2_0 = this.input.LA(1)

                if (LA2_0 >= POS && LA2_0 <= STR) {
                  alt2 = 1
                }

                switch (alt2) {
                  case 1:
                    // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:75:27: funcArgs+= .
                    funcArgs = this.input.LT(1)
                    this.matchAny(this.input)
                    if (org.antlr.lang.isNull(list_funcArgs)) list_funcArgs = []
                    list_funcArgs.push(funcArgs)

                    break

                  default:
                    break loop2
                }
              } while (true)

              this.match(this.input, org.antlr.runtime.Token.UP, null)
              value = com.toone.itop.formula.FormulaTreeExtra.callFunction(
                this.input,
                FUNCNAME1,
                list_funcArgs,
                this._getContext()
              )

              break
          }
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:78:1: operand returns [var value] : v= literal ;
      // $ANTLR start "operand"
      operand: function () {
        var value = null

        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:79:2: (v= literal )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:79:4: v= literal
          this.pushFollow(
            com.toone.itop.formula.FormulaVarFinderJS
              .FOLLOW_literal_in_operand555
          )
          v = this.literal()

          this.state._fsp--

          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      },

      // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:81:1: literal returns [var value] : ( NUMBER | s= STRING | TRUE | FALSE | v= COMPONENTVARIABLE | v= FIELDVARIABLE | v= VARPARENTVARIABLE | v= INPARENTVARIABLE | v= SYSTEMVARIABLE | v= OUTPARENTVARIABLE | v= LVVARIABLE | v= DB | v= BUSSINESSRULE | v= CONTROLPROPERTY | v= EVENTACTIONPROPERTY | v= KEYBOARDS | v= ARRAY | v= BROUTRULE | v= OUTPARENT | v= VARPARENT | v= INPARENT | v= I18NVARIABLE | v= BRREPORT );
      // $ANTLR start "literal"
      literal: function () {
        var value = null

        var s = null
        var v = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:82:2: ( NUMBER | s= STRING | TRUE | FALSE | v= COMPONENTVARIABLE | v= FIELDVARIABLE | v= VARPARENTVARIABLE | v= INPARENTVARIABLE | v= SYSTEMVARIABLE | v= OUTPARENTVARIABLE | v= LVVARIABLE | v= DB | v= BUSSINESSRULE | v= CONTROLPROPERTY | v= EVENTACTIONPROPERTY | v= KEYBOARDS | v= ARRAY | v= BROUTRULE | v= OUTPARENT | v= VARPARENT | v= INPARENT | v= I18NVARIABLE | v= BRREPORT )
          var alt4 = 23
          switch (this.input.LA(1)) {
            case NUMBER:
              alt4 = 1
              break
            case STRING:
              alt4 = 2
              break
            case TRUE:
              alt4 = 3
              break
            case FALSE:
              alt4 = 4
              break
            case COMPONENTVARIABLE:
              alt4 = 5
              break
            case FIELDVARIABLE:
              alt4 = 6
              break
            case VARPARENTVARIABLE:
              alt4 = 7
              break
            case INPARENTVARIABLE:
              alt4 = 8
              break
            case SYSTEMVARIABLE:
              alt4 = 9
              break
            case OUTPARENTVARIABLE:
              alt4 = 10
              break
            case LVVARIABLE:
              alt4 = 11
              break
            case DB:
              alt4 = 12
              break
            case BUSSINESSRULE:
              alt4 = 13
              break
            case CONTROLPROPERTY:
              alt4 = 14
              break
            case EVENTACTIONPROPERTY:
              alt4 = 15
              break
            case KEYBOARDS:
              alt4 = 16
              break
            case ARRAY:
              alt4 = 17
              break
            case BROUTRULE:
              alt4 = 18
              break
            case OUTPARENT:
              alt4 = 19
              break
            case VARPARENT:
              alt4 = 20
              break
            case INPARENT:
              alt4 = 21
              break
            case I18NVARIABLE:
              alt4 = 22
              break
            case BRREPORT:
              alt4 = 23
              break
            default:
              var nvae = new org.antlr.runtime.NoViableAltException(
                '',
                4,
                0,
                this.input
              )

              throw nvae
          }

          switch (alt4) {
            case 1:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:82:4: NUMBER
              this.match(
                this.input,
                NUMBER,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_NUMBER_in_literal571
              )

              break
            case 2:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:83:4: s= STRING
              s = this.match(
                this.input,
                STRING,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_STRING_in_literal580
              )

              break
            case 3:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:85:4: TRUE
              this.match(
                this.input,
                TRUE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_TRUE_in_literal590
              )

              break
            case 4:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:86:3: FALSE
              this.match(
                this.input,
                FALSE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_FALSE_in_literal596
              )

              break
            case 5:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:87:4: v= COMPONENTVARIABLE
              v = this.match(
                this.input,
                COMPONENTVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_COMPONENTVARIABLE_in_literal602
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateComponentVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 6:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:89:5: v= FIELDVARIABLE
              v = this.match(
                this.input,
                FIELDVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_FIELDVARIABLE_in_literal609
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateWindowFieldVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 7:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:91:5: v= VARPARENTVARIABLE
              v = this.match(
                this.input,
                VARPARENTVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_VARPARENTVARIABLE_in_literal616
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateSystemVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 8:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:93:5: v= INPARENTVARIABLE
              v = this.match(
                this.input,
                INPARENTVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_INPARENTVARIABLE_in_literal623
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrInFieldVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 9:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:95:5: v= SYSTEMVARIABLE
              v = this.match(
                this.input,
                SYSTEMVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_SYSTEMVARIABLE_in_literal630
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateSystemVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 10:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:97:5: v= OUTPARENTVARIABLE
              v = this.match(
                this.input,
                OUTPARENTVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_OUTPARENTVARIABLE_in_literal637
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateOutParentVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 11:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:99:5: v= LVVARIABLE
              v = this.match(
                this.input,
                LVVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_LVVARIABLE_in_literal644
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateForEachVar(
                  this._getContext(),
                  v
                )
              )

              break
            case 12:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:101:5: v= DB
              v = this.match(
                this.input,
                DB,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_DB_in_literal651
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateTableChain(
                  this._getContext(),
                  v
                )
              )

              break
            case 13:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:103:5: v= BUSSINESSRULE
              v = this.match(
                this.input,
                BUSSINESSRULE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_BUSSINESSRULE_in_literal658
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateBussineRule(
                  this._getContext(),
                  v
                )
              )

              break
            case 14:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:105:5: v= CONTROLPROPERTY
              v = this.match(
                this.input,
                CONTROLPROPERTY,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_CONTROLPROPERTY_in_literal665
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateControlProperty(
                  this._getContext(),
                  v
                )
              )

              break
            case 15:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:107:5: v= EVENTACTIONPROPERTY
              v = this.match(
                this.input,
                EVENTACTIONPROPERTY,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_EVENTACTIONPROPERTY_in_literal672
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateEventAction(
                  this._getContext(),
                  v
                )
              )

              break
            case 16:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:109:5: v= KEYBOARDS
              v = this.match(
                this.input,
                KEYBOARDS,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_KEYBOARDS_in_literal679
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateKeyBoards(
                  this._getContext(),
                  v
                )
              )

              break
            case 17:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:111:5: v= ARRAY
              v = this.match(
                this.input,
                ARRAY,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_ARRAY_in_literal686
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateArray(
                  this._getContext(),
                  v
                )
              )

              break
            case 18:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:113:5: v= BROUTRULE
              v = this.match(
                this.input,
                BROUTRULE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_BROUTRULE_in_literal693
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrOutRule(
                  this._getContext(),
                  v
                )
              )

              break
            case 19:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:115:5: v= OUTPARENT
              v = this.match(
                this.input,
                OUTPARENT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_OUTPARENT_in_literal700
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrOut(
                  this._getContext(),
                  v
                )
              )

              break
            case 20:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:117:5: v= VARPARENT
              v = this.match(
                this.input,
                VARPARENT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_VARPARENT_in_literal707
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrVar(
                  this._getContext(),
                  v
                )
              )

              break
            case 21:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:119:5: v= INPARENT
              v = this.match(
                this.input,
                INPARENT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_INPARENT_in_literal714
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateBrIn(
                  this._getContext(),
                  v
                )
              )

              break
            case 22:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:121:5: v= I18NVARIABLE
              v = this.match(
                this.input,
                I18NVARIABLE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_I18NVARIABLE_in_literal721
              )

              this._getContext().put(
                v.getText(),
                com.toone.itop.formula.FormulaTreeExtra.evaluateI18NVariable(
                  this._getContext(),
                  v
                )
              )

              break
            case 23:
              // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\com.toone.itop.formula.FormulaVarFinderJS.g:123:5: v= BRREPORT
              v = this.match(
                this.input,
                BRREPORT,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_BRREPORT_in_literal728
              )

              value = com.toone.itop.formula.FormulaTreeExtra.evaluateBrReport(
                this._getContext(),
                v
              )

              break
          }
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException) {
            //this.reportError(re);
            this.recover(this.input, re)
          } else {
            throw re
          }
        } finally {
        }
        return value
      }

      // Delegated rules
    },
    true
  ) // important to pass true to overwrite default implementations

  // public class variables
  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaVarFinderJS, {
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
    FOLLOW_expression_in_eval60: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_operand_in_expression78: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_operation_in_expression87: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_POS_in_operation106: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation110: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_NEG_in_operation121: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation125: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_NOT_in_operation137: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation141: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_OR_in_operation155: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation159: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation163: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_AND_in_operation183: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation187: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation191: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_LT_in_operation207: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation211: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation215: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_LTEQ_in_operation232: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation236: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation240: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_GT_in_operation257: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation261: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation265: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_GTEQ_in_operation282: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation286: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation290: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_EQ_in_operation307: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation311: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation315: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_NOTEQ_in_operation332: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation336: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation340: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_ADD_in_operation357: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation361: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation365: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_SUB_in_operation382: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation386: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation390: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_MULT_in_operation407: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation411: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation415: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_DIV_in_operation432: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation436: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation440: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_EXP_in_operation457: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation461: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation465: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_CONCAT_in_operation482: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_expression_in_operation486: new org.antlr.runtime.BitSet([
      0xfffff870, 0x1fe17879
    ]),
    FOLLOW_expression_in_operation490: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_PERCENT_in_operation507: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_NUMBER_in_operation511: new org.antlr.runtime.BitSet([
      0x00000008, 0x00000000
    ]),
    FOLLOW_CALL_in_operation524: new org.antlr.runtime.BitSet([
      0x00000004, 0x00000000
    ]),
    FOLLOW_FUNCNAME_in_operation526: new org.antlr.runtime.BitSet([
      0xfffffff8, 0x3fffffff
    ]),
    FOLLOW_literal_in_operand555: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_NUMBER_in_literal571: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_STRING_in_literal580: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_TRUE_in_literal590: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FALSE_in_literal596: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_COMPONENTVARIABLE_in_literal602: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_FIELDVARIABLE_in_literal609: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_VARPARENTVARIABLE_in_literal616: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_INPARENTVARIABLE_in_literal623: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_SYSTEMVARIABLE_in_literal630: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_OUTPARENTVARIABLE_in_literal637: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_LVVARIABLE_in_literal644: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_DB_in_literal651: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BUSSINESSRULE_in_literal658: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_CONTROLPROPERTY_in_literal665: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_EVENTACTIONPROPERTY_in_literal672: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_KEYBOARDS_in_literal679: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_ARRAY_in_literal686: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BROUTRULE_in_literal693: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_OUTPARENT_in_literal700: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_VARPARENT_in_literal707: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_INPARENT_in_literal714: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_I18NVARIABLE_in_literal721: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ]),
    FOLLOW_BRREPORT_in_literal728: new org.antlr.runtime.BitSet([
      0x00000002, 0x00000000
    ])
  })
})()
//FormulaVarFinderJSExtend.js
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
//

const Map = com.toone.itop.formula.Map
const Formula = com.toone.itop.formula.Formula

export { Formula, Map }
