!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-caf94787885743c8664a5bf624698d3f'], t)
  else {
    var r =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
          )
        : t(e.Vue, e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'])
    for (var n in r) ('object' == typeof exports ? exports : e)[n] = r[n]
  }
})('undefined' != typeof self ? self : this, function (e, t) {
  return (function (e) {
    function t(n) {
      if (r[n]) return r[n].exports
      var i = (r[n] = { i: n, l: !1, exports: {} })
      return e[n].call(i.exports, i, i.exports, t), (i.l = !0), i.exports
    }
    var r = {}
    return (
      (t.m = e),
      (t.c = r),
      (t.d = function (e, r, n) {
        t.o(e, r) ||
          Object.defineProperty(e, r, {
            configurable: !1,
            enumerable: !0,
            get: n
          })
      }),
      (t.n = function (e) {
        var r =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(r, 'a', r), r
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 'JkW7'))
    )
  })({
    '4Pzh': function (e, r) {
      e.exports = t
    },
    'JkW7': function (e, t, r) {
      'use strict'
      function n(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = r('wUhx'),
        o = n(i)
      n(r('lRwf')).default.component(o.default.name, o.default),
        (t.default = { vuiRecordNavigator: o.default })
    },
    'RVBH': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function () {
          var e = this,
            t = e.$createElement,
            r = e._self._c || t
          return r(
            'div',
            { staticStyle: { display: 'inline-block' } },
            [
              r('iButton', {
                attrs: {
                  type: 'text',
                  icon: 'android-arrow-dropleft',
                  disabled: e.preButtonDisabled
                },
                on: { click: e.scrollPrev }
              }),
              e._v(' '),
              'index' == e.mode || 'field' == e.mode
                ? r('span', { domProps: { textContent: e._s(e.displayValue) } })
                : e._e(),
              e._v(' '),
              e._t('default', null, { else: '' }),
              e._v(' '),
              r('iButton', {
                attrs: {
                  type: 'text',
                  icon: 'android-arrow-dropright',
                  disabled: e.nextButtonDisabled
                },
                on: { click: e.scrollNext }
              })
            ],
            2
          )
        },
        i = []
      ;(t.render = n), (t.staticRenderFns = i)
    },
    'XyMi': function (e, t, r) {
      'use strict'
      function n(e, t, r, n, i, o, u, s) {
        e = e || {}
        var a = typeof e.default
        ;('object' !== a && 'function' !== a) || (e = e.default)
        var c = 'function' == typeof e ? e.options : e
        t && ((c.render = t), (c.staticRenderFns = r), (c._compiled = !0)),
          n && (c.functional = !0),
          o && (c._scopeId = o)
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
                  i && i.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(u)
              }),
              (c._ssrRegister = d))
            : i &&
              (d = s
                ? function () {
                    i.call(this, this.$root.$options.shadowRoot)
                  }
                : i),
          d)
        )
          if (c.functional) {
            c._injectStyles = d
            var l = c.render
            c.render = function (e, t) {
              return d.call(t), l(e, t)
            }
          } else {
            var f = c.beforeCreate
            c.beforeCreate = f ? [].concat(f, d) : [d]
          }
        return { exports: e, options: c }
      }
      t.a = n
    },
    'hoLt': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r('4Pzh'),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = {
        name: 'vuiRecordNavigator',
        props: {
          dataSource: {
            type: Array,
            default: function () {
              return []
            }
          },
          mode: { type: String, default: 'index' },
          defaultSelection: { type: String, default: 'first' },
          displayField: { type: String, default: null },
          entityCode: String
        },
        data: function () {
          return {
            preButtonDisabled: !0,
            nextButtonDisabled: !1,
            currentIndex:
              this.dataSource.length > 0
                ? 'first' == this.defaultSelection
                  ? 1
                  : this.dataSource.length
                : -1,
            currentRecord:
              this.dataSource.length > 0
                ? 'first' == this.defaultSelection
                  ? this.dataSource[0]
                  : this.dataSource[this.dataSource.length - 1]
                : null,
            displayValue: ''
          }
        },
        watch: {
          currentRecord: function () {
            this.genDisplayValue()
          },
          currentIndex: function () {
            this.genDisplayValue()
          },
          dataSource: {
            deep: !0,
            handler: function () {
              this.genDisplayValue()
            }
          }
        },
        methods: {
          genDisplayValue: function () {
            ;-1 == this.currentIndex &&
              ((this.currentIndex =
                'first' == this.defaultSelection ? 1 : this.dataSource.length),
              (this.currentRecord = this.dataSource[this.currentIndex - 1])),
              'index' == this.mode
                ? (this.displayValue =
                    this.currentIndex + '/' + this.dataSource.length)
                : 'field' == this.mode &&
                  (this.displayValue = this.currentRecord
                    ? this.currentRecord[this.displayField]
                    : ''),
              (this.preButtonDisabled = 1 == this.currentIndex),
              (this.nextButtonDisabled =
                this.currentIndex == this.dataSource.length)
          },
          scrollPrev: function () {
            this.currentIndex > 1 &&
              ((this.preIconDisable = !1),
              this.currentIndex--,
              (this.currentRecord = this.dataSource[this.currentIndex - 1]),
              1 == this.currentIndex && (this.preIconDisable = !0),
              i.default.synCurrentRecordToDs(
                this,
                this.entityCode,
                this.currentRecord
              ),
              this.$emit('on-change', this.currentRecord))
          },
          scrollNext: function () {
            this.currentIndex < this.dataSource.length &&
              (this.currentIndex++,
              (this.currentRecord = this.dataSource[this.currentIndex - 1]),
              this.currentIndex == this.dataSource.length &&
                (this.nextIconDisable = !0),
              i.default.synCurrentRecordToDs(
                this,
                this.entityCode,
                this.currentRecord
              ),
              this.$emit('on-change', this.currentRecord))
          }
        },
        mounted: function () {
          i.default.registerCurrentHandler(
            this,
            (function (e) {
              return function (t, r) {
                e.entityCode === t &&
                  e.$nextTick(function () {
                    if (e.dataSource.length > 0)
                      for (
                        var t = r.getSysId(), n = 0, i = e.dataSource.length;
                        n < i;
                        n++
                      ) {
                        var o = e.dataSource[n]
                        if (t == o.id) {
                          ;(e.currentIndex = n + 1), (e.currentRecord = o)
                          break
                        }
                      }
                  })
              }
            })(this)
          ),
            this.dataSource.length > 0 &&
              (this.genDisplayValue(),
              i.default.synCurrentRecordToDs(
                this,
                this.entityCode,
                this.currentRecord
              ),
              this.$emit('on-change', this.currentRecord))
        }
      }
    },
    'lRwf': function (t, r) {
      t.exports = e
    },
    'sjpu': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r('hoLt'),
        i = r.n(n)
      for (var o in n)
        'default' !== o &&
          (function (e) {
            r.d(t, e, function () {
              return n[e]
            })
          })(o)
      var u = r('RVBH'),
        s = (r.n(u), r('XyMi')),
        a = Object(s.a)(i.a, u.render, u.staticRenderFns, !1, null, null, null)
      t.default = a.exports
    },
    'wUhx': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r('sjpu'),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = i.default
    }
  })
})
