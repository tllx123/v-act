!(function (t, e) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = e(
      require('Vue'),
      require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
    )
  else if ('function' == typeof define && define.amd)
    define(['Vue', 'vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'], e)
  else {
    var i =
      'object' == typeof exports
        ? e(
            require('Vue'),
            require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
          )
        : e(t.Vue, t['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'])
    for (var n in i) ('object' == typeof exports ? exports : t)[n] = i[n]
  }
})('undefined' != typeof self ? self : this, function (t, e) {
  return (function (t) {
    function e(n) {
      if (i[n]) return i[n].exports
      var o = (i[n] = { i: n, l: !1, exports: {} })
      return t[n].call(o.exports, o, o.exports, e), (o.l = !0), o.exports
    }
    var i = {}
    return (
      (e.m = t),
      (e.c = i),
      (e.d = function (t, i, n) {
        e.o(t, i) ||
          Object.defineProperty(t, i, {
            configurable: !1,
            enumerable: !0,
            get: n
          })
      }),
      (e.n = function (t) {
        var i =
          t && t.__esModule
            ? function () {
                return t.default
              }
            : function () {
                return t
              }
        return e.d(i, 'a', i), i
      }),
      (e.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
      }),
      (e.p = ''),
      e((e.s = 'JkW7'))
    )
  })({
    '/6ct': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      e.default = {
        name: 'vui-map-playback',
        props: {
          widgetCode: { type: String },
          dataSource: {
            type: Array,
            default: function () {
              return []
            }
          },
          percent: { type: Number, default: 0 },
          movingTime: { type: Number, default: 2e3 }
        },
        data: function () {
          return {
            isStart: !1,
            nowPercent: this.percent,
            movingSmooth: 20,
            movingMarker: null,
            movingPosition: { i: 0, j: 0 },
            speedSpanArray: ['0.5', '1.0', '2.0', '4.0'],
            showSpeedBox: !1,
            speedTime: this.movingTime,
            speedSpan: '1.0',
            disablePlay: !1
          }
        },
        watch: {
          dataSource: function (t) {
            t && t.length > 1
              ? ((this.disablePlay = !1),
                this.findMovingMarker(),
                this.resetEvent())
              : this.movingMarker && (this.disablePlay = !0)
          },
          percent: function (t) {
            t < 0 ||
              this.touch.isMoving ||
              ((this.nowPercent = t),
              this._setProgressWidth(
                this.nowPercent * this._getProgressBarWidth()
              ))
          }
        },
        computed: {
          percentStep: function () {
            var t = 1
            return (
              this.dataSource.length > 1 && (t = this.dataSource.length - 1),
              1 / this.movingSmooth / t
            )
          },
          timeStep: function () {
            return this.speedTime / this.movingSmooth
          }
        },
        created: function () {
          this.touch = { isMoving: !1, startX: 0, left: 0 }
        },
        methods: {
          findMovingMarker: function (t) {
            var e = this
            if (t)
              return (
                (this.movingMarker = t),
                void (
                  this.dataSource &&
                  this.dataSource.length > 1 &&
                  (this.disablePlay = !1)
                )
              )
            this.$nextTick(function () {
              var t = e.$parent.$children,
                i = !1
              t.forEach(function (t) {
                if (t._data && t.movingPath == e.dataSource)
                  return (e.movingMarker = t), void (i = !0)
              }),
                i
                  ? e.dataSource &&
                    e.dataSource.length > 1 &&
                    (e.disablePlay = !1)
                  : ((e.movingMarker = null), (e.disablePlay = !0))
            })
          },
          moving: function (t) {
            t
              ? ((this.isStart = !1), (this.nowPercent = 1))
              : (this.nowPercent += this.percentStep),
              this._setProgressWidth(
                this.nowPercent * this._getProgressBarWidth()
              )
          },
          startEvent: function () {
            this.disablePlay ||
              ((this.isStart = !0),
              this.$emit('on-start'),
              this.movingMarker && this.movingMarker.play())
          },
          pauseEvent: function () {
            ;(this.isStart = !1),
              this.$emit('on-pause'),
              this.movingMarker && this.movingMarker.pause()
          },
          resetEvent: function () {
            this.$emit('on-reset'),
              (this.isStart = !1),
              (this.nowPercent = 0),
              this._setProgressWidth(this.nowPercent),
              this.movingMarker && this.movingMarker.reset()
          },
          openCloseChoseBoxEvent: function () {
            this.showSpeedBox
              ? (this.showSpeedBox = !1)
              : (this.showSpeedBox = !0)
          },
          setSpeedEvent: function (t) {
            ;(this.speedSpan = t),
              (this.speedTime = this.movingTime / parseFloat(t)),
              this.movingMarker &&
                this.movingMarker.setSpeedTime(this.speedTime, this.isStart)
          },
          _getProgressBarWidth: function () {
            return this.$refs.progressBar.clientWidth - 20 - 8
          },
          _setProgressWidth: function (t) {
            ;(this.nowPercent = t / this._getProgressBarWidth()),
              (this.$refs.progress.style.width = 100 * this.nowPercent + '%'),
              (this.$refs.progressBtnWrapper.style.transform =
                'translateX(' + t + 'px)')
          },
          _triggerPercent: function () {
            var t = Math.round(this.nowPercent / this.percentStep)
            this.movingMarker && this.movingMarker.setMovingParameter(t),
              this.$emit('percentChange', this.movingPosition)
          },
          onTouchStart: function (t) {
            this.disablePlay ||
              (this.isStart
                ? (this.touch.isStart = !0)
                : (this.touch.isStart = !1),
              this.pauseEvent(),
              (this.touch.isMoving = !0),
              (this.touch.startX = t.touches[0].pageX),
              (this.touch.left = this.$refs.progress.clientWidth))
          },
          onMouseDown: function (t) {
            this.disablePlay ||
              (this.isStart
                ? (this.touch.isStart = !0)
                : (this.touch.isStart = !1),
              this.pauseEvent(),
              (this.touch.isMoving = !0),
              (this.touch.startX = t.clientX),
              (this.touch.left = this.$refs.progress.clientWidth))
          },
          onTouchMove: function (t) {
            if (!this.touch.isMoving || this.disablePlay) return !1
            var e = t.touches[0].pageX - this.touch.startX,
              i = this.touch.left + e
            ;(i = Math.max(0, i)),
              (i = Math.min(this._getProgressBarWidth(), i)),
              this._setProgressWidth(i)
          },
          onMouseMove: function (t) {
            if (!this.touch.isMoving || this.disablePlay) return !1
            var e = t.clientX - this.touch.startX,
              i = this.touch.left + e
            ;(i = Math.max(0, i)),
              (i = Math.min(this._getProgressBarWidth(), i)),
              this._setProgressWidth(i)
          },
          onTouchEnd: function () {
            if (!this.touch.isMoving || this.disablePlay) return !1
            ;(this.touch.isMoving = !1),
              this._triggerPercent(),
              this.touch.isStart && this.startEvent()
          },
          onMouseUp: function () {
            if (!this.touch.isMoving || this.disablePlay) return !1
            ;(this.touch.isMoving = !1),
              this._triggerPercent(),
              this.touch.isStart && this.startEvent()
          },
          progressClick: function (t) {
            var e = Math.min(t.offsetX, this._getProgressBarWidth())
            this._setProgressWidth(e), this._triggerPercent()
          }
        }
      }
    },
    '6P27': function (t, e, i) {
      'use strict'
      function n(t) {
        i('cnXW')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('LCBt'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('lJ/+'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-8d008d7c',
          null
        )
      e.default = l.exports
    },
    '7siT': function (t, e) {},
    '9E2R': function (t, i) {
      t.exports = e
    },
    '9NPg': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('WcCo'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'BwkS': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement,
            i = t._self._c || e
          return i(
            'div',
            {
              staticClass: 'vui-map-progressbar',
              attrs: { widgetCode: t.widgetCode }
            },
            [
              i('div', { staticClass: 'vui-map-btn-container' }, [
                t.isStart
                  ? i(
                      'div',
                      {
                        staticClass: 'vui-map-progressbar-btn',
                        on: { click: t.pauseEvent }
                      },
                      [i('i', { staticClass: 'ivu-icon ivu-icon-pause' })]
                    )
                  : i(
                      'div',
                      {
                        staticClass: 'vui-map-progressbar-btn',
                        style: { opacity: t.disablePlay ? 0.4 : 1 },
                        on: { click: t.startEvent }
                      },
                      [i('i', { staticClass: 'ivu-icon ivu-icon-play' })]
                    ),
                t._v(' '),
                i(
                  'div',
                  {
                    staticClass: 'vui-map-progressbar-btn',
                    on: { click: t.resetEvent }
                  },
                  [i('i', { staticClass: 'ivu-icon ivu-icon-refresh' })]
                ),
                t._v(' '),
                i(
                  'div',
                  {
                    staticClass: 'vui-map-progressbar-btn',
                    on: { click: t.openCloseChoseBoxEvent }
                  },
                  [
                    i('span', { staticStyle: { 'font-size': '13px' } }, [
                      t._v(t._s(t.speedSpan + 'X'))
                    ]),
                    t._v(' '),
                    i(
                      'transition',
                      { attrs: { name: 'transition-dropdown' } },
                      [
                        i(
                          'ul',
                          {
                            directives: [
                              {
                                name: 'show',
                                rawName: 'v-show',
                                value: t.showSpeedBox,
                                expression: 'showSpeedBox'
                              }
                            ],
                            staticClass: 'vui-map-chose-speed-box'
                          },
                          t._l(t.speedSpanArray, function (e) {
                            return i(
                              'li',
                              {
                                on: {
                                  click: function (i) {
                                    t.setSpeedEvent(e)
                                  }
                                }
                              },
                              [t._v(t._s(e + 'X'))]
                            )
                          })
                        )
                      ]
                    )
                  ],
                  1
                )
              ]),
              t._v(' '),
              i(
                'div',
                {
                  ref: 'progressBar',
                  staticClass: 'vui-map-progressbar-container',
                  on: {
                    touchmove: t.onTouchMove,
                    mousemove: t.onMouseMove,
                    touchend: t.onTouchEnd,
                    mouseup: t.onMouseUp,
                    touchleave: t.onTouchEnd,
                    mouseleave: t.onMouseUp
                  }
                },
                [
                  i('div', { staticClass: 'vui-map-progressbar-inner' }, [
                    i('div', {
                      ref: 'progress',
                      staticClass: 'vui-map-progress-now'
                    }),
                    t._v(' '),
                    i(
                      'div',
                      {
                        ref: 'progressBtnWrapper',
                        staticClass: 'vui-map-progress-btn-wrapper',
                        on: {
                          touchstart: t.onTouchStart,
                          mousedown: t.onMouseDown
                        }
                      },
                      [i('div', { staticClass: 'vui-map-progress-btn' })]
                    )
                  ])
                ]
              )
            ]
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'CmIY': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('aHwg'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'DuR2': function (t, e) {
      var i
      i = (function () {
        return this
      })()
      try {
        i = i || Function('return this')() || (0, eval)('this')
      } catch (t) {
        'object' == typeof window && (i = window)
      }
      t.exports = i
    },
    'EZbE': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement
          return (t._self._c || e)(
            'div',
            { attrs: { widgetCode: t.widgetCode } },
            [t._t('default')],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'HGfK': function (t, e) {},
    'HKHr': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('9E2R'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n),
        s = i('fPSZ')
      e.default = {
        name: 'vui-map-route',
        props: {
          widgetCode: { type: String },
          routeWay: { type: String, default: 'driving' },
          location: { type: [Object, String] },
          start: { type: [Object, String] },
          end: { type: [Object, String] },
          panel: { type: Boolean, default: !1 },
          policy: { type: String },
          autoViewport: { type: Boolean, default: !0 },
          selectFirstResult: { type: Boolean },
          pageCapacity: { type: Number },
          startCity: { type: [String, Number] },
          endCity: { type: [String, Number] },
          waypoints: { type: Array },
          strokeColor: { type: String, default: '#0030ff' },
          strokeWeight: { type: Number, default: 5 },
          strokeOpacity: { type: Number, default: 0.45 },
          strokeStyle: { type: String },
          startIcon: { type: Boolean, default: !0 },
          endIcon: { type: Boolean, default: !0 },
          waypointsIcon: { type: Boolean, default: !0 },
          startIconCompSrc: { type: String },
          startIconAmidSrc: { type: String },
          endIconCompSrc: { type: String },
          endIconAmidSrc: { type: String },
          waypointsIconCompSrc: { type: String },
          waypointsIconAmidSrc: { type: String },
          iconWidth: { type: Number },
          iconHeight: { type: Number },
          lat: { type: String, default: 'lat' },
          lng: { type: String, default: 'lng' }
        },
        data: function () {
          return {
            defaultIconWidth: 19,
            defaultIconHeight: 22,
            endInStartWatch: null,
            waypointsInStartWatch: null,
            routeOverlays: []
          }
        },
        computed: {
          startIconSrc: function () {
            o.default
            return this.startIconAmidSrc
              ? o.default.v3platform.getSrcPathFromId2url(this.startIconAmidSrc)
              : !!this.startIconCompSrc &&
                  o.default.v3platform.getSrcPathFromRes(
                    this,
                    this.startIconCompSrc
                  )
          },
          endIconSrc: function () {
            return this.endIconAmidSrc
              ? o.default.v3platform.getSrcPathFromId2url(this.endIconAmidSrc)
              : !!this.endIconCompSrc &&
                  o.default.v3platform.getSrcPathFromRes(
                    this,
                    this.endIconCompSrc
                  )
          },
          waypointsIconSrc: function () {
            return this.waypointsIconAmidSrc
              ? o.default.v3platform.getSrcPathFromId2url(
                  this.waypointsIconAmidSrc
                )
              : !!this.waypointsIconCompSrc &&
                  o.default.v3platform.getSrcPathFromRes(
                    this,
                    this.waypointsIconCompSrc
                  )
          },
          startIconObj: function () {
            if (this.startIconSrc)
              return {
                url: this.startIconSrc,
                size: {
                  width: this.iconWidth || this.defaultIconWidth,
                  height: this.iconHeight || this.defaultIconHeight
                },
                opts: {
                  imageSize: {
                    width: this.iconWidth || this.defaultIconWidth,
                    height: this.iconHeight || this.defaultIconHeight
                  }
                }
              }
          },
          endIconObj: function () {
            if (this.endIconSrc)
              return {
                url: this.endIconSrc,
                size: {
                  width: this.iconWidth || this.defaultIconWidth,
                  height: this.iconHeight || this.defaultIconHeight
                },
                opts: {
                  imageSize: {
                    width: this.iconWidth || this.defaultIconWidth,
                    height: this.iconHeight || this.defaultIconHeight
                  }
                }
              }
          },
          waypointsIconObj: function () {
            if (this.waypointsIconSrc)
              return {
                url: this.waypointsIconSrc,
                size: {
                  width: this.iconWidth || this.defaultIconWidth,
                  height: this.iconHeight || this.defaultIconHeight
                },
                opts: {
                  imageSize: {
                    width: this.iconWidth || this.defaultIconWidth,
                    height: this.iconHeight || this.defaultIconHeight
                  }
                }
              }
          }
        },
        methods: {
          clearRoute: function () {
            var t = this
            this.routeOverlays.forEach(function (e) {
              t.map.removeOverlay(e)
            }),
              (this.routeOverlays = [])
          },
          getWaypoints: function (t) {
            var e = this
            if (t)
              return t.map(function (t) {
                return e.getPosition({ lng: t[e.lng], lat: t[e.lat] })
              })
          },
          getPosition: function (t) {
            switch (Object.prototype.toString.call(t).slice(8, -1)) {
              case 'String':
                return t
              case 'Object':
                return !(!t.lng || !t.lat) && new BMap.Point(t.lng, t.lat)
              default:
                return !1
            }
          },
          load: function (t) {
            this.map = t
            var e = {
                BMAP_DRIVING_POLICY_LEAST_TIME: BMAP_DRIVING_POLICY_LEAST_TIME,
                BMAP_DRIVING_POLICY_LEAST_DISTANCE:
                  BMAP_DRIVING_POLICY_LEAST_DISTANCE,
                BMAP_DRIVING_POLICY_AVOID_HIGHWAYS:
                  BMAP_DRIVING_POLICY_AVOID_HIGHWAYS
              },
              i = this.routeWay,
              n = this.location,
              o = this.policy,
              a = this.selectFirstResult,
              r = this.autoViewport,
              c = this.start,
              h = this.end,
              l = this.startCity,
              u = this.endCity,
              d = this.waypoints,
              p = this.getPosition
            if (p(c) && p(h)) {
              var g = this.getPosition(n) || t,
                f = this,
                m = {
                  renderOptions: {
                    map: t,
                    panel: f.$el,
                    selectFirstResult: a,
                    autoViewport: r,
                    highlightMode: BMAP_HIGHLIGHT_STEP
                  },
                  policy: e[o],
                  onSearchComplete: function (t) {
                    var e = f.originInstance.getStatus()
                    if (f.originInstance.getStatus() == BMAP_STATUS_SUCCESS)
                      t.getPlan(0) || alert('未能查询到对应的导航路线')
                    else
                      switch (e) {
                        case BMAP_STATUS_CITY_LIST:
                          alert('城市列表')
                          break
                        case BMAP_STATUS_UNKNOWN_LOCATION:
                          alert('未能查询到对应的位置')
                          break
                        case BMAP_STATUS_UNKNOWN_ROUTE:
                          alert('未能查询到对应的导航路线')
                          break
                        case BMAP_STATUS_INVALID_KEY:
                          alert('非法密钥')
                          break
                        case BMAP_STATUS_INVALID_REQUEST:
                          alert('非法请求')
                          break
                        case BMAP_STATUS_PERMISSION_DENIED:
                          alert('没有权限')
                          break
                        case BMAP_STATUS_SERVICE_UNAVAILABLE:
                          alert('服务不可用')
                          break
                        case BMAP_STATUS_TIMEOUT:
                          alert('超时')
                      }
                    f.$emit('on-searchcomplete', t)
                  },
                  onMarkersSet: function (t) {
                    if (t.length > 0) {
                      var e = t[0].marker
                      if (f.startIconObj && f.startIcon) {
                        var i = new BMap.Marker(e.getPosition(), {
                          icon:
                            f.startIconObj &&
                            (0, s.createIcon)(BMap, f.startIconObj)
                        })
                        f.map.addOverlay(i),
                          f.routeOverlays.push(i),
                          f.map.removeOverlay(e)
                      } else
                        f.startIcon
                          ? f.routeOverlays.push(e)
                          : f.map.removeOverlay(e)
                      if (
                        ((e = t[t.length - 1].marker),
                        f.endIconObj && f.endIcon)
                      ) {
                        var n = new BMap.Marker(e.getPosition(), {
                          icon:
                            f.endIconObj &&
                            (0, s.createIcon)(BMap, f.endIconObj)
                        })
                        f.map.addOverlay(n),
                          f.routeOverlays.push(n),
                          f.map.removeOverlay(e)
                      } else
                        f.endIcon
                          ? f.routeOverlays.push(e)
                          : f.map.removeOverlay(e)
                      f.map.getOverlays().forEach(function (t) {
                        if (t.getIcon) {
                          if (
                            'http://api0.map.bdimg.com/images/way-points.png' ==
                            t.getIcon().imageUrl
                          )
                            if (f.waypointsIconObj) {
                              var e = new BMap.Marker(t.getPosition(), {
                                icon:
                                  f.waypointsIconObj &&
                                  (0, s.createIcon)(BMap, f.waypointsIconObj)
                              })
                              f.map.addOverlay(e),
                                f.routeOverlays.push(e),
                                f.map.removeOverlay(t)
                            } else
                              f.waypointsIcon
                                ? f.routeOverlays.push(t)
                                : f.map.removeOverlay(t)
                        }
                      })
                    }
                    f.$emit('on-markersset', t)
                  },
                  onInfoHtmlSet: function (t) {
                    f.$emit('on-infohtmlset', t)
                  },
                  onPolylinesSet: function (e) {
                    if (
                      '#0030ff' != f.strokeColor ||
                      5 != f.strokeWeight ||
                      0.45 != f.strokeOpacity ||
                      f.strokeStyle
                    )
                      for (var i = 0; e[i]; ) {
                        var n = e[i].getPolyline(),
                          o = e[i].getPath()
                        t.removeOverlay(n)
                        var s = new BMap.Polyline(o, {
                          strokeColor: f.strokeColor,
                          strokeWeight: f.strokeWeight,
                          strokeOpacity: f.strokeOpacity,
                          strokeStyle: f.strokeStyle
                        })
                        t.addOverlay(s), f.routeOverlays.push(s), i++
                      }
                    else
                      for (var a = 0; e[a]; ) {
                        var n = e[a].getPolyline()
                        f.routeOverlays.push(n), a++
                      }
                    f.$emit('on-polylinesset', e)
                  },
                  onResultsHtmlSet: function (t) {
                    f.$emit('on-resultshtmlset', t)
                  }
                }
              if ('driving' === i) {
                ;(this.originInstance = new BMap.DrivingRoute(g, m)).search(
                  this.getPosition(c),
                  this.getPosition(h),
                  { startCity: l, endCity: u, waypoints: this.getWaypoints(d) }
                )
              } else if ('walking' === i) {
                var v = (this.originInstance = new BMap.WalkingRoute(g, m))
                v.search(this.getPosition(c), this.getPosition(h))
              } else if ('transit' === i) {
                var y = (this.originInstance = new BMap.TransitRoute(g, m))
                y.search(this.getPosition(c), this.getPosition(h))
              }
            }
          }
        },
        mounted: function () {},
        beforeDestroy: function () {
          this.clearRoute()
        },
        watch: {
          '$parent.map': {
            handler: function (t) {
              var e = this
              t &&
                ((this.map = t),
                this.$nextTick(function () {
                  e.load(t)
                }))
            },
            immediate: !0
          },
          'location': {
            handler: function (t) {
              var e = this.originInstance,
                i = this.map
              e.setLocation(t || i)
            },
            deep: !0
          },
          'start': {
            handler: function (t) {
              var e = this.originInstance,
                i = this.end,
                n = this.startCity,
                o = this.endCity,
                s = this.waypoints,
                a = (this.BMap, this.getWaypoints),
                r = this.getPosition,
                c = this.map
              this.waypointsInStartWatch
              if (
                (i &&
                  (i.lng
                    ? ((this.endInStartWatch = {}),
                      (this.endInStartWatch.lng = i.lng),
                      (this.endInStartWatch.lat = i.lat))
                    : (this.endInStartWatch = i)),
                s && (this.waypointsInStartWatch = s),
                !e && c)
              )
                return void this.load(c)
              e &&
                r(t) &&
                r(i) &&
                (this.clearRoute(),
                e.search(r(t), r(i), {
                  startCity: n,
                  endCity: o,
                  waypoints: a(s)
                }))
            },
            deep: !0
          },
          'end': {
            handler: function (t) {
              var e = this.originInstance,
                i = this.start,
                n = this.startCity,
                o = this.endCity,
                s = this.waypoints,
                a = this.getWaypoints,
                r = this.getPosition,
                c = this.map,
                h = this.endInStartWatch
              if (t != h && (t.lng != h.lng || t.lat != h.lat))
                return !e && c
                  ? void this.load(c)
                  : void (
                      e &&
                      r(i) &&
                      r(t) &&
                      (this.clearRoute(),
                      e.search(r(i), r(t), {
                        startCity: n,
                        endCity: o,
                        waypoints: a(s)
                      }))
                    )
            },
            deep: !0
          },
          'startCity': function (t) {
            var e = this.originInstance,
              i = this.start,
              n = this.end,
              o = this.endCity,
              s = this.waypoints,
              a = this.getWaypoints
            e &&
              (this.clearRoute(),
              e.search(i, n, { val: t, endCity: o, waypoints: a(s) }))
          },
          'endCity': function (t) {
            var e = this.originInstance,
              i = this.start,
              n = this.end,
              o = this.startCity,
              s = this.waypoints,
              a = this.getWaypoints
            e &&
              (this.clearRoute(),
              e.search(i, n, { startCity: o, val: t, waypoints: a(s) }))
          },
          'waypoints': {
            handler: function (t) {
              var e = this.originInstance,
                i = this.start,
                n = this.end,
                o = this.startCity,
                s = this.endCity,
                a = this.getWaypoints,
                r = this.waypointsInStartWatch
              e &&
                t != r &&
                (this.clearRoute(),
                e.search(i, n, { startCity: o, endCity: s, waypoints: a(t) }))
            },
            deep: !0
          },
          'panel': function () {
            this.load(this.map)
          },
          'policy': function (t) {
            this.load(this.map)
          },
          'autoViewport': function () {
            this.load(this.map)
          },
          'selectFirstResult': function () {
            this.load(this.map)
          },
          'highlightMode': function () {
            this.load(this.map)
          },
          'strokeColor': function () {
            var t = this,
              e = this.routeOverlays,
              i = []
            e &&
              e.length > 0 &&
              (e.forEach(function (e) {
                e.getPath()
                var n = new BMap.Polyline(arrPois, {
                  strokeColor: t.strokeColor,
                  strokeWeight: t.strokeWeight,
                  strokeOpacity: t.strokeOpacity,
                  strokeStyle: t.strokeStyle
                })
                t.map.addOverlay(n), i.push(n)
              }),
              this.clearRoute(),
              (this.routeOverlays = i))
          },
          'strokeWeight': function () {
            var t = this,
              e = this.routeOverlays,
              i = []
            e &&
              e.length > 0 &&
              (e.forEach(function (e) {
                e.getPath()
                var n = new BMap.Polyline(arrPois, {
                  strokeColor: t.strokeColor,
                  strokeWeight: t.strokeWeight,
                  strokeOpacity: t.strokeOpacity,
                  strokeStyle: t.strokeStyle
                })
                t.map.addOverlay(n), i.push(n)
              }),
              this.clearRoute(),
              (this.routeOverlays = i))
          },
          'strokeOpacity': function () {
            var t = this,
              e = this.routeOverlays,
              i = []
            e &&
              e.length > 0 &&
              (e.forEach(function (e) {
                e.getPath()
                var n = new BMap.Polyline(arrPois, {
                  strokeColor: t.strokeColor,
                  strokeWeight: t.strokeWeight,
                  strokeOpacity: t.strokeOpacity,
                  strokeStyle: t.strokeStyle
                })
                t.map.addOverlay(n), i.push(n)
              }),
              this.clearRoute(),
              (this.routeOverlays = i))
          },
          'strokeStyle': function () {
            var t = this,
              e = this.routeOverlays,
              i = []
            e &&
              e.length > 0 &&
              (e.forEach(function (e) {
                e.getPath()
                var n = new BMap.Polyline(arrPois, {
                  strokeColor: t.strokeColor,
                  strokeWeight: t.strokeWeight,
                  strokeOpacity: t.strokeOpacity,
                  strokeStyle: t.strokeStyle
                })
                t.map.addOverlay(n), i.push(n)
              }),
              this.clearRoute(),
              (this.routeOverlays = i))
          }
        }
      }
    },
    'HieI': function (t, e) {},
    'Jeix': function (t, e) {},
    'JkW7': function (t, e, i) {
      'use strict'
      function n(t) {
        return t && t.__esModule ? t : { default: t }
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('vdEr'),
        s = n(o),
        a = i('W9KF'),
        r = n(a),
        c = i('iEdS'),
        h = n(c),
        l = i('CmIY'),
        u = n(l),
        d = i('mcMA'),
        p = n(d),
        g = i('9NPg'),
        f = n(g),
        m = i('cDym'),
        v = n(m),
        y = i('udpM'),
        I = n(y),
        S = i('lRwf'),
        M = n(S)
      M.default.component(s.default.name, s.default),
        M.default.component(r.default.name, r.default),
        M.default.component(h.default.name, h.default),
        M.default.component(u.default.name, u.default),
        M.default.component(p.default.name, p.default),
        M.default.component(f.default.name, f.default),
        M.default.component(v.default.name, v.default),
        M.default.component(I.default.name, I.default),
        (e.default = {
          vuiMap: s.default,
          vuiMapMarker: r.default,
          vuiMapInfoWindow: h.default,
          vuiMapPolyline: u.default,
          vuiMapSearch: p.default,
          vuiMapRoute: f.default,
          vuiMapPlayback: v.default,
          vuiMapPolygon: I.default
        })
    },
    'K6W/': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('fPSZ')
      e.default = {
        name: 'vui-map-search',
        props: {
          widgetCode: { type: String },
          searchType: { type: String, default: 'local-search' },
          location: { type: [Object, String] },
          keyword: { type: [Array, String] },
          autoViewport: { type: Boolean },
          selectFirstResult: { type: Boolean },
          panel: { type: Boolean, default: !0 },
          forceLocal: { type: Boolean },
          customData: { type: Object },
          bounds: { type: Object },
          nearby: { type: Object },
          pageCapacity: { type: Number }
        },
        data: function () {
          return {}
        },
        methods: {
          searchNearby: function (t) {
            var e = this.originInstance,
              i = this.keyword,
              o = this.customData,
              s = this.BMap
            e.searchNearby(i, (0, n.createPoint)(s, t.center), t.radius, o)
          },
          searchInBounds: function (t) {
            var e = this.originInstance,
              i = this.keyword,
              o = this.customData,
              s = this.BMap
            e.searchInBounds(i, (0, n.createBounds)(s, t), o)
          },
          localSearch: function () {
            var t = this.originInstance,
              e = this.keyword,
              i = this.forceLocal,
              n = this.customData,
              o = this.nearby,
              s = this.bounds,
              a = this.searchNearby,
              r = this.searchInBounds
            o ? a(o) : s ? r(s) : t.search(e, { forceLocal: i, customData: n })
          },
          busSearch: function () {
            this.originInstance.getBusList(keyword)
          },
          getPosition: function (t) {
            switch (Object.prototype.toString.call(t).slice(8, -1)) {
              case 'String':
                return t
              case 'Object':
                return new BMap.Point(t.lng, t.lat)
              default:
                return !1
            }
          },
          load: function (t) {
            this.map = t
            var e = this.location,
              i = this.selectFirstResult,
              n = this.autoViewport,
              o = (this.highlightMode, this.keyword, this.search),
              s = this.originInstance,
              a = this.pageCapacity,
              r = this.searchType,
              c = this.getPosition(e) || t,
              h = this,
              l = {
                renderOptions: {
                  map: t,
                  panel: this.$el,
                  selectFirstResult: i,
                  autoViewport: n
                },
                pageCapacity: a,
                onGetBusListComplete: function (t) {
                  s && s !== o && s.clearResults(),
                    h.$emit('on-getbuslistcomplete', t)
                },
                onGetBusLineComplete: function (t) {
                  s && s !== o && s.clearResults(),
                    h.$emit('on-getbuslinecomplete', t)
                },
                onBusListHtmlSet: function (t) {
                  h.$emit('on-buslisthtmlset', t)
                },
                onBusLineHtmlSet: function (t) {
                  h.$emit('on-buslinehtmlset', t)
                },
                onSearchComplete: function (e) {
                  if (
                    h.originInstance.getStatus() == BMAP_STATUS_SUCCESS &&
                    h.color
                  ) {
                    var i = e.getPlan(0).getRoute(0).getPath()
                    t.addOverlay(
                      new BMap.Polyline(i, { strokeColor: h.color })
                    ),
                      t.setViewport(i)
                  }
                  h.$emit('on-searchcomplete', e)
                },
                onMarkersSet: function (t) {
                  h.$emit('on-markersset', t)
                },
                onInfoHtmlSet: function (t) {
                  h.$emit('on-infohtmlset', t)
                },
                onPolylinesSet: function (t) {
                  h.$emit('on-polylinesset', t)
                },
                onResultsHtmlSet: function (t) {
                  h.$emit('on-resultshtmlset', t)
                }
              }
            if ('local-search' === r) {
              this.originInstance = new BMap.LocalSearch(c, l)
              this.localSearch()
            } else if ('bus' === r) {
              this.originInstance = new BMap.BusLineSearch(c, l)
              this.busSearch()
            }
          }
        },
        watch: {
          '$parent.map': {
            handler: function (t) {
              var e = this
              t &&
                ((this.map = t),
                this.$nextTick(function () {
                  e.load(t)
                }))
            },
            immediate: !0
          },
          'location': {
            handler: function (t) {
              var e = this.originInstance,
                i = this.localSearch,
                n = this.busSearch,
                o = this.searchType
              e.setLocation(t || this.map),
                'local-search' == o ? i() : 'bus' == o && n()
            },
            deep: !0
          },
          'keyword': function () {
            var t = this.localSearch,
              e = this.busSearch,
              i = this.searchType
            'local-search' == i ? t() : 'bus' == i && e()
          },
          'bounds': {
            handler: function (t) {
              ;(0, this.searchInBounds)(t)
            },
            deep: !0
          },
          'nearby': {
            handler: function (t) {
              ;(0, this.searchNearby)(t)
            },
            deep: !0
          },
          'pageCapacity': function (t) {
            this.originInstance && this.originInstance.setPageCapacity(t)
          },
          'autoViewport': function (t) {
            this.originInstance &&
              (t
                ? this.originInstance.enableAutoViewport()
                : this.originInstance.disableAutoViewport())
          },
          'selectFirstResult': function (t) {
            this.originInstance &&
              (t
                ? this.originInstance.enableFirstResultSelection()
                : this.originInstance.disableFirstResultSelection())
          }
        }
      }
    },
    'LCBt': function (t, e, i) {
      'use strict'
      ;(function (t) {
        Object.defineProperty(e, '__esModule', { value: !0 })
        var n = i('9E2R'),
          o = (function (t) {
            return t && t.__esModule ? t : { default: t }
          })(n),
          s = i('fPSZ'),
          a = [
            'click',
            'dblclick',
            'rightclick',
            'rightdblclick',
            'maptypechange',
            'mousemove',
            'mouseover',
            'mouseout',
            'movestart',
            'moving',
            'moveend',
            'zoomstart',
            'zoomend',
            'addoverlay',
            'addcontrol',
            'removecontrol',
            'removeoverlay',
            'clearoverlays',
            'dragstart',
            'dragging',
            'dragend',
            'addtilelayer',
            'removetilelayer',
            'load',
            'resize',
            'hotspotclick',
            'hotspotover',
            'hotspotout',
            'tilesloaded',
            'touchstart',
            'touchmove',
            'touchend',
            'longpress'
          ]
        e.default = {
          name: 'vui-map',
          props: {
            widgetCode: { type: String },
            point: { type: String },
            width: { type: String, default: '100%' },
            height: { type: String, default: '100%' },
            lng: { type: Number, default: 116.404 },
            lat: { type: Number, default: 39.915 },
            zoom: { type: Number, default: 15 },
            minZoom: { type: Number },
            maxZoom: { type: Number },
            mapClick: { type: Boolean, default: !0 },
            mapType: { type: String },
            dragging: { type: Boolean, default: !0 },
            scrollWheelZoom: { type: Boolean, default: !1 },
            doubleClickZoom: { type: Boolean, default: !0 },
            keyboard: { type: Boolean, default: !0 },
            pinchToZoom: { type: Boolean, default: !0 },
            autoResize: { type: Boolean, default: !0 },
            scale: { type: Boolean, default: !1 },
            scaleAnchor: { type: String },
            scaleOffset: { type: Object },
            navigation: { type: Boolean, default: !1 },
            navigationAnchor: { type: String },
            navigationOffset: { type: Object },
            navigationType: { type: String },
            navigationShowZoomInfo: { type: Boolean },
            navigationEnableGeolocation: { type: Boolean, default: !1 },
            geolocation: { type: Boolean, default: !1 },
            geolocationAnchor: { type: String },
            geolocationOffset: { type: Object },
            geolocationShowAddressBar: { type: Boolean },
            geolocationAutoLocation: { type: Boolean, default: !1 },
            locationIconAmidSrc: { type: String },
            locationIconCompSrc: { type: String },
            locationIconWidth: { type: Number },
            locationIconHeight: { type: Number }
          },
          data: function () {
            return {
              center: this.point
                ? this.point
                : { lng: this.lng, lat: this.lat },
              baiduMap: null,
              map: null,
              mapId: 'vui_map_' + (1e3 * Math.random()).toFixed(0)
            }
          },
          computed: {
            styles: function () {
              var t = {}
              return (
                (t.position = 'relative'),
                this.width && (t.width = this.width),
                this.height && (t.height = this.height),
                (t['user-select'] = 'none'),
                t
              )
            },
            localIconSrc: function () {
              return this.locationIconAmidSrc
                ? o.default.v3platform.getSrcPathFromId2url(
                    this.locationIconAmidSrc
                  )
                : !!this.locationIconCompSrc &&
                    o.default.v3platform.getSrcPathFromRes(
                      this,
                      this.locationIconCompSrc
                    )
            },
            localIcon: function () {
              var t = !1
              return (
                this.localIconSrc &&
                  this.locationIconWidth &&
                  this.locationIconHeight &&
                  (t = {
                    url: this.localIconSrc,
                    size: {
                      width: this.locationIconWidth,
                      height: this.locationIconHeight
                    },
                    opts: {
                      imageSize: {
                        width: this.locationIconWidth,
                        height: this.locationIconHeight
                      }
                    }
                  }),
                t
              )
            }
          },
          methods: {
            setMapOptions: function () {
              var e = this.map,
                i = this.minZoom,
                n = this.maxZoom,
                o = this.mapType,
                s = this.dragging,
                a = this.scrollWheelZoom,
                r = this.doubleClickZoom,
                c = this.keyboard,
                h = this.pinchToZoom,
                l = this.autoResize
              i && e.setMinZoom(i),
                n && e.setMaxZoom(n),
                o && e.setMapType(t[o]),
                s ? e.enableDragging() : e.disableDragging(),
                a ? e.enableScrollWheelZoom() : e.disableScrollWheelZoom(),
                r ? e.enableDoubleClickZoom() : e.disableDoubleClickZoom(),
                c ? e.enableKeyboard() : e.disableKeyboard(),
                e.enableInertialDragging(),
                e.enableContinuousZoom(),
                h ? e.enablePinchToZoom() : e.disablePinchToZoom(),
                l ? e.enableAutoResize() : e.disableAutoResize()
            },
            getCenterPoint: function () {
              var t = this.center
              switch (Object.prototype.toString.call(t).slice(8, -1)) {
                case 'String':
                  return t
                case 'Object':
                  return new BMap.Point(t.lng, t.lat)
                default:
                  return new BMap.Point()
              }
            },
            loadControl: function () {
              var t = this,
                e = this.map,
                i = this.scale,
                n = this.scaleAnchor,
                o = this.scaleOffset,
                a = this.navigation,
                r = this.navigationAnchor,
                c = this.navigationOffset,
                h = this.navigationType,
                l = this.navigationShowZoomInfo,
                u = this.navigationEnableGeolocation,
                d = this.geolocation,
                p = this.geolocationAnchor,
                g = this.geolocationOffset,
                f = this.geolocationShowAddressBar,
                m = this.geolocationAutoLocation,
                v = this.localIcon,
                y = {
                  TOP_LEFT: BMAP_ANCHOR_TOP_LEFT,
                  TOP_RIGHT: BMAP_ANCHOR_TOP_RIGHT,
                  BOTTOM_LEFT: BMAP_ANCHOR_BOTTOM_LEFT,
                  BOTTOM_RIGHT: BMAP_ANCHOR_BOTTOM_RIGHT,
                  BMAP_NORMAL_MAP: BMAP_NORMAL_MAP,
                  BMAP_PERSPECTIVE_MAP: BMAP_PERSPECTIVE_MAP,
                  BMAP_SATELLITE_MAP: BMAP_SATELLITE_MAP,
                  BMAP_HYBRID_MAP: BMAP_HYBRID_MAP,
                  BMAP_NAVIGATION_CONTROL_LARGE: BMAP_NAVIGATION_CONTROL_LARGE,
                  BMAP_NAVIGATION_CONTROL_SMALL: BMAP_NAVIGATION_CONTROL_SMALL,
                  BMAP_NAVIGATION_CONTROL_PAN: BMAP_NAVIGATION_CONTROL_PAN,
                  BMAP_NAVIGATION_CONTROL_ZOOM: BMAP_NAVIGATION_CONTROL_ZOOM
                }
              if (
                (i &&
                  ((this.scaleInstance = new BMap.ScaleControl({
                    anchor: n && void 0 != y[n] ? y[n] : BMAP_ANCHOR_TOP_LEFT,
                    offset:
                      o && (0, s.createSize)(BMap, { width: o.x, height: o.y })
                  })),
                  e.addControl(this.scaleInstance)),
                a &&
                  ((this.navigationInstance = new BMap.NavigationControl({
                    anchor: r && void 0 != y[r] ? y[r] : BMAP_ANCHOR_TOP_RIGHT,
                    offset:
                      c && (0, s.createSize)(BMap, { width: c.x, height: c.y }),
                    type: y[h],
                    showZoomInfo: l,
                    enableGeolocation: u
                  })),
                  e.addControl(this.navigationInstance)),
                d)
              ) {
                var I = this.$children,
                  S = { width: 10, height: 30 }
                I.forEach(function (t) {
                  t.dataSource &&
                    t.movingTime &&
                    (S = { width: 10, height: 50 })
                }),
                  (this.geolocationInstance = new BMap.GeolocationControl({
                    anchor:
                      p && void 0 != y[p] ? y[p] : BMAP_ANCHOR_BOTTOM_RIGHT,
                    showAddressBar: f,
                    enableAutoLocation: m,
                    offset: g
                      ? (0, s.createSize)(BMap, { width: g.x, height: g.y })
                      : (0, s.createSize)(BMap, S),
                    locationIcon: v && (0, s.createIcon)(BMap, v)
                  })),
                  e.addControl(this.geolocationInstance),
                  this.geolocationInstance.addEventListener(
                    'locationSuccess',
                    function (e) {
                      t.$emit('on-locationSuccess', e)
                    }
                  ),
                  this.geolocationInstance.addEventListener(
                    'locationError',
                    function (e) {
                      t.$emit('on-locationError', e),
                        alert('定位失败， 请检查GPS定位功能是否正常')
                    }
                  )
              }
            },
            loopForBMap: function () {
              var t = this
              this.$nextTick(function () {
                BMap
                  ? ((t.baiduMap = BMap),
                    t.baiduMap &&
                      !t.baiduMap.Map &&
                      t.$set(t.baiduMap, 'Map', 0))
                  : t.loopForBMap()
              })
            }
          },
          mounted: function () {
            this.loopForBMap()
          },
          watch: {
            'point': function () {
              if (this.point && ((this.center = this.point), this.map)) {
                var t = this.map,
                  e = this.getCenterPoint,
                  i = this.zoom
                t.centerAndZoom(e(), i)
              }
            },
            'lat': function () {
              if (
                this.lng &&
                this.lat &&
                ((this.center = { lng: this.lng, lat: this.lat }), this.map)
              ) {
                var t = this.map,
                  e = this.getCenterPoint,
                  i = this.zoom
                t.centerAndZoom(e(), i)
              }
            },
            'zoom': function () {
              if (this.zoom && this.center && this.map) {
                var t = this.map,
                  e = this.getCenterPoint,
                  i = this.zoom
                t.centerAndZoom(e(), i)
              }
            },
            'baiduMap.Map': {
              handler: function () {
                var t = this
                !this.map &&
                  BMap &&
                  'function' == typeof BMap.Map &&
                  this.$nextTick(function () {
                    var e =
                      (t.$el,
                      new BMap.Map(t.mapId, {
                        enableHighResolution: !0,
                        enableMapClick: t.mapClick
                      }))
                    t.map = e
                    var i = t.setMapOptions,
                      n = t.zoom,
                      o = t.getCenterPoint
                    i(),
                      e.centerAndZoom(o(), n),
                      a.forEach(function (i) {
                        e.addEventListener(i, function (e) {
                          t.$emit('on-' + i, e)
                        })
                      }),
                      t.loadControl()
                  })
              },
              immediate: !0,
              deep: !0
            }
          }
        }
      }.call(e, i('DuR2')))
    },
    'LMHS': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('9E2R'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n),
        s = i('fPSZ'),
        a = [
          'click',
          'dblclick',
          'mousedown',
          'mouseup',
          'mouseout',
          'mouseover',
          'remove',
          'infowindowclose',
          'infowindowopen',
          'dragstart',
          'dragging',
          'dragend',
          'rightclick'
        ]
      e.default = {
        name: 'vui-map-marker',
        props: {
          widgetCode: { type: String },
          position: {
            type: Object,
            default: function () {
              return { lng: 0, lat: 0 }
            }
          },
          offset: {},
          massClear: { type: Boolean, default: !0 },
          dragging: { type: Boolean, default: !1 },
          clicking: { type: Boolean, default: !0 },
          raiseOnDrag: { type: Boolean, default: !1 },
          draggingCursor: { type: String },
          rotation: { type: Number },
          shadow: { type: Object },
          title: { type: String },
          label: { type: Object },
          animation: { type: String },
          top: { type: Boolean, default: !1 },
          zIndex: { type: Number, default: 0 },
          iconAmidSrc: { type: String },
          iconCompSrc: { type: String },
          iconWidth: { type: Number },
          iconHeight: { type: Number },
          movingPath: { type: Array },
          movingTime: { type: Number, default: 2e3 },
          movingRotate: { type: Boolean, default: !0 },
          movingFollow: { type: Boolean, default: !0 },
          isUniformity: { type: Boolean, default: !0 },
          lng: { type: String, default: 'lng' },
          lat: { type: String, default: 'lat' }
        },
        data: function () {
          return {
            defaultIconWidth: 19,
            defaultIconHeight: 22,
            movingParameter: null,
            movingSmooth: 20,
            speedTime: this.movingTime,
            map: this.$parent.map,
            progressbar: null,
            isLoaded: !1
          }
        },
        computed: {
          iconSrc: function () {
            o.default
            return this.iconAmidSrc
              ? o.default.v3platform.getSrcPathFromId2url(this.iconAmidSrc)
              : !!this.iconCompSrc &&
                  o.default.v3platform.getSrcPathFromRes(this, this.iconCompSrc)
          },
          icon: function () {
            var t = !1
            return (
              this.iconSrc &&
                ((t = {
                  url: this.iconSrc,
                  size: {
                    width: this.iconWidth || this.defaultIconWidth,
                    height: this.iconHeight || this.defaultIconHeight
                  },
                  opts: {
                    imageSize: {
                      width: this.iconWidth || this.defaultIconWidth,
                      height: this.iconHeight || this.defaultIconHeight
                    }
                  }
                }),
                this.originInstance &&
                  this.originInstance.setIcon((0, s.createIcon)(BMap, t))),
              t
            )
          }
        },
        beforeDestroy: function () {
          this.map.removeOverlay(this.originInstance),
            (this.originInstance = null)
        },
        methods: {
          load: function (t) {
            var e = this
            if (!this.originInstance) {
              var i = this.position,
                n = this.offset,
                o = this.icon,
                r = this.massClear,
                c = this.dragging,
                h = this.clicking,
                l = this.raiseOnDrag,
                u = this.draggingCursor,
                d = this.rotation,
                p = this.shadow,
                g = this.title,
                f = this.label,
                m = this.animation,
                v = this.top,
                y = (this.$parent, this.zIndex),
                I = this.lng,
                S = this.lat,
                M = new BMap.Marker(new BMap.Point(i[I], i[S]), {
                  offset: n,
                  icon: o && (0, s.createIcon)(BMap, o),
                  enableMassClear: r,
                  enableDragging: c,
                  enableClicking: h,
                  raiseOnDrag: l,
                  draggingCursor: u,
                  rotation: d,
                  shadow: p,
                  title: g
                })
              ;(this.originInstance = M),
                f && M && M.setLabel((0, s.createLabel)(BMap, f)),
                M.setTop(v),
                M.setZIndex(y),
                a.forEach(function (t) {
                  M.addEventListener(t, function (i) {
                    e.$emit('on-' + t, i)
                  })
                }),
                t.addOverlay(M),
                'BMAP_ANIMATION_DROP' === m
                  ? M.setAnimation(BMAP_ANIMATION_DROP)
                  : 'BMAP_ANIMATION_BOUNCE' === m &&
                    M.setAnimation(BMAP_ANIMATION_BOUNCE),
                this.movingPath &&
                  this.movingPath.length > 1 &&
                  (this.isUniformity && this.setSameSpeed(),
                  this.reset(),
                  this.findProgressbar()),
                (this.isLoaded = !0)
            }
          },
          setRotation: function (t, e) {
            var i = (this.lat, this.lng, this.map),
              n = this.originInstance,
              o = 0,
              t = i.pointToPixel(new BMap.Point(t.lng, t.lat))
            if (
              ((e = i.pointToPixel(new BMap.Point(e.lng, e.lat))), e.x != t.x)
            ) {
              var s = (e.y - t.y) / (e.x - t.x)
              ;(o = (360 * Math.atan(s)) / (2 * Math.PI)),
                (o = e.x < t.x ? 90 - o + 90 : -o),
                n.setRotation(-o)
            } else {
              var a = e.y - t.y,
                r = 0
              ;(r = a > 0 ? -1 : 1), n.setRotation(90 * -r)
            }
          },
          setSpeedTime: function (t, e) {
            ;(this.movingParameter.time = t / this.movingSmooth),
              (this.speedTime = t),
              e && this.play()
          },
          setMovingParameter: function (t) {
            var e = void 0,
              i = void 0,
              n = this.speedArray
            if (this.isUniformity) {
              t >= this.movingSmooth * n.length && ((i = 0), (e = n.length))
              for (var o = 0; o < n.length; o++) {
                if (!(t - n[o] >= 0)) {
                  ;(i = t), (e = o)
                  break
                }
                t -= n[o]
              }
            } else
              (e = Math.floor(t / this.movingSmooth)),
                (i = t % this.movingSmooth)
            ;(this.movingParameter.i = e), (this.movingParameter.j = i)
            var s = this.lat,
              a = this.lng,
              r = this.movingParameter.path,
              c = 0,
              h = 0,
              l = this.isUniformity ? n[e] : this.movingParameter.num
            e < r.length - 1 &&
              ((c = (r[e + 1][s] - r[e][s]) / l),
              (h = (r[e + 1][a] - r[e][a]) / l))
            var u = new BMap.Point(r[e][a], r[e][s])
            if (
              (this.movingFollow && this.map.panTo(u),
              this.originInstance &&
                this.originInstance.setPosition(
                  new BMap.Point(r[e][a] + h * i, r[e][s] + c * i)
                ),
              e >= r.length - 1)
            )
              return (
                clearInterval(this.timer),
                void (this.progressbar && this.progressbar.moving(!0))
              )
            this.movingRotate && this.setRotation(r[e], r[e + 1]),
              (this.movingParameter.lat = c),
              (this.movingParameter.lng = h),
              (this.movingParameter.num = l)
          },
          reset: function () {
            this.pause()
            var t = this.speedTime,
              e = 0
            e =
              this.isUniformity && this.speedArray
                ? this.speedArray[0]
                : this.movingSmooth
            var i = this.movingPath
            i &&
              t &&
              i.length > 1 &&
              ((this.movingParameter = {
                i: 0,
                j: 0,
                path: i,
                time: t / this.movingSmooth,
                num: e
              }),
              this.originInstance &&
                this.originInstance.setPosition(
                  new BMap.Point(i[0][this.lng], i[0][this.lat])
                ))
          },
          play: function () {
            var t = this,
              e = this.movingParameter
            this.speedTime
            this.isUniformity ? this.speedArray[e.i] : this.movingSmooth
            this.movingPath
            if (
              (this.timer && clearInterval(this.timer),
              this.movingParameter.i >= this.movingParameter.path.length - 1)
            )
              return void (this.progressbar && this.progressbar.moving(!0))
            this.timer = setInterval(function () {
              t.Moving()
            }, e.time)
          },
          pause: function () {
            clearInterval(this.timer)
          },
          Moving: function () {
            var t = this.movingParameter,
              e = this.lat,
              i = this.lng,
              n = t.i,
              o = t.j,
              s = t.path,
              a = t.lat,
              r = t.lng,
              c = t.num
            if (0 == o) {
              var h = new BMap.Point(s[n][i], s[n][e])
              this.movingFollow && this.map.panTo(h),
                this.movingRotate && this.setRotation(s[n], s[n + 1]),
                (a = (s[n + 1][e] - s[n][e]) / c),
                (r = (s[n + 1][i] - s[n][i]) / c),
                (t.lat = a),
                (t.lng = r)
            }
            var l = { lng: s[n][i] + r * o, lat: s[n][e] + a * o }
            new BMap.Point(l.lng, l.lat)
            if (
              (this.originInstance &&
                this.originInstance.setPosition(new BMap.Point(l.lng, l.lat)),
              o >= c - 1 && ((o = -1), ++n >= s.length - 1))
            )
              return (
                clearInterval(this.timer),
                void (this.progressbar && this.progressbar.moving(!0))
              )
            o++,
              (t.i = n),
              (t.j = o),
              this.isUniformity && (t.num = this.speedArray[n]),
              this.progressbar && this.progressbar.moving(!1)
          },
          findProgressbar: function () {
            var t = this
            this.$nextTick(function () {
              t.$parent.$children.forEach(function (e) {
                if (e._data && e.dataSource == t.movingPath)
                  return (t.progressbar = e), void e.findMovingMarker(t)
              })
            })
          },
          setSameSpeed: function () {
            var t = this
            if (BMap && BMap.Point) {
              var e = this.movingPath,
                i = 0,
                n = [],
                o = [],
                s = new BMap.Point(e[0][this.lng], e[0][this.lat]),
                a = null
              e.forEach(function (o, r) {
                if (!(r >= e.length - 1)) {
                  a = new BMap.Point(e[r + 1][t.lng], e[r + 1][t.lat])
                  var c = t.map.getDistance(s, a)
                  ;(s = new BMap.Point(e[r + 1][t.lng], e[r + 1][t.lat])),
                    n.push(c),
                    (i += c)
                }
              }),
                n.forEach(function (n) {
                  var s = Math.round(
                    (n / i) * (t.movingSmooth * (e.length - 1))
                  )
                  o.push(s)
                }),
                (this.speedArray = o)
            }
          }
        },
        watch: {
          '$parent.map': {
            handler: function (t) {
              var e = this
              t &&
                ((this.map = t),
                this.$nextTick(function () {
                  e.load(t)
                }))
            },
            immediate: !0
          },
          'movingPath': {
            handler: function (t) {
              this.isLoaded && this.load(this.map),
                t && t.length > 1
                  ? (this.isUniformity && this.setSameSpeed(),
                    this.progressbar
                      ? this.progressbar.resetEvent()
                      : this.reset(),
                    this.findProgressbar())
                  : this.position &&
                    this.position.lng &&
                    this.position.lat &&
                    (0 != this.position.lng || 0 != this.position.lat) &&
                    this.originInstance
                  ? this.originInstance.setPosition(
                      new BMap.Point(
                        this.position[this.lng],
                        this.position[this.lat]
                      )
                    )
                  : this.originInstance &&
                    (this.progressbar
                      ? (this.progressbar.resetEvent(),
                        (this.progressbar._data.disablePlay = !0))
                      : this.reset(),
                    this.map.removeOverlay(this.originInstance),
                    (this.originInstance = null))
            },
            immediate: !0,
            deep: !0
          },
          'position': {
            handler: function (t) {
              var e = this
              this.$nextTick(function () {
                e.isLoaded && e.load(e.map),
                  t &&
                  t.lng &&
                  t.lat &&
                  (0 != t.lng || 0 != t.lat) &&
                  e.originInstance
                    ? e.originInstance.setPosition(
                        new BMap.Point(t[e.lng], t[e.lat])
                      )
                    : e.movingPath && e.movingPath.length > 1
                    ? (e.isUniformity && e.setSameSpeed(),
                      e.progressbar ? e.progressbar.resetEvent() : e.reset(),
                      e.findProgressbar())
                    : e.originInstance &&
                      (e.map.removeOverlay(e.originInstance),
                      (e.originInstance = null))
              })
            },
            deep: !0
          },
          'offset': {
            handler: function (t) {
              this.originInstance &&
                this.originInstance.setOffset(
                  new BMap.Size(t[this.lng], t[this.lat])
                )
            },
            deep: !0
          },
          'massClear': function (t) {
            t
              ? this.originInstance.enableMassClear()
              : this.originInstance.disableMassClear()
          },
          'dragging': function (t) {
            t
              ? this.originInstance.enableDragging()
              : this.originInstance.disableDragging()
          },
          'draggingCursor': function (t) {
            this.originInstance.setDraggingCursor(t)
          },
          'rotation': function (t) {
            this.originInstance.setRotation(t)
          },
          'shadow': function (t) {
            this.originInstance.setShadow(t)
          },
          'title': function (t) {
            this.originInstance.setTitle(t)
          },
          'animation': function (t) {
            map.addOverlay(overlay),
              'BMAP_ANIMATION_DROP' === t
                ? overlay.setAnimation(BMAP_ANIMATION_DROP)
                : 'BMAP_ANIMATION_BOUNCE' === t &&
                  overlay.setAnimation(BMAP_ANIMATION_BOUNCE)
          },
          'top': function (t) {
            this.originInstance.setTop(t)
          },
          'zIndex': function (t) {
            this.originInstance.setZIndex(t)
          }
        }
      }
    },
    'ONEZ': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement
          return (t._self._c || e)(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: t.panel,
                  expression: 'panel'
                }
              ],
              attrs: { widgetCode: t.widgetCode }
            },
            [t._t('default')],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'SDE/': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement
          return (t._self._c || e)(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: t.show,
                  expression: 'show'
                }
              ],
              attrs: { widgetCode: t.widgetCode }
            },
            [t._t('default')],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'Vcia': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement
          return (t._self._c || e)(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: t.panel,
                  expression: 'panel'
                }
              ],
              attrs: { widgetCode: t.widgetCode }
            },
            [t._t('default')],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'W9KF': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('dHSY'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'WcCo': function (t, e, i) {
      'use strict'
      function n(t) {
        i('HGfK')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('HKHr'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('Vcia'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-bd1f480a',
          null
        )
      e.default = l.exports
    },
    'XlT0': function (t, e, i) {
      'use strict'
      function n(t) {
        i('kXS3')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('hKn0'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('SDE/'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-07feded0',
          null
        )
      e.default = l.exports
    },
    'XyMi': function (t, e, i) {
      'use strict'
      function n(t, e, i, n, o, s, a, r) {
        t = t || {}
        var c = typeof t.default
        ;('object' !== c && 'function' !== c) || (t = t.default)
        var h = 'function' == typeof t ? t.options : t
        e && ((h.render = e), (h.staticRenderFns = i), (h._compiled = !0)),
          n && (h.functional = !0),
          s && (h._scopeId = s)
        var l
        if (
          (a
            ? ((l = function (t) {
                ;(t =
                  t ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)),
                  t ||
                    'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                    (t = __VUE_SSR_CONTEXT__),
                  o && o.call(this, t),
                  t && t._registeredComponents && t._registeredComponents.add(a)
              }),
              (h._ssrRegister = l))
            : o &&
              (l = r
                ? function () {
                    o.call(this, this.$root.$options.shadowRoot)
                  }
                : o),
          l)
        )
          if (h.functional) {
            h._injectStyles = l
            var u = h.render
            h.render = function (t, e) {
              return l.call(e), u(t, e)
            }
          } else {
            var d = h.beforeCreate
            h.beforeCreate = d ? [].concat(d, l) : [l]
          }
        return { exports: t, options: h }
      }
      e.a = n
    },
    'aHwg': function (t, e, i) {
      'use strict'
      function n(t) {
        i('q+fc')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('oEGd'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('r1Ok'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-19da8660',
          null
        )
      e.default = l.exports
    },
    'cDym': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('t+Ub'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'cW+W': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement
          return (t._self._c || e)(
            'div',
            { attrs: { widgetCode: t.widgetCode } },
            [t._t('default')],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'cnXW': function (t, e) {},
    'dHSY': function (t, e, i) {
      'use strict'
      function n(t) {
        i('7siT')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('LMHS'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('EZbE'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-133926da',
          null
        )
      e.default = l.exports
    },
    'epjD': function (t, e, i) {
      'use strict'
      function n(t) {
        i('figP')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('K6W/'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('ONEZ'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-c97e3df2',
          null
        )
      e.default = l.exports
    },
    'fPSZ': function (t, e, i) {
      'use strict'
      function n(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = e.lng,
          n = e.lat
        return new t.Point(i, n)
      }
      function o(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = e.x,
          n = e.y
        return new t.Pixel(i, n)
      }
      function s(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = e.sw,
          o = e.ne
        return new t.Bounds(n(t, i), n(t, o))
      }
      function a(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = e.width,
          n = e.height
        return new t.Size(i, n)
      }
      function r(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = e.url,
          n = e.size,
          o = e.opts,
          s = void 0 === o ? {} : o
        return new t.Icon(i, a(t, n), {
          anchor: s.anchor && a(t, s.anchor),
          imageSize: s.imageSize && a(t, s.imageSize),
          imageOffset: s.imageOffset && a(t, s.imageOffset),
          infoWindowAnchor: s.infoWindowAnchor && a(t, s.infoWindowAnchor),
          printImageUrl: s.printImageUrl
        })
      }
      function c(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = e.content,
          o = e.opts
        return new t.Label(i, {
          offset: o.offset && a(t, o.offset),
          position: o.position && n(t, o.position),
          enableMassClear: o.enableMassClear
        })
      }
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.createPoint = n),
        (e.createPixel = o),
        (e.createBounds = s),
        (e.createSize = a),
        (e.createIcon = r),
        (e.createLabel = c)
    },
    'figP': function (t, e) {},
    'hKn0': function (t, e, i) {
      'use strict'
      ;(function (t) {
        Object.defineProperty(e, '__esModule', { value: !0 })
        var n = i('fPSZ'),
          o = ['close', 'open', 'maximize', 'restore', 'clickclose']
        e.default = {
          name: 'vui-map-info-window',
          props: {
            widgetCode: { type: String },
            show: { type: Boolean },
            position: { type: Object },
            title: { type: String },
            width: { type: Number },
            height: { type: Number },
            maxWidth: { type: Number },
            offset: { type: Object },
            maximize: { type: Boolean },
            autoPan: { type: Boolean },
            closeOnClick: { type: Boolean, default: !0 },
            message: { type: String }
          },
          data: function () {
            return { windowShow: this.show }
          },
          methods: {
            load: function (t) {
              var e = this,
                i = this.windowShow,
                s = this.title,
                a = this.width,
                r = this.height,
                c = this.maxWidth,
                h = this.offset,
                l = this.autoPan,
                u = this.closeOnClick,
                d = this.message,
                p = this.maximize,
                g = this.bindObserver,
                f = this.$parent,
                m = this.$el,
                v = this,
                y = new BMap.InfoWindow(m, {
                  width: a,
                  height: r,
                  title: s,
                  maxWidth: c,
                  offset: (0, n.createSize)(BMap, h),
                  enableAutoPan: l,
                  enableCloseOnClick: u,
                  enableMessage: void 0 === d,
                  message: d
                })
              p ? y.enableMaximize() : y.disableMaximize(),
                o.forEach(function (t) {
                  y.addEventListener(t, function (i) {
                    'close' == t
                      ? (v.windowShow = !1)
                      : 'open' == t && (v.windowShow = !0),
                      e.$emit('on-' + t, i)
                  })
                }),
                (this.originInstance = y),
                y.redraw(),
                g(),
                (this.$container =
                  f.originInstance && f.originInstance.openInfoWindow
                    ? f.originInstance
                    : t),
                i && this.openInfoWindow()
            },
            bindObserver: function () {
              var e = t.MutationObserver
              if (e) {
                var i = this.$el,
                  n = this.originInstance
                ;(this.observer = new e(function (t) {
                  return n.redraw()
                })),
                  this.observer.observe(i, {
                    attributes: !0,
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                  })
              }
            },
            openInfoWindow: function () {
              var t = this.$container,
                e = this.position,
                i = this.originInstance
              if (t) {
                var o = (0, n.createPoint)(BMap, e)
                t.openInfoWindow(i, o)
              }
            },
            closeInfoWindow: function () {
              this.$container &&
                this.$container.closeInfoWindow(this.originInstance)
            }
          },
          watch: {
            '$parent.map': {
              handler: function (t) {
                var e = this
                t &&
                  ((this.map = t),
                  this.$nextTick(function () {
                    e.load(t)
                  }))
              },
              immediate: !0
            },
            'show': function (t) {
              this.windowShow !== t && (this.windowShow = t)
            },
            'windowShow': function (t) {
              t ? this.openInfoWindow() : this.closeInfoWindow(),
                this.$emit('input', t)
            },
            'position.lng': function (t, e) {
              this.reload()
            },
            'position.lat': function (t, e) {
              this.reload()
            },
            'offset.width': function (t, e) {
              this.reload()
            },
            'offset.height': function (t) {
              this.reload()
            },
            'maxWidth': function () {
              this.reload()
            },
            'width': function (t) {
              this.originInstance.setWidth(t)
            },
            'height': function (t) {
              this.originInstance.setHeight(t)
            },
            'title': function (t) {
              this.originInstance.setTitle(t)
            },
            'maximize': function (t) {
              t
                ? this.originInstance.enableMaximize()
                : this.originInstance.disableMaximize()
            },
            'autoPan': function (t) {
              t
                ? this.originInstance.enableAutoPan()
                : this.originInstance.disableAutoPan()
            },
            'closeOnClick': function (t) {
              t
                ? this.originInstance.enableCloseOnClick()
                : this.originInstance.disableCloseOnClick()
            }
          }
        }
      }.call(e, i('DuR2')))
    },
    'iEdS': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('XlT0'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'kXS3': function (t, e) {},
    'kj9A': function (t, e, i) {
      'use strict'
      function n(t) {
        i('Jeix')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('sbkp'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('cW+W'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-ecaff494',
          null
        )
      e.default = l.exports
    },
    'lJ/+': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement,
            i = t._self._c || e
          return i(
            'div',
            { style: t.styles, attrs: { widgetCode: t.widgetCode } },
            [
              i('div', {
                staticStyle: { height: '100%' },
                attrs: { id: t.mapId }
              }),
              t._v(' '),
              t._t('default'),
              t._v(' '),
              t._t('playback')
            ],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'lRwf': function (e, i) {
      e.exports = t
    },
    'mcMA': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('epjD'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'oEGd': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('9E2R'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n),
        s = i('fPSZ'),
        a = [
          'click',
          'dblclick',
          'mousedown',
          'mouseup',
          'mouseout',
          'mouseover',
          'remove',
          'lineupdate'
        ]
      e.default = {
        name: 'vui-map-polyline',
        props: {
          widgetCode: { type: String },
          path: {
            type: Array,
            default: function () {
              return [{ lng: 0, lat: 0 }]
            }
          },
          strokeColorField: { type: String, default: 'strokeColor' },
          strokeWeightField: { type: String, default: 'strokeWeight' },
          strokeOpacityField: { type: String, default: 'strokeOpacity' },
          strokeStyleField: { type: String, default: 'strokeStyle' },
          massClearField: { type: String, default: 'massClear' },
          clickingField: { type: String, default: 'clicking' },
          editingField: { type: String, default: 'editing' },
          strokeColor: { type: String },
          strokeWeight: { type: Number },
          strokeOpacity: { type: Number },
          strokeStyle: { type: String },
          massClear: { type: Boolean },
          clicking: { type: Boolean },
          editing: { type: Boolean },
          isMulLine: { type: Boolean, default: !1 },
          autoUpdatePath: { type: Boolean, default: !1 },
          startIcon: { type: Boolean, default: !0 },
          endIcon: { type: Boolean, default: !0 },
          startIconCompSrc: { type: String },
          startIconAmidSrc: { type: String },
          endIconCompSrc: { type: String },
          endIconAmidSrc: { type: String },
          iconWidth: { type: Number },
          iconHeight: { type: Number },
          gourpIdField: { type: String, default: 'groupId' },
          lng: { type: String, default: 'lng' },
          lat: { type: String, default: 'lat' }
        },
        data: function () {
          return {
            defaultIconWidth: 19,
            defaultIconHeight: 22,
            pathLength: 0,
            groups: {}
          }
        },
        computed: {
          startIconSrc: function () {
            o.default
            return this.startIconAmidSrc
              ? o.default.v3platform.getSrcPathFromId2url(this.startIconAmidSrc)
              : !!this.startIconCompSrc &&
                  o.default.v3platform.getSrcPathFromRes(
                    this,
                    this.startIconCompSrc
                  )
          },
          endIconSrc: function () {
            return this.endIconAmidSrc
              ? o.default.v3platform.getSrcPathFromId2url(this.endIconAmidSrc)
              : !!this.endIconCompSrc &&
                  o.default.v3platform.getSrcPathFromRes(
                    this,
                    this.endIconCompSrc
                  )
          },
          startIconObj: function () {
            if (this.startIconSrc)
              return {
                url: this.startIconSrc,
                size: {
                  width: this.iconWidth || this.defaultIconWidth,
                  height: this.iconHeight || this.defaultIconHeight
                },
                opts: {
                  imageSize: {
                    width: this.iconWidth || this.defaultIconWidth,
                    height: this.iconHeight || this.defaultIconHeight
                  }
                }
              }
          },
          endIconObj: function () {
            if (this.endIconSrc)
              return {
                url: this.endIconSrc,
                size: {
                  width: this.iconWidth || this.defaultIconWidth,
                  height: this.iconHeight || this.defaultIconHeight
                },
                opts: {
                  imageSize: {
                    width: this.iconWidth || this.defaultIconWidth,
                    height: this.iconHeight || this.defaultIconHeight
                  }
                }
              }
          }
        },
        methods: {
          load: function (t) {
            var e = this,
              i = this.path,
              n =
                (this.strokeColorField,
                this.strokeWeightField,
                this.strokeOpacityField,
                this.strokeStyleField,
                this.editingField,
                this.massClearField,
                this.clickingField,
                this.isMulLine),
              o = this.autoUpdatePath,
              r = (this.pathLength, this.gourpIdField, this.lng),
              c = this.lat,
              h = this.strokeColor,
              l = this.strokeWeight,
              u = this.strokeOpacity,
              d = this.strokeStyle,
              p = this.editing,
              g = this.massClear,
              f = this.clicking
            if (
              ((this.map = t),
              this.originInstance &&
                this.originInstance.forEach(function (e) {
                  return t.removeOverlay(e)
                }),
              this.endIconInstances &&
                this.endIconInstances.forEach(function (e) {
                  return t.removeOverlay(e)
                }),
              this.startIconInstances &&
                this.startIconInstances.forEach(function (e) {
                  return t.removeOverlay(e)
                }),
              (this.originInstance = []),
              (this.startIconInstances = []),
              (this.endIconInstances = []),
              (n || o) && i.length > 0)
            )
              this.mulModelLoadLine(0)
            else {
              0 == i.length && (i = [{ lng: 0, lat: 0 }])
              var m = new BMap.Polyline(
                i.map(function (t) {
                  return (0, s.createPoint)(BMap, { lng: t[r], lat: t[c] })
                }),
                {
                  strokeColor: h,
                  strokeWeight: l,
                  strokeOpacity: u,
                  strokeStyle: d,
                  enableEditing: !!p,
                  enableMassClear: !!g,
                  enableClicking: !!f
                }
              )
              this.originInstance.push(m),
                a.forEach(function (t) {
                  m.addEventListener(t, function (i) {
                    e.$emit('on-' + t, i)
                  })
                }),
                t.addOverlay(m),
                this.startIcon &&
                  i.length > 0 &&
                  this.startIconInstances.push(
                    this.loadIcon(
                      this.originInstance[0].getPath()[0],
                      this.startIconObj
                    )
                  ),
                this.endIcon &&
                  i.length > 0 &&
                  this.endIconInstances.push(
                    this.loadIcon(
                      this.originInstance[0].getPath()[i.length - 1],
                      this.endIconObj
                    )
                  )
            }
          },
          loadIcon: function (t, e) {
            if (BMap.Point) {
              var i = new BMap.Marker(new BMap.Point(t.lng, t.lat), {
                icon: e && (0, s.createIcon)(BMap, e)
              })
              return this.map.addOverlay(i), i
            }
          },
          mulModelLoadLine: function (t) {
            for (
              var e = this,
                i = this.map,
                n = this.strokeColorField,
                o = this.strokeWeightField,
                r = this.strokeOpacityField,
                c = this.strokeStyleField,
                h = this.editingField,
                l = this.massClearField,
                u = this.clickingField,
                d = (this.isMulLine, this.autoUpdatePath, this.originInstance),
                p = this.path,
                g = this.gourpIdField,
                f = this.startIcon,
                m = this.startIconObj,
                v = this.endIcon,
                y = this.endIconObj,
                I = this.loadIcon,
                S = this.lng,
                M = this.lat,
                b = {},
                P = { lat: p[t][M], lng: p[t][S] },
                O = t;
              O < p.length;
              O++
            )
              !(function (t) {
                var v = p[t],
                  y = v[g],
                  O = !1
                y &&
                  (Object.keys(e.groups).forEach(function (t) {
                    if (t == y) {
                      var i = e.groups[t]
                      return (
                        (P = {
                          lat: i.lat,
                          lng: i.lng,
                          strokeColor: i.strokeColor,
                          strokeWeight: i.strokeWeight,
                          strokeOpacity: i.strokeOpacity,
                          strokeStyle: i.strokeStyle,
                          enableEditing: !!i.enableEditing,
                          enableMassClear: !!i.enableMassClear,
                          enableClicking: !!i.enableClicking
                        }),
                        (O = !0),
                        void (e.groups[t] = {
                          lat: v[M],
                          lng: v[S],
                          strokeColor: v[n] || P.strokeColor,
                          strokeWeight: v[o] || P.strokeWeight,
                          strokeOpacity: v[r] || P.strokeOpacity,
                          strokeStyle: v[c] || P.strokeStyle,
                          enableEditing:
                            void 0 !== v[h] ? v[h] : P.enableEditing,
                          enableMassClear:
                            void 0 !== v[l] ? v[l] : P.enableMassClear,
                          enableClicking:
                            void 0 !== v[u] ? v[u] : P.enableClicking
                        })
                      )
                    }
                  }),
                  O ||
                    ((P = { lat: v[M], lng: v[S] }),
                    (e.groups[y] = {
                      lat: v[M],
                      lng: v[S],
                      strokeColor: v[n],
                      strokeWeight: v[o],
                      strokeOpacity: v[r],
                      strokeStyle: v[c],
                      enableEditing: !!v[h],
                      enableMassClear: !!v[l],
                      enableClicking: !!v[u]
                    }),
                    f && e.startIconInstances.push(I(P, m)))),
                  (b = {
                    lat: v[M],
                    lng: v[S],
                    strokeColor: v[n] || P.strokeColor,
                    strokeWeight: v[o] || P.strokeWeight,
                    strokeOpacity: v[r] || P.strokeOpacity,
                    strokeStyle: v[c] || P.strokeStyle,
                    enableEditing: void 0 !== v[h] ? v[h] : P.enableEditing,
                    enableMassClear: void 0 !== v[l] ? v[l] : P.enableMassClear,
                    enableClicking: void 0 !== v[u] ? v[u] : P.enableClicking
                  })
                var _ = new BMap.Polyline(
                  [P, b].map(function (t) {
                    return (0, s.createPoint)(BMap, { lng: t.lng, lat: t.lat })
                  }),
                  {
                    strokeColor: b.strokeColor,
                    strokeWeight: b.strokeWeight,
                    strokeOpacity: b.strokeOpacity,
                    strokeStyle: b.strokeStyle,
                    enableEditing: !!b.enableEditing,
                    enableMassClear: !!b.enableMassClear,
                    enableClicking: !!b.enableClicking
                  }
                )
                d.push(_),
                  a.forEach(function (t) {
                    _.addEventListener(t, function (i) {
                      e.$emit('on-' + t, i)
                    })
                  }),
                  i.addOverlay(_),
                  (P = b)
              })(O)
            this.pathLength = p.length - 1
            var _ = Object.keys(this.groups)
            if (_.length > 0)
              v &&
                p.length > 0 &&
                _.forEach(function (t) {
                  e.endIconInstances.push(I(e.groups[t], y))
                })
            else {
              if (this.startIcon && p.length > 0) {
                var k = { lat: p[0][M], lng: p[0][S] }
                this.startIconInstances.push(
                  this.loadIcon(k, this.startIconObj)
                )
              }
              if (this.endIcon && p.length > 0) {
                var k = { lat: p[p.length - 1][M], lng: p[p.length - 1][S] }
                this.endIconInstances.push(this.loadIcon(k, this.endIconObj))
              }
            }
          }
        },
        watch: {
          '$parent.map': {
            handler: function (t) {
              var e = this
              t &&
                ((this.map = t),
                this.$nextTick(function () {
                  e.load(t)
                }))
            },
            immediate: !0
          },
          'path': {
            handler: function (t, e) {
              var i = this.map,
                n =
                  (this.strokeColor,
                  this.strokeWeight,
                  this.strokeOpacity,
                  this.strokeStyle,
                  this.editing,
                  this.massClear,
                  this.clicking,
                  this.isMulLine),
                o = this.autoUpdatePath,
                a = this.pathLength,
                r = this.originInstance,
                c = this.lng,
                h = this.lat
              if (!t || t.length <= 0)
                return (
                  this.groups && (this.groups = {}),
                  this.originInstance &&
                    this.originInstance.forEach(function (t) {
                      return i.removeOverlay(t)
                    }),
                  this.endIconInstances &&
                    this.endIconInstances.forEach(function (t) {
                      return i.removeOverlay(t)
                    }),
                  this.startIconInstances &&
                    this.startIconInstances.forEach(function (t) {
                      return i.removeOverlay(t)
                    }),
                  (this.originInstance = []),
                  (this.endIconInstances = []),
                  void (this.startIconInstances = [])
                )
              r &&
                o &&
                a > t.length &&
                (r.forEach(function (t) {
                  return i.removeOverlay(t)
                }),
                (this.pathLength = 0),
                (a = 0)),
                r && t.length > 1
                  ? (this.endIconInstances.length > 0 &&
                      (this.endIconInstances.forEach(function (t) {
                        return i.removeOverlay(t)
                      }),
                      (this.endIconInstances = [])),
                    o
                      ? this.mulModelLoadLine(a)
                      : n
                      ? (this.groups && (this.groups = {}),
                        this.startIconInstances.length > 0 &&
                          (this.startIconInstances.forEach(function (t) {
                            return i.removeOverlay(t)
                          }),
                          (this.startIconInstances = [])),
                        r.forEach(function (t) {
                          return i.removeOverlay(t)
                        }),
                        (this.originInstance = []),
                        this.mulModelLoadLine(0))
                      : (this.startIconInstances.length > 0 &&
                          this.startIconInstances.forEach(function (t) {
                            return i.removeOverlay(t)
                          }),
                        r[0].setPath(
                          t.map(function (t) {
                            return (0,
                            s.createPoint)(BMap, { lng: t[c], lat: t[h] })
                          })
                        ),
                        this.startIcon &&
                          t.length > 0 &&
                          this.startIconInstances.push(
                            this.loadIcon(
                              this.originInstance[0].getPath()[0],
                              this.startIconObj
                            )
                          ),
                        this.endIcon &&
                          t.length > 0 &&
                          this.endIconInstances.push(
                            this.loadIcon(
                              this.originInstance[0].getPath()[t.length - 1],
                              this.endIconObj
                            )
                          )))
                  : this.map && this.load(this.map)
            },
            deep: !0
          },
          'strokeColor': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                e.setStrokeColor(t)
              })
          },
          'strokeOpacity': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                e.setStrokeOpacity(t)
              })
          },
          'strokeWeight': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                e.setStrokeWeight(t)
              })
          },
          'strokeStyle': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                e.setStrokeStyle(t)
              })
          },
          'editing': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                t ? e.enableEditing() : e.disableEditing()
              })
          },
          'massClear': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                t ? e.enableMassClear() : e.disableMassClear()
              })
          }
        }
      }
    },
    'q+fc': function (t, e) {},
    'r1Ok': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = function () {
          var t = this,
            e = t.$createElement
          return (t._self._c || e)(
            'div',
            { attrs: { widgetCode: t.widgetCode } },
            [t._t('default')],
            2
          )
        },
        o = []
      ;(e.render = n), (e.staticRenderFns = o)
    },
    'sbkp': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('9E2R'),
        o =
          ((function (t) {
            t && t.__esModule
          })(n),
          i('fPSZ'))
      e.default = {
        name: 'vui-map-polygon',
        props: {
          widgetCode: { type: String },
          path: {
            type: Array,
            default: function () {
              return [{ lng: 0, lat: 0 }]
            }
          },
          strokeColorField: { type: String, default: 'strokeColor' },
          strokeWeightField: { type: String, default: 'strokeWeight' },
          strokeOpacityField: { type: String, default: 'strokeOpacity' },
          fillOpacityField: { type: String, default: 'fillOpacity' },
          strokeStyleField: { type: String, default: 'strokeStyle' },
          massClearField: { type: String, default: 'massClear' },
          clickingField: { type: String, default: 'clicking' },
          editingField: { type: String, default: 'editing' },
          strokeColor: { type: String },
          strokeWeight: { type: Number },
          strokeOpacity: { type: Number },
          fillOpacity: { type: Number, default: 0.2 },
          strokeStyle: { type: String },
          massClear: { type: Boolean },
          clicking: { type: Boolean },
          editing: { type: Boolean },
          isMulLine: { type: Boolean, default: !1 },
          autoUpdatePath: { type: Boolean, default: !1 },
          startIcon: { type: Boolean, default: !0 },
          endIcon: { type: Boolean, default: !0 },
          startIconCompSrc: { type: String },
          startIconAmidSrc: { type: String },
          endIconCompSrc: { type: String },
          endIconAmidSrc: { type: String },
          iconWidth: { type: Number },
          iconHeight: { type: Number },
          gourpIdField: { type: String, default: 'groupId' },
          lng: { type: String, default: 'lng' },
          lat: { type: String, default: 'lat' }
        },
        data: function () {
          return {
            defaultIconWidth: 19,
            defaultIconHeight: 22,
            pathLength: 0,
            groups: {}
          }
        },
        methods: {
          load: function (t) {
            var e = this.path,
              i =
                (this.strokeColorField,
                this.strokeWeightField,
                this.strokeOpacityField,
                this.strokeStyleField,
                this.editingField,
                this.massClearField,
                this.clickingField,
                this.isMulLine),
              n =
                (this.autoUpdatePath,
                this.pathLength,
                this.gourpIdField,
                this.lng),
              s = this.lat,
              a = this.strokeColor,
              r = this.strokeWeight,
              c = this.strokeOpacity,
              h = this.fillOpacity,
              l = this.strokeStyle
            this.editing, this.massClear, this.clicking
            if (
              ((this.map = t),
              this.originInstance &&
                this.originInstance.forEach(function (e) {
                  return t.removeOverlay(e)
                }),
              (this.originInstance = []),
              i && e.length > 0)
            )
              this.mulModelLoadLine(0)
            else {
              0 == e.length && (e = [{ lng: 0, lat: 0 }])
              var u = new BMap.Polygon(
                e.map(function (t) {
                  return (0, o.createPoint)(BMap, { lng: t[n], lat: t[s] })
                }),
                {
                  strokeColor: a,
                  strokeWeight: r,
                  strokeOpacity: c,
                  fillOpacity: h,
                  strokeStyle: l
                }
              )
              this.originInstance.push(u), t.addOverlay(u)
            }
          },
          mulModelLoadLine: function (t) {
            for (
              var e = this.map,
                i = this.strokeColorField,
                n = this.strokeWeightField,
                s = this.strokeOpacityField,
                a = this.fillOpacityField,
                r = this.strokeStyleField,
                c =
                  (this.editingField,
                  this.massClearField,
                  this.clickingField,
                  this.isMulLine,
                  this.autoUpdatePath,
                  this.originInstance),
                h = this.path,
                l = this.gourpIdField,
                u =
                  (this.startIcon,
                  this.startIconObj,
                  this.endIcon,
                  this.endIconObj,
                  this.loadIcon,
                  this.lng),
                d = this.lat,
                p = (this.strokeColor, this.strokeWeight),
                g = this.strokeOpacity,
                f = this.fillOpacity,
                m = this.strokeStyle,
                v = (h[t][d], h[t][u], {}),
                y = [],
                I = t;
              I < h.length;
              I++
            ) {
              var S = h[I],
                M = S[l]
              if (v[M])
                for (var b = 0; b < y.length; b++) {
                  var P = y[b],
                    O = P[l]
                  if (O == M) {
                    P.data.push(S)
                    break
                  }
                }
              else {
                var _ = {}
                ;(_[l] = M), (_.data = [S]), y.push(_), (v[M] = S)
              }
            }
            for (var k = 0; k < y.length; k++) {
              var w = y[k].data,
                C = new BMap.Polygon(
                  w.map(function (t) {
                    return (0, o.createPoint)(BMap, { lng: t[u], lat: t[d] })
                  }),
                  {
                    strokeColor: w[0][i],
                    strokeWeight: w[0][n] || p,
                    strokeOpacity: w[0][s] || g,
                    fillOpacity: w[0][a] || f,
                    strokeStyle: w[0][r] || m
                  }
                )
              e.addOverlay(C), c.push(C)
            }
          }
        },
        watch: {
          '$parent.map': {
            handler: function (t) {
              var e = this
              t &&
                ((this.map = t),
                this.$nextTick(function () {
                  e.load(t)
                }))
            },
            immediate: !0
          },
          'path': {
            handler: function (t, e) {
              var i = this.map,
                n =
                  (this.strokeColor,
                  this.strokeWeight,
                  this.strokeOpacity,
                  this.strokeStyle,
                  this.editing,
                  this.massClear,
                  this.clicking,
                  this.isMulLine),
                s = (this.autoUpdatePath, this.pathLength, this.originInstance),
                a = this.lng,
                r = this.lat
              n
                ? (this.groups && (this.groups = {}),
                  s.forEach(function (t) {
                    return i.removeOverlay(t)
                  }),
                  (this.originInstance = []),
                  this.mulModelLoadLine(0))
                : s[0].setPath(
                    t.map(function (t) {
                      return (0, o.createPoint)(BMap, { lng: t[a], lat: t[r] })
                    })
                  )
            },
            deep: !0
          },
          'editing': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                t ? e.enableEditing() : e.disableEditing()
              })
          },
          'massClear': function (t) {
            t &&
              this.originInstance &&
              this.originInstance.length >= 1 &&
              !this.isMulLine &&
              !this.autoUpdatePath &&
              this.originInstance.forEach(function (e) {
                t ? e.enableMassClear() : e.disableMassClear()
              })
          }
        }
      }
    },
    't+Ub': function (t, e, i) {
      'use strict'
      function n(t) {
        i('HieI')
      }
      Object.defineProperty(e, '__esModule', { value: !0 })
      var o = i('/6ct'),
        s = i.n(o)
      for (var a in o)
        'default' !== a &&
          (function (t) {
            i.d(e, t, function () {
              return o[t]
            })
          })(a)
      var r = i('BwkS'),
        c = (i.n(r), i('XyMi')),
        h = n,
        l = Object(c.a)(
          s.a,
          r.render,
          r.staticRenderFns,
          !1,
          h,
          'data-v-17908b28',
          null
        )
      e.default = l.exports
    },
    'udpM': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('kj9A'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    },
    'vdEr': function (t, e, i) {
      'use strict'
      Object.defineProperty(e, '__esModule', { value: !0 })
      var n = i('6P27'),
        o = (function (t) {
          return t && t.__esModule ? t : { default: t }
        })(n)
      e.default = o.default
    }
  })
})
