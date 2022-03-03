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
      var o = (n[i] = { i: i, l: !1, exports: {} })
      return e[i].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
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
    '0G37': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('YWbt'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = o.default
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('0G37'),
        a = i(o)
      i(n('lRwf')).default.component(a.default.name, a.default),
        (t.default = { vuiCollapse: a.default })
    },
    'KrjS': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiCollapse',
          props: {
            value: { type: [String, Array], default: '1' },
            accordion: { type: Boolean, default: !1 },
            simple: { type: Boolean, default: !1 }
          },
          data: function () {
            return { displayValue: this.value }
          },
          methods: {
            handlerChange: function (e) {
              ;(this.displayValue = e), (this.entityValue = e)
              var t = this
              setTimeout(function () {
                t.$emit('on-change', e.join(','))
              }, 0)
            },
            changeDisplayValue: function (e, t) {
              'string' == typeof e
                ? t != e.split(',') && (t = e.split(','))
                : e instanceof Array && t != e && (t = e.join(',').split(','))
            }
          },
          watch: {
            value: function (e) {
              this.isEntity
                ? this.changeDisplayValue(e, this.entityValue)
                : this.changeDisplayValue(e, this.displayValue)
            },
            displayValue: function (e) {
              this.$emit('input', e)
            },
            entityValue: function (e) {
              e instanceof Array
                ? this.$emit('input', e.join(','))
                : this.$emit('input', e)
            }
          },
          computed: {
            isEntity: function () {
              return !!(
                (this.$vnode.data.attrs && this.$vnode.data.attrs.___ds___) ||
                this.$vnode.data.model
              )
            },
            entityValue: {
              get: function () {
                return this.value instanceof Array
                  ? this.value
                  : 'string' == typeof this.value
                  ? this.value.split(',')
                  : void 0
              },
              set: function () {}
            }
          }
        })
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, o, a, r, u) {
        e = e || {}
        var s = typeof e.default
        ;('object' !== s && 'function' !== s) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
          i && (l.functional = !0),
          a && (l._scopeId = a)
        var c
        if (
          (r
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
                  e && e._registeredComponents && e._registeredComponents.add(r)
              }),
              (l._ssrRegister = c))
            : o &&
              (c = u
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          c)
        )
          if (l.functional) {
            l._injectStyles = c
            var f = l.render
            l.render = function (e, t) {
              return c.call(t), f(e, t)
            }
          } else {
            var d = l.beforeCreate
            l.beforeCreate = d ? [].concat(d, c) : [c]
          }
        return { exports: e, options: l }
      }
      t.a = i
    },
    'YWbt': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('KrjS'),
        o = n.n(i)
      for (var a in i)
        'default' !== a &&
          (function (e) {
            n.d(t, e, function () {
              return i[e]
            })
          })(a)
      var r = n('ypyB'),
        u = (n.n(r), n('XyMi')),
        s = Object(u.a)(o.a, r.render, r.staticRenderFns, !1, null, null, null)
      t.default = s.exports
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'ypyB': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return e.isEntity
            ? n(
                'Collapse',
                {
                  attrs: { accordion: e.accordion, simple: e.simple },
                  on: { 'on-change': e.handlerChange },
                  model: {
                    value: e.entityValue,
                    callback: function (t) {
                      e.entityValue = t
                    },
                    expression: 'entityValue'
                  }
                },
                [e._t('default')],
                2
              )
            : n(
                'Collapse',
                {
                  attrs: { accordion: e.accordion, simple: e.simple },
                  on: { 'on-change': e.handlerChange },
                  model: {
                    value: e.displayValue,
                    callback: function (t) {
                      e.displayValue = t
                    },
                    expression: 'displayValue'
                  }
                },
                [e._t('default')],
                2
              )
        },
        o = []
      ;(t.render = i), (t.staticRenderFns = o)
    }
  })
})
