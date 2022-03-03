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
    var i =
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
    for (var r in i) ('object' == typeof exports ? exports : e)[r] = i[r]
  }
})('undefined' != typeof self ? self : this, function (e, t, i) {
  return (function (e) {
    function t(r) {
      if (i[r]) return i[r].exports
      var a = (i[r] = { i: r, l: !1, exports: {} })
      return e[r].call(a.exports, a, a.exports, t), (a.l = !0), a.exports
    }
    var i = {}
    return (
      (t.m = e),
      (t.c = i),
      (t.d = function (e, i, r) {
        t.o(e, i) ||
          Object.defineProperty(e, i, {
            configurable: !1,
            enumerable: !0,
            get: r
          })
      }),
      (t.n = function (e) {
        var i =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(i, 'a', i), i
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 'JkW7'))
    )
  })({
    '0LGu': function (e, t, i) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = i('9E2R'),
        u = r(a),
        n = i('4Pzh'),
        l = r(n)
      t.default = {
        mixins: [
          u.default.vue.mixins.RecordMixin({
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
        name: 'vuiComboBox',
        props: {
          oldDataSource: {
            type: Object,
            default: function () {
              return {}
            }
          },
          valueField: String,
          textField: String,
          itemSource: {
            type: Array,
            default: function () {
              return []
            }
          },
          placeholder: { type: String },
          itemValue: { type: String, default: 'id' },
          itemText: { type: String, default: 'text' },
          widgetCode: String,
          splitChar: { type: String, default: ',' },
          disabled: { type: Boolean, default: !1 },
          readonly: { type: Boolean, default: !1 },
          viewonly: { type: Boolean, default: !1 },
          clearable: { type: Boolean, default: !1 },
          emptyMsg: { type: String, default: '无匹配数据' },
          multiple: { type: Boolean, default: !1 }
        },
        watch: {
          value: {
            handler: function (e, t) {
              if (this._hasSelectionItems()) {
                if (
                  ((this.isValueChange = !0),
                  this.textField && this.textField != this.valueField)
                ) {
                  for (
                    var i = '', r = [], a = 0, u = this.itemSource.length;
                    a < u;
                    a++
                  ) {
                    var n = this.itemSource[a]
                    if (!0 === this.multiple)
                      for (var l = 0; l < e.length; l++)
                        n[this.itemValue] == e[l] && r.push(n[this.itemText])
                    else if (n[this.itemValue] == e) {
                      i = n[this.itemText]
                      break
                    }
                  }
                  !0 === this.multiple
                    ? (this.dataSource[this.textField] = r.join(','))
                    : (this.dataSource[this.textField] = i)
                }
                ;(this.isValueChange = !1),
                  e != this.dataSource[this.valueField] &&
                    ((this.dataSource[this.valueField] = e),
                    !0 === this.multiple &&
                      (this.dataSource[this.valueField] = e.join(',')))
              }
            },
            deep: !0
          },
          itemSource: {
            handler: function (e, t) {
              this.items = this.getItems()
            },
            deep: !0
          },
          dataSource: {
            deep: !0,
            handler: function (e, t) {
              if (!this._hasSelectionItems())
                return (
                  (this.items = this._getItemsFromDatasource()),
                  void (this.value = this.dataSource[this.valueField])
                )
              if (this.textField) {
                for (
                  var i = '', r = 0, a = this.itemSource.length;
                  r < a;
                  r++
                ) {
                  var u = this.itemSource[r]
                  if (u[this.itemValue] == e[this.valueField]) {
                    i = u[this.itemText]
                    break
                  }
                }
                this.dataSource[this.textField] = i
              }
              this.oldDataSource[this.valueField] != e &&
                (this.multiple
                  ? e && this.value
                    ? this.value.join(',') != e[this.valueField] &&
                      (this.value =
                        null == e[this.valueField]
                          ? []
                          : e[this.valueField].split(','))
                    : (this.value = null)
                  : (this.value = e ? e[this.valueField] : null))
            }
          }
        },
        data: function () {
          return {
            value: this.dataSource[this.valueField]
              ? this.multiple
                ? this.dataSource[this.valueField].split(',')
                : this.dataSource[this.valueField]
              : null,
            items: [],
            col_disabled: this.disabled,
            isValueChange: !1,
            isRegisterDsUpdateEvent: !1
          }
        },
        computed: {
          displayValue: function () {
            return this.textField
              ? this.dataSource[this.textField]
              : this.getDisplayValFromItemSource()
          }
        },
        created: function () {
          if (this.$slots.default)
            for (var e = 0, t = this.$slots.default.length; e < t; e++) {
              var i = this.$slots.default[e]
              if (i.tag && -1 !== i.tag.indexOf('vuiComboItem')) {
                var r = i.componentOptions.propsData
                if (r) {
                  var a = {}
                  ;(a[this.itemValue] = r.value),
                    (a[this.itemText] = r.hasOwnProperty('text')
                      ? r.text
                      : r.value),
                    this.itemSource.push(a)
                }
              }
            }
          this.items = this.getItems()
        },
        mounted: function () {
          '2.0' != l.default.getVuiVersion(this) &&
            (this.isRegisterDsUpdateEvent = l.default.registerDsUpdateEvent({
              vueObj: this
            })),
            this.$nextTick(function () {
              !0 === this.readonly && (this.col_disabled = !0)
            })
        },
        methods: {
          _getItemsFromDatasource: function () {
            var e = [],
              t = this.dataSource[this.textField],
              i = this.dataSource[this.valueField]
            if (t)
              for (
                var r = this.multiple ? t.split(',') : [t],
                  a = this.multiple ? (i ? i.split(',') : []) : [i],
                  u = 0,
                  n = r.length;
                u < n;
                u++
              ) {
                var l = r[u],
                  o = u >= a.length ? null : a[u]
                e.push({ text: l, value: o })
              }
            return e
          },
          _hasSelectionItems: function () {
            return this.itemSource && this.itemSource.length > 0
          },
          getDisplayValFromItemSource: function () {
            for (var e = '', t = 0, i = this.itemSource.length; t < i; t++) {
              var r = this.itemSource[t]
              if (r[this.itemValue] == this.value) {
                e = r[this.itemText]
                break
              }
            }
            return e
          },
          getItems: function () {
            if (!this._hasSelectionItems())
              return this._getItemsFromDatasource()
            for (var e = [], t = 0, i = this.itemSource.length; t < i; t++) {
              var r = this.itemSource[t]
              e.push({ value: r[this.itemValue], text: r[this.itemText] })
            }
            return e
          },
          handleChange: function (e) {}
        }
      }
    },
    '4Pzh': function (e, t) {
      e.exports = i
    },
    '6ozf': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('SZSe'),
        a = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = a.default
    },
    '9E2R': function (e, i) {
      e.exports = t
    },
    'C0+b': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('rliE'),
        a = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = a.default
    },
    'FOI2': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t
          return e.viewonly
            ? i('vuiFormLabel', { attrs: { value: e.displayValue } })
            : i(
                'Select',
                {
                  class: {
                    'vui-combo-box-readonly': e.readonly,
                    'vui-combo-box-disabled': e.disabled
                  },
                  attrs: {
                    'disabled': e.col_disabled,
                    'clearable': e.clearable,
                    'not-found-text': e.emptyMsg,
                    'multiple': e.multiple,
                    'placeholder': e.placeholder
                  },
                  on: { 'on-change': e.handleChange },
                  model: {
                    value: e.value,
                    callback: function (t) {
                      e.value = t
                    },
                    expression: 'value'
                  }
                },
                e._l(e.items, function (t) {
                  return i(
                    'Option',
                    { key: t.value, attrs: { value: t.value } },
                    [e._v('\n\t\t' + e._s(t.text) + '\n\t')]
                  )
                }),
                1
              )
        },
        a = []
      ;(t.render = r), (t.staticRenderFns = a)
    },
    'JkW7': function (e, t, i) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = i('6ozf'),
        u = r(a),
        n = i('C0+b'),
        l = r(n),
        o = i('lRwf'),
        s = r(o)
      s.default.component(u.default.name, u.default),
        s.default.component(l.default.name, l.default),
        (t.default = { vuiComboBox: u.default, vuiComboItem: l.default })
    },
    'SZSe': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('0LGu'),
        a = i.n(r)
      for (var u in r)
        'default' !== u &&
          (function (e) {
            i.d(t, e, function () {
              return r[e]
            })
          })(u)
      var n = i('FOI2'),
        l = (i.n(n), i('XyMi')),
        o = Object(l.a)(a.a, n.render, n.staticRenderFns, !1, null, null, null)
      t.default = o.exports
    },
    'XyMi': function (e, t, i) {
      'use strict'
      function r(e, t, i, r, a, u, n, l) {
        e = e || {}
        var o = typeof e.default
        ;('object' !== o && 'function' !== o) || (e = e.default)
        var s = 'function' == typeof e ? e.options : e
        t && ((s.render = t), (s.staticRenderFns = i), (s._compiled = !0)),
          r && (s.functional = !0),
          u && (s._scopeId = u)
        var d
        if (
          (n
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
                  a && a.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(n)
              }),
              (s._ssrRegister = d))
            : a &&
              (d = l
                ? function () {
                    a.call(this, this.$root.$options.shadowRoot)
                  }
                : a),
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
      t.a = r
    },
    'ZAIS': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiComboItem',
          props: { value: String | Number, text: String | Number }
        })
    },
    'hycE': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)('div')
        },
        a = []
      ;(t.render = r), (t.staticRenderFns = a)
    },
    'lRwf': function (t, i) {
      t.exports = e
    },
    'rliE': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('ZAIS'),
        a = i.n(r)
      for (var u in r)
        'default' !== u &&
          (function (e) {
            i.d(t, e, function () {
              return r[e]
            })
          })(u)
      var n = i('hycE'),
        l = (i.n(n), i('XyMi')),
        o = Object(l.a)(a.a, n.render, n.staticRenderFns, !1, null, null, null)
      t.default = o.exports
    }
  })
})
