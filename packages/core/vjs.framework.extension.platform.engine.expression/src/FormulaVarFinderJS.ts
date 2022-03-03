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
