!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
          )
        : t(e.Vue, e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'])
    for (var r in n) ('object' == typeof exports ? exports : e)[r] = n[r]
  }
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
      t((t.s = 'JkW7'))
    )
  })({
    '2wiw': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('Xh9k'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = o.default
    },
    'Fg+S': function (e, t) {},
    'JkW7': function (e, t, n) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('2wiw'),
        u = r(o)
      r(n('lRwf')).default.component(u.default.name, u.default),
        (t.default = { vuiFormLabel: u.default })
    },
    'Ug0N': function (e, n) {
      e.exports = t
    },
    'Xh9k': function (e, t, n) {
      'use strict'
      function r(e) {
        n('Fg+S')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('kmbM'),
        u = n.n(o)
      for (var i in o)
        'default' !== i &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(i)
      var a = n('r2II'),
        f = (n.n(a), n('XyMi')),
        s = r,
        l = Object(f.a)(
          u.a,
          a.render,
          a.staticRenderFns,
          !1,
          s,
          'data-v-c24ff2d6',
          null
        )
      t.default = l.exports
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function r(e, t, n, r, o, u, i, a) {
        e = e || {}
        var f = typeof e.default
        ;('object' !== f && 'function' !== f) || (e = e.default)
        var s = 'function' == typeof e ? e.options : e
        t && ((s.render = t), (s.staticRenderFns = n), (s._compiled = !0)),
          r && (s.functional = !0),
          u && (s._scopeId = u)
        var l
        if (
          (i
            ? ((l = function (e) {
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
                  e && e._registeredComponents && e._registeredComponents.add(i)
              }),
              (s._ssrRegister = l))
            : o &&
              (l = a
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          l)
        )
          if (s.functional) {
            s._injectStyles = l
            var d = s.render
            s.render = function (e, t) {
              return l.call(t), d(e, t)
            }
          } else {
            var c = s.beforeCreate
            s.beforeCreate = c ? [].concat(c, l) : [l]
          }
        return { exports: e, options: s }
      }
      t.a = r
    },
    'kmbM': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('Ug0N'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = {
        name: 'vuiFormLabel',
        props: {
          elementId: { type: String, default: '' },
          format: { type: String, defalut: '' },
          value: { type: [String, Number], default: '' },
          type: { type: String, default: null },
          size: { type: String, default: 'default' }
        },
        data: function () {
          return { isShowText: !0 }
        },
        computed: {
          displayText: function () {
            var e = this.value
            if (void 0 === e || null === e || '' === e) {
              try {
                this.$slots &&
                  this.$slots.default &&
                  this.$slots.default.length &&
                  this.$slots.default.length > 0 &&
                  (this.isShowText = !1)
              } catch (e) {}
              return '-'
            }
            return this.formatValue(this.value)
          },
          classStr: function () {
            return 'vui-input-viewonly vui-input-viewonly-' + this.size
          }
        },
        methods: {
          onClick: function (e) {
            this.$emit('on-click', e)
          },
          formatValue: function (e) {
            var t = e,
              n = this.format,
              r = this.type,
              u = e
            switch (r) {
              case 'date':
                ;(u = o.default.localWijmoFunc_WijmoFormatDate(t, n)),
                  (this.currentText = u)
                break
              default:
                ;(u = o.default.localWijmoFunc_WijmoFormatNumber(t, n)),
                  (this.currentText = u)
            }
            return u
          }
        }
      }
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'r2II': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n('div', { class: e.classStr }, [
            e.isShowText
              ? n('span', {
                  attrs: { id: e.elementId },
                  domProps: { textContent: e._s(e.displayText) }
                })
              : n('span', [e._t('default')], 2)
          ])
        },
        o = []
      ;(t.render = r), (t.staticRenderFns = o)
    }
  })
})
