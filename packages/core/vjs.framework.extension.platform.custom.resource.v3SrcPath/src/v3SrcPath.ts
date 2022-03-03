!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55', [], t)
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55'] = t())
    : (e['vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55'] = t())
})('undefined' != typeof self ? self : this, function () {
  return (function (e) {
    function t(r) {
      if (o[r]) return o[r].exports
      var n = (o[r] = { i: r, l: !1, exports: {} })
      return e[r].call(n.exports, n, n.exports, t), (n.l = !0), n.exports
    }
    var o = {}
    return (
      (t.m = e),
      (t.c = o),
      (t.d = function (e, o, r) {
        t.o(e, o) ||
          Object.defineProperty(e, o, {
            configurable: !1,
            enumerable: !0,
            get: r
          })
      }),
      (t.n = function (e) {
        var o =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(o, 'a', o), o
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 'JkW7'))
    )
  })({
    JkW7: function (e, t, o) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      t.default = {
        getSrcPathFromRes: function (e, t) {
          if (!e.$root._getComponentCode) return t
          var o = e.$root._getComponentCode(),
            r = 'itop/resources/' + o + '_' + t
          return window.GlobalVariables
            ? GlobalVariables.getServerUrl() + '/' + r
            : r
        },
        getSrcPathFromId2url: function (e) {
          if (void 0 != e && null != e && e && '' != e) {
            var t =
              'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
              e +
              '%22%2C%22ImageObj%22%3A%22' +
              e +
              '%22%7D%7D'
            return window.GlobalVariables
              ? GlobalVariables.getServerUrl() + '/' + t
              : t
          }
        }
      }
    }
  })
})
//# sourceMappingURL=v3SrcPath.js.map
