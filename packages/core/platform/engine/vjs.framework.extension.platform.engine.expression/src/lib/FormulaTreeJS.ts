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
