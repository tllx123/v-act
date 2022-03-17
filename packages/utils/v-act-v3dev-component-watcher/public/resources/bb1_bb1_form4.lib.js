!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(
        require('Vue'),
        require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
      ))
    : 'function' == typeof define && define.amd
    ? define(
        'v3_business_component_bb1',
        ['Vue', 'vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'],
        t
      )
    : 'object' == typeof exports
    ? (exports.v3_business_component_bb1 = t(
        require('Vue'),
        require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
      ))
    : (e.v3_business_component_bb1 = t(
        e.Vue,
        e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9']
      ))
})('undefined' != typeof self ? self : this, function (e, t) {
  return webpackJsonpv3_business_component_bb1(
    [0],
    {
      '0Jux': function (e, t, n) {
        'use strict'
        function o(e, t, n, o, r, i, c, s) {
          e = e || {}
          var u = typeof e.default
          ;('object' !== u && 'function' !== u) || (e = e.default)
          var f = 'function' == typeof e ? e.options : e
          t && ((f.render = t), (f.staticRenderFns = n), (f._compiled = !0)),
            o && (f.functional = !0),
            i && (f._scopeId = i)
          var a
          if (
            (c
              ? ((a = function (e) {
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
                    e &&
                      e._registeredComponents &&
                      e._registeredComponents.add(c)
                }),
                (f._ssrRegister = a))
              : r &&
                (a = s
                  ? function () {
                      r.call(this, this.$root.$options.shadowRoot)
                    }
                  : r),
            a)
          )
            if (f.functional) {
              f._injectStyles = a
              var p = f.render
              f.render = function (e, t) {
                return a.call(t), p(e, t)
              }
            } else {
              var d = f.beforeCreate
              f.beforeCreate = d ? [].concat(d, a) : [a]
            }
          return { exports: e, options: f }
        }
        t.a = o
      },
      '2IgC': function (e, t) {
        e.exports = {
          getWindowComponentName: function (e, t, n) {
            return ['v3', 'business', 'window', e, t, n].join('-')
          }
        }
      },
      '6IhH': function (e, t, n) {
        'use strict'
        var o = n('9E2R'),
          r = (n.n(o), n('GEvQ'))
        t.a = {
          props: r.a,
          data: function () {
            return {}
          },
          methods: {}
        }
      },
      '9E2R': function (e, n) {
        e.exports = t
      },
      'GEvQ': function (e, t, n) {
        'use strict'
        t.a = {
          v3platform_$Data: {
            type: Object,
            default: function () {
              return {}
            }
          },
          m_viewport_top_fit: { type: Number | String, default: 0 },
          m_viewport_bottom_fit: { type: Number | String, default: 0 },
          m_viewport_left_fit: { type: Number | String, default: 0 },
          m_viewport_right_fit: { type: Number | String, default: 0 }
        }
      },
      'KU98': function (e, t, n) {
        'use strict'
        function o(e) {
          s || n('WXke')
        }
        var r = n('6IhH'),
          i = n('z4HX'),
          c = n('0Jux'),
          s = !1,
          u = o,
          f = Object(c.a)(r.a, i.a, i.b, !1, u, 'data-v-6ac472c1', null)
        ;(f.options.__file =
          'src\\components\\bb1\\views\\form4\\JGMDiv1\\index.vue'),
          (t.a = f.exports)
      },
      'MDss': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var o = n('lRwf'),
          r = n.n(o),
          i = n('KU98'),
          c = n('S2vp'),
          s = n.n(c)
        r.a.component(
          s.a.getWindowComponentName('bb1', 'form4', 'JGMDiv1'),
          i.a
        )
      },
      'S2vp': function (e, t, n) {
        var o = n('2IgC')
        e.exports = {
          getWindowComponentName: function (e, t, n) {
            return o.getWindowComponentName(e, t, n)
          }
        }
      },
      'WXke': function (e, t) {},
      'lRwf': function (t, n) {
        t.exports = e
      },
      'z4HX': function (e, t, n) {
        'use strict'
        n.d(t, 'a', function () {
          return o
        }),
          n.d(t, 'b', function () {
            return r
          })
        var o = function () {
            var e = this,
              t = e.$createElement
            return (e._self._c || t)('vui-container', {
              attrs: { 'widget-code': 'JGDiv1_vuicontainer1' }
            })
          },
          r = []
        o._withStripped = !0
      }
    },
    ['MDss']
  )
})
