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
