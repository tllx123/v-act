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
    '1MvA': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('rH/7'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = r.default
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
      var r = n('1MvA'),
        i = o(r)
      o(n('lRwf')).default.component(i.default.name, i.default),
        (t.default = { vuiInputNumber: i.default })
    },
    'ScV7': function (e, t, n) {
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
              attrs: { code: 'newInput' },
              on: {
                onChange: e.onChange,
                onFocus: function (t) {
                  return e.onFocus()
                },
                onBlur: function (t) {
                  return e.onBlur()
                }
              }
            },
            [
              'viewonly' != e.local_showType
                ? [
                    n('InputNumber', {
                      ref: 'vuiInputNumber',
                      attrs: {
                        size: e.size,
                        max: e.max,
                        min: e.min,
                        step: e.step,
                        precision: e.precision,
                        disabled: e.local_data_disabled,
                        readonly: e.local_data_readonly,
                        viewonly: e.local_data_viewonly,
                        elementId: e.elementId
                      },
                      on: {
                        'on-change': e.onChange,
                        'on-focus': function (t) {
                          return e.onFocus()
                        },
                        'on-blur': function (t) {
                          return e.onBlur()
                        }
                      },
                      model: {
                        value: e.vModel,
                        callback: function (t) {
                          e.vModel = t
                        },
                        expression: 'vModel'
                      }
                    })
                  ]
                : n('vui-form-label', {
                    attrs: {
                      id: e.local_element_id,
                      value: e.currentValue,
                      format: e.format
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
        r = []
      ;(t.render = o), (t.staticRenderFns = r)
    },
    'VMkr': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('4Pzh'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(o)
      t.default = {
        name: 'vuiInputNumber',
        props: {
          showmode: String,
          placeholder: String,
          max: { type: Number, default: 1 / 0 },
          min: { type: Number, default: -1 / 0 },
          step: { type: Number, default: 1 },
          value: { type: Number, default: null },
          size: String,
          format: String,
          disabled: { type: Boolean, default: !1 },
          readonly: { type: Boolean, default: !1 },
          viewonly: { type: Boolean, default: !1 },
          elementId: String,
          precision: { type: Number },
          width: { type: String }
        },
        data: function () {
          return {
            local_data_readonly: !1,
            local_data_disabled: !1,
            local_data_viewonly: !1,
            valueChange: !1,
            vModel: this.value,
            currentValue: this.value,
            isRegisterDsUpdateEvent: !1
          }
        },
        watch: {
          value: function (e) {
            this.vModel != e &&
              ((this.vModel = e),
              (this.currentValue = e),
              this.isRegisterDsUpdateEvent ||
                ((this.valueChange = !0),
                this.$emit('on-change'),
                (this.valueChange = !1)))
          },
          vModel: {
            sync: !0,
            handler: function (e) {
              ;(this.currentValue = e), this.$emit('input', e)
            }
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
              this.size && e.push('ivu-input-number-group-' + this.size),
              e.join(' ')
            )
          }
        },
        created: function () {},
        methods: {
          onBlur: function (e) {
            this.$emit('on-blur', e)
          },
          onChange: function (e) {
            this.valueChange ||
              this.isRegisterDsUpdateEvent ||
              this.$emit('on-change', e)
          },
          onFocus: function (e) {
            this.$emit('on-focus', e)
          },
          removeCusorInReadonly: function () {
            if (!0 === this.local_data_readonly) {
              this.$refs.vuiInputNumber.$el
                .querySelector('.ivu-input-number-input')
                .setAttribute('unselectable', 'on')
            }
          },
          setInputWidth: function () {
            if (this.width) {
              var e,
                t = this.$refs.vuiInputNumber.$el
              ;(e =
                'number' == typeof this.width ? this.width + 'px' : this.width),
                (t.querySelector('.ivu-input-number').style.width = e)
            }
          }
        },
        mounted: function () {
          'textarea' !== this.type
            ? ((this.prepend = void 0 !== this.$slots.prepend),
              (this.append = void 0 !== this.$slots.append))
            : ((this.prepend = !1), (this.append = !1)),
            (this.slotReady = !0),
            '2.0' != r.default.getVuiVersion(this) &&
              (this.isRegisterDsUpdateEvent = r.default.registerDsUpdateEvent({
                vueObj: this
              })),
            this.$nextTick(function () {
              var e = this
              setTimeout(function () {
                e.removeCusorInReadonly()
              }, 0)
            })
        }
      }
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function o(e, t, n, o, r, i, u, a) {
        e = e || {}
        var s = typeof e.default
        ;('object' !== s && 'function' !== s) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
          o && (l.functional = !0),
          i && (l._scopeId = i)
        var d
        if (
          (u
            ? ((d = function (e) {
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
                  e && e._registeredComponents && e._registeredComponents.add(u)
              }),
              (l._ssrRegister = d))
            : r &&
              (d = a
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          d)
        )
          if (l.functional) {
            l._injectStyles = d
            var c = l.render
            l.render = function (e, t) {
              return d.call(t), c(e, t)
            }
          } else {
            var f = l.beforeCreate
            l.beforeCreate = f ? [].concat(f, d) : [d]
          }
        return { exports: e, options: l }
      }
      t.a = o
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'rH/7': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('VMkr'),
        r = n.n(o)
      for (var i in o)
        'default' !== i &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(i)
      var u = n('ScV7'),
        a = (n.n(u), n('XyMi')),
        s = Object(a.a)(r.a, u.render, u.staticRenderFns, !1, null, null, null)
      t.default = s.exports
    }
  })
})
