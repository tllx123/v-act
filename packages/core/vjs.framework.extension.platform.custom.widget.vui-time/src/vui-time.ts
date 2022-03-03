!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(require('Vue'))
  else if ('function' == typeof define && define.amd) define(['Vue'], t)
  else {
    var n = t('object' == typeof exports ? require('Vue') : e.Vue)
    for (var i in n) ('object' == typeof exports ? exports : e)[i] = n[i]
  }
})('undefined' != typeof self ? self : this, function (e) {
  return (function (e) {
    function t(i) {
      if (n[i]) return n[i].exports
      var r = (n[i] = { i: i, l: !1, exports: {} })
      return e[i].call(r.exports, r, r.exports, t), (r.l = !0), r.exports
    }
    var n = {}
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function (e, n, i) {
        t.o(e, n) ||
          Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: i
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
      t((t.s = 'JkW7'))
    )
  })({
    '4aOI': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'div',
            {
              staticClass: 'time',
              style: 'color:' + e.color + ';font-size:' + e.fontSize + 'px;'
            },
            [e._v('\n  ' + e._s(e.date) + '\n')]
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'JWiN': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          return u(e)
        })
      var i = function (e, t) {
          return e <= t
        },
        r = function (e) {
          return e < 10 ? '0' + e : e
        },
        o = function (e, t) {
          var n = new Date(1e3 * e),
            i = n.getFullYear(),
            o = r(n.getMonth() + 1),
            u = r(n.getDate()),
            s = r(n.getHours()),
            a = r(n.getMinutes()),
            f = r(n.getSeconds())
          return 'year' === t
            ? i + '-' + o + '-' + u + ' ' + s + ':' + a + ':' + f
            : o + '-' + u + ' ' + s + ':' + a
        },
        u = (t.getRelativeTime = function (e) {
          var t = new Date().getTime(),
            n = i(e, t),
            r = t - e
          n || (r = -r)
          var u = n ? '前' : '后'
          return r < 1e3
            ? '刚刚'
            : r < 6e4
            ? parseInt(r / 1e3) + '秒' + u
            : r >= 6e4 && r < 36e5
            ? Math.floor(r / 6e4) + '分钟' + u
            : r >= 36e5 && r < 864e5
            ? Math.floor(r / 36e5) + '小时' + u
            : r >= 864e5 && r < 262386e4
            ? Math.floor(r / 864e5) + '天' + u
            : r >= 262386e4 && r <= 3156786e4 && n
            ? o(e)
            : o(e, 'year')
        })
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('wevj'),
        o = i(r)
      i(n('lRwf')).default.component(o.default.name, o.default),
        (t.default = { vuiTime: o.default })
    },
    'QpiM': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e
              },
        r = n('JWiN'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r),
        u = Vue.prototype.$isServer
      t.default = {
        name: 'vui-time',
        props: {
          time: { type: [Number, Date, String], required: !0, default: '' },
          type: {
            type: String,
            default: 'relative',
            validator: function (e) {
              return 'relative' === e || 'date' === e || 'datetime' === e
            }
          },
          interval: { type: Number, default: 60 },
          color: { type: String, default: '#515a6e' },
          fontSize: { type: Number, default: 12 }
        },
        data: function () {
          return { date: '' }
        },
        methods: {
          setTime: function () {
            var e = i(this.time),
              t = void 0
            if ('number' === e) {
              var n =
                this.time.toString().length > 10 ? this.time : 1e3 * this.time
              t = new Date(n).getTime()
            } else
              'object' === e
                ? (t = this.time.getTime())
                : 'string' === e &&
                  (t = new Date(parseFloat(this.time)).getTime())
            if ('relative' === this.type) this.date = (0, o.default)(t)
            else {
              var r = new Date(t),
                u = r.getFullYear(),
                s =
                  r.getMonth() + 1 < 10
                    ? '0' + (r.getMonth() + 1)
                    : r.getMonth() + 1,
                a = r.getDate() < 10 ? '0' + r.getDate() : r.getDate(),
                f = r.getHours() < 10 ? '0' + r.getHours() : r.getHours(),
                c = r.getMinutes() < 10 ? '0' + r.getMinutes() : r.getMinutes(),
                l = r.getSeconds() < 10 ? '0' + r.getSeconds() : r.getSeconds()
              'datetime' === this.type
                ? (this.date =
                    u + '-' + s + '-' + a + ' ' + f + ':' + c + ':' + l)
                : 'date' === this.type && (this.date = u + '-' + s + '-' + a)
            }
          }
        },
        watch: {
          time: {
            handler: function (e, t) {
              this.$nextTick(function () {
                var e = this
                this.setTime(),
                  u ||
                    (this.timer = setInterval(function () {
                      e.setTime()
                    }, 1e3 * this.interval))
              })
            },
            deep: !0
          },
          type: {
            handler: function (e, t) {
              this.$nextTick(function () {
                var e = this
                this.setTime(),
                  u ||
                    (this.timer = setInterval(function () {
                      e.setTime()
                    }, 1e3 * this.interval))
              })
            },
            deep: !0
          },
          interval: {
            handler: function (e, t) {
              this.$nextTick(function () {
                var e = this
                this.setTime(),
                  u ||
                    (this.timer = setInterval(function () {
                      e.setTime()
                    }, 1e3 * this.interval))
              })
            },
            deep: !0
          }
        },
        mounted: function () {
          var e = this
          this.setTime(),
            u ||
              (this.timer = setInterval(function () {
                e.setTime()
              }, 1e3 * this.interval))
        },
        beforeDestroy: function () {
          this.timer && clearInterval(this.timer)
        }
      }
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, r, o, u, s) {
        e = e || {}
        var a = typeof e.default
        ;('object' !== a && 'function' !== a) || (e = e.default)
        var f = 'function' == typeof e ? e.options : e
        t && ((f.render = t), (f.staticRenderFns = n), (f._compiled = !0)),
          i && (f.functional = !0),
          o && (f._scopeId = o)
        var c
        if (
          (u
            ? ((c = function (e) {
                ;(e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)),
                  e ||
                    'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                    (e = __VUE_SSR_CONTEXT__),
                  r && r.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(u)
              }),
              (f._ssrRegister = c))
            : r &&
              (c = s
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          c)
        )
          if (f.functional) {
            f._injectStyles = c
            var l = f.render
            f.render = function (e, t) {
              return c.call(t), l(e, t)
            }
          } else {
            var d = f.beforeCreate
            f.beforeCreate = d ? [].concat(d, c) : [c]
          }
        return { exports: e, options: f }
      }
      t.a = i
    },
    'ZePa': function (e, t) {},
    'iUKx': function (e, t, n) {
      'use strict'
      function i(e) {
        n('ZePa')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('QpiM'),
        o = n.n(r)
      for (var u in r)
        'default' !== u &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(u)
      var s = n('4aOI'),
        a = (n.n(s), n('XyMi')),
        f = i,
        c = Object(a.a)(
          o.a,
          s.render,
          s.staticRenderFns,
          !1,
          f,
          'data-v-67433dd5',
          null
        )
      t.default = c.exports
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'wevj': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('iUKx'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    }
  })
})
