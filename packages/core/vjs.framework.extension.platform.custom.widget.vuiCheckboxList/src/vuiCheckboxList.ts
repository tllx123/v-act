!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'),
      require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
    )
  else if ('function' == typeof define && define.amd)
    define([
      'Vue',
      'vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9',
      'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649',
      'vPlatform-resource-caf94787885743c8664a5bf624698d3f'
    ], t)
  else {
    var i =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'),
            require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
          )
        : t(
            e.Vue,
            e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'],
            e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'],
            e['vPlatform-resource-caf94787885743c8664a5bf624698d3f']
          )
    for (var a in i) ('object' == typeof exports ? exports : e)[a] = i[a]
  }
})('undefined' != typeof self ? self : this, function (e, t, i, a) {
  return (function (e) {
    function t(a) {
      if (i[a]) return i[a].exports
      var r = (i[a] = { i: a, l: !1, exports: {} })
      return e[a].call(r.exports, r, r.exports, t), (r.l = !0), r.exports
    }
    var i = {}
    return (
      (t.m = e),
      (t.c = i),
      (t.d = function (e, i, a) {
        t.o(e, i) ||
          Object.defineProperty(e, i, {
            configurable: !1,
            enumerable: !0,
            get: a
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
    '4Pzh': function (e, t) {
      e.exports = a
    },
    '7G7E': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t
          return e.viewonly
            ? i('vuiFormLabel', { attrs: { value: e.displayValue } })
            : i(
                'CheckboxGroup',
                {
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
                    'Checkbox',
                    {
                      key: t.value,
                      attrs: {
                        label: t.value,
                        disabled: !!e.disabled || e.groupDisabled[t.groupId]
                      }
                    },
                    [i('span', [e._v(e._s(t.text))])]
                  )
                }),
                1
              )
        },
        r = []
      ;(t.render = a), (t.staticRenderFns = r)
    },
    '9E2R': function (e, i) {
      e.exports = t
    },
    'Iaf/': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = i('qbgQ'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(a)
      t.default = r.default
    },
    'JkW7': function (e, t, i) {
      'use strict'
      function a(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('ZV4b'),
        u = a(r),
        n = i('Iaf/'),
        s = a(n),
        o = i('lRwf'),
        l = a(o)
      l.default.component(u.default.name, u.default),
        l.default.component(s.default.name, s.default),
        (t.default = { vuiCheckboxList: u.default, vuiCheckboxItem: s.default })
    },
    'JvSZ': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiCheckboxItem',
          props: {
            value: String | Number,
            text: String | Number,
            itemDisabled: { type: Boolean, default: !1 },
            groupId: { type: Number, default: 1 }
          }
        })
    },
    'Ug0N': function (e, t) {
      e.exports = i
    },
    'XyMi': function (e, t, i) {
      'use strict'
      function a(e, t, i, a, r, u, n, s) {
        e = e || {}
        var o = typeof e.default
        ;('object' !== o && 'function' !== o) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = i), (l._compiled = !0)),
          a && (l.functional = !0),
          u && (l._scopeId = u)
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
                  r && r.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(n)
              }),
              (l._ssrRegister = d))
            : r &&
              (d = s
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          d)
        )
          if (l.functional) {
            l._injectStyles = d
            var f = l.render
            l.render = function (e, t) {
              return d.call(t), f(e, t)
            }
          } else {
            var c = l.beforeCreate
            l.beforeCreate = c ? [].concat(c, d) : [d]
          }
        return { exports: e, options: l }
      }
      t.a = a
    },
    'ZV4b': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = i('pnfc'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(a)
      t.default = r.default
    },
    'lRwf': function (t, i) {
      t.exports = e
    },
    'pnfc': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = i('vBwT'),
        r = i.n(a)
      for (var u in a)
        'default' !== u &&
          (function (e) {
            i.d(t, e, function () {
              return a[e]
            })
          })(u)
      var n = i('7G7E'),
        s = (i.n(n), i('XyMi')),
        o = Object(s.a)(r.a, n.render, n.staticRenderFns, !1, null, null, null)
      t.default = o.exports
    },
    'qbgQ': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = i('JvSZ'),
        r = i.n(a)
      for (var u in a)
        'default' !== u &&
          (function (e) {
            i.d(t, e, function () {
              return a[e]
            })
          })(u)
      var n = i('tbzU'),
        s = (i.n(n), i('XyMi')),
        o = Object(s.a)(r.a, n.render, n.staticRenderFns, !1, null, null, null)
      t.default = o.exports
    },
    'tbzU': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)('div')
        },
        r = []
      ;(t.render = a), (t.staticRenderFns = r)
    },
    'vBwT': function (e, t, i) {
      'use strict'
      function a(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('9E2R'),
        u = a(r),
        n = i('Ug0N'),
        s = a(n),
        o = i('4Pzh'),
        l = a(o)
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
        name: 'vuiCheckboxList',
        props: {
          dataSource: {
            type: Object,
            default: function () {
              return {}
            }
          },
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
          itemValue: { type: String, default: 'id' },
          itemText: { type: String, default: 'text' },
          itemDisabled: { type: String, default: 'itemDisabled' },
          itemGroup: { type: String, default: 'groupId' },
          widgetCode: String,
          splitChar: { type: String, default: ',' },
          disabled: { type: Boolean, default: !1 },
          viewonly: { type: Boolean, default: !1 }
        },
        watch: {
          value: {
            handler: function (e, t) {
              var i = l.default.getVuiVersion(this)
              if (i && '2.0' === i) {
                this.updateDisplayText()
                var a = null
                return (
                  this.updateMode ||
                    ((this.updateMode = 'ui'), (a = !1), this.updateValue(e)),
                  'ds_update' === this.updateMode && (a = !0),
                  this.updateGroupDisableInfo(),
                  void this.triggerEvent(a, null)
                )
              }
              var r = this.filterValue(e),
                u = r.join(this.splitChar)
              if (this.textField) {
                var n = this.getDisplayValFromItemSource()
                this.dataSource[this.textField] != n &&
                  (this.dataSource[this.textField] = n)
              }
              this.dataSource[this.valueField] != u &&
                (this.dataSource[this.valueField] = u),
                this.updateGroupDisableInfo()
            },
            deep: !0
          },
          itemSource: {
            handler: function (e, t) {
              this.updateItems()
            },
            deep: !0
          },
          dataSource: {
            deep: !0,
            handler: function (e, t) {
              if (e && '{}' != JSON.stringify(e)) {
                var i = e[this.valueField],
                  a = l.default.getVuiVersion(this)
                if (a && '2.0' === a) {
                  if ('ui' === this.updateMode) return
                  e._metadata_ && 'ds_update' === e._metadata_.updateMode
                    ? ((this.updateMode = e._metadata_.updateMode),
                      delete e._metadata_.updateMode)
                    : (this.updateMode = 'ds_other')
                } else if (this.oldDataSource[this.valueField] == i) return
                try {
                  this.value = i.split(this.splitChar)
                } catch (e) {
                  this.value = []
                }
              } else this.value = []
            }
          }
        },
        data: function () {
          return {
            value: this.dataSource[this.valueField]
              ? this.dataSource[this.valueField].split(this.splitChar)
              : [],
            items: [],
            groupDisabled: {},
            isRegisterDsUpdateEvent: !1,
            isDataSourceChange: !1,
            isValueChange: !1,
            updateMode: null
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
          this.updateItems(), this.updateGroupDisableInfo()
        },
        mounted: function () {
          this.value.length > 0 && this.handleChange(this.value),
            '2.0' != l.default.getVuiVersion(this) &&
              (this.isRegisterDsUpdateEvent = l.default.registerDsUpdateEvent({
                vueObj: this
              }))
        },
        methods: {
          triggerEvent: function (e, t) {
            var i = this
            this.isRegisterDsUpdateEvent ||
              null === e ||
              (!0 === e
                ? this.$emit('on-change')
                : !1 === e &&
                  this.$nextTick(function () {
                    i.$emit('on-change')
                  }))
            var a = t
            this.$nextTick(function () {
              i.updateMode = a
            })
          },
          updateDisplayText: function () {
            if (this.textField) {
              var e = this.getDisplayValFromItemSource()
              this.dataSource[this.textField] != e &&
                (this.textField != this.valueField && (this.isValueChange = !0),
                (this.dataSource[this.textField] = e),
                (this.isValueChange = !1))
            }
          },
          updateValue: function (e) {
            var t = this.filterValue(e),
              i = t.join(this.splitChar)
            this.dataSource[this.valueField] != i &&
              (this.dataSource[this.valueField] = i)
          },
          isNeedUpdate: function (e) {
            var t = this.dataSource._metadata_
              ? this.dataSource._metadata_.dsName
              : null
            if (t && this.$root && this.$root[t] && this.$root[t].current) {
              return this.$root[t].current[this.valueField] != e
            }
            return this.oldDataSource[this.valueField] != e
          },
          filterValue: function (e) {
            for (var t = [], i = {}, a = 0, r = this.items.length; a < r; a++) {
              i[this.items[a].value] = !0
            }
            for (var a = 0, r = e.length; a < r; a++) {
              var u = e[a]
              i[e[a]] && t.push(u)
            }
            return t
          },
          getDisplayValFromItemSource: function () {
            for (var e = [], t = 0, i = this.value.length; t < i; t++)
              for (var a = 0, r = this.items.length; a < r; a++) {
                var u = this.items[a]
                if (u.value == this.value[t]) {
                  e.push(u.text)
                  break
                }
              }
            return e.join(this.splitChar)
          },
          getValueFromItemSource: function (e) {
            if (!e || 'string' != typeof e) return e
            for (
              var t = e.split(this.splitChar), i = [], a = 0, r = t.length;
              a < r;
              a++
            )
              for (var u = 0, n = this.items.length; u < n; u++) {
                var s = this.items[u]
                if (s.value == t[a] || s.text == t[a]) {
                  i.push(s.value)
                  break
                }
              }
            return i.join(this.splitChar)
          },
          getDisplayValFromItemSourceFix: function (e) {
            for (var t = [], i = 0, a = e.length; i < a; i++)
              for (var r = 0, u = this.items.length; r < u; r++) {
                var n = this.items[r]
                if (n.value == value[i]) {
                  t.push(n.text)
                  break
                }
              }
            return t.join(this.splitChar)
          },
          updateItems: function () {
            var e = []
            this.groupDisabled = {}
            for (
              var t = {},
                i = s.default.genUUID(),
                a = [],
                r = 0,
                u = this.itemSource.length;
              r < u;
              r++
            ) {
              var n = this.itemSource[r],
                o = n[this.itemValue],
                l = n[this.itemText]
              t[o] = r
              var d
              ;(d =
                void 0 === n[this.itemGroup] || '' == n[this.itemGroup]
                  ? i
                  : n[this.itemGroup]),
                -1 != this.value.indexOf(o) && a.push(d),
                this.groupDisabled.hasOwnProperty(d) ||
                  (this.groupDisabled[d] = !1),
                e.push({ value: o, text: l, groupId: d })
            }
            if (this.$slots.default)
              for (var r = 0, f = this.$slots.default.length; r < f; r++) {
                var c = this.$slots.default[r]
                if (c.tag && -1 !== c.tag.indexOf('vuiCheckboxItem')) {
                  var h = c.componentOptions.propsData
                  if (h) {
                    var p = {}
                    ;(p.value = h.value),
                      (p.text = h.hasOwnProperty('text') ? h.text : h.value)
                    var v = h.groupId
                    v || (v = i),
                      -1 != this.value.indexOf(h.value) && a.push(v),
                      (p.groupId = v)
                    var m = t[h.value]
                    void 0 != m ? (e[m] = p) : e.push(p),
                      this.groupDisabled.hasOwnProperty(v) ||
                        (this.groupDisabled[v] = !1)
                  }
                }
              }
            if (a.length > 0)
              for (var d in this.groupDisabled)
                -1 != a.indexOf(d)
                  ? (this.groupDisabled[d] = !1)
                  : (this.groupDisabled[d] = !0)
            this.items = e
          },
          getFilteredValue: function () {
            for (var e = [], t = 0, i = this.value.length; t < i; t++) {
              var a = this.value[t]
              this.getItemByVal(a) && e.push(a)
            }
            return e
          },
          updateGroupDisableInfo: function () {
            var e = this.getFilteredValue(),
              t = {},
              i = e.length
            if (i > 0)
              for (var a = 0, r = e.length; a < r; a++) {
                var u = this.getItemByVal(e[a])
                t[u.groupId] = !0
              }
            for (var n in this.groupDisabled)
              this.groupDisabled.hasOwnProperty(n) &&
                (this.groupDisabled[n] = 0 != i && !t[n])
          },
          getItemByVal: function (e) {
            for (var t = 0, i = this.items.length; t < i; t++) {
              var a = this.items[t]
              if (e == a.value) return a
            }
            return null
          },
          handleChange: function (e) {}
        }
      }
    }
  })
})
