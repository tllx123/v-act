!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('vPlatform-resource-caf94787885743c8664a5bf624698d3f', [], t)
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-caf94787885743c8664a5bf624698d3f'] = t())
    : (e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'] = t())
})('undefined' != typeof self ? self : this, function () {
  return (function (e) {
    function t(n) {
      if (r[n]) return r[n].exports
      var o = (r[n] = { i: n, l: !1, exports: {} })
      return e[n].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
    }
    var r = {}
    return (
      (t.m = e),
      (t.c = r),
      (t.d = function (e, r, n) {
        t.o(e, r) ||
          Object.defineProperty(e, r, {
            configurable: !1,
            enumerable: !0,
            get: n
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
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function (e, t) {
          var r = t.$root
          if (r && r._$v3platform) {
            var n = r._$v3platform(),
              o = n.datasource[e]
            if (o) {
              var u = Array.prototype.slice.call(arguments, 2)
              return o.apply(r, u)
            }
          }
        },
        o = function (e) {
          var t = e.vueObj
          return (
            'function' == typeof t.$root._$registerDsEvent &&
            (t.$root._$registerDsEvent(
              (function (e) {
                return function () {
                  var t = e.$attrs
                  if (t && t.___ds___ && t.___field___) {
                    var r = t.___ds___,
                      n = t.___field___
                    n = -1 != n.indexOf(',') ? n.split(',') : [t.___field___]
                    var o = e.$root._$getDatasource(r)
                    null != o &&
                      o.on({
                        eventName: o.Events.UPDATE,
                        handler: function (t) {
                          var r = !1,
                            o = null,
                            u = null,
                            l = t.resultSet.datas
                          if (l && l.length > 0)
                            for (var a = 0, i = l.length; a < i; a++)
                              for (
                                var f = l[a],
                                  c = f.getChangedData(),
                                  s = 0,
                                  d = n.length;
                                s < d;
                                s++
                              )
                                c.hasOwnProperty(n[s]) &&
                                  ((u = c[n[s]]), (r = !0))
                          if ((l = t.oldResultSet.datas) && l.length > 0)
                            for (var a = 0, i = l.length; a < i; a++)
                              for (
                                var f = l[a], s = 0, d = n.length;
                                s < d;
                                s++
                              )
                                o = f[n[s]]
                          r &&
                            e.$nextTick(function () {
                              e.$emit('on-change', u, o)
                            })
                        }
                      })
                  }
                }
              })(t)
            ),
            !0)
          )
        },
        u = function (e) {
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
      t.default = {
        synCurrentRecordToDs: function (e, t, r, o) {
          return n('synCurrentRecordToDs', e, t, r, o)
        },
        synCurrentIdToDs: function (e, t, r, o) {
          return n('synCurrentIdToDs', e, t, r, o)
        },
        synSelectRecordToDs: function (e, t, r, o) {
          return n('synSelectRecordToDs', e, t, r, o)
        },
        registerCurrentHandler: function (e, t) {
          return n('registerCurrentHandler', e, t)
        },
        registerSelectHandler: function (e, t) {
          return n('registerSelectHandler', e, t)
        },
        setDsMultiSelect: function (e, t) {
          return n('setDsMultiSelect', e, t)
        },
        markDsMultipleSelect: function (e, t) {
          return n('markDsMultipleSelect', e, t)
        },
        getSelectedRecords: function (e, t) {
          return n('getSelectedRecords', e, t)
        },
        getVuiVersion: function (e) {
          return e && e.$root ? e.$root.vui_version : null
        },
        registerDsUpdateEvent: o,
        getSrcPathFromId2url: u
      }
    }
  })
})
//# sourceMappingURL=v3platform.js.map
