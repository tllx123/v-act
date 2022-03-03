!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(require('VueI18n'), require('Vue')))
    : 'function' == typeof define && define.amd
    ? define(['VueI18n', 'Vue'], t)
    : 'object' == typeof exports
    ? (exports.Vui18n = t(require('VueI18n'), require('Vue')))
    : (e.Vui18n = t(e.VueI18n, e.Vue))
})('undefined' != typeof self ? self : this, function (e, t) {
  return (function (e) {
    function t(r) {
      if (n[r]) return n[r].exports
      var o = (n[r] = { i: r, l: !1, exports: {} })
      return e[r].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
    }
    var n = {}
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function (e, n, r) {
        t.o(e, n) ||
          Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: r
          })
      }),
      (t.n = function (e) {
        var n =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(n, 'a', n), n
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 0))
    )
  })([
    function (e, t, n) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function o(e, t) {
        for (var n = Object.getOwnPropertyNames(t), r = 0; r < n.length; r++) {
          var o = n[r],
            u = Object.getOwnPropertyDescriptor(t, o)
          u &&
            u.configurable &&
            void 0 === e[o] &&
            Object.defineProperty(e, o, u)
        }
        return e
      }
      function u(e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function')
      }
      function i(e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !t || ('object' != typeof t && 'function' != typeof t) ? e : t
      }
      function f(e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof t
          )
        ;(e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })),
          t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : o(e, t))
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var c = n(1),
        s = r(c),
        a = n(2),
        l = r(a),
        p = (function (e) {
          function t(n) {
            u(this, t)
            var r = i(this, e.call(this, n))
            return (
              (l.default.prototype.i18n = r.handleKey),
              l.default.mixin({ i18n: r }),
              r
            )
          }
          return (
            f(t, e),
            (t.prototype.handleKey = function (e) {
              if (!e || e.trim().length < 1) return this.$t(e)
              var t = e.split('.')
              return (
                1 == t.length
                  ? (e = 'message.' + e)
                  : 'message' != t[0] && (e = e.replace(t[0], 'message')),
                this.$t(e)
              )
            }),
            (t.prototype.setLocale = function (e) {
              return (this.locale = e), this
            }),
            t
          )
        })(s.default)
      l.default.use(p), (t.default = p)
    },
    function (t, n) {
      t.exports = e
    },
    function (e, n) {
      e.exports = t
    }
  ])
})
