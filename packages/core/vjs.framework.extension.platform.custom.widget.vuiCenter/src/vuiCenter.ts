!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(require('Vue'))
  else if ('function' == typeof define && define.amd) define(['Vue'], t)
  else {
    var n = t('object' == typeof exports ? require('Vue') : e.Vue)
    for (var r in n) ('object' == typeof exports ? exports : e)[r] = n[r]
  }
})('undefined' != typeof self ? self : this, function (e) {
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
      t((t.s = 'JkW7'))
    )
  })({
    '96Le': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('Ztxg'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = o.default
    },
    'Io6e': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'div',
            { staticClass: 'vuiCenterBackground', style: e.backgroundStyle },
            [
              e._t('background'),
              e._v(' '),
              n(
                'div',
                { staticClass: 'vuiCenterContent' },
                [e._t('default')],
                2
              )
            ],
            2
          )
        },
        o = []
      ;(t.render = r), (t.staticRenderFns = o)
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('96Le'),
        i = r(o)
      r(n('lRwf')).default.component(i.default.name, i.default),
        (t.default = { vuiCenter: i.default })
    },
    'NeV9': function (e, t) {},
    'XyMi': function (e, t, n) {
      'use strict'
      function r(e, t, n, r, o, i, u, s) {
        e = e || {}
        var f = typeof e.default
        ;('object' !== f && 'function' !== f) || (e = e.default)
        var a = 'function' == typeof e ? e.options : e
        t && ((a.render = t), (a.staticRenderFns = n), (a._compiled = !0)),
          r && (a.functional = !0),
          i && (a._scopeId = i)
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
                  o && o.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(u)
              }),
              (a._ssrRegister = c))
            : o &&
              (c = s
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          c)
        )
          if (a.functional) {
            a._injectStyles = c
            var d = a.render
            a.render = function (e, t) {
              return c.call(t), d(e, t)
            }
          } else {
            var l = a.beforeCreate
            a.beforeCreate = l ? [].concat(l, c) : [c]
          }
        return { exports: e, options: a }
      }
      t.a = r
    },
    'YPNN': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiCenter',
          props: {
            width: { type: [Number, String], default: '100%' },
            height: { type: [Number, String], default: '100%' }
          },
          computed: {
            backgroundStyle: function () {
              var e = ['width:']
              return (
                e.push(
                  'string' == typeof this.width ? this.width : this.width + 'px'
                ),
                e.push(';height:'),
                e.push(
                  'string' == typeof this.height
                    ? this.height
                    : this.height + 'px'
                ),
                e.join('')
              )
            }
          }
        })
    },
    'Ztxg': function (e, t, n) {
      'use strict'
      function r(e) {
        n('NeV9')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('YPNN'),
        i = n.n(o)
      for (var u in o)
        'default' !== u &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(u)
      var s = n('Io6e'),
        f = (n.n(s), n('XyMi')),
        a = r,
        c = Object(f.a)(
          i.a,
          s.render,
          s.staticRenderFns,
          !1,
          a,
          'data-v-0b02759b',
          null
        )
      t.default = c.exports
    },
    'lRwf': function (t, n) {
      t.exports = e
    }
  })
})
