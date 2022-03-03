!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-caf94787885743c8664a5bf624698d3f'], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
          )
        : t(e.Vue, e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'])
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
    '4Pzh': function (e, n) {
      e.exports = t
    },
    '8foB': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('aJd9'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = o.default
    },
    'ASFZ': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiGalleryLayout',
          props: {
            gutter: { type: Number, default: 0 },
            xsCols: { type: Number, default: 0 },
            smCols: { type: Number, default: 0 },
            mdCols: { type: Number, default: 0 },
            lgCols: { type: Number, default: 0 }
          },
          data: function () {
            return {}
          }
        })
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('8foB'),
        i = r(o),
        u = n('aGkt'),
        a = r(u),
        s = n('lRwf'),
        f = r(s)
      f.default.component(i.default.name, i.default),
        f.default.component(a.default.name, a.default),
        (t.default = { vuiGalleryLayout: i.default, vuiGalleryItem: a.default })
    },
    'XonL': function (e, t) {},
    'XyMi': function (e, t, n) {
      'use strict'
      function r(e, t, n, r, o, i, u, a) {
        e = e || {}
        var s = typeof e.default
        ;('object' !== s && 'function' !== s) || (e = e.default)
        var f = 'function' == typeof e ? e.options : e
        t && ((f.render = t), (f.staticRenderFns = n), (f._compiled = !0)),
          r && (f.functional = !0),
          i && (f._scopeId = i)
        var l
        if (
          (u
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
                  e && e._registeredComponents && e._registeredComponents.add(u)
              }),
              (f._ssrRegister = l))
            : o &&
              (l = a
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          l)
        )
          if (f.functional) {
            f._injectStyles = l
            var d = f.render
            f.render = function (e, t) {
              return l.call(t), d(e, t)
            }
          } else {
            var c = f.beforeCreate
            f.beforeCreate = c ? [].concat(c, l) : [l]
          }
        return { exports: e, options: f }
      }
      t.a = r
    },
    'aGkt': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('nNEH'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = o.default
    },
    'aJd9': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('ASFZ'),
        o = n.n(r)
      for (var i in r)
        'default' !== i &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(i)
      var u = n('tGig'),
        a = (n.n(u), n('XyMi')),
        s = Object(a.a)(o.a, u.render, u.staticRenderFns, !1, null, null, null)
      t.default = s.exports
    },
    'ksaq': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('4Pzh'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = {
        name: 'vuiGalleryItem',
        props: { entityCode: String },
        data: function () {
          return { items: [] }
        },
        computed: {
          styles: function () {
            var e = {}
            return (
              0 !== this.$parent.gutter &&
                (e = {
                  paddingLeft: this.$parent.gutter / 2 + 'px',
                  paddingRight: this.$parent.gutter / 2 + 'px'
                }),
              e
            )
          }
        },
        created: function () {},
        methods: {
          changeDivWidth: function () {
            var e = this.getParentWidth(this.$parent.$el),
              t = this.getStyleWidth(e)
            '' != t && void 0 != t && (this.$el.style.width = t)
          },
          isIE: function () {
            return !!window.ActiveXObject || 'ActiveXObject' in window
          },
          getParentWidth: function (e, t) {
            return window.document.body.clientWidth
          },
          getStyleWidth: function (e) {
            return e < 768
              ? parseFloat(
                  100 / this.getSplitCount(this.getParentProp('xsCols'))
                ) + '%'
              : e >= 768 && e < 992
              ? parseFloat(
                  100 / this.getSplitCount(this.getParentProp('smCols'))
                ) + '%'
              : e >= 992 && e < 1200
              ? parseFloat(
                  100 / this.getSplitCount(this.getParentProp('mdCols'))
                ) + '%'
              : e > 1200
              ? parseFloat(
                  100 / this.getSplitCount(this.getParentProp('lgCols'))
                ) + '%'
              : void 0
          },
          getParentProp: function (e) {
            return this.$parent[e]
          },
          getSplitCount: function (e) {
            var t = this.$parent.$children.length,
              n = t > 0 ? (t > e ? e : t) : e
            return 0 == n ? 1 : n
          },
          handleClick: function (e) {
            try {
              o.default.synCurrentIdToDs(this, this.entityCode, this.$vnode.key)
            } catch (e) {}
            this.$emit('on-click', e)
          }
        },
        mounted: function () {
          this.changeDivWidth(),
            window.addEventListener(
              'resize',
              (function (e) {
                return function () {
                  e.changeDivWidth()
                }
              })(this)
            )
        }
      }
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'nNEH': function (e, t, n) {
      'use strict'
      function r(e) {
        n('XonL')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('ksaq'),
        i = n.n(o)
      for (var u in o)
        'default' !== u &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(u)
      var a = n('xo1e'),
        s = (n.n(a), n('XyMi')),
        f = r,
        l = Object(s.a)(
          i.a,
          a.render,
          a.staticRenderFns,
          !1,
          f,
          'data-v-1f06f908',
          null
        )
      t.default = l.exports
    },
    'tGig': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'div',
            { staticClass: 'ivu-row' },
            [e._t('default')],
            2
          )
        },
        o = []
      ;(t.render = r), (t.staticRenderFns = o)
    },
    'xo1e': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'div',
            {
              staticClass: 'ivu-galleryItem',
              style: e.styles,
              on: { click: e.handleClick }
            },
            [e._t('default')],
            2
          )
        },
        o = []
      ;(t.render = r), (t.staticRenderFns = o)
    }
  })
})
