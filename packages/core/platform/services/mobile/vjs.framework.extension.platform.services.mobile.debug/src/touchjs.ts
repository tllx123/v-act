/*! touchjs.min v0.2.14  2014-08-05 */
'use strict'
!(function (a, b) {
  'function' == typeof define && (define.amd || define.cmd)
    ? define(b)
    : (a.touch = b())
})(this, function () {
  function a() {
    let a = 'mouseup mousedown mousemove mouseout',
      c = 'touchstart touchmove touchend touchcancel',
      d = b.hasTouch ? c : a
    d.split(' ').forEach(function (a) {
      document.addEventListener(a, A, !1)
    })
  }
  let b = {}
  ;(b.PCevts = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    touchcancel: 'mouseout'
  }),
    (b.hasTouch = 'ontouchstart' in window),
    (b.getType = function (a) {
      return Object.prototype.toString
        .call(a)
        .match(/\s([a-z|A-Z]+)/)[1]
        .toLowerCase()
    }),
    (b.getSelector = function (a) {
      if (a.id) return '#' + a.id
      if (a.className) {
        var b = a.className.split(/\s+/)
        return '.' + b.join('.')
      }
      return a === document ? 'body' : a.tagName.toLowerCase()
    }),
    (b.matchSelector = function (a, b) {
      return a.webkitMatchesSelector(b)
    }),
    (b.getEventListeners = function (a) {
      return a.listeners
    }),
    (b.getPCevts = function (a) {
      return this.PCevts[a] || a
    }),
    (b.forceReflow = function () {
      var a = 'reflowDivBlock',
        b = document.getElementById(a)
      b ||
        ((b = document.createElement('div')),
        (b.id = a),
        document.body.appendChild(b))
      var c = b.parentNode,
        d = b.nextSibling
      c.removeChild(b), c.insertBefore(b, d)
    }),
    (b.simpleClone = function (a) {
      return Object.create(a)
    }),
    (b.getPosOfEvent = function (a) {
      if (this.hasTouch) {
        for (var b = [], c = null, d = 0, e = a.touches.length; e > d; d++)
          (c = a.touches[d]), b.push({ x: c.pageX, y: c.pageY })
        return b
      }
      return [{ x: a.pageX, y: a.pageY }]
    }),
    (b.getDistance = function (a, b) {
      var c = b.x - a.x,
        d = b.y - a.y
      return Math.sqrt(c * c + d * d)
    }),
    (b.getFingers = function (a) {
      return a.touches ? a.touches.length : 1
    }),
    (b.calScale = function (a, b) {
      if (a.length >= 2 && b.length >= 2) {
        var c = this.getDistance(a[1], a[0]),
          d = this.getDistance(b[1], b[0])
        return d / c
      }
      return 1
    }),
    (b.getAngle = function (a, b) {
      return (180 * Math.atan2(b.y - a.y, b.x - a.x)) / Math.PI
    }),
    (b.getAngle180 = function (a, b) {
      var c = Math.atan((-1 * (b.y - a.y)) / (b.x - a.x)) * (180 / Math.PI)
      return 0 > c ? c + 180 : c
    }),
    (b.getDirectionFromAngle = function (a) {
      var b = {
        up: -45 > a && a > -135,
        down: a >= 45 && 135 > a,
        left: a >= 135 || -135 >= a,
        right: a >= -45 && 45 >= a
      }
      for (var c in b) if (b[c]) return c
      return null
    }),
    (b.getXYByElement = function (a) {
      for (var b = 0, c = 0; a.offsetParent; )
        (b += a.offsetLeft), (c += a.offsetTop), (a = a.offsetParent)
      return { left: b, top: c }
    }),
    (b.reset = function () {
      ;(h = i = j = null), (q = o = k = l = !1), (m = !1), (f = {}), (t = !1)
    }),
    (b.isTouchMove = function (a) {
      return 'touchmove' === a.type || 'mousemove' === a.type
    }),
    (b.isTouchEnd = function (a) {
      return (
        'touchend' === a.type ||
        'mouseup' === a.type ||
        'touchcancel' === a.type
      )
    }),
    (b.env = (function () {
      var a = {},
        b = navigator.userAgent,
        c = b.match(/(Android)[\s\/]+([\d\.]+)/),
        d = b.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
        e = b.match(/(Windows\s+Phone)\s([\d\.]+)/),
        f = /WebKit\/[\d.]+/i.test(b),
        g = d
          ? navigator.standalone
            ? f
            : /Safari/i.test(b) && !/CriOS/i.test(b) && !/MQQBrowser/i.test(b)
          : !1
      return (
        c && ((a.android = !0), (a.version = c[2])),
        d &&
          ((a.ios = !0),
          (a.version = d[2].replace(/_/g, '.')),
          (a.ios7 = /^7/.test(a.version)),
          'iPad' === d[1]
            ? (a.ipad = !0)
            : 'iPhone' === d[1]
            ? ((a.iphone = !0), (a.iphone5 = 568 == screen.height))
            : 'iPod' === d[1] && (a.ipod = !0)),
        e && ((a.wp = !0), (a.version = e[2]), (a.wp8 = /^8/.test(a.version))),
        f && (a.webkit = !0),
        g && (a.safari = !0),
        a
      )
    })())
  let c = {
      proxyid: 0,
      proxies: [],
      trigger: function (a, b, c) {
        c = c || {}
        var d,
          e = { bubbles: !0, cancelable: !0, detail: c }
        try {
          'undefined' != typeof CustomEvent
            ? ((d = new CustomEvent(b, e)), a && a.dispatchEvent(d))
            : ((d = document.createEvent('CustomEvent')),
              d.initCustomEvent(b, !0, !0, c),
              a && a.dispatchEvent(d))
        } catch (f) {
          console.warn('Touch.js is not supported by environment.')
        }
      },
      bind: function (a, c, d) {
        ;(a.listeners = a.listeners || {}),
          a.listeners[c] ? a.listeners[c].push(d) : (a.listeners[c] = [d])
        var e = function (a) {
          b.env.ios7 && b.forceReflow(), (a.originEvent = a)
          for (var c in a.detail) 'type' !== c && (a[c] = a.detail[c])
          a.startRotate = function () {
            t = !0
          }
          var e = d.call(a.target, a)
          'undefined' == typeof e ||
            e ||
            (a.stopPropagation(), a.preventDefault())
        }
        ;(d.proxy = d.proxy || {}),
          d.proxy[c]
            ? d.proxy[c].push(this.proxyid++)
            : (d.proxy[c] = [this.proxyid++]),
          this.proxies.push(e),
          a.addEventListener && a.addEventListener(c, e, !1)
      },
      unbind: function (a, b, c) {
        if (c) {
          var d = c.proxy[b]
          d &&
            d.length &&
            d.forEach(function () {
              a.removeEventListener &&
                a.removeEventListener(b, this.proxies[this.proxyid], !1)
            })
        } else {
          var e = a.listeners[b]
          e &&
            e.length &&
            e.forEach(function (c) {
              a.removeEventListener(b, c, !1)
            })
        }
      },
      delegate: function (a, c, d, e) {
        var f = function (c) {
          var f, g
          c.originEvent = c
          for (var h in c.detail) 'type' !== h && (c[h] = c.detail[h])
          c.startRotate = function () {
            t = !0
          }
          var i = b.getSelector(a) + ' ' + d,
            j = b.matchSelector(c.target, i),
            k = b.matchSelector(c.target, i + ' ' + c.target.nodeName)
          if (!j && k) {
            for (
              b.env.ios7 && b.forceReflow(), f = c.target;
              !b.matchSelector(f, i);

            )
              f = f.parentNode
            ;(g = e.call(c.target, c)),
              'undefined' == typeof g ||
                g ||
                (c.stopPropagation(), c.preventDefault())
          } else
            b.env.ios7 && b.forceReflow(),
              (j || k) &&
                ((g = e.call(c.target, c)),
                'undefined' == typeof g ||
                  g ||
                  (c.stopPropagation(), c.preventDefault()))
        }
        ;(e.proxy = e.proxy || {}),
          e.proxy[c]
            ? e.proxy[c].push(this.proxyid++)
            : (e.proxy[c] = [this.proxyid++]),
          this.proxies.push(f),
          (a.listeners = a.listeners || {}),
          a.listeners[c] ? a.listeners[c].push(f) : (a.listeners[c] = [f]),
          a.addEventListener && a.addEventListener(c, f, !1)
      },
      undelegate: function (a, b, c, d) {
        if (d) {
          var e = d.proxy[b]
          e.length &&
            e.forEach(function () {
              a.removeEventListener &&
                a.removeEventListener(b, this.proxies[this.proxyid], !1)
            })
        } else {
          var f = a.listeners[b]
          f.forEach(function (c) {
            a.removeEventListener(b, c, !1)
          })
        }
      }
    },
    d = {
      tap: !0,
      doubleTap: !0,
      tapMaxDistance: 10,
      hold: !0,
      tapTime: 200,
      holdTime: 650,
      maxDoubleTapInterval: 300,
      swipe: !0,
      swipeTime: 300,
      swipeMinDistance: 18,
      swipeFactor: 5,
      drag: !0,
      pinch: !0,
      minScaleRate: 0,
      minRotationAngle: 0
    },
    e = {
      TOUCH_START: 'touchstart',
      TOUCH_MOVE: 'touchmove',
      TOUCH_END: 'touchend',
      TOUCH_CANCEL: 'touchcancel',
      MOUSE_DOWN: 'mousedown',
      MOUSE_MOVE: 'mousemove',
      MOUSE_UP: 'mouseup',
      CLICK: 'click',
      PINCH_START: 'pinchstart',
      PINCH_END: 'pinchend',
      PINCH: 'pinch',
      PINCH_IN: 'pinchin',
      PINCH_OUT: 'pinchout',
      ROTATION_LEFT: 'rotateleft',
      ROTATION_RIGHT: 'rotateright',
      ROTATION: 'rotate',
      SWIPE_START: 'swipestart',
      SWIPING: 'swiping',
      SWIPE_END: 'swipeend',
      SWIPE_LEFT: 'swipeleft',
      SWIPE_RIGHT: 'swiperight',
      SWIPE_UP: 'swipeup',
      SWIPE_DOWN: 'swipedown',
      SWIPE: 'swipe',
      DRAG: 'drag',
      DRAGSTART: 'dragstart',
      DRAGEND: 'dragend',
      HOLD: 'hold',
      TAP: 'tap',
      DOUBLE_TAP: 'doubletap'
    },
    f = { start: null, move: null, end: null },
    g = 0,
    h = null,
    i = null,
    j = null,
    k = !1,
    l = !1,
    m = !1,
    n = {},
    o = !1,
    p = null,
    q = !1,
    r = null,
    s = 1,
    t = !1,
    u = [],
    v = 0,
    w = 0,
    x = 0,
    y = null,
    z = {
      getAngleDiff: function (a) {
        for (
          var c = parseInt(v - b.getAngle180(a[0], a[1]), 10), d = 0;
          Math.abs(c - w) > 90 && d++ < 50;

        )
          0 > w ? (c -= 180) : (c += 180)
        return (w = parseInt(c, 10))
      },
      pinch: function (a) {
        var g = a.target
        if (d.pinch) {
          if (!o) return
          if (b.getFingers(a) < 2 && !b.isTouchEnd(a)) return
          var h = b.calScale(f.start, f.move),
            i = this.getAngleDiff(f.move),
            j = {
              type: '',
              originEvent: a,
              scale: h,
              rotation: i,
              direction: i > 0 ? 'right' : 'left',
              fingersCount: b.getFingers(a)
            }
          if (
            (l
              ? b.isTouchMove(a)
                ? ((j.fingerStatus = 'move'), c.trigger(g, e.PINCH, j))
                : b.isTouchEnd(a) &&
                  ((j.fingerStatus = 'end'),
                  c.trigger(g, e.PINCH_END, j),
                  b.reset())
              : ((l = !0),
                (j.fingerStatus = 'start'),
                c.trigger(g, e.PINCH_START, j)),
            Math.abs(1 - h) > d.minScaleRate)
          ) {
            var k = b.simpleClone(j),
              m = 1e-11
            h > s
              ? ((s = h - m), c.trigger(g, e.PINCH_OUT, k, !1))
              : s > h && ((s = h + m), c.trigger(g, e.PINCH_IN, k, !1)),
              b.isTouchEnd(a) && (s = 1)
          }
          if (Math.abs(i) > d.minRotationAngle) {
            var n,
              p = b.simpleClone(j)
            ;(n = i > 0 ? e.ROTATION_RIGHT : e.ROTATION_LEFT),
              c.trigger(g, n, p, !1),
              c.trigger(g, e.ROTATION, j)
          }
        }
      },
      rotateSingleFinger: function (a) {
        var d = a.target
        if (t && b.getFingers(a) < 2) {
          if (!f.move) return
          if (u.length < 2) {
            var g = b.getXYByElement(d)
            ;(u = [
              { x: g.left + d.offsetWidth / 2, y: g.top + d.offsetHeight / 2 },
              f.move[0]
            ]),
              (v = parseInt(b.getAngle180(u[0], u[1]), 10))
          }
          var h = [u[0], f.move[0]],
            i = this.getAngleDiff(h),
            j = {
              type: '',
              originEvent: a,
              rotation: i,
              direction: i > 0 ? 'right' : 'left',
              fingersCount: b.getFingers(a)
            }
          b.isTouchMove(a)
            ? (j.fingerStatus = 'move')
            : (b.isTouchEnd(a) || 'mouseout' === a.type) &&
              ((j.fingerStatus = 'end'),
              c.trigger(d, e.PINCH_END, j),
              b.reset())
          var k = i > 0 ? e.ROTATION_RIGHT : e.ROTATION_LEFT
          c.trigger(d, k, j), c.trigger(d, e.ROTATION, j)
        }
      },
      swipe: function (a) {
        var h = a.target
        if (o && f.move && !(b.getFingers(a) > 1)) {
          var i = Date.now(),
            j = i - g,
            l = b.getDistance(f.start[0], f.move[0]),
            p = { x: f.move[0].x - n.left, y: f.move[0].y - n.top },
            q = b.getAngle(f.start[0], f.move[0]),
            r = b.getDirectionFromAngle(q),
            s = j / 1e3,
            t = 10 * (10 - d.swipeFactor) * s * s,
            u = {
              type: e.SWIPE,
              originEvent: a,
              position: p,
              direction: r,
              distance: l,
              distanceX: f.move[0].x - f.start[0].x,
              distanceY: f.move[0].y - f.start[0].y,
              x: f.move[0].x - f.start[0].x,
              y: f.move[0].y - f.start[0].y,
              angle: q,
              duration: j,
              fingersCount: b.getFingers(a),
              factor: t
            }
          if (d.swipe) {
            var v = function () {
              var a = e
              switch (r) {
                case 'up':
                  c.trigger(h, a.SWIPE_UP, u)
                  break
                case 'down':
                  c.trigger(h, a.SWIPE_DOWN, u)
                  break
                case 'left':
                  c.trigger(h, a.SWIPE_LEFT, u)
                  break
                case 'right':
                  c.trigger(h, a.SWIPE_RIGHT, u)
              }
            }
            k
              ? b.isTouchMove(a)
                ? ((u.fingerStatus = u.swipe = 'move'),
                  c.trigger(h, e.SWIPING, u),
                  j > d.swipeTime &&
                    j < d.swipeTime + 50 &&
                    l > d.swipeMinDistance &&
                    (v(), c.trigger(h, e.SWIPE, u, !1)))
                : (b.isTouchEnd(a) || 'mouseout' === a.type) &&
                  ((u.fingerStatus = u.swipe = 'end'),
                  c.trigger(h, e.SWIPE_END, u),
                  d.swipeTime > j &&
                    l > d.swipeMinDistance &&
                    (v(), c.trigger(h, e.SWIPE, u, !1)))
              : ((u.fingerStatus = u.swipe = 'start'),
                (k = !0),
                c.trigger(h, e.SWIPE_START, u))
          }
          d.drag &&
            (m
              ? b.isTouchMove(a)
                ? ((u.fingerStatus = u.swipe = 'move'), c.trigger(h, e.DRAG, u))
                : b.isTouchEnd(a) &&
                  ((u.fingerStatus = u.swipe = 'end'),
                  c.trigger(h, e.DRAGEND, u))
              : ((u.fingerStatus = u.swipe = 'start'),
                (m = !0),
                c.trigger(h, e.DRAGSTART, u)))
        }
      },
      tap: function (a) {
        var h = a.target
        if (d.tap) {
          var i = Date.now(),
            j = i - g,
            k = b.getDistance(f.start[0], f.move ? f.move[0] : f.start[0])
          clearTimeout(p)
          var l = (function () {
            if (y && d.doubleTap && g - x < d.maxDoubleTapInterval) {
              var a = b.getDistance(y, f.start[0])
              if (16 > a) return !0
            }
            return !1
          })()
          if (l)
            return (
              clearTimeout(r),
              void c.trigger(h, e.DOUBLE_TAP, {
                type: e.DOUBLE_TAP,
                originEvent: a,
                position: f.start[0]
              })
            )
          if (d.tapMaxDistance < k) return
          d.holdTime > j &&
            b.getFingers(a) <= 1 &&
            ((q = !0),
            (x = i),
            (y = f.start[0]),
            (r = setTimeout(function () {
              c.trigger(h, e.TAP, {
                type: e.TAP,
                originEvent: a,
                fingersCount: b.getFingers(a),
                position: y
              })
            }, d.tapTime)))
        }
      },
      hold: function (a) {
        var e = a.target
        d.hold &&
          (clearTimeout(p),
          (p = setTimeout(function () {
            if (f.start) {
              var g = b.getDistance(f.start[0], f.move ? f.move[0] : f.start[0])
              d.tapMaxDistance < g ||
                q ||
                c.trigger(e, 'hold', {
                  type: 'hold',
                  originEvent: a,
                  fingersCount: b.getFingers(a),
                  position: f.start[0]
                })
            }
          }, d.holdTime)))
      }
    },
    A = function (a) {
      let c = a.target
      switch (a.type) {
        case 'touchstart':
        case 'mousedown':
          ;(u = []),
            (o = !0),
            (!f.start || f.start.length < 2) && (f.start = b.getPosOfEvent(a)),
            b.getFingers(a) >= 2 &&
              (v = parseInt(b.getAngle180(f.start[0], f.start[1]), 10)),
            (g = Date.now()),
            (h = a),
            (n = {})
          var d = c.getBoundingClientRect(),
            e = document.documentElement
          ;(n = {
            top:
              d.top + (window.pageYOffset || e.scrollTop) - (e.clientTop || 0),
            left:
              d.left +
              (window.pageXOffset || e.scrollLeft) -
              (e.clientLeft || 0)
          }),
            z.hold(a)
          break
        case 'touchmove':
        case 'mousemove':
          if (!o || !f.start) return
          ;(f.move = b.getPosOfEvent(a)),
            b.getFingers(a) >= 2
              ? z.pinch(a)
              : t
              ? z.rotateSingleFinger(a)
              : z.swipe(a)
          break
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':
        case 'mouseout':
          if (!o) return
          ;(j = a),
            l
              ? z.pinch(a)
              : t
              ? z.rotateSingleFinger(a)
              : k
              ? z.swipe(a)
              : z.tap(a),
            b.reset(),
            (v = 0),
            (w = 0),
            a.touches && 1 === a.touches.length && ((o = !0), (t = !0))
      }
    },
    B = function () {
      function a(a) {
        b.hasTouch || (a = b.getPCevts(a)),
          j.forEach(function (b) {
            c.delegate(b, a, h, g[a])
          })
      }
      function d(a) {
        b.hasTouch || (a = b.getPCevts(a)),
          j.forEach(function (b) {
            c.bind(b, a, g[a])
          })
      }
      let e,
        f,
        g,
        h,
        i = arguments
      if (i.length < 2 || i > 4) return console.error('unexpected arguments!')
      let j =
        'string' === b.getType(i[0]) ? document.querySelectorAll(i[0]) : i[0]
      if (
        ((j = j.length ? Array.prototype.slice.call(j) : [j]),
        3 === i.length && 'string' === b.getType(i[1]))
      )
        return (
          (e = i[1].split(' ')),
          (f = i[2]),
          void e.forEach(function (a) {
            b.hasTouch || (a = b.getPCevts(a)),
              j.forEach(function (b) {
                c.bind(b, a, f)
              })
          })
        )
      if (3 !== i.length || 'object' !== b.getType(i[1]))
        if (2 !== i.length || 'object' !== b.getType(i[1])) {
          if (4 === i.length && 'object' === b.getType(i[2]))
            return (
              (e = i[1].split(' ')),
              (f = i[3]),
              void e.forEach(function (a) {
                b.hasTouch || (a = b.getPCevts(a)),
                  j.forEach(function (b) {
                    c.bind(b, a, f)
                  })
              })
            )
          if (4 === i.length) {
            var k = j[0]
            return (
              (e = i[1].split(' ')),
              (h = i[2]),
              (f = i[3]),
              void e.forEach(function (a) {
                b.hasTouch || (a = b.getPCevts(a)), c.delegate(k, a, h, f)
              })
            )
          }
        } else {
          g = i[1]
          for (var l in g) d(l)
        }
      else {
        ;(g = i[1]), (h = i[2])
        for (let m in g) a(m)
      }
    },
    C = function () {
      let a,
        d,
        e = arguments
      if (e.length < 1 || e.length > 4)
        return console.error('unexpected arguments!')
      let f =
        'string' === b.getType(e[0]) ? document.querySelectorAll(e[0]) : e[0]
      if (
        ((f = f.length ? Array.prototype.slice.call(f) : [f]),
        1 === e.length || 2 === e.length)
      )
        return void f.forEach(function (d) {
          ;(a = e[1] ? e[1].split(' ') : Object.keys(d.listeners)),
            a.length &&
              a.forEach(function (a) {
                b.hasTouch || (a = b.getPCevts(a)),
                  c.unbind(d, a),
                  c.undelegate(d, a)
              })
        })
      if (3 === e.length && 'function' === b.getType(e[2]))
        return (
          (d = e[2]),
          void f.forEach(function (f) {
            ;(a = e[1].split(' ')),
              a.forEach(function (a) {
                b.hasTouch || (a = b.getPCevts(a)), c.unbind(f, a, d)
              })
          })
        )
      if (3 === e.length && 'string' === b.getType(e[2])) {
        let g = e[2]
        return void f.forEach(function (d) {
          ;(a = e[1].split(' ')),
            a.forEach(function (a) {
              b.hasTouch || (a = b.getPCevts(a)), c.undelegate(d, a, g)
            })
        })
      }
      return 4 === e.length
        ? ((d = e[3]),
          void f.forEach(function (f) {
            ;(a = e[1].split(' ')),
              a.forEach(function (a) {
                b.hasTouch || (a = b.getPCevts(a)), c.undelegate(f, a, g, d)
              })
          }))
        : void 0
    },
    D = function (a, d, e) {
      let f = arguments
      b.hasTouch || (d = b.getPCevts(d))
      let g =
        'string' === b.getType(f[0]) ? document.querySelectorAll(f[0]) : f[0]
      ;(g = g.length ? Array.prototype.call(g) : [g]),
        g.forEach(function (a) {
          c.trigger(a, d, e)
        })
    }
  a()
  let E = {}
  return (
    (E.on = E.bind = E.live = B),
    (E.off = E.unbind = E.die = C),
    (E.config = d),
    (E.trigger = D),
    E
  )
})
