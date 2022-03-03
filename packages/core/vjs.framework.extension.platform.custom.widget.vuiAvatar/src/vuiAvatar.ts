!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55'], t)
  else {
    var r =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55')
          )
        : t(e.Vue, e['vPlatform-resource-dfeee4a130cd5f2dc3b82e4ec18e5a55'])
    for (var n in r) ('object' == typeof exports ? exports : e)[n] = r[n]
  }
})('undefined' != typeof self ? self : this, function (e, t) {
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
    '+zCQ': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r('lyPW'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = {
        name: 'vuiAvatar',
        props: {
          shape: { type: String, default: 'circle' },
          size: { type: String, default: 'default' },
          src: { type: String },
          compSrc: { type: String },
          amidSrc: { type: String },
          icon: { type: String }
        },
        data: function () {
          return { scale: 1, isSlotShow: !1 }
        },
        computed: {
          compSrcFun: function () {
            return o.default.getSrcPathFromRes(this, this.compSrc)
          },
          amidSrcFun: function () {
            return o.default.getSrcPathFromId2url(this.amidSrc)
          }
        },
        methods: {
          handleClick: function (e) {
            this.$emit('on-click', e)
          }
        },
        mounted: function () {},
        updated: function () {}
      }
    },
    '0MXU': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r('BSBr'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = o.default
    },
    'A3Q+': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function () {
          var e = this,
            t = e.$createElement,
            r = e._self._c || t
          return e.src
            ? r('Avatar', {
                attrs: { src: e.src, shape: e.shape, size: e.size }
              })
            : e.compSrc
            ? r('Avatar', {
                attrs: { src: e.compSrcFun, shape: e.shape, size: e.size }
              })
            : e.amidSrc
            ? r('Avatar', {
                attrs: { src: e.amidSrcFun, shape: e.shape, size: e.size }
              })
            : e.icon
            ? r('Avatar', {
                attrs: { icon: e.icon, shape: e.shape, size: e.size }
              })
            : r(
                'Avatar',
                {
                  attrs: { shape: e.shape, size: e.size },
                  on: { click: e.handleClick }
                },
                [e._t('default')],
                2
              )
        },
        o = []
      ;(t.render = n), (t.staticRenderFns = o)
    },
    'BSBr': function (e, t, r) {
      'use strict'
      function n(e) {
        r('PgIi')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = r('+zCQ'),
        i = r.n(o)
      for (var a in o)
        'default' !== a &&
          (function (e) {
            r.d(t, e, function () {
              return o[e]
            })
          })(a)
      var c = r('A3Q+'),
        u = (r.n(c), r('XyMi')),
        s = n,
        f = Object(u.a)(
          i.a,
          c.render,
          c.staticRenderFns,
          !1,
          s,
          'data-v-09d506e7',
          null
        )
      t.default = f.exports
    },
    'JkW7': function (e, t, r) {
      'use strict'
      function n(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = r('0MXU'),
        i = n(o)
      n(r('lRwf')).default.component(i.default.name, i.default),
        (t.default = { vuiAvatar: i.default })
    },
    'PgIi': function (e, t) {},
    'XyMi': function (e, t, r) {
      'use strict'
      function n(e, t, r, n, o, i, a, c) {
        e = e || {}
        var u = typeof e.default
        ;('object' !== u && 'function' !== u) || (e = e.default)
        var s = 'function' == typeof e ? e.options : e
        t && ((s.render = t), (s.staticRenderFns = r), (s._compiled = !0)),
          n && (s.functional = !0),
          i && (s._scopeId = i)
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
                  o && o.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(a)
              }),
              (s._ssrRegister = f))
            : o &&
              (f = c
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          f)
        )
          if (s.functional) {
            s._injectStyles = f
            var d = s.render
            s.render = function (e, t) {
              return f.call(t), d(e, t)
            }
          } else {
            var l = s.beforeCreate
            s.beforeCreate = l ? [].concat(l, f) : [f]
          }
        return { exports: e, options: s }
      }
      t.a = n
    },
    'lRwf': function (t, r) {
      t.exports = e
    },
    'lyPW': function (e, r) {
      e.exports = t
    }
  })
})
