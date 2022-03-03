!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
    )
  else if ('function' == typeof define && define.amd)
    define([
      'Vue',
      'vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9',
      'vPlatform-resource-caf94787885743c8664a5bf624698d3f'
    ], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
          )
        : t(
            e.Vue,
            e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'],
            e['vPlatform-resource-caf94787885743c8664a5bf624698d3f']
          )
    for (var i in n) ('object' == typeof exports ? exports : e)[i] = n[i]
  }
})('undefined' != typeof self ? self : this, function (e, t, n) {
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
    '4Pzh': function (e, t) {
      e.exports = n
    },
    '9E2R': function (e, n) {
      e.exports = t
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('sqWC'),
        o = i(r)
      i(n('lRwf')).default.component(o.default.name, o.default),
        (t.default = { vuiDictBox: o.default })
    },
    'NZzv': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return e.viewonly
            ? n('vuiFormLabel', { attrs: { value: e.displayValue } })
            : n('Input', {
                ref: 'vuiDictBoxInput',
                staticClass: 'vui-dict-box',
                class: {
                  'vui-dict-box-readonly': e.readonly,
                  'vui-dict-box-disabled': e.disabled
                },
                attrs: {
                  icon: 'android-open',
                  size: e.size,
                  placeholder: e.placeholder,
                  readonly: !0,
                  disabled: e._disabled
                },
                on: {
                  'on-change': e.handleChanged,
                  'on-focus': e.handleFocus,
                  'on-click': e.handleClick,
                  'on-blur': e.handleBlur
                },
                model: {
                  value: e.displayValue,
                  callback: function (t) {
                    e.displayValue = t
                  },
                  expression: 'displayValue'
                }
              })
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, r, o, a, u) {
        e = e || {}
        var l = typeof e.default
        ;('object' !== l && 'function' !== l) || (e = e.default)
        var s = 'function' == typeof e ? e.options : e
        t && ((s.render = t), (s.staticRenderFns = n), (s._compiled = !0)),
          i && (s.functional = !0),
          o && (s._scopeId = o)
        var d
        if (
          (a
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
                  e && e._registeredComponents && e._registeredComponents.add(a)
              }),
              (s._ssrRegister = d))
            : r &&
              (d = u
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          d)
        )
          if (s.functional) {
            s._injectStyles = d
            var c = s.render
            s.render = function (e, t) {
              return d.call(t), c(e, t)
            }
          } else {
            var f = s.beforeCreate
            s.beforeCreate = f ? [].concat(f, d) : [d]
          }
        return { exports: e, options: s }
      }
      t.a = i
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'sqWC': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('zkSZ'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    'wLCt': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('9E2R'),
        o = i(r),
        a = n('4Pzh'),
        u = i(a)
      t.default = {
        mixins: [
          o.default.vue.mixins.RecordMixin({
            prop: { name: 'dataSource' },
            event: {
              load: !1,
              change: {
                handler: function (e, t) {
                  e &&
                    e.hasOwnProperty(this.valueField) &&
                    !1 === this.isValueChange &&
                    this.$emit('on-change')
                }
              },
              currentChange: !1,
              selectionChange: !1
            }
          })
        ],
        name: 'vuiDictBox',
        props: {
          oldDataSource: {
            type: Object,
            default: function () {
              return {}
            }
          },
          valueField: { type: String, required: !0 },
          textField: { type: String, required: !0 },
          size: { type: String },
          placeholder: { type: String, default: '' },
          widgetCode: String,
          disabled: { type: Boolean, default: !1 },
          readonly: { type: Boolean, default: !1 },
          viewonly: { type: Boolean, default: !1 }
        },
        data: function () {
          return {
            isValueChange: !1,
            displayValue: this.dataSource[this.textField]
          }
        },
        watch: {
          displayValue: { handler: function (e) {}, deep: !0 },
          dataSource: {
            handler: function (e) {
              this.displayValue != e[this.textField] &&
                (this.textField != this.valueField && (this.isValueChange = !0),
                (this.displayValue = e[this.textField])),
                (this.isValueChange = !1)
            },
            deep: !0
          }
        },
        computed: {
          _disabled: function () {
            return !(!this.disabled && !this.readonly)
          }
        },
        mounted: function () {
          '2.0' != u.default.getVuiVersion(this) &&
            (this.isRegisterDsUpdateEvent = u.default.registerDsUpdateEvent({
              vueObj: this
            })),
            this.$nextTick(function () {})
        },
        methods: {
          handleChanged: function (e) {
            this.isRegisterDsUpdateEvent || this.$emit('on-change', e)
          },
          handleFocus: function (e) {
            this.$emit('on-focus', e)
          },
          handleClick: function (e) {
            1 != this.disabled && this.$emit('on-click', e)
          },
          handleBlur: function (e) {
            this.$emit('on-blur', e)
          }
        }
      }
    },
    'zkSZ': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('wLCt'),
        r = n.n(i)
      for (var o in i)
        'default' !== o &&
          (function (e) {
            n.d(t, e, function () {
              return i[e]
            })
          })(o)
      var a = n('NZzv'),
        u = (n.n(a), n('XyMi')),
        l = Object(u.a)(r.a, a.render, a.staticRenderFns, !1, null, null, null)
      t.default = l.exports
    }
  })
})
