!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(require('Vue'))
  else if ('function' == typeof define && define.amd) define(['Vue'], t)
  else {
    var n = t('object' == typeof exports ? require('Vue') : e.Vue)
    for (var i in n) ('object' == typeof exports ? exports : e)[i] = n[i]
  }
})('undefined' != typeof self ? self : this, function (e) {
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
    '/474': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('xfKc'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    '0qqn': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('E8rr'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = {
        name: 'vuiHeader',
        props: { height: { type: Number | String, default: '64px' } },
        data: function () {
          return { heightStyle: this.height }
        },
        computed: {
          calHeight: function () {
            var e = this.heightStyle ? this.heightStyle : this.height
            return r.default.getHeightStyle(e, this)
          }
        },
        methods: {},
        mounted: function () {
          var e = r.default.getHeight(this)
          e && (this.heightStyle = e)
        }
      }
    },
    '2Cqc': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vui-sider',
          props: { place: { type: String, default: 'left' } },
          data: function () {
            return {
              siderClass: 'vui_sider_layout' + new Date().getTime(),
              headerClass: 'vui_sider_layout_header' + new Date().getTime(),
              contentClass: 'vui_sider_layout_content' + new Date().getTime(),
              footerClass: 'vui_sider_layout_footer' + new Date().getTime()
            }
          },
          mounted: function () {
            var e = this
            this.$nextTick(function () {
              setTimeout(function () {
                e.computedHeight()
              }, 0)
            })
          },
          methods: {
            computedHeight: function () {
              var e = document.querySelector('.' + this.contentClass),
                t = $('.' + this.siderClass),
                n = document.querySelector('.' + this.headerClass),
                i = document.querySelector('.' + this.footerClass)
              e.style.height =
                t.height() - n.clientHeight - i.clientHeight + 'px'
            }
          }
        })
    },
    '2TiS': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('Tmns'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    '456U': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          name: 'vuiContent',
          props: {},
          data: function () {
            return { heigtStyle: null }
          },
          computed: {},
          methods: {
            setHeightStyle: function (e) {
              this.heigtStyle = e
            },
            getH: function () {
              return 'height:' + this.heigtStyle + ';'
            }
          },
          mounted: function () {}
        })
    },
    '4VSS': function (e, t) {},
    'Ab2e': function (e, t) {},
    'BS0h': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('lKTo'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    'BnMY': function (e, t) {},
    'E8rr': function (e, t, n) {
      'use strict'
      function i(e, t) {
        if (e) {
          var n = this.getHeight(t)
          return (
            n && (e = n),
            isNaN(Number(e))
              ? 'string' == typeof e && -1 == e.indexOf('%')
                ? 'height:' + e + ';line-height:' + e
                : 'height:' + e
              : 'height:' + e + 'px;line-height:' + e + 'px;'
          )
        }
        return 'height:64px;line-height:64px;'
      }
      function r(e) {
        if (
          e &&
          e.$el &&
          e.$el.style &&
          e.$el.style.height &&
          '' != e.$el.style.height
        ) {
          return e.$el.style.height
        }
        return null
      }
      e.exports = {
        resetLineHeight: function (e, t) {
          var n = r(e)
          n
            ? -1 == n.indexOf('%') && (e.$el.style.lineHeight = n)
            : ((e.$el.style.height = t), (e.$el.style.lineHeight = t))
        },
        getHeight: r,
        getHeightStyle: i
      }
    },
    'H/by': function (e, t, n) {
      'use strict'
      function i(e) {
        n('BnMY')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('0qqn'),
        u = n.n(r)
      for (var o in r)
        'default' !== o &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(o)
      var a = n('ct/b'),
        s = (n.n(a), n('XyMi')),
        l = i,
        d = Object(s.a)(
          u.a,
          a.render,
          a.staticRenderFns,
          !1,
          l,
          'data-v-029b6a12',
          null
        )
      t.default = d.exports
    },
    'I0qV': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('H/by'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('2TiS'),
        u = i(r),
        o = n('BS0h'),
        a = i(o),
        s = n('I0qV'),
        l = i(s),
        d = n('/474'),
        f = i(d),
        c = n('vWTF'),
        h = i(c),
        v = n('lRwf'),
        p = i(v)
      p.default.component(u.default.name, u.default),
        p.default.component(a.default.name, a.default),
        p.default.component(l.default.name, l.default),
        p.default.component(f.default.name, f.default),
        p.default.component(h.default.name, h.default),
        (t.default = {
          vuiLayout: u.default,
          vuiContent: a.default,
          vuiHeader: l.default,
          vuiSider: f.default,
          vuiFooter: h.default
        })
    },
    'Kbn8': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'div',
            { staticClass: 'vui-layout-content', style: e.getH() },
            [e._t('default')],
            2
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'NAm/': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('E8rr'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = {
        name: 'vuiFooter',
        props: { height: { type: Number | String, default: '160px' } },
        data: function () {
          return { heightStyle: this.height }
        },
        computed: {
          calHeight: function () {
            var e = this.heightStyle ? this.heightStyle : this.height
            return r.default.getHeightStyle(e, this)
          }
        },
        methods: {},
        mounted: function () {
          var e = r.default.getHeight(this)
          e && (this.heightStyle = e)
        }
      }
    },
    'Tmns': function (e, t, n) {
      'use strict'
      function i(e) {
        n('Ab2e')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('gozy'),
        u = n.n(r)
      for (var o in r)
        'default' !== o &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(o)
      var a = n('ycoT'),
        s = (n.n(a), n('XyMi')),
        l = i,
        d = Object(s.a)(
          u.a,
          a.render,
          a.staticRenderFns,
          !1,
          l,
          'data-v-2c0852e8',
          null
        )
      t.default = d.exports
    },
    'W5/W': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'footer',
            { staticClass: 'vui-layout-footer', style: e.calHeight },
            [e._t('default')],
            2
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, r, u, o, a) {
        e = e || {}
        var s = typeof e.default
        ;('object' !== s && 'function' !== s) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
          i && (l.functional = !0),
          u && (l._scopeId = u)
        var d
        if (
          (o
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
                  e && e._registeredComponents && e._registeredComponents.add(o)
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
      t.a = i
    },
    'bD03': function (e, t, n) {
      'use strict'
      function i(e) {
        n('kFgy')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('NAm/'),
        u = n.n(r)
      for (var o in r)
        'default' !== o &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(o)
      var a = n('W5/W'),
        s = (n.n(a), n('XyMi')),
        l = i,
        d = Object(s.a)(
          u.a,
          a.render,
          a.staticRenderFns,
          !1,
          l,
          'data-v-6cb1497c',
          null
        )
      t.default = d.exports
    },
    'ct/b': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'header',
            { staticClass: 'vui-layout-header', style: e.calHeight },
            [e._t('default')],
            2
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'dieg': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'aside',
            { staticClass: 'vui-layout-sider', class: e.siderClass },
            [
              n(
                'Layout',
                { staticClass: 'vui-sider-layout' },
                [
                  n(
                    'Header',
                    {
                      staticClass: 'vui-layout-sider-header',
                      class: e.headerClass
                    },
                    [e._t('header')],
                    2
                  ),
                  e._v(' '),
                  n(
                    'Content',
                    {
                      class: e.contentClass,
                      attrs: { id: 'vui-sider-content' }
                    },
                    [e._t('default')],
                    2
                  ),
                  e._v(' '),
                  n(
                    'Footer',
                    {
                      staticClass: 'vui-layout-sider-footer',
                      class: e.footerClass
                    },
                    [e._t('footer')],
                    2
                  )
                ],
                1
              )
            ],
            1
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'gozy': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('E8rr'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = {
        name: 'vuiLayout',
        props: {},
        data: function () {
          return {
            hasSider: !1,
            sidePlace: 'left',
            headerHeight: 0,
            footerHeight: 0,
            isChildren: !1,
            childLayout: null,
            childContent: null
          }
        },
        created: function () {},
        computed: {
          newClass: function () {
            return this.hasSider
              ? [
                  'vui-layout',
                  'vui-layout-has-sider',
                  'vui-layout-' + this.sidePlace + 'Sider'
                ]
              : ['vui-layout']
          },
          getHeight: function () {
            if (!this.childLayout && !this.childContent) return ''
            var e = this.childLayout,
              t = r.default.getHeight(e)
            if (e && !t) {
              var n = r.default.getHeight(this)
              n || (n = '100%'),
                (e.$el.style.height =
                  'calc(' +
                  n +
                  ' - ' +
                  this.headerHeight +
                  'px - ' +
                  this.footerHeight +
                  'px)')
            }
            var i = this.childContent,
              u = r.default.getHeight(i)
            if (i && !u) {
              var n = r.default.getHeight(this)
              n || (n = '100%'),
                i.setHeightStyle(
                  'calc(100% - ' +
                    this.headerHeight +
                    'px - ' +
                    this.footerHeight +
                    'px)'
                )
            }
          }
        },
        methods: {
          findSider: function () {
            for (
              var e = this, t = !1, n = 0, i = this.$children.length;
              n < i;
              n++
            ) {
              var u = this.$children[n]
              if (
                'vui-sider' === u.$options.name ||
                'vuiSider' === u.$options.name
              )
                u.$options.propsData && 'right' === u.$options.propsData.place
                  ? (e.sidePlace = 'right')
                  : (e.sidePlace = 'left'),
                  (t = !0)
              else if (
                'vui-header' === u.$options.name ||
                'vuiHeader' === u.$options.name
              ) {
                var o = r.default.getHeight(u)
                o &&
                  -1 == o.indexOf('%') &&
                  ((o = parseInt(o)), (e.headerHeight = o))
              } else if (
                'vui-footer' === u.$options.name ||
                'vuiFooter' === u.$options.name
              ) {
                var o = r.default.getHeight(u)
                o &&
                  -1 == o.indexOf('%') &&
                  ((o = parseInt(o)), (e.footerHeight = o))
              } else
                'vui-content' === u.$options.name ||
                'vuiContent' === u.$options.name
                  ? e.setContentChild(u)
                  : ('vui-layout' !== u.$options.name &&
                      'vuiLayout' !== u.$options.name) ||
                    e.setChildren(u)
            }
            return t
          },
          setChildren: function (e) {
            this.childLayout = e
          },
          setContentChild: function (e) {
            this.childContent = e
          }
        },
        mounted: function () {
          this.hasSider = this.findSider()
        }
      }
    },
    'kFgy': function (e, t) {},
    'lKTo': function (e, t, n) {
      'use strict'
      function i(e) {
        n('4VSS')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('456U'),
        u = n.n(r)
      for (var o in r)
        'default' !== o &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(o)
      var a = n('Kbn8'),
        s = (n.n(a), n('XyMi')),
        l = i,
        d = Object(s.a)(
          u.a,
          a.render,
          a.staticRenderFns,
          !1,
          l,
          'data-v-4ac07a4c',
          null
        )
      t.default = d.exports
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'uPJW': function (e, t) {},
    'vWTF': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('bD03'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    },
    'xfKc': function (e, t, n) {
      'use strict'
      function i(e) {
        n('uPJW')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('2Cqc'),
        u = n.n(r)
      for (var o in r)
        'default' !== o &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(o)
      var a = n('dieg'),
        s = (n.n(a), n('XyMi')),
        l = i,
        d = Object(s.a)(
          u.a,
          a.render,
          a.staticRenderFns,
          !1,
          l,
          'data-v-5641f2cb',
          null
        )
      t.default = d.exports
    },
    'ycoT': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement
          return (e._self._c || t)(
            'div',
            { class: e.newClass, style: e.getHeight },
            [e._t('default')],
            2
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    }
  })
})
