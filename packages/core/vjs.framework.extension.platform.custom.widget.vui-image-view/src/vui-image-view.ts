!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'], t)
  else {
    var i =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
          )
        : t(e.Vue, e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'])
    for (var r in i) ('object' == typeof exports ? exports : e)[r] = i[r]
  }
})('undefined' != typeof self ? self : this, function (e, t) {
  return (function (e) {
    function t(r) {
      if (i[r]) return i[r].exports
      var n = (i[r] = { i: r, l: !1, exports: {} })
      return e[r].call(n.exports, n, n.exports, t), (n.l = !0), n.exports
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
    '6y/X': function (e, t) {},
    '9E2R': function (e, i) {
      e.exports = t
    },
    'JkW7': function (e, t, i) {
      'use strict'
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = i('W8Wz'),
        a = r(n)
      r(i('lRwf')).default.component(a.default.name, a.default),
        (t.default = { vuiImageView: a.default })
    },
    'RMSu': function (e, t, i) {
      'use strict'
      function r(e) {
        i('6y/X')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = i('oMTz'),
        a = i.n(n)
      for (var o in n)
        'default' !== o &&
          (function (e) {
            i.d(t, e, function () {
              return n[e]
            })
          })(o)
      var s = i('Vcvi'),
        c = (i.n(s), i('XyMi')),
        u = r,
        d = Object(c.a)(
          a.a,
          s.render,
          s.staticRenderFns,
          !1,
          u,
          'data-v-1fdf9020',
          null
        )
      t.default = d.exports
    },
    'Vcvi': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = function () {
          var e = this,
            t = e.$createElement,
            r = e._self._c || t
          return r('div', { staticStyle: { position: 'relative' } }, [
            !1 === e.loaded
              ? r(
                  'div',
                  {
                    staticClass: 'vui-image-wrap',
                    class: {
                      'vui-image-view-circle': 'circle' === e.shape,
                      'vui-image-view-sharp': 'sharp' === e.shape,
                      'vui-image-view-rounded': 'rounded' === e.shape
                    },
                    style: 'width:' + e.width + 'px;height:' + e.height + 'px;'
                  },
                  [
                    '' != e.errorImgSrc
                      ? r('img', {
                          staticClass: 'vui-image-error',
                          style: e.coverStyle,
                          attrs: { src: e.errorCompSrcFun, id: e.errImgId },
                          on: { click: e.handlerClick }
                        })
                      : r('img', {
                          staticClass: 'vui-image-error',
                          style: e.coverStyle,
                          attrs: { src: i('t6qP'), id: e.errImgId },
                          on: { click: e.handlerClick }
                        })
                  ]
                )
              : e._e(),
            e._v(' '),
            r(
              'div',
              {
                staticClass: 'vui-image-wrap',
                class: {
                  'vui-image-view-circle': 'circle' === e.shape,
                  'vui-image-view-sharp': 'sharp' === e.shape,
                  'vui-image-view-rounded': 'rounded' === e.shape,
                  'vui-image-view-loading': !1 === e.loaded,
                  'vui-image-view-loaded': !0 === e.loaded
                },
                style: 'width:' + e.width + 'px;height:' + e.height + 'px;'
              },
              [
                e.src
                  ? r('img', {
                      ref: 'image',
                      staticClass: 'vui-image',
                      class: e.className,
                      style: '' + e.styles + e.coverStyle,
                      attrs: {
                        id: e.imgId,
                        src: e.src,
                        title: e.title,
                        alt: e.alt
                      }
                    })
                  : e.compSrc
                  ? r('img', {
                      ref: 'image',
                      staticClass: 'vui-image',
                      class: e.className,
                      style: '' + e.styles + e.coverStyle,
                      attrs: {
                        id: e.imgId,
                        src: e.compSrcFun,
                        title: e.title,
                        alt: e.alt
                      }
                    })
                  : e.amidSrc
                  ? r('img', {
                      ref: 'image',
                      staticClass: 'vui-image',
                      class: e.className,
                      style: '' + e.styles + e.coverStyle,
                      attrs: {
                        id: e.imgId,
                        src: e.amidSrcFun,
                        title: e.title,
                        alt: e.alt
                      }
                    })
                  : e._e(),
                e._v(' '),
                r(
                  'div',
                  {
                    staticClass: 'vui-image-browser',
                    on: { click: e.handlerClick }
                  },
                  [e._t('default')],
                  2
                )
              ]
            )
          ])
        },
        n = []
      ;(t.render = r), (t.staticRenderFns = n)
    },
    'W8Wz': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('RMSu'),
        n = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = n.default
    },
    'XyMi': function (e, t, i) {
      'use strict'
      function r(e, t, i, r, n, a, o, s) {
        e = e || {}
        var c = typeof e.default
        ;('object' !== c && 'function' !== c) || (e = e.default)
        var u = 'function' == typeof e ? e.options : e
        t && ((u.render = t), (u.staticRenderFns = i), (u._compiled = !0)),
          r && (u.functional = !0),
          a && (u._scopeId = a)
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
                  n && n.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(o)
              }),
              (u._ssrRegister = d))
            : n &&
              (d = s
                ? function () {
                    n.call(this, this.$root.$options.shadowRoot)
                  }
                : n),
          d)
        )
          if (u.functional) {
            u._injectStyles = d
            var l = u.render
            u.render = function (e, t) {
              return d.call(t), l(e, t)
            }
          } else {
            var f = u.beforeCreate
            u.beforeCreate = f ? [].concat(f, d) : [d]
          }
        return { exports: e, options: u }
      }
      t.a = r
    },
    'lRwf': function (t, i) {
      t.exports = e
    },
    'oMTz': function (e, t, i) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = i('9E2R'),
        n = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(r)
      t.default = {
        name: 'vui-image-view',
        props: {
          shape: { type: String, default: 'sharp' },
          src: String,
          title: String,
          alt: String,
          width: Number,
          height: Number,
          compSrc: String,
          amidSrc: String,
          errorImgSrc: { type: String, default: '' },
          className: String,
          styles: String,
          type: { type: String, default: 'cover' },
          onError: {
            type: Function,
            default: function () {
              return function () {}
            }
          }
        },
        data: function () {
          return {
            imgId:
              'vui_image_view' +
              new Date().getTime() +
              Math.floor(1e3 * Math.random()),
            errImgId:
              'vui_image_view_error' +
              new Date().getTime() +
              Math.floor(1e3 * Math.random()),
            loaded: !1,
            coverStyle: ''
          }
        },
        methods: {
          imgLoaded: function () {
            var e = this,
              t = document.querySelector('#' + this.imgId)
            if (!1 === this.loaded) {
              var i = document.querySelector('#' + this.errImgId)
              this.initImg(i)
            }
            if (t) {
              var r = setInterval(function () {
                t.complete && (clearInterval(r), e.initImg(t), (e.loaded = !0))
              }, 50)
              t.onerror = function () {
                e.onError()
              }
            }
          },
          initImg: function (e) {
            'cover' === this.type
              ? this.changeImageCoverSize(e)
              : this.changeImageContainSize(e)
          },
          changeImageContainSize: function (e) {
            var t = this
            ;(e.style.width = 'auto'),
              (e.style.height = 'auto'),
              (e.style.maxWidth = this.width + 'px'),
              (e.style.maxHeight = this.height + 'px'),
              'contain' === this.type &&
                setTimeout(function () {
                  ;(e.style.marginLeft = (t.width - e.width) / 2 + 'px'),
                    (e.style.marginTop = (t.height - e.height) / 2 + 'px'),
                    (e.style.opacity = 1)
                }, 0)
          },
          changeImageCoverSize: function (e) {
            var t = this.width,
              i = this.height,
              r = e.width,
              n = e.height
            this.getCoverStyles(t, i, r, n)
          },
          getCoverStyles: function (e, t, i, r) {
            var n = e / t,
              a = i / r,
              o = 0,
              s = 0,
              c = 0,
              u = 0
            n > a
              ? ((o = e), (s = o / a), (c = ((s - t) / 2) * -1))
              : ((s = t), (o = s * a), (u = ((o - e) / 2) * -1))
            document.querySelector('#' + this.imgId)
            this.coverStyle =
              'height:' +
              s +
              'px;width:' +
              o +
              'px;margin-left:' +
              u +
              'px;margin-top:' +
              c +
              'px;opacity:1;'
          },
          handlerClick: function (e) {
            this.$emit('on-click', e)
          }
        },
        computed: {
          compSrcFun: function () {
            return n.default.v3platform.getSrcPathFromRes(this, this.compSrc)
          },
          amidSrcFun: function () {
            return n.default.v3platform.getSrcPathFromId2url(this.amidSrc)
          },
          errorCompSrcFun: function () {
            return n.default.v3platform.getSrcPathFromRes(
              this,
              this.errorImgSrc
            )
          },
          error: function () {
            return '' != this.errorImgSrc
          }
        },
        watch: {
          amidSrc: function (e, t) {
            var i = this
            e &&
              setTimeout(function () {
                i.imgLoaded()
              }, 0)
          }
        },
        mounted: function () {
          var e = this
          this.$nextTick(function () {
            setTimeout(function () {
              e.imgLoaded()
            }, 0)
          })
        }
      }
    },
    't6qP': function (e, t, i) {
      e.exports = (function () {
        var e = i('9E2R')
        return e && void 0 !== e.res
          ? e.res.getWidgetResPath(
              'vui-image-view',
              'widget',
              'widget/3OxyWaF.png'
            )
          : e && void 0 !== e.default.res
          ? e.default.res.getWidgetResPath(
              'vui-image-view',
              'widget',
              'widget/3OxyWaF.png'
            )
          : 'widget/3OxyWaF.png'
      })()
    }
  })
})
