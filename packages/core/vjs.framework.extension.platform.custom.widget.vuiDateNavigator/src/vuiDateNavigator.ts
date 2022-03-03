!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-caf94787885743c8664a5bf624698d3f'], t)
  else {
    var a =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
          )
        : t(e.Vue, e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'])
    for (var n in a) ('object' == typeof exports ? exports : e)[n] = a[n]
  }
})('undefined' != typeof self ? self : this, function (e, t) {
  return (function (e) {
    function t(n) {
      if (a[n]) return a[n].exports
      var i = (a[n] = { i: n, l: !1, exports: {} })
      return e[n].call(i.exports, i, i.exports, t), (i.l = !0), i.exports
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
    '+90k': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = a('4Pzh'),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      ;(t.default = {
        name: 'vuiDateNavigator',
        props: {
          defaultValue: { type: String },
          step: { type: Number, default: 1 },
          value: String,
          min: String,
          max: String,
          format: { type: String, default: 'yyyy-MM-dd' },
          mode: { type: String, default: 'date' },
          entityCode: String
        },
        data: function () {
          return {
            preButtonDisabled: !1,
            nextButtonDisabled: !1,
            displayValue: '',
            dateSelected: '',
            isEntityChange: !1,
            isRegisterDsUpdateEvent: !1
          }
        },
        watch: {
          dateSelected: {
            handler: function (e, t) {
              this.value != this.dateSelected.Format(this.format) &&
                this.$emit(
                  'input',
                  this.dateSelected.Format(this.getValueFormat())
                ),
                this.genDisplayValue(),
                this.rangeCheck(),
                this.isRegisterDsUpdateEvent ||
                  this.$emit('on-change', this.value, t)
            },
            deep: !0
          },
          value: {
            deep: !0,
            handler: function (e, t) {
              '' != this.dateSelected &&
                this.value != this.dateSelected.Format(this.getValueFormat()) &&
                ((this.isEntityChange = !0),
                (this.dateSelected = new Date(this.valueToDate(this.value))),
                (this.isEntityChange = !1))
            }
          }
        },
        methods: {
          valueToDate: function (e) {
            if (e) {
              for (var t = e.split('-'); t.length < 3; ) t.push('01')
              return new Date(t.join('-'))
            }
            return null
          },
          getValueFormat: function () {
            var e
            switch (this.mode) {
              case 'year':
                e = 'yyyy'
                break
              case 'month':
                e = 'yyyy-MM'
                break
              case 'date':
                e = 'yyyy-MM-dd'
            }
            return e
          },
          getDisplayFormat: function () {
            var e = this.format
            if ('yyyy-MM-dd' == e)
              switch (this.mode) {
                case 'year':
                  e = 'yyyy'
                  break
                case 'month':
                  e = this.format.substr(0, 7)
                  break
                case 'date':
                  e = this.format
              }
            return e
          },
          genDisplayValue: function () {
            this.displayValue = this.dateSelected.Format(
              this.getDisplayFormat()
            )
          },
          scrollPrev: function () {
            var e = new Date(this.dateSelected.toString())
            switch (this.mode) {
              case 'year':
                e.setFullYear(this.dateSelected.getFullYear() - this.step)
                break
              case 'month':
                e.setMonth(this.dateSelected.getMonth() - this.step)
                break
              case 'date':
                e.setDate(this.dateSelected.getDate() - this.step)
            }
            this.dateSelected = e
          },
          scrollNext: function () {
            var e = new Date(this.dateSelected.toString())
            switch (this.mode) {
              case 'year':
                e.setFullYear(this.dateSelected.getFullYear() + this.step)
                break
              case 'month':
                e.setMonth(this.dateSelected.getMonth() + this.step)
                break
              case 'date':
                e.setDate(this.dateSelected.getDate() + this.step)
            }
            this.dateSelected = e
          },
          rangeCheck: function () {
            switch (this.mode) {
              case 'year':
                ;(this.nextButtonDisabled =
                  this.dateSelected.getFullYear() >=
                  new Date(this.max).getFullYear()),
                  (this.preButtonDisabled =
                    this.dateSelected.getFullYear() <=
                    new Date(this.min).getFullYear())
                break
              case 'month':
                ;(this.nextButtonDisabled =
                  this.dateSelected.getMonth() >=
                  new Date(this.max).getMonth()),
                  (this.preButtonDisabled =
                    this.dateSelected.getMonth() <=
                    new Date(this.min).getMonth())
                break
              case 'date':
                ;(this.nextButtonDisabled =
                  this.dateSelected >= new Date(this.max)),
                  (this.preButtonDisabled =
                    this.dateSelected <= new Date(this.min))
            }
          }
        },
        mounted: function () {
          this.$nextTick(function () {
            var e = this
            setTimeout(function () {
              e.defaultValue && e.defaultValue.length > 0
                ? (e.dateSelected = new Date(e.defaultValue))
                : e.value && e.value.length > 0
                ? (e.dateSelected = new Date(e.value))
                : (e.dateSelected = new Date())
            }, 0)
          }),
            '2.0' != i.default.getVuiVersion(this) &&
              (this.isRegisterDsUpdateEvent = i.default.registerDsUpdateEvent({
                vueObj: this
              }))
        }
      }),
        (Date.prototype.Format = function (e) {
          var t = {
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'q+': Math.floor((this.getMonth() + 3) / 3),
            'S+': this.getMilliseconds()
          }
          ;/(y+)/i.test(e) &&
            (e = e.replace(
              RegExp.$1,
              (this.getFullYear() + '').substr(4 - RegExp.$1.length)
            ))
          for (var a in t)
            new RegExp('(' + a + ')').test(e) &&
              (e = e.replace(
                RegExp.$1,
                1 == RegExp.$1.length
                  ? t[a]
                  : ('00' + t[a]).substr(('' + t[a]).length)
              ))
          return e
        })
    },
    '4Pzh': function (e, a) {
      e.exports = t
    },
    '84ta': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = a('+90k'),
        i = a.n(n)
      for (var s in n)
        'default' !== s &&
          (function (e) {
            a.d(t, e, function () {
              return n[e]
            })
          })(s)
      var r = a('kxKn'),
        o = (a.n(r), a('XyMi')),
        l = Object(o.a)(i.a, r.render, r.staticRenderFns, !1, null, null, null)
      t.default = l.exports
    },
    'JkW7': function (e, t, a) {
      'use strict'
      function n(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = a('lZQ+'),
        s = n(i)
      n(a('lRwf')).default.component(s.default.name, s.default),
        (t.default = { vuiDateNavigator: s.default })
    },
    'XyMi': function (e, t, a) {
      'use strict'
      function n(e, t, a, n, i, s, r, o) {
        e = e || {}
        var l = typeof e.default
        ;('object' !== l && 'function' !== l) || (e = e.default)
        var u = 'function' == typeof e ? e.options : e
        t && ((u.render = t), (u.staticRenderFns = a), (u._compiled = !0)),
          n && (u.functional = !0),
          s && (u._scopeId = s)
        var d
        if (
          (r
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
                  e && e._registeredComponents && e._registeredComponents.add(r)
              }),
              (u._ssrRegister = d))
            : i &&
              (d = o
                ? function () {
                    i.call(this, this.$root.$options.shadowRoot)
                  }
                : i),
          d)
        )
          if (u.functional) {
            u._injectStyles = d
            var c = u.render
            u.render = function (e, t) {
              return d.call(t), c(e, t)
            }
          } else {
            var f = u.beforeCreate
            u.beforeCreate = f ? [].concat(f, d) : [d]
          }
        return { exports: e, options: u }
      }
      t.a = n
    },
    'kxKn': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function () {
          var e = this,
            t = e.$createElement,
            a = e._self._c || t
          return a(
            'div',
            {
              staticClass: 'vui-date-navigator',
              staticStyle: { display: 'inline-block' }
            },
            [
              a('iButton', {
                attrs: {
                  type: 'text',
                  icon: 'arrow-left-b',
                  disabled: e.preButtonDisabled
                },
                on: { click: e.scrollPrev }
              }),
              e._v(' '),
              a('span', { domProps: { textContent: e._s(e.displayValue) } }),
              e._v(' '),
              e._t('default'),
              e._v(' '),
              a('iButton', {
                attrs: {
                  type: 'text',
                  icon: 'arrow-right-b',
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
    'lRwf': function (t, a) {
      t.exports = e
    },
    'lZQ+': function (e, t, a) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = a('84ta'),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = i.default
    }
  })
})
