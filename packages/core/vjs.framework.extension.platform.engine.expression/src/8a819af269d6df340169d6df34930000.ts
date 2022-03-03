if (typeof org == 'undefined' || !org) {
  let org = {}
  window.org = org
}
if (typeof org.antlr == 'undefined' || !org.antlr) org.antlr = {}
org.antlr.global = function () {
  return this
}.call(null)
org.antlr.namespace = function () {
  let A = arguments,
    E = null,
    C,
    B,
    D
  for (C = 0; C < A.length; C = C + 1) {
    D = A[C].split('.')
    E = org.antlr.global
    for (B = 0; B < D.length; B = B + 1) {
      E[D[B]] = E[D[B]] || {}
      E = E[D[B]]
    }
  }
  return E
}
org.antlr.env = org.antlr.env || {}
org.antlr.env.ua = (function () {
  var D = {
    ie: 0,
    opera: 0,
    gecko: 0,
    webkit: 0,
    mobile: null,
    air: 0,
    rhino: false
  }
  var B, A
  try {
    B = navigator.userAgent
    if (/KHTML/.test(B)) D.webkit = 1
    A = B.match(/AppleWebKit\/([^\s]*)/)
    if (A && A[1]) {
      D.webkit = parseFloat(A[1])
      if (/ Mobile\//.test(B)) D.mobile = 'Apple'
      else {
        A = B.match(/NokiaN[^\/]*/)
        if (A) D.mobile = A[0]
      }
      A = B.match(/AdobeAIR\/([^\s]*)/)
      if (A) D.air = A[0]
    }
    if (!D.webkit) {
      A = B.match(/Opera[\s\/]([^\s]*)/)
      if (A && A[1]) {
        D.opera = parseFloat(A[1])
        A = B.match(/Opera Mini[^;]*/)
        if (A) D.mobile = A[0]
      } else {
        A = B.match(/MSIE\s([^;]*)/)
        if (A && A[1]) D.ie = parseFloat(A[1])
        else {
          A = B.match(/Gecko\/([^\s]*)/)
          if (A) {
            D.gecko = 1
            A = B.match(/rv:([^\s\)]*)/)
            if (A && A[1]) D.gecko = parseFloat(A[1])
          }
        }
      }
    }
  } catch (C) {}
  try {
    if (typeof window == 'undefined' && loadClass) D.rhino = true
  } catch (C) {}
  return D
})()
org.antlr.namespace('org.antlr.runtime.tree')
org.antlr.lang = org.antlr.lang || {
  isArray: function (B) {
    if (B) {
      var A = org.antlr.lang
      return A.isNumber(B.length) && A.isFunction(B.splice)
    }
    return false
  },
  isBoolean: function (A) {
    return typeof A === 'boolean'
  },
  isFunction: function (A) {
    return typeof A === 'function'
  },
  isNull: function (A) {
    return A === null
  },
  isNumber: function (A) {
    return typeof A === 'number' && isFinite(A)
  },
  isObject: function (A) {
    return (
      (A && (typeof A === 'object' || org.antlr.lang.isFunction(A))) || false
    )
  },
  isString: function (A) {
    return typeof A === 'string'
  },
  isUndefined: function (A) {
    return typeof A === 'undefined'
  },
  _IEEnumFix: function (C, B) {
    if (org.antlr.env.ua.ie) {
      var E = ['toString', 'valueOf'],
        A
      for (A = 0; A < E.length; A = A + 1) {
        var F = E[A],
          D = B[F]
        if (org.antlr.lang.isFunction(D) && D != Object.prototype[F]) C[F] = D
      }
    }
  },
  extend: function (D, E, C) {
    if (!E || !D)
      throw new Error(
        'org.antlr.lang.extend failed, please check that all dependencies are included.'
      )
    var B = function () {}
    B.prototype = E.prototype
    D.prototype = new B()
    D.prototype.constructor = D
    D.superclass = E.prototype
    if (E.prototype.constructor == Object.prototype.constructor)
      E.prototype.constructor = E
    if (C) {
      for (var A in C) D.prototype[A] = C[A]
      org.antlr.lang._IEEnumFix(D.prototype, C)
    }
  },
  augmentObject: function (E, D) {
    if (!D || !E) throw new Error('Absorb failed, verify dependencies.')
    var A = arguments,
      C,
      F,
      B = A[2]
    if (B && B !== true) for (C = 2; C < A.length; C = C + 1) E[A[C]] = D[A[C]]
    else {
      for (F in D) if (B || !E[F]) E[F] = D[F]
      org.antlr.lang._IEEnumFix(E, D)
    }
  },
  augmentProto: function (D, C) {
    if (!C || !D) throw new Error('Augment failed, verify dependencies.')
    var A = [D.prototype, C.prototype]
    for (var B = 2; B < arguments.length; B = B + 1) A.push(arguments[B])
    org.antlr.lang.augmentObject.apply(this, A)
  },
  merge: function () {
    var D = {},
      B = arguments
    for (var C = 0, A = B.length; C < A; C = C + 1)
      org.antlr.lang.augmentObject(D, B[C], true)
    return D
  },
  isValue: function (B) {
    var A = org.antlr.lang
    return A.isObject(B) || A.isString(B) || A.isNumber(B) || A.isBoolean(B)
  },
  array: {
    peek: function (B) {
      if (!org.antlr.lang.isArray(B))
        throw new Error('org.antlr.lang.array.peek: a is not an array.')
      var A = B.length
      if (A <= 0) throw new Error('org.antlr.lang.array.peek: a is empty.')
      return B[A - 1]
    }
  }
}
org.antlr.runtime.RecognizerSharedState = function () {
  this.following = []
  this._fsp = -1
  this.errorRecovery = false
  this.lastErrorIndex = -1
  this.failed = false
  this.syntaxErrors = 0
  this.backtracking = 0
  this.ruleMemo = null
  this.token = null
  this.tokenStartCharIndex = -1
  this.text = null
}
org.antlr.runtime.IndexOutOfBoundsException = function (A) {
  org.antlr.runtime.IndexOutOfBoundsException.superclass.constructor.call(
    this,
    A
  )
}
org.antlr.lang.extend(org.antlr.runtime.IndexOutOfBoundsException, Error, {
  name: 'org.antlr.runtime.IndexOutOfBoundsException'
})
org.antlr.runtime.RecognitionException = function (A) {
  org.antlr.runtime.RecognitionException.superclass.constructor.call(this)
  this.input = A
  this.index = A.index()
  if (A instanceof org.antlr.runtime.CommonTokenStream) {
    this.token = A.LT(1)
    this.line = this.token.getLine()
    this.charPositionInLine = this.token.getCharPositionInLine()
  }
  if (A instanceof org.antlr.runtime.tree.TreeNodeStream)
    this.extractInformationFromTreeNodeStream(A)
  else if (A instanceof org.antlr.runtime.ANTLRStringStream) {
    this.c = A.LA(1)
    this.line = A.getLine()
    this.charPositionInLine = A.getCharPositionInLine()
  } else this.c = A.LA(1)
  this.message = this.toString()
}
org.antlr.lang.extend(org.antlr.runtime.RecognitionException, Error, {
  input: null,
  index: null,
  token: null,
  node: null,
  c: null,
  line: null,
  name: 'org.antlr.runtime.RecognitionException',
  charPositionInLine: null,
  approximateLineInfo: null,
  extractInformationFromTreeNodeStream: function (F) {
    let A = F,
      E,
      I,
      D,
      H,
      C
    this.node = A.LT(1)
    let B = A.getTreeAdaptor(),
      G = B.getToken(this.node)
    if (G) {
      this.token = G
      if (G.getLine() <= 0) {
        C = -1
        E = A.LT(C)
        while (E) {
          priorPayload = B.getToken(E)
          if (priorPayload && priorPayload.getLine() > 0) {
            this.line = priorPayload.getLine()
            this.charPositionInLine = priorPayload.getCharPositionInLine()
            this.approximateLineInfo = true
            break
          }
          --C
          E = A.LT(C)
        }
      } else {
        this.line = G.getLine()
        this.charPositionInLine = G.getCharPositionInLine()
      }
    } else if (this.node instanceof org.antlr.runtime.tree.CommonTree) {
      this.line = this.node.getLine()
      this.charPositionInLine = this.node.getCharPositionInLine()
      if (this.node instanceof org.antlr.runtime.tree.CommonTree)
        this.token = this.node.token
    } else {
      D = B.getType(this.node)
      H = B.getText(this.node)
      this.token = new org.antlr.runtime.CommonToken(D, H)
    }
  },
  getUnexpectedType: function () {
    if (this.input instanceof org.antlr.runtime.CommonTokenStream)
      return this.token.getType()
    else if (this.input instanceof org.antlr.runtime.tree.TreeNodeStream) {
      let A = this.input
      let B = A.getTreeAdaptor()
      return B.getType(this.node)
    } else return this.c
  }
})
org.antlr.runtime.MismatchedTokenException = function (B, A) {
  if (arguments.length === 0)
    this.expecting = org.antlr.runtime.Token.INVALID_TOKEN_TYPE
  else {
    org.antlr.runtime.MismatchedTokenException.superclass.constructor.call(
      this,
      A
    )
    this.expecting = B
  }
}
org.antlr.lang.extend(
  org.antlr.runtime.MismatchedTokenException,
  org.antlr.runtime.RecognitionException,
  {
    toString: function () {
      return (
        'MismatchedTokenException(' +
        this.getUnexpectedType() +
        '!\x3d' +
        this.expecting +
        ')'
      )
    },
    name: 'org.antlr.runtime.MismatchedTokenException'
  }
)
org.antlr.runtime.UnwantedTokenException = function (B, A) {
  if (arguments.length > 0)
    org.antlr.runtime.UnwantedTokenException.superclass.constructor.call(
      this,
      B,
      A
    )
}
org.antlr.lang.extend(
  org.antlr.runtime.UnwantedTokenException,
  org.antlr.runtime.MismatchedTokenException,
  {
    getUnexpectedToken: function () {
      return this.token
    },
    toString: function () {
      let A = ', expected ' + this.expecting
      if (this.expecting === org.antlr.runtime.Token.INVALID_TOKEN_TYPE) A = ''
      if (!org.antlr.lang.isValue(this.token))
        return 'UnwantedTokenException(found\x3d' + A + ')'
      return 'UnwantedTokenException(found\x3d' + this.token.getText() + A + ')'
    },
    name: 'org.antlr.runtime.UnwantedTokenException'
  }
)
org.antlr.runtime.MissingTokenException = function (B, A, C) {
  if (arguments.length > 0) {
    org.antlr.runtime.MissingTokenException.superclass.constructor.call(
      this,
      B,
      A
    )
    this.inserted = C
  }
}
org.antlr.lang.extend(
  org.antlr.runtime.MissingTokenException,
  org.antlr.runtime.MismatchedTokenException,
  {
    getMissingType: function () {
      return this.expecting
    },
    toString: function () {
      if (
        org.antlr.lang.isValue(this.inserted) &&
        org.antlr.lang.isValue(this.token)
      )
        return (
          'MissingTokenException(inserted ' +
          this.inserted +
          ' at ' +
          this.token.getText() +
          ')'
        )
      if (org.antlr.lang.isValue(this.token))
        return 'MissingTokenException(at ' + this.token.getText() + ')'
      return 'MissingTokenException'
    },
    name: 'org.antlr.runtime.MissingTokenException'
  }
)
org.antlr.runtime.NoViableAltException = function (C, B, D, A) {
  org.antlr.runtime.NoViableAltException.superclass.constructor.call(this, A)
  this.grammarDecisionDescription = C
  this.decisionNumber = B
  this.stateNumber = D
}
org.antlr.lang.extend(
  org.antlr.runtime.NoViableAltException,
  org.antlr.runtime.RecognitionException,
  {
    toString: function () {
      if (this.input instanceof org.antlr.runtime.ANTLRStringStream)
        return (
          "NoViableAltException('" +
          this.getUnexpectedType() +
          "'@[" +
          this.grammarDecisionDescription +
          '])'
        )
      else
        return (
          'NoViableAltException(' +
          this.getUnexpectedType() +
          '@[' +
          this.grammarDecisionDescription +
          '])'
        )
    },
    name: 'org.antlr.runtime.NoViableAltException'
  }
)
org.antlr.runtime.EarlyExitException = function (B, A) {
  org.antlr.runtime.EarlyExitException.superclass.constructor.call(this, A)
  this.decisionNumber = B
}
org.antlr.lang.extend(
  org.antlr.runtime.EarlyExitException,
  org.antlr.runtime.RecognitionException,
  { name: 'org.antlr.runtime.EarlyExitException' }
)
org.antlr.runtime.MismatchedSetException = function (B, A) {
  org.antlr.runtime.MismatchedSetException.superclass.constructor.call(this, A)
  this.expecting = B
}
org.antlr.lang.extend(
  org.antlr.runtime.MismatchedSetException,
  org.antlr.runtime.RecognitionException,
  {
    toString: function () {
      return (
        'MismatchedSetException(' +
        this.getUnexpectedType() +
        '!\x3d' +
        this.expecting +
        ')'
      )
    },
    name: 'org.antlr.runtime.MismatchedSetException'
  }
)
org.antlr.runtime.MismatchedNotSetException = function (B, A) {
  org.antlr.runtime.MismatchedNotSetException.superclass.constructor.call(
    this,
    B,
    A
  )
}
org.antlr.lang.extend(
  org.antlr.runtime.MismatchedNotSetException,
  org.antlr.runtime.MismatchedSetException,
  {
    toString: function () {
      return (
        'MismatchedNotSetException(' +
        this.getUnexpectedType() +
        '!\x3d' +
        this.expecting +
        ')'
      )
    },
    name: 'org.antlr.runtime.MismatchedNotSetException'
  }
)
org.antlr.runtime.MismatchedRangeException = function (B, A, C) {
  if (arguments.length === 0) return this
  org.antlr.runtime.MismatchedRangeException.superclass.constructor.call(
    this,
    C
  )
  this.a = B
  this.b = A
}
org.antlr.lang.extend(
  org.antlr.runtime.MismatchedRangeException,
  org.antlr.runtime.RecognitionException,
  {
    toString: function () {
      return (
        'MismatchedRangeException(' +
        this.getUnexpectedType() +
        ' not in [' +
        this.a +
        ',' +
        this.b +
        '])'
      )
    },
    name: 'org.antlr.runtime.MismatchedRangeException'
  }
)
org.antlr.runtime.FailedPredicateException = function (A, C, B) {
  org.antlr.runtime.FailedPredicateException.superclass.constructor.call(
    this,
    A
  )
  this.ruleName = C
  this.predicateText = B
}
org.antlr.lang.extend(
  org.antlr.runtime.FailedPredicateException,
  org.antlr.runtime.RecognitionException,
  {
    toString: function () {
      return (
        'FailedPredicateException(' +
        this.ruleName +
        ',{' +
        this.predicateText +
        '}?)'
      )
    },
    name: 'org.antlr.runtime.FailedPredicateException'
  }
)
org.antlr.runtime.BitSet = function (A) {
  if (!A) A = org.antlr.runtime.BitSet.BITS
  if (org.antlr.lang.isArray(A)) this.bits = A
  else if (org.antlr.lang.isNumber(A)) this.bits = []
}
org.antlr.lang.augmentObject(org.antlr.runtime.BitSet, {
  BITS: 32,
  LOG_BITS: 5,
  MOD_MASK: 31,
  bitMask: function (B) {
    let A = B & org.antlr.runtime.BitSet.MOD_MASK
    return 1 << A
  },
  numWordsToHold: function (A) {
    return (A >> org.antlr.runtime.BitSet.LOG_BITS) + 1
  },
  wordNumber: function (A) {
    return A >> org.antlr.runtime.BitSet.LOG_BITS
  },
  of: function (D, A) {
    let B, F, C, E
    if (org.antlr.lang.isNumber(D))
      if (org.antlr.lang.isNumber(A)) {
        C = new org.antlr.runtime.BitSet(A + 1)
        for (B = D; B <= A; B++) {
          F = org.antlr.runtime.BitSet.wordNumber(B)
          C.bits[F] |= org.antlr.runtime.BitSet.bitMask(B)
        }
        return C
      } else {
        C = new org.antlr.runtime.BitSet(D + 1)
        C.add(D)
        return C
      }
    else if (org.antlr.lang.isArray(D)) {
      C = new org.antlr.runtime.BitSet()
      for (B = D.length - 1; B >= 0; B--) C.add(D[B])
      return C
    } else if (D instanceof org.antlr.runtime.BitSet) {
      if (!D) return null
      return D
    } else if (D instanceof org.antlr.runtime.IntervalSet) {
      if (!D) return null
      C = new org.antlr.runtime.BitSet()
      C.addAll(D)
      return C
    } else if (org.antlr.lang.isObject(D)) {
      E = []
      for (B in D) if (org.antlr.lang.isNumber(B)) E.push(B)
      return org.antlr.runtime.BitSet.of(E)
    }
  }
})
org.antlr.runtime.BitSet.prototype = {
  add: function (A) {
    let B = org.antlr.runtime.BitSet.wordNumber(A)
    if (B >= this.bits.length) this.growToInclude(A)
    this.bits[B] |= org.antlr.runtime.BitSet.bitMask(A)
  },
  addAll: function (C) {
    let A, B, D
    if (C instanceof org.antlr.runtime.BitSet) this.orInPlace(C)
    else if (C instanceof org.antlr.runtime.IntervalSet) A = C
    else if (org.antlr.lang.isArray(C))
      for (B = 0; B < C.length; B++) {
        D = C[B]
        this.add(D)
      }
    else return
  },
  and: function (A) {
    let B = this.clone()
    B.andInPlace(A)
    return B
  },
  andInPlace: function (A) {
    let C = Math.min(this.bits.length, A.bits.length),
      B
    for (B = C - 1; B >= 0; B--) this.bits[B] &= A.bits[B]
    for (B = C; B < this.bits.length; B++) this.bits[B] = 0
  },
  clear: function (B) {
    if (arguments.length === 0) {
      let A
      for (A = this.bits.length - 1; A >= 0; A--) this.bits[A] = 0
      return
    }
    let C = org.antlr.runtime.BitSet.wordNumber(B)
    if (C >= this.bits.length) this.growToInclude(B)
    this.bits[C] &= ~org.antlr.runtime.BitSet.bitMask(B)
  },
  clone: function () {
    let C,
      B,
      A = []
    for (C = 0, B = this.bits.length; C < B; C++) A[C] = this.bits[C]
    return new org.antlr.runtime.BitSet(A)
  },
  size: function () {
    let B = 0,
      A,
      C,
      D
    for (A = this.bits.length - 1; A >= 0; A--) {
      C = this.bits[A]
      if (C !== 0)
        for (D = org.antlr.runtime.BitSet.BITS - 1; D >= 0; D--)
          if ((C & (1 << D)) !== 0) B++
    }
    return B
  },
  equals: function (A) {
    if (!A || !(A instanceof org.antlr.runtime.BitSet)) return false
    let B = A,
      C,
      D = Math.min(this.bits.length, B.bits.length)
    for (C = 0; C < D; C++) if (this.bits[C] != B.bits[C]) return false
    if (this.bits.length > D)
      for (C = D + 1; C < this.bits.length; C++) {
        if (this.bits[C] !== 0) return false
      }
    else if (B.bits.length > D)
      for (C = D + 1; C < B.bits.length; C++) if (B.bits[C] !== 0) return false
    return true
  },
  growToInclude: function (D) {
    let A = Math.max(
        this.bits.length << 1,
        org.antlr.runtime.BitSet.numWordsToHold(D)
      ),
      C = [],
      B
    for (B = 0, len = this.bits.length; B < len; B++) C[B] = this.bits[B]
    this.bits = C
  },
  member: function (A) {
    let B = org.antlr.runtime.BitSet.wordNumber(A)
    if (B >= this.bits.length) return false
    return (this.bits[B] & org.antlr.runtime.BitSet.bitMask(A)) !== 0
  },
  getSingleElement: function () {
    let A
    for (A = 0; A < this.bits.length << org.antlr.runtime.BitSet.LOG_BITS; A++)
      if (this.member(A)) return A
    return -1
  },
  isNil: function () {
    let A
    for (A = this.bits.length - 1; A >= 0; A--)
      if (this.bits[A] !== 0) return false
    return true
  },
  complement: function (B) {
    if (B) return B.subtract(this)
    else {
      let A = this.clone()
      A.notInPlace()
      return A
    }
  },
  notInPlace: function () {
    let A, D, B, C
    if (arguments.length === 0)
      for (B = this.bits.length - 1; B >= 0; B--) this.bits[B] = ~this.bits[B]
    else {
      if (arguments.length === 1) {
        A = 0
        D = arguments[0]
      } else {
        A = arguments[0]
        D = arguments[1]
      }
      this.growToInclude(D)
      for (B = A; B <= D; B++) {
        C = org.antlr.runtime.BitSet.wordNumber(B)
        this.bits[C] ^= org.antlr.runtime.BitSet.bitMask(B)
      }
    }
  },
  or: function (A) {
    if (!A) return this
    let B = this.clone()
    B.orInPlace(A)
    return B
  },
  orInPlace: function (A) {
    if (!A) return
    if (A.bits.length > this.bits.length) this.setSize(A.bits.length)
    let C = Math.min(this.bits.length, A.bits.length),
      B
    for (B = C - 1; B >= 0; B--) this.bits[B] |= A.bits[B]
  },
  remove: function (A) {
    let B = org.antlr.runtime.BitSet.wordNumber(A)
    if (B >= this.bits.length) this.growToInclude(A)
    this.bits[B] &= ~org.antlr.runtime.BitSet.bitMask(A)
  },
  setSize: function (A) {
    let B = A - this.bits.length
    while (B >= 0) {
      this.bits.push(0)
      B--
    }
  },
  numBits: function () {
    return this.bits.length << org.antlr.runtime.BitSet.LOG_BITS
  },
  lengthInLongWords: function () {
    return this.bits.length
  },
  subset: function (A) {
    if (!A) return false
    return this.and(A).equals(this)
  },
  subtractInPlace: function (A) {
    if (!A) return
    let B
    for (B = 0; B < this.bits.length && B < A.bits.length; B++)
      this.bits[B] &= ~A.bits[B]
  },
  subtract: function (A) {
    if (!A || !(A instanceof org.antlr.runtime.BitSet)) return null
    let B = this.clone()
    B.subtractInPlace(A)
    return B
  },
  toArray: function () {
    let A = [],
      C,
      B = 0
    for (C = 0; C < this.bits.length << org.antlr.runtime.BitSet.LOG_BITS; C++)
      if (this.member(C)) A[B++] = C
    return A
  },
  toPackedArray: function () {
    return this.bits
  },
  toString: function () {
    if (arguments.length === 0) return this.toString1(null)
    else if (org.antlr.lang.isString(arguments[0]))
      if (!org.antlr.lang.isValue(arguments[1])) return this.toString1(null)
      else return this.toString2(arguments[0], arguments[1])
    else return this.toString1(arguments[0])
  },
  toString1: function (D) {
    let A = '{',
      E = ',',
      B,
      C = false
    for (B = 0; B < this.bits.length << org.antlr.runtime.BitSet.LOG_BITS; B++)
      if (this.member(B)) {
        if (B > 0 && C) A += E
        if (D) A += D.getTokenDisplayName(B)
        else A += B.toString()
        C = true
      }
    return A + '}'
  },
  toString2: function (C, B) {
    let D = '',
      A
    for (A = 0; A < this.bits.length << org.antlr.runtime.BitSet.LOG_BITS; A++)
      if (this.member(A)) {
        if (D.length > 0) D += C
        if (A >= B.size()) D += "'" + A + "'"
        else if (!org.antlr.lang.isValue(B.get(A))) D += "'" + A + "'"
        else D += B.get(A)
      }
    return D
  }
}
org.antlr.runtime.CharStream = { EOF: -1 }
org.antlr.runtime.CommonToken = function () {
  let A
  this.charPositionInLine = -1
  this.channel = 0
  this.index = -1
  if (arguments.length == 1)
    if (org.antlr.lang.isNumber(arguments[0])) this.type = arguments[0]
    else {
      A = arguments[0]
      this.text = A.getText()
      this.type = A.getType()
      this.line = A.getLine()
      this.index = A.getTokenIndex()
      this.charPositionInLine = A.getCharPositionInLine()
      this.channel = A.getChannel()
      if (A instanceof org.antlr.runtime.CommonToken) {
        this.start = A.start
        this.stop = A.stop
      }
    }
  else if (arguments.length == 2) {
    this.type = arguments[0]
    this.text = arguments[1]
    this.channel = 0
  } else if (arguments.length == 5) {
    this.input = arguments[0]
    this.type = arguments[1]
    this.channel = arguments[2]
    this.start = arguments[3]
    this.stop = arguments[4]
  }
}
org.antlr.runtime.CommonToken.prototype = {
  getType: function () {
    return this.type
  },
  setLine: function (A) {
    this.line = A
  },
  getText: function () {
    if (org.antlr.lang.isString(this.text)) return this.text
    if (!this.input) return null
    this.text = this.input.substring(this.start, this.stop)
    return this.text
  },
  setText: function (A) {
    this.text = A
  },
  getLine: function () {
    return this.line
  },
  getCharPositionInLine: function () {
    return this.charPositionInLine
  },
  setCharPositionInLine: function (A) {
    this.charPositionInLine = A
  },
  getChannel: function () {
    return this.channel
  },
  setChannel: function (A) {
    this.channel = A
  },
  setType: function (A) {
    this.type = A
  },
  getStartIndex: function () {
    return this.start
  },
  setStartIndex: function (A) {
    this.start = A
  },
  getStopIndex: function () {
    return this.stop
  },
  setStopIndex: function (A) {
    this.stop = A
  },
  getTokenIndex: function () {
    return this.index
  },
  setTokenIndex: function (A) {
    this.index = A
  },
  getInputStream: function () {
    return this.input
  },
  setInputStream: function (A) {
    this.input = A
  },
  toString: function () {
    let B = ''
    if (this.channel > 0) B = ',channel\x3d' + this.channel
    let A = this.getText()
    if (!org.antlr.lang.isNull(A)) {
      A = A.replace(/\n/g, '\\\\n')
      A = A.replace(/\r/g, '\\\\r')
      A = A.replace(/\t/g, '\\\\t')
    } else A = '\x3cno text\x3e'
    return (
      '[@' +
      this.getTokenIndex() +
      ',' +
      this.start +
      ':' +
      this.stop +
      "\x3d'" +
      A +
      "',\x3c" +
      this.type +
      '\x3e' +
      B +
      ',' +
      this.line +
      ':' +
      this.getCharPositionInLine() +
      ']'
    )
  }
}
org.antlr.runtime.Token = function () {}
org.antlr.lang.augmentObject(org.antlr.runtime.Token, {
  EOR_TOKEN_TYPE: 1,
  DOWN: 2,
  UP: 3,
  MIN_TOKEN_TYPE: 4,
  EOF: org.antlr.runtime.CharStream.EOF,
  EOF_TOKEN: new org.antlr.runtime.CommonToken(
    org.antlr.runtime.CharStream.EOF
  ),
  INVALID_TOKEN_TYPE: 0,
  INVALID_TOKEN: new org.antlr.runtime.CommonToken(0),
  SKIP_TOKEN: new org.antlr.runtime.CommonToken(0),
  DEFAULT_CHANNEL: 0,
  HIDDEN_CHANNEL: 99
})
org.antlr.lang.augmentObject(
  org.antlr.runtime.CommonToken,
  org.antlr.runtime.Token
)
org.antlr.runtime.tree.RewriteCardinalityException = function (A) {
  this.elementDescription = A
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.RewriteCardinalityException,
  Error,
  {
    getMessage: function () {
      if (org.antlr.lang.isString(this.elementDescription))
        return this.elementDescription
      return null
    },
    name: function () {
      return 'org.antlr.runtime.tree.RewriteCardinalityException'
    }
  }
)
org.antlr.runtime.tree.RewriteEmptyStreamException = function (B) {
  let A = org.antlr.runtime.tree.RewriteEmptyStreamException.superclass
  A.constructor.call(this, B)
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.RewriteEmptyStreamException,
  org.antlr.runtime.tree.RewriteCardinalityException,
  {
    name: function () {
      return 'org.antlr.runtime.tree.RewriteEmptyStreamException'
    }
  }
)
org.antlr.runtime.tree.RewriteEarlyExitException = function (B) {
  let A = org.antlr.runtime.tree.RewriteEarlyExitException.superclass
  if (org.antlr.lang.isUndefined(B)) B = null
  A.constructor.call(this, B)
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.RewriteEarlyExitException,
  org.antlr.runtime.tree.RewriteCardinalityException,
  {
    name: function () {
      return 'org.antlr.runtime.tree.RewriteEarlyExitException'
    }
  }
)
org.antlr.runtime.MismatchedTreeNodeException = function (B, A) {
  if (B && A) {
    org.antlr.runtime.MismatchedTreeNodeException.superclass.constructor.call(
      this,
      A
    )
    this.expecting = B
  }
}
org.antlr.lang.extend(
  org.antlr.runtime.MismatchedTreeNodeException,
  org.antlr.runtime.RecognitionException,
  {
    toString: function () {
      return (
        'MismatchedTreeNodeException(' +
        this.getUnexpectedType() +
        '!\x3d' +
        this.expecting +
        ')'
      )
    },
    name: 'org.antlr.runtime.MismatchedTreeNodeException'
  }
)
org.antlr.runtime.tree.BaseTree = function () {}
org.antlr.runtime.tree.BaseTree.prototype = {
  getChild: function (A) {
    if (!this.children || A >= this.children.length) return null
    return this.children[A]
  },
  getChildren: function () {
    return this.children
  },
  getFirstChildWithType: function (C) {
    let B, A
    for (B = 0; this.children && B < this.children.length; B++) {
      A = this.children[B]
      if (A.getType() === C) return A
    }
    return null
  },
  getChildCount: function () {
    if (!this.children) return 0
    return this.children.length
  },
  addChild: function (B) {
    if (!org.antlr.lang.isValue(B)) return
    let C = B,
      E,
      A,
      D
    if (C.isNil()) {
      if (this.children && this.children == C.children)
        throw new Error('attempt to add child list to itself')
      if (C.children)
        if (this.children) {
          E = C.children.length
          for (A = 0; A < E; A++) {
            D = C.children[A]
            this.children.push(D)
            D.setParent(this)
            D.setChildIndex(this.children.length - 1)
          }
        } else {
          this.children = C.children
          this.freshenParentAndChildIndexes()
        }
    } else {
      if (!this.children) this.children = this.createChildrenList()
      this.children.push(B)
      C.setParent(this)
      C.setChildIndex(this.children.length - 1)
    }
  },
  addChildren: function (A) {
    let C, B
    for (C = 0; C < A.length; C++) {
      B = A[C]
      this.addChild(B)
    }
  },
  setChild: function (B, A) {
    if (!A) return
    if (A.isNil()) throw new Error("Can't set single child to a list")
    if (!this.children) this.children = this.createChildrenList()
    this.children[B] = A
    A.setParent(this)
    A.setChildIndex(B)
  },
  deleteChild: function (B) {
    if (!this.children) return null
    if (B < 0 || B >= this.children.length)
      throw new Error('Index out of bounds.')
    let A = this.children.splice(B, 1)[0]
    this.freshenParentAndChildIndexes(B)
    return A
  },
  replaceChildren: function (H, I, P) {
    if (!this.children) throw new Error('indexes invalid; no children in list')
    let O = I - H + 1
    let A
    let K = P
    let D = null
    if (K.isNil()) D = K.children
    else {
      D = []
      D.push(K)
    }
    A = D.length
    let B = D.length
    let N = O - A
    let F, G, C, E, M, J, L
    if (N === 0) {
      F = 0
      for (G = H; G <= I; G++) {
        C = D[F]
        this.children[G] = C
        C.setParent(this)
        C.setChildIndex(G)
        F++
      }
    } else if (N > 0) {
      for (F = 0; F < B; F++) this.children[H + F] = D[F]
      E = H + B
      for (M = E; M <= I; M++) J = this.children.splice(E, 1)[0]
      this.freshenParentAndChildIndexes(H)
    } else {
      for (F = 0; F < O; F++) this.children[H + F] = D[F]
      L = A - O
      for (F = O; F < A; F++) this.children.splice(H + F, 0, D[F])
      this.freshenParentAndChildIndexes(H)
    }
  },
  createChildrenList: function () {
    return []
  },
  isNil: function () {
    return false
  },
  freshenParentAndChildIndexes: function (A) {
    if (!org.antlr.lang.isNumber(A)) A = 0
    let D = this.getChildCount(),
      C,
      B
    for (C = A; C < D; C++) {
      B = this.getChild(C)
      B.setChildIndex(C)
      B.setParent(this)
    }
  },
  sanityCheckParentAndChildIndexes: function (B, A) {
    if (arguments.length === 0) {
      B = null
      A = -1
    }
    if (B !== this.getParent())
      throw new Error(
        "parents don't match; expected " + B + ' found ' + this.getParent()
      )
    if (A !== this.getChildIndex())
      throw new Error(
        "child indexes don't match; expected " +
          A +
          ' found ' +
          this.getChildIndex()
      )
    let E = this.getChildCount(),
      D,
      C
    for (D = 0; D < E; D++) {
      C = this.getChild(D)
      C.sanityCheckParentAndChildIndexes(this, D)
    }
  },
  getChildIndex: function () {
    return 0
  },
  setChildIndex: function (A) {},
  getParent: function () {
    return null
  },
  setParent: function (A) {},
  getTree: function () {
    return this
  },
  toStringTree: function () {
    if (!this.children || this.children.length === 0) return this.toString()
    let A = '',
      C,
      B
    if (!this.isNil()) {
      A += '('
      A += this.toString()
      A += ' '
    }
    for (C = 0; this.children && C < this.children.length; C++) {
      B = this.children[C]
      if (C > 0) A += ' '
      A += B.toStringTree()
    }
    if (!this.isNil()) A += ')'
    return A
  },
  getLine: function () {
    return 0
  },
  getCharPositionInLine: function () {
    return 0
  }
}
org.antlr.runtime.tree.CommonTree = function (A) {
  this.startIndex = -1
  this.stopIndex = -1
  this.childIndex = -1
  this.parent = null
  this.token = null
  if (A instanceof org.antlr.runtime.tree.CommonTree) {
    org.antlr.runtime.tree.CommonTree.superclass.constructor.call(this, A)
    this.token = A.token
    this.startIndex = A.startIndex
    this.stopIndex = A.stopIndex
  } else if (A instanceof org.antlr.runtime.CommonToken) this.token = A
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.CommonTree,
  org.antlr.runtime.tree.BaseTree,
  {
    getToken: function () {
      return this.token
    },
    dupNode: function () {
      return new org.antlr.runtime.tree.CommonTree(this)
    },
    isNil: function () {
      return !this.token
    },
    getType: function () {
      if (!this.token) return org.antlr.runtime.Token.INVALID_TOKEN_TYPE
      return this.token.getType()
    },
    getText: function () {
      if (!this.token) return null
      return this.token.getText()
    },
    getLine: function () {
      if (!this.token || this.token.getLine() === 0) {
        if (this.getChildCount() > 0) return this.getChild(0).getLine()
        return 0
      }
      return this.token.getLine()
    },
    getCharPositionInLine: function () {
      if (!this.token || this.token.getCharPositionInLine() === -1) {
        if (this.getChildCount() > 0)
          return this.getChild(0).getCharPositionInLine()
        return 0
      }
      return this.token.getCharPositionInLine()
    },
    getTokenStartIndex: function () {
      if (this.token) return this.token.getTokenIndex()
      return this.startIndex
    },
    setTokenStartIndex: function (A) {
      this.startIndex = A
    },
    getTokenStopIndex: function () {
      if (this.token) return this.token.getTokenIndex()
      return this.stopIndex
    },
    setTokenStopIndex: function (A) {
      this.stopIndex = A
    },
    getChildIndex: function () {
      return this.childIndex
    },
    getParent: function () {
      return this.parent
    },
    setParent: function (A) {
      this.parent = A
    },
    setChildIndex: function (A) {
      this.childIndex = A
    },
    toString: function () {
      if (this.isNil()) return 'nil'
      if (this.getType() === org.antlr.runtime.Token.INVALID_TOKEN_TYPE)
        return '\x3cerrornode\x3e'
      if (!this.token) return null
      return this.token.getText()
    }
  }
)
org.antlr.runtime.tree.Tree = {
  INVALID_NODE: new org.antlr.runtime.tree.CommonTree(
    org.antlr.runtime.Token.INVALID_TOKEN
  )
}
org.antlr.runtime.tree.CommonErrorNode = function (A, D, B, C) {
  if (
    !B ||
    (B.getTokenIndex() < D.getTokenIndex() &&
      B.getType() != org.antlr.runtime.Token.EOF)
  )
    B = D
  this.input = A
  this.start = D
  this.stop = B
  this.trappedException = C
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.CommonErrorNode,
  org.antlr.runtime.tree.CommonTree,
  {
    isNil: function () {
      return false
    },
    getType: function () {
      return org.antlr.runtime.Token.INVALID_TOKEN_TYPE
    },
    getText: function () {
      let C = null
      if (this.start instanceof org.antlr.runtime.CommonToken) {
        let B = this.start.getTokenIndex()
        let A = this.stop.getTokenIndex()
        if (this.stop.getType() === org.antlr.runtime.Token.EOF)
          A = this.input.size()
        C = this.input.toString(B, A)
      } else if (this.start instanceof org.antlr.runtime.tree.CommonTree)
        C = this.input.toString(this.start, this.stop)
      else C = '\x3cunknown\x3e'
      return C
    },
    toString: function () {
      if (
        this.trappedException instanceof org.antlr.runtime.MissingTokenException
      )
        return (
          '\x3cmissing type: ' + this.trappedException.getMissingType() + '\x3e'
        )
      else if (
        this.trappedException instanceof
        org.antlr.runtime.UnwantedTokenException
      )
        return (
          '\x3cextraneous: ' +
          this.trappedException.getUnexpectedToken() +
          ', resync\x3d' +
          this.getText() +
          '\x3e'
        )
      else if (
        this.trappedException instanceof
        org.antlr.runtime.MismatchedTokenException
      )
        return (
          '\x3cmismatched token: ' +
          this.trappedException.token +
          ', resync\x3d' +
          this.getText() +
          '\x3e'
        )
      else if (
        this.trappedException instanceof org.antlr.runtime.NoViableAltException
      )
        return (
          '\x3cunexpected: ' +
          this.trappedException.token +
          ', resync\x3d' +
          this.getText() +
          '\x3e'
        )
      return '\x3cerror: ' + this.getText() + '\x3e'
    }
  }
)
org.antlr.runtime.tree.BaseTreeAdaptor = function () {
  this.uniqueNodeID = 1
}
org.antlr.runtime.tree.BaseTreeAdaptor.prototype = {
  nil: function () {
    return this.create(null)
  },
  errorNode: function (A, E, C, D) {
    let B = new org.antlr.runtime.tree.CommonErrorNode(A, E, C, D)
    return B
  },
  isNil: function (A) {
    return A.isNil()
  },
  dupTree: function (B, C) {
    if (arguments.length === 1) C = null
    if (!B) return null
    let D = this.dupNode(B)
    this.setChildIndex(D, this.getChildIndex(B))
    this.setParent(D, C)
    let G = this.getChildCount(B),
      A,
      F,
      E
    for (A = 0; A < G; A++) {
      F = this.getChild(B, A)
      E = this.dupTree(F, B)
      this.addChild(D, E)
    }
    return D
  },
  addChild: function (A, B) {
    if (A && org.antlr.lang.isValue(B)) A.addChild(B)
  },
  becomeRoot: function (D, C) {
    if (D instanceof org.antlr.runtime.CommonToken || !D) D = this.create(D)
    let A = D,
      B = C
    if (!C) return D
    if (A.isNil()) {
      if (A.getChildCount() > 1)
        throw new Error(
          'more than one node as root (TODO: make exception hierarchy)'
        )
      A = A.getChild(0)
    }
    A.addChild(B)
    return A
  },
  rulePostProcessing: function (A) {
    let B = A
    if (B && B.isNil())
      if (B.getChildCount() === 0) B = null
      else if (B.getChildCount() === 1) {
        B = B.getChild(0)
        B.setParent(null)
        B.setChildIndex(-1)
      }
    return B
  },
  create: function (C, B) {
    let D, A
    if (arguments.length === 2)
      if (org.antlr.lang.isString(arguments[1])) {
        D = arguments[1]
        B = this.createToken(C, D)
        A = this.create(B)
        return A
      } else {
        B = this.createToken(B)
        B.setType(C)
        A = this.create(B)
        return A
      }
    else if (arguments.length === 3) {
      D = arguments[2]
      B = this.createToken(B)
      B.setType(C)
      B.setText(D)
      A = this.create(B)
      return A
    }
  },
  getType: function (A) {
    A.getType()
    return 0
  },
  setType: function (A, B) {
    throw new Error("don't know enough about Tree node")
  },
  getText: function (A) {
    return A.getText()
  },
  setText: function (A, B) {
    throw new Error("don't know enough about Tree node")
  },
  getChild: function (B, A) {
    return B.getChild(A)
  },
  setChild: function (B, A, C) {
    B.setChild(A, C)
  },
  deleteChild: function (B, A) {
    return B.deleteChild(A)
  },
  getChildCount: function (A) {
    return A.getChildCount()
  },
  getUniqueID: function (B) {
    if (!this.treeToUniqueIDMap) this.treeToUniqueIDMap = {}
    let C = this.treeToUniqueIDMap[B]
    if (org.antlr.lang.isValue(C)) return C
    let A = this.uniqueNodeID
    this.treeToUniqueIDMap[B] = A
    this.uniqueNodeID++
    return A
  }
}
org.antlr.runtime.tree.CommonTreeAdaptor = function () {}
org.antlr.lang.extend(
  org.antlr.runtime.tree.CommonTreeAdaptor,
  org.antlr.runtime.tree.BaseTreeAdaptor,
  {
    dupNode: function (A) {
      if (!org.antlr.lang.isValue(A)) return null
      return A.dupNode()
    },
    create: function (A) {
      if (arguments.length > 1)
        return org.antlr.runtime.tree.CommonTreeAdaptor.superclass.create.apply(
          this,
          arguments
        )
      return new org.antlr.runtime.tree.CommonTree(A)
    },
    createToken: function (A) {
      if (arguments.length === 2)
        return new org.antlr.runtime.CommonToken(arguments[0], arguments[1])
      else return new org.antlr.runtime.CommonToken(arguments[0])
    },
    setTokenBoundaries: function (C, E, A) {
      if (!org.antlr.lang.isValue(C)) return
      let D = 0,
        B = 0
      if (org.antlr.lang.isValue(E))
        if (E.getTokenIndex) D = E.getTokenIndex()
        else if (E.getStartIndex) D = E.getStartIndex()
        else D = E.getTokenStartIndex()
      if (org.antlr.lang.isValue(A))
        if (B.getTokenIndex) B = A.getTokenIndex()
        else if (A.getStopIndex) B = A.getStopIndex()
        else B = A.getTokenStopIndex()
      C.setTokenStartIndex(D)
      C.setTokenStopIndex(B)
    },
    getTokenStartIndex: function (A) {
      if (!A) return -1
      return A.getTokenStartIndex()
    },
    getTokenStopIndex: function (A) {
      if (!A) return -1
      return A.getTokenStopIndex()
    },
    getText: function (A) {
      if (!A) return null
      return A.getText()
    },
    getType: function (A) {
      if (!A) return org.antlr.runtime.Token.INVALID_TOKEN_TYPE
      return A.getType()
    },
    getToken: function (A) {
      if (A instanceof org.antlr.runtime.tree.CommonTree) return A.getToken()
      return null
    },
    getChild: function (B, A) {
      if (!B) return null
      return B.getChild(A)
    },
    getChildCount: function (A) {
      if (!A) return 0
      return A.getChildCount()
    },
    getParent: function (A) {
      return A.getParent()
    },
    setParent: function (A, B) {
      A.setParent(B)
    },
    getChildIndex: function (A) {
      return A.getChildIndex()
    },
    setChildIndex: function (B, A) {
      B.setChildIndex(A)
    },
    replaceChildren: function (D, B, A, C) {
      if (D) D.replaceChildren(B, A, C)
    }
  }
)
org.antlr.runtime.ANTLRStringStream = function (A) {
  this.p = 0
  this.line = 1
  this.charPositionInLine = 0
  this.markDepth = 0
  this.markers = null
  this.lastMarker = null
  this.data = A
  this.n = A.length
}
org.antlr.runtime.ANTLRStringStream.prototype = {
  reset: function () {
    this.p = 0
    this.line = 1
    this.charPositionInLine = 0
    this.markDepth = 0
  },
  consume: function () {
    if (this.p < this.n) {
      this.charPositionInLine++
      if (this.data.charAt(this.p) === '\n') {
        this.line++
        this.charPositionInLine = 0
      }
      this.p++
    }
  },
  LA: function (B) {
    if (B < 0) B++
    let A = this.p + B - 1
    if (A >= this.n || A < 0) return org.antlr.runtime.CharStream.EOF
    return this.data.charAt(A)
  },
  index: function () {
    return this.p
  },
  size: function () {
    return this.n
  },
  mark: function () {
    if (!this.markers) {
      this.markers = []
      this.markers.push(null)
    }
    this.markDepth++
    let A = null
    if (this.markDepth >= this.markers.length) {
      A = {}
      this.markers.push(A)
    } else A = this.markers[this.markDepth]
    A.p = this.p
    A.line = this.line
    A.charPositionInLine = this.charPositionInLine
    this.lastMarker = this.markDepth
    return this.markDepth
  },
  rewind: function (A) {
    if (!org.antlr.lang.isNumber(A)) A = this.lastMarker
    let B = this.markers[A]
    this.seek(B.p)
    this.line = B.line
    this.charPositionInLine = B.charPositionInLine
    this.release(A)
  },
  release: function (A) {
    this.markDepth = A
    this.markDepth--
  },
  seek: function (A) {
    if (A <= this.p) {
      this.p = A
      return
    }
    while (this.p < A) this.consume()
  },
  substring: function (B, A) {
    return this.data.substr(B, A - B + 1)
  },
  getLine: function () {
    return this.line
  },
  getCharPositionInLine: function () {
    return this.charPositionInLine
  },
  setLine: function (A) {
    this.line = A
  },
  setCharPositionInLine: function (A) {
    this.charPositionInLine = A
  },
  getSourceName: function () {
    return null
  }
}
org.antlr.runtime.ANTLRStringStream.LT = org.antlr.runtime.ANTLRStringStream.LA
org.antlr.runtime.CommonTokenStream = function (A, B) {
  this.p = -1
  this.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL
  this.v_discardOffChannelTokens = false
  this.tokens = []
  if (arguments.length >= 2) this.channel = B
  else if (arguments.length === 1) this.tokenSource = A
}
org.antlr.runtime.CommonTokenStream.prototype = {
  setTokenSource: function (A) {
    this.tokenSource = A
    this.tokens = []
    this.p = -1
    this.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL
  },
  fillBuffer: function () {
    let B = 0,
      C = this.tokenSource.nextToken(),
      A,
      D
    while (
      org.antlr.lang.isValue(C) &&
      C.getType() != org.antlr.runtime.CharStream.EOF
    ) {
      A = false
      if (this.channelOverrideMap) {
        D = this.channelOverrideMap[C.getType()]
        if (org.antlr.lang.isValue(D)) C.setChannel(D)
      }
      if (this.discardSet && this.discardSet[C.getType()]) A = true
      else if (this.v_discardOffChannelTokens && C.getChannel() != this.channel)
        A = true
      if (!A) {
        C.setTokenIndex(B)
        this.tokens.push(C)
        B++
      }
      C = this.tokenSource.nextToken()
    }
    this.p = 0
    this.p = this.skipOffTokenChannels(this.p)
  },
  consume: function () {
    if (this.p < this.tokens.length) {
      this.p++
      this.p = this.skipOffTokenChannels(this.p)
    }
  },
  skipOffTokenChannels: function (A) {
    let B = this.tokens.length
    while (A < B && this.tokens[A].getChannel() != this.channel) A++
    return A
  },
  skipOffTokenChannelsReverse: function (A) {
    while (A >= 0 && this.tokens[A].getChannel() != this.channel) A--
    return A
  },
  setTokenTypeChannel: function (B, A) {
    if (!this.channelOverrideMap) this.channelOverrideMap = {}
    this.channelOverrideMap[B] = A
  },
  discardTokenType: function (A) {
    if (!this.discardSet) this.discardSet = {}
    this.discardSet[A] = true
  },
  discardOffChannelTokens: function (A) {
    this.v_discardOffChannelTokens = A
  },
  getTokens: function (F, D, C) {
    if (this.p === -1) this.fillBuffer()
    if (arguments.length === 0) return this.tokens
    if (org.antlr.lang.isArray(C)) C = new org.antlr.runtime.BitSet(C)
    else if (org.antlr.lang.isNumber(C)) C = org.antlr.runtime.BitSet.of(C)
    if (D >= this.tokens.length) D = this.tokens.length - 1
    if (F < 0) F = 0
    if (F > D) return null
    let E = [],
      B,
      A
    for (B = F; B <= D; B++) {
      A = this.tokens[B]
      if (!this.types || C.member(A.getType())) E.push(A)
    }
    if (E.length === 0) E = null
    return E
  },
  LT: function (A) {
    if (this.p === -1) this.fillBuffer()
    if (A === 0) return null
    if (A < 0) return this.LB(-1 * A)
    if (this.p + A - 1 >= this.tokens.length)
      return org.antlr.runtime.Token.EOF_TOKEN
    let B = this.p,
      C = 1
    while (C < A) {
      B = this.skipOffTokenChannels(B + 1)
      C++
    }
    if (B >= this.tokens.length) return org.antlr.runtime.Token.EOF_TOKEN
    return this.tokens[B]
  },
  LB: function (A) {
    if (this.p === -1) this.fillBuffer()
    if (A === 0) return null
    if (this.p - A < 0) return null
    let B = this.p,
      C = 1
    while (C <= A) {
      B = this.skipOffTokenChannelsReverse(B - 1)
      C++
    }
    if (B < 0) return null
    return this.tokens[B]
  },
  get: function (A) {
    return this.tokens[A]
  },
  LA: function (A) {
    return this.LT(A).getType()
  },
  mark: function () {
    if (this.p === -1) this.fillBuffer()
    this.lastMarker = this.index()
    return this.lastMarker
  },
  release: function (A) {},
  size: function () {
    return this.tokens.length
  },
  index: function () {
    return this.p
  },
  rewind: function (A) {
    if (!org.antlr.lang.isNumber(A)) A = this.lastMarker
    this.seek(A)
  },
  reset: function () {
    this.p = -1
    this.lastMarker = 0
  },
  seek: function (A) {
    this.p = A
  },
  getTokenSource: function () {
    return this.tokenSource
  },
  getSourceName: function () {
    return this.getTokenSource().getSourceName()
  },
  toString: function (D, C) {
    if (arguments.length === 0) {
      if (this.p === -1) this.fillBuffer()
      D = 0
      C = this.tokens.length - 1
    }
    if (!org.antlr.lang.isNumber(D) && !org.antlr.lang.isNumber(C))
      if (org.antlr.lang.isValue(D) && org.antlr.lang.isValue(C)) {
        D = D.getTokenIndex()
        C = C.getTokenIndex()
      } else return null
    let A = '',
      B
    if (D < 0 || C < 0) return null
    if (this.p == -1) this.fillBuffer()
    if (C >= this.tokens.length) C = this.tokens.length - 1
    for (B = D; B <= C; B++) {
      t = this.tokens[B]
      A = A + this.tokens[B].getText()
    }
    return A
  }
}
org.antlr.runtime.TokenRewriteStream = function () {
  let A = org.antlr.runtime.TokenRewriteStream.superclass
  this.programs = null
  this.lastRewriteTokenIndexes = null
  if (arguments.length === 0) this.init()
  else {
    A.constructor.apply(this, arguments)
    this.init()
  }
}
;(function () {
  let A = org.antlr.runtime.TokenRewriteStream
  org.antlr.lang.augmentObject(A, {
    DEFAULT_PROGRAM_NAME: 'default',
    PROGRAM_INIT_SIZE: 100,
    MIN_TOKEN_INDEX: 0
  })
  A.RewriteOperation = function (B, C) {
    this.index = B
    this.text = C
  }
  A.RewriteOperation.prototype = {
    execute: function (B) {
      return this.index
    },
    toString: function () {
      return this.text
    }
  }
  A.InsertBeforeOp = function (B, C) {
    A.InsertBeforeOp.superclass.constructor.call(this, B, C)
  }
  org.antlr.lang.extend(A.InsertBeforeOp, A.RewriteOperation, {
    execute: function (B) {
      B.push(this.text)
      return this.index
    }
  })
  A.ReplaceOp = function (D, C, B) {
    A.ReplaceOp.superclass.constructor.call(this, D, B)
    this.lastIndex = C
  }
  org.antlr.lang.extend(A.ReplaceOp, A.RewriteOperation, {
    execute: function (B) {
      if (org.antlr.lang.isValue(this.text)) B.push(this.text)
      return this.lastIndex + 1
    }
  })
  A.DeleteOp = function (C, B) {
    A.DeleteOp.superclass.constructor.call(this, C, B)
  }
  org.antlr.lang.extend(A.DeleteOp, A.ReplaceOp)
  org.antlr.lang.extend(A, org.antlr.runtime.CommonTokenStream, {
    init: function () {
      this.programs = {}
      this.programs[A.DEFAULT_PROGRAM_NAME] = []
      this.lastRewriteTokenIndexes = {}
    },
    rollback: function () {
      let B, C
      if (arguments.length === 1) {
        B = A.DEFAULT_PROGRAM_NAME
        C = arguments[0]
      } else if (arguments.length === 2) {
        B = arguments[0]
        C = arguments[1]
      }
      let D = this.programs[B]
      if (D) programs[B] = D.slice(A.MIN_TOKEN_INDEX, this.instructionIndex)
    },
    deleteProgram: function (B) {
      B = B || A.DEFAULT_PROGRAM_NAME
      this.rollback(B, A.MIN_TOKEN_INDEX)
    },
    addToSortedRewriteList: function () {
      let H, E
      if (arguments.length === 1) {
        H = A.DEFAULT_PROGRAM_NAME
        E = arguments[0]
      } else if (arguments.length === 2) {
        H = arguments[0]
        E = arguments[1]
      }
      let F = this.getProgram(H)
      let G, I, D, J, B, C
      for (I = 0, G = F.length; I < G; I++) {
        D = F[I]
        if (D.index === E.index) {
          if (E instanceof A.ReplaceOp) {
            J = false
            for (C = I; C < F.length; C++) {
              B = F[I]
              if (B.index !== E.index) break
              if (B instanceof A.ReplaceOp) {
                F[I] = E
                J = true
                break
              }
            }
            if (!J) F.splice(C, 0, E)
          } else F.splice(I, 0, E)
          break
        } else if (D.index > E.index) {
          F.splice(I, 0, E)
          break
        }
      }
      if (I === G) F.push(E)
    },
    insertAfter: function () {
      let C, B, D
      if (arguments.length === 2) {
        B = A.DEFAULT_PROGRAM_NAME
        C = arguments[0]
        D = arguments[1]
      } else if (arguments.length === 3) {
        B = arguments[0]
        C = arguments[1]
        D = arguments[2]
      }
      if (C instanceof org.antlr.runtime.CommonToken) C = C.index
      this.insertBefore(B, C + 1, D)
    },
    insertBefore: function () {
      let C, B, D
      if (arguments.length === 2) {
        B = A.DEFAULT_PROGRAM_NAME
        C = arguments[0]
        D = arguments[1]
      } else if (arguments.length === 3) {
        B = arguments[0]
        C = arguments[1]
        D = arguments[2]
      }
      if (C instanceof org.antlr.runtime.CommonToken) C = C.index
      this.addToSortedRewriteList(B, new A.InsertBeforeOp(C, D))
    },
    replace: function () {
      let B, E, C, D
      if (arguments.length === 2) {
        B = A.DEFAULT_PROGRAM_NAME
        E = arguments[0]
        C = arguments[0]
        D = arguments[1]
      } else if (arguments.length === 3) {
        B = A.DEFAULT_PROGRAM_NAME
        E = arguments[0]
        C = arguments[1]
        D = arguments[2]
      }
      if (arguments.length === 4) {
        B = arguments[0]
        E = arguments[1]
        C = arguments[2]
        D = arguments[3]
      }
      if (E instanceof org.antlr.runtime.CommonToken) E = E.index
      if (C instanceof org.antlr.runtime.CommonToken) C = C.index
      if (E > C || C < 0 || E < 0) return
      this.addToSortedRewriteList(B, new A.ReplaceOp(E, C, D))
    },
    remove: function () {
      let B = [],
        C = arguments.length - 1
      while (C >= 0) {
        B[C] = arguments[C]
        C--
      }
      B.push('')
      this.replace.apply(this, B)
    },
    getLastRewriteTokenIndex: function (B) {
      B = B || A.DEFAULT_PROGRAM_NAME
      return this.lastRewriteTokenIndexes[B] || -1
    },
    setLastRewriteTokenIndex: function (B, C) {
      this.lastRewriteTokenIndexes[B] = C
    },
    getProgram: function (B) {
      let C = this.programs[B]
      if (!C) C = this.initializeProgram(B)
      return C
    },
    initializeProgram: function (B) {
      let C = []
      this.programs[B] = C
      return C
    },
    toOriginalString: function (E, B) {
      if (!org.antlr.lang.isNumber(E)) E = A.MIN_TOKEN_INDEX
      if (!org.antlr.lang.isNumber(B)) B = this.size() - 1
      let C = [],
        D
      for (
        D = E;
        D >= A.MIN_TOKEN_INDEX && D <= B && D < this.tokens.length;
        D++
      )
        C.push(this.get(D).getText())
      return C.join('')
    },
    toString: function () {
      let J, B, F
      if (arguments.length === 0) {
        J = A.DEFAULT_PROGRAM_NAME
        B = A.MIN_TOKEN_INDEX
        F = this.size() - 1
      } else if (arguments.length === 1) {
        J = arguments[0]
        B = A.MIN_TOKEN_INDEX
        F = this.size() - 1
      } else if (arguments.length === 2) {
        J = A.DEFAULT_PROGRAM_NAME
        B = arguments[0]
        F = arguments[1]
      }
      let H = this.programs[J]
      if (!H || H.length === 0) return this.toOriginalString(B, F)
      let E = 0,
        D = B,
        C = [],
        G
      while (D >= A.MIN_TOKEN_INDEX && D <= F && D < this.tokens.length) {
        if (E < H.length) {
          G = H[E]
          while (G.index < D && E < H.length) {
            E++
            if (E < H.length) G = H[E]
          }
          while (D === G.index && E < H.length) {
            D = G.execute(C)
            E++
            if (E < H.length) G = H[E]
          }
        }
        if (D <= F) {
          C.push(this.get(D).getText())
          D++
        }
      }
      let I
      for (I = E; I < H.length; I++) {
        G = H[I]
        if (G.index >= this.size()) G.execute(C)
      }
      return C.join('')
    },
    toDebugString: function (E, B) {
      if (!org.antlr.lang.isNumber(E)) E = A.MIN_TOKEN_INDEX
      if (!org.antlr.lang.isNumber(B)) B = this.size() - 1
      let C = [],
        D
      for (
        D = E;
        D >= A.MIN_TOKEN_INDEX && D <= B && D < this.tokens.length;
        D++
      )
        C.push(this.get(D))
      return C.join('')
    }
  })
})()
org.antlr.runtime.tree.TreeNodeStream = function () {}
org.antlr.runtime.tree.CommonTreeNodeStream = function (D, A, B) {
  if (arguments.length === 1) {
    A = D
    D = new org.antlr.runtime.tree.CommonTreeAdaptor()
  }
  if (arguments.length <= 2)
    B = org.antlr.runtime.tree.CommonTreeNodeStream.DEFAULT_INITIAL_BUFFER_SIZE
  this.uniqueNavigationNodes = false
  this.p = -1
  let C = org.antlr.runtime.Token
  this.root = A
  this.adaptor = D
  this.nodes = []
  this.down = this.adaptor.create(C.DOWN, 'DOWN')
  this.up = this.adaptor.create(C.UP, 'UP')
  this.eof = this.adaptor.create(C.EOF, 'EOF')
}
org.antlr.lang.augmentObject(org.antlr.runtime.tree.CommonTreeNodeStream, {
  DEFAULT_INITIAL_BUFFER_SIZE: 100,
  INITIAL_CALL_STACK_SIZE: 10
})
org.antlr.lang.extend(
  org.antlr.runtime.tree.CommonTreeNodeStream,
  org.antlr.runtime.tree.TreeNodeStream,
  {
    StreamIterator: function () {
      let C = 0,
        B = this.nodes,
        A = this.eof
      return {
        hasNext: function () {
          return C < B.length
        },
        next: function () {
          var D = C
          C++
          if (D < B.length) return B[D]
          return A
        },
        remove: function () {
          throw new Error('cannot remove nodes from stream')
        }
      }
    },
    fillBuffer: function (C) {
      let B = false
      if (org.antlr.lang.isUndefined(C)) {
        C = this.root
        B = true
      }
      let A = this.adaptor.isNil(C)
      if (!A) this.nodes.push(C)
      let F = this.adaptor.getChildCount(C)
      if (!A && F > 0) this.addNavigationNode(org.antlr.runtime.Token.DOWN)
      let E, D
      for (E = 0; E < F; E++) {
        D = this.adaptor.getChild(C, E)
        this.fillBuffer(D)
      }
      if (!A && F > 0) this.addNavigationNode(org.antlr.runtime.Token.UP)
      if (B) this.p = 0
    },
    getNodeIndex: function (C) {
      if (this.p == -1) this.fillBuffer()
      let B, A
      for (B = 0; B < this.nodes.length; B++) {
        A = this.nodes[B]
        if (A === C) return B
      }
      return -1
    },
    addNavigationNode: function (B) {
      let A = null
      if (B === org.antlr.runtime.Token.DOWN)
        if (this.hasUniqueNavigationNodes())
          A = this.adaptor.create(org.antlr.runtime.Token.DOWN, 'DOWN')
        else A = this.down
      else if (this.hasUniqueNavigationNodes())
        A = this.adaptor.create(org.antlr.runtime.Token.UP, 'UP')
      else A = this.up
      this.nodes.push(A)
    },
    get: function (A) {
      if (this.p === -1) this.fillBuffer()
      return this.nodes[A]
    },
    LT: function (A) {
      if (this.p === -1) this.fillBuffer()
      if (A === 0) return null
      if (A < 0) return this.LB(-1 * A)
      if (this.p + A - 1 >= this.nodes.length) return this.eof
      return this.nodes[this.p + A - 1]
    },
    getCurrentSymbol: function () {
      return this.LT(1)
    },
    LB: function (A) {
      if (A === 0) return null
      if (this.p - A < 0) return null
      return this.nodes[this.p - A]
    },
    getTreeSource: function () {
      return this.root
    },
    getSourceName: function () {
      return this.getTokenStream().getSourceName()
    },
    getTokenStream: function () {
      return this.tokens
    },
    setTokenStream: function (A) {
      this.tokens = A
    },
    getTreeAdaptor: function () {
      return this.adaptor
    },
    setTreeAdaptor: function (A) {
      this.adaptor = A
    },
    hasUniqueNavigationNodes: function () {
      return this.uniqueNavigationNodes
    },
    setUniqueNavigationNodes: function (A) {
      this.uniqueNavigationNodes = A
    },
    consume: function () {
      if (this.p === -1) this.fillBuffer()
      this.p++
    },
    LA: function (A) {
      return this.adaptor.getType(this.LT(A))
    },
    mark: function () {
      if (this.p === -1) this.fillBuffer()
      this.lastMarker = this.index()
      return this.lastMarker
    },
    release: function (A) {},
    index: function () {
      return this.p
    },
    rewind: function (A) {
      if (!org.antlr.lang.isNumber(A)) A = this.lastMarker
      this.seek(A)
    },
    seek: function (A) {
      if (this.p === -1) this.fillBuffer()
      this.p = A
    },
    push: function (A) {
      if (!this.calls) this.calls = []
      this.calls.push(this.p)
      this.seek(A)
    },
    pop: function () {
      let A = this.calls.pop()
      this.seek(A)
      return A
    },
    reset: function () {
      this.p = -1
      this.lastMarker = 0
      if (this.calls) this.calls = []
    },
    size: function () {
      if (this.p === -1) this.fillBuffer()
      return this.nodes.length
    },
    iterator: function () {
      if (this.p === -1) this.fillBuffer()
      return this.StreamIterator()
    },
    replaceChildren: function (D, B, A, C) {
      if (D) this.adaptor.replaceChildren(D, B, A, C)
    },
    toTokenString: function (E, D) {
      if (this.p === -1) this.fillBuffer()
      let A = '',
        C,
        B
      for (C = E; C < this.nodes.length && C <= D; C++) {
        B = this.nodes[C]
        A += ' ' + this.adaptor.getToken(B)
      }
      return A
    },
    toString: function (H, D) {
      let A = '',
        E,
        C,
        B
      if (arguments.length === 0) {
        if (this.p === -1) this.fillBuffer()
        for (B = 0; B < this.nodes.length; B++) {
          C = this.nodes[B]
          A += ' '
          A += this.adaptor.getType(C)
        }
        return A
      } else {
        if (!org.antlr.lang.isNumber(H) || !org.antlr.lang.isNumber(D))
          return null
        if (this.p === -1) this.fillBuffer()
        if (H instanceof org.antlr.runtime.tree.CommonTree);
        else;
        if (D instanceof org.antlr.runtime.tree.CommonTree);
        else;
        let G, F
        if (this.tokens) {
          G = this.adaptor.getTokenStartIndex(H)
          F = this.adaptor.getTokenStopIndex(D)
          if (this.adaptor.getType(D) === org.antlr.runtime.Token.UP)
            F = this.adaptor.getTokenStopIndex(H)
          else if (this.adaptor.getType(D) == org.antlr.runtime.Token.EOF)
            F = this.size() - 2
          return this.tokens.toString(G, F)
        }
        C = null
        B = 0
        for (; B < this.nodes.length; B++) {
          C = this.nodes[B]
          if (C === H) break
        }
        A = E = ''
        C = this.nodes[B]
        while (C !== D) {
          E = this.adaptor.getText(C)
          if (!org.antlr.lang.isString(E))
            E = ' ' + this.adaptor.getType(C).toString()
          A += E
          B++
          C = nodes[B]
        }
        E = this.adaptor.getText(D)
        if (!org.antlr.lang.isString(E))
          E = ' ' + this.adaptor.getType(D).toString()
        A += E
        return A
      }
    }
  }
)
org.antlr.runtime.tree.RewriteRuleElementStream = function (C, B, A) {
  this.cursor = 0
  this.dirty = false
  this.elementDescription = B
  this.adaptor = C
  if (A)
    if (org.antlr.lang.isArray(A)) {
      this.singleElement = null
      this.elements = A
    } else this.add(A)
}
org.antlr.runtime.tree.RewriteRuleElementStream.prototype = {
  reset: function () {
    this.cursor = 0
    this.dirty = true
  },
  add: function (A) {
    if (!org.antlr.lang.isValue(A)) return
    if (this.elements) {
      this.elements.push(A)
      return
    }
    if (!org.antlr.lang.isValue(this.singleElement)) {
      this.singleElement = A
      return
    }
    this.elements = []
    this.elements.push(this.singleElement)
    this.singleElement = null
    this.elements.push(A)
  },
  nextTree: function () {
    let B = this.size(),
      A
    if (this.dirty || (this.cursor >= B && B == 1)) {
      A = this._next()
      return this.dup(A)
    }
    A = this._next()
    return A
  },
  _next: function () {
    let B = this.size()
    if (B === 0)
      throw new org.antlr.runtime.tree.RewriteEmptyStreamException(
        this.elementDescription
      )
    if (this.cursor >= B) {
      if (B === 1) return this.toTree(this.singleElement)
      throw new org.antlr.runtime.tree.RewriteCardinalityException(
        this.elementDescription
      )
    }
    if (org.antlr.lang.isValue(this.singleElement)) {
      this.cursor++
      return this.toTree(this.singleElement)
    }
    let A = this.toTree(this.elements[this.cursor])
    this.cursor++
    return A
  },
  toTree: function (A) {
    if (A && A.getTree) return A.getTree()
    return A
  },
  hasNext: function () {
    return (
      (org.antlr.lang.isValue(this.singleElement) && this.cursor < 1) ||
      (this.elements && this.cursor < this.elements.length)
    )
  },
  size: function () {
    let A = 0
    if (org.antlr.lang.isValue(this.singleElement)) A = 1
    if (this.elements) return this.elements.length
    return A
  },
  getDescription: function () {
    return this.elementDescription
  }
}
org.antlr.runtime.tree.RewriteRuleNodeStream = function (C, B, A) {
  org.antlr.runtime.tree.RewriteRuleNodeStream.superclass.constructor.apply(
    this,
    arguments
  )
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.RewriteRuleNodeStream,
  org.antlr.runtime.tree.RewriteRuleElementStream,
  {
    nextNode: function () {
      return this._next()
    },
    toTree: function (A) {
      return this.adaptor.dupNode(A)
    },
    dup: function () {
      throw new Error("dup can't be called for a node stream.")
    }
  }
)
org.antlr.runtime.tree.RewriteRuleTokenStream = function (D, C, B) {
  let A = org.antlr.runtime.tree.RewriteRuleTokenStream.superclass
  A.constructor.apply(this, arguments)
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.RewriteRuleTokenStream,
  org.antlr.runtime.tree.RewriteRuleElementStream,
  {
    nextNode: function () {
      let A = this._next()
      return this.adaptor.create(A)
    },
    nextToken: function () {
      return this._next()
    },
    toTree: function (A) {
      return A
    },
    dup: function (A) {
      throw new Error("dup can't be called for a token stream.")
    }
  }
)
org.antlr.runtime.tree.RewriteRuleSubtreeStream = function () {
  let A = org.antlr.runtime.tree.RewriteRuleSubtreeStream.superclass
  A.constructor.apply(this, arguments)
}
org.antlr.lang.extend(
  org.antlr.runtime.tree.RewriteRuleSubtreeStream,
  org.antlr.runtime.tree.RewriteRuleElementStream,
  {
    nextNode: function () {
      let B = this.size(),
        A
      if (this.dirty || (this.cursor >= B && B === 1)) {
        A = this._next()
        return this.adaptor.dupNode(A)
      }
      A = this._next()
      return A
    },
    dup: function (A) {
      return this.adaptor.dupTree(A)
    }
  }
)
org.antlr.runtime.BaseRecognizer = function (A) {
  this.state = A || new org.antlr.runtime.RecognizerSharedState()
}
org.antlr.lang.augmentObject(org.antlr.runtime.BaseRecognizer, {
  MEMO_RULE_FAILED: -2,
  MEMO_RULE_UNKNOWN: -1,
  INITIAL_FOLLOW_STACK_SIZE: 100,
  MEMO_RULE_FAILED_I: -2,
  DEFAULT_TOKEN_CHANNEL: org.antlr.runtime.Token.DEFAULT_CHANNEL,
  HIDDEN: org.antlr.runtime.Token.HIDDEN_CHANNEL,
  NEXT_TOKEN_RULE_NAME: 'nextToken'
})
org.antlr.runtime.BaseRecognizer.prototype = {
  reset: function () {
    let B, A
    if (!this.state) return
    this.state._fsp = -1
    this.state.errorRecovery = false
    this.state.lastErrorIndex = -1
    this.state.failed = false
    this.state.syntaxErrors = 0
    this.state.backtracking = 0
    if (this.state.ruleMemo)
      for (B = 0, A = this.state.ruleMemo.length; B < A; B++)
        this.state.ruleMemo[B] = null
  },
  match: function (B, D, A) {
    let C = this.getCurrentInputSymbol(B)
    if (B.LA(1) === D) {
      B.consume()
      this.state.errorRecovery = false
      this.state.failed = false
      return C
    }
    if (this.state.backtracking > 0) {
      this.state.failed = true
      return C
    }
    C = this.recoverFromMismatchedToken(B, D, A)
    return C
  },
  matchAny: function (A) {
    this.state.errorRecovery = false
    this.state.failed = false
    A.consume()
  },
  mismatchIsUnwantedToken: function (A, B) {
    return A.LA(2) === B
  },
  mismatchIsMissingToken: function (C, A) {
    if (!A) return false
    if (A.member(org.antlr.runtime.Token.EOR_TOKEN_TYPE)) {
      if (this.state._fsp >= 0) A.remove(org.antlr.runtime.Token.EOR_TOKEN_TYPE)
      let B = this.computeContextSensitiveRuleFOLLOW()
      A = A.or(this.viableTokensFollowingThisRule)
    }
    if (A.member(C.LA(1)) || A.member(org.antlr.runtime.Token.EOR_TOKEN_TYPE))
      return true
    return false
  },
  mismatch: function (B, C, A) {
    if (this.mismatchIsUnwantedToken(B, C))
      throw new org.antlr.runtime.UnwantedTokenException(C, B)
    else if (this.mismatchIsMissingToken(B, A))
      throw new org.antlr.runtime.MissingTokenException(C, B, null)
    throw new org.antlr.runtime.MismatchedTokenException(C, B)
  },
  reportError: function (A) {
    if (this.state.errorRecovery) return
    this.state.syntaxErrors++
    this.state.errorRecovery = true
    this.displayRecognitionError(this.getTokenNames(), A)
  },
  displayRecognitionError: function (A, B) {
    let D = this.getErrorHeader(B),
      C = this.getErrorMessage(B, A)
    this.emitErrorMessage(D + ' ' + C)
  },
  getErrorHeader: function (A) {
    if (!org.antlr.lang.isNumber(A.line)) A.line = 0
    return 'line ' + A.line + ':' + A.charPositionInLine
  },
  emitErrorMessage: function (A) {
    if (typeof window != 'undefined' && window.console && window.console.log)
      console.log(A)
    else;
  },
  getErrorMessage: function (E, D) {
    let F = E && E.getMessage ? E.getMessage() : null,
      A,
      C
    if (E instanceof org.antlr.runtime.UnwantedTokenException) {
      let B = E
      C = '\x3cunknown\x3e'
      if (B.expecting == org.antlr.runtime.Token.EOF) C = 'EOF'
      else C = D[B.expecting]
      F =
        'extraneous input ' +
        this.getTokenErrorDisplay(B.getUnexpectedToken()) +
        ' expecting ' +
        C
    } else if (E instanceof org.antlr.runtime.MissingTokenException) {
      A = E
      C = '\x3cunknown\x3e'
      if (A.expecting == org.antlr.runtime.Token.EOF) C = 'EOF'
      else C = D[A.expecting]
      F = 'missing ' + C + ' at ' + this.getTokenErrorDisplay(E.token)
    } else if (E instanceof org.antlr.runtime.MismatchedTokenException) {
      A = E
      C = '\x3cunknown\x3e'
      if (A.expecting == org.antlr.runtime.Token.EOF) C = 'EOF'
      else C = D[A.expecting]
      F =
        'mismatched input ' +
        this.getTokenErrorDisplay(E.token) +
        ' expecting ' +
        C
    } else if (E instanceof org.antlr.runtime.NoViableAltException)
      F = 'no viable alternative at input ' + this.getTokenErrorDisplay(E.token)
    else if (E instanceof org.antlr.runtime.EarlyExitException)
      F =
        'required (...)+ loop did not match anything at input ' +
        this.getTokenErrorDisplay(E.token)
    else if (E instanceof org.antlr.runtime.MismatchedSetException)
      F =
        'mismatched input ' +
        this.getTokenErrorDisplay(E.token) +
        ' expecting set ' +
        E.expecting
    else if (E instanceof org.antlr.runtime.MismatchedNotSetException)
      F =
        'mismatched input ' +
        this.getTokenErrorDisplay(E.token) +
        ' expecting set ' +
        E.expecting
    else if (E instanceof org.antlr.runtime.FailedPredicateException)
      F = 'rule ' + E.ruleName + ' failed predicate: {' + E.predicateText + '}?'
    return F
  },
  getNumberOfSyntaxErrors: function () {
    return this.state.syntaxErrors
  },
  getTokenErrorDisplay: function (A) {
    let B = A.getText()
    if (!org.antlr.lang.isValue(B))
      if (A.getType() == org.antlr.runtime.Token.EOF) B = '\x3cEOF\x3e'
      else B = '\x3c' + A.getType() + '\x3e'
    B = B.replace(/\n/g, '\\n')
    B = B.replace(/\r/g, '\\r')
    B = B.replace(/\t/g, '\\t')
    return "'" + B + "'"
  },
  recover: function (A, B) {
    if (this.state.lastErrorIndex == A.index()) A.consume()
    this.state.lastErrorIndex = A.index()
    let C = this.computeErrorRecoverySet()
    this.beginResync()
    this.consumeUntil(A, C)
    this.endResync()
  },
  beginResync: function () {},
  endResync: function () {},
  computeErrorRecoverySet: function () {
    return this.combineFollows(false)
  },
  computeContextSensitiveRuleFOLLOW: function () {
    return this.combineFollows(true)
  },
  combineFollows: function (C) {
    let E = this.state._fsp,
      B,
      A,
      D = new org.antlr.runtime.BitSet()
    for (B = E; B >= 0; B--) {
      A = this.state.following[B]
      D.orInPlace(A)
      if (C)
        if (A.member(org.antlr.runtime.Token.EOR_TOKEN_TYPE)) {
          if (B > 0) D.remove(org.antlr.runtime.Token.EOR_TOKEN_TYPE)
        } else break
    }
    return D
  },
  recoverFromMismatchedToken: function (B, F, A) {
    let E = null
    if (this.mismatchIsUnwantedToken(B, F)) {
      E = new org.antlr.runtime.UnwantedTokenException(F, B)
      this.beginResync()
      B.consume()
      this.endResync()
      this.reportError(E)
      let D = this.getCurrentInputSymbol(B)
      B.consume()
      return D
    }
    if (this.mismatchIsMissingToken(B, A)) {
      let C = this.getMissingSymbol(B, E, F, A)
      E = new org.antlr.runtime.MissingTokenException(F, B, C)
      this.reportError(E)
      return C
    }
    E = new org.antlr.runtime.MismatchedTokenException(F, B)
    throw E
  },
  recoverFromMismatchedSet: function (B, C, A) {
    if (this.mismatchIsMissingToken(B, A)) {
      this.reportError(C)
      return this.getMissingSymbol(
        B,
        C,
        org.antlr.runtime.Token.INVALID_TOKEN_TYPE,
        A
      )
    }
    throw C
  },
  getCurrentInputSymbol: function (A) {
    return null
  },
  getMissingSymbol: function (B, D, C, A) {
    return null
  },
  consumeUntil: function (A, C) {
    let B = A.LA(1)
    while (B != org.antlr.runtime.Token.EOF && !C.member(B)) {
      A.consume()
      B = A.LA(1)
    }
  },
  pushFollow: function (A) {
    if (this.state._fsp + 1 >= this.state.following.length) {
      let C = []
      let B
      for (B = this.state.following.length - 1; B >= 0; B--)
        C[B] = this.state.following[B]
      this.state.following = C
    }
    this.state._fsp++
    this.state.following[this.state._fsp] = A
  },
  getRuleInvocationStack: function (B, A) {
    throw new Error('Not implemented.')
  },
  getBacktrackingLevel: function () {
    return this.state.backtracking
  },
  getTokenNames: function () {
    return null
  },
  getGrammarFileName: function () {
    return null
  },
  toStrings: function (C) {
    if (!C) return null
    let A = []
    let B
    for (B = 0; B < C.length; B++) A.push(C[B].getText())
    return A
  },
  getRuleMemoization: function (B, A) {
    if (!this.state.ruleMemo[B]) this.state.ruleMemo[B] = {}
    let C = this.state.ruleMemo[B][A]
    if (!org.antlr.lang.isNumber(C))
      return org.antlr.runtime.BaseRecognizer.MEMO_RULE_UNKNOWN
    return C
  },
  alreadyParsedRule: function (B, C) {
    let A = this.getRuleMemoization(C, B.index())
    if (A == org.antlr.runtime.BaseRecognizer.MEMO_RULE_UNKNOWN) return false
    if (A == org.antlr.runtime.BaseRecognizer.MEMO_RULE_FAILED)
      this.state.failed = true
    else B.seek(A + 1)
    return true
  },
  memoize: function (C, D, B) {
    let A = this.state.failed
      ? org.antlr.runtime.BaseRecognizer.MEMO_RULE_FAILED
      : C.index() - 1
    if (!org.antlr.lang.isValue(this.state.ruleMemo))
      throw new Error(
        '!!!!!!!!! memo array is null for ' + this.getGrammarFileName()
      )
    if (D >= this.state.ruleMemo.length)
      throw new Error(
        '!!!!!!!!! memo size is ' +
          this.state.ruleMemo.length +
          ', but rule index is ' +
          D
      )
    if (org.antlr.lang.isValue(this.state.ruleMemo[D]))
      this.state.ruleMemo[D][B] = A
  },
  getRuleMemoizationCacheSize: function () {
    let C = 0,
      A
    for (A = 0; this.state.ruleMemo && A < this.state.ruleMemo.length; A++) {
      let B = this.state.ruleMemo[A]
      if (B) C += B.length
    }
    return C
  },
  traceIn: function (C, B, A) {
    this.emitErrorMessage('enter ' + C + ' ' + A)
    if (this.state.failed) this.emitErrorMessage(' failed\x3d' + this.failed)
    if (this.state.backtracking > 0)
      this.emitErrorMessage(' backtracking\x3d' + this.state.backtracking)
  },
  traceOut: function (C, B, A) {
    this.emitErrorMessage('exit ' + C + ' ' + A)
    if (this.state.failed)
      this.emitErrorMessage(' failed\x3d' + this.state.failed)
    if (this.state.backtracking > 0)
      this.emitErrorMessage(' backtracking\x3d' + this.state.backtracking)
  }
}
org.antlr.runtime.Lexer = function (A, B) {
  if (B) org.antlr.runtime.Lexer.superclass.constructor.call(this, B)
  if (A) this.input = A
}
org.antlr.lang.extend(
  org.antlr.runtime.Lexer,
  org.antlr.runtime.BaseRecognizer,
  {
    reset: function () {
      org.antlr.runtime.Lexer.superclass.reset.call(this)
      if (org.antlr.lang.isValue(this.input)) this.input.seek(0)
      if (!org.antlr.lang.isValue(this.state)) return
      this.state.token = null
      this.state.type = org.antlr.runtime.Token.INVALID_TOKEN_TYPE
      this.state.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL
      this.state.tokenStartCharIndex = -1
      this.state.tokenStartCharPositionInLine = -1
      this.state.tokenStartLine = -1
      this.state.text = null
    },
    nextToken: function () {
      while (true) {
        this.state.token = null
        this.state.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL
        this.state.tokenStartCharIndex = this.input.index()
        this.state.tokenStartCharPositionInLine =
          this.input.getCharPositionInLine()
        this.state.tokenStartLine = this.input.getLine()
        this.state.text = null
        if (this.input.LA(1) === org.antlr.runtime.CharStream.EOF)
          return org.antlr.runtime.Token.EOF_TOKEN
        try {
          this.mTokens()
          if (!org.antlr.lang.isValue(this.state.token)) this.emit()
          else if (this.state.token == org.antlr.runtime.Token.SKIP_TOKEN)
            continue
          return this.state.token
        } catch (A) {
          if (A instanceof org.antlr.runtime.RecognitionException) {
            this.reportError(A)
            this.recover(A)
          } else if (A instanceof org.antlr.runtime.NoViableAltException) {
            this.reportError(A)
            this.recover(A)
          } else throw A
        }
      }
    },
    skip: function () {
      this.state.token = org.antlr.runtime.Token.SKIP_TOKEN
    },
    setCharStream: function (A) {
      this.input = null
      this.reset()
      this.input = A
    },
    getCharStream: function () {
      return this.input
    },
    getSourceName: function () {
      return this.input.getSourceName()
    },
    emit: function () {
      if (arguments.length === 0) {
        let A = new org.antlr.runtime.CommonToken(
          this.input,
          this.state.type,
          this.state.channel,
          this.state.tokenStartCharIndex,
          this.getCharIndex() - 1
        )
        A.setLine(this.state.tokenStartLine)
        A.setText(this.state.text)
        A.setCharPositionInLine(this.state.tokenStartCharPositionInLine)
        this.state.token = A
        return A
      } else this.state.token = arguments[0]
    },
    match: function (C) {
      let B = 0,
        A
      if (org.antlr.lang.isString(C))
        while (B < C.length) {
          if (this.input.LA(1) != C.charAt(B)) {
            if (this.state.backtracking > 0) {
              this.state.failed = true
              return
            }
            A = new org.antlr.runtime.MismatchedTokenException(
              C.charAt(B),
              this.input
            )
            this.recover(A)
            throw A
          }
          B++
          this.input.consume()
          this.state.failed = false
        }
      else if (org.antlr.lang.isNumber(C)) {
        if (this.input.LA(1) != C) {
          if (this.state.backtracking > 0) {
            this.state.failed = true
            return
          }
          A = new org.antlr.runtime.MismatchedTokenException(C, this.input)
          this.recover(A)
          throw A
        }
        this.input.consume()
        this.state.failed = false
      }
    },
    matchAny: function () {
      this.input.consume()
    },
    matchRange: function (B, A) {
      if (this.input.LA(1) < B || this.input.LA(1) > A) {
        if (this.state.backtracking > 0) {
          this.state.failed = true
          return
        }
        mre = new org.antlr.runtime.MismatchedRangeException(B, A, this.input)
        this.recover(mre)
        throw mre
      }
      this.input.consume()
      this.state.failed = false
    },
    getLine: function () {
      return this.input.getLine()
    },
    getCharPositionInLine: function () {
      return this.input.getCharPositionInLine()
    },
    getCharIndex: function () {
      return this.input.index()
    },
    getText: function () {
      if (org.antlr.lang.isString(this.state.text)) return this.state.text
      return this.input.substring(
        this.state.tokenStartCharIndex,
        this.getCharIndex() - 1
      )
    },
    setText: function (A) {
      this.state.text = A
    },
    reportError: function (A) {
      this.displayRecognitionError(this.getTokenNames(), A)
    },
    getErrorMessage: function (B, A) {
      let C = null
      if (B instanceof org.antlr.runtime.MismatchedTokenException)
        C =
          'mismatched character ' +
          this.getCharErrorDisplay(B.c) +
          ' expecting ' +
          this.getCharErrorDisplay(B.expecting)
      else if (B instanceof org.antlr.runtime.NoViableAltException)
        C =
          'no viable alternative at character ' + this.getCharErrorDisplay(B.c)
      else if (B instanceof org.antlr.runtime.EarlyExitException)
        C =
          'required (...)+ loop did not match anything at character ' +
          this.getCharErrorDisplay(B.c)
      else if (B instanceof org.antlr.runtime.MismatchedNotSetException)
        C =
          'mismatched character ' +
          this.getCharErrorDisplay(B.c) +
          ' expecting set ' +
          B.expecting
      else if (B instanceof org.antlr.runtime.MismatchedSetException)
        C =
          'mismatched character ' +
          this.getCharErrorDisplay(B.c) +
          ' expecting set ' +
          B.expecting
      else if (B instanceof org.antlr.runtime.MismatchedRangeException)
        C =
          'mismatched character ' +
          this.getCharErrorDisplay(B.c) +
          ' expecting set ' +
          this.getCharErrorDisplay(B.a) +
          '..' +
          this.getCharErrorDisplay(B.b)
      else
        C = org.antlr.runtime.Lexer.superclass.getErrorMessage.call(this, B, A)
      return C
    },
    getCharErrorDisplay: function (B) {
      let A = B
      switch (A) {
        case org.antlr.runtime.Token.EOF:
          A = '\x3cEOF\x3e'
          break
        case '\n':
          A = '\\n'
          break
        case '\t':
          A = '\\t'
          break
        case '\r':
          A = '\\r'
          break
      }
      return "'" + A + "'"
    },
    recover: function (A) {
      this.input.consume()
    },
    traceIn: function (C, B) {
      let A =
        String.fromCharCode(this.input.LT(1)) +
        ' line\x3d' +
        this.getLine() +
        ':' +
        this.getCharPositionInLine()
      org.antlr.runtime.Lexer.superclass.traceIn.call(this, C, B, A)
    },
    traceOut: function (C, B) {
      let A =
        String.fromCharCode(this.input.LT(1)) +
        ' line\x3d' +
        this.getLine() +
        ':' +
        this.getCharPositionInLine()
      org.antlr.runtime.Lexer.superclass.traceOut.call(this, C, B, A)
    }
  }
)
org.antlr.runtime.ParserRuleReturnScope = function () {}
org.antlr.runtime.ParserRuleReturnScope.prototype = {
  getStart: function () {
    return this.start
  },
  getStop: function () {
    return this.stop
  }
}
org.antlr.runtime.tree.TreeRuleReturnScope = function () {}
org.antlr.runtime.tree.TreeRuleReturnScope.prototype = {
  getStart: function () {
    return this.start
  }
}
org.antlr.runtime.Parser = function (A, B) {
  org.antlr.runtime.Parser.superclass.constructor.call(this, B)
  this.setTokenStream(A)
}
org.antlr.lang.extend(
  org.antlr.runtime.Parser,
  org.antlr.runtime.BaseRecognizer,
  {
    reset: function () {
      org.antlr.runtime.Parser.superclass.reset.call(this)
      if (org.antlr.lang.isValue(this.input)) this.input.seek(0)
    },
    getCurrentInputSymbol: function (A) {
      return A.LT(1)
    },
    getMissingSymbol: function (C, G, E, A) {
      let B = '\x3cmissing ' + this.getTokenNames()[E] + '\x3e'
      let D = new org.antlr.runtime.CommonToken(E, B)
      let F = C.LT(1)
      let H
      if (F.getType() === org.antlr.runtime.Token.EOF) {
        H = F
        F = C.LT(-1)
        if (!F) F = H
      }
      D.line = F.getLine()
      D.charPositionInLine = F.getCharPositionInLine()
      D.channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
      return D
    },
    setTokenStream: function (A) {
      this.input = null
      this.reset()
      this.input = A
    },
    getTokenStream: function () {
      return this.input
    },
    getSourceName: function () {
      return this.input.getSourceName()
    },
    traceIn: function (B, A) {
      org.antlr.runtime.Parser.superclass.traceIn.call(
        this,
        B,
        A,
        this.input.LT(1)
      )
    },
    traceOut: function (B, A) {
      org.antlr.runtime.Parser.superclass.traceOut.call(
        this,
        B,
        A,
        this.input.LT(1)
      )
    }
  }
)
org.antlr.runtime.DFA = function () {}
org.antlr.runtime.DFA.prototype = {
  predict: function (C) {
    let F = C.mark(),
      D = 0,
      B,
      E,
      A
    try {
      while (true) {
        B = this.special[D]
        if (B >= 0) {
          D = this.specialStateTransition(B, C)
          if (D === -1) {
            this.noViableAlt(D, C)
            return 0
          }
          C.consume()
          continue
        }
        if (this.accept[D] >= 1) return this.accept[D]
        E = C.LA(1)
        if (E === org.antlr.runtime.Token.EOF) E = -1
        else if (org.antlr.lang.isString(E)) E = E.charCodeAt(0)
        if (E >= this.min[D] && E <= this.max[D]) {
          A = this.transition[D][E - this.min[D]]
          if (A < 0) {
            if (this.eot[D] >= 0) {
              D = this.eot[D]
              C.consume()
              continue
            }
            this.noViableAlt(D, C)
            return 0
          }
          D = A
          C.consume()
          continue
        }
        if (this.eot[D] >= 0) {
          D = this.eot[D]
          C.consume()
          continue
        }
        if (E == org.antlr.runtime.Token.EOF && this.eof[D] >= 0)
          return this.accept[this.eof[D]]
        this.noViableAlt(D, C)
        return 0
      }
    } finally {
      C.rewind(F)
    }
  },
  noViableAlt: function (C, A) {
    if (this.recognizer.state.backtracking > 0) {
      this.recognizer.state.failed = true
      return
    }
    let B = new org.antlr.runtime.NoViableAltException(
      this.getDescription(),
      this.decisionNumber,
      C,
      A
    )
    this.error(B)
    throw B
  },
  error: function (A) {},
  specialStateTransition: function (B, A) {
    return -1
  },
  getDescription: function () {
    return 'n/a'
  }
}
org.antlr.lang.augmentObject(org.antlr.runtime.DFA, {
  unpackEncodedString: function (D) {
    let C,
      F = [],
      E = 0,
      G,
      A,
      B
    for (C = 0; C < D.length; C += 2) {
      G = D.charCodeAt(C)
      A = D.charCodeAt(C + 1)
      if (A === 65535) A = -1
      for (B = 1; B <= G; B++) F[E++] = A
    }
    return F
  },
  unpackEncodedStringToUnsignedChars: function (A) {
    return org.antlr.runtime.DFA.unpackEncodedString(A)
  }
})
org.antlr.runtime.tree.TreeParser = function (A) {
  org.antlr.runtime.tree.TreeParser.superclass.constructor.call(
    this,
    arguments[1]
  )
  this.setTreeNodeStream(A)
}
;(function () {
  let A = org.antlr.runtime.tree.TreeParser
  org.antlr.lang.augmentObject(A, {
    DOWN: org.antlr.runtime.Token.DOWN,
    UP: org.antlr.runtime.Token.UP
  })
  org.antlr.lang.extend(A, org.antlr.runtime.BaseRecognizer, {
    reset: function () {
      A.superclass.reset.call(this)
      if (this.input) this.input.seek(0)
    },
    setTreeNodeStream: function (B) {
      this.input = B
    },
    getTreeNodeStream: function () {
      return this.input
    },
    getSourceName: function () {
      return this.input.getSourceName()
    },
    getCurrentInputSymbol: function (B) {
      return B.LT(1)
    },
    getMissingSymbol: function (D, F, E, B) {
      let C = '\x3cmissing ' + this.getTokenNames()[E] + '\x3e'
      return new org.antlr.runtime.tree.CommonTree(
        new org.antlr.runtime.CommonToken(E, C)
      )
    },
    matchAny: function (E) {
      this.state.errorRecovery = false
      this.state.failed = false
      let B = this.input.LT(1)
      if (this.input.getTreeAdaptor().getChildCount(B) === 0) {
        this.input.consume()
        return
      }
      let D = 0,
        C = this.input.getTreeAdaptor().getType(B)
      while (C !== org.antlr.runtime.Token.EOF && !(C === A.UP && D === 0)) {
        this.input.consume()
        B = this.input.LT(1)
        C = this.input.getTreeAdaptor().getType(B)
        if (C === A.DOWN) D++
        else if (C === A.UP) D--
      }
      this.input.consume()
    },
    mismatch: function (C, D, B) {
      throw new org.antlr.runtime.MismatchedTreeNodeException(D, C)
    },
    getErrorHeader: function (B) {
      return (
        this.getGrammarFileName() +
        ': node from ' +
        (B.approximateLineInfo ? 'after ' : '') +
        'line ' +
        B.line +
        ':' +
        B.charPositionInLine
      )
    },
    getErrorMessage: function (C, B) {
      let D
      if (this instanceof A) {
        D = C.input.getTreeAdaptor()
        C.token = D.getToken(C.node)
        if (!org.antlr.lang.isValue(C.token))
          C.token = new org.antlr.runtime.CommonToken(
            D.getType(C.node),
            D.getText(C.node)
          )
      }
      return A.superclass.getErrorMessage.call(this, C, B)
    },
    traceIn: function (C, B) {
      A.superclass.traceIn.call(this, C, B, this.input.LT(1))
    },
    traceOut: function (C, B) {
      A.superclass.traceOut.call(this, C, B, this.input.LT(1))
    }
  })
})()
let com = { toone: { itop: { formula: {} } } }
com.toone.itop.formula.Formula = {
  cache: {},
  eval: function (formula, context) {
    let _context = context
    if (!_context) _context = new com.toone.itop.formula.Map()
    _context.put('_isExecutable', true)
    let formulaCache = com.toone.itop.formula.Formula.cache[formula]
    let cstream, lexer, tstream, parser, formulaTree
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
    let nodes = new org.antlr.runtime.tree.CommonTreeNodeStream(formulaTree)
    nodes.setTokenStream(tstream)
    let walker = new com.toone.itop.formula.FormulaTreeJSExtend(_context, nodes)
    return walker.eval()
  },
  varFinder: function (formula, context) {
    let _context = context
    if (!_context) _context = new com.toone.itop.formula.Map()
    _context.put('_isExecutable', false)
    let formulaCache = com.toone.itop.formula.Formula.cache[formula]
    let cstream, lexer, tstream, parser, formulaTree
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
    let nodes = new org.antlr.runtime.tree.CommonTreeNodeStream(formulaTree)
    nodes.setTokenStream(tstream)
    let walker = new com.toone.itop.formula.FormulaVarFinderJSExtend(
      _context,
      nodes
    )
    walker.eval()
    return _context.get(
      com.toone.itop.formula.FormulaTreeExtra.VARIABLE_VALUE_KEY
    )
  }
}
com.toone.itop.formula.ext = { FormulaJSLexer: {}, Util: {} }
com.toone.itop.formula.ext.Util.chunk = function (array, process, context) {
  if (array)
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
        if (items.length > 0) setTimeout(arguments.callee, 0)
        else seajs.ready = true
      }, 0)
    } else
      for (var i = 0; i < array.length; i++) process.call(context, array[i])
}
com.toone.itop.formula.ext.FormulaJSLexer.processDFATransition = function (
  item
) {
  let dfaTransition = com.toone.itop.formula.FormulaJSLexer[this.key]
  if (!dfaTransition) com.toone.itop.formula.FormulaJSLexer[this.key] = []
  else dfaTransition.push(org.antlr.runtime.DFA.unpackEncodedString(item))
} // $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g 2018-10-31 15:44:04

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
  let HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
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
          let _type = this.CONTROL
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.BUSSINESSRULERESULT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.EVENTACTION
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.KEYBOARD
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.NUMBER
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:2: ( ( DIGIT )+ ( '.' ( DIGIT )+ )? )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:5: ( DIGIT )+ ( '.' ( DIGIT )+ )?
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:109:5: ( DIGIT )+
          let cnt1 = 0
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
          let alt3 = 2
          let LA3_0 = this.input.LA(1)

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
          let _type = this.STRING
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.WHITESPACE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:124:2: ( ( ' ' | '\\n' | '\\t' | '\\r' | '\\v' | '\\f' | '\\u00A0' )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:124:4: ( ' ' | '\\n' | '\\t' | '\\r' | '\\v' | '\\f' | '\\u00A0' )+
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:124:4: ( ' ' | '\\n' | '\\t' | '\\r' | '\\v' | '\\f' | '\\u00A0' )+
          let cnt5 = 0
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
          let _type = this.TRUE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:127:2: ( ( 't' | 'T' ) ( 'r' | 'R' ) ( 'u' | 'U' ) ( 'e' | 'E' ) )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:127:4: ( 't' | 'T' ) ( 'r' | 'R' ) ( 'u' | 'U' ) ( 'e' | 'E' )
          if (this.input.LA(1) == 'T' || this.input.LA(1) == 't') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'R' || this.input.LA(1) == 'r') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'U' || this.input.LA(1) == 'u') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'E' || this.input.LA(1) == 'e') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
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
          let _type = this.FALSE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:130:2: ( ( 'f' | 'F' ) ( 'a' | 'A' ) ( 'l' | 'L' ) ( 's' | 'S' ) ( 'e' | 'E' ) )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:130:4: ( 'f' | 'F' ) ( 'a' | 'A' ) ( 'l' | 'L' ) ( 's' | 'S' ) ( 'e' | 'E' )
          if (this.input.LA(1) == 'F' || this.input.LA(1) == 'f') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'A' || this.input.LA(1) == 'a') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'L' || this.input.LA(1) == 'l') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'S' || this.input.LA(1) == 's') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
              null,
              this.input
            )
            this.recover(mse)
            throw mse
          }

          if (this.input.LA(1) == 'E' || this.input.LA(1) == 'e') {
            this.input.consume()
          } else {
            let mse = new org.antlr.runtime.MismatchedSetException(
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
          let _type = this.NOTEQ
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.LTEQ
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.GTEQ
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.AND
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.OR
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.NOT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.EQ
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.LT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.GT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.EXP
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.MULT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.DIV
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.ADD
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.SUB
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.CONCAT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.LPAREN
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.RPAREN
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.COMMA
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.PERCENT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.POINT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.DB
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:4: ( '[' ( LETTER | DIGIT )+ ']' ( POINT DB )? )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:6: '[' ( LETTER | DIGIT )+ ']' ( POINT DB )?
          this.match('[')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:159:10: ( LETTER | DIGIT )+
          let cnt6 = 0
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
          let alt7 = 2
          let LA7_0 = this.input.LA(1)

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
          let _type = this.ARRAY
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:7: ( '[' ( ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )* )? ']' )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:9: '[' ( ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )* )? ']'
          this.match('[')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:162:13: ( ( STRING | DIGIT | '_' ) ( COMMA ( STRING | DIGIT | '_' ) )* )?
          let alt11 = 2
          let LA11_0 = this.input.LA(1)

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
          let _type = this.BUSSINESSRULE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:14: ( BUSSINESSRULERESULT ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:16: BUSSINESSRULERESULT ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.mBUSSINESSRULERESULT()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:165:36: ( LETTER | DIGIT )+
          let cnt12 = 0
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
          let cnt13 = 0
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
          let _type = this.CONTROLPROPERTY
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:16: ( CONTROL ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:18: CONTROL ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.mCONTROL()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:168:26: ( LETTER | DIGIT )+
          let cnt14 = 0
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
          let cnt15 = 0
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
          let _type = this.EVENTACTIONPROPERTY
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:2: ( EVENTACTION ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:4: EVENTACTION ( LETTER | DIGIT )+
          this.mEVENTACTION()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:172:16: ( LETTER | DIGIT )+
          let cnt16 = 0
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
          let _type = this.KEYBOARDS
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:2: ( KEYBOARD ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:4: KEYBOARD ( LETTER | DIGIT )+
          this.mKEYBOARD()
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:175:13: ( LETTER | DIGIT )+
          let cnt17 = 0
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
          let _type = this.QUERY
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:6: ( '##' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:8: '##' ( LETTER | DIGIT )+
          this.match('##')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:177:12: ( LETTER | DIGIT )+
          let cnt18 = 0
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
          let _type = this.USERVAR
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:8: ( '#' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:10: '#' ( LETTER | DIGIT )+
          this.match('#')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:189:13: ( LETTER | DIGIT )+
          let cnt19 = 0
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
          let _type = this.VARPARENTVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.INPARENTVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.BROUTRULE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:10: ( 'BR_OUT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:12: 'BR_OUT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.match('BR_OUT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:195:21: ( LETTER | DIGIT )+
          let cnt20 = 0
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
          let cnt21 = 0
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
          let _type = this.BRREPORT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:9: ( 'BR_REPORT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:11: 'BR_REPORT.' ( LETTER | DIGIT )+ '.' ( LETTER | DIGIT )+
          this.match('BR_REPORT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:197:23: ( LETTER | DIGIT )+
          let cnt22 = 0
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
          let cnt23 = 0
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
          let _type = this.OUTPARENT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:10: ( 'BR_OUT_PARENT.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:12: 'BR_OUT_PARENT.' ( LETTER | DIGIT )+
          this.match('BR_OUT_PARENT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:199:28: ( LETTER | DIGIT )+
          let cnt24 = 0
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
          let _type = this.OUTPARENTVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.VARPARENT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:10: ( 'BR_VAR_PARENT.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:12: 'BR_VAR_PARENT.' ( LETTER | DIGIT )+
          this.match('BR_VAR_PARENT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:202:28: ( LETTER | DIGIT )+
          let cnt25 = 0
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
          let _type = this.INPARENT
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:9: ( 'BR_IN_PARENT.' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:11: 'BR_IN_PARENT.' ( LETTER | DIGIT )+
          this.match('BR_IN_PARENT.')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:204:26: ( LETTER | DIGIT )+
          let cnt26 = 0
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
          let _type = this.LVVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:11: ( 'LV' ( '.' ( LETTER | DIGIT )+ )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:13: 'LV' ( '.' ( LETTER | DIGIT )+ )+
          this.match('LV')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:206:17: ( '.' ( LETTER | DIGIT )+ )+
          let cnt28 = 0
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
          let _type = this.SYSTEMVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:15: ( '@@' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:17: '@@' ( LETTER | DIGIT )+
          this.match('@@')

          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:208:21: ( LETTER | DIGIT )+
          let cnt29 = 0
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
          let _type = this.FIELDVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.STR
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:5: ( ( LETTER | DIGIT )+ ( POINT ( LETTER | DIGIT )+ )? )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:8: ( LETTER | DIGIT )+ ( POINT ( LETTER | DIGIT )+ )?
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:212:8: ( LETTER | DIGIT )+
          let cnt30 = 0
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
          let alt32 = 2
          let LA32_0 = this.input.LA(1)

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
          let _type = this.I18NVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
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
          let _type = this.COMPONENTVARIABLE
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:18: ( '@' ( LETTER | DIGIT )+ )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:20: '@' ( LETTER | DIGIT )+
          this.match('@')
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:217:23: ( LETTER | DIGIT )+
          let cnt33 = 0
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
          let _type = this.FUNCNAME
          let _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:2: ( ( LETTER | DIGIT )+ LPAREN )
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:4: ( LETTER | DIGIT )+ LPAREN
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:223:4: ( LETTER | DIGIT )+
          let cnt34 = 0
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
            let mse = new org.antlr.runtime.MismatchedSetException(
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
          let alt35 = 5
          let LA35_0 = this.input.LA(1)

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
            let nvae = new org.antlr.runtime.NoViableAltException(
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
        let alt36 = 52
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
      let a = [],
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
})() // $ANTLR 3.3 Nov 30, 2010 12:45:30 D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g 2018-10-31 15:44:04

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
  let EOF = -1,
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
        let retval = new com.toone.itop.formula.FormulaJSParser.formula_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let expression1 = null

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
        let retval =
          new com.toone.itop.formula.FormulaJSParser.expression_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let boolExpr2 = null

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
        let retval =
          new com.toone.itop.formula.FormulaJSParser.boolExpr_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let set4 = null
        let concatExpr3 = null
        let concatExpr5 = null

        let set4_tree = null

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
        let retval =
          new com.toone.itop.formula.FormulaJSParser.concatExpr_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let CONCAT7 = null
        let sumExpr6 = null
        let sumExpr8 = null

        let CONCAT7_tree = null

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
        let retval = new com.toone.itop.formula.FormulaJSParser.sumExpr_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let set10 = null
        let productExpr9 = null
        let productExpr11 = null

        let set10_tree = null

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
        let retval =
          new com.toone.itop.formula.FormulaJSParser.productExpr_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let set13 = null
        let expExpr12 = null
        let expExpr14 = null

        let set13_tree = null

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
        let retval = new com.toone.itop.formula.FormulaJSParser.expExpr_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let EXP16 = null
        let unaryOperation15 = null
        let unaryOperation17 = null

        let EXP16_tree = null

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
        let retval =
          new com.toone.itop.formula.FormulaJSParser.unaryOperation_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let NOT18 = null
        let ADD20 = null
        let SUB21 = null
        let o = null
        let operand19 = null
        let operand22 = null

        let NOT18_tree = null
        let ADD20_tree = null
        let SUB21_tree = null
        let stream_SUB = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token SUB'
        )
        let stream_ADD = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token ADD'
        )
        let stream_operand =
          new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
            this.adaptor,
            'rule operand'
          )
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:53:2: ( NOT operand | ADD o= operand -> ^( POS $o) | SUB o= operand -> ^( NEG $o) | operand )
          let alt6 = 4
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
        let retval = new com.toone.itop.formula.FormulaJSParser.operand_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let CONTROLPROPERTY26 = null
        let COMPONENTVARIABLE27 = null
        let KEYBOARDS28 = null
        let SYSTEMVARIABLE29 = null
        let FIELDVARIABLE30 = null
        let LVVARIABLE31 = null
        let DB32 = null
        let USERVAR33 = null
        let QUERY35 = null
        let BUSSINESSRULE36 = null
        let EVENTACTIONPROPERTY37 = null
        let I18NVARIABLE38 = null
        let ARRAY39 = null
        let LPAREN40 = null
        let RPAREN42 = null
        let literal23 = null
        let functionExpr24 = null
        let percent25 = null
        let brParam34 = null
        let expression41 = null

        let CONTROLPROPERTY26_tree = null
        let COMPONENTVARIABLE27_tree = null
        let KEYBOARDS28_tree = null
        let SYSTEMVARIABLE29_tree = null
        let FIELDVARIABLE30_tree = null
        let LVVARIABLE31_tree = null
        let DB32_tree = null
        let USERVAR33_tree = null
        let QUERY35_tree = null
        let BUSSINESSRULE36_tree = null
        let EVENTACTIONPROPERTY37_tree = null
        let I18NVARIABLE38_tree = null
        let ARRAY39_tree = null
        let LPAREN40_tree = null
        let RPAREN42_tree = null
        let stream_RPAREN = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token RPAREN'
        )
        let stream_LPAREN = new org.antlr.runtime.tree.RewriteRuleTokenStream(
          this.adaptor,
          'token LPAREN'
        )
        let stream_expression =
          new org.antlr.runtime.tree.RewriteRuleSubtreeStream(
            this.adaptor,
            'rule expression'
          )
        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:61:2: ( literal | functionExpr | percent | CONTROLPROPERTY | COMPONENTVARIABLE | KEYBOARDS | SYSTEMVARIABLE | FIELDVARIABLE | LVVARIABLE | DB | USERVAR | brParam | QUERY | BUSSINESSRULE | EVENTACTIONPROPERTY | I18NVARIABLE | ARRAY | LPAREN expression RPAREN -> expression )
          let alt7 = 18
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
        let retval =
          new com.toone.itop.formula.FormulaJSParser.functionExpr_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let FUNCNAME43 = null
        let COMMA45 = null
        let RPAREN47 = null
        let boolExpr44 = null
        let boolExpr46 = null

        let FUNCNAME43_tree = null
        let COMMA45_tree = null
        let RPAREN47_tree = null

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
          let alt9 = 2
          let LA9_0 = this.input.LA(1)

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
        let retval = new com.toone.itop.formula.FormulaJSParser.literal_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let NUMBER48 = null
        let STRING49 = null
        let TRUE50 = null
        let FALSE51 = null
        let LETTER52 = null

        let NUMBER48_tree = null
        let STRING49_tree = null
        let TRUE50_tree = null
        let FALSE51_tree = null
        let LETTER52_tree = null

        try {
          // D:\\develop\\Toone-V3\\Trunk\\01source\\28engines\\FormulaJS.g:96:2: ( NUMBER | STRING | TRUE | FALSE | ( LETTER )+ )
          let alt11 = 5
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
        let retval = new com.toone.itop.formula.FormulaJSParser.percent_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let NUMBER53 = null
        let PERCENT54 = null

        let NUMBER53_tree = null
        let PERCENT54_tree = null

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
        let retval = new com.toone.itop.formula.FormulaJSParser.brParam_return()
        retval.start = this.input.LT(1)

        let root_0 = null

        let set55 = null

        let set55_tree = null

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
            let mse = new org.antlr.runtime.MismatchedSetException(
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
      let a = [],
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
com.toone.itop.formula.FormulaTreeExtra = {
  VARIABLE_VALUE_KEY: '_VERIABLE_VALUE_KEY_',
  saveVariableValue: function (content, key, value) {
    let vv = content.get(
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
  },
  evaluateSystemVariable: function (context, v) {
    let name = v.getText().substring(2, v.getText().length)
    let ctx = context.get('expressionContext')
    let componentParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.ComponentParam'
    )
    let scopeManager = ctx.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    let scope = scopeManager.getScope()
    let componentCode = scope.getComponentCode()
    let cvar
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
    if (typeof cvar == 'undefine')
      throw new Error(
        '[' +
          name +
          ']' +
          '\u6ca1\u6709\u5bf9\u5e94\u7684\u7cfb\u7edf\u53d8\u91cf'
      )
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
      let ctx = context.get('expressionContext')
      let mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      let val = mathUtil.add(v1, v2)
      return Number(val)
    } else throw new Error(v1 + ',' + v2 + ' add type is wrong')
  },
  evaluateSub: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let ctx = context.get('expressionContext')
      let mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      let val = mathUtil.subtract(v1, v2)
      return Number(val)
    } else throw new Error(v1 + ',' + v2 + ' sub type is wrong')
  },
  evaluateMult: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let ctx = context.get('expressionContext')
      let mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      let val = mathUtil.multiply(v1, v2)
      return Number(val)
    } else throw new Error(v1 + ',' + v2 + ' Mult type is wrong')
  },
  evaluateDiv: function (context, v1, v2) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let ctx = context.get('expressionContext')
      let mathUtil = ctx.getService('vjs.framework.extension.util.Math')
      let val = mathUtil.divide(v1, v2)
      return Number(val)
    } else throw new Error(v1 + ',' + v2 + ' Div type is wrong')
  },
  evaluatePercent: function (context, v) {
    let ctx = context.get('expressionContext')
    let mathUtil = ctx.getService('vjs.framework.extension.util.Math')
    let val = mathUtil.divide(v, 100)
    return Number(val)
  },
  evaluateComponentVariable: function (context, v) {
    let name = v.getText().substring(1, v.getText().length)
    let ctx = context.get('expressionContext')
    let windowParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    let cvar = windowParam.getInput({ code: name })
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      cvar
    )
    return cvar
  },
  evaluateWindowFieldVariable: function (context, v) {
    let text = v.getText()
    let param = text.split('.')
    let tablename = param[0].substring(2, param[0].length - 1)
    let fieldname = param[1].substring(1, param[1].length - 1)
    let ctx = context.get('expressionContext')
    let windowParam = ctx.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    let datasource = windowParam.getInput({ code: tablename })
    let row
    if (ctx.hasCurrentRecord(tablename)) row = ctx.getCurrentRecord(tablename)
    else if (ctx.hasRecordIndex(tablename))
      row = datasource.getRecordById(ctx.getRecordIndex(tablename))
    else row = datasource.getCurrentRecord()
    row = row ? row : datasource.getRecordByIndex(0)
    if (row) {
      let cvar = row ? row.get(fieldname) : null
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
    let name = v.getText().substring(1, v.getText().length)
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      context,
      v.getText(),
      1
    )
    return 1
  },
  evaluateArray: function (context, v) {
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
    let text = v.getText()
    let param = text.split('.')
    let code = param[1]
    let key = param[2]
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) return routeContext.getBusinessRuleResult(code, key)
    else
      throw Error(
        '[ExpressionEngine.evaluateBrOutRule]\u83b7\u53d6\u89c4\u5219\u4e1a\u52a1\u8fd4\u56de\u503c\u5931\u8d25\uff01\u8def\u7531\u4e0a\u4e0b\u6587\u4e0d\u5b58\u5728\uff0c\u89c4\u5219\u7f16\u53f7\uff1a' +
          code
      )
  },
  evaluateBrIn: function (context, v) {
    let text = v.getText()
    let param = text.split('.')
    let paramName = param[1]
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) return routeContext.getInputParam(paramName)
    else
      throw Error(
        '[ExpressionEngine.evaluateBrIn]\u83b7\u53d6\u6d3b\u52a8\u96c6\u8f93\u5165\u53c2\u6570\u5931\u8d25\uff01\u8def\u7531\u4e0a\u4e0b\u6587\u4e0d\u5b58\u5728\uff0c\u53c2\u6570\u540d\u79f0\uff1a' +
          paramName
      )
  },
  evaluateBrInFieldVariable: function (context, v) {
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    let text = v.getText()
    let param = text.split('.')
    let tablename = param[1].substring(1, param[1].length - 1)
    let fieldname = param[2].substring(1, param[2].length - 1)
    if (routeContext) {
      let datasource = routeContext.getInputParam(tablename)
      if (datasource) {
        let row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      } else
        throw Error(
          '[ExpressionEngine.evaluateBrInFieldVariable]\u83b7\u53d6\u6d3b\u52a8\u96c6\u8f93\u5165\u5b9e\u4f53\u53c2\u6570\u7684\u5b57\u6bb5\u503c\u5931\u8d25\uff01\u6d3b\u52a8\u96c6\u8f93\u5165\u53c2\u6570\u5b9e\u4f53\u4e0d\u5b58\u5728\uff0c\u6570\u636e\u6e90\u540d\u79f0\uff1a' +
            tablename +
            ',\u5b57\u6bb5\u540d\u79f0:' +
            fieldname
        )
    } else
      throw Error(
        '[ExpressionEngine.evaluateBrInFieldVariable]\u83b7\u53d6\u6d3b\u52a8\u96c6\u8f93\u5165\u5b9e\u4f53\u53c2\u6570\u7684\u5b57\u6bb5\u503c\u5931\u8d25\uff01\u8def\u7531\u4e0a\u4e0b\u6587\u4e0d\u5b58\u5728\uff0c\u6570\u636e\u6e90\u540d\u79f0\uff1a' +
          tablename +
          ',\u5b57\u6bb5\u540d\u79f0:' +
          fieldname
      )
  },
  evaluateBrOut: function (context, v) {
    let expContext = context.get('expressionContext')
    let routeContext = expContext.getRouteContext()
    let text = v.getText()
    let param = text.split('.')
    let paramName = param[1]
    if (routeContext) return routeContext.getOutPutParam(paramName)
    else
      throw Error(
        '[ExpressionEngine.evaluateBrOut]\u83b7\u53d6\u6d3b\u52a8\u96c6\u8f93\u51fa\u53c2\u6570\u5931\u8d25\uff01\u8def\u7531\u4e0a\u4e0b\u6587\u4e0d\u5b58\u5728\uff0c\u53c2\u6570\u540d\u79f0\uff1a' +
          paramName
      )
  },
  evaluateBrOutFieldVariable: function (context, v) {
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) {
      let text = v.getText()
      let param = text.split('.')
      let tablename = param[1].substring(1, param[1].length - 1)
      let fieldname = param[2].substring(1, param[2].length - 1)
      let datasource = routeContext.getOutPutParam(tablename)
      if (datasource) {
        let row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  evaluateOutParentVariable: function (context, v) {
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) {
      let text = v.getText()
      let param = text.split('.')
      let tablename = param[1].substring(1, param[1].length - 1)
      let fieldname = param[2].substring(1, param[2].length - 1)
      let datasource = routeContext.getOutPutParam(tablename)
      if (datasource) {
        let row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  evaluateBrVar: function (context, v) {
    let expContext = context.get('expressionContext')
    let routeContext = expContext.getRouteContext()
    let text = v.getText()
    let param = text.split('.')
    let paramName = param[1]
    if (routeContext) return routeContext.getVariable(paramName)
    else
      throw Error(
        '[ExpressionEngine.evaluateBrVar]\u83b7\u53d6\u6d3b\u52a8\u96c6\u4e0a\u4e0b\u6587\u53d8\u91cf\u5931\u8d25\uff01\u8def\u7531\u4e0a\u4e0b\u6587\u4e0d\u5b58\u5728\uff0c\u53c2\u6570\u540d\u79f0\uff1a' +
          paramName
      )
  },
  evaluateBrVarFieldVariable: function (context, v) {
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) {
      let text = v.getText()
      let param = text.split('.')
      let tablename = param[1].substring(1, param[1].length - 1)
      let fieldname = param[2].substring(1, param[2].length - 1)
      let datasource = routeContext.getVariable(tablename)
      if (datasource) {
        let row
        if (ctx.hasCurrentRecord(tablename))
          row = ctx.getCurrentRecord(tablename)
        else if (ctx.hasRecordIndex(tablename))
          row = datasource.getRecordById(ctx.getRecordIndex(tablename))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldname) : null
      }
    }
    return null
  },
  evaluateBrReport: function (context, v) {
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) {
      let text = v.getText()
      let param = text.split('.')
      let reportEntityName = param[1]
      let field = param[2]
      let reportEntity = ctx.get('Report@@Entity')
      if (reportEntity != null) {
        let fieldName = reportEntityName + '.' + field
        return reportEntity[fieldName]
      }
    } else
      throw Error(
        '[ExpressionEngine.evaluateBrReport]\u83b7\u53d6\u89c4\u5219\u4e1a\u52a1\u8fd4\u56de\u503c\u5931\u8d25\uff01\u8def\u7531\u4e0a\u4e0b\u6587\u4e0d\u5b58\u5728\uff0c\u89c4\u5219\u7f16\u53f7\uff1a' +
          code
      )
    return null
  },
  evaluateTableChain: function (context, v) {
    let ctx = context.get('expressionContext')
    let name = v.getText()
    let t = name.split('.')
    let tablename = t[0].substring(1, t[0].length - 1)
    let fieldname = t[1].substring(1, t[1].length - 1)
    let datasourceManager = ctx.getService(
      'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
    )
    let datasource = datasourceManager.lookup({ datasourceName: tablename })
    let row
    if (ctx.hasCurrentRecord(tablename)) row = ctx.getCurrentRecord(tablename)
    else if (ctx.hasRecordIndex(tablename))
      row = datasource.getRecordById(ctx.getRecordIndex(tablename))
    else row = datasource.getCurrentRecord()
    row = row ? row : datasource.getRecordByIndex(0)
    if (row) {
      let fieldValue = ''
      fieldValue = row.get(fieldname)
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
    let name = v.getText().substring(3, v.getText().length)
    let strArr = name.split('.')
    if (strArr.length == 2) {
      let propertyName = strArr[1]
      let widgetId = strArr[0]
      let ctx = context.get('expressionContext')
      let widgetProperty = ctx.getService(
        'vjs.framework.extension.platform.services.view.widget.common.action.WidgetProperty'
      )
      let propertyValue = widgetProperty.get(widgetId, propertyName)
      return propertyValue
    } else
      throw new Error(
        '\u8868\u8fbe\u5f0f\u3010' +
          v.getText() +
          '\u3011\u8bbe\u7f6e\u7684\u63a7\u4ef6\u5c5e\u6027\u4fe1\u606f\u4e0d\u6b63\u786e\uff01'
      )
  },
  evaluateKeyBoards: function (context, v) {
    let expContext = context.get('expressionContext')
    if (expContext) {
      let routeContext = expContext.getRouteContext()
      let expression = v.getText()
      let name = expression.substring(5, expression.length)
      let keyboardKeys = expContext.getService(
        'vjs.framework.extension.platform.interface.enum.KeyboardKeys'
      )
      return keyboardKeys[name]
    }
  },
  evaluateEventAction: function (context, v) {
    let ctx = context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) {
      let expression = v.getText()
      let name = expression.substring(3, expression.length)
      return routeContext.getEventArgument(name)
    }
  },
  evaluateI18NVariable: function (context, v) {
    let langName = v.getText().substr(5)
    let ctx = context.get('expressionContext')
    if (ctx) {
      let scopeManager = ctx.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
      let scopeId = scopeManager.getCurrentScopeId()
      let scope = scopeManager.getScope(scopeId)
      let params
      if (scopeManager.isComponentScope(scopeId)) {
        let language = ctx.getService(
          'vjs.framework.extension.platform.interface.i18n.component'
        )
        params = { componentCode: scope.getComponentCode(), code: langName }
        if (language.hasExpLanguage(params))
          return language.getExpLanguage(params)
      } else {
        let language = ctx.getService(
          'vjs.framework.extension.platform.interface.i18n.window'
        )
        params = {
          componentCode: scope.getComponentCode(),
          windowCode: scope.getWindowCode(),
          code: langName
        }
        if (language.hasExpLanguage(params))
          return language.getExpLanguage(params)
      }
      let resourcePackage = ctx.getService(
        'vjs.framework.extension.ui.adapter.resourcepackage'
      )
      return resourcePackage.getLanguageItem(langName)
    }
    return ''
  },
  evaluateForEachVar: function (context, v) {
    let routeContext = context.get('expressionContext').getRouteContext()
    let str = v.getText().split('.')
    if (str && str.length == 3) {
      let code = str[1]
      let field = str[2]
      let record = routeContext.getForEachVarValue(code)
      return record.get(field)
    } else
      throw Error(
        '\u5faa\u73af\u53d8\u91cf\u8868\u8fbe\u5f0f\u53d6\u503c\u683c\u5f0f\u4e0d\u6b63\u786e: [' +
          str +
          ']'
      )
  },
  callFunction: function (stream, f, argTree, context) {
    let expContext = context.get('expressionContext')
    let handlerName = f.getText().substring(0, f.getText().length - 1)
    let args = []
    for (let index = 0; index < argTree.length; index++) {
      let walker = new com.toone.itop.formula.FormulaTreeJSExtend(
        context,
        new org.antlr.runtime.tree.CommonTreeNodeStream(argTree[index])
      )
      let cur = walker.eval()
      if (cur == null)
        if (',' == argTree[index].getText() || ')' == argTree[index].getText());
        else args.push(null)
      else args.push(cur)
    }
    if (context.get('_isExecutable')) {
      let executor = expContext.getService(
        'vjs.framework.extension.platform.engine.function.FunctionEngine'
      )
      let FunctionContext = expContext.getService(
        'vjs.framework.extension.platform.interface.function.FunctionContext'
      )
      if (executor)
        return executor.execute({
          functionName: handlerName,
          context: new FunctionContext(args, expContext.getRouteContext())
        })
    }
  },
  lt: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number')
      return Number(left) < Number(right)
    else {
      if (left == null || right == null) return false
      return String(left) < String(right)
    }
  },
  lteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number')
      return Number(left) <= Number(right)
    else {
      if (left == null || right == null) return false
      return String(left) <= String(right)
    }
  },
  gt: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number')
      return Number(left) > Number(right)
    else {
      if (left == null || right == null) return false
      return String(left) > String(right)
    }
  },
  gteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number')
      return Number(left) >= Number(right)
    else {
      if (left == null || right == null) return false
      return String(left) >= String(right)
    }
  },
  eq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number')
      return Number(left) == Number(right)
    else {
      if (left == null && right == null) return true
      else if (left == null || right == null) return false
      return String(left) == String(right)
    }
  },
  noteq: function (left, right) {
    if (typeof left == 'number' && typeof right == 'number')
      return Number(left) != Number(right)
    else {
      if (left == null && right == null) return false
      else if (left == null || right == null) return true
      return String(left) != String(right)
    }
  }
}
com.toone.itop.formula.Map = function () {
  this._size = 0
  this.entry = new Object()
}
com.toone.itop.formula.Map.prototype = {
  _def_perfix: 'Context_KEY_',
  put: function (key, value) {
    if (!this.containsKey(key)) this._size++
    this.entry[this._def_perfix + key] = value
  },
  get: function (key) {
    return this.containsKey(key) ? this.entry[this._def_perfix + key] : null
  },
  remove: function (key) {
    if (this.containsKey(key) && delete this.entry[this._def_perfix + key])
      this._size--
  },
  containsKey: function (key) {
    if (this.entry[this._def_perfix + key]) return true
    else return false
  },
  containsValue: function (value) {
    for (let prop in this.entry) if (this.entry[prop] == value) return true
    return false
  },
  values: function () {
    let values = new Array()
    for (let prop in this.entry)
      if (this.entry.hasOwnProperty(prop)) values.push(this.entry[prop])
    return values
  },
  keys: function () {
    let keys = new Array()
    for (let prop in this.entry)
      if (this.entry.hasOwnProperty(prop)) keys.push(prop)
    return keys
  },
  size: function () {
    return this._size
  },
  clear: function () {
    this._size = 0
    entry = new Object()
  }
}
com.toone.itop.formula.FormulaTreeJS = function (input, state) {
  if (!state) state = new org.antlr.runtime.RecognizerSharedState()
  ;(function () {}.call(this))
  com.toone.itop.formula.FormulaTreeJS.superclass.constructor.call(
    this,
    input,
    state
  )
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
  let EOF = -1,
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
  let UP = org.antlr.runtime.Token.UP,
    DOWN = org.antlr.runtime.Token.DOWN
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
      eval: function () {
        let value = null
        let v = null
        try {
          this.pushFollow(
            com.toone.itop.formula.FormulaTreeJS.FOLLOW_expression_in_eval60
          )
          v = this.expression()
          this.state._fsp--
          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      expression: function () {
        let value = null
        let v = null
        try {
          let alt1 = 2
          let LA1_0 = this.input.LA(1)
          if (
            (LA1_0 >= CONTROLPROPERTY && LA1_0 <= ARRAY) ||
            (LA1_0 >= NUMBER && LA1_0 <= FALSE) ||
            (LA1_0 >= BROUTRULE && LA1_0 <= BRREPORT)
          )
            alt1 = 1
          else if (
            (LA1_0 >= POS && LA1_0 <= NEG) ||
            (LA1_0 >= AND && LA1_0 <= NOT) ||
            LA1_0 == FUNCNAME ||
            LA1_0 == PERCENT
          )
            alt1 = 2
          else {
            let nvae = new org.antlr.runtime.NoViableAltException(
              '',
              1,
              0,
              this.input
            )
            throw nvae
          }
          switch (alt1) {
            case 1:
              this.pushFollow(
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_operand_in_expression78
              )
              v = this.operand()
              this.state._fsp--
              value = v
              break
            case 2:
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
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      operation: function () {
        let value = null
        let n = null
        let FUNCNAME1 = null
        let a = null
        let b = null
        try {
          let alt3 = 19
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
              FUNCNAME1 = this.match(
                this.input,
                FUNCNAME,
                com.toone.itop.formula.FormulaTreeJS
                  .FOLLOW_FUNCNAME_in_operation527
              )
              var list_funcArgs = []
              if (this.input.LA(1) == org.antlr.runtime.Token.DOWN) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null)
                loop2: do {
                  var alt2 = 2
                  var LA2_0 = this.input.LA(1)
                  if (LA2_0 >= POS && LA2_0 <= STR) alt2 = 1
                  switch (alt2) {
                    case 1:
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
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      operand: function () {
        let value = null
        let v = null
        try {
          this.pushFollow(
            com.toone.itop.formula.FormulaTreeJS.FOLLOW_literal_in_operand556
          )
          v = this.literal()
          this.state._fsp--
          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      literal: function () {
        let value = null
        let s = null
        let v = null
        let NUMBER2 = null
        try {
          let alt4 = 25
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
              s = this.match(
                this.input,
                STRING,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_STRING_in_literal581
              )
              value = s.getText().substring(1, s.getText().length - 1)
              break
            case 3:
              this.match(
                this.input,
                TRUE,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_TRUE_in_literal591
              )
              value = true
              break
            case 4:
              this.match(
                this.input,
                FALSE,
                com.toone.itop.formula.FormulaTreeJS.FOLLOW_FALSE_in_literal598
              )
              value = false
              break
            case 5:
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
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      }
    },
    true
  )
  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaTreeJS, {
    tokenNames: [
      '\x3cinvalid\x3e',
      '\x3cEOR\x3e',
      '\x3cDOWN\x3e',
      '\x3cUP\x3e',
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
    FOLLOW_expression_in_eval60: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_operand_in_expression78: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_operation_in_expression87: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_POS_in_operation105: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation109: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_NEG_in_operation120: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation124: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_NOT_in_operation136: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation140: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_OR_in_operation154: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation158: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation162: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_AND_in_operation182: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation186: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation190: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_LT_in_operation206: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation210: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation214: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_LTEQ_in_operation231: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation235: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation239: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_GT_in_operation256: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation260: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation264: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_GTEQ_in_operation281: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation285: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation289: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_EQ_in_operation306: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation310: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation314: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_NOTEQ_in_operation331: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation335: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation339: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_ADD_in_operation356: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation360: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation364: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_SUB_in_operation381: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation385: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation389: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_MULT_in_operation406: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation410: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation414: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_DIV_in_operation431: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation435: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation439: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_EXP_in_operation456: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation460: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation464: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_CONCAT_in_operation481: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation485: new org.antlr.runtime.BitSet([
      4294965296, 534870655
    ]),
    FOLLOW_expression_in_operation489: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_PERCENT_in_operation506: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_NUMBER_in_operation510: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_FUNCNAME_in_operation527: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_literal_in_operand556: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_NUMBER_in_literal572: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_STRING_in_literal581: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_TRUE_in_literal591: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_FALSE_in_literal598: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_COMPONENTVARIABLE_in_literal607: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_FIELDVARIABLE_in_literal614: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_VARPARENTVARIABLE_in_literal621: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_INPARENTVARIABLE_in_literal628: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_SYSTEMVARIABLE_in_literal635: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_OUTPARENTVARIABLE_in_literal642: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_LVVARIABLE_in_literal649: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_DB_in_literal656: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_USERVAR_in_literal663: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_CONTROLPROPERTY_in_literal670: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_I18NVARIABLE_in_literal677: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_ARRAY_in_literal684: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_QUERY_in_literal691: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_BUSSINESSRULE_in_literal698: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_EVENTACTIONPROPERTY_in_literal705: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_KEYBOARDS_in_literal712: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_BROUTRULE_in_literal719: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_OUTPARENT_in_literal726: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_VARPARENT_in_literal733: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_INPARENT_in_literal740: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_BRREPORT_in_literal747: new org.antlr.runtime.BitSet([2, 0])
  })
})()
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
com.toone.itop.formula.FormulaVarFinderJS = function (input, state) {
  if (!state) state = new org.antlr.runtime.RecognizerSharedState()
  ;(function () {}.call(this))
  com.toone.itop.formula.FormulaVarFinderJS.superclass.constructor.call(
    this,
    input,
    state
  )
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
  let EOF = -1,
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
  let UP = org.antlr.runtime.Token.UP,
    DOWN = org.antlr.runtime.Token.DOWN
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
      eval: function () {
        let value = null
        let v = null
        try {
          this.pushFollow(
            com.toone.itop.formula.FormulaVarFinderJS
              .FOLLOW_expression_in_eval60
          )
          v = this.expression()
          this.state._fsp--
          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      expression: function () {
        let value = null
        let v = null
        try {
          let alt1 = 2
          let LA1_0 = this.input.LA(1)
          if (
            (LA1_0 >= CONTROLPROPERTY && LA1_0 <= DB) ||
            (LA1_0 >= BUSSINESSRULE && LA1_0 <= ARRAY) ||
            (LA1_0 >= NUMBER && LA1_0 <= FALSE) ||
            (LA1_0 >= BROUTRULE && LA1_0 <= BRREPORT)
          )
            alt1 = 1
          else if (
            (LA1_0 >= POS && LA1_0 <= CALL) ||
            (LA1_0 >= AND && LA1_0 <= NOT) ||
            LA1_0 == PERCENT
          )
            alt1 = 2
          else {
            let nvae = new org.antlr.runtime.NoViableAltException(
              '',
              1,
              0,
              this.input
            )
            throw nvae
          }
          switch (alt1) {
            case 1:
              this.pushFollow(
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_operand_in_expression78
              )
              v = this.operand()
              this.state._fsp--
              value = v
              break
            case 2:
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
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      operation: function () {
        let value = null
        let n = null
        let FUNCNAME1 = null
        let a = null
        let b = null
        try {
          let alt3 = 19
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
              loop2: do {
                var alt2 = 2
                var LA2_0 = this.input.LA(1)
                if (LA2_0 >= POS && LA2_0 <= STR) alt2 = 1
                switch (alt2) {
                  case 1:
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
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      operand: function () {
        let value = null
        let v = null
        try {
          this.pushFollow(
            com.toone.itop.formula.FormulaVarFinderJS
              .FOLLOW_literal_in_operand555
          )
          v = this.literal()
          this.state._fsp--
          value = v
        } catch (re) {
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      },
      literal: function () {
        let value = null
        let s = null
        let v = null
        try {
          let alt4 = 23
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
              this.match(
                this.input,
                NUMBER,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_NUMBER_in_literal571
              )
              break
            case 2:
              s = this.match(
                this.input,
                STRING,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_STRING_in_literal580
              )
              break
            case 3:
              this.match(
                this.input,
                TRUE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_TRUE_in_literal590
              )
              break
            case 4:
              this.match(
                this.input,
                FALSE,
                com.toone.itop.formula.FormulaVarFinderJS
                  .FOLLOW_FALSE_in_literal596
              )
              break
            case 5:
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
          if (re instanceof org.antlr.runtime.RecognitionException)
            this.recover(this.input, re)
          else throw re
        } finally {
        }
        return value
      }
    },
    true
  )
  org.antlr.lang.augmentObject(com.toone.itop.formula.FormulaVarFinderJS, {
    tokenNames: [
      '\x3cinvalid\x3e',
      '\x3cEOR\x3e',
      '\x3cDOWN\x3e',
      '\x3cUP\x3e',
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
    FOLLOW_expression_in_eval60: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_operand_in_expression78: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_operation_in_expression87: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_POS_in_operation106: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation110: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_NEG_in_operation121: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation125: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_NOT_in_operation137: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation141: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_OR_in_operation155: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation159: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation163: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_AND_in_operation183: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation187: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation191: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_LT_in_operation207: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation211: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation215: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_LTEQ_in_operation232: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation236: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation240: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_GT_in_operation257: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation261: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation265: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_GTEQ_in_operation282: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation286: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation290: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_EQ_in_operation307: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation311: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation315: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_NOTEQ_in_operation332: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation336: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation340: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_ADD_in_operation357: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation361: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation365: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_SUB_in_operation382: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation386: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation390: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_MULT_in_operation407: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation411: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation415: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_DIV_in_operation432: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation436: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation440: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_EXP_in_operation457: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation461: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation465: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_CONCAT_in_operation482: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_expression_in_operation486: new org.antlr.runtime.BitSet([
      4294965360, 534870137
    ]),
    FOLLOW_expression_in_operation490: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_PERCENT_in_operation507: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_NUMBER_in_operation511: new org.antlr.runtime.BitSet([8, 0]),
    FOLLOW_CALL_in_operation524: new org.antlr.runtime.BitSet([4, 0]),
    FOLLOW_FUNCNAME_in_operation526: new org.antlr.runtime.BitSet([
      4294967288, 1073741823
    ]),
    FOLLOW_literal_in_operand555: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_NUMBER_in_literal571: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_STRING_in_literal580: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_TRUE_in_literal590: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_FALSE_in_literal596: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_COMPONENTVARIABLE_in_literal602: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_FIELDVARIABLE_in_literal609: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_VARPARENTVARIABLE_in_literal616: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_INPARENTVARIABLE_in_literal623: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_SYSTEMVARIABLE_in_literal630: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_OUTPARENTVARIABLE_in_literal637: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_LVVARIABLE_in_literal644: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_DB_in_literal651: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_BUSSINESSRULE_in_literal658: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_CONTROLPROPERTY_in_literal665: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_EVENTACTIONPROPERTY_in_literal672: new org.antlr.runtime.BitSet([
      2, 0
    ]),
    FOLLOW_KEYBOARDS_in_literal679: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_ARRAY_in_literal686: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_BROUTRULE_in_literal693: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_OUTPARENT_in_literal700: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_VARPARENT_in_literal707: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_INPARENT_in_literal714: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_I18NVARIABLE_in_literal721: new org.antlr.runtime.BitSet([2, 0]),
    FOLLOW_BRREPORT_in_literal728: new org.antlr.runtime.BitSet([2, 0])
  })
})()
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
exports.Formula = com.toone.itop.formula.Formula
exports.Map = com.toone.itop.formula.Map
