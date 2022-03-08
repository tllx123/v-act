let i,
  df = require('vjs/framework/core/base/util/impl/underscore'),
  e = exports,
  m = [
    'keys',
    'values',
    'pairs',
    'invert',
    'functions',
    'extend',
    'pick',
    'omit',
    'defaults',
    'clone',
    'tap',
    'has',
    'property',
    'matches',
    'isEqual',
    'isEmpty',
    'isElement',
    'isArray',
    'isObject',
    'isArguments',
    'isFunction',
    'isString',
    'isNumber',
    'isFinite',
    'isBoolean',
    'isDate',
    'isRegExp',
    'isNaN',
    'isNull',
    'isUndefined'
  ]

e._gi = function () {
  return i || df
}

e._si = function (it) {
  i = it
}

for (let n = 0, d; (d = m[n]); n++) {
  e[d] = (function (l) {
    return function () {
      var s = e._gi()
      return s[l].apply(s, arguments)
    }
  })(d)
}
