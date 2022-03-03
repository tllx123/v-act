!(function (o, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649', [], e)
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'] = e())
    : (o['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'] = e())
})('undefined' != typeof self ? self : this, function () {
  return (function (o) {
    function e(r) {
      if (t[r]) return t[r].exports
      var n = (t[r] = { i: r, l: !1, exports: {} })
      return o[r].call(n.exports, n, n.exports, e), (n.l = !0), n.exports
    }
    var t = {}
    return (
      (e.m = o),
      (e.c = t),
      (e.d = function (o, t, r) {
        e.o(o, t) ||
          Object.defineProperty(o, t, {
            configurable: !1,
            enumerable: !0,
            get: r
          })
      }),
      (e.n = function (o) {
        var t =
          o && o.__esModule
            ? function () {
                return o.default
              }
            : function () {
                return o
              }
        return e.d(t, 'a', t), t
      }),
      (e.o = function (o, e) {
        return Object.prototype.hasOwnProperty.call(o, e)
      }),
      (e.p = ''),
      e((e.s = 'JkW7'))
    )
  })({
    JkW7: function (o, e, t) {
      'use strict'
      function r() {
        return !(
          !window.wijmo ||
          !window.wijmo.Globalize ||
          'function' != typeof window.wijmo.Globalize.format
        )
      }
      function n(o) {
        return null != o && '' != o
      }
      function f(o) {
        if (null == o || '' === o) return !1
        try {
          var e = Number(o)
          if (!isNaN(e)) return !0
        } catch (o) {}
        return !1
      }
      function i(o, e) {
        if (window && window.console && 'function' == typeof window.console.log)
          switch (e) {
            case 'log':
              console.log(o)
              break
            case 'error':
              console.error(o)
              break
            default:
              console.warn(o)
          }
      }
      function u(o) {
        var e
        return (e = o.replace(/(^\s+)|(\s+$)/g, '')), (e = e.replace(/\s/g, ''))
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var a =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (o) {
              return typeof o
            }
          : function (o) {
              return o &&
                'function' == typeof Symbol &&
                o.constructor === Symbol &&
                o !== Symbol.prototype
                ? 'symbol'
                : typeof o
            }
      e.default = {
        localWijmoFunc_WijmoFormatNumber: function (o, e, t) {
          var a = o
          if (r() && n(e) && f(o))
            try {
              var l = Number(o)
              try {
                0 == e.toLowerCase().indexOf('ap') &&
                  ((e = e.substring(1, e.length)), (l /= 100))
              } catch (o) {}
              ;(a = wijmo.Globalize.formatNumber(l, e, void 0, void 0, t)),
                (a = u(a))
            } catch (o) {
              i(o)
            }
          return a
        },
        localWijmoFunc_WijmoFormatDate: function (o, e) {
          var t = o
          if (r() && n(e))
            try {
              if (o)
                if (
                  'object' == (void 0 === o ? 'undefined' : a(o)) &&
                  o.length >= 0
                ) {
                  t = null
                  for (var f = 0, u = o.length; f < u; f++) {
                    var l = o[f]
                    if (null != l) {
                      var c = wijmo.Globalize.formatDate(l, e)
                      null != c && (t = null == t ? c : t + ' - ' + c)
                    }
                  }
                } else t = wijmo.Globalize.formatDate(o, e)
            } catch (o) {
              i(o)
            }
          return t
        },
        genUUID: function () {
          function o() {
            return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1)
          }
          return o() + o() + o() + o() + o()
        },
        trim: function (o) {
          return 'string' == typeof o ? u(o) : o
        }
      }
    }
  })
})
//# sourceMappingURL=Format.js.map
