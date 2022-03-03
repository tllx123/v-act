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
    '+FcC': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('smdi'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    '2sFg': function (e, t, n) {
      'use strict'
      function i(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
              })
            : (e[t] = n),
          e
        )
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      t.default = {
        name: 'vui-divider',
        props: {
          type: {
            type: String,
            default: 'horizontal',
            validator: function (e) {
              return 'horizontal' === e || 'vertical' === e
            }
          },
          orientation: { type: String, default: 'center' },
          dashed: { type: Boolean, default: !1 }
        },
        data: function () {
          return { title: !1 }
        },
        methods: {
          dividerSlot: function () {
            this.$slots.default && 'vertical' != this.type && (this.title = !0)
          }
        },
        computed: {
          dividerClass: function () {
            var e
            return (
              '' == this.type && (this.type = 'horizontal'),
              [
                'divider',
                'divider-' + this.type,
                'divider-' + this.orientation,
                ((e = {}),
                i(e, 'divider-dashed', this.dashed),
                i(e, 'divider-border', 0 == this.title),
                i(e, 'divider-title', 1 == this.title),
                e)
              ]
            )
          }
        },
        updated: function () {
          this.dividerSlot()
        }
      }
    },
    '6ElW': function (e, t) {},
    '6IHj': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n('div', { class: e.dividerClass }, [
            e.title ? n('div', { staticClass: 'divider-before' }) : e._e(),
            e._v(' '),
            e.title
              ? n('span', { staticClass: 'divider-text' }, [e._t('default')], 2)
              : e._e(),
            e._v(' '),
            e.title ? n('div', { staticClass: 'divider-after' }) : e._e()
          ])
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('+FcC'),
        o = i(r)
      i(n('lRwf')).default.component(o.default.name, o.default),
        (t.default = { vuiDivider: o.default })
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, r, o, d, u) {
        e = e || {}
        var s = typeof e.default
        ;('object' !== s && 'function' !== s) || (e = e.default)
        var a = 'function' == typeof e ? e.options : e
        t && ((a.render = t), (a.staticRenderFns = n), (a._compiled = !0)),
          i && (a.functional = !0),
          o && (a._scopeId = o)
        var f
        if (
          (d
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
                  e && e._registeredComponents && e._registeredComponents.add(d)
              }),
              (a._ssrRegister = f))
            : r &&
              (f = u
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          f)
        )
          if (a.functional) {
            a._injectStyles = f
            var l = a.render
            a.render = function (e, t) {
              return f.call(t), l(e, t)
            }
          } else {
            var c = a.beforeCreate
            a.beforeCreate = c ? [].concat(c, f) : [f]
          }
        return { exports: e, options: a }
      }
      t.a = i
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'smdi': function (e, t, n) {
      'use strict'
      function i(e) {
        n('6ElW')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('2sFg'),
        o = n.n(r)
      for (var d in r)
        'default' !== d &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(d)
      var u = n('6IHj'),
        s = (n.n(u), n('XyMi')),
        a = i,
        f = Object(s.a)(
          o.a,
          u.render,
          u.staticRenderFns,
          !1,
          a,
          'data-v-bc359888',
          null
        )
      t.default = f.exports
    }
  })
})
