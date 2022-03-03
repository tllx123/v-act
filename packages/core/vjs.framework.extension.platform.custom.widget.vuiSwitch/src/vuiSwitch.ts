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
    for (var o in n) ('object' == typeof exports ? exports : e)[o] = n[o]
  }
})('undefined' != typeof self ? self : this, function (e, t) {
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
    '06wo': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'div',
            { class: e.wrapClasses },
            [
              'viewonly' != e.local_showType
                ? [
                    'viewonly' != e.local_showType
                      ? n(
                          'i-switch',
                          {
                            class: { 'vui-switch-readonly': e.readonly },
                            attrs: {
                              size: e.size,
                              disabled: e.local_data_disabled
                            },
                            on: {
                              'on-change': function (t) {
                                return e.onChange()
                              }
                            },
                            model: {
                              value: e.vModel,
                              callback: function (t) {
                                e.vModel = t
                              },
                              expression: 'vModel'
                            }
                          },
                          [
                            n(
                              'div',
                              { attrs: { slot: 'open' }, slot: 'open' },
                              [e._t('open')],
                              2
                            ),
                            e._v(' '),
                            n(
                              'div',
                              { attrs: { slot: 'close' }, slot: 'close' },
                              [e._t('close')],
                              2
                            )
                          ]
                        )
                      : e._e()
                  ]
                : n(
                    'vui-form-label',
                    {
                      attrs: { id: e.local_element_id },
                      on: {
                        'on-click': function (t) {
                          return e.onClick()
                        }
                      }
                    },
                    [
                      e.currentValue === e.trueValue
                        ? e._t('open', [e._v('是')])
                        : e._e(),
                      e._v(' '),
                      e.currentValue === e.falseValue
                        ? e._t('close', [e._v('否')])
                        : e._e()
                    ],
                    2
                  )
            ],
            2
          )
        },
        r = []
      ;(t.render = o), (t.staticRenderFns = r)
    },
    '4Pzh': function (e, n) {
      e.exports = t
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function o(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('bZpL'),
        i = o(r)
      o(n('lRwf')).default.component(i.default.name, i.default),
        (t.default = { vuiSwitch: i.default })
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function o(e, t, n, o, r, i, l, a) {
        e = e || {}
        var u = typeof e.default
        ;('object' !== u && 'function' !== u) || (e = e.default)
        var s = 'function' == typeof e ? e.options : e
        t && ((s.render = t), (s.staticRenderFns = n), (s._compiled = !0)),
          o && (s.functional = !0),
          i && (s._scopeId = i)
        var c
        if (
          (l
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
                  e && e._registeredComponents && e._registeredComponents.add(l)
              }),
              (s._ssrRegister = c))
            : r &&
              (c = a
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          c)
        )
          if (s.functional) {
            s._injectStyles = c
            var d = s.render
            s.render = function (e, t) {
              return c.call(t), d(e, t)
            }
          } else {
            var f = s.beforeCreate
            s.beforeCreate = f ? [].concat(f, c) : [c]
          }
        return { exports: e, options: s }
      }
      t.a = o
    },
    'bZpL': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('wEWp'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = r.default
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'rp7/': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('4Pzh'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = {
        name: 'VuiSwitch',
        props: {
          placeholder: String,
          size: String,
          disabled: { type: Boolean, default: !1 },
          readonly: { type: Boolean, default: !1 },
          viewonly: { type: Boolean, default: !1 },
          value: { type: [String, Number, Boolean], default: !1 },
          trueValue: { type: [String, Number, Boolean], default: !0 },
          falseValue: { type: [String, Number, Boolean], default: !1 },
          elementId: String
        },
        data: function () {
          return {
            local_data_readonly: !1,
            local_data_disabled: !1,
            local_data_viewonly: !1,
            vModel: this.value,
            currentValue: this.value
          }
        },
        watch: {
          value: function (e) {
            if (
              (null === e && (e = !1),
              e !== this.trueValue && e !== this.falseValue)
            )
              throw 'Value should be trueValue or falseValue.'
            ;(this.currentValue = e),
              this.vModel !== e && (this.vModel = e),
              this.isRegisterDsUpdateEvent ||
                this.$nextTick(function () {
                  this.$emit('on-change', event)
                })
          },
          vModel: function (e) {
            ;(this.currentValue = e), this.$emit('input', e)
          }
        },
        computed: {
          local_showType: function () {
            return this.viewonly
              ? 'viewonly'
              : ((this.local_data_readonly = this.readonly),
                (this.local_data_disabled = this.disabled),
                'normal')
          },
          local_element_id: function () {
            var e = this.elementId
            return e || null
          },
          wrapClasses: function () {
            var e = []
            return (
              this.size && e.push('ivu-switch-group-' + this.size), e.join(' ')
            )
          }
        },
        created: function () {
          ;(null !== this.currentValue && void 0 !== this.currentValue) ||
            (this.currentValue = !1)
        },
        methods: {
          onChange: function (e) {
            this.isRegisterDsUpdateEvent ||
              this.$nextTick(function () {
                this.$emit('on-change', e)
              })
          }
        },
        mounted: function () {
          var e = this.$el,
            t = this.$el.children[0]
          if (
            this.viewonly &&
            e.getElementsByClassName('ivu-icon').length > 0
          ) {
            var n = t.children[0]
            t.removeChild(n),
              this.currentValue ? (t.innerHTML = '是') : (t.innerHTML = '否')
          }
          this.$nextTick(function () {
            var e = this
            setTimeout(function () {
              !0 === e.readonly && (e.local_data_disabled = !0)
            }, 0)
          }),
            '2.0' != r.default.getVuiVersion(this) &&
              (this.isRegisterDsUpdateEvent = r.default.registerDsUpdateEvent({
                vueObj: this
              }))
        }
      }
    },
    'wEWp': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('rp7/'),
        r = n.n(o)
      for (var i in o)
        'default' !== i &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(i)
      var l = n('06wo'),
        a = (n.n(l), n('XyMi')),
        u = Object(a.a)(r.a, l.render, l.staticRenderFns, !1, null, null, null)
      t.default = u.exports
    }
  })
})
