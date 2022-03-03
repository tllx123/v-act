!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f'),
      require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
    )
  else if ('function' == typeof define && define.amd)
    define([
      'Vue',
      'vPlatform-resource-caf94787885743c8664a5bf624698d3f',
      'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'
    ], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f'),
            require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649')
          )
        : t(
            e.Vue,
            e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'],
            e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649']
          )
    for (var i in n) ('object' == typeof exports ? exports : e)[i] = n[i]
  }
})('undefined' != typeof self ? self : this, function (e, t, n) {
  return (function (e) {
    function t(i) {
      if (n[i]) return n[i].exports
      var o = (n[i] = { i: i, l: !1, exports: {} })
      return e[i].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
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
    '+hUh': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t
          return n(
            'div',
            {
              on: {
                onClick: function (t) {
                  return e.onClick()
                },
                onVisibleChange: e.onVisibleChange
              }
            },
            [
              n(
                'div',
                {
                  staticClass: 'top-menu theme-dark',
                  style: e.topMenuStyle,
                  attrs: { id: 'top-menu' }
                },
                [
                  n(
                    'ul',
                    { staticClass: 'nav', attrs: { id: e.getIden() } },
                    [
                      e._l(e.getData(), function (t) {
                        return n(
                          'li',
                          {
                            key: t.id,
                            class: e.getActiveClass(t),
                            attrs: {
                              'id': e.getIden(t),
                              'data-iden': e.getIden()
                            }
                          },
                          [
                            n(
                              'vui-Dropdown',
                              {
                                on: {
                                  'on-click': function (n) {
                                    return e.onClick(t, 'drop')
                                  },
                                  'on-visible-change': e.onVisibleChange
                                }
                              },
                              [
                                n(
                                  'a',
                                  {
                                    on: {
                                      click: function (n) {
                                        return e.onClick(t, 'a')
                                      }
                                    }
                                  },
                                  [
                                    n('span', {
                                      domProps: {
                                        textContent: e._s(e.getData(t))
                                      }
                                    })
                                  ]
                                ),
                                e._v(' '),
                                e.showDropDownMenu(t)
                                  ? n(
                                      'vui-Dropdown-Menu',
                                      { attrs: { slot: 'list' }, slot: 'list' },
                                      e._l(e.getItem(t), function (t) {
                                        return n(
                                          'vui-Dropdown-Item',
                                          {
                                            key: t.id,
                                            attrs: { id: e.getIden(t) }
                                          },
                                          [
                                            n('span', {
                                              domProps: {
                                                textContent: e._s(e.getData(t))
                                              }
                                            })
                                          ]
                                        )
                                      }),
                                      1
                                    )
                                  : e._e()
                              ],
                              1
                            )
                          ],
                          1
                        )
                      }),
                      e._v(' '),
                      n(
                        'li',
                        { staticClass: 'menu-control menu-control-left show' },
                        [
                          n(
                            'a',
                            {
                              style: e.lineHeightStyle,
                              attrs: {
                                'href': 'javascript:void(0);',
                                'data-click': 'prev-menu'
                              }
                            },
                            [
                              n('i', {
                                staticClass: 'iconfont icon-back',
                                style: e.lineHeightStyle
                              })
                            ]
                          )
                        ]
                      ),
                      e._v(' '),
                      n(
                        'li',
                        { staticClass: 'menu-control menu-control-right show' },
                        [
                          n(
                            'a',
                            {
                              style: e.lineHeightStyle,
                              attrs: {
                                'href': 'javascript:void(0);',
                                'data-click': 'next-menu'
                              }
                            },
                            [
                              n('i', {
                                staticClass: 'iconfont icon-right',
                                style: e.lineHeightStyle
                              })
                            ]
                          )
                        ]
                      )
                    ],
                    2
                  )
                ]
              )
            ]
          )
        },
        o = []
      ;(t.render = i), (t.staticRenderFns = o)
    },
    '4Pzh': function (e, n) {
      e.exports = t
    },
    '62KS': function (e, t) {},
    '7kvJ': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('4Pzh'),
        r = i(o),
        a = n('Ug0N'),
        s = i(a)
      t.default = {
        name: 'vuiDropdownList',
        props: {
          dataSource: { type: [Array, Object], default: null },
          parentField: { type: String, default: 'PID' },
          titleField: String,
          valueField: String,
          trigger: { type: String, default: 'hover' },
          visible: { type: Boolean, default: !1 },
          placement: { type: String, default: 'bottom' },
          height: { type: [Number, String], default: 70 },
          entityCode: String,
          value: String
        },
        data: function () {
          return {
            iden: '_' + s.default.genUUID(),
            treeData: [],
            treeDatas: [],
            selectTagId: null,
            childField: '_children',
            renderArrowFunc: null
          }
        },
        watch: {
          selectTagId: function () {
            var e = this.getIden()
            $("[data-iden='" + e + "']").removeClass('active')
            var t = this.getIden({ id: this.selectTagId })
            $('#' + t).addClass('active')
          },
          dataSource: function () {
            this.mapToTreeData(),
              this.$nextTick(function () {
                if (this.value && this.value.length > 0) {
                  var e = this.treeData
                  if (e && e.length > 0)
                    for (var t = 0; t < e.length; t++)
                      this.value === e[t][this.valueField] &&
                        (r.default.synCurrentRecordToDs(
                          this,
                          this.entityCode,
                          e[t]
                        ),
                        (this.selectTagId = e[t].id))
                }
              })
          },
          value: function (e, t) {
            this.$nextTick(function () {
              var t = this
              if (e && e.length > 0) {
                var n = t.treeData
                if (n && n.length > 0)
                  for (var i = 0; i < n.length; i++)
                    e === n[i][t.valueField] &&
                      (r.default.synCurrentRecordToDs(
                        this,
                        this.entityCode,
                        n[i]
                      ),
                      (t.selectTagId = n[i].id))
              }
            })
          }
        },
        computed: {
          bindEntity: function () {
            return !!this.entityCode
          },
          topMenuStyle: function () {
            var e =
              'string' == typeof this.height ? this.height : this.height + 'px'
            return 'height:' + e + ';line-height:' + e
          },
          lineHeightStyle: function () {
            return (
              'line-height:' +
              ('string' == typeof this.height
                ? this.height
                : this.height + 'px')
            )
          }
        },
        methods: {
          getItem: function (e) {
            return e[this.childField]
          },
          showDropDownMenu: function (e) {
            return !!(e && e[this.childField] && e[this.childField].length > 0)
          },
          getIden: function (e) {
            var t = this.iden
            return e && (t += e.id), t
          },
          mapToTreeData: function () {
            for (
              var e = this.dataSource, t = {}, n = [], i = 0, o = e.length;
              i < o;
              i++
            ) {
              var r = e[i],
                a = r.id
              t[a] = Object.create(r)
            }
            for (var s = this.childField, i = 0, o = e.length; i < o; i++) {
              var r = e[i],
                a = r.id,
                u = r[this.parentField],
                l = t[a]
              if (t[u]) {
                var c = t[u],
                  d = c[s]
                d ? d.push(l) : ((d = [l]), (c[s] = d))
              } else n.push(l)
            }
            if (
              ((this.treeData = n), 'function' == typeof this.renderArrowFunc)
            ) {
              var f = this
              f.$nextTick(function () {
                f.renderArrowFunc()
              })
            }
          },
          getData: function (e) {
            return e ? e[this.titleField] : this.treeData
          },
          getActiveClass: function (e) {
            return e && e.id && this.selectIden && this.selectIden == e.id
              ? 'active'
              : ''
          },
          handleUnlimitedTopMenuRender: function () {
            function e(e, t) {
              var n = $(e).closest('.nav'),
                i = parseInt($(n).css('margin-left')),
                o = $('.top-menu').width() - 88,
                r = 0,
                a = 0
              switch (
                ($(n)
                  .find('li')
                  .each(function () {
                    $(this).hasClass('menu-control') || (r += $(this).width())
                  }),
                t)
              ) {
                case 'next':
                  ;(s = r + i - o) <= o
                    ? ((a = s - i + 128),
                      setTimeout(function () {
                        $(n)
                          .find('.menu-control.menu-control-right')
                          .removeClass('show')
                      }, 150))
                    : (a = o - i - 128),
                    0 != a &&
                      $(n).animate(
                        { marginLeft: '-' + a + 'px' },
                        150,
                        function () {
                          $(n)
                            .find('.menu-control.menu-control-left')
                            .addClass('show')
                        }
                      )
                  break
                case 'prev':
                  var s = -i
                  s <= o
                    ? ($(n)
                        .find('.menu-control.menu-control-left')
                        .removeClass('show'),
                      (a = 0))
                    : (a = s - o + 88),
                    $(n).animate(
                      { marginLeft: '-' + a + 'px' },
                      150,
                      function () {
                        $(n)
                          .find('.menu-control.menu-control-right')
                          .addClass('show')
                      }
                    )
              }
            }
            function t() {
              var e = $('.top-menu .nav'),
                t = $('.top-menu .nav > li'),
                n = $('.top-menu .nav > li.active'),
                i = $('.top-menu'),
                o = (parseInt($(e).css('margin-left')), $(i).width() - 128),
                r = $('.top-menu .nav > li.active').width(),
                a = 0
              if (
                ($(n)
                  .prevAll()
                  .each(function () {
                    r += $(this).width()
                  }),
                $(t).each(function () {
                  $(this).hasClass('menu-control') || (a += $(this).width())
                }),
                r >= o && null != r)
              ) {
                var s = r - o + 128
                $(e).animate({ marginLeft: '-' + s + 'px' }, 0)
              }
              r != a && a >= o
                ? $(e).find('.menu-control.menu-control-right').addClass('show')
                : $(e)
                    .find('.menu-control.menu-control-right')
                    .removeClass('show'),
                r >= o && a >= o
                  ? $(e)
                      .find('.menu-control.menu-control-left')
                      .addClass('show')
                  : $(e)
                      .find('.menu-control.menu-control-left')
                      .removeClass('show')
            }
            $('[data-click="next-menu"]').click(function (t) {
              t.preventDefault(), e(this, 'next')
            }),
              $('[data-click="prev-menu"]').click(function (t) {
                t.preventDefault(), e(this, 'prev')
              }),
              $(window).resize(function () {
                $('.top-menu .nav').removeAttr('style'), t()
              }),
              t(),
              (this.renderArrowFunc = t),
              setTimeout(
                (function (e) {
                  return function () {
                    e()
                  }
                })(t),
                800
              )
          },
          handleTopMenuSubMenu: function () {
            $('.top-menu .sub-menu .has-sub > a').click(function () {
              var e = $(this).closest('li').find('.sub-menu').first(),
                t = $(this).closest('ul').find('.sub-menu').not(e)
              $(t)
                .not(e)
                .slideUp(250, function () {
                  $(this).closest('li').removeClass('expand')
                }),
                $(e).slideToggle(250, function () {
                  var e = $(this).closest('li')
                  $(e).hasClass('expand')
                    ? $(e).removeClass('expand')
                    : $(e).addClass('expand')
                })
            })
          },
          handleMobileTopMenuSubMenu: function () {
            $('.top-menu .nav > li.has-sub > a').click(function () {
              if ($(window).width() <= 767) {
                var e = $(this).closest('li').find('.sub-menu').first(),
                  t = $(this).closest('ul').find('.sub-menu').not(e)
                $(t)
                  .not(e)
                  .slideUp(250, function () {
                    $(this).closest('li').removeClass('expand')
                  }),
                  $(e).slideToggle(250, function () {
                    var e = $(this).closest('li')
                    $(e).hasClass('expand')
                      ? $(e).removeClass('expand')
                      : $(e).addClass('expand')
                  })
              }
            })
          },
          handleTopMenuMobileToggle: function () {
            $('[data-click="top-menu-toggled"]').click(function () {
              $('.top-menu').slideToggle(250)
            })
          },
          initMenu: function () {
            this.handleUnlimitedTopMenuRender(),
              this.handleTopMenuSubMenu(),
              this.handleMobileTopMenuSubMenu(),
              this.handleTopMenuMobileToggle()
          },
          onClick: function (e, t) {
            if (e) {
              if (
                e[this.childField] &&
                e[this.childField].length > 0 &&
                'a' == t
              )
                return (this.selectTagId = e.id), !1
              e.id &&
                this.selectTagId != e.id &&
                (r.default.synCurrentRecordToDs(this, this.entityCode, e),
                (this.selectTagId = e.id)),
                this.$emit('on-click', event)
            }
          },
          onVisibleChange: function () {
            this.$emit('on-visible-change')
          }
        },
        created: function () {
          if (this.entityCode) {
            this.mapToTreeData()
            var e = this.treeData
            e && e.length > 0 && (this.selectTagId = e[0].id)
          }
        },
        mounted: function () {
          this.$nextTick(function () {
            var e = this
            setTimeout(function () {
              e.initMenu(),
                r.default.registerCurrentHandler(
                  e,
                  (function (t) {
                    return function (n, i) {
                      ;('2.0' != r.default.getVuiVersion(t)
                        ? t.entityCode
                        : t.dataSource && t.dataSource._metadata_
                        ? t.dataSource._metadata_.dsName
                        : null) === n &&
                        t.$nextTick(function () {
                          if (i) {
                            var t = i.getSysId()
                            t && (e.selectTagId = t)
                          }
                        })
                    }
                  })(e)
                )
            }, 0)
          })
        }
      }
    },
    'JkW7': function (e, t, n) {
      'use strict'
      function i(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('sY4o'),
        r = i(o)
      i(n('lRwf')).default.component(r.default.name, r.default),
        (t.default = { vuiDropdownList: r.default })
    },
    'Ug0N': function (e, t) {
      e.exports = n
    },
    'XyMi': function (e, t, n) {
      'use strict'
      function i(e, t, n, i, o, r, a, s) {
        e = e || {}
        var u = typeof e.default
        ;('object' !== u && 'function' !== u) || (e = e.default)
        var l = 'function' == typeof e ? e.options : e
        t && ((l.render = t), (l.staticRenderFns = n), (l._compiled = !0)),
          i && (l.functional = !0),
          r && (l._scopeId = r)
        var c
        if (
          (a
            ? ((c = function (e) {
                ;(e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)),
                  e ||
                    'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                    (e = __VUE_SSR_CONTEXT__),
                  o && o.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(a)
              }),
              (l._ssrRegister = c))
            : o &&
              (c = s
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          c)
        )
          if (l.functional) {
            l._injectStyles = c
            var d = l.render
            l.render = function (e, t) {
              return c.call(t), d(e, t)
            }
          } else {
            var f = l.beforeCreate
            l.beforeCreate = f ? [].concat(f, c) : [c]
          }
        return { exports: e, options: l }
      }
      t.a = i
    },
    'lRwf': function (t, n) {
      t.exports = e
    },
    'sY4o': function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = n('wzDI'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = o.default
    },
    'wzDI': function (e, t, n) {
      'use strict'
      function i(e) {
        n('62KS')
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = n('7kvJ'),
        r = n.n(o)
      for (var a in o)
        'default' !== a &&
          (function (e) {
            n.d(t, e, function () {
              return o[e]
            })
          })(a)
      var s = n('+hUh'),
        u = (n.n(s), n('XyMi')),
        l = i,
        c = Object(u.a)(
          r.a,
          s.render,
          s.staticRenderFns,
          !1,
          l,
          'data-v-2c175b8a',
          null
        )
      t.default = c.exports
    }
  })
})
