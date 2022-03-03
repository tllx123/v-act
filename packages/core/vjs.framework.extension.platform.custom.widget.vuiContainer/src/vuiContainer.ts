!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
          )
        : t(e.Vue, e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'])
    for (var i in n) ('object' == typeof exports ? exports : e)[i] = n[i]
  }
})('undefined' != typeof self ? self : this, function (e, t) {
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
    '6nXp': function (e, t) {},
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('x2pB'),
        o = i(r)
      i(n('lRwf')).default.component(o.default.name, o.default),
        (t.default = { vuiContainer: o.default })
    },
    'Ug0N': function (e, n) {
      e.exports = t
    },
    'Vl0y': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'div',
            {
              class: e.getBoxClass(),
              style: e.getHeight(),
              attrs: { id: e.getIden() }
            },
            [
              e.showHeader()
                ? n('div', { staticClass: 'widgetBox-hd' }, [
                    n('div', { staticClass: 'widgetBox-hd-cont' }, [
                      n('button', {
                        staticClass: 'btn btn-prev iconfont icon-back'
                      }),
                      e._v(' '),
                      n('button', {
                        staticClass: 'btn btn-next iconfont icon-right'
                      }),
                      e._v(' '),
                      n('div', { staticClass: 'scrollView' }, [
                        n(
                          'ul',
                          { attrs: { id: e.getIden(null, 'tag_ul') } },
                          e._l(e.tagArray, function (t) {
                            return n(
                              'li',
                              {
                                key: e.getIden(t, 'tag'),
                                class: e.getClass(t, 'tag'),
                                attrs: {
                                  'vui-code': t.vuiCode,
                                  'widget-code': t.divCode,
                                  'id': e.getIden(t, 'tag'),
                                  'open-mode': e.getOpenMode(t),
                                  'data-iden': e.getIden()
                                },
                                on: {
                                  click: function (n) {
                                    return e.clickTag(t)
                                  }
                                }
                              },
                              [
                                n(
                                  'span',
                                  {
                                    domProps: {
                                      textContent: e._s(e.getTitle(t))
                                    }
                                  },
                                  [e._v('标签一')]
                                ),
                                n('i', {
                                  staticClass: 'iconfont icon-close',
                                  on: {
                                    click: function (n) {
                                      return e.close(t)
                                    }
                                  }
                                })
                              ]
                            )
                          }),
                          0
                        )
                      ])
                    ])
                  ])
                : e._e(),
              e._v(' '),
              n(
                'div',
                {
                  staticClass: 'widgetBox-bd',
                  class: { 'widgetBox-bd-link': !0 === e.link },
                  style: e.getHeight()
                },
                [
                  n(
                    'ul',
                    { attrs: { id: e.getIden(null, 'win_ul') } },
                    e._l(e.tagArray, function (t) {
                      return n('li', {
                        key: e.getIden(t, 'win'),
                        class: e.getClass(t, 'win'),
                        style: e.getHeight('li'),
                        attrs: {
                          'tag-iden': 'vui-container-win-li',
                          'vui-code': t.vuiCode,
                          'widget-code': t.divCode,
                          'open-mode': e.getOpenMode(t),
                          'id': e.getIden(t, 'win'),
                          'data-iden': e.getIden()
                        }
                      })
                    }),
                    0
                  )
                ]
              )
            ]
          )
        },
        r = []
      ;(t.render = i), (t.staticRenderFns = r)
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, r, o, a, d) {
        e = e || {}
        var u = typeof e.default
        ;('object' !== u && 'function' !== u) || (e = e.default)
        var s = 'function' == typeof e ? e.options : e
        t && ((s.render = t), (s.staticRenderFns = n), (s._compiled = !0)),
          i && (s.functional = !0),
          o && (s._scopeId = o)
        var l
        if (
          (a
            ? ((l = function (e) {
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
              (s._ssrRegister = l))
            : r &&
              (l = d
                ? function () {
                    r.call(this, this.$root.$options.shadowRoot)
                  }
                : r),
          l)
        )
          if (s.functional) {
            s._injectStyles = l
            var c = s.render
            s.render = function (e, t) {
              return l.call(t), c(e, t)
            }
          } else {
            var f = s.beforeCreate
            s.beforeCreate = f ? [].concat(f, l) : [l]
          }
        return { exports: e, options: s }
      }
      t.a = i
    },
    'bhTB': function (e, t, n) {
      'use strict'
      function i(e) {
        n('6nXp'), n('r0Nu')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = n('ril/'),
        o = n.n(r)
      for (var a in r)
        'default' !== a &&
          (function (e) {
            n.d(t, e, function () {
              return r[e]
            })
          })(a)
      var d = n('Vl0y'),
        u = (n.n(d), n('XyMi')),
        s = i,
        l = Object(u.a)(
          o.a,
          d.render,
          d.staticRenderFns,
          !1,
          s,
          'data-v-131ee0b6',
          null
        )
      t.default = l.exports
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'r0Nu': function (e, t) {},
    'ril/': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('Ug0N'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = {
        name: 'vuiContainer',
        props: {
          widgetCode: String,
          isAnchor: Boolean,
          height: { type: [String, Number], default: null },
          autoHeight: { type: Boolean, default: !1 },
          displayType: { type: String, default: 'hide' }
        },
        data: function () {
          return {
            iden: r.default.genUUID(),
            tagArray: [],
            selectTagIden: null,
            link: !1,
            cH: !1
          }
        },
        created: function () {},
        mounted: function () {
          if (
            ((window._$testContainer = this),
            this.tagArray && this.tagArray.length > 0)
          ) {
            var e = this.tagArray[0]
            this.selectTagIden = e.iden
          }
          var t = (function (e) {
              return function (t) {
                e.add(t)
              }
            })(this),
            n = (function (e) {
              return function (t) {
                t && t.tagIden && e.remove(t.tagIden)
              }
            })(this),
            i = (function (e) {
              return function (t) {
                t && t.iden && e.update(t)
              }
            })(this),
            r = (function (e) {
              return function (t) {
                e.clearHeight(t)
              }
            })(this)
          if (this.$root) {
            var o = this.$root,
              a = this.widgetCode
            o._$registerVuiTagEvent &&
              (o._$registerVuiTagEvent(a, 'open', t),
              o._$registerVuiTagEvent(a, 'close', n),
              o._$registerVuiTagEvent(a, 'update', i),
              o._$registerVuiTagEvent(a, 'clearHeight', r))
          }
        },
        methods: {
          getHeight: function (e) {
            if (!0 === this.cH && !0 === this.autoHeight) return ''
            var t = this.height
            return null != t
              ? 'number' == typeof t
                ? 'height:' + t + 'px'
                : 'height:' + t
              : ''
          },
          clearHeight: function (e) {},
          showHeader: function () {
            var e = this.displayType
            return !(
              !e ||
              !('always' === e || ('auto' === e && this.tagArray.length > 1))
            )
          },
          getOpenMode: function (e) {
            return e && e.openMode ? e.openMode : 'other'
          },
          getBoxClass: function () {
            var e = 'widgetBox noHead'
            return !0 === this.Anchor && (e += ' vuiConinerAnchor'), e
          },
          add: function (e) {
            var t = r.default.genUUID(),
              n = e.callback,
              i = e.closeback,
              o = this.exist(e)
            e.url
            if (o) t = o
            else {
              if ('hide' === this.displayType && this.tagArray.length > 0)
                for (var a = 0, d = this.tagArray.length; a < d; a++) {
                  var u = this.tagArray[a]
                  ;('OpenRule' !== u.openMode && 'OpenLink' !== u.openMode) ||
                    this.close(u)
                }
              var s = e.OpenMode ? e.OpenMode : 'Other'
              if ('OpenLink' === s) {
                var l = {
                  iden: t,
                  vuiCode: e.containerCode,
                  divCode: e.divCode,
                  scopeId: e.scopeId,
                  title: e.title,
                  info: e.info,
                  openMode: s,
                  callback: n,
                  closeback: i,
                  url: e.url
                }
                this.tagArray.push(l)
              } else {
                var c = ''
                for (var a in e.inputParams.variable)
                  c += a + ':' + e.inputParams.variable[a] + ';'
                var l = {
                  iden: t,
                  vuiCode: e.containerCode,
                  divCode: e.divCode,
                  componentCode: e.componentCode,
                  windowCode: e.windowCode,
                  scopeId: e.scopeId,
                  title: e.title,
                  info: e.info,
                  openMode: s,
                  callback: n,
                  closeback: i,
                  inputParams: c
                }
                this.tagArray.push(l)
              }
            }
            this.selectTagIden = t
            var f = this
            if ('function' == typeof n) {
              var g = window.setInterval(function () {
                var i = t + '_win',
                  a = document.getElementById(i)
                if (a) {
                  if (e.url && !o) {
                    var d = document.createElement('iframe')
                    ;(d.src = e.url),
                      (d.id = r.default.genUUID()),
                      a.appendChild(d),
                      (f.link = !0)
                  }
                  window.clearInterval(g)
                  var u,
                    s = f.getTagIndex(t, 'iden')
                  ;-1 != s && (u = f.tagArray[s].scopeId),
                    e.url && !o
                      ? (d.onload = function () {
                          n({ _iden: i, existIden: !!o, scopeId: u })
                        })
                      : n({ _iden: i, existIden: !!o, scopeId: u })
                }
              }, 200)
              setTimeout(
                (function (e) {
                  return function () {
                    e && window.clearInterval(e)
                  }
                })(g),
                1e4
              )
            } else {
              var g = window.setInterval(function () {
                var n = t + '_win',
                  i = document.getElementById(n)
                if (i) {
                  if (e.url && !o) {
                    var a = document.createElement('iframe')
                    ;(a.src = e.url),
                      (a.id = r.default.genUUID()),
                      i.appendChild(a),
                      (f.link = !0)
                  }
                  window.clearInterval(g)
                }
              }, 200)
              setTimeout(
                (function (e) {
                  return function () {
                    e && window.clearInterval(e)
                  }
                })(g),
                1e4
              )
            }
          },
          close: function (e) {
            if (e) {
              this.remove(e.iden)
              var t = e.closeback
              'function' == typeof t && t()
            }
            try {
              event.stopPropagation()
            } catch (e) {
              window && window.console && console.warn(e)
            }
            return !1
          },
          clickTag: function (e) {
            this.selectTagIden = e.iden
          },
          remove: function (e) {
            if (e) {
              var t = e.split('_win')[0],
                n = this.getTagIndex(t, 'iden')
              if (-1 != n)
                return (
                  this.tagArray.splice(n, 1),
                  t == this.selectTagIden &&
                    this.tagArray.length > 0 &&
                    (this.selectTagIden = this.tagArray[0].iden),
                  !0
                )
            }
            return !1
          },
          getTag: function (e) {
            for (var t = this.tagArray, n = 0, i = t.length; n < i; n++) {
              var r = t[n]
              if ('OpenRule' === e.OpenMode) {
                var o = ''
                for (var n in e.inputParams.variable)
                  o += n + ':' + e.inputParams.variable[n] + ';'
                if (
                  e.componentCode == r.componentCode &&
                  e.windowCode == r.windowCode &&
                  e.title == r.title &&
                  e.info == r.info &&
                  o == r.inputParams
                )
                  return r
              } else if ('OpenLink' === e.OpenMode && e.url == r.url) return r
            }
            return null
          },
          exist: function (e) {
            var t = this.getTag(e)
            return t ? t.iden : null
          },
          update: function (e) {
            var t = e.iden.substring(0, e.iden.length - 4),
              n = this.getTagIndex(t, 'iden')
            if (-1 != n) {
              var i = this.tagArray[n]
              for (var r in e)
                e.hasOwnProperty(r) && 'iden' != r && (i[r] = e[r])
            }
          },
          activate: function (e) {
            this.selectTagIden = e
          },
          getIden: function (e, t) {
            var n = this.iden
            return e && e.iden && (n = e.iden), t && (n += '_' + t), n
          },
          getTitle: function (e) {
            return e.title
          },
          getTagIndex: function (e, t) {
            for (var n = 0, i = this.tagArray.length; n < i; n++) {
              if (e == this.tagArray[n][t]) return n
            }
            return -1
          },
          getClass: function (e, t) {
            var n = ''
            return (
              this.selectTagIden == e.iden && (n = 'active'),
              'win' == t && (n += ' widgetBox-panel '),
              n
            )
          }
        },
        watch: {}
      }
    },
    'x2pB': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('bhTB'),
        r = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = r.default
    }
  })
})
