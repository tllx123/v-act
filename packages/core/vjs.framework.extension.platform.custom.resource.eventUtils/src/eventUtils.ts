!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(
        require('vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'),
        require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
      ))
    : 'function' == typeof define && define.amd
    ? define(
        'vPlatform-resource-fe03cd2d957f7fd01eb5be7cb31ec971',
        [
          'vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92',
          'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'
        ],
        t
      )
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-fe03cd2d957f7fd01eb5be7cb31ec971'] = t(
        require('vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'),
        require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
      ))
    : (e['vPlatform-resource-fe03cd2d957f7fd01eb5be7cb31ec971'] = t(
        e['vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'],
        e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649']
      ))
})('undefined' != typeof self ? self : this, function (e, t) {
  return (function (e) {
    function t(f) {
      if (r[f]) return r[f].exports
      var o = (r[f] = { i: f, l: !1, exports: {} })
      return e[f].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
    }
    var r = {}
    return (
      (t.m = e),
      (t.c = r),
      (t.d = function (e, r, f) {
        t.o(e, r) ||
          Object.defineProperty(e, r, {
            configurable: !1,
            enumerable: !0,
            get: f
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
      function f(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function o(e, t) {
        if (e && 'function' == typeof t) {
          var r = e,
            f = r.getAttribute('id')
          ;(f && '' != f) ||
            ((f = i.default.genUUID()), r.setAttribute('id', f)),
            !0 === d.default.visible(r) ? (c[f] = 'block') : (c[f] = 'none'),
            (l[f] = t)
        }
        b ||
          '{}' == JSON.stringify(c) ||
          (b = setInterval(function () {
            for (var e in c) {
              var t = document.getElementById(e)
              if (t) {
                var r = c[e],
                  f = d.default.visible(t)
                if ((f = !0 === f ? 'block' : 'none') != r) {
                  var o = l[e]
                  'function' == typeof o &&
                    (setTimeout(function () {
                      o(t)
                    }, 1),
                    o(t),
                    (c[e] = f))
                }
              } else n(e)
            }
            '{}' == JSON.stringify(c) && (clearInterval(b), (b = null))
          }, 100))
      }
      function n(e) {
        var t = 'string' == typeof e ? e : e.getAttribute('id')
        try {
          delete c[t], delete l[t]
        } catch (e) {}
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = r('kRJ1'),
        d = f(a),
        u = r('Ug0N'),
        i = f(u),
        c = {},
        l = {},
        b = null
      t.default = { onVisibleChagned: o, removeVisibleChangeHandler: n }
    },
    Ug0N: function (e, r) {
      e.exports = t
    },
    kRJ1: function (t, r) {
      t.exports = e
    }
  })
})
//# sourceMappingURL=eventUtils.js.map
