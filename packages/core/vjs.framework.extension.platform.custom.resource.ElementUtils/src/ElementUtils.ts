!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92', [], t)
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'] = t())
    : (e['vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'] = t())
})('undefined' != typeof self ? self : this, function () {
  return (function (e) {
    function t(r) {
      if (n[r]) return n[r].exports
      var i = (n[r] = { i: r, l: !1, exports: {} })
      return e[r].call(i.exports, i, i.exports, t), (i.l = !0), i.exports
    }
    var n = {}
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function (e, n, r) {
        t.o(e, n) ||
          Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: r
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
    JkW7: function (e, t, n) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var r = {
        _handleResize: function (e) {
          var t = e.target || e.srcElement,
            n = t.__resizeTrigger__
          if (n) {
            var r = n.__z_resizeListeners
            if (r)
              for (var i = r.length, o = 0; o < i; o++) {
                var s = r[o],
                  a = s.handler,
                  l = s.context
                a.apply(l, [e])
              }
          }
        },
        _removeHandler: function (e, t, n) {
          var r = e.__z_resizeListeners
          if (r)
            for (var i = r.length, o = 0; o < i; o++) {
              var s = r[o]
              if (s.handler === t && s.context === n) return void r.splice(o, 1)
            }
        },
        _createResizeTrigger: function (e) {
          var t = document.createElement('object')
          return (
            t.setAttribute(
              'style',
              'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;'
            ),
            (t.onload = r._handleObjectLoad),
            (t.type = 'text/html'),
            e.appendChild(t),
            (t.data = 'about:blank'),
            t
          )
        },
        _handleObjectLoad: function (e) {
          ;(this.contentDocument.defaultView.__resizeTrigger__ =
            this.__resizeElement__),
            this.contentDocument.defaultView.addEventListener(
              'resize',
              r._handleResize
            )
        }
      }
      document.attachEvent
        ? ((r.on = function (e, t, n) {
            var i = e.__z_resizeListeners
            i ||
              ((i = []),
              (e.__z_resizeListeners = i),
              (e.__resizeTrigger__ = e),
              e.attachEvent('onresize', r._handleResize)),
              i.push({ handler: t, context: n })
          }),
          (r.off = function (e, t, n) {
            var i = e.__z_resizeListeners
            i &&
              (r._removeHandler(e, t, n),
              0 === i.length &&
                (e.detachEvent('onresize', r._handleResize),
                delete e.__z_resizeListeners))
          }))
        : ((r.on = function (e, t, n) {
            var i = e.__z_resizeListeners
            if (!i) {
              ;(i = []),
                (e.__z_resizeListeners = i),
                'static' === getComputedStyle(e, null).position &&
                  (e.style.position = 'relative')
              var o = r._createResizeTrigger(e)
              ;(e.__resizeTrigger__ = o), (o.__resizeElement__ = e)
            }
            i.push({ handler: t, context: n })
          }),
          (r.off = function (e, t, n) {
            var i = e.__z_resizeListeners
            if (i && (r._removeHandler(e, t, n), 0 === i.length)) {
              var o = e.__resizeTrigger__
              o &&
                (o.contentDocument.defaultView.removeEventListener(
                  'resize',
                  r._handleResize
                ),
                e.removeChild(o),
                delete e.__resizeTrigger__),
                delete e.__z_resizeListeners
            }
          })),
        (t.default = {
          bindEleResize: function (e, t) {
            r.on(e, t)
          },
          unbindEleResize: function (e, t) {
            r.off(e, t)
          },
          addClass: function (e, t) {
            var n = e.className
            n = null == n ? '' : n
            for (var r = n.split(' '), i = !0, o = 0, s = r.length; o < s; o++)
              if (r[o] == t) {
                i = !1
                break
              }
            i && (r.push(t), (e.className = r.join(' ')))
          },
          removeClass: function (e, t) {
            var n = e.className
            n = null == n ? '' : n
            for (var r = n.split(' '), i = !1, o = 0, s = r.length; o < s; o++)
              if (r[o] == t) {
                r.splice(o, 1), (i = !0)
                break
              }
            i && (e.className = r.join(' '))
          },
          visible: function (e) {
            return !!(
              e.offsetWidth ||
              e.offsetHeight ||
              e.getClientRects().length
            )
          }
        })
    }
  })
})
//# sourceMappingURL=ElementUtils.js.map
