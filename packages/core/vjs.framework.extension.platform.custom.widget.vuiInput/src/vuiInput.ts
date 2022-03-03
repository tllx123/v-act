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
      var i = (n[o] = { i: o, l: !1, exports: {} })
      return e[o].call(i.exports, i, i.exports, t), (i.l = !0), i.exports
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
    '4Pzh': function (e, n) {
      e.exports = t
    },
    '9sCm': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('TOyT'),
        i = n.n(o)
      for (var r in o)
        'default' !== r &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(r)
      var u = n('JfOO'),
        s = (n.n(u), n('XyMi')),
        a = Object(s.a)(i.a, u.render, u.staticRenderFns, !1, null, null, null)
      t.default = a.exports
    },
    'JfOO': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'div',
            {
              class: e.wrapClasses,
              attrs: { widgetCode: e.widgetCode },
              on: {
                onEnter: function (t) {
                  return e.onEnter()
                },
                onClick: function (t) {
                  return e.onClick()
                },
                onChange: function (t) {
                  return e.onChange()
                },
                onFocus: function (t) {
                  return e.onFocus()
                },
                onBlur: function (t) {
                  return e.onBlur()
                },
                onKeyup: function (t) {
                  return e.onKeyup()
                },
                onKeydown: function (t) {
                  return e.onKeydown()
                },
                onKeypress: function (t) {
                  return e.onKeypress()
                }
              }
            },
            [
              e.cal_viewonly
                ? [
                    e.prepend
                      ? n(
                          'div',
                          {
                            directives: [
                              {
                                name: 'show',
                                rawName: 'v-show',
                                value: e.slotReady,
                                expression: 'slotReady'
                              }
                            ],
                            class: ['ivu-input-group-prepend']
                          },
                          [e._t('prepend')],
                          2
                        )
                      : e._e(),
                    e._v(' '),
                    n('i-input', {
                      ref: 'vuiInput',
                      class: e.hideIconClass,
                      attrs: {
                        placeholder: e.placeholder,
                        size: e.size,
                        type: e.local_type,
                        disabled: e.cal_disabled,
                        readonly: e.cal_readonly,
                        maxlength: e.maxlength,
                        icon: e.icon,
                        rows: e.rows,
                        autosize: e.autosize,
                        number: e.number,
                        autofocus: e.autofocus,
                        autocomplete: e.autocomplete,
                        elementId: e.elementId
                      },
                      on: {
                        'on-enter': e.onEnter,
                        'on-click': e.onClick,
                        'on-change': e.onChange,
                        'on-focus': e.onFocus,
                        'on-blur': e.onBlur,
                        'on-keyup': e.onKeyup,
                        'on-keydown': e.onKeydown,
                        'on-keypress': e.onKeypress
                      },
                      model: {
                        value: e.vModel,
                        callback: function (t) {
                          e.vModel = t
                        },
                        expression: 'vModel'
                      }
                    }),
                    e._v(' '),
                    e.append
                      ? n(
                          'div',
                          {
                            directives: [
                              {
                                name: 'show',
                                rawName: 'v-show',
                                value: e.slotReady,
                                expression: 'slotReady'
                              }
                            ],
                            class: ['ivu-input-group-append']
                          },
                          [e._t('append')],
                          2
                        )
                      : e._e()
                  ]
                : n('vui-form-label', {
                    class: e.wrapClasses,
                    attrs: {
                      id: e.local_element_id,
                      format: e.format,
                      value: e.currentText
                    },
                    on: {
                      'on-click': function (t) {
                        return e.onClick()
                      }
                    }
                  })
            ],
            2
          )
        },
        i = []
      ;(t.render = o), (t.staticRenderFns = i)
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function o(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('WLvk'),
        r = o(i)
      o(n('lRwf')).default.component(r.default.name, r.default),
        (t.default = { vuiInput: r.default })
    },
    'TOyT': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('4Pzh'),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = {
        name: 'vuiInput',
        props: {
          viewonly: { type: Boolean, default: !1 },
          widgetCode: { type: String },
          placeholder: String,
          size: String,
          type: { type: String, default: 'text' },
          format: String,
          visiable: { type: Boolean, default: !0 },
          value: { type: [String, Number], default: null },
          disabled: { type: Boolean, default: !1 },
          readonly: { type: Boolean, default: !1 },
          maxlength: Number,
          icon: String,
          rows: Number,
          autosize: { type: [Boolean, Object], default: !1 },
          number: { type: Boolean, default: !1 },
          autofocus: { type: Boolean, default: !1 },
          autocomplete: { type: String, default: 'off' },
          elementId: String
        },
        data: function () {
          return {
            vModel: this.value,
            prepend: !0,
            append: !0,
            slotReady: !1,
            valueChange: !1,
            isRegisterDsUpdateEvent: !1,
            currentText: this.value
          }
        },
        watch: {
          value: function (e) {
            this.vModel != e &&
              (this.changeValue(e),
              this.isRegisterDsUpdateEvent ||
                ((this.valueChange = !0),
                this.$emit('on-change'),
                (this.valueChange = !1)))
          },
          vModel: function (e) {
            ;(this.currentText = e), this.$emit('input', e)
          }
        },
        computed: {
          local_type: function () {
            var e = ['text', 'password', 'textarea'],
              t = this.type
            return t && -1 != e.indexOf(t) ? t : 'text'
          },
          local_element_id: function () {
            var e = this.elementId
            return e || null
          },
          wrapClasses: function () {
            var e = '',
              t = []
            return (
              t.push('ivu-input-wrapper'),
              (this.prepend || this.append) &&
                (t.push('ivu-input-group'),
                this.prepend && t.push('ivu-input-group-with-prepend'),
                this.append && t.push('ivu-input-group-with-append'),
                this.size && t.push('ivu-input-group-' + this.size)),
              t.length > 0 && (e = t.join(' ')),
              e
            )
          },
          hideIconClass: function () {
            return this.append ? 'ivu-input-hide-icon' : ''
          },
          cal_disabled: function () {
            return !this.checkViewOnly() && this.disabled
          },
          cal_readonly: function () {
            return !this.checkViewOnly() && this.readonly
          },
          cal_viewonly: function () {
            return !this.checkViewOnly()
          }
        },
        created: function () {},
        methods: {
          checkViewOnly: function () {
            var e = this.viewonly
            return 'boolean' == typeof e && !0 === e
          },
          onEnter: function (e) {
            var t = !e && event ? event : e
            this.$emit('on-enter', t)
          },
          onKeydown: function (e) {
            var t = !e && event ? event : e
            this.$emit('on-keydown', t)
          },
          onKeypress: function (e) {
            var t = !e && event ? event : e
            this.$emit('on-keypress', t)
          },
          onKeyup: function (e) {
            var t = !e && event ? event : e
            this.$emit('on-keyup', t)
          },
          onClick: function (e) {
            var t = !e && event ? event : e
            this.$emit('on-click', t)
          },
          onBlur: function (e) {
            var t = !e && event ? event : e
            this.$emit('on-blur', t)
          },
          onChange: function (e) {
            var t = !e && event ? event : e
            this.valueChange ||
              this.isRegisterDsUpdateEvent ||
              this.$nextTick(function () {
                this.$emit('on-change', t)
              })
          },
          onFocus: function (e) {
            this.$emit('on-focus')
          },
          changeValue: function (e) {
            this.vModel = e
          },
          removeCusorInReadonly: function () {
            if (!0 === this.cal_readonly) {
              this.$refs.vuiInput.$el
                .querySelector('.ivu-input')
                .setAttribute('unselectable', 'on')
            }
          }
        },
        mounted: function () {
          'textarea' !== this.type
            ? ((this.prepend = void 0 !== this.$slots.prepend),
              (this.append = void 0 !== this.$slots.append))
            : ((this.prepend = !1), (this.append = !1)),
            (this.slotReady = !0),
            '2.0' != i.default.getVuiVersion(this) &&
              (this.isRegisterDsUpdateEvent = i.default.registerDsUpdateEvent({
                vueObj: this
              })),
            this.$nextTick(function () {
              var e = this
              setTimeout(function () {
                e.removeCusorInReadonly()
              })
            })
        }
      }
    },
    'WLvk': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('9sCm'),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = i.default
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function o(e, t, n, o, i, r, u, s) {
        e = e || {}
        var a = typeof e.default
        ;('object' !== a && 'function' !== a) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
          o && (l.functional = !0),
          r && (l._scopeId = r)
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
                  i && i.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(u)
              }),
              (l._ssrRegister = c))
            : i &&
              (c = s
                ? function () {
                    i.call(this, this.$root.$options.shadowRoot)
                  }
                : i),
          c)
        )
          if (l.functional) {
            l._injectStyles = c
            var d = l.render
            l.render = function (e, t) {
              return c.call(t), d(e, t)
            }
          } else {
            var f = l.beforeCreate
            l.beforeCreate = f ? [].concat(f, c) : [c]
          }
        return { exports: e, options: l }
      }
      t.a = o
    },
    'lRwf': function (t, n) {
      t.exports = e
    }
  })
})
