!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('vPlatform-resource-23550ab3-0ca3-4c46-98a0-df508887ab22', [], t)
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-23550ab3-0ca3-4c46-98a0-df508887ab22'] = t())
    : (e['vPlatform-resource-23550ab3-0ca3-4c46-98a0-df508887ab22'] = t())
})('undefined' != typeof self ? self : this, function () {
  return (function (e) {
    function t(o) {
      if (r[o]) return r[o].exports
      var n = (r[o] = { i: o, l: !1, exports: {} })
      return e[o].call(n.exports, n, n.exports, t), (n.l = !0), n.exports
    }
    var r = {}
    return (
      (t.m = e),
      (t.c = r),
      (t.d = function (e, r, o) {
        t.o(e, r) ||
          Object.defineProperty(e, r, {
            configurable: !1,
            enumerable: !0,
            get: o
          })
      }),
      (t.n = function (e) {
        var r =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(r, 'a', r), r
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 'JkW7'))
    )
  })({
    JkW7: function (e, t, r) {
      'use strict'
      e.exports = {
        test: function (e) {
          alert(e)
        }
      }
    }
  })
})
//# sourceMappingURL=vui-m-f7Resource.js.map
