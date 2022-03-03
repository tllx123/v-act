!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(require('Vue'))
  else if ('function' == typeof define && define.amd) define(['Vue'], t)
  else {
    var a = t('object' == typeof exports ? require('Vue') : e.Vue)
    for (var n in a) ('object' == typeof exports ? exports : e)[n] = a[n]
  }
})('undefined' != typeof self ? self : this, function (e) {
  return (function (e) {
    function t(n) {
      if (a[n]) return a[n].exports
      var r = (a[n] = { i: n, l: !1, exports: {} })
      return e[n].call(r.exports, r, r.exports, t), (r.l = !0), r.exports
    }
    var a = {}
    return (
      (t.m = e),
      (t.c = a),
      (t.d = function (e, a, n) {
        t.o(e, a) ||
          Object.defineProperty(e, a, {
            configurable: !1,
            enumerable: !0,
            get: n
          })
      }),
      (t.n = function (e) {
        var a =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(a, 'a', a), a
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 'JkW7'))
    )
  })({
    '4qIs': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vui-cascader',
          props: {
            widgetCode: String,
            dataSource: {
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
            itemValue: String,
            itemText: String,
            itemPvalue: String,
            itemDisabled: { type: String, default: 'itemDisabled' },
            readonly: { type: Boolean, default: !1 },
            format: { type: String, default: ',' },
            disabled: { type: Boolean, default: !1 },
            clearable: { type: Boolean, default: !0 },
            placeholder: { type: String, default: '请选择' },
            trigger: { type: String, default: 'click' },
            changeOnSelect: { type: Boolean, default: !1 },
            size: String,
            loadData: Function,
            filterable: { type: Boolean, default: !1 },
            notFoundText: { type: String, default: '无匹配数据' },
            transfer: { type: Boolean, default: !1 },
            elementId: String
          },
          data: function () {
            return { cascaderData: [], _cascaderValue: [] }
          },
          methods: {
            handlerChange: function (e, t) {
              this.changeDataSource(e), this.$emit('on-change', e, t)
            },
            handlerVisibleChange: function (e) {
              this.$emit('on-visible-change', e)
            },
            toCascaderList: function (e) {
              e.forEach(function (e) {
                delete e.children
              })
              var t = {}
              e.forEach(function (e) {
                t[e.value] = e
              })
              var a = []
              return (
                e.forEach(function (e) {
                  var n = t[e.pvalue]
                  n ? (n.children || (n.children = [])).push(e) : a.push(e)
                }),
                a
              )
            },
            updateItems: function () {
              for (var e = [], t = 0, a = this.itemSource.length; t < a; t++) {
                var n = this.itemSource[t],
                  r = n[this.itemValue],
                  i = n[this.itemText],
                  o = n[this.itemPvalue],
                  u = n[this.itemDisabled]
                e.push({ value: r, label: i, pvalue: o, disabled: u })
              }
              this.cascaderData = this.toCascaderList(e)
            },
            getSelectValue: function (e) {
              for (var t = 0; t < this.itemSource.length; t++)
                this.itemSource[t][this.itemValue] === e &&
                  (this._cascaderValue.unshift(e),
                  '' != this.itemSource[t][this.itemPvalue] &&
                    this.getSelectValue(this.itemSource[t][this.itemPvalue]))
              return this._cascaderValue
            },
            getTextFieldFromItemSource: function (e) {
              for (var t = 0; t < this.itemSource.length; t++)
                if (this.itemSource[t][this.itemValue] === e)
                  return this.itemSource[t][this.itemText]
            },
            changeDataSource: function (e) {
              e &&
                ((this.dataSource[this.valueField] = e[e.length - 1]),
                (this.dataSource[this.textField] =
                  this.getTextFieldFromItemSource(
                    this.dataSource[this.valueField]
                  )))
            },
            renderFormat: function (e, t) {
              return e.join(' ' + this.format + ' ')
            }
          },
          created: function () {
            this.updateItems()
          },
          computed: {
            cascaderValue: {
              get: function () {
                return (
                  (this._cascaderValue = []),
                  this.getSelectValue(this.dataSource[this.valueField])
                )
              },
              set: function () {}
            },
            _disabled: function () {
              if (!0 === this.disabled || !0 === this.readonly) return !0
            }
          },
          watch: {
            itemSource: function (e) {
              e && e.length > 0 && this.updateItems()
            }
          }
        })
    },
    'JkW7': function (e, t, a) {
      'use strict'
      function n(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = a('sF0R'),
        i = n(r)
      n(a('lRwf')).default.component(i.default.name, i.default),
        (t.default = { vuiCascader: i.default })
    },
    'V4qt': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)('Cascader', {
            staticClass: 'vui-cascader',
            class: {
              'vui-cascader-readonly': e.readonly,
              'vui-cascader-disabled': e.disabled
            },
            attrs: {
              'data': e.cascaderData,
              'render-format': e.renderFormat,
              'disabled': e._disabled,
              'clearable': e.clearable,
              'placeholder': e.placeholder,
              'trigger': e.trigger,
              'change-on-select': e.changeOnSelect,
              'size': e.size,
              'load-data': e.loadData,
              'filterable': e.filterable,
              'not-found-text': e.notFoundText,
              'transfer': e.transfer,
              'element-id': e.elementId,
              'widgetCode': e.widgetCode
            },
            on: {
              'on-change': e.handlerChange,
              'on-visible-change': e.handlerVisibleChange
            },
            model: {
              value: e.cascaderValue,
              callback: function (t) {
                e.cascaderValue = t
              },
              expression: 'cascaderValue'
            }
          })
        },
        r = []
      ;(t.render = n), (t.staticRenderFns = r)
    },
    'XyMi': function (e, t, a) {
      'use strict'
      function n(e, t, a, n, r, i, o, u) {
        e = e || {}
        var l = typeof e.default
        ;('object' !== l && 'function' !== l) || (e = e.default)
        var c = 'function' == typeof e ? e.options : e
        t && ((c.render = t), (c.staticRenderFns = a), (c._compiled = !0)),
          n && (c.functional = !0),
          i && (c._scopeId = i)
        var s
        if (
          (o
            ? ((s = function (e) {
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
                  e && e._registeredComponents && e._registeredComponents.add(o)
              }),
              (c._ssrRegister = s))
            : r &&
              (s = u
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          s)
        )
          if (c.functional) {
            c._injectStyles = s
            var d = c.render
            c.render = function (e, t) {
              return s.call(t), d(e, t)
            }
          } else {
            var f = c.beforeCreate
            c.beforeCreate = f ? [].concat(f, s) : [s]
          }
        return { exports: e, options: c }
      }
      t.a = n
    },
    'Z/gd': function (e, t) {},
    'aFB8': function (e, t, a) {
      'use strict'
      function n(e) {
        a('Z/gd')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = a('4qIs'),
        i = a.n(r)
      for (var o in r)
        'default' !== o &&
          (function (e) {
            a.d(t, e, function () {
              return r[e]
            })
          })(o)
      var u = a('V4qt'),
        l = (a.n(u), a('XyMi')),
        c = n,
        s = Object(l.a)(
          i.a,
          u.render,
          u.staticRenderFns,
          !1,
          c,
          'data-v-1099d10c',
          null
        )
      t.default = s.exports
    },
    'lRwf': function (t, a) {
      t.exports = e
    },
    'sF0R': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = a('aFB8'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = r.default
    }
  })
})
