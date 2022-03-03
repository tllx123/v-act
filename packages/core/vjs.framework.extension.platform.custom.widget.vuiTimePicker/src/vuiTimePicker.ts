!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f'),
      require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
    )
  else if ('function' == typeof define && define.amd)
    define([
      'Vue',
      'vPlatform-resource-caf94787885743c8664a5bf624698d3f',
      'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'
    ], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f'),
            require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
          )
        : t(
            e.Vue,
            e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'],
            e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649']
          )
    for (var r in n) ('object' == typeof exports ? exports : e)[r] = n[r]
  }
})('undefined' != typeof self ? self : this, function (e, t, n) {
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
    'IGR4': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('Mj8q'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = o.default
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('IGR4'),
        a = r(o)
      r(n('lRwf')).default.component(a.default.name, a.default),
        (t.default = { vuiTimePicker: a.default })
    },
    'Mj8q': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('Orzc'),
        o = n.n(r)
      for (var a in r)
        'default' !== a &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(a)
      var i = n('oe3H'),
        l = (n.n(i), n('XyMi')),
        u = Object(l.a)(o.a, i.render, i.staticRenderFns, !1, null, null, null)
      t.default = u.exports
    },
    'Orzc': function (e, t, n) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('4Pzh'),
        a = r(o),
        i = n('Ug0N'),
        l = r(i)
      t.default = {
        name: 'vuiTimePicker',
        props: {
          viewonly: { type: Boolean, default: !1 },
          widgetCode: { type: String },
          type: { type: String, default: 'date' },
          value: { type: String },
          format: { type: String },
          steps: {
            type: Array,
            default: function () {
              return []
            }
          },
          palcement: { type: String, default: 'bottom-start' },
          placeholder: { type: String, default: null },
          confirm: { type: Boolean, default: !1 },
          open: { type: Boolean, default: null },
          size: { type: String },
          disabled: { type: Boolean, default: !1 },
          clearable: { type: Boolean, default: !0 },
          readonly: { type: Boolean, default: !1 },
          editable: { type: Boolean, default: !0 },
          local_transfer: { type: Boolean, default: !1 },
          elementId: { type: String, default: '' }
        },
        data: function () {
          return {
            vModel: this.value,
            currentText: this.value,
            isRegisterDsUpdateEvent: !1
          }
        },
        create: function () {},
        mounted: function () {
          '2.0' != a.default.getVuiVersion(this) &&
            (this.isRegisterDsUpdateEvent = a.default.registerDsUpdateEvent({
              vueObj: this
            })),
            this.$nextTick(function () {
              var e = this
              setTimeout(function () {
                e.removeCursorInReadonly()
              })
            })
        },
        computed: {
          cal_disabled: function () {
            return !this.checkViewOnly() && this.disabled
          },
          cal_readonly: function () {
            return !this.checkViewOnly() && this.readonly
          },
          cal_viewonly: function () {
            return !this.checkViewOnly()
          },
          cal_type: function () {
            var e = this.type
            return e && 'timerange' == e ? 'timerange' : 'time'
          },
          cal_transfer: function () {
            var e = this.local_transfer
            return 'boolean' == typeof e && !0 === e
          }
        },
        watch: {
          value: function (e) {
            var e = this.value
            this.vModel = e
          },
          vModel: function (e) {
            var t = this.formatValue(e)
            ;(this.currentText = t),
              this.$emit('input', t),
              this.isRegisterDsUpdateEvent ||
                this.$nextTick(function () {
                  this.$emit('on-change')
                })
          }
        },
        methods: {
          formatValue: function (e) {
            if (!e) return e
            var t
            switch (this.type ? this.type : 'time') {
              case 'timerange':
                return e
              default:
                t = 'HH:mm:ss'
            }
            return l.default.localWijmoFunc_WijmoFormatDate(e, t)
          },
          getNativeVisualValue: function () {
            var e,
              t = this.$children
            return t && t.length > 0 && (e = this.$children[0].visualValue), e
          },
          checkViewOnly: function () {
            var e = this.viewonly
            return 'boolean' == typeof e && !0 === e
          },
          onChange: function (e) {
            this.isRegisterDsUpdateEvent ||
              this.$nextTick(function () {
                this.$emit('on-change')
              })
          },
          onOpenChange: function (e) {
            this.$emit('on-open-change', e)
          },
          onOk: function () {
            this.$emit('on-ok')
          },
          onClear: function () {
            this.$emit('on-clear')
          },
          removeCursorInReadonly: function () {
            if (!0 === this.readonly) {
              this.$refs.vuiTimePickerInput.$el
                .querySelector('.ivu-input')
                .setAttribute('unselectable', 'on')
            }
          }
        }
      }
    },
    'Ug0N': function (e, t) {
      e.exports = n
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function r(e, t, n, r, o, a, i, l) {
        e = e || {}
        var u = typeof e.default
        ;('object' !== u && 'function' !== u) || (e = e.default)
        var f = 'function' == typeof e ? e.options : e
        t && ((f.render = t), (f.staticRenderFns = n), (f._compiled = !0)),
          r && (f.functional = !0),
          a && (f._scopeId = a)
        var c
        if (
          (i
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
                  e && e._registeredComponents && e._registeredComponents.add(i)
              }),
              (f._ssrRegister = c))
            : o &&
              (c = l
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          c)
        )
          if (f.functional) {
            f._injectStyles = c
            var s = f.render
            f.render = function (e, t) {
              return c.call(t), s(e, t)
            }
          } else {
            var d = f.beforeCreate
            f.beforeCreate = d ? [].concat(d, c) : [c]
          }
        return { exports: e, options: f }
      }
      t.a = r
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'oe3H': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'div',
            {
              attrs: { transfer: e.local_transfer, widgetCode: e.widgetCode },
              on: {
                onChange: e.onChange,
                onOpenChange: e.onOpenChange,
                onOk: e.onOk,
                onClear: e.onClear
              }
            },
            [
              e.cal_viewonly
                ? [
                    n(
                      'Time-Picker',
                      {
                        ref: 'vuiTimePickerInput',
                        staticStyle: { width: '100%' },
                        attrs: {
                          'type': e.cal_type,
                          'format': e.format,
                          'steps': e.steps,
                          'palcement': e.palcement,
                          'placeholder': e.placeholder,
                          'confirm': e.confirm,
                          'open': e.open,
                          'size': e.size,
                          'disabled': e.cal_disabled,
                          'clearable': e.clearable,
                          'readonly': e.cal_readonly,
                          'editable': e.editable,
                          'transfer': e.local_transfer,
                          'element-id': e.elementId
                        },
                        on: {
                          'on-change': e.onChange,
                          'on-open-change': e.onOpenChange,
                          'on-ok': e.onOk,
                          'on-clear': e.onClear
                        },
                        model: {
                          value: e.vModel,
                          callback: function (t) {
                            e.vModel = t
                          },
                          expression: 'vModel'
                        }
                      },
                      [e._t('default')],
                      2
                    )
                  ]
                : [
                    n('vui-form-label', {
                      attrs: { value: e.currentText, format: e.format }
                    })
                  ]
            ],
            2
          )
        },
        o = []
      ;(t.render = r), (t.staticRenderFns = o)
    }
  })
})
