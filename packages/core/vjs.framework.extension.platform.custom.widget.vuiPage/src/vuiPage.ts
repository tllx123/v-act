!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(require('Vue'))
  else if ('function' == typeof define && define.amd) define(['Vue'], t)
  else {
    var n = t('object' == typeof exports ? require('Vue') : e.Vue)
    for (var o in n) ('object' == typeof exports ? exports : e)[o] = n[o]
  }
})('undefined' != typeof self ? self : this, function (e) {
  return (function (e) {
    function t(o) {
      if (n[o]) return n[o].exports
      var r = (n[o] = { i: o, l: !1, exports: {} })
      return e[o].call(r.exports, r, r.exports, t), (r.l = !0), r.exports
    }
    var n = {}
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function (e, n, o) {
        t.o(e, n) ||
          Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: o
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
    '+RWM': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiPage',
          props: {
            current: { type: Number, default: 1 },
            total: { type: Number, default: 0 },
            pageSize: { type: Number, default: 10 },
            pageSizeOpts: String,
            size: String,
            elementId: String,
            simple: { type: Boolean, default: !1 },
            showTotal: { type: Boolean, default: !1 },
            showElevator: { type: Boolean, default: !1 },
            showSizer: { type: Boolean, default: !1 },
            showMode: { type: String, default: 'always' }
          },
          watch: {},
          data: function () {
            return { currentPage: this.current, currentPageSize: this.pageSize }
          },
          computed: {
            singleHide: function () {
              window._test = this
              var e = parseInt(this.total / this.pageSize)
              return (
                this.total % this.pageSize != 0 && e++,
                !(
                  this.showMode &&
                  'auto' === this.showMode.toLowerCase() &&
                  e < 2
                )
              )
            }
          },
          created: function () {},
          methods: {
            handlechange: function (e) {
              this.$emit('on-change', e),
                this.$emit('on-page-change', e, this.currentPageSize)
            },
            handlepagesize: function (e) {
              this.$emit('on-page-size-change', e),
                this.$emit('on-page-change', this.currentPage, e)
            }
          }
        })
    },
    '/Z3V': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('dCei'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = r.default
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function o(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('/Z3V'),
        i = o(r)
      o(n('lRwf')).default.component(i.default.name, i.default),
        (t.default = { vuiPage: i.default })
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function o(e, t, n, o, r, i, a, s) {
        e = e || {}
        var u = typeof e.default
        ;('object' !== u && 'function' !== u) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
          o && (l.functional = !0),
          i && (l._scopeId = i)
        var f
        if (
          (a
            ? ((f = function (e) {
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
                  e && e._registeredComponents && e._registeredComponents.add(a)
              }),
              (l._ssrRegister = f))
            : r &&
              (f = s
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          f)
        )
          if (l.functional) {
            l._injectStyles = f
            var c = l.render
            l.render = function (e, t) {
              return f.call(t), c(e, t)
            }
          } else {
            var d = l.beforeCreate
            l.beforeCreate = d ? [].concat(d, f) : [f]
          }
        return { exports: e, options: l }
      }
      t.a = o
    },
    'dCei': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('+RWM'),
        r = n.n(o)
      for (var i in o)
        'default' !== i &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(i)
      var a = n('iAf6'),
        s = (n.n(a), n('XyMi')),
        u = Object(s.a)(r.a, a.render, a.staticRenderFns, !1, null, null, null)
      t.default = u.exports
    },
    'iAf6': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)('Page', {
            directives: [
              {
                name: 'show',
                rawName: 'v-show',
                value: e.singleHide,
                expression: 'singleHide'
              }
            ],
            attrs: {
              'size': e.size,
              'show-sizer': e.showSizer,
              'show-elevator': e.showElevator,
              'show-total': e.showTotal,
              'current': e.current,
              'total': e.total,
              'pageSize': e.pageSize,
              'pageSizeOpt': e.pageSizeOpts,
              'elementId': e.elementId,
              'simple': e.simple
            },
            on: {
              'on-change': e.handlechange,
              'on-page-size-change': e.handlepagesize
            }
          })
        },
        r = []
      ;(t.render = o), (t.staticRenderFns = r)
    },
    'lRwf': function (t, n) {
      t.exports = e
    }
  })
})
