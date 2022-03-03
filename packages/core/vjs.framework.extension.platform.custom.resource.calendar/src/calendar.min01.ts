/* eslint-disable */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : (e.mobiscroll = t())
})(this, function () {
  'use strict'
  function e(e) {
    return 'function' == typeof e
  }
  function t(e) {
    return 'object' === ('undefined' == typeof e ? 'undefined' : xe(e))
  }
  function a(e) {
    return 'number' == typeof e.length
  }
  function s(e) {
    return e.replace(/-+(.)?/g, function (e, t) {
      return t ? t.toUpperCase() : ''
    })
  }
  function n(e, t, a) {
    for (let s in t)
      a && (Le.isPlainObject(t[s]) || Le.isArray(t[s]))
        ? (((Le.isPlainObject(t[s]) && !Le.isPlainObject(e[s])) ||
            (Le.isArray(t[s]) && !Le.isArray(e[s]))) &&
            (e[s] = {}),
          n(e[s], t[s], a))
        : void 0 !== t[s] && (e[s] = t[s])
  }
  function i(e) {
    return e
      .replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/_/g, '-')
      .toLowerCase()
  }
  function r(e, t) {
    return 'number' != typeof t || Se[i(e)] ? t : t + 'px'
  }
  function o(e, t, a) {
    ye[e] = function (s, n) {
      let i,
        r,
        o = {},
        l = n || {}
      return (
        a !== !1 && (l.preset = e),
        Le(s).each(function () {
          ;(i = new t(this, l)), (o[this.id] = i)
        }),
        (r = Object.keys(o)),
        1 == r.length ? o[r[0]] : o
      )
    }
  }
  function l() {}
  function c(e) {
    let t,
      a = []
    for (t in e) a.push(e[t])
    return a
  }
  function d(e) {
    let t,
      a = {}
    if (e) for (t = 0; t < e.length; t++) a[e[t]] = e[t]
    return a
  }
  function u(e) {
    return e - parseFloat(e) >= 0
  }
  function m(e) {
    return 'string' == typeof e
  }
  function h(e, t, a) {
    return Math.max(t, Math.min(e, a))
  }
  function f(e, t) {
    for (e += '', t = t || 2; e.length < t; ) e = '0' + e
    return e
  }
  function p(e, t) {
    let a, s
    return (
      (t = t || 100),
      function () {
        var n = this,
          i = +new Date(),
          r = arguments
        a && i < a + t
          ? (clearTimeout(s),
            (s = setTimeout(function () {
              ;(a = i), e.apply(n, r)
            }, t)))
          : ((a = i), e.apply(n, r))
      }
    )
  }
  function v(e) {
    'vibrate' in navigator && navigator.vibrate(e || 50)
  }
  function b(e, t, a) {
    return (100 * (e - t)) / (a - t)
  }
  function g(e, t, a) {
    let s = a.attr(e)
    return void 0 === s || '' === s ? t : 'true' === s
  }
  function y() {
    je++,
      setTimeout(function () {
        je--
      }, 500)
  }
  function _(e, t) {
    let a = (e.originalEvent || e).changedTouches[0],
      s = document.createEvent('MouseEvents')
    s.initMouseEvent(
      'click',
      !0,
      !0,
      window,
      1,
      a.screenX,
      a.screenY,
      a.clientX,
      a.clientY,
      !1,
      !1,
      !1,
      !1,
      0,
      null
    ),
      (s.isMbscTap = !0),
      (s.isIonicTap = !0),
      (t.mbscChange = !0),
      t.dispatchEvent(s),
      y()
  }
  function x(e, t, a) {
    let s = e.originalEvent || e,
      n = (a ? 'page' : 'client') + t
    return s.targetTouches && s.targetTouches[0]
      ? s.targetTouches[0][n]
      : s.changedTouches && s.changedTouches[0]
      ? s.changedTouches[0][n]
      : e[n]
  }
  function w(e, t, a, s, n, i) {
    function r(e) {
      m ||
        (s && e.preventDefault(),
        (m = this),
        (d = x(e, 'X')),
        (u = x(e, 'Y')),
        (h = !1),
        (f = new Date()))
    }
    function o(e) {
      m &&
        !h &&
        (Math.abs(x(e, 'X') - d) > n || Math.abs(x(e, 'Y') - u) > n) &&
        (h = !0)
    }
    function l(t) {
      m &&
        (((i && new Date() - f < 100) || !h) &&
          (t.preventDefault(), a.call(m, t, e)),
        (m = !1),
        y())
    }
    function c() {
      m = !1
    }
    let d,
      u,
      m,
      h,
      f,
      p = ye.$,
      v = p(t)
    ;(n = n || 9),
      e.settings.tap &&
        v
          .on('touchstart.mbsc', r)
          .on('touchcancel.mbsc', c)
          .on('touchmove.mbsc', o)
          .on('touchend.mbsc', l),
      v.on('click.mbsc', function (t) {
        s && t.preventDefault(), a.call(this, t, e)
      })
  }
  function C(e) {
    if (
      je &&
      !e.isMbscTap &&
      ('TEXTAREA' != e.target.nodeName || 'mousedown' != e.type)
    )
      return e.stopPropagation(), e.preventDefault(), !1
  }
  function T(e, t, a) {
    Fe &&
      Be(function () {
        Be(e).each(function () {
          new t(this)
        }),
          Be(document).on('mbsc-enhance', function (a, s) {
            Be(a.target).is(e)
              ? new t(a.target, s)
              : Be(e, a.target).each(function () {
                  new t(this, s)
                })
          }),
          a &&
            Be(document).on('mbsc-refresh', function (t) {
              var a
              Be(t.target).is(e)
                ? ((a = Xe[t.target.id]), a && a.refresh())
                : Be(e, t.target).each(function () {
                    ;(a = Xe[this.id]), a && a.refresh()
                  })
            })
      })
  }
  function M(e, t) {
    let a = document.createElement('script'),
      s = 'mbscjsonp' + ++Je
    ;(window[s] = function (e) {
      a.parentNode.removeChild(a), delete window[s], e && t(e)
    }),
      (a.src = e + (e.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + s),
      document.body.appendChild(a)
  }
  function k(e, t) {
    let a = new XMLHttpRequest()
    a.open('GET', e, !0),
      (a.onload = function () {
        this.status >= 200 && this.status < 400 && t(JSON.parse(this.response))
      }),
      (a.onerror = function () {}),
      a.send()
  }
  function D(e, t, a) {
    'jsonp' == a ? M(e, t) : k(e, t)
  }
  function S(e) {
    let t
    for (t in e) if (void 0 !== et[e[t]]) return !0
    return !1
  }
  function V() {
    let e,
      t = ['Webkit', 'Moz', 'O', 'ms']
    for (e in t)
      if (S([t[e] + 'Transform'])) return '-' + t[e].toLowerCase() + '-'
    return ''
  }
  function A(e, t) {
    if ('touchstart' == e.type) Be(t).attr('data-touch', '1')
    else if (Be(t).attr('data-touch')) return Be(t).removeAttr('data-touch'), !1
    return !0
  }
  function E(e, t) {
    let a,
      s,
      n = getComputedStyle(e[0])
    return (
      Be.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (e, t) {
        if (void 0 !== n[t + 'ransform']) return (a = n[t + 'ransform']), !1
      }),
      (a = a.split(')')[0].split(', ')),
      (s = t ? a[13] || a[5] : a[12] || a[4])
    )
  }
  function I(e) {
    if (e) {
      if (nt[e]) return nt[e]
      let t = Be('<div style="background-color:' + e + ';"></div>').appendTo(
          'body'
        ),
        a = getComputedStyle(t[0]),
        s = a.backgroundColor.replace(/rgb|rgba|\(|\)|\s/g, '').split(','),
        n = 0.299 * s[0] + 0.587 * s[1] + 0.114 * s[2],
        i = n < 130 ? '#fff' : '#000'
      return t.remove(), (nt[e] = i), i
    }
  }
  function L(e, t, a, s, n, i) {
    function r(e) {
      let t
      ;(f = Be(this)),
        (_ = +f.attr('data-step')),
        (v = +f.attr('data-index')),
        (p = !0),
        n && e.stopPropagation(),
        'mousedown' == e.type && e.preventDefault(),
        'keydown' != e.type
          ? ((g = x(e, 'X')), (y = x(e, 'Y')), (t = A(e, this)))
          : (t = 32 === e.keyCode),
        b ||
          !t ||
          f.hasClass('mbsc-disabled') ||
          (u(v, _) &&
            (f.addClass('mbsc-active'),
            i && i.addRipple(f.find('.mbsc-segmented-content'), e)),
          'mousedown' == e.type &&
            Be(document).on('mousemove', o).on('mouseup', c))
    }
    function o(e) {
      ;(Math.abs(g - x(e, 'X')) > 7 || Math.abs(y - x(e, 'Y')) > 7) &&
        ((p = !0), d())
    }
    function c(e) {
      'touchend' == e.type && e.preventDefault(),
        d(),
        'mouseup' == e.type &&
          Be(document).off('mousemove', o).off('mouseup', c)
    }
    function d() {
      ;(b = !1),
        clearInterval(w),
        f &&
          (f.removeClass('mbsc-active'),
          i &&
            setTimeout(function () {
              i.removeRipple()
            }, 100))
    }
    function u(e, t) {
      return (
        b || C(e) || ((v = e), (_ = t), (b = !0), (p = !1), setTimeout(m, 100)),
        b
      )
    }
    function m() {
      return f && f.hasClass('mbsc-disabled')
        ? void d()
        : ((!b && p) || ((p = !0), t(v, _, m)),
          void (
            b &&
            a &&
            (clearInterval(w),
            (w = setInterval(function () {
              t(v, _)
            }, a)))
          ))
    }
    function h() {
      e.off('touchstart mousedown keydown', r)
        .off('touchmove', o)
        .off('touchend touchcancel keyup', c)
    }
    let f,
      p,
      v,
      b,
      g,
      y,
      _,
      w,
      C = s || l
    return (
      e
        .on('touchstart mousedown keydown', r)
        .on('touchmove', o)
        .on('touchend touchcancel keyup', c),
      { start: u, stop: d, destroy: h }
    )
  }
  function O(e, t, a, s, n, i, r) {
    let o = new Date(e, t, a, s || 0, n || 0, i || 0, r || 0)
    return (
      23 == o.getHours() && 0 === (s || 0) && o.setHours(o.getHours() + 2), o
    )
  }
  function P(e, t, a) {
    if (!t) return null
    let s,
      n,
      i = Ge({}, Dt, a),
      r = function (t) {
        for (let a = 0; s + 1 < e.length && e.charAt(s + 1) == t; ) a++, s++
        return a
      },
      o = function (e, t, a) {
        let s = '' + t
        if (r(e)) for (; s.length < a; ) s = '0' + s
        return s
      },
      l = function (e, t, a, s) {
        return r(e) ? s[t] : a[t]
      },
      c = '',
      d = !1
    for (s = 0; s < e.length; s++)
      if (d) "'" != e.charAt(s) || r("'") ? (c += e.charAt(s)) : (d = !1)
      else
        switch (e.charAt(s)) {
          case 'd':
            c += o('d', i.getDay(t), 2)
            break
          case 'D':
            c += l('D', t.getDay(), i.dayNamesShort, i.dayNames)
            break
          case 'o':
            c += o(
              'o',
              (t.getTime() - new Date(t.getFullYear(), 0, 0).getTime()) / 864e5,
              3
            )
            break
          case 'm':
            c += o('m', i.getMonth(t) + 1, 2)
            break
          case 'M':
            c += l('M', i.getMonth(t), i.monthNamesShort, i.monthNames)
            break
          case 'y':
            ;(n = i.getYear(t)),
              (c += r('y') ? n : (n % 100 < 10 ? '0' : '') + (n % 100))
            break
          case 'h':
            var u = t.getHours()
            c += o('h', u > 12 ? u - 12 : 0 === u ? 12 : u, 2)
            break
          case 'H':
            c += o('H', t.getHours(), 2)
            break
          case 'i':
            c += o('i', t.getMinutes(), 2)
            break
          case 's':
            c += o('s', t.getSeconds(), 2)
            break
          case 'a':
            c += t.getHours() > 11 ? i.pmText : i.amText
            break
          case 'A':
            c +=
              t.getHours() > 11
                ? i.pmText.toUpperCase()
                : i.amText.toUpperCase()
            break
          case "'":
            r("'") ? (c += "'") : (d = !0)
            break
          default:
            c += e.charAt(s)
        }
    return c
  }
  function Y(e, t, a) {
    let s = Ge({}, Dt, a),
      n = W(s.defaultValue || new Date())
    if (!e || !t) return n
    if (t.getTime) return t
    t =
      'object' == ('undefined' == typeof t ? 'undefined' : xe(t))
        ? t.toString()
        : t + ''
    let i,
      r = s.shortYearCutoff,
      o = s.getYear(n),
      l = s.getMonth(n) + 1,
      c = s.getDay(n),
      d = -1,
      u = n.getHours(),
      m = n.getMinutes(),
      h = 0,
      f = -1,
      p = !1,
      v = function (t) {
        let a = i + 1 < e.length && e.charAt(i + 1) == t
        return a && i++, a
      },
      b = function (e) {
        v(e)
        let a = '@' == e ? 14 : '!' == e ? 20 : 'y' == e ? 4 : 'o' == e ? 3 : 2,
          s = new RegExp('^\\d{1,' + a + '}'),
          n = t.substr(_).match(s)
        return n ? ((_ += n[0].length), parseInt(n[0], 10)) : 0
      },
      g = function (e, a, s) {
        let n,
          i = v(e) ? s : a
        for (n = 0; n < i.length; n++)
          if (t.substr(_, i[n].length).toLowerCase() == i[n].toLowerCase())
            return (_ += i[n].length), n + 1
        return 0
      },
      y = function () {
        _++
      },
      _ = 0
    for (i = 0; i < e.length; i++)
      if (p) "'" != e.charAt(i) || v("'") ? y() : (p = !1)
      else
        switch (e.charAt(i)) {
          case 'd':
            c = b('d')
            break
          case 'D':
            g('D', s.dayNamesShort, s.dayNames)
            break
          case 'o':
            d = b('o')
            break
          case 'm':
            l = b('m')
            break
          case 'M':
            l = g('M', s.monthNamesShort, s.monthNames)
            break
          case 'y':
            o = b('y')
            break
          case 'H':
            u = b('H')
            break
          case 'h':
            u = b('h')
            break
          case 'i':
            m = b('i')
            break
          case 's':
            h = b('s')
            break
          case 'a':
            f = g('a', [s.amText, s.pmText], [s.amText, s.pmText]) - 1
            break
          case 'A':
            f = g('A', [s.amText, s.pmText], [s.amText, s.pmText]) - 1
            break
          case "'":
            v("'") ? y() : (p = !0)
            break
          default:
            y()
        }
    if (
      (o < 100 &&
        (o +=
          new Date().getFullYear() -
          (new Date().getFullYear() % 100) +
          (o <=
          ('string' != typeof r
            ? r
            : (new Date().getFullYear() % 100) + parseInt(r, 10))
            ? 0
            : -100)),
      d > -1)
    ) {
      ;(l = 1), (c = d)
      do {
        var x = 32 - new Date(o, l - 1, 32, 12).getDate()
        c > x && (l++, (c -= x))
      } while (c > x)
    }
    u = f == -1 ? u : f && u < 12 ? u + 12 : f || 12 != u ? u : 0
    let w = s.getDate(o, l - 1, c, u, m, h)
    return s.getYear(w) != o || s.getMonth(w) + 1 != l || s.getDay(w) != c
      ? n
      : w
  }
  function H(e) {
    return O(e.getFullYear(), e.getMonth(), e.getDate())
  }
  function N(e, t) {
    let a = '',
      s = ''
    return (
      e &&
        (t.h &&
          ((s += f(e.getHours()) + ':' + f(e.getMinutes())),
          t.s && (s += ':' + f(e.getSeconds())),
          t.u && (s += '.' + f(e.getMilliseconds(), 3)),
          t.tz && (s += t.tz)),
        t.y
          ? ((a += e.getFullYear()),
            t.m &&
              ((a += '-' + f(e.getMonth() + 1)),
              t.d && (a += '-' + f(e.getDate())),
              t.h && (a += 'T' + s)))
          : t.h && (a = s)),
      a
    )
  }
  function F(e, t, a) {
    let s,
      n,
      i = { y: 1, m: 2, d: 3, h: 4, i: 5, s: 6, u: 7, tz: 8 }
    if (a) for (s in i) (n = e[i[s] - t]), n && (a[s] = 'tz' == s ? n : 1)
  }
  function $(e, t, a) {
    let s = window.moment || t.moment,
      n = t.returnFormat
    if (e) {
      if ('moment' == n && s) return s(e)
      if ('locale' == n) return P(a, e, t)
      if ('iso8601' == n) return N(e, t.isoParts)
    }
    return e
  }
  function W(e, t, a, s) {
    let n
    return e
      ? e.getTime
        ? e
        : e.toDate
        ? e.toDate()
        : ('string' == typeof e && (e = e.trim()),
          (n = Tt.exec(e))
            ? (F(n, 2, s),
              new Date(
                1970,
                0,
                1,
                n[2] ? +n[2] : 0,
                n[3] ? +n[3] : 0,
                n[4] ? +n[4] : 0,
                n[5] ? +n[5] : 0
              ))
            : (n || (n = Ct.exec(e)),
              n
                ? (F(n, 0, s),
                  new Date(
                    n[1] ? +n[1] : 1970,
                    n[2] ? n[2] - 1 : 0,
                    n[3] ? +n[3] : 1,
                    n[4] ? +n[4] : 0,
                    n[5] ? +n[5] : 0,
                    n[6] ? +n[6] : 0,
                    n[7] ? +n[7] : 0
                  ))
                : Y(t, e, a)))
      : null
  }
  function R(e) {
    return e[0].innerWidth || e.innerWidth()
  }
  function q(e) {
    let t = e[0],
      a = e.attr('data-role'),
      s = e.attr('type') || t.nodeName.toLowerCase()
    return /(switch|range|rating|segmented|stepper)/.test(a) && (s = a), s
  }
  function j(e) {
    let t = ye.themes.form[e]
    return t && t.addRipple ? t : null
  }
  function z() {
    clearTimeout(Xt),
      (Xt = setTimeout(function () {
        Be('textarea.mbsc-control').each(function () {
          B(this)
        })
      }, 100))
  }
  function B(e) {
    let t = void 0,
      a = void 0,
      s = void 0,
      n = Be(e).attr('rows') || 6
    e.offsetHeight &&
      ((e.style.height = ''),
      (s = e.scrollHeight - e.offsetHeight),
      (t = e.offsetHeight + (s > 0 ? s : 0)),
      (a = Math.round(t / 24)),
      a > n
        ? ((t = 24 * n + (t - 24 * a)), Be(e).addClass('mbsc-textarea-scroll'))
        : Be(e).removeClass('mbsc-textarea-scroll'),
      t && (e.style.height = t + 'px'))
  }
  function U(e) {
    let t = Be(e)
    if (!t.hasClass('mbsc-textarea-scroll')) {
      let a = e.scrollHeight - e.offsetHeight,
        s = e.offsetHeight + a,
        n = Math.round(s / 24),
        i = t.attr('rows') || 6
      n <= i && ((e.scrollTop = 0), (e.style.height = s + 'px'))
    }
  }
  function X(e, t) {
    let a = {},
      s = e.parent(),
      n = s.find('.mbsc-err-msg'),
      i = e.attr('data-icon-align') || 'left',
      r = e.attr('data-icon')
    s.hasClass(aa)
      ? (s = s.parent())
      : Be('<span class="' + aa + '"></span>')
          .insertAfter(e)
          .append(e),
      n && s.find('.' + aa).append(n),
      r && (r.indexOf('{') !== -1 ? (a = JSON.parse(r)) : (a[i] = r)),
      (r || t) &&
        (Ge(a, t),
        s
          .addClass(
            (a.right ? 'mbsc-ic-right ' : '') + (a.left ? ' mbsc-ic-left' : '')
          )
          .find('.' + aa)
          .append(
            a.left
              ? '<span class="mbsc-input-ic mbsc-left-ic mbsc-ic mbsc-ic-' +
                  a.left +
                  '"></span>'
              : ''
          )
          .append(
            a.right
              ? '<span class="mbsc-input-ic mbsc-right-ic mbsc-ic mbsc-ic-' +
                  a.right +
                  '"></span>'
              : ''
          ))
  }
  function K(e, t, a) {
    let s = {},
      n = a[0],
      i = a.attr('data-password-toggle'),
      r = a.attr('data-icon-show') || 'eye',
      o = a.attr('data-icon-hide') || 'eye-blocked'
    i && (s.right = 'password' == n.type ? r : o),
      X(a, s),
      i &&
        w(
          e,
          t.find('.mbsc-right-ic').addClass('mbsc-input-toggle'),
          function () {
            'text' == n.type
              ? ((n.type = 'password'),
                Be(this)
                  .addClass('mbsc-ic-' + r)
                  .removeClass('mbsc-ic-' + o))
              : ((n.type = 'text'),
                Be(this)
                  .removeClass('mbsc-ic-' + r)
                  .addClass('mbsc-ic-' + o))
          }
        )
  }
  function G(e, t) {
    'button' != t &&
      'submit' != t &&
      'segmented' != t &&
      (e.addClass('mbsc-control-w').find('label').addClass('mbsc-label'),
      e
        .contents()
        .filter(function () {
          return (
            3 == this.nodeType && this.nodeValue && /\S/.test(this.nodeValue)
          )
        })
        .each(function () {
          Be('<span class="mbsc-label"></span>').insertAfter(this).append(this)
        }))
  }
  function Z(e, t, a, s) {
    Be('input,select,textarea,progress,button', e).each(function () {
      var e = this,
        s = Be(e),
        n = q(s)
      if ('false' != s.attr('data-enhance'))
        if (s.hasClass('mbsc-control'))
          e.mbscInst &&
            e.mbscInst.option({
              theme: a.theme,
              lang: a.lang,
              rtl: a.rtl,
              onText: a.onText,
              offText: a.offText,
              stopProp: a.stopProp
            })
        else
          switch ((e.id || (e.id = 'mbsc-form-control-' + ++ta), n)) {
            case 'button':
            case 'submit':
              t[e.id] = new qt(e, { theme: a.theme, tap: a.tap })
              break
            case 'switch':
              t[e.id] = new Qt(e, {
                theme: a.theme,
                lang: a.lang,
                rtl: a.rtl,
                tap: a.tap,
                onText: a.onText,
                offText: a.offText,
                stopProp: a.stopProp
              })
              break
            case 'checkbox':
              t[e.id] = new jt(e, { tap: a.tap })
              break
            case 'range':
              Be(e).parent().hasClass('mbsc-slider') ||
                (t[e.id] = new na(e, {
                  theme: a.theme,
                  lang: a.lang,
                  rtl: a.rtl,
                  stopProp: a.stopProp
                }))
              break
            case 'rating':
              t[e.id] = new ea(e, {
                theme: a.theme,
                lang: a.lang,
                rtl: a.rtl,
                stopProp: a.stopProp
              })
              break
            case 'progress':
              t[e.id] = new sa(e, { theme: a.theme, lang: a.lang, rtl: a.rtl })
              break
            case 'radio':
              t[e.id] = new zt(e, { tap: a.tap })
              break
            case 'select':
            case 'select-one':
            case 'select-multiple':
              t[e.id] = new Bt(e, { tap: a.tap })
              break
            case 'textarea':
              t[e.id] = new Kt(e, { tap: a.tap })
              break
            case 'segmented':
              t[e.id] = new Gt(e, { theme: a.theme, tap: a.tap })
              break
            case 'stepper':
              t[e.id] = new Zt(e, { theme: a.theme })
              break
            case 'hidden':
              return
            default:
              t[e.id] = new Rt(e, { tap: a.tap })
          }
    }),
      s || z()
  }
  function J(e) {
    let t = [
      Math.round(e.r).toString(16),
      Math.round(e.g).toString(16),
      Math.round(e.b).toString(16)
    ]
    return (
      Be.each(t, function (e, a) {
        1 == a.length && (t[e] = '0' + a)
      }),
      '#' + t.join('')
    )
  }
  function Q(e) {
    return (
      (e = parseInt(e.indexOf('#') > -1 ? e.substring(1) : e, 16)),
      {
        r: e >> 16,
        g: (65280 & e) >> 8,
        b: 255 & e,
        toString: function () {
          return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')'
        }
      }
    )
  }
  function ee(e) {
    let t,
      a,
      s,
      n = e.h,
      i = (255 * e.s) / 100,
      r = (255 * e.v) / 100
    if (0 === i) t = a = s = r
    else {
      let o = r,
        l = ((255 - i) * r) / 255,
        c = ((o - l) * (n % 60)) / 60
      360 == n && (n = 0),
        n < 60
          ? ((t = o), (s = l), (a = l + c))
          : n < 120
          ? ((a = o), (s = l), (t = o - c))
          : n < 180
          ? ((a = o), (t = l), (s = l + c))
          : n < 240
          ? ((s = o), (t = l), (a = o - c))
          : n < 300
          ? ((s = o), (a = l), (t = l + c))
          : n < 360
          ? ((t = o), (a = l), (s = o - c))
          : (t = a = s = 0)
    }
    return {
      r: t,
      g: a,
      b: s,
      toString: function () {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')'
      }
    }
  }
  function te(e) {
    let t,
      a,
      s = 0,
      n = Math.min(e.r, e.g, e.b),
      i = Math.max(e.r, e.g, e.b),
      r = i - n
    return (
      (a = i),
      (t = i ? (255 * r) / i : 0),
      (s = t
        ? e.r == i
          ? (e.g - e.b) / r
          : e.g == i
          ? 2 + (e.b - e.r) / r
          : 4 + (e.r - e.g) / r
        : -1),
      (s *= 60),
      s < 0 && (s += 360),
      (t *= 100 / 255),
      (a *= 100 / 255),
      {
        h: s,
        s: t,
        v: a,
        toString: function () {
          return (
            'hsv(' +
            Math.round(this.h) +
            ',' +
            Math.round(this.s) +
            '%,' +
            Math.round(this.v) +
            '%)'
          )
        }
      }
    )
  }
  function ae(e) {
    let t,
      a,
      s = e.r / 255,
      n = e.g / 255,
      i = e.b / 255,
      r = Math.max(s, n, i),
      o = Math.min(s, n, i),
      l = (r + o) / 2
    if (r == o) t = a = 0
    else {
      let c = r - o
      switch (((a = l > 0.5 ? c / (2 - r - o) : c / (r + o)), r)) {
        case s:
          t = (n - i) / c + (n < i ? 6 : 0)
          break
        case n:
          t = (i - s) / c + 2
          break
        case i:
          t = (s - n) / c + 4
      }
      t /= 6
    }
    return {
      h: Math.round(360 * t),
      s: Math.round(100 * a),
      l: Math.round(100 * l),
      toString: function () {
        return 'hsl(' + this.h + ',' + this.s + '%,' + this.l + '%)'
      }
    }
  }
  function se(e) {
    let t,
      a,
      s,
      n,
      i,
      r,
      o = e.h,
      l = e.s,
      c = e.l
    return (
      isFinite(o) || (o = 0),
      isFinite(l) || (l = 0),
      isFinite(c) || (c = 0),
      (o /= 60),
      o < 0 && (o = 6 - (-o % 6)),
      (o %= 6),
      (l = Math.max(0, Math.min(1, l / 100))),
      (c = Math.max(0, Math.min(1, c / 100))),
      (i = (1 - Math.abs(2 * c - 1)) * l),
      (r = i * (1 - Math.abs((o % 2) - 1))),
      o < 1
        ? ((t = i), (a = r), (s = 0))
        : o < 2
        ? ((t = r), (a = i), (s = 0))
        : o < 3
        ? ((t = 0), (a = i), (s = r))
        : o < 4
        ? ((t = 0), (a = r), (s = i))
        : o < 5
        ? ((t = r), (a = 0), (s = i))
        : ((t = i), (a = 0), (s = r)),
      (n = c - i / 2),
      {
        r: Math.round(255 * (t + n)),
        g: Math.round(255 * (a + n)),
        b: Math.round(255 * (s + n)),
        toString: function () {
          return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')'
        }
      }
    )
  }
  function ne(e) {
    return ae(Q(e))
  }
  function ie(e) {
    return J(se(e))
  }
  function re(e) {
    return J(ee(e))
  }
  function oe(e) {
    return te(Q(e))
  }
  function le(e) {
    for (let t = 0, a = 1, s = 0; e.length; )
      t > 3 ? (a = 3600) : t > 1 && (a = 60),
        (s += e.pop() * a * (t % 2 ? 10 : 1)),
        t++
    return s
  }
  function ce(e) {
    wa.length || e.show(), wa.push(e)
  }
  function de(e) {
    let t = Ca.length
    Ca.push(e), wa.length || (t ? Ca[0].hide() : e.show(!1, !0))
  }
  function ue(e, t, a, s) {
    return Ge(
      {
        display: t.display || 'center',
        cssClass: 'mbsc-alert',
        okText: t.okText,
        cancelText: t.cancelText,
        context: t.context,
        theme: t.theme,
        closeOnOverlayTap: !1,
        onBeforeClose: function () {
          e.shift()
        },
        onBeforeShow: function () {
          ye.activeInstance = null
        },
        onHide: function (e, s) {
          a && a(s._resolve),
            t.callback && t.callback(s._resolve),
            s && s.destroy(),
            wa.length ? wa[0].show() : Ca.length && Ca[0].show(!1, !0)
        }
      },
      s
    )
  }
  function me(e) {
    return (
      (e.title ? '<h2>' + e.title + '</h2>' : '') +
      '<p>' +
      (e.message || '') +
      '</p>'
    )
  }
  function he(e, t, a) {
    let s = new _a(e, ue(wa, t, a))
    ce(s)
  }
  function fe(e, t, a) {
    let s = new _a(
      e,
      ue(wa, t, a, {
        buttons: ['cancel', 'ok'],
        onSet: function () {
          s._resolve = !0
        }
      })
    )
    ;(s._resolve = !1), ce(s)
  }
  function pe(e, t, a) {
    let s = void 0,
      n = new _a(
        e,
        ue(wa, t, a, {
          buttons: ['cancel', 'ok'],
          onMarkupReady: function (e, t) {
            ;(s = t._markup.find('input')[0]),
              setTimeout(function () {
                s.focus(), s.setSelectionRange(0, s.value.length)
              }, 300)
          },
          onSet: function () {
            n._resolve = s.value
          }
        })
      )
    ;(n._resolve = null), ce(n)
  }
  function ve(e, t, a, s, n) {
    let i = void 0,
      r = new _a(
        e,
        ue(Ca, t, a, {
          display: t.display || 'bottom',
          animate: n,
          cssClass:
            (s || 'mbsc-snackbar') + (t.color ? ' mbsc-' + t.color : ''),
          scrollLock: !1,
          focusTrap: !1,
          buttons: [],
          onShow: function (e, a) {
            t.duration !== !1 &&
              (i = setTimeout(function () {
                a && a.hide()
              }, t.duration || 3e3)),
              t.button &&
                a.tap(Be('.mbsc-snackbar-btn', e.target), function () {
                  a.hide(), t.button.action && t.button.action.call(this)
                })
          },
          onClose: function () {
            clearTimeout(i)
          }
        })
      )
    de(r)
  }
  function be(e, t, a) {
    ve(e, t, a, 'mbsc-toast', 'fade')
  }
  function ge(e, t, a) {
    let s = void 0
    return (
      xa
        ? (s = new Promise(function (s) {
            e(t, a, s)
          }))
        : e(t, a),
      s
    )
  }
  let ye = ye || {},
    _e = {},
    xe =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (e) {
            return typeof e
          }
        : function (e) {
            return e &&
              'function' == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e
          },
    we = function (e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function')
    },
    Ce = (function () {
      function e(e, t) {
        for (let a = 0; a < t.length; a++) {
          let s = t[a]
          ;(s.enumerable = s.enumerable || !1),
            (s.configurable = !0),
            'value' in s && (s.writable = !0),
            Object.defineProperty(e, s.key, s)
        }
      }
      return function (t, a, s) {
        return a && e(t.prototype, a), s && e(t, s), t
      }
    })(),
    Te = function (e, t, a) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: a,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = a),
        e
      )
    },
    Me = function e(t, a, s) {
      null === t && (t = Function.prototype)
      let n = Object.getOwnPropertyDescriptor(t, a)
      if (void 0 === n) {
        let i = Object.getPrototypeOf(t)
        return null === i ? void 0 : e(i, a, s)
      }
      if ('value' in n) return n.value
      let r = n.get
      if (void 0 !== r) return r.call(s)
    },
    ke = function (e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        )
      ;(e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t))
    },
    De = function (e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        )
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t
    },
    Se = {
      'column-count': 1,
      'columns': 1,
      'font-weight': 1,
      'line-height': 1,
      'opacity': 1,
      'z-index': 1,
      'zoom': 1
    },
    Ve = { readonly: 'readOnly' },
    Ae = [],
    Ee = Array.prototype.slice,
    Ie = (function () {
      let n = function (e) {
          let t = this,
            a = 0
          for (a = 0; a < e.length; a++) t[a] = e[a]
          return (t.length = e.length), o(this)
        },
        o = function t(a, s) {
          let i = [],
            r = 0
          if (a && !s && a instanceof n) return a
          if (e(a)) return t(document).ready(a)
          if (a)
            if ('string' == typeof a) {
              var o, l, c
              if (
                ((a = c = a.trim()), c.indexOf('<') >= 0 && c.indexOf('>') >= 0)
              ) {
                var d = 'div'
                for (
                  0 === c.indexOf('<li') && (d = 'ul'),
                    0 === c.indexOf('<tr') && (d = 'tbody'),
                    (0 !== c.indexOf('<td') && 0 !== c.indexOf('<th')) ||
                      (d = 'tr'),
                    0 === c.indexOf('<tbody') && (d = 'table'),
                    0 === c.indexOf('<option') && (d = 'select'),
                    l = document.createElement(d),
                    l.innerHTML = c,
                    r = 0;
                  r < l.childNodes.length;
                  r++
                )
                  i.push(l.childNodes[r])
              } else
                for (
                  s || '#' !== a[0] || a.match(/[ .<>:~]/)
                    ? (s instanceof n && (s = s[0]),
                      (o = (s || document).querySelectorAll(a)))
                    : (o = [document.getElementById(a.split('#')[1])]),
                    r = 0;
                  r < o.length;
                  r++
                )
                  o[r] && i.push(o[r])
            } else if (a.nodeType || a === window || a === document) i.push(a)
            else if (a.length > 0 && a[0].nodeType)
              for (r = 0; r < a.length; r++) i.push(a[r])
            else t.isArray(a) && (i = a)
          return new n(i)
        }
      return (
        (n.prototype = {
          ready: function (e) {
            return (
              (
                document.attachEvent
                  ? 'complete' == document.readyState
                  : 'loading' != document.readyState
              )
                ? e(o)
                : document.addEventListener(
                    'DOMContentLoaded',
                    function () {
                      e(o)
                    },
                    !1
                  ),
              this
            )
          },
          concat: Ae.concat,
          empty: function () {
            return this.each(function () {
              this.innerHTML = ''
            })
          },
          map: function (e) {
            return o(
              o.map(this, function (t, a) {
                return e.call(t, a, t)
              })
            )
          },
          slice: function () {
            return o(Ee.apply(this, arguments))
          },
          addClass: function (e) {
            if ('undefined' == typeof e) return this
            for (var t = e.split(' '), a = 0; a < t.length; a++)
              for (var s = 0; s < this.length; s++)
                'undefined' != typeof this[s].classList &&
                  '' !== t[a] &&
                  this[s].classList.add(t[a])
            return this
          },
          removeClass: function (e) {
            if ('undefined' == typeof e) return this
            for (var t = e.split(' '), a = 0; a < t.length; a++)
              for (var s = 0; s < this.length; s++)
                'undefined' != typeof this[s].classList &&
                  '' !== t[a] &&
                  this[s].classList.remove(t[a])
            return this
          },
          hasClass: function (e) {
            return !!this[0] && this[0].classList.contains(e)
          },
          toggleClass: function (e) {
            for (var t = e.split(' '), a = 0; a < t.length; a++)
              for (var s = 0; s < this.length; s++)
                'undefined' != typeof this[s].classList &&
                  this[s].classList.toggle(t[a])
            return this
          },
          closest: function (e, a) {
            var s = this[0],
              n = !1
            for (
              t(e) && (n = o(e));
              s && !(n ? n.indexOf(s) >= 0 : o.matches(s, e));

            )
              s = s !== a && s.nodeType !== s.DOCUMENT_NODE && s.parentNode
            return o(s)
          },
          attr: function e(t, a) {
            var e
            if (1 !== arguments.length || 'string' != typeof t) {
              for (var s = 0; s < this.length; s++)
                if (2 === arguments.length) this[s].setAttribute(t, a)
                else
                  for (var n in t)
                    (this[s][n] = t[n]), this[s].setAttribute(n, t[n])
              return this
            }
            if (this.length)
              return (e = this[0].getAttribute(t)), e || '' === e ? e : void 0
          },
          removeAttr: function (e) {
            for (var t = 0; t < this.length; t++) this[t].removeAttribute(e)
            return this
          },
          prop: function (e, t) {
            if (
              ((e = Ve[e] || e), 1 === arguments.length && 'string' == typeof e)
            )
              return this[0] ? this[0][e] : void 0
            for (var a = 0; a < this.length; a++) this[a][e] = t
            return this
          },
          val: function (e) {
            if ('undefined' == typeof e)
              return this.length && this[0].multiple
                ? o.map(this.find('option:checked'), function (e) {
                    return e.value
                  })
                : this[0]
                ? this[0].value
                : void 0
            if (this.length && this[0].multiple)
              o.each(this[0].options, function () {
                this.selected = e.indexOf(this.value) != -1
              })
            else for (var t = 0; t < this.length; t++) this[t].value = e
            return this
          },
          on: function (t, a, s, n) {
            function i(e) {
              var t,
                n,
                i = e.target
              if (o(i).is(a)) s.call(i, e)
              else
                for (n = o(i).parents(), t = 0; t < n.length; t++)
                  o(n[t]).is(a) && s.call(n[t], e)
            }
            function r(e, t, a, s) {
              var n = t.split('.')
              e.DomNameSpaces || (e.DomNameSpaces = []),
                e.DomNameSpaces.push({
                  namespace: n[1],
                  event: n[0],
                  listener: a,
                  capture: s
                }),
                e.addEventListener(n[0], a, s)
            }
            var l,
              c,
              d = t.split(' ')
            for (l = 0; l < this.length; l++)
              if (e(a) || a === !1)
                for (e(a) && ((n = s || !1), (s = a)), c = 0; c < d.length; c++)
                  d[c].indexOf('.') != -1
                    ? r(this[l], d[c], s, n)
                    : this[l].addEventListener(d[c], s, n)
              else
                for (c = 0; c < d.length; c++)
                  this[l].DomLiveListeners || (this[l].DomLiveListeners = []),
                    this[l].DomLiveListeners.push({
                      listener: s,
                      liveListener: i
                    }),
                    d[c].indexOf('.') != -1
                      ? r(this[l], d[c], i, n)
                      : this[l].addEventListener(d[c], i, n)
            return this
          },
          off: function (t, a, s, n) {
            function i(e) {
              var t,
                a,
                s,
                n = e.split('.'),
                i = n[0],
                r = n[1]
              for (t = 0; t < d.length; ++t)
                if (d[t].DomNameSpaces) {
                  for (a = 0; a < d[t].DomNameSpaces.length; ++a)
                    (s = d[t].DomNameSpaces[a]),
                      s.namespace != r ||
                        (s.event != i && i) ||
                        (d[t].removeEventListener(
                          s.event,
                          s.listener,
                          s.capture
                        ),
                        (s.removed = !0))
                  for (a = d[t].DomNameSpaces.length - 1; a >= 0; --a)
                    d[t].DomNameSpaces[a].removed &&
                      d[t].DomNameSpaces.splice(a, 1)
                }
            }
            var r,
              o,
              l,
              c,
              d = this
            for (r = t.split(' '), o = 0; o < r.length; o++)
              for (l = 0; l < this.length; l++)
                if (e(a) || a === !1)
                  e(a) && ((n = s || !1), (s = a)),
                    0 === r[o].indexOf('.')
                      ? i(r[o].substr(1), s, n)
                      : this[l].removeEventListener(r[o], s, n)
                else {
                  if (this[l].DomLiveListeners)
                    for (c = 0; c < this[l].DomLiveListeners.length; c++)
                      this[l].DomLiveListeners[c].listener === s &&
                        this[l].removeEventListener(
                          r[o],
                          this[l].DomLiveListeners[c].liveListener,
                          n
                        )
                  this[l].DomNameSpaces &&
                    this[l].DomNameSpaces.length &&
                    r[o] &&
                    i(r[o])
                }
            return this
          },
          trigger: function (e, t) {
            for (var a = e.split(' '), s = 0; s < a.length; s++)
              for (var n = 0; n < this.length; n++) {
                var i
                try {
                  i = new CustomEvent(a[s], {
                    detail: t,
                    bubbles: !0,
                    cancelable: !0
                  })
                } catch (e) {
                  ;(i = document.createEvent('Event')),
                    i.initEvent(a[s], !0, !0),
                    (i.detail = t)
                }
                this[n].dispatchEvent(i)
              }
            return this
          },
          width: function (e) {
            return void 0 !== e
              ? this.css('width', e)
              : this[0] === window
              ? window.innerWidth
              : this[0] === document
              ? document.documentElement.scrollWidth
              : this.length > 0
              ? parseFloat(this.css('width'))
              : null
          },
          height: function (e) {
            if (void 0 !== e) return this.css('height', e)
            if (this[0] === window) return window.innerHeight
            if (this[0] === document) {
              var t = document.body,
                a = document.documentElement
              return Math.max(
                t.scrollHeight,
                t.offsetHeight,
                a.clientHeight,
                a.scrollHeight,
                a.offsetHeight
              )
            }
            return this.length > 0 ? parseFloat(this.css('height')) : null
          },
          innerWidth: function () {
            var e = this
            if (this.length > 0) {
              if (this[0].innerWidth) return this[0].innerWidth
              var t = this[0].offsetWidth,
                a = ['left', 'right']
              return (
                a.forEach(function (a) {
                  t -= parseInt(e.css(s('border-' + a + '-width')) || 0, 10)
                }),
                t
              )
            }
          },
          innerHeight: function () {
            var e = this
            if (this.length > 0) {
              if (this[0].innerHeight) return this[0].innerHeight
              var t = this[0].offsetHeight,
                a = ['top', 'bottom']
              return (
                a.forEach(function (a) {
                  t -= parseInt(e.css(s('border-' + a + '-width')) || 0, 10)
                }),
                t
              )
            }
          },
          offset: function () {
            if (this.length > 0) {
              var e = this[0],
                t = e.getBoundingClientRect(),
                a = document.documentElement
              return {
                top: t.top + window.pageYOffset - a.clientTop,
                left: t.left + window.pageXOffset - a.clientLeft
              }
            }
          },
          hide: function () {
            for (var e = 0; e < this.length; e++) this[e].style.display = 'none'
            return this
          },
          show: function () {
            for (var e = 0; e < this.length; e++)
              'none' == this[e].style.display && (this[e].style.display = ''),
                'none' ==
                  getComputedStyle(this[e], '').getPropertyValue('display') &&
                  (this[e].style.display = 'block')
            return this
          },
          clone: function () {
            return this.map(function () {
              return this.cloneNode(!0)
            })
          },
          styles: function () {
            return this[0] ? window.getComputedStyle(this[0], null) : void 0
          },
          css: function e(t, a) {
            var s,
              n,
              o = this[0],
              e = ''
            if (arguments.length < 2) {
              if (!o) return
              if ('string' == typeof t)
                return o.style[t] || getComputedStyle(o, '').getPropertyValue(t)
            }
            if ('string' == typeof t)
              a || 0 === a
                ? (e = i(t) + ':' + r(t, a))
                : this.each(function () {
                    this.style.removeProperty(i(t))
                  })
            else
              for (n in t)
                if (t[n] || 0 === t[n]) e += i(n) + ':' + r(n, t[n]) + ';'
                else
                  for (s = 0; s < this.length; s++)
                    this[s].style.removeProperty(i(n))
            return this.each(function () {
              this.style.cssText += ';' + e
            })
          },
          each: function (e) {
            for (
              var t = 0;
              t < this.length && e.apply(this[t], [t, this[t]]) !== !1;
              t++
            );
            return this
          },
          filter: function (t) {
            for (var a = [], s = 0; s < this.length; s++)
              e(t)
                ? t.call(this[s], s, this[s]) && a.push(this[s])
                : o.matches(this[s], t) && a.push(this[s])
            return new n(a)
          },
          html: function (e) {
            if ('undefined' == typeof e)
              return this[0] ? this[0].innerHTML : void 0
            this.empty()
            for (var t = 0; t < this.length; t++) this[t].innerHTML = e
            return this
          },
          text: function (e) {
            if ('undefined' == typeof e)
              return this[0] ? this[0].textContent.trim() : null
            for (var t = 0; t < this.length; t++) this[t].textContent = e
            return this
          },
          is: function (e) {
            return this.length > 0 && o.matches(this[0], e)
          },
          not: function (s) {
            var n = []
            if (e(s) && void 0 !== s.call)
              this.each(function (e) {
                s.call(this, e) || n.push(this)
              })
            else {
              var i =
                'string' == typeof s
                  ? this.filter(s)
                  : a(s) && e(s.item)
                  ? Ee.call(s)
                  : o(s)
              t(i) &&
                (i = o.map(i, function (e) {
                  return e
                })),
                this.each(function (e, t) {
                  i.indexOf(t) < 0 && n.push(t)
                })
            }
            return o(n)
          },
          indexOf: function (e) {
            for (var t = 0; t < this.length; t++) if (this[t] === e) return t
          },
          index: function (e) {
            return e
              ? this.indexOf(o(e)[0])
              : this.parent().children().indexOf(this[0])
          },
          get: function (e) {
            return void 0 === e
              ? Ee.call(this)
              : this[e >= 0 ? e : e + this.length]
          },
          eq: function (e) {
            if ('undefined' == typeof e) return this
            var t,
              a = this.length
            return e > a - 1
              ? new n([])
              : e < 0
              ? ((t = a + e), new n(t < 0 ? [] : [this[t]]))
              : new n([this[e]])
          },
          append: function (e) {
            var t, a
            for (t = 0; t < this.length; t++)
              if ('string' == typeof e) {
                var s = document.createElement('div')
                for (s.innerHTML = e; s.firstChild; )
                  this[t].appendChild(s.firstChild)
              } else if (e instanceof n)
                for (a = 0; a < e.length; a++) this[t].appendChild(e[a])
              else this[t].appendChild(e)
            return this
          },
          appendTo: function (e) {
            return o(e).append(this), this
          },
          prepend: function (e) {
            var t, a
            for (t = 0; t < this.length; t++)
              if ('string' == typeof e) {
                var s = document.createElement('div')
                for (s.innerHTML = e, a = s.childNodes.length - 1; a >= 0; a--)
                  this[t].insertBefore(s.childNodes[a], this[t].childNodes[0])
              } else if (e instanceof n)
                for (a = 0; a < e.length; a++)
                  this[t].insertBefore(e[a], this[t].childNodes[0])
              else this[t].insertBefore(e, this[t].childNodes[0])
            return this
          },
          prependTo: function (e) {
            return o(e).prepend(this), this
          },
          insertBefore: function (e) {
            for (var t = o(e), a = 0; a < this.length; a++)
              if (1 === t.length) t[0].parentNode.insertBefore(this[a], t[0])
              else if (t.length > 1)
                for (var s = 0; s < t.length; s++)
                  t[s].parentNode.insertBefore(this[a].cloneNode(!0), t[s])
            return this
          },
          insertAfter: function (e) {
            for (var t = o(e), a = 0; a < this.length; a++)
              if (1 === t.length)
                t[0].parentNode.insertBefore(this[a], t[0].nextSibling)
              else if (t.length > 1)
                for (var s = 0; s < t.length; s++)
                  t[s].parentNode.insertBefore(
                    this[a].cloneNode(!0),
                    t[s].nextSibling
                  )
            return this
          },
          next: function (e) {
            return new n(
              this.length > 0
                ? e
                  ? this[0].nextElementSibling &&
                    o(this[0].nextElementSibling).is(e)
                    ? [this[0].nextElementSibling]
                    : []
                  : this[0].nextElementSibling
                  ? [this[0].nextElementSibling]
                  : []
                : []
            )
          },
          nextAll: function (e) {
            var t = [],
              a = this[0]
            if (!a) return new n([])
            for (; a.nextElementSibling; ) {
              var s = a.nextElementSibling
              e ? o(s).is(e) && t.push(s) : t.push(s), (a = s)
            }
            return new n(t)
          },
          prev: function (e) {
            return new n(
              this.length > 0
                ? e
                  ? this[0].previousElementSibling &&
                    o(this[0].previousElementSibling).is(e)
                    ? [this[0].previousElementSibling]
                    : []
                  : this[0].previousElementSibling
                  ? [this[0].previousElementSibling]
                  : []
                : []
            )
          },
          prevAll: function (e) {
            var t = [],
              a = this[0]
            if (!a) return new n([])
            for (; a.previousElementSibling; ) {
              var s = a.previousElementSibling
              e ? o(s).is(e) && t.push(s) : t.push(s), (a = s)
            }
            return new n(t)
          },
          parent: function (e) {
            for (var t = [], a = 0; a < this.length; a++)
              null !== this[a].parentNode &&
                (e
                  ? o(this[a].parentNode).is(e) && t.push(this[a].parentNode)
                  : t.push(this[a].parentNode))
            return o(o.unique(t))
          },
          parents: function e(t) {
            for (var e = [], a = 0; a < this.length; a++)
              for (var s = this[a].parentNode; s; )
                t ? o(s).is(t) && e.push(s) : e.push(s), (s = s.parentNode)
            return o(o.unique(e))
          },
          find: function (e) {
            for (var t = [], a = 0; a < this.length; a++)
              for (
                var s = this[a].querySelectorAll(e), i = 0;
                i < s.length;
                i++
              )
                t.push(s[i])
            return new n(t)
          },
          children: function e(t) {
            for (var e = [], a = 0; a < this.length; a++)
              for (var s = this[a].childNodes, i = 0; i < s.length; i++)
                t
                  ? 1 === s[i].nodeType && o(s[i]).is(t) && e.push(s[i])
                  : 1 === s[i].nodeType && e.push(s[i])
            return new n(o.unique(e))
          },
          remove: function () {
            for (var e = 0; e < this.length; e++)
              this[e].parentNode && this[e].parentNode.removeChild(this[e])
            return this
          },
          add: function () {
            var e,
              t,
              a = this
            for (e = 0; e < arguments.length; e++) {
              var s = o(arguments[e])
              for (t = 0; t < s.length; t++) (a[a.length] = s[t]), a.length++
            }
            return a
          },
          before: function (e) {
            return o(e).insertBefore(this), this
          },
          after: function (e) {
            return o(e).insertAfter(this), this
          },
          scrollTop: function (e) {
            if (this.length) {
              var t = 'scrollTop' in this[0]
              return void 0 === e
                ? t
                  ? this[0].scrollTop
                  : this[0].pageYOffset
                : this.each(
                    t
                      ? function () {
                          this.scrollTop = e
                        }
                      : function () {
                          this.scrollTo(this.scrollX, e)
                        }
                  )
            }
          },
          scrollLeft: function (e) {
            if (this.length) {
              var t = 'scrollLeft' in this[0]
              return void 0 === e
                ? t
                  ? this[0].scrollLeft
                  : this[0].pageXOffset
                : this.each(
                    t
                      ? function () {
                          this.scrollLeft = e
                        }
                      : function () {
                          this.scrollTo(e, this.scrollY)
                        }
                  )
            }
          },
          contents: function () {
            return this.map(function (e, t) {
              return Ee.call(t.childNodes)
            })
          },
          nextUntil: function (e) {
            for (var t = this, a = []; t.length && !t.filter(e).length; )
              a.push(t[0]), (t = t.next())
            return o(a)
          },
          prevUntil: function (e) {
            for (var t = this, a = []; t.length && !o(t).filter(e).length; )
              a.push(t[0]), (t = t.prev())
            return o(a)
          },
          detach: function () {
            return this.remove()
          }
        }),
        (o.fn = n.prototype),
        o
      )
    })(),
    Le = Ie
  ;(ye.$ = Ie),
    (Le.inArray = function (e, t, a) {
      return Ae.indexOf.call(t, e, a)
    }),
    (Le.extend = function (e) {
      var t,
        a = Ee.call(arguments, 1)
      return (
        'boolean' == typeof e && ((t = e), (e = a.shift())),
        (e = e || {}),
        a.forEach(function (a) {
          n(e, a, t)
        }),
        e
      )
    }),
    (Le.isFunction = e),
    (Le.isArray = function (e) {
      return '[object Array]' === Object.prototype.toString.apply(e)
    }),
    (Le.isPlainObject = function (e) {
      return (
        t(e) &&
        null !== e &&
        e !== e.window &&
        Object.getPrototypeOf(e) == Object.prototype
      )
    }),
    (Le.each = function (e, a) {
      var s, n
      if (t(e) && a) {
        if (Le.isArray(e) || e instanceof Ie)
          for (s = 0; s < e.length && a.call(e[s], s, e[s]) !== !1; s++);
        else
          for (n in e)
            if (
              e.hasOwnProperty(n) &&
              'length' !== n &&
              a.call(e[n], n, e[n]) === !1
            )
              break
        return this
      }
    }),
    (Le.unique = function (e) {
      for (var t = [], a = 0; a < e.length; a++)
        t.indexOf(e[a]) === -1 && t.push(e[a])
      return t
    }),
    (Le.map = function (e, t) {
      var s,
        n,
        i,
        r = []
      if (a(e))
        for (n = 0; n < e.length; n++) (s = t(e[n], n)), null !== s && r.push(s)
      else for (i in e) (s = t(e[i], i)), null !== s && r.push(s)
      return r.length > 0 ? Le.fn.concat.apply([], r) : r
    }),
    (Le.matches = function (e, t) {
      if (!t || !e || 1 !== e.nodeType) return !1
      var a =
        e.matchesSelector ||
        e.webkitMatchesSelector ||
        e.mozMatchesSelector ||
        e.msMatchesSelector
      return a.call(e, t)
    })
  let Oe,
    Pe,
    Ye,
    He,
    Ne = [],
    Fe = 'undefined' != typeof window,
    $e = Fe ? navigator.userAgent : '',
    We = $e.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i),
    Re =
      (Fe && window.requestAnimationFrame) ||
      function (e) {
        e()
      },
    qe = (Fe && window.cancelAnimationFrame) || function () {}
  ;/Android/i.test(We)
    ? ((Oe = 'android'),
      (Pe = $e.match(/Android\s+([\d\.]+)/i)),
      Pe && (Ne = Pe[0].replace('Android ', '').split('.')))
    : /iPhone|iPad|iPod/i.test(We)
    ? ((Oe = 'ios'),
      (Pe = $e.match(/OS\s+([\d\_]+)/i)),
      Pe && (Ne = Pe[0].replace(/_/g, '.').replace('OS ', '').split('.')))
    : /Windows Phone/i.test(We)
    ? (Oe = 'wp')
    : /Windows|MSIE/i.test(We) && (Oe = 'windows'),
    (Ye = Ne[0]),
    (He = Ne[1])
  let je = 0
  Fe &&
    (['mouseover', 'mousedown', 'mouseup', 'click'].forEach(function (e) {
      document.addEventListener(e, C, !0)
    }),
    'android' == Oe &&
      Ye < 5 &&
      document.addEventListener(
        'change',
        function (e) {
          je &&
            'checkbox' == e.target.type &&
            !e.target.mbscChange &&
            (e.stopPropagation(), e.preventDefault()),
            delete e.target.mbscChange
        },
        !0
      ))
  let ze,
    Be = ye.$,
    Ue = +new Date(),
    Xe = {},
    Ke = {},
    Ge = Be.extend
  Ge(_e, { getCoord: x, preventClick: y, vibrate: v }),
    (ze = Ge(ye, {
      $: Be,
      version: '4.2.4',
      autoTheme: 'mobiscroll',
      themes: {
        form: {},
        page: {},
        frame: {},
        scroller: {},
        listview: {},
        navigation: {},
        progress: {},
        card: {}
      },
      platform: { name: Oe, majorVersion: Ye, minorVersion: He },
      i18n: {},
      instances: Xe,
      classes: Ke,
      util: _e,
      settings: {},
      setDefaults: function (e) {
        Ge(this.settings, e)
      },
      customTheme: function (e, t) {
        var a,
          s = ye.themes,
          n = [
            'frame',
            'scroller',
            'listview',
            'navigation',
            'form',
            'page',
            'progress',
            'card'
          ]
        for (a = 0; a < n.length; a++)
          s[n[a]][e] = Ge({}, s[n[a]][t], { baseTheme: t })
      }
    }))
  let Ze = function (e, t) {
      function a() {
        Be(e).addClass('mbsc-comp'),
          e.id ? Xe[e.id] && Xe[e.id].destroy() : (e.id = 'mobiscroll' + ++Ue),
          (Xe[e.id] = u),
          (u.__ready = !0)
      }
      let s,
        n,
        i,
        r,
        o,
        c,
        d,
        u = this
      ;(u.settings = {}),
        (u._init = l),
        (u._destroy = l),
        (u._processSettings = l),
        (u.init = function (a) {
          var l
          for (l in u.settings) delete u.settings[l]
          ;(i = u.settings),
            Ge(t, a),
            u._hasDef && (d = ze.settings),
            Ge(i, u._defaults, d, t),
            u._hasTheme &&
              ((o = i.theme),
              ('auto' != o && o) || (o = ze.autoTheme),
              'default' == o && (o = 'mobiscroll'),
              (t.theme = o),
              (r = ze.themes[u._class] ? ze.themes[u._class][o] : {})),
            u._hasLang && (s = ze.i18n[i.lang]),
            Ge(i, r, s, d, t),
            u._processSettings(),
            u._presets &&
              ((n = u._presets[i.preset]),
              n && ((n = n.call(e, u, t)), Ge(i, n, t))),
            u._init(a),
            c('onInit')
        }),
        (u.destroy = function () {
          u && (u._destroy(), c('onDestroy'), delete Xe[e.id], (u = null))
        }),
        (u.tap = function (e, t, a, s, n) {
          w(u, e, t, a, s, n)
        }),
        (u.trigger = function (a, s) {
          var i,
            o,
            l,
            c = [d, r, n, t]
          for (o = 0; o < 4; o++)
            (l = c[o]), l && l[a] && (i = l[a].call(e, s || {}, u))
          return i
        }),
        (u.option = function (e, a) {
          var s = {},
            n = [
              'data',
              'invalid',
              'valid',
              'marked',
              'labels',
              'colors',
              'readonly'
            ]
          'object' === ('undefined' == typeof e ? 'undefined' : xe(e))
            ? (s = e)
            : (s[e] = a),
            n.forEach(function (e) {
              t[e] = i[e]
            }),
            u.init(s)
        }),
        (u.getInst = function () {
          return u
        }),
        (t = t || {}),
        (c = u.trigger),
        u.__ready || a()
    },
    Je = 0
  _e.getJson = D
  let Qe,
    et,
    tt,
    at,
    st,
    nt = {}
  Fe &&
    ((et = document.createElement('modernizr').style),
    (tt = V()),
    (st = tt.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz')),
    (Qe = void 0 !== et.animation ? 'animationend' : 'webkitAnimationEnd'),
    (at = void 0 !== et.touchAction))
  let it,
    rt,
    ot = ye.themes,
    lt = /(iphone|ipod)/i.test($e) && Ye >= 7,
    ct = 'android' == Oe,
    dt = 'ios' == Oe,
    ut = dt && 8 == Ye,
    mt = dt && Ye > 7,
    ht = function (e) {
      e.preventDefault()
    },
    ft = function (e, t, a) {
      function s(e) {
        A && A.removeClass('mbsc-active'),
          (A = Be(this)),
          A.hasClass('mbsc-disabled') ||
            A.hasClass('mbsc-fr-btn-nhl') ||
            A.addClass('mbsc-active'),
          'mousedown' === e.type
            ? Be(document).on('mouseup', n)
            : 'pointerdown' === e.type && Be(document).on('pointerup', n)
      }
      function n(e) {
        A && (A.removeClass('mbsc-active'), (A = null)),
          'mouseup' === e.type
            ? Be(document).off('mouseup', n)
            : 'pointerup' === e.type && Be(document).off('pointerup', n)
      }
      function i(e) {
        13 == e.keyCode ? ee.select() : 27 == e.keyCode && ee.cancel()
      }
      function r(e) {
        e || ct || ee._activeElm.focus()
      }
      function o(e) {
        let t = it,
          a = B.focusOnClose
        ee._markupRemove(),
          C.remove(),
          O &&
            (E.mbscModals--,
            B.scrollLock && E.mbscLock--,
            E.mbscLock || w.removeClass('mbsc-fr-lock'),
            E.mbscModals ||
              (w.removeClass('mbsc-fr-lock-ios mbsc-fr-lock-ctx'),
              $ &&
                (g.css({ top: '', left: '' }), D.scrollLeft(U), D.scrollTop(K)),
              e ||
                (t || (t = te),
                setTimeout(function () {
                  void 0 === a || a === !0
                    ? ((rt = !0), t[0].focus())
                    : a && Be(a)[0].focus()
                }, 200)))),
          (P = !1),
          Z('onHide')
      }
      function c(e) {
        clearTimeout(q),
          (q = setTimeout(function () {
            ee.position(!0),
              'orientationchange' == e.type &&
                ((R.style.display = 'none'),
                R.offsetHeight,
                (R.style.display = ''))
          }, 200))
      }
      function d(e) {
        e.target.nodeType &&
          !W.contains(e.target) &&
          se - new Date() > 100 &&
          (W.focus(), (se = new Date()))
      }
      function u(e, t) {
        function a() {
          C.off(Qe, a)
            .removeClass('mbsc-anim-in mbsc-anim-trans mbsc-anim-trans-' + I)
            .find('.mbsc-fr-popup')
            .removeClass('mbsc-anim-' + I),
            r(t)
        }
        if (O) C.appendTo(g)
        else if (te.is('div') && !ee._hasContent) te.empty().append(C)
        else if (te.hasClass('mbsc-control')) {
          let i = te.closest('.mbsc-control-w')
          C.insertAfter(i),
            i.hasClass('mbsc-select') && i.addClass('mbsc-select-inline')
        } else C.insertAfter(te)
        ;(P = !0),
          ee._markupInserted(C),
          Z('onMarkupInserted', { target: Y }),
          C.on('selectstart mousedown', ht)
            .on('click', '.mbsc-fr-btn-e', ht)
            .on('touchstart mousedown', function (e) {
              B.stopProp && e.stopPropagation()
            })
            .on('keydown', '.mbsc-fr-btn-e', function (e) {
              32 == e.keyCode &&
                (e.preventDefault(), e.stopPropagation(), this.click())
            })
            .on('keydown', function (e) {
              if (32 == e.keyCode) e.preventDefault()
              else if (9 == e.keyCode && O && B.focusTrap) {
                var t = C.find('[tabindex="0"]').filter(function () {
                    return this.offsetWidth > 0 || this.offsetHeight > 0
                  }),
                  a = t.index(Be(':focus', C)),
                  s = t.length - 1,
                  n = 0
                e.shiftKey && ((s = 0), (n = -1)),
                  a === s && (t.eq(n)[0].focus(), e.preventDefault())
              }
            })
            .on('touchstart mousedown pointerdown', '.mbsc-fr-btn-e', s)
            .on('touchend', '.mbsc-fr-btn-e', n),
          Be('input,select,textarea', C)
            .on('selectstart mousedown', function (e) {
              e.stopPropagation()
            })
            .on('keydown', function (e) {
              32 == e.keyCode && e.stopPropagation()
            }),
          Y.addEventListener(
            'touchstart',
            function () {
              G ||
                ((G = !0),
                g.find('.mbsc-no-touch').removeClass('mbsc-no-touch'))
            },
            !0
          ),
          Be.each(V, function (e, t) {
            ee.tap(
              Be('.mbsc-fr-btn' + e, C),
              function (e) {
                ;(t = m(t) ? ee.buttons[t] : t),
                  (m(t.handler) ? ee.handlers[t.handler] : t.handler).call(
                    this,
                    e,
                    ee
                  )
              },
              !0
            )
          }),
          ee._attachEvents(C),
          ee.position(),
          D.on(j, c),
          O &&
            (I && !e
              ? C.addClass('mbsc-anim-in mbsc-anim-trans mbsc-anim-trans-' + I)
                  .on(Qe, a)
                  .find('.mbsc-fr-popup')
                  .addClass('mbsc-anim-' + I)
              : r(t)),
          Z('onShow', { target: Y, valueText: ee._tempValue })
      }
      function f(e, t) {
        e && e(), ee.show() !== !1 && (it = t)
      }
      function p() {
        ee._fillValue(), Z('onSet', { valueText: ee._value })
      }
      function v() {
        Z('onCancel', { valueText: ee._value })
      }
      function b() {
        ee.setVal(null, !0)
      }
      let g,
        _,
        w,
        C,
        T,
        M,
        k,
        D,
        S,
        V,
        A,
        E,
        I,
        L,
        O,
        P,
        Y,
        H,
        N,
        F,
        $,
        W,
        R,
        q,
        j,
        z,
        B,
        U,
        X,
        K,
        G,
        Z,
        J,
        Q,
        ee = this,
        te = Be(e),
        ae = [],
        se = new Date()
      Ze.call(this, e, t, !0),
        (ee.position = function (e) {
          var t,
            a,
            s,
            n,
            i,
            r,
            o,
            l,
            c,
            d,
            u,
            m,
            f,
            p,
            v,
            b,
            y,
            _ = {},
            x = 0,
            w = 0,
            T = 0,
            V = 0
          !z &&
            P &&
            (ee._position(C),
            (f = Y.offsetHeight),
            (p = Y.offsetWidth),
            (J === p && Q === f && e) ||
              (ee._isFullScreen || /top|bottom/.test(B.display)
                ? k.width(p)
                : O && S.addClass('mbsc-fr-pos').width(''),
              Be('.mbsc-comp', C).each(function () {
                var e = Xe[this.id]
                e && e !== ee && e.position && e.position()
              }),
              !ee._isFullScreen &&
                /center|bubble/.test(B.display) &&
                (Be('.mbsc-w-p', C).each(function () {
                  ;(v = this.getBoundingClientRect().width),
                    (V += v),
                    (T = v > T ? v : T)
                }),
                (m = V > p - 16 || B.tabs === !0),
                S.removeClass('mbsc-fr-pos').css({
                  'width': ee._isLiquid
                    ? Math.min(B.maxPopupWidth, p - 16)
                    : Math.ceil(m ? T : V),
                  'white-space': m ? '' : 'nowrap'
                })),
              Z('onPosition', {
                target: Y,
                popup: R,
                hasTabs: m,
                windowWidth: p,
                windowHeight: f
              }) !== !1 &&
                O &&
                ((H = R.offsetWidth),
                (N = R.offsetHeight),
                (X = N <= f && H <= p),
                F && ((x = D.scrollLeft()), (w = D.scrollTop())),
                'center' == B.display
                  ? ((y = Math.max(0, x + (p - H) / 2)),
                    (b = Math.max(0, w + (f - N) / 2)))
                  : 'bubble' == B.display
                  ? ((t = void 0 === B.anchor ? te : Be(B.anchor)),
                    (o = Be('.mbsc-fr-arr-i', C)[0]),
                    (n = t.offset()),
                    (i = n.top + (L ? w - g.offset().top : 0)),
                    (r = n.left + (L ? x - g.offset().left : 0)),
                    (a = t[0].offsetWidth),
                    (s = t[0].offsetHeight),
                    (l = o.offsetWidth),
                    (c = o.offsetHeight),
                    (y = h(r - (H - a) / 2, x + 3, x + p - H - 3)),
                    (b = i - N - c / 2),
                    b < w || i > w + f
                      ? (k
                          .removeClass('mbsc-fr-bubble-top')
                          .addClass('mbsc-fr-bubble-bottom'),
                        (b = i + s + c / 2))
                      : k
                          .removeClass('mbsc-fr-bubble-bottom')
                          .addClass('mbsc-fr-bubble-top'),
                    Be('.mbsc-fr-arr', C).css({
                      left: h(r + a / 2 - (y + (H - l) / 2), 0, l)
                    }),
                    (X = b > w && y > x && b + N <= w + f && y + H <= x + p))
                  : ((y = x),
                    (b = 'top' == B.display ? w : Math.max(0, w + f - N))),
                F &&
                  ((d = Math.max(
                    b + N,
                    L ? E.scrollHeight : Be(document).height()
                  )),
                  (u = Math.max(
                    y + H,
                    L ? E.scrollWidth : Be(document).width()
                  )),
                  M.css({ width: u, height: d }),
                  B.scroll &&
                    'bubble' == B.display &&
                    (b + N + 8 > w + f || i > w + f || i + s < w) &&
                    ((z = !0),
                    setTimeout(function () {
                      z = !1
                    }, 300),
                    D.scrollTop(Math.min(i, b + N - f + 8, d - f)))),
                (_.top = Math.floor(b)),
                (_.left = Math.floor(y)),
                k.css(_),
                (J = p),
                (Q = f))))
        }),
        (ee.attachShow = function (e, t) {
          var a,
            s = Be(e),
            n = s.prop('readonly')
          if ('inline' !== B.display) {
            if (
              ((B.showOnFocus || B.showOnTap) &&
                s.is('input,select') &&
                (s
                  .prop('readonly', !0)
                  .on('mousedown.mbsc', function (e) {
                    e.preventDefault()
                  })
                  .on('focus.mbsc', function () {
                    ee._isVisible && this.blur()
                  }),
                (a = Be('label[for="' + s.attr('id') + '"]')),
                a.length || (a = s.closest('label'))),
              s.is('select'))
            )
              return
            B.showOnFocus &&
              s.on('focus.mbsc', function () {
                rt ? (rt = !1) : f(t, s)
              }),
              B.showOnTap &&
                (s.on('keydown.mbsc', function (e) {
                  ;(32 != e.keyCode && 13 != e.keyCode) ||
                    (e.preventDefault(), e.stopPropagation(), f(t, s))
                }),
                ee.tap(s, function (e) {
                  e.isMbscTap && (G = !0), f(t, s)
                }),
                a &&
                  a.length &&
                  ee.tap(a, function () {
                    f(t, s)
                  })),
              ae.push({ readOnly: n, el: s, lbl: a })
          }
        }),
        (ee.select = function () {
          O ? ee.hide(!1, 'set', !1, p) : p()
        }),
        (ee.cancel = function () {
          O ? ee.hide(!1, 'cancel', !1, v) : v()
        }),
        (ee.clear = function () {
          ee._clearValue(),
            Z('onClear'),
            O && ee._isVisible && !ee.live ? ee.hide(!1, 'clear', !1, b) : b()
        }),
        (ee.enable = function () {
          ;(B.disabled = !1), ee._isInput && te.prop('disabled', !1)
        }),
        (ee.disable = function () {
          ;(B.disabled = !0), ee._isInput && te.prop('disabled', !0)
        }),
        (ee.show = function (e, t) {
          var a, s
          if (!B.disabled && !ee._isVisible) {
            if ((ee._readValue(), Z('onBeforeShow') === !1)) return !1
            if (
              ((it = null),
              (I = B.animate),
              (V = B.buttons || []),
              (F = L || 'bubble' == B.display),
              ($ = lt && !F && B.scrollLock),
              (a = V.length > 0),
              I !== !1 &&
                ('top' == B.display
                  ? (I = I || 'slidedown')
                  : 'bottom' == B.display
                  ? (I = I || 'slideup')
                  : ('center' != B.display && 'bubble' != B.display) ||
                    (I = I || 'pop')),
              O &&
                ((K = Math.max(0, D.scrollTop())),
                (U = Math.max(0, D.scrollLeft())),
                (J = 0),
                (Q = 0),
                $ &&
                  !w.hasClass('mbsc-fr-lock-ios') &&
                  g.css({ top: -K + 'px', left: -U + 'px' }),
                w.addClass(
                  (B.scrollLock ? 'mbsc-fr-lock' : '') +
                    ($ ? ' mbsc-fr-lock-ios' : '') +
                    (L ? ' mbsc-fr-lock-ctx' : '')
                ),
                Be(document.activeElement).is('input,textarea') &&
                  document.activeElement.blur(),
                ye.activeInstance && ye.activeInstance.hide(),
                (ye.activeInstance = ee),
                (E.mbscModals = E.mbscModals || 0),
                (E.mbscLock = E.mbscLock || 0),
                E.mbscModals++,
                B.scrollLock && E.mbscLock++),
              (s =
                '<div lang="' +
                B.lang +
                '" class="mbsc-fr mbsc-' +
                B.theme +
                (B.baseTheme ? ' mbsc-' + B.baseTheme : '') +
                ' mbsc-fr-' +
                B.display +
                ' ' +
                (B.cssClass || '') +
                ' ' +
                (B.compClass || '') +
                (ee._isLiquid ? ' mbsc-fr-liq' : '') +
                (mt ? ' mbsc-fr-hb' : '') +
                (G ? '' : ' mbsc-no-touch') +
                ($ ? ' mbsc-platform-ios' : '') +
                (a
                  ? V.length >= 3
                    ? ' mbsc-fr-btn-block '
                    : ''
                  : ' mbsc-fr-nobtn') +
                '">' +
                (O
                  ? '<div class="mbsc-fr-persp"><div class="mbsc-fr-overlay"></div><div role="dialog" tabindex="-1" class="mbsc-fr-scroll">'
                  : '') +
                '<div class="mbsc-fr-popup' +
                (B.rtl ? ' mbsc-rtl' : ' mbsc-ltr') +
                (B.headerText ? ' mbsc-fr-has-hdr' : '') +
                '">' +
                ('bubble' === B.display
                  ? '<div class="mbsc-fr-arr-w"><div class="mbsc-fr-arr-i"><div class="mbsc-fr-arr"></div></div></div>'
                  : '') +
                '<div class="mbsc-fr-w">' +
                (B.headerText
                  ? '<div class="mbsc-fr-hdr">' +
                    (m(B.headerText) ? B.headerText : '') +
                    '</div>'
                  : '') +
                '<div class="mbsc-fr-c">'),
              (s += ee._generateContent()),
              (s += '</div>'),
              a)
            ) {
              var n,
                r,
                o,
                l = V.length
              for (
                s += '<div class="mbsc-fr-btn-cont">', r = 0;
                r < V.length;
                r++
              )
                (o = B.btnReverse ? l - r - 1 : r),
                  (n = V[o]),
                  (n = m(n) ? ee.buttons[n] : n),
                  'set' === n.handler && (n.parentClass = 'mbsc-fr-btn-s'),
                  'cancel' === n.handler && (n.parentClass = 'mbsc-fr-btn-c'),
                  (s +=
                    '<div' +
                    (B.btnWidth
                      ? ' style="width:' + 100 / V.length + '%"'
                      : '') +
                    ' class="mbsc-fr-btn-w ' +
                    (n.parentClass || '') +
                    '"><div tabindex="0" role="button" class="mbsc-fr-btn' +
                    o +
                    ' mbsc-fr-btn-e ' +
                    (void 0 === n.cssClass ? B.btnClass : n.cssClass) +
                    (n.icon ? ' mbsc-ic mbsc-ic-' + n.icon : '') +
                    '">' +
                    (n.text || '') +
                    '</div></div>')
              s += '</div>'
            }
            if (
              ((s += '</div></div></div></div>' + (O ? '</div></div>' : '')),
              (C = Be(s)),
              (M = Be('.mbsc-fr-persp', C)),
              (T = Be('.mbsc-fr-scroll', C)),
              (S = Be('.mbsc-fr-w', C)),
              (k = Be('.mbsc-fr-popup', C)),
              (_ = Be('.mbsc-fr-hdr', C)),
              (Y = C[0]),
              (W = T[0]),
              (R = k[0]),
              (ee._activeElm = W),
              (ee._markup = C),
              (ee._isVisible = !0),
              (j = 'orientationchange resize'),
              ee._markupReady(C),
              Z('onMarkupReady', { target: Y }),
              O &&
                (Be(window).on('keydown', i),
                B.scrollLock &&
                  C.on('touchmove mousewheel wheel', function (e) {
                    X && e.preventDefault()
                  }),
                B.focusTrap && D.on('focusin', d),
                B.closeOnOverlayTap))
            ) {
              var c, h, f, p
              T.on('touchstart mousedown', function (e) {
                h ||
                  e.target != W ||
                  ((h = !0), (c = !1), (f = x(e, 'X')), (p = x(e, 'Y')))
              })
                .on('touchmove mousemove', function (e) {
                  h &&
                    !c &&
                    (Math.abs(x(e, 'X') - f) > 9 ||
                      Math.abs(x(e, 'Y') - p) > 9) &&
                    (c = !0)
                })
                .on('touchcancel', function () {
                  h = !1
                })
                .on('touchend click', function (e) {
                  h && !c && (ee.cancel(), 'touchend' == e.type && y()),
                    (h = !1)
                })
            }
            O && $
              ? setTimeout(function () {
                  u(e, t)
                }, 100)
              : u(e, t)
          }
        }),
        (ee.hide = function (e, t, a, s) {
          function n() {
            C.off(Qe, n), o(e)
          }
          return (
            !(
              !ee._isVisible ||
              (!a && !ee._isValid && 'set' == t) ||
              (!a &&
                Z('onBeforeClose', { valueText: ee._tempValue, button: t }) ===
                  !1)
            ) &&
            ((ee._isVisible = !1),
            O &&
              (Be(document.activeElement).is('input,textarea') &&
                R.contains(document.activeElement) &&
                document.activeElement.blur(),
              ye.activeInstance == ee && delete ye.activeInstance,
              Be(window).off('keydown', i)),
            C &&
              (O && I && !e
                ? C.addClass(
                    'mbsc-anim-out mbsc-anim-trans mbsc-anim-trans-' + I
                  )
                    .on(Qe, n)
                    .find('.mbsc-fr-popup')
                    .addClass('mbsc-anim-' + I)
                : o(e),
              ee._detachEvents(C),
              D.off(j, c).off('focusin', d)),
            s && s(),
            te.trigger('blur'),
            void Z('onClose', { valueText: ee._value }))
          )
        }),
        (ee.isVisible = function () {
          return ee._isVisible
        }),
        (ee.setVal = l),
        (ee.getVal = l),
        (ee._generateContent = l),
        (ee._attachEvents = l),
        (ee._detachEvents = l),
        (ee._readValue = l),
        (ee._clearValue = l),
        (ee._fillValue = l),
        (ee._markupReady = l),
        (ee._markupInserted = l),
        (ee._markupRemove = l),
        (ee._position = l),
        (ee.__processSettings = l),
        (ee.__init = l),
        (ee.__destroy = l),
        (ee._destroy = function () {
          ee.hide(!0, !1, !0),
            te.off('.mbsc'),
            Be.each(ae, function (e, t) {
              t.el.off('.mbsc').prop('readonly', t.readOnly),
                t.lbl && t.lbl.off('.mbsc')
            }),
            ee.__destroy()
        }),
        (ee._updateHeader = function () {
          var t = B.headerText,
            a = t
              ? 'function' == typeof t
                ? t.call(e, ee._tempValue)
                : t.replace(/\{value\}/i, ee._tempValue)
              : ''
          _.html(a || '&nbsp;')
        }),
        (ee._processSettings = function () {
          var e, t
          for (
            ee.__processSettings(),
              B.buttons =
                B.buttons || ('inline' !== B.display ? ['cancel', 'set'] : []),
              B.headerText =
                void 0 === B.headerText
                  ? 'inline' !== B.display && '{value}'
                  : B.headerText,
              V = B.buttons || [],
              O = 'inline' !== B.display,
              L = 'body' != B.context,
              g = Be(B.context),
              w = L ? g : Be('body,html'),
              E = g[0],
              ee._$window = D = Be(L ? B.context : window),
              ee.live = !0,
              t = 0;
            t < V.length;
            t++
          )
            (e = V[t]),
              ('ok' != e && 'set' != e && 'set' != e.handler) || (ee.live = !1)
          ;(ee.buttons.set = {
            text: B.setText,
            icon: B.setIcon,
            handler: 'set'
          }),
            (ee.buttons.cancel = {
              text: B.cancelText,
              icon: B.cancelIcon,
              handler: 'cancel'
            }),
            (ee.buttons.close = {
              text: B.closeText,
              icon: B.closeIcon,
              handler: 'cancel'
            }),
            (ee.buttons.clear = {
              text: B.clearText,
              icon: B.clearIcon,
              handler: 'clear'
            }),
            (ee._isInput = te.is('input'))
        }),
        (ee._init = function () {
          ee._isVisible && ee.hide(!0, !1, !0),
            te.off('.mbsc'),
            ee.__init(),
            (ee._isLiquid = 'liquid' == B.layout),
            O
              ? (ee._readValue(), ee._hasContent || ee.attachShow(te))
              : ee.show(),
            te
              .removeClass('mbsc-cloak')
              .filter('input, select, textarea')
              .on('change.mbsc', function () {
                ee._preventChange || ee.setVal(te.val(), !0, !1),
                  (ee._preventChange = !1)
              })
        }),
        (ee.buttons = {}),
        (ee.handlers = { set: ee.select, cancel: ee.cancel, clear: ee.clear }),
        (ee._value = null),
        (ee._isValid = !0),
        (ee._isVisible = !1),
        (B = ee.settings),
        (Z = ee.trigger),
        a || ee.init(t)
    }
  ;(ft.prototype._defaults = {
    lang: 'en',
    setText: 'Set',
    selectedText: '{count} selected',
    closeText: 'Close',
    cancelText: 'Cancel',
    clearText: 'Clear',
    context: 'body',
    maxPopupWidth: 600,
    disabled: !1,
    closeOnOverlayTap: !0,
    showOnFocus: ct || dt,
    showOnTap: !0,
    display: 'center',
    scroll: !0,
    scrollLock: !0,
    tap: !0,
    btnClass: 'mbsc-fr-btn',
    btnWidth: !0,
    focusTrap: !0,
    focusOnClose: !ut
  }),
    (Ke.Frame = ft),
    (ot.frame.mobiscroll = { headerText: !1, btnWidth: !1 }),
    (ot.scroller.mobiscroll = Ge({}, ot.frame.mobiscroll, {
      rows: 5,
      showLabel: !1,
      selectedLineBorder: 1,
      weekDays: 'min',
      checkIcon: 'ion-ios7-checkmark-empty',
      btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5',
      btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5',
      btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5',
      btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5'
    })),
    Fe &&
      Be(window).on('focus', function () {
        it && (rt = !0)
      }) /* eslint-disable no-unused-vars */
  let pt = 'ios' == Oe,
    vt = function (e, t, a) {
      function s(e) {
        G('onStart', { domEvent: e }),
          ae.stopProp && e.stopPropagation(),
          ae.prevDef && e.preventDefault(),
          ae.readonly ||
            (ae.lock && L) ||
            (A(e, this) &&
              !I &&
              (d && d.removeClass('mbsc-active'),
              (k = !1),
              L ||
                ((d = Be(e.target).closest('.mbsc-btn-e', this)),
                d.length &&
                  !d.hasClass('mbsc-disabled') &&
                  ((k = !0),
                  (f = setTimeout(function () {
                    d.addClass('mbsc-active')
                  }, 100)))),
              (I = !0),
              (H = !1),
              (O = !1),
              (Q.scrolled = L),
              (j = x(e, 'X')),
              (z = x(e, 'Y')),
              (C = j),
              (v = 0),
              (b = 0),
              (g = 0),
              (q = new Date()),
              (R = +E(U, Z) || 0),
              L && c(R, pt ? 0 : 1),
              'mousedown' === e.type &&
                Be(document).on('mousemove', n).on('mouseup', r)))
      }
      function n(e) {
        I &&
          (ae.stopProp && e.stopPropagation(),
          (C = x(e, 'X')),
          (T = x(e, 'Y')),
          (v = C - j),
          (b = T - z),
          (g = Z ? b : v),
          k &&
            (Math.abs(b) > ae.thresholdY || Math.abs(v) > ae.thresholdX) &&
            (clearTimeout(f), d.removeClass('mbsc-active'), (k = !1)),
          (Q.scrolled || (!O && Math.abs(g) > K)) &&
            (H || G('onGestureStart', M),
            (Q.scrolled = H = !0),
            Y || ((Y = !0), (P = Re(i)))),
          Z || ae.scrollLock
            ? e.preventDefault()
            : Q.scrolled
            ? e.preventDefault()
            : Math.abs(b) > 7 &&
              ((O = !0), (Q.scrolled = !0), se.trigger('touchend')))
      }
      function i() {
        S && (g = h(g, -$ * S, $ * S)), c(h(R + g, V - w, D + w)), (Y = !1)
      }
      function r(e) {
        if (I) {
          let t,
            a = new Date() - q
          ae.stopProp && e.stopPropagation(),
            qe(P),
            (Y = !1),
            !O &&
              Q.scrolled &&
              (ae.momentum &&
                a < 300 &&
                ((t = g / a),
                (g =
                  Math.max(Math.abs(g), (t * t) / ae.speedUnit) *
                  (g < 0 ? -1 : 1))),
              l(g)),
            k &&
              (clearTimeout(f),
              d.addClass('mbsc-active'),
              setTimeout(function () {
                d.removeClass('mbsc-active')
              }, 100),
              O || Q.scrolled || G('onBtnTap', { target: d[0], domEvent: e })),
            'mouseup' == e.type &&
              Be(document).off('mousemove', n).off('mouseup', r),
            (I = !1)
        }
      }
      function o(e) {
        if (
          ((e = e.originalEvent || e),
          (g = Z ? e.deltaY || e.wheelDelta || e.detail : e.deltaX),
          G('onStart', { domEvent: e }),
          ae.stopProp && e.stopPropagation(),
          g)
        ) {
          if (
            (e.preventDefault(),
            e.deltaMode && 1 == e.deltaMode && (g *= 5),
            (g = h(-g, -20, 20)),
            (R = J),
            ae.readonly || R + g < V || R + g > D)
          )
            return
          H ||
            ((M = {
              posX: Z ? 0 : J,
              posY: Z ? J : 0,
              originX: Z ? 0 : R,
              originY: Z ? R : 0,
              direction: g > 0 ? (Z ? 270 : 360) : Z ? 90 : 180
            }),
            G('onGestureStart', M)),
            Y || ((Y = !0), (P = Re(i))),
            (H = !0),
            clearTimeout(N),
            (N = setTimeout(function () {
              qe(P), (Y = !1), (H = !1), l(g)
            }, 200))
        }
      }
      function l(e) {
        let t, a, s
        if (
          (S && (e = h(e, -$ * S, $ * S)),
          (s = h(Math.round((R + e) / $) * $, V, D)),
          (ee = Math.round(s / $)),
          W)
        ) {
          if (e < 0) {
            for (t = W.length - 1; t >= 0; t--)
              if (Math.abs(s) + p >= W[t].breakpoint) {
                ;(ee = t), (te = 2), (s = W[t].snap2)
                break
              }
          } else if (e >= 0)
            for (t = 0; t < W.length; t++)
              if (Math.abs(s) <= W[t].breakpoint) {
                ;(ee = t), (te = 1), (s = W[t].snap1)
                break
              }
          s = h(s, V, D)
        }
        ;(a =
          ae.time ||
          (J < V || J > D
            ? 1e3
            : Math.max(1e3, Math.abs(s - J) * ae.timeUnit))),
          (M.destinationX = Z ? 0 : s),
          (M.destinationY = Z ? s : 0),
          (M.duration = a),
          (M.transitionTiming = _),
          G('onGestureEnd', M),
          c(s, a)
      }
      function c(e, t, a, s) {
        let n = e != J,
          i = t > 1,
          r = function () {
            clearInterval(F),
              clearTimeout(X),
              (L = !1),
              (J = e),
              (M.posX = Z ? 0 : e),
              (M.posY = Z ? e : 0),
              n && G('onMove', M),
              i && G('onAnimationEnd', M),
              s && s()
          }
        ;(M = {
          posX: Z ? 0 : J,
          posY: Z ? J : 0,
          originX: Z ? 0 : R,
          originY: Z ? R : 0,
          direction: e - J > 0 ? (Z ? 270 : 360) : Z ? 90 : 180
        }),
          (J = e),
          i &&
            ((M.destinationX = Z ? 0 : e),
            (M.destinationY = Z ? e : 0),
            (M.duration = t),
            (M.transitionTiming = _),
            G('onAnimationStart', M)),
          (B[st + 'Transition'] = t
            ? tt + 'transform ' + Math.round(t) + 'ms ' + _
            : ''),
          (B[st + 'Transform'] =
            'translate3d(' + (Z ? '0,' + e + 'px,' : e + 'px,0,') + '0)'),
          (!n && !L) || !t || t <= 1
            ? r()
            : t &&
              ((L = !a),
              clearInterval(F),
              (F = setInterval(function () {
                var t = +E(U, Z) || 0
                ;(M.posX = Z ? 0 : t),
                  (M.posY = Z ? t : 0),
                  G('onMove', M),
                  Math.abs(t - e) < 2 && r()
              }, 100)),
              clearTimeout(X),
              (X = setTimeout(function () {
                r()
              }, t))),
          ae.sync && ae.sync(e, t, _)
      }
      let d,
        f,
        p,
        v,
        b,
        g,
        y,
        _,
        w,
        C,
        T,
        M,
        k,
        D,
        S,
        V,
        I,
        L,
        O,
        P,
        Y,
        H,
        N,
        F,
        $,
        W,
        R,
        q,
        j,
        z,
        B,
        U,
        X,
        K,
        G,
        Z,
        J,
        Q = this,
        ee = 0,
        te = 1,
        ae = t,
        se = Be(e)
      Ze.call(this, e, t, !0),
        (Q.scrolled = !1),
        (Q.scroll = function (t, a, s, n) {
          ;(t = u(t)
            ? Math.round(t / $) * $
            : Math.ceil(
                (Be(t, e).length
                  ? Math.round(U.offset()[y] - Be(t, e).offset()[y])
                  : J) / $
              ) * $),
            (t = h(t, V, D)),
            (ee = Math.round(t / $)),
            (R = J),
            c(t, a, s, n)
        }),
        (Q.refresh = function (e) {
          var t
          ;(p =
            void 0 === ae.contSize
              ? Z
                ? se.height()
                : se.width()
              : ae.contSize),
            (V =
              void 0 === ae.minScroll
                ? Math.min(0, Z ? p - U.height() : p - U.width())
                : ae.minScroll),
            (D = void 0 === ae.maxScroll ? 0 : ae.maxScroll),
            (W = null),
            !Z && ae.rtl && ((t = D), (D = -V), (V = -t)),
            m(ae.snap) &&
              ((W = []),
              U.find(ae.snap).each(function () {
                var e = Z ? this.offsetTop : this.offsetLeft,
                  t = Z ? this.offsetHeight : this.offsetWidth
                W.push({ breakpoint: e + t / 2, snap1: -e, snap2: p - e - t })
              })),
            ($ = u(ae.snap) ? ae.snap : 1),
            (S = ae.snap ? ae.maxSnapScroll : 0),
            (_ = ae.easing),
            (w = ae.elastic
              ? u(ae.snap)
                ? $
                : u(ae.elastic)
                ? ae.elastic
                : 0
              : 0),
            void 0 === J && ((J = ae.initialPos), (ee = Math.round(J / $))),
            e || Q.scroll(ae.snap ? (W ? W[ee]['snap' + te] : ee * $) : J)
        }),
        (Q._processSettings = function () {
          ;(Z = 'Y' == ae.axis),
            (y = Z ? 'top' : 'left'),
            (U = ae.moveElement || se.children().eq(0)),
            (B = U[0].style),
            (K = Z ? ae.thresholdY : ae.thresholdX)
        }),
        (Q._init = function () {
          Q.refresh(),
            se
              .on('touchstart mousedown', s)
              .on('touchmove', n)
              .on('touchend touchcancel', r),
            ae.mousewheel && se.on('wheel mousewheel', o),
            e.addEventListener &&
              e.addEventListener(
                'click',
                function (e) {
                  Q.scrolled &&
                    ((Q.scrolled = !1), e.stopPropagation(), e.preventDefault())
                },
                !0
              )
        }),
        (Q._destroy = function () {
          clearInterval(F),
            se
              .off('touchstart mousedown', s)
              .off('touchmove', n)
              .off('touchend touchcancel', r)
              .off('wheel mousewheel', o)
        }),
        (ae = Q.settings),
        (G = Q.trigger),
        a || Q.init(t)
    }
  vt.prototype = {
    _defaults: {
      speedUnit: 0.0022,
      timeUnit: 3,
      initialPos: 0,
      axis: 'Y',
      thresholdX: 10,
      thresholdY: 5,
      easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
      stopProp: !0,
      momentum: !0,
      mousewheel: !0,
      elastic: !0
    }
  } /* eslint-disable no-unused-vars */
  let bt = {},
    gt = Fe ? window.CSS : null,
    yt = gt && gt.supports && gt.supports('(transform-style: preserve-3d)'),
    _t = !yt || 'wp' == Oe || 'android' == Oe,
    xt = function (e, t, a) {
      function s(e) {
        let t,
          a,
          s = Be(this).attr('data-index')
        38 == e.keyCode
          ? ((t = !0), (a = -1))
          : 40 == e.keyCode
          ? ((t = !0), (a = 1))
          : 32 == e.keyCode &&
            ((t = !0),
            i(s, H[s]._$markup.find('.mbsc-sc-itm[data-val="' + V[s] + '"]'))),
          t && (e.stopPropagation(), e.preventDefault(), a && S.start(s, a))
      }
      function n() {
        S.stop()
      }
      function i(e, t) {
        let a = H[e],
          s = +t.attr('data-index'),
          n = m(a, s),
          i = W._tempSelected[e],
          r = u(a.multiple) ? a.multiple : 1 / 0
        P('onItemTap', {
          target: t[0],
          index: e,
          value: n,
          selected: t.hasClass('mbsc-sc-itm-sel')
        }) !== !1 &&
          (a.multiple &&
            !a._disabled[n] &&
            (void 0 !== i[n]
              ? (t.removeClass(k).removeAttr('aria-selected'), delete i[n])
              : (1 == r &&
                  ((W._tempSelected[e] = i = {}),
                  a._$markup
                    .find('.mbsc-sc-itm-sel')
                    .removeClass(k)
                    .removeAttr('aria-selected')),
                c(i).length < r &&
                  (t.addClass(k).attr('aria-selected', 'true'), (i[n] = n)))),
          _(a, e, s, $, !0, !0, a.multiple),
          !W.live ||
            a.multiple ||
            (O.setOnTap !== !0 && !O.setOnTap[e]) ||
            setTimeout(function () {
              W.select()
            }, 200))
      }
      function r(e, t) {
        return (e._array ? e._map[t] : e.getIndex(t, W)) || 0
      }
      function o(e, t) {
        let a = e.data
        if (t >= e.min && t <= e.max)
          return e._array
            ? e.circular
              ? Be(a).get(t % e._length)
              : a[t]
            : Be.isFunction(a)
            ? a(t, W)
            : ''
      }
      function l(e) {
        return Be.isPlainObject(e)
          ? void 0 !== e.value
            ? e.value
            : e.display
          : e
      }
      function d(e) {
        let t = Be.isPlainObject(e) ? e.display : e
        return void 0 === t ? '' : t
      }
      function m(e, t) {
        return l(o(e, t))
      }
      function h(e, t) {
        let a = H[e]
        _(a, e, a._current + t, $, 1 == t ? 1 : 2)
      }
      function f(e) {
        return Be.isArray(O.readonly) ? O.readonly[e] : O.readonly
      }
      function p(e, t, a) {
        let s = e._index - e._batch
        return (
          (e.data = e.data || []),
          (e.key = void 0 !== e.key ? e.key : t),
          (e.label = void 0 !== e.label ? e.label : t),
          (e._map = {}),
          (e._array = Be.isArray(e.data)),
          e._array &&
            ((e._length = e.data.length),
            Be.each(e.data, function (t, a) {
              e._map[l(a)] = t
            })),
          (e.circular =
            void 0 === O.circular
              ? void 0 === e.circular
                ? e._array && e._length > O.rows
                : e.circular
              : Be.isArray(O.circular)
              ? O.circular[t]
              : O.circular),
          (e.min = e._array
            ? e.circular
              ? -(1 / 0)
              : 0
            : void 0 === e.min
            ? -(1 / 0)
            : e.min),
          (e.max = e._array
            ? e.circular
              ? 1 / 0
              : e._length - 1
            : void 0 === e.max
            ? 1 / 0
            : e.max),
          (e._nr = t),
          (e._index = r(e, V[t])),
          (e._disabled = {}),
          (e._batch = 0),
          (e._current = e._index),
          (e._first = e._index - F),
          (e._last = e._index + F),
          (e._offset = e._first),
          a
            ? ((e._offset -= e._margin / A + (e._index - s)),
              (e._margin += (e._index - s) * A))
            : (e._margin = 0),
          (e._refresh = function (t) {
            var a =
                -(
                  e.min -
                  e._offset +
                  (e.multiple && !M ? Math.floor(O.rows / 2) : 0)
                ) * A,
              s = Math.min(
                a,
                -(
                  e.max -
                  e._offset -
                  (e.multiple && !M ? Math.floor(O.rows / 2) : 0)
                ) * A
              )
            Ge(e._scroller.settings, { minScroll: s, maxScroll: a }),
              e._scroller.refresh(t)
          }),
          (N[e.key] = e),
          e
        )
      }
      function v(e, t, a, s, n) {
        let i,
          r,
          c,
          u,
          m,
          h,
          f,
          p,
          v = '',
          b = W._tempSelected[t],
          g = e._disabled || {}
        for (i = a; i <= s; i++)
          (c = o(e, i)),
            (m = d(c)),
            (u = l(c)),
            (r = c && void 0 !== c.cssClass ? c.cssClass : ''),
            (h = c && void 0 !== c.label ? c.label : ''),
            (f = c && c.invalid),
            (p = void 0 !== u && u == V[t] && !e.multiple),
            (v +=
              '<div role="option" aria-selected="' +
              !!b[u] +
              '" class="mbsc-sc-itm ' +
              (n ? 'mbsc-sc-itm-3d ' : '') +
              r +
              ' ' +
              (p ? 'mbsc-sc-itm-sel ' : '') +
              (b[u] ? k : '') +
              (void 0 === u ? ' mbsc-sc-itm-ph' : ' mbsc-btn-e') +
              (f ? ' mbsc-sc-itm-inv-h mbsc-disabled' : '') +
              (g[u] ? ' mbsc-sc-itm-inv mbsc-disabled' : '') +
              '" data-index="' +
              i +
              '" data-val="' +
              u +
              '"' +
              (h ? ' aria-label="' + h + '"' : '') +
              (p ? ' aria-selected="true"' : '') +
              ' style="height:' +
              A +
              'px;line-height:' +
              A +
              'px;' +
              (n
                ? tt +
                  'transform:rotateX(' +
                  (((e._offset - i) * T) % 360) +
                  'deg) translateZ(' +
                  (A * O.rows) / 2 +
                  'px);'
                : '') +
              '">' +
              (Y > 1
                ? '<div class="mbsc-sc-itm-ml" style="line-height:' +
                  Math.round(A / Y) +
                  'px;font-size:' +
                  Math.round((A / Y) * 0.8) +
                  'px;">'
                : '') +
              m +
              (Y > 1 ? '</div>' : '') +
              '</div>')
        return v
      }
      function b(e, t, a) {
        let s = Math.round(-a / A) + e._offset,
          n = s - e._current,
          i = e._first,
          r = e._last,
          o = i + F - C + 1,
          l = r - F + C
        n &&
          ((e._first += n),
          (e._last += n),
          (e._current = s),
          n > 0
            ? (e._$scroller.append(v(e, t, Math.max(r + 1, i + n), r + n)),
              Be('.mbsc-sc-itm', e._$scroller)
                .slice(0, Math.min(n, r - i + 1))
                .remove(),
              M &&
                (e._$3d.append(v(e, t, Math.max(l + 1, o + n), l + n, !0)),
                Be('.mbsc-sc-itm', e._$3d)
                  .slice(0, Math.min(n, l - o + 1))
                  .attr('class', 'mbsc-sc-itm-del')))
            : n < 0 &&
              (e._$scroller.prepend(v(e, t, i + n, Math.min(i - 1, r + n))),
              Be('.mbsc-sc-itm', e._$scroller)
                .slice(Math.max(n, i - r - 1))
                .remove(),
              M &&
                (e._$3d.prepend(v(e, t, o + n, Math.min(o - 1, l + n), !0)),
                Be('.mbsc-sc-itm', e._$3d)
                  .slice(Math.max(n, o - l - 1))
                  .attr('class', 'mbsc-sc-itm-del'))),
          (e._margin += n * A),
          e._$scroller.css('margin-top', e._margin + 'px'))
      }
      function g(e, t, a, s) {
        let n,
          i = H[e],
          o = s || i._disabled,
          l = r(i, t),
          c = t,
          d = t,
          u = 0,
          h = 0
        if ((void 0 === t && (t = m(i, l)), o[t] === !0)) {
          for (n = 0; l - u >= i.min && o[c] && n < 100; )
            n++, u++, (c = m(i, l - u))
          for (n = 0; l + h < i.max && o[d] && n < 100; )
            n++, h++, (d = m(i, l + h))
          t =
            ((h < u && h && 2 !== a) || !u || l - u < 0 || 1 == a) && !o[d]
              ? d
              : c
        }
        return t
      }
      function y(t, a, s, n, i, o) {
        let l,
          c,
          d,
          u,
          m = W._isVisible
        ;(I = !0),
          (u =
            O.validate.call(
              e,
              { values: V.slice(0), index: a, direction: s },
              W
            ) || {}),
          (I = !1),
          u.valid && (W._tempWheelArray = V = u.valid.slice(0)),
          o ||
            Be.each(H, function (e, n) {
              if (
                (m &&
                  n._$markup
                    .find('.mbsc-sc-itm-inv')
                    .removeClass('mbsc-sc-itm-inv mbsc-disabled'),
                (n._disabled = {}),
                u.disabled &&
                  u.disabled[e] &&
                  Be.each(u.disabled[e], function (e, t) {
                    ;(n._disabled[t] = !0),
                      m &&
                        n._$markup
                          .find('.mbsc-sc-itm[data-val="' + t + '"]')
                          .addClass('mbsc-sc-itm-inv mbsc-disabled')
                  }),
                (V[e] = n.multiple ? V[e] : g(e, V[e], s)),
                m)
              ) {
                if (
                  ((n.multiple && void 0 !== a) ||
                    n._$markup
                      .find('.mbsc-sc-itm-sel')
                      .removeClass(k)
                      .removeAttr('aria-selected'),
                  n.multiple)
                ) {
                  if (void 0 === a)
                    for (var o in W._tempSelected[e])
                      n._$markup
                        .find('.mbsc-sc-itm[data-val="' + o + '"]')
                        .addClass(k)
                        .attr('aria-selected', 'true')
                } else
                  n._$markup
                    .find('.mbsc-sc-itm[data-val="' + V[e] + '"]')
                    .addClass('mbsc-sc-itm-sel')
                    .attr('aria-selected', 'true')
                ;(c = r(n, V[e])),
                  (l = c - n._index + n._batch),
                  Math.abs(l) > 2 * F + 1 &&
                    ((d = l + (2 * F + 1) * (l > 0 ? -1 : 1)),
                    (n._offset += d),
                    (n._margin -= d * A),
                    n._refresh()),
                  (n._index = c + n._batch),
                  n._scroller.scroll(
                    -(c - n._offset + n._batch) * A,
                    a === e || void 0 === a ? t : $,
                    i
                  )
              }
            }),
          P('onValidated', { index: a, time: t }),
          (W._tempValue = O.formatValue.call(e, V, W)),
          m && W._updateHeader(),
          W.live &&
            ((W._hasValue = n || W._hasValue),
            x(n, n, 0, !0),
            n && P('onSet', { valueText: W._value })),
          n && P('onChange', { index: a, valueText: W._tempValue })
      }
      function _(e, t, a, s, n, i, r) {
        let o = m(e, a)
        void 0 !== o &&
          ((V[t] = o),
          (e._batch = e._array ? Math.floor(a / e._length) * e._length : 0),
          (e._index = a),
          setTimeout(function () {
            y(s, t, n, !0, i, r)
          }, 10))
      }
      function x(t, a, s, n, i) {
        if (
          (n
            ? (W._tempValue = O.formatValue.call(e, W._tempWheelArray, W))
            : y(s),
          !i)
        ) {
          W._wheelArray = []
          for (let r = 0; r < V.length; r++)
            W._wheelArray[r] =
              H[r] && H[r].multiple ? Object.keys(W._tempSelected[r])[0] : V[r]
          ;(W._value = W._hasValue ? W._tempValue : null),
            (W._selected = Ge(!0, {}, W._tempSelected))
        }
        t &&
          (W._isInput && R.val(W._hasValue ? W._tempValue : ''),
          P('onFill', {
            valueText: W._hasValue ? W._tempValue : '',
            change: a
          }),
          a && ((W._preventChange = !0), R.trigger('change')))
      }
      let w,
        C,
        T,
        M,
        k,
        D,
        S,
        V,
        A,
        E,
        I,
        O,
        P,
        Y,
        H,
        N,
        F = 40,
        $ = 1e3,
        W = this,
        R = Be(e)
      ft.call(this, e, t, !0),
        (W.setVal = W._setVal =
          function (t, a, s, n, i) {
            ;(W._hasValue = null !== t && void 0 !== t),
              (W._tempWheelArray = V =
                Be.isArray(t) ? t.slice(0) : O.parseValue.call(e, t, W) || []),
              x(a, void 0 === s ? a : s, i, !1, n)
          }),
        (W.getVal = W._getVal =
          function (e) {
            var t = W._hasValue || e ? W[e ? '_tempValue' : '_value'] : null
            return u(t) ? +t : t
          }),
        (W.setArrayVal = W.setVal),
        (W.getArrayVal = function (e) {
          return e ? W._tempWheelArray : W._wheelArray
        }),
        (W.changeWheel = function (e, t, a) {
          var s, n
          Be.each(e, function (e, t) {
            ;(n = N[e]),
              n &&
                ((s = n._nr),
                Ge(n, t),
                p(n, s, !0),
                W._isVisible &&
                  (M &&
                    n._$3d.html(
                      v(n, s, n._first + F - C + 1, n._last - F + C, !0)
                    ),
                  n._$scroller
                    .html(v(n, s, n._first, n._last))
                    .css('margin-top', n._margin + 'px'),
                  n._refresh(I)))
          }),
            !W._isVisible || W._isLiquid || I || W.position(),
            I || y(t, void 0, void 0, a)
        }),
        (W.getValidValue = g),
        (W._generateContent = function () {
          var e,
            t = 0,
            a = '',
            s = M
              ? tt + 'transform: translateZ(' + ((A * O.rows) / 2 + 3) + 'px);'
              : '',
            n =
              '<div class="mbsc-sc-whl-l" style="' +
              s +
              'height:' +
              A +
              'px;margin-top:-' +
              (A / 2 + (O.selectedLineBorder || 0)) +
              'px;"></div>',
            i = 0
          return (
            Be.each(O.wheels, function (r, o) {
              ;(a +=
                '<div class="mbsc-w-p mbsc-sc-whl-gr-c' +
                (M ? ' mbsc-sc-whl-gr-3d-c' : '') +
                (O.showLabel ? ' mbsc-sc-lbl-v' : '') +
                '">' +
                n +
                '<div class="mbsc-sc-whl-gr' +
                (M ? ' mbsc-sc-whl-gr-3d' : '') +
                (D ? ' mbsc-sc-cp' : '') +
                (O.width || O.maxWidth
                  ? '"'
                  : '" style="max-width:' + O.maxPopupWidth + 'px;"') +
                '>'),
                Be.each(o, function (r, o) {
                  ;(W._tempSelected[i] = Ge({}, W._selected[i])),
                    (H[i] = p(o, i)),
                    (t += O.maxWidth
                      ? O.maxWidth[i] || O.maxWidth
                      : O.width
                      ? O.width[i] || O.width
                      : 0),
                    (e = void 0 !== o.label ? o.label : r),
                    (a +=
                      '<div class="mbsc-sc-whl-w ' +
                      (o.cssClass || '') +
                      (o.multiple ? ' mbsc-sc-whl-multi' : '') +
                      '" style="' +
                      (O.width
                        ? 'width:' + (O.width[i] || O.width) + 'px;'
                        : (O.minWidth
                            ? 'min-width:' +
                              (O.minWidth[i] || O.minWidth) +
                              'px;'
                            : '') +
                          (O.maxWidth
                            ? 'max-width:' +
                              (O.maxWidth[i] || O.maxWidth) +
                              'px;'
                            : '')) +
                      '"><div class="mbsc-sc-whl-o" style="' +
                      s +
                      '"></div>' +
                      n +
                      '<div tabindex="0" aria-live="off" aria-label="' +
                      e +
                      '"' +
                      (o.multiple ? ' aria-multiselectable="true"' : '') +
                      ' role="listbox" data-index="' +
                      i +
                      '" class="mbsc-sc-whl" style="height:' +
                      O.rows * A * (M ? 1.1 : 1) +
                      'px;">' +
                      (D
                        ? '<div data-index="' +
                          i +
                          '" data-step="1" class="mbsc-sc-btn mbsc-sc-btn-plus ' +
                          (O.btnPlusClass || '') +
                          '" style="height:' +
                          A +
                          'px;line-height:' +
                          A +
                          'px;"></div><div data-index="' +
                          i +
                          '" data-step="-1" class="mbsc-sc-btn mbsc-sc-btn-minus ' +
                          (O.btnMinusClass || '') +
                          '" style="height:' +
                          A +
                          'px;line-height:' +
                          A +
                          'px;"></div>'
                        : '') +
                      '<div class="mbsc-sc-lbl">' +
                      e +
                      '</div><div class="mbsc-sc-whl-c" style="height:' +
                      E +
                      'px;margin-top:-' +
                      (E / 2 + 1) +
                      'px;' +
                      s +
                      '"><div class="mbsc-sc-whl-sc" style="top:' +
                      (E - A) / 2 +
                      'px;">'),
                    (a += v(o, i, o._first, o._last) + '</div></div>'),
                    M &&
                      ((a +=
                        '<div class="mbsc-sc-whl-3d" style="height:' +
                        A +
                        'px;margin-top:-' +
                        A / 2 +
                        'px;">'),
                      (a += v(o, i, o._first + F - C + 1, o._last - F + C, !0)),
                      (a += '</div>')),
                    (a += '</div></div>'),
                    i++
                }),
                (a += '</div></div>')
            }),
            t && (O.maxPopupWidth = t),
            a
          )
        }),
        (W._attachEvents = function (e) {
          ;(S = L(Be('.mbsc-sc-btn', e), h, O.delay, f, !0)),
            Be('.mbsc-sc-whl', e).on('keydown', s).on('keyup', n)
        }),
        (W._detachEvents = function () {
          for (var e = 0; e < H.length; e++) H[e]._scroller.destroy()
        }),
        (W._markupReady = function (e) {
          ;(w = e),
            Be('.mbsc-sc-whl-w', w).each(function (e) {
              var t,
                a = Be(this),
                s = H[e],
                n =
                  -(
                    s.min -
                    s._offset +
                    (s.multiple && !M ? Math.floor(O.rows / 2) : 0)
                  ) * A,
                r = Math.min(
                  n,
                  -(
                    s.max -
                    s._offset -
                    (s.multiple && !M ? Math.floor(O.rows / 2) : 0)
                  ) * A
                )
              ;(s._$markup = a),
                (s._$scroller = Be('.mbsc-sc-whl-sc', this)),
                (s._$3d = Be('.mbsc-sc-whl-3d', this)),
                (s._scroller = new vt(this, {
                  mousewheel: O.mousewheel,
                  moveElement: s._$scroller,
                  initialPos: (s._first - s._index) * A,
                  contSize: 0,
                  snap: A,
                  minScroll: r,
                  maxScroll: n,
                  maxSnapScroll: F,
                  prevDef: !0,
                  stopProp: !0,
                  timeUnit: 3,
                  easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                  sync: function (e, t, a) {
                    M &&
                      ((s._$3d[0].style[st + 'Transition'] = t
                        ? tt + 'transform ' + Math.round(t) + 'ms ' + a
                        : ''),
                      (s._$3d[0].style[st + 'Transform'] =
                        'rotateX(' + (-e / A) * T + 'deg)'))
                  },
                  onStart: function (t, a) {
                    a.settings.readonly = f(e)
                  },
                  onGestureStart: function () {
                    a.addClass('mbsc-sc-whl-a mbsc-sc-whl-anim'),
                      P('onWheelGestureStart', { index: e })
                  },
                  onGestureEnd: function (a) {
                    var n = 90 == a.direction ? 1 : 2,
                      i = a.duration,
                      r = a.destinationY
                    ;(t = Math.round(-r / A) + s._offset), _(s, e, t, i, n)
                  },
                  onAnimationStart: function () {
                    a.addClass('mbsc-sc-whl-anim')
                  },
                  onAnimationEnd: function () {
                    a.removeClass('mbsc-sc-whl-a mbsc-sc-whl-anim'),
                      P('onWheelAnimationEnd', { index: e }),
                      s._$3d.find('.mbsc-sc-itm-del').remove()
                  },
                  onMove: function (t) {
                    b(s, e, t.posY)
                  },
                  onBtnTap: function (t) {
                    i(e, Be(t.target))
                  }
                }))
            }),
            y()
        }),
        (W._fillValue = function () {
          ;(W._hasValue = !0), x(!0, !0, 0, !0)
        }),
        (W._clearValue = function () {
          Be('.mbsc-sc-whl-multi .mbsc-sc-itm-sel', w)
            .removeClass(k)
            .removeAttr('aria-selected')
        }),
        (W._readValue = function () {
          var t = R.val() || '',
            a = 0
          '' !== t && (W._hasValue = !0),
            (W._tempWheelArray = V =
              W._hasValue && W._wheelArray
                ? W._wheelArray.slice(0)
                : O.parseValue.call(e, t, W) || []),
            (W._tempSelected = Ge(!0, {}, W._selected)),
            Be.each(O.wheels, function (e, t) {
              Be.each(t, function (e, t) {
                ;(H[a] = p(t, a)), a++
              })
            }),
            x(!1, !1, 0, !0),
            P('onRead')
        }),
        (W.__processSettings = function () {
          ;(O = W.settings),
            (P = W.trigger),
            (Y = O.multiline),
            (k = 'mbsc-sc-itm-sel mbsc-ic mbsc-ic-' + O.checkIcon)
        }),
        (W.__init = function () {
          ;(H = []),
            (N = {}),
            (D = O.showScrollArrows),
            (M = O.scroll3d && !_t && !D),
            (A = O.height),
            (E = M
              ? 2 * Math.round((A - 0.03 * ((A * O.rows) / 2 + 3)) / 2)
              : A),
            (C = Math.round(1.8 * O.rows)),
            (T = 360 / (2 * C)),
            D && (O.rows = Math.max(3, O.rows)),
            (O.cssClass = (O.cssClass || '') + ' mbsc-sc')
        }),
        (W._getItemValue = l),
        (W._tempSelected = {}),
        (W._selected = {}),
        a || W.init(t)
    }
  ;(xt.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _class: 'scroller',
    _presets: bt,
    _defaults: Ge({}, ft.prototype._defaults, {
      minWidth: 80,
      height: 40,
      rows: 3,
      multiline: 1,
      delay: 300,
      readonly: !1,
      showLabel: !0,
      setOnTap: !1,
      wheels: [],
      preset: '',
      speedUnit: 0.0012,
      timeUnit: 0.08,
      checkIcon: 'checkmark',
      validate: function () {},
      formatValue: function (e) {
        return e.join(' ')
      },
      parseValue: function (e, t) {
        var a,
          s,
          n = [],
          i = [],
          r = 0
        return (
          null !== e && void 0 !== e && (n = (e + '').split(' ')),
          Be.each(t.settings.wheels, function (e, o) {
            Be.each(o, function (e, o) {
              ;(s = o.data),
                (a = t._getItemValue(s[0])),
                Be.each(s, function (e, s) {
                  if (n[r] == t._getItemValue(s))
                    return (a = t._getItemValue(s)), !1
                }),
                i.push(a),
                r++
            })
          }),
          i
        )
      }
    })
  }),
    (Ke.Scroller = xt)
  let wt = {
    inputClass: '',
    invalid: [],
    rtl: !1,
    showInput: !0,
    groupLabel: 'Groups',
    dataHtml: 'html',
    dataText: 'text',
    dataValue: 'value',
    dataGroup: 'group',
    dataDisabled: 'disabled',
    filterPlaceholderText: 'Type to filter',
    filterEmptyText: 'No results',
    filterClearIcon: 'material-close'
  }
  ;(bt.select = function (e) {
    function t(e) {
      var t,
        a,
        s,
        n,
        i,
        r,
        o = 0,
        l = 0,
        c = {}
      if (((q = {}), (S = {}), (I = []), (k = []), (ne.length = 0), Z))
        Be.each(x, function (o, d) {
          ;(i = d[$.dataText] + ''),
            (a = d[$.dataHtml]),
            (r = d[$.dataValue]),
            (s = d[$.dataGroup]),
            (n = { value: r, html: a, text: i, index: o }),
            (q[r] = n),
            (e && !v(i, e)) ||
              (I.push(n),
              J &&
                (void 0 === c[s]
                  ? ((t = { text: s, value: l, options: [], index: l }),
                    (S[l] = t),
                    (c[s] = l),
                    k.push(t),
                    l++)
                  : (t = S[c[s]]),
                te && (n.index = t.options.length),
                (n.group = c[s]),
                t.options.push(n)),
              d[$.dataDisabled] && ne.push(r))
        })
      else if (J) {
        var d = !0
        Be('optgroup', N).each(function (t) {
          ;(S[t] = { text: this.label, value: t, options: [], index: t }),
            (d = !0),
            Be('option', this).each(function (a) {
              ;(n = {
                value: this.value,
                text: this.text,
                index: te ? a : o++,
                group: t
              }),
                (q[this.value] = n),
                (e && !v(this.text, e)) ||
                  (d && (k.push(S[t]), (d = !1)),
                  I.push(n),
                  S[t].options.push(n),
                  this.disabled && ne.push(this.value))
            })
        })
      } else
        Be('option', N).each(function (t) {
          ;(n = { value: this.value, text: this.text, index: t }),
            (q[this.value] = n),
            (e && !v(this.text, e)) ||
              (I.push(n), this.disabled && ne.push(this.value))
        })
      $.defaultValue ? (w = $.defaultValue) : I.length && (w = I[0].value),
        ae &&
          ((I = []),
          (o = 0),
          Be.each(S, function (e, t) {
            t.options.length &&
              ((r = '__group' + e),
              (n = {
                text: t.text,
                value: r,
                group: e,
                index: o++,
                cssClass: 'mbsc-sel-gr'
              }),
              (q[r] = n),
              I.push(n),
              ne.push(n.value),
              Be.each(t.options, function (e, t) {
                ;(t.index = o++), I.push(t)
              }))
          })),
        W &&
          (I.length
            ? W.removeClass('mbsc-sel-empty-v')
            : W.addClass('mbsc-sel-empty-v'))
    }
    function a(e, t, a) {
      var s,
        n = []
      for (s = 0; s < e.length; s++)
        n.push({
          value: e[s].value,
          display: e[s].html || e[s].text,
          cssClass: e[s].cssClass
        })
      return { circular: !1, multiple: t, data: n, label: a }
    }
    function s() {
      return a(k, !1, $.groupLabel)
    }
    function n() {
      return a(te ? S[M].options : I, U, G)
    }
    function i() {
      var e,
        t,
        a = [[]]
      return (
        ee && ((e = s()), z ? (a[0][V] = e) : (a[V] = [e])),
        (t = n()),
        z ? (a[0][L] = t) : (a[L] = [t]),
        a
      )
    }
    function r(e) {
      B && (e && m(e) && (e = e.split(',')), Be.isArray(e) && (e = e[0])),
        (E = void 0 === e || null === e || '' === e ? w : e),
        ee && (M = q[E] ? q[E].group : null)
    }
    function o(e) {
      return P[e] || (q[e] ? q[e].text : '')
    }
    function h(t) {
      var a,
        s,
        n = []
      if (U) {
        for (a in e._tempSelected[L]) n.push(o(a))
        return n.join(', ')
      }
      return (s = t[L]), o(s)
    }
    function f() {
      var t,
        a = '',
        s = e.getVal(),
        n = $.formatValue.call(H, e.getArrayVal(), e)
      if (
        (($.filter && 'inline' == $.display) || _.val(n), N.is('select') && Z)
      ) {
        if (B)
          for (t = 0; t < s.length; t++)
            a += '<option value="' + s[t] + '">' + o(s[t]) + '</option>'
        else a = '<option value="' + s + '">' + n + '</option>'
        N.html(a)
      }
      H !== _[0] && N.val(s)
    }
    function p() {
      var t = {}
      ;(t[L] = n()), (O = !0), e.changeWheel(t)
    }
    function v(e, t) {
      return (
        (t = t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')),
        e.match(new RegExp(t, 'ig'))
      )
    }
    function b(e) {
      return $.data.dataField
        ? e[$.data.dataField]
        : $.data.processResponse
        ? $.data.processResponse(e)
        : e
    }
    function g(a) {
      var o = {}
      t(a),
        ($.wheels = i()),
        r(E),
        (o[L] = n()),
        (e._tempWheelArray[L] = E),
        ee && ((o[V] = s()), (e._tempWheelArray[V] = M)),
        e._isVisible && e.changeWheel(o, 0, !0)
    }
    function y(t) {
      return e.trigger('onFilter', { filterText: t })
    }
    var _,
      x,
      w,
      C,
      T,
      M,
      k,
      S,
      V,
      A,
      E,
      I,
      L,
      O,
      P = {},
      Y = 1e3,
      H = this,
      N = Be(H),
      F = Ge({}, e.settings),
      $ = Ge(e.settings, wt, F),
      W = Be('<div class="mbsc-sel-empty">' + $.filterEmptyText + '</div>'),
      R = $.readonly,
      q = {},
      j =
        $.layout ||
        (/top|bottom|inline/.test($.display) || $.filter ? 'liquid' : ''),
      z = 'liquid' == j,
      B = u($.select) ? $.select : 'multiple' == $.select || N.prop('multiple'),
      U = B || (!!$.filter && 1),
      X = this.id + '_dummy',
      K = Be('label[for="' + this.id + '"]').attr('for', X),
      G = void 0 !== $.label ? $.label : K.length ? K.text() : N.attr('name'),
      Z = !!$.data,
      J = Z ? !!$.group : Be('optgroup', N).length,
      Q = $.group,
      ee = J && Q && Q.groupWheel !== !1,
      te = J && Q && ee && Q.clustered === !0,
      ae = J && (!Q || (Q.header !== !1 && !te)),
      se = N.val() || (B ? [] : ['']),
      ne = []
    return (
      (e.setVal = function (t, a, s, n, i) {
        U &&
          (null === t || void 0 === t || B || (t = [t]),
          t && m(t) && (t = t.split(',')),
          (e._tempSelected[L] = d(t)),
          n || (e._selected[L] = d(t)),
          (t = t ? t[0] : null)),
          e._setVal(t, a, s, n, i)
      }),
      (e.getVal = function (t, a) {
        var s
        return (
          U
            ? ((s = c(t ? e._tempSelected[L] : e._selected[L])),
              (s = B ? s : s.length ? s[0] : null))
            : ((s = t ? e._tempWheelArray : e._hasValue ? e._wheelArray : null),
              (s = s ? s[L] : null)),
          B
            ? s
            : void 0 !== s
            ? J && a
              ? [q[s] ? q[s].group : null, s]
              : s
            : null
        )
      }),
      (e.refresh = function (e, t, a) {
        ;(a = a || l),
          e ? ((x = e), A || ($.data = e)) : Be.isArray($.data) && (x = $.data),
          !e && A && void 0 === t
            ? D(
                $.data.url,
                function (e) {
                  ;(x = b(e)), g(), a()
                },
                $.data.dataType
              )
            : (g(t), a())
      }),
      $.invalid.length || ($.invalid = ne),
      ee ? ((V = 0), (L = 1)) : ((V = -1), (L = 0)),
      U &&
        (B && N.prop('multiple', !0),
        se && m(se) && (se = se.split(',')),
        (e._selected[L] = d(se))),
      e._$input && e._$input.remove(),
      N.next().is('input.mbsc-control')
        ? (_ = N.next().removeAttr('tabindex'))
        : $.input
        ? (_ = Be($.input))
        : ($.filter && 'inline' == $.display
            ? (e._$input = Be(
                '<div class="mbsc-sel-input-wrap"><input type="text" id="' +
                  X +
                  '" class="mbsc-control ' +
                  $.inputClass +
                  '" readonly /></div>'
              ))
            : ((_ = Be(
                '<input type="text" id="' +
                  X +
                  '" class="mbsc-control ' +
                  $.inputClass +
                  '" readonly />'
              )),
              (e._$input = _)),
          $.showInput &&
            (e._$input.insertBefore(N), _ || (_ = e._$input.find('#' + X)))),
      e.attachShow(_.attr('placeholder', $.placeholder || '')),
      _[0] !== H && N.addClass('mbsc-sel-hdn').attr('tabindex', -1),
      !U || $.rows % 2 || ($.rows = $.rows - 1),
      $.filter && (C = $.filter.minLength || 0),
      (A = $.data && $.data.url),
      A ? e.refresh(void 0, void 0, f) : (Z && (x = $.data), t(), r(N.val())),
      {
        layout: j,
        headerText: !1,
        anchor: _,
        compClass:
          'mbsc-sel' +
          (ee ? ' mbsc-sel-gr-whl' : '') +
          (U ? ' mbsc-sel-multi' : ''),
        setOnTap: !ee || [!1, !0],
        formatValue: h,
        parseValue: function (e) {
          return r(void 0 === e ? N.val() : e), ee ? [M, E] : [E]
        },
        validate: function (e) {
          var t = e.index,
            a = []
          return (
            (a[L] = $.invalid),
            te && !O && void 0 === t && p(),
            (O = !1),
            { disabled: a }
          )
        },
        onRead: f,
        onFill: f,
        onMarkupReady: function (e, t) {
          if ($.filter) {
            var a,
              s,
              n,
              i = Be('.mbsc-fr-w', e.target),
              r = Be(
                '<span class="mbsc-sel-filter-clear mbsc-ic mbsc-ic-' +
                  $.filterClearIcon +
                  '"></span>'
              )
            'inline' == $.display
              ? ((a = _), _.parent().find('.mbsc-sel-filter-clear').remove())
              : (i
                  .find('.mbsc-fr-c')
                  .before(
                    '<div class="mbsc-input mbsc-sel-filter-cont mbsc-control-w"><span class="mbsc-input-wrap"><input tabindex="0" type="text" class="mbsc-sel-filter-input mbsc-control"/></span></div>'
                  ),
                (a = i.find('.mbsc-sel-filter-input'))),
              (T = null),
              (n = a[0]),
              a
                .prop('readonly', !1)
                .attr('placeholder', $.filterPlaceholderText)
                .parent()
                .append(r),
              i.find('.mbsc-fr-c').prepend(W),
              (t._activeElm = n),
              t.tap(r, function () {
                ;(T = null),
                  (n.value = ''),
                  t.refresh(),
                  r.removeClass('mbsc-sel-filter-show-clear'),
                  y('')
              }),
              a
                .on('keydown', function (e) {
                  ;(13 != e.keyCode && 27 != e.keyCode) ||
                    (e.stopPropagation(), n.blur())
                })
                .on('keyup', function () {
                  clearTimeout(s),
                    n.value.length
                      ? r.addClass('mbsc-sel-filter-show-clear')
                      : r.removeClass('mbsc-sel-filter-show-clear'),
                    (s = setTimeout(function () {
                      T !== n.value &&
                        y(n.value) !== !1 &&
                        ((T = n.value),
                        (T.length >= C || !T.length) &&
                          (A && $.data.remoteFilter
                            ? D(
                                $.data.url + encodeURIComponent(T),
                                function (e) {
                                  t.refresh(b(e))
                                },
                                $.data.dataType
                              )
                            : t.refresh(void 0, T)))
                    }, 500))
                })
          }
        },
        onBeforeShow: function () {
          B &&
            $.counter &&
            ($.headerText = function () {
              var t = 0
              return (
                Be.each(e._tempSelected[L], function () {
                  t++
                }),
                (t > 1
                  ? $.selectedPluralText || $.selectedText
                  : $.selectedText
                ).replace(/{count}/, t)
              )
            }),
            r(N.val()),
            $.filter && t(void 0),
            (e.settings.wheels = i()),
            (O = !0)
        },
        onWheelGestureStart: function (e) {
          e.index == V && ($.readonly = [!1, !0])
        },
        onWheelAnimationEnd: function (t) {
          var a = e.getArrayVal(!0)
          t.index == V
            ? (($.readonly = R),
              a[V] != M &&
                ((M = a[V]),
                (E = S[M].options[0].value),
                (a[L] = E),
                te ? p() : e.setArrayVal(a, !1, !1, !0, Y)))
            : t.index == L &&
              a[L] != E &&
              ((E = a[L]),
              ee &&
                q[E] &&
                q[E].group != M &&
                ((M = q[E].group), (a[V] = M), e.setArrayVal(a, !1, !1, !0, Y)))
        },
        onItemTap: function (e) {
          if (
            e.index == L &&
            ((P[e.value] = q[e.value].text), U && !B && e.selected)
          )
            return !1
        },
        onClose: function () {
          A && $.data.remoteFilter && T && e.refresh()
        },
        onDestroy: function () {
          e._$input && e._$input.remove(),
            N.removeClass('mbsc-sel-hdn').removeAttr('tabindex')
        }
      }
    )
  }),
    o('select', xt)
  let Ct =
      /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?((Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
    Tt =
      /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
    Mt = /^\d{1,2}(\/\d{1,2})?$/,
    kt = /^w\d$/i,
    Dt = {
      shortYearCutoff: '+10',
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      monthNamesShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      amText: 'am',
      pmText: 'pm',
      getYear: function (e) {
        return e.getFullYear()
      },
      getMonth: function (e) {
        return e.getMonth()
      },
      getDay: function (e) {
        return e.getDate()
      },
      getDate: O,
      getMaxDayOfMonth: function (e, t) {
        return 32 - new Date(e, t, 32, 12).getDate()
      },
      getWeekNumber: function (e) {
        ;(e = new Date(e)),
          e.setHours(0, 0, 0),
          e.setDate(e.getDate() + 4 - (e.getDay() || 7))
        var t = new Date(e.getFullYear(), 0, 1)
        return Math.ceil(((e - t) / 864e5 + 1) / 7)
      }
    }
  _e.datetime = { formatDate: P, parseDate: Y }
  let St = {
      separator: ' ',
      dateFormat: 'mm/dd/yy',
      dateDisplay: 'MMddyy',
      timeFormat: 'h:ii A',
      dayText: 'Day',
      monthText: 'Month',
      yearText: 'Year',
      hourText: 'Hours',
      minuteText: 'Minutes',
      ampmText: '&nbsp;',
      secText: 'Seconds',
      nowText: 'Now',
      todayText: 'Today'
    },
    Vt = function (e) {
      function t(e) {
        let t,
          a,
          s,
          n,
          i = []
        if (e) {
          for (t = 0; t < e.length; t++)
            if (((a = e[t]), a.start && a.end && !Tt.test(a.start)))
              for (
                s = new Date(W(a.start, U, j)), n = new Date(W(a.end, U, j));
                s <= n;

              )
                i.push(O(s.getFullYear(), s.getMonth(), s.getDate())),
                  s.setDate(s.getDate() + 1)
            else i.push(a)
          return i
        }
        return e
      }
      function a(e, t, a, s) {
        return Math.min(s, Math.floor(e / t) * t + a)
      }
      function s(e, t, a) {
        return Math.floor((a - t) / e) * e + t
      }
      function n(e) {
        return j.getYear(e)
      }
      function i(e) {
        return j.getMonth(e)
      }
      function r(e) {
        return j.getDay(e)
      }
      function o(e) {
        let t = e.getHours()
        return (t = ne && t >= 12 ? t - 12 : t), a(t, oe, ue, fe)
      }
      function l(e) {
        return a(e.getMinutes(), le, me, pe)
      }
      function c(e) {
        return a(e.getSeconds(), ce, he, ve)
      }
      function d(e) {
        return e.getMilliseconds()
      }
      function u(e) {
        return e.getHours() > 11 ? 1 : 0
      }
      function m(e) {
        return (
          e.getFullYear() + '-' + f(e.getMonth() + 1) + '-' + f(e.getDate())
        )
      }
      function h(e) {
        return a(
          Math.round((e.getTime() - new Date(e).setHours(0, 0, 0, 0)) / 1e3),
          A,
          0,
          86400
        )
      }
      function p(e, t, a, s) {
        let n
        return void 0 === L[t] || ((n = +e[L[t]]), isNaN(n))
          ? a
            ? xe[t](a)
            : void 0 !== H[t]
            ? H[t]
            : xe[t](s)
          : n
      }
      function v(e) {
        let t,
          a = new Date(new Date().setHours(0, 0, 0, 0))
        if (null === e) return e
        void 0 !== L.dd &&
          ((t = e[L.dd].split('-')), (t = new Date(t[0], t[1] - 1, t[2]))),
          void 0 !== L.tt &&
            ((t = t || a),
            (t = new Date(t.getTime() + (e[L.tt] % 86400) * 1e3)))
        let s = p(e, 'y', t, a),
          n = p(e, 'm', t, a),
          i = Math.min(p(e, 'd', t, a), j.getMaxDayOfMonth(s, n)),
          r = p(e, 'h', t, a)
        return j.getDate(
          s,
          n,
          i,
          ne && p(e, 'a', t, a) ? r + 12 : r,
          p(e, 'i', t, a),
          p(e, 's', t, a),
          p(e, 'u', t, a)
        )
      }
      function b(e, t) {
        let a,
          s,
          n = ['y', 'm', 'd', 'a', 'h', 'i', 's', 'u', 'dd', 'tt'],
          i = []
        if (null === e || void 0 === e) return e
        for (a = 0; a < n.length; a++)
          (s = n[a]),
            void 0 !== L[s] && (i[L[s]] = xe[s](e)),
            t && (H[s] = xe[s](e))
        return i
      }
      function g(e, t) {
        return t
          ? Math.floor(new Date(e) / 864e5)
          : e.getMonth() + 12 * (e.getFullYear() - 1970)
      }
      function y(e) {
        return {
          value: e,
          display:
            (/yy/i.test(G) ? e : (e + '').substr(2, 2)) + (j.yearSuffix || '')
        }
      }
      function _(e) {
        return e
      }
      function x(e) {
        let t = /d/i.test(e)
        return {
          label: '',
          cssClass: 'mbsc-dt-whl-date',
          min: te ? g(m(te), t) : void 0,
          max: ae ? g(m(ae), t) : void 0,
          data: function (a) {
            var s = new Date(new Date().setHours(0, 0, 0, 0)),
              n = t ? new Date(864e5 * a) : new Date(1970, a, 1)
            return (
              t &&
                (n = new Date(
                  n.getUTCFullYear(),
                  n.getUTCMonth(),
                  n.getUTCDate()
                )),
              {
                invalid: t && !k(n, !0),
                value: m(n),
                display: s.getTime() == n.getTime() ? j.todayText : P(e, n, j)
              }
            )
          },
          getIndex: function (e) {
            return g(e, t)
          }
        }
      }
      function w(e) {
        let t,
          a,
          s,
          n = []
        for (
          /s/i.test(e)
            ? (a = ce)
            : /i/i.test(e)
            ? (a = 60 * le)
            : /h/i.test(e) && (a = 3600 * oe),
            A = ye.tt = a,
            t = 0;
          t < 86400;
          t += a
        )
          (s = new Date(new Date().setHours(0, 0, 0, 0) + 1e3 * t)),
            n.push({ value: t, display: P(e, s, j) })
        return { label: '', cssClass: 'mbsc-dt-whl-time', data: n }
      }
      function C() {
        let e,
          t,
          a,
          s,
          n,
          i,
          r,
          o,
          l = 0,
          c = [],
          d = [],
          u = []
        if (/date/i.test(z)) {
          for (e = X.split(/\|/.test(X) ? '|' : ''), s = 0; s < e.length; s++)
            if (((a = e[s]), (i = 0), a.length))
              if (
                (/y/i.test(a) && ((N.y = 1), i++),
                /m/i.test(a) && ((N.y = 1), (N.m = 1), i++),
                /d/i.test(a) && ((N.y = 1), (N.m = 1), (N.d = 1), i++),
                i > 1 && void 0 === L.dd)
              )
                (L.dd = l), l++, d.push(x(a)), (u = d), (E = !0)
              else if (/y/i.test(a) && void 0 === L.y)
                (L.y = l),
                  l++,
                  d.push({
                    cssClass: 'mbsc-dt-whl-y',
                    label: j.yearText,
                    min: te ? j.getYear(te) : void 0,
                    max: ae ? j.getYear(ae) : void 0,
                    data: y,
                    getIndex: _
                  })
              else if (/m/i.test(a) && void 0 === L.m) {
                for (L.m = l, r = [], l++, n = 0; n < 12; n++)
                  (o = G.replace(/[dy]/gi, '')
                    .replace(/mm/, f(n + 1) + (j.monthSuffix || ''))
                    .replace(/m/, n + 1 + (j.monthSuffix || ''))),
                    r.push({
                      value: n,
                      display: /MM/.test(o)
                        ? o.replace(
                            /MM/,
                            '<span class="mbsc-dt-month">' +
                              j.monthNames[n] +
                              '</span>'
                          )
                        : o.replace(
                            /M/,
                            '<span class="mbsc-dt-month">' +
                              j.monthNamesShort[n] +
                              '</span>'
                          )
                    })
                d.push({
                  cssClass: 'mbsc-dt-whl-m',
                  label: j.monthText,
                  data: r
                })
              } else if (/d/i.test(a) && void 0 === L.d) {
                for (L.d = l, r = [], l++, n = 1; n < 32; n++)
                  r.push({
                    value: n,
                    display: (/dd/i.test(G) ? f(n) : n) + (j.daySuffix || '')
                  })
                d.push({ cssClass: 'mbsc-dt-whl-d', label: j.dayText, data: r })
              }
          c.push(d)
        }
        if (/time/i.test(z)) {
          for (t = K.split(/\|/.test(K) ? '|' : ''), s = 0; s < t.length; s++)
            if (
              ((a = t[s]),
              (i = 0),
              a.length &&
                (/h/i.test(a) && ((N.h = 1), i++),
                /i/i.test(a) && ((N.i = 1), i++),
                /s/i.test(a) && ((N.s = 1), i++),
                /a/i.test(a) && i++),
              i > 1 && void 0 === L.tt)
            )
              (L.tt = l), l++, u.push(w(a))
            else if (/h/i.test(a) && void 0 === L.h) {
              for (
                r = [], L.h = l, N.h = 1, l++, n = ue;
                n < (ne ? 12 : 24);
                n += oe
              )
                r.push({
                  value: n,
                  display: ne && 0 === n ? 12 : /hh/i.test(Z) ? f(n) : n
                })
              u.push({ cssClass: 'mbsc-dt-whl-h', label: j.hourText, data: r })
            } else if (/i/i.test(a) && void 0 === L.i) {
              for (r = [], L.i = l, N.i = 1, l++, n = me; n < 60; n += le)
                r.push({ value: n, display: /ii/i.test(Z) ? f(n) : n })
              u.push({
                cssClass: 'mbsc-dt-whl-i',
                label: j.minuteText,
                data: r
              })
            } else if (/s/i.test(a) && void 0 === L.s) {
              for (r = [], L.s = l, N.s = 1, l++, n = he; n < 60; n += ce)
                r.push({ value: n, display: /ss/i.test(Z) ? f(n) : n })
              u.push({ cssClass: 'mbsc-dt-whl-s', label: j.secText, data: r })
            } else
              /a/i.test(a) &&
                void 0 === L.a &&
                ((L.a = l),
                l++,
                u.push({
                  cssClass: 'mbsc-dt-whl-a',
                  label: j.ampmText,
                  data: /A/.test(a)
                    ? [
                        { value: 0, display: j.amText.toUpperCase() },
                        { value: 1, display: j.pmText.toUpperCase() }
                      ]
                    : [
                        { value: 0, display: j.amText },
                        { value: 1, display: j.pmText }
                      ]
                }))
          u != d && c.push(u)
        }
        return c
      }
      function T(e) {
        let t,
          a,
          s,
          n = {}
        if (e.is('input')) {
          switch (e.attr('type')) {
            case 'date':
              t = 'yy-mm-dd'
              break
            case 'datetime':
              t = 'yy-mm-ddTHH:ii:ssZ'
              break
            case 'datetime-local':
              t = 'yy-mm-ddTHH:ii:ss'
              break
            case 'month':
              ;(t = 'yy-mm'), (n.dateOrder = 'mmyy')
              break
            case 'time':
              t = 'HH:ii:ss'
          }
          ;(n.format = t),
            (a = e.attr('min')),
            (s = e.attr('max')),
            a && 'undefined' != a && (n.min = Y(t, a)),
            s && 'undefined' != s && (n.max = Y(t, s))
        }
        return n
      }
      function M(e, t) {
        let a,
          s,
          n = !1,
          i = !1,
          r = 0,
          o = 0,
          l = te ? v(b(te)) : -(1 / 0),
          c = ae ? v(b(ae)) : 1 / 0
        if (k(e)) return e
        if ((e < l && (e = l), e > c && (e = c), (a = e), (s = e), 2 !== t))
          for (n = k(a, !0); !n && a < c; )
            (a = new Date(a.getTime() + 864e5)), (n = k(a, !0)), r++
        if (1 !== t)
          for (i = k(s, !0); !i && s > l; )
            (s = new Date(s.getTime() - 864e5)), (i = k(s, !0)), o++
        return 1 === t && n ? a : 2 === t && i ? s : o <= r && i ? s : a
      }
      function k(e, t) {
        return !(!t && e < te) && !(!t && e > ae) && (!!D(e, ee) || !D(e, Q))
      }
      function D(e, t) {
        let a, s, n
        if (t)
          for (s = 0; s < t.length; s++)
            if (((a = t[s]), (n = a + ''), !a.start))
              if (kt.test(n)) {
                if (((n = +n.replace('w', '')), n == e.getDay())) return !0
              } else if (Mt.test(n)) {
                if (((n = n.split('/')), n[1])) {
                  if (n[0] - 1 == e.getMonth() && n[1] == e.getDate()) return !0
                } else if (n[0] == e.getDate()) return !0
              } else if (
                ((a = W(a, U, j)),
                e.getFullYear() == a.getFullYear() &&
                  e.getMonth() == a.getMonth() &&
                  e.getDate() == a.getDate())
              )
                return !0
        return !1
      }
      function S(e, t, a, s, n, i, r) {
        let o, l, c, d
        if (e)
          for (l = 0; l < e.length; l++)
            if (((o = e[l]), (d = o + ''), !o.start))
              if (kt.test(d))
                for (d = +d.replace('w', ''), c = d - s; c < n; c += 7)
                  c >= 0 && (i[c + 1] = r)
              else
                Mt.test(d)
                  ? ((d = d.split('/')),
                    d[1] ? d[0] - 1 == a && (i[d[1]] = r) : (i[d[0]] = r))
                  : ((o = W(o, U, j)),
                    j.getYear(o) == t &&
                      j.getMonth(o) == a &&
                      (i[j.getDay(o)] = r))
      }
      function V(e, t, s, n, i, r, o, l) {
        let c,
          d,
          u,
          m,
          h,
          f,
          p,
          v,
          b,
          g,
          y,
          _,
          x,
          w,
          C,
          T,
          M,
          k,
          D,
          S,
          V = {},
          E = j.getDate(n, i, r),
          I = ['a', 'h', 'i', 's']
        if (e) {
          for (p = 0; p < e.length; p++)
            (y = e[p]),
              y.start &&
                ((y.apply = !1),
                (u = y.d),
                (M = u + ''),
                (k = M.split('/')),
                u &&
                  ((u.getTime &&
                    n == j.getYear(u) &&
                    i == j.getMonth(u) &&
                    r == j.getDay(u)) ||
                    (!kt.test(M) &&
                      ((k[1] && r == k[1] && i == k[0] - 1) ||
                        (!k[1] && r == k[0]))) ||
                    (kt.test(M) && E.getDay() == +M.replace('w', ''))) &&
                  ((y.apply = !0), (V[E] = !0)))
          for (p = 0; p < e.length; p++)
            if (
              ((y = e[p]),
              (c = 0),
              (T = 0),
              (v = be[s]),
              (b = ge[s]),
              (w = !0),
              (C = !0),
              (d = !1),
              y.start && (y.apply || (!y.d && !V[E])))
            ) {
              for (
                _ = y.start.split(':'), x = y.end.split(':'), g = 0;
                g < 3;
                g++
              )
                void 0 === _[g] && (_[g] = 0),
                  void 0 === x[g] && (x[g] = 59),
                  (_[g] = +_[g]),
                  (x[g] = +x[g])
              if ('tt' == s)
                (v = a(
                  Math.round(
                    (new Date(E).setHours(_[0], _[1], _[2]) -
                      new Date(E).setHours(0, 0, 0, 0)) /
                      1e3
                  ),
                  A,
                  0,
                  86400
                )),
                  (b = a(
                    Math.round(
                      (new Date(E).setHours(x[0], x[1], x[2]) -
                        new Date(E).setHours(0, 0, 0, 0)) /
                        1e3
                    ),
                    A,
                    0,
                    86400
                  ))
              else {
                for (
                  _.unshift(_[0] > 11 ? 1 : 0),
                    x.unshift(x[0] > 11 ? 1 : 0),
                    ne &&
                      (_[1] >= 12 && (_[1] = _[1] - 12),
                      x[1] >= 12 && (x[1] = x[1] - 12)),
                    g = 0;
                  g < t;
                  g++
                )
                  void 0 !== F[g] &&
                    ((D = a(_[g], ye[I[g]], be[I[g]], ge[I[g]])),
                    (S = a(x[g], ye[I[g]], be[I[g]], ge[I[g]])),
                    (m = 0),
                    (h = 0),
                    (f = 0),
                    ne &&
                      1 == g &&
                      ((m = _[0] ? 12 : 0),
                      (h = x[0] ? 12 : 0),
                      (f = F[0] ? 12 : 0)),
                    w || (D = 0),
                    C || (S = ge[I[g]]),
                    (w || C) &&
                      D + m < F[g] + f &&
                      F[g] + f < S + h &&
                      (d = !0),
                    F[g] != D && (w = !1),
                    F[g] != S && (C = !1))
                if (!l)
                  for (g = t + 1; g < 4; g++)
                    _[g] > 0 && (c = ye[s]), x[g] < ge[I[g]] && (T = ye[s])
                d ||
                  ((D = a(_[t], ye[s], be[s], ge[s]) + c),
                  (S = a(x[t], ye[s], be[s], ge[s]) - T),
                  w && (v = D),
                  C && (b = S))
              }
              if (w || C || d) for (g = v; g <= b; g += ye[s]) o[g] = !l
            }
        }
      }
      let A,
        E,
        I,
        L = {},
        H = {},
        N = {},
        F = [],
        R = T(Be(this)),
        q = Ge({}, e.settings),
        j = Ge(e.settings, Dt, St, R, q),
        z = j.preset,
        B =
          'datetime' == z
            ? j.dateFormat + j.separator + j.timeFormat
            : 'time' == z
            ? j.timeFormat
            : j.dateFormat,
        U = R.format || B,
        X = j.dateWheels || j.dateFormat,
        K = j.timeWheels || j.timeFormat,
        G = j.dateWheels || j.dateDisplay,
        Z = K,
        J = j.baseTheme || j.theme,
        Q = t(j.invalid),
        ee = t(j.valid),
        te = W(j.min, U, j),
        ae = W(j.max, U, j),
        se = /time/i.test(z),
        ne = /h/.test(Z),
        ie = /D/.test(G),
        re = j.steps || {},
        oe = re.hour || j.stepHour || 1,
        le = re.minute || j.stepMinute || 1,
        ce = re.second || j.stepSecond || 1,
        de = re.zeroBased,
        ue = de || !te ? 0 : te.getHours() % oe,
        me = de || !te ? 0 : te.getMinutes() % le,
        he = de || !te ? 0 : te.getSeconds() % ce,
        fe = s(oe, ue, ne ? 11 : 23),
        pe = s(le, me, 59),
        ve = s(le, me, 59),
        be = {
          y: te ? te.getFullYear() : -(1 / 0),
          m: 0,
          d: 1,
          h: ue,
          i: me,
          s: he,
          a: 0,
          tt: 0
        },
        ge = {
          y: ae ? ae.getFullYear() : 1 / 0,
          m: 11,
          d: 31,
          h: fe,
          i: pe,
          s: ve,
          a: 1,
          tt: 86400
        },
        ye = { y: 1, m: 1, d: 1, h: oe, i: le, s: ce, a: 1, tt: 1 },
        _e = {
          bootstrap: 46,
          ios: 50,
          material: 46,
          mobiscroll: 46,
          windows: 50
        },
        xe = { y: n, m: i, d: r, h: o, i: l, s: c, u: d, a: u, dd: m, tt: h }
      return (
        (e.getVal = function (t) {
          return e._hasValue || t ? $(v(e.getArrayVal(t)), j, U) : null
        }),
        (e.getDate = function (t) {
          return e._hasValue || t ? v(e.getArrayVal(t)) : null
        }),
        (e.setDate = function (t, a, s, n, i) {
          e.setArrayVal(b(t), a, i, n, s)
        }),
        (I = C()),
        (j.isoParts = N),
        (e._format = B),
        (e._order = L),
        (e.handlers.now = function () {
          e.setDate(new Date(), e.live, 1e3, !0, !0)
        }),
        (e.buttons.now = { text: j.nowText, icon: j.nowIcon, handler: 'now' }),
        {
          minWidth: E && se ? _e[J] : void 0,
          compClass: 'mbsc-dt',
          wheels: I,
          headerText:
            !!j.headerText &&
            function () {
              return P(B, v(e.getArrayVal(!0)), j)
            },
          formatValue: function (e) {
            return P(U, v(e), j)
          },
          parseValue: function (e) {
            return (
              e || (H = {}),
              b(W(e || j.defaultValue || new Date(), U, j, N), !!e)
            )
          },
          validate: function (t) {
            var a,
              s,
              n,
              i,
              r = t.values,
              o = t.index,
              l = t.direction,
              c = j.wheels[0][L.d],
              d = M(v(r), l),
              u = b(d),
              m = [],
              h = {},
              f = xe.y(d),
              p = xe.m(d),
              g = j.getMaxDayOfMonth(f, p),
              y = !0,
              _ = !0
            if (
              (Be.each(
                ['dd', 'y', 'm', 'd', 'tt', 'a', 'h', 'i', 's'],
                function (e, t) {
                  if (void 0 !== L[t]) {
                    var a = be[t],
                      n = ge[t],
                      i = xe[t](d)
                    if (
                      ((m[L[t]] = []),
                      y && te && (a = xe[t](te)),
                      _ && ae && (n = xe[t](ae)),
                      'y' != t && 'dd' != t)
                    )
                      for (s = be[t]; s <= ge[t]; s += ye[t])
                        (s < a || s > n) && m[L[t]].push(s)
                    if (
                      (i < a && (i = a),
                      i > n && (i = n),
                      y && (y = i == a),
                      _ && (_ = i == n),
                      'd' == t)
                    ) {
                      var r = j.getDate(f, p, 1).getDay(),
                        o = {}
                      S(Q, f, p, r, g, o, 1),
                        S(ee, f, p, r, g, o, 0),
                        Be.each(o, function (e, a) {
                          a && m[L[t]].push(e)
                        })
                    }
                  }
                }
              ),
              se &&
                Be.each(['a', 'h', 'i', 's', 'tt'], function (t, a) {
                  var s = xe[a](d),
                    n = xe.d(d),
                    i = {}
                  void 0 !== L[a] &&
                    (V(Q, t, a, f, p, n, i, 0),
                    V(ee, t, a, f, p, n, i, 1),
                    Be.each(i, function (e, t) {
                      t && m[L[a]].push(e)
                    }),
                    (F[t] = e.getValidValue(L[a], s, l, i)))
                }),
              c &&
                (c._length !== g ||
                  (ie && (void 0 === o || o === L.y || o === L.m))))
            ) {
              for (h[L.d] = c, c.data = [], a = 1; a <= g; a++)
                (i = j.getDate(f, p, a).getDay()),
                  (n = G.replace(/[my]/gi, '')
                    .replace(/dd/, (a < 10 ? '0' + a : a) + (j.daySuffix || ''))
                    .replace(/d/, a + (j.daySuffix || ''))),
                  c.data.push({
                    value: a,
                    display: /DD/.test(n)
                      ? n.replace(
                          /DD/,
                          '<span class="mbsc-dt-day">' +
                            j.dayNames[i] +
                            '</span>'
                        )
                      : n.replace(
                          /D/,
                          '<span class="mbsc-dt-day">' +
                            j.dayNamesShort[i] +
                            '</span>'
                        )
                  })
              ;(e._tempWheelArray[L.d] = u[L.d]), e.changeWheel(h)
            }
            return { disabled: m, valid: u }
          }
        }
      )
    }
  ;(bt.date = Vt),
    (bt.time = Vt),
    (bt.datetime = Vt),
    o('date', xt),
    o('time', xt),
    o('datetime', xt)
  let At = { invalid: [], showInput: !0, inputClass: '', itemSelector: 'li' },
    Et = function (e) {
      function t(e, t, s) {
        for (let n = 0, i = []; n < e; ) (i[n] = a(s, n, t)), n++
        return i
      }
      function a(e, t, a) {
        for (let s, n = 0, i = a, r = []; n < t; ) {
          let o = e[n]
          for (s in i)
            if (i[s].key == o) {
              i = i[s].children
              break
            }
          n++
        }
        for (n = 0; n < i.length; ) i[n].invalid && r.push(i[n].key), n++
        return r
      }
      function s(e, t) {
        for (let a = []; e; ) a[--e] = !0
        return (a[t] = !1), a
      }
      function n(e) {
        let t,
          a = []
        for (t = 0; t < e; t++) a[t] = b.labels && b.labels[t] ? b.labels[t] : t
        return a
      }
      function i(e, t, a) {
        let s,
          n,
          i,
          l = 0,
          c = [[]],
          d = k
        if (t) for (s = 0; s < t; s++) y ? (c[0][s] = {}) : (c[s] = [{}])
        for (; l < e.length; ) {
          for (
            y ? (c[0][l] = o(d, D[l])) : (c[l] = [o(d, D[l])]),
              s = 0,
              i = void 0;
            s < d.length && void 0 === i;

          )
            d[s].key == e[l] &&
              ((void 0 !== a && l <= a) || void 0 === a) &&
              (i = s),
              s++
          if (void 0 !== i && d[i].children) l++, (d = d[i].children)
          else {
            if (!(n = r(d)) || !n.children) return c
            l++, (d = n.children)
          }
        }
        return c
      }
      function r(e, t) {
        if (!e) return !1
        for (let a, s = 0; s < e.length; )
          if (!(a = e[s++]).invalid) return t ? s - 1 : a
        return !1
      }
      function o(e, t) {
        for (let a = { data: [], label: t }, s = 0; s < e.length; )
          a.data.push({ value: e[s].key, display: e[s].value }), s++
        return a
      }
      function l(t) {
        e._isVisible &&
          Be('.mbsc-sc-whl-w', e._markup).css('display', '').slice(t).hide()
      }
      function c(e) {
        for (let t, a = [], s = e, n = !0, i = 0; n; )
          (t = r(s)), (a[i++] = t.key), (n = t.children), n && (s = n)
        return a
      }
      function d(e, t) {
        let a,
          s,
          n,
          i = [],
          o = k,
          l = 0,
          c = !1
        if (void 0 !== e[l] && l <= t)
          for (a = 0, s = e[l], n = void 0; a < o.length && void 0 === n; )
            o[a].key != e[l] || o[a].invalid || (n = a), a++
        else (n = r(o, !0)), (s = o[n] && o[n].key)
        for (c = !!o[n] && o[n].children, i[l] = s; c; ) {
          if (
            ((o = o[n].children),
            l++,
            (c = !1),
            (n = void 0),
            void 0 !== e[l] && l <= t)
          )
            for (a = 0, s = e[l], n = void 0; a < o.length && void 0 === n; )
              o[a].key != e[l] || o[a].invalid || (n = a), a++
          else (n = r(o, !0)), (n = n === !1 ? void 0 : n), (s = o[n].key)
          ;(c = !(void 0 === n || !r(o[n].children)) && o[n].children),
            (i[l] = s)
        }
        return { lvl: l + 1, nVector: i }
      }
      function u(t) {
        let a = []
        C = C > T++ ? C : T
        let s = t.length > 1 ? t : t.children(b.itemSelector)
        return (
          s.each(function (t) {
            var s = Be(this),
              n = s.clone()
            n.children('ul,ol').remove(), n.children(b.itemSelector).remove()
            var i = e._processMarkup
                ? e._processMarkup(n)
                : n
                    .html()
                    .replace(/^\s\s*/, '')
                    .replace(/\s\s*$/, ''),
              r = !!s.attr('data-invalid'),
              o = {
                key:
                  void 0 === s.attr('data-val') || null === s.attr('data-val')
                    ? t
                    : s.attr('data-val'),
                value: i,
                invalid: r,
                children: null
              },
              l =
                'li' === b.itemSelector
                  ? s.children('ul,ol')
                  : s.children(b.itemSelector)
            l.length && (o.children = u(l)), a.push(o)
          }),
          T--,
          a
        )
      }
      function m(t, a, s) {
        let n,
          r = (a || 0) + 1,
          o = [],
          c = {},
          d = {}
        for (c = i(t, null, a), n = 0; n < t.length; n++)
          e._tempWheelArray[n] = t[n] = s.nVector[n] || 0
        for (; r < s.lvl; ) (d[r] = y ? c[0][r] : c[r][0]), o.push(r++)
        l(s.lvl), (M = t.slice(0)), o.length && ((f = !0), e.changeWheel(d))
      }
      let h,
        f,
        p,
        v = Ge({}, e.settings),
        b = Ge(e.settings, At, v),
        g = b.layout || (/top|bottom/.test(b.display) ? 'liquid' : ''),
        y = 'liquid' == g,
        _ = b.readonly,
        x = Be(this),
        w = this.id + '_dummy',
        C = 0,
        T = 0,
        M = [],
        k = b.wheelArray || u(x),
        D = n(C),
        S = c(k),
        V = i(S, C)
      return (
        Be('#' + w).remove(),
        b.input
          ? (h = Be(b.input))
          : b.showInput &&
            (h = Be(
              '<input type="text" id="' +
                w +
                '" value="" class="' +
                b.inputClass +
                '" placeholder="' +
                (b.placeholder || '') +
                '" readonly />'
            ).insertBefore(x)),
        h && e.attachShow(h),
        b.wheelArray || x.hide(),
        {
          wheels: V,
          anchor: h,
          layout: g,
          headerText: !1,
          setOnTap: 1 == C,
          formatValue: function (e) {
            return (
              void 0 === p && (p = d(e, e.length).lvl), e.slice(0, p).join(' ')
            )
          },
          parseValue: function (e) {
            return e ? (e + '').split(' ') : (b.defaultValue || S).slice(0)
          },
          onBeforeShow: function () {
            var t = e.getArrayVal(!0)
            ;(M = t.slice(0)), (b.wheels = i(t, C, C)), (f = !0)
          },
          onWheelGestureStart: function (e) {
            b.readonly = s(C, e.index)
          },
          onWheelAnimationEnd: function (t) {
            var a = t.index,
              s = e.getArrayVal(!0),
              n = d(s, a)
            ;(p = n.lvl), (b.readonly = _), s[a] != M[a] && m(s, a, n)
          },
          onFill: function (e) {
            ;(p = void 0), h && h.val(e.valueText)
          },
          validate: function (e) {
            var a = e.values,
              s = e.index,
              n = d(a, a.length)
            return (
              (p = n.lvl),
              void 0 === s && (l(n.lvl), f || m(a, s, n)),
              (f = !1),
              { disabled: t(p, k, a) }
            )
          },
          onDestroy: function () {
            h && Be('#' + w).remove(), x.show()
          }
        }
      )
    }
  ;(bt.image = function (e) {
    return (
      e.settings.enhance &&
        (e._processMarkup = function (e) {
          var t = e.attr('data-icon')
          return (
            e.children().each(function (e, t) {
              ;(t = Be(t)),
                t.is('img')
                  ? Be('<div class="mbsc-img-c"></div>')
                      .insertAfter(t)
                      .append(t.addClass('mbsc-img'))
                  : t.is('p') && t.addClass('mbsc-img-txt')
            }),
            t && e.prepend('<div class="mbsc-ic mbsc-ic-' + t + '"></div'),
            e.html('<div class="mbsc-img-w">' + e.html() + '</div>'),
            e.html()
          )
        }),
      Et.call(this, e)
    )
  }),
    o('image', xt),
    (bt.treelist = Et),
    o('treelist', xt) /* eslint-disable no-unused-vars */
  let It = {
      controls: ['calendar'],
      firstDay: 0,
      weekDays: 'short',
      maxMonthWidth: 170,
      breakPointMd: 768,
      months: 1,
      pageBuffer: 1,
      weeks: 6,
      highlight: !0,
      outerMonthChange: !0,
      quickNav: !0,
      yearChange: !0,
      tabs: 'auto',
      todayClass: 'mbsc-cal-today',
      btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left6',
      btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right6',
      dateText: 'Date',
      timeText: 'Time',
      todayText: 'Today',
      prevMonthText: 'Previous Month',
      nextMonthText: 'Next Month',
      prevYearText: 'Previous Year',
      nextYearText: 'Next Year'
    },
    Lt = function (e) {
      function t(t) {
        t.hasClass('mbsc-cal-h') &&
          (t.removeClass('mbsc-cal-h'), e._onSelectShow())
      }
      function a(e) {
        e.hasClass('mbsc-cal-h') || e.addClass('mbsc-cal-h')
      }
      function s(e) {
        e.hasClass('mbsc-cal-h') ? t(e) : a(e)
      }
      function n() {
        let t, a, s
        ;(oe = {}),
          (le = []),
          (Xe = e.trigger),
          (B = Be(nt)),
          (s = Ge({}, e.settings)),
          (ze = Ge(e.settings, It, s)),
          (t = ze.controls.join(',')),
          (Te = ze.rtl),
          ($e = ze.pageBuffer),
          (Je = ze.weekCounter),
          (se = ze.weeks),
          (Ce = 6 == se),
          (Me = 'vertical' == ze.calendarScroll),
          (re =
            'inline' == ze.display
              ? B.is('div')
                ? B
                : B.parent()
              : e._$window),
          (Qe =
            'full' == ze.weekDays
              ? ''
              : 'min' == ze.weekDays
              ? 'Min'
              : 'Short'),
          (a =
            ze.layout ||
            (/top|bottom|inline/.test(ze.display) ? 'liquid' : '')),
          (we = 'liquid' == a),
          (ie = we ? null : ze.calendarWidth),
          (je = Te && !Me ? -1 : 1),
          (ce = 'mbsc-disabled ' + (ze.disabledClass || '')),
          (ue = 'mbsc-selected ' + (ze.selectedTabClass || '')),
          (de = 'mbsc-selected ' + (ze.selectedClass || '')),
          t.match(/calendar/) && ((oe.calendar = 1), (ve = !0)),
          t.match(/date/) && !ve && (oe.date = 1),
          t.match(/time/) && (oe.time = 1),
          ze.controls.forEach(function (e) {
            oe[e] && le.push(e)
          }),
          (ye = ze.quickNav && ve && Ce),
          (et = ze.yearChange && Ce),
          we && ve && 'center' == ze.display && (e._isFullScreen = !0),
          (ze.layout = a),
          (ze.preset = (oe.date || ve ? 'date' : '') + (oe.time ? 'time' : ''))
      }
      function i() {
        ;(Ye = et ? ze.monthNamesShort : ze.monthNames),
          (st = ze.yearSuffix || ''),
          (Pe = (ze.dateWheels || ze.dateFormat).search(/m/i)),
          (tt = (ze.dateWheels || ze.dateFormat).search(/y/i)),
          (pe = e._format),
          ze.min &&
            ((Ee = H(W(ze.min, pe, ze))),
            (Oe = ze.getYear(Ee)),
            (Le = ze.getMonth(Ee)),
            (Ie = ze.getDate(12 * Math.floor(Oe / 12), 0, 1))),
          ze.max &&
            ((De = H(W(ze.max, pe, ze))),
            (Ae = ze.getYear(De)),
            (Ve = ze.getMonth(De)),
            (Se = ze.getDate(12 * Math.floor(Ae / 12), 0, 1)))
      }
      function r(e, t, a) {
        ;(e[t] = e[t] || []), e[t].push(a)
      }
      function o(e, t, a) {
        let s,
          n,
          i,
          o,
          l = ze.getYear(t),
          c = ze.getMonth(t),
          d = {}
        return (
          e &&
            Be.each(e, function (e, u) {
              if (((s = u.d || u.start || u), (n = s + ''), u.start && u.end))
                for (
                  o = H(W(u.start, pe, ze)), i = H(W(u.end, pe, ze));
                  o <= i;

                )
                  r(d, o, u), o.setDate(o.getDate() + 1)
              else if (kt.test(n)) {
                var m = +n.replace('w', ''),
                  h = 0,
                  f = t.getDay()
                for (
                  ze.firstDay - f + 1 > 1 && (h = 7),
                    o = ze.getDate(l, c, m - h - f + ze.getDay(t));
                  o <= a;

                )
                  r(d, o, u), o.setDate(o.getDate() + 7)
              } else if (Mt.test(n))
                if (((n = n.split('/')), n[1]))
                  for (o = ze.getDate(l, n[0] - 1, n[1]); o <= a; )
                    r(d, o, u),
                      (o = ze.getDate(ze.getYear(o) + 1, ze.getMonth(o), n[0]))
                else
                  for (o = ze.getDate(l, c, n[0]); o <= a; )
                    r(d, o, u),
                      (o = ze.getDate(ze.getYear(o), ze.getMonth(o) + 1, n[0]))
              else r(d, H(W(s, pe, ze)), u)
            }),
          d
        )
      }
      function c(e) {
        return !(e < Ee) && !(e > De) && (void 0 === _e[e] || void 0 !== Ke[e])
      }
      function d(t) {
        let a,
          s,
          n,
          i,
          r,
          o,
          l,
          c = !!ke[t] && ke[t],
          d = c && c[0].background,
          u = '',
          m = ''
        if (c) {
          for (r = '<div class="mbsc-cal-marks">', a = 0; a < c.length; a++)
            (i = c[a]),
              (u += (i.cssClass || '') + ' '),
              (r +=
                '<div class="mbsc-cal-mark"' +
                (i.color ? ' style="background:' + i.color + ';"' : '') +
                '></div>'),
              i.icon &&
                (m +=
                  '<span class="mbsc-ic mbsc-ic-' +
                  i.icon +
                  '"' +
                  (i.text
                    ? ''
                    : i.color
                    ? ' style="color:' + i.color + ';"'
                    : '') +
                  '></span>\n')
          ;(r += '</div>'),
            ge &&
              (c[0] && ((s = c[0].text), (n = c[0].color)),
              s
                ? (o =
                    '<div class="mbsc-cal-txt" title="' +
                    Be('<div>' + s + '</div>').text() +
                    '"' +
                    (n
                      ? ' style="background:' + n + ';color:' + I(n) + ';"'
                      : '') +
                    '>' +
                    m +
                    s +
                    '</div>')
                : m &&
                  (o =
                    '<div class="mbsc-cal-txt mbsc-cal-icons">' + m + '</div>'))
        }
        return (
          (l = {
            marked: c,
            background: d,
            cssClass: u,
            ariaLabel: ge ? s : '',
            markup: ge ? o : be ? r : ''
          }),
          Ge(l, e._getDayProps(t, l))
        )
      }
      function u(e) {
        return (
          ' style="' +
          (Me
            ? 'transform: translateY(' + 100 * e + '%)'
            : 'left:' + 100 * e * je + '%') +
          '"'
        )
      }
      function m() {
        ;(We =
          'auto' == ze.months
            ? Math.max(1, Math.min(3, Math.floor((ie || R(re)) / 280)))
            : +ze.months),
          (qe = We + 2 * $e),
          (Re = Math.round(We / 2) - 1),
          (Me = Me && We < 2),
          (Ue = void 0 === ze.showOuterDays ? We < 2 && !Me : ze.showOuterDays),
          (ne = ie || 280 * We)
      }
      function h(t) {
        let a = P(t, -Re - $e),
          s = P(t, -Re + We + $e)
        ;(_e = o(ze.invalid, a, s)),
          (Ke = o(ze.valid, a, s)),
          (ke = o(ze.labels || ze.events || ze.marked || ze.colors, a, s)),
          e._onGenMonth(a, s)
      }
      function f(e) {
        let t = ze.getYear(e),
          a = ze.getMonth(e)
        ;(me = e),
          (te = e),
          k(e),
          Xe('onMonthChange', { year: t, month: a }),
          Xe('onMonthLoading', { year: t, month: a }),
          Xe('onPageChange', { firstDay: e }),
          Xe('onPageLoading', { firstDay: e }),
          h(e)
      }
      function p(e) {
        let t = ze.getYear(e),
          a = ze.getMonth(e)
        void 0 !== Fe && x(e, Fe, !0),
          Be('.mbsc-cal-slide', fe.$scroller).removeClass('mbsc-cal-slide-a'),
          Be('.mbsc-cal-slide', fe.$scroller)
            .slice($e, $e + We)
            .addClass('mbsc-cal-slide-a'),
          void 0 === Fe &&
            (Xe('onMonthLoaded', { year: t, month: a }),
            Xe('onPageLoaded', { firstDay: e })),
          w(te, fe.focus),
          (fe.focus = !1)
      }
      function v() {
        let e, t
        return (
          (e =
            '<div class="mbsc-cal-tabs-c"><ul class="mbsc-cal-tabs" role="tablist">'),
          le.forEach(function (a, s) {
            ;(t = ze[('calendar' == a ? 'date' : a) + 'Text']),
              (e +=
                '<li role="tab" aria-controls="' +
                (nt.id + '-mbsc-pnl-' + s) +
                '" class="mbsc-cal-tab mbsc-fr-btn-e ' +
                (s ? '' : ue) +
                '" data-control="' +
                a +
                '"' +
                (ze.tabLink
                  ? '><a href="#">' + t + '</a>'
                  : ' tabindex="0">' + t) +
                '</li>')
          }),
          (e += '</ul></div>')
        )
      }
      function b() {
        let e,
          t,
          a,
          s,
          n = '',
          i = Te ? ze.btnCalNextClass : ze.btnCalPrevClass,
          r = Te ? ze.btnCalPrevClass : ze.btnCalNextClass
        for (
          s =
            '<div class="mbsc-cal-btn-w"><div data-step="-1" role="button" tabindex="0" aria-label="' +
            ze.prevMonthText +
            '" class="' +
            i +
            ' mbsc-cal-prev mbsc-cal-prev-m mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"></div>',
            t = 0;
          t < (se ? We : 1);
          t++
        )
          s += '<div role="button" class="mbsc-cal-month"></div>'
        if (
          ((s +=
            '<div data-step="1" role="button" tabindex="0" aria-label="' +
            ze.nextMonthText +
            '" class="' +
            r +
            ' mbsc-cal-next mbsc-cal-next-m mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"></div></div>'),
          et &&
            (n =
              '<div class="mbsc-cal-btn-w"><div data-step="-12" role="button" tabindex="0" aria-label="' +
              ze.prevYearText +
              '" class="' +
              i +
              ' mbsc-cal-prev mbsc-cal-prev-y mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"></div><div role="button" class="mbsc-cal-year"></div><div data-step="12" role="button" tabindex="0" aria-label="' +
              ze.nextYearText +
              '" class="' +
              r +
              ' mbsc-cal-next mbsc-cal-next-y mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"></div></div>'),
          (e =
            '<div class="mbsc-w-p mbsc-cal-c"><div class="mbsc-cal ' +
            (Ce ? '' : ' mbsc-cal-week-view') +
            (We > 1 ? ' mbsc-cal-multi ' : '') +
            (Je ? ' mbsc-cal-weeks ' : '') +
            (Me ? ' mbsc-cal-vertical' : '') +
            (be ? ' mbsc-cal-has-marks' : '') +
            (ge ? ' mbsc-cal-has-txt' : '') +
            (Ue ? '' : ' mbsc-cal-hide-diff ') +
            (ze.calendarClass || '') +
            '"' +
            (we ? '' : ' style="min-width:' + (ie || 280 * We) + 'px;"') +
            '><div class="mbsc-cal-hdr">' +
            (tt < Pe || We > 1 ? n + s : s + n) +
            '</div>'),
          se)
        ) {
          for (
            e +=
              '<div class="mbsc-cal-body"><div class="mbsc-cal-day-picker"><div class="mbsc-cal-days-c">',
              a = 0;
            a < We;
            a++
          ) {
            for (e += '<div class="mbsc-cal-days">', t = 0; t < 7; t++)
              e +=
                '<div aria-label="' +
                ze.dayNames[(t + ze.firstDay) % 7] +
                '">' +
                ze['dayNames' + Qe][(t + ze.firstDay) % 7] +
                '</div>'
            e += '</div>'
          }
          e +=
            '</div><div class="mbsc-cal-scroll-c mbsc-cal-day-scroll-c ' +
            (ze.calendarClass || '') +
            '"' +
            (ze.calendarHeight
              ? ' style="height:' + ze.calendarHeight + 'px"'
              : '') +
            '><div class="mbsc-cal-scroll" style="width:' +
            100 / We +
            '%">' +
            x(me) +
            '</div></div>'
        }
        if (((e += '</div>'), ye)) {
          for (
            e +=
              '<div class="mbsc-cal-month-picker mbsc-cal-picker mbsc-cal-h"><div class="mbsc-cal-scroll-c ' +
              (ze.calendarClass || '') +
              '"><div class="mbsc-cal-scroll">',
              t = 0;
            t < 3;
            t++
          ) {
            for (
              e +=
                '<div class="mbsc-cal-slide"' +
                u(t - 1) +
                '><div role="grid" class="mbsc-cal-table"><div class="mbsc-cal-row">',
                a = 0;
              a < 12;
              a++
            )
              a && a % 3 === 0 && (e += '</div><div class="mbsc-cal-row">'),
                (e +=
                  '<div role="gridcell"' +
                  (1 == t
                    ? ' tabindex="-1" aria-label="' +
                      ze.monthNames[a] +
                      '" data-val="' +
                      a +
                      '"'
                    : '') +
                  ' class="mbsc-cal-cell' +
                  (1 == t ? ' mbsc-btn-e' : '') +
                  '"><div class="mbsc-cal-cell-i mbsc-cal-cell-txt">' +
                  (1 == t ? ze.monthNamesShort[a] : '&nbsp;') +
                  '</div></div>')
            e += '</div></div></div>'
          }
          for (
            e += '</div></div></div>',
              e +=
                '<div class="mbsc-cal-year-picker mbsc-cal-picker mbsc-cal-h"><div class="mbsc-cal-scroll-c ' +
                (ze.calendarClass || '') +
                '"><div class="mbsc-cal-scroll">',
              t = -1;
            t < 2;
            t++
          )
            e += g(Y(me, t), t)
          e += '</div></div></div>'
        }
        return (e += '</div></div></div>')
      }
      function g(e, t) {
        let a,
          s = ze.getYear(e),
          n =
            '<div class="mbsc-cal-slide"' +
            u(t) +
            '><div role="grid" class="mbsc-cal-table"><div class="mbsc-cal-row">'
        for (a = 0; a < 12; a++)
          a && a % 3 === 0 && (n += '</div><div class="mbsc-cal-row">'),
            (n +=
              '<div role="gridcell" tabindex="-1" aria-label="' +
              s +
              '" data-val="' +
              s +
              '" class="mbsc-cal-cell mbsc-btn-e ' +
              (s < Oe || s > Ae ? ' mbsc-disabled ' : '') +
              (s == ze.getYear(me) ? de : '') +
              '"><div class="mbsc-cal-cell-i mbsc-cal-cell-txt">' +
              s +
              st +
              '</div></div>'),
            s++
        return (n += '</div></div></div>')
      }
      function _(t, a) {
        let s,
          n,
          i,
          r,
          o,
          l,
          m,
          h,
          f,
          p,
          v,
          b,
          g,
          y,
          _,
          x,
          w = 1,
          C = 0,
          T = ze.getYear(t),
          M = ze.getMonth(t),
          k = ze.getDay(t),
          D = null !== ze.defaultValue || e._hasValue ? e.getDate(!0) : null,
          S = ze.getDate(T, M, k).getDay(),
          V =
            '<div class="mbsc-cal-slide"' +
            u(a) +
            '><div role="grid" class="mbsc-cal-table"><div class="mbsc-cal-row">'
        for (ze.firstDay - S > 0 && (C = 7), x = 0; x < 7 * se; x++)
          (_ = x + ze.firstDay - C),
            (s = ze.getDate(T, M, _ - S + k)),
            (i = s.getFullYear()),
            (r = s.getMonth()),
            (o = s.getDate()),
            (l = ze.getMonth(s)),
            (m = ze.getDay(s)),
            (y = ze.getMaxDayOfMonth(i, r)),
            (h = i + '-' + (r + 1) + '-' + o),
            (f = Ge(
              {
                valid: c(s),
                selected:
                  D &&
                  D.getFullYear() === i &&
                  D.getMonth() === r &&
                  D.getDate() === o
              },
              d(s)
            )),
            (p = f.valid),
            (v = f.selected),
            (n = f.cssClass),
            (b =
              new Date(s).setHours(12, 0, 0, 0) ===
              new Date().setHours(12, 0, 0, 0)),
            (g = l !== M),
            (he[h] = f),
            x && x % 7 === 0 && (V += '</div><div class="mbsc-cal-row">'),
            Je &&
              x % 7 === 0 &&
              ('month' == Je && g && w > 1
                ? (w = 1 == o ? 1 : 2)
                : 'year' == Je &&
                  (w = ze.getWeekNumber(
                    ze.getDate(i, r, o + ((7 - ze.firstDay + 1) % 7))
                  )),
              (V +=
                '<div role="gridcell" class="mbsc-cal-cell mbsc-cal-week-nr">' +
                w +
                '</div>'),
              w++),
            (V +=
              '<div role="gridcell" tabindex="-1" aria-label="' +
              (b ? ze.todayText + ', ' : '') +
              ze.dayNames[s.getDay()] +
              ', ' +
              ze.monthNames[l] +
              ' ' +
              m +
              ' ' +
              (f.ariaLabel ? ', ' + f.ariaLabel : '') +
              '"' +
              (g && !Ue ? ' aria-hidden="true"' : ' data-full="' + h + '"') +
              (v ? ' aria-selected="true"' : '') +
              (p ? '' : ' aria-disabled="true"') +
              ' class="mbsc-cal-cell mbsc-cal-day mbsc-cal-day' +
              (_ % 7) +
              ' ' +
              (ze.dayClass || '') +
              ' ' +
              (v ? de : '') +
              (b ? ' ' + ze.todayClass : '') +
              (n ? ' ' + n : '') +
              (1 == m ? ' mbsc-cal-day-first' : '') +
              (m == y ? ' mbsc-cal-day-last' : '') +
              (g ? ' mbsc-cal-day-diff' : '') +
              (p ? ' mbsc-btn-e' : ' mbsc-disabled') +
              (f.marked ? ' mbsc-cal-day-marked' : '') +
              (f.background ? ' mbsc-cal-day-colored' : '') +
              '"><div class="mbsc-cal-cell-i mbsc-cal-day-i"><div class="mbsc-cal-day-date mbsc-cal-cell-txt"' +
              (f.background
                ? ' style="background:' +
                  f.background +
                  ';color:' +
                  I(f.background) +
                  '"'
                : '') +
              '>' +
              m +
              '</div>' +
              (f.markup || '') +
              '</div></div>')
        return (V += '</div></div></div>')
      }
      function x(e, t, a) {
        let s,
          n = ze.getYear(e),
          i = ze.getMonth(e),
          r = fe ? fe.pos : 0,
          o = ''
        if (se)
          for (
            t ||
              (Xe('onMonthLoading', { year: n, month: i }),
              Xe('onPageLoading', { firstDay: e })),
              h(e),
              s = 0;
            s < qe;
            s++
          )
            o += _(P(e, s - Re - $e), r + s - $e)
        return (
          (Fe = void 0),
          a &&
            fe &&
            (fe.$scroller.html(o),
            Xe('onMonthLoaded', { year: n, month: i }),
            Xe('onPageLoaded', { firstDay: e })),
          o
        )
      }
      function w(e, t) {
        fe.$active && fe.$active.attr('tabindex', '-1'),
          (fe.$active = Be(
            '.mbsc-cal-slide-a .mbsc-cal-day[data-full="' +
              e.getFullYear() +
              '-' +
              (e.getMonth() + 1) +
              '-' +
              e.getDate() +
              '"]',
            fe.$scroller
          ).attr('tabindex', '0')),
          t && fe.$active.length && fe.$active[0].focus()
      }
      function C(t) {
        let a = fe && fe.$scroller
        ze.highlight &&
          fe &&
          (Be('.mbsc-selected', a).removeClass(de).removeAttr('aria-selected'),
          (null !== ze.defaultValue || e._hasValue) &&
            Be(
              '.mbsc-cal-day[data-full="' +
                t.getFullYear() +
                '-' +
                (t.getMonth() + 1) +
                '-' +
                t.getDate() +
                '"]',
              a
            )
              .addClass(de)
              .attr('aria-selected', 'true'))
      }
      function T(e, t) {
        Be('.mbsc-selected', t).removeClass(de).removeAttr('aria-selected'),
          Be('.mbsc-cal-cell[data-val="' + e + '"]', t)
            .addClass(de)
            .attr('aria-selected', 'true')
      }
      function M(t, a, s, n) {
        let i, r
        t < Ee && (t = Ee),
          t > De && (t = De),
          ('calendar' === Ze || a) &&
            (ve &&
              se &&
              ((r = E(t)),
              Ne &&
                (t < P(me, -Re) || t >= P(me, We - Re)) &&
                ((i = Ce
                  ? ze.getMonth(t) -
                    ze.getMonth(me) +
                    12 * (ze.getYear(t) - ze.getYear(me))
                  : Math.trunc(Math.round((r - me) / 864e5) / (7 * se))),
                i &&
                  ((fe.queue = []),
                  (fe.focus = n && s),
                  (e._isSetDate = !0),
                  N(fe, i, s),
                  (e._isSetDate = !1))),
              (i && s) || w(t, n),
              a || C(t),
              Ce || k(t, !0),
              (te = t),
              (Ne = !0)),
            e._onSetDate(t, i))
      }
      function k(e, t) {
        let a,
          s,
          n,
          i = ze.getYear(e),
          r = ze.getMonth(e),
          o = i + st
        if (ye) {
          if (
            (T(r, He.$scroller),
            T(i, at.$scroller),
            N(
              at,
              Math.floor(i / 12) - Math.floor(ze.getYear(at.first) / 12),
              !0
            ),
            Be('.mbsc-cal-cell', He.$scroller).removeClass('mbsc-disabled'),
            i === Oe)
          )
            for (a = 0; a < Le; a++)
              Be('.mbsc-cal-cell[data-val="' + a + '"]', He.$scroller).addClass(
                'mbsc-disabled'
              )
          if (i === Ae)
            for (a = Ve + 1; a <= 12; a++)
              Be('.mbsc-cal-cell[data-val="' + a + '"]', He.$scroller).addClass(
                'mbsc-disabled'
              )
        }
        for (
          t ||
            (D(Be('.mbsc-cal-prev-m', X), P(e, -Re) <= Ee),
            D(Be('.mbsc-cal-next-m', X), P(e, We - Re) > De),
            D(Be('.mbsc-cal-prev-y', X), ze.getDate(i - 1, r + 1, 1) <= Ee),
            D(Be('.mbsc-cal-next-y', X), ze.getDate(i + 1, r, 1) > De)),
            Q.attr('aria-label', i).html(o),
            a = 0;
          a < We;
          a++
        )
          (e = ze.getDate(i, r - Re + a, 1)),
            (s = ze.getYear(e)),
            (n = ze.getMonth(e)),
            (o = s + st),
            K.eq(a)
              .attr('aria-label', ze.monthNames[n] + (et ? '' : ' ' + i))
              .html(
                (!et && tt < Pe ? o + ' ' : '') +
                  Ye[n] +
                  (!et && tt > Pe ? ' ' + o : '')
              )
      }
      function D(e, t) {
        t
          ? e.addClass(ce).attr('aria-disabled', 'true')
          : e.removeClass(ce).removeAttr('aria-disabled')
      }
      function S(t) {
        let a = e.getDate(!0),
          s = t.attr('data-full'),
          n = s ? s.split('-') : [],
          i = O(n[0], n[1] - 1, n[2]),
          r = O(
            i.getFullYear(),
            i.getMonth(),
            i.getDate(),
            a.getHours(),
            a.getMinutes(),
            a.getSeconds()
          ),
          o = t.hasClass('mbsc-selected')
        ;(!Ue && t.hasClass('mbsc-cal-day-diff')) ||
          Xe(
            'onDayChange',
            Ge(he[s], { date: r, target: t[0], selected: o })
          ) === !1 ||
          ze.readonly ||
          t.hasClass('mbsc-disabled') ||
          e._selectDay(t, i, r, o)
      }
      function V(e) {
        a(G), M(ze.getDate(ze.getYear(fe.first), e.attr('data-val'), 1), !0, !0)
      }
      function A(e) {
        a(ee),
          M(ze.getDate(e.attr('data-val'), ze.getMonth(fe.first), 1), !0, !0)
      }
      function E(e) {
        let t = ze.getYear(e),
          a = ze.getMonth(e),
          s = e.getDay(),
          n = 0
        return (
          ze.firstDay - s > 0 && (n = 7),
          Ce
            ? ze.getDate(t, a, 1)
            : ze.getDate(t, a, ze.firstDay - n - s + ze.getDay(e))
        )
      }
      function P(e, t) {
        let a = ze.getYear(e),
          s = ze.getMonth(e),
          n = ze.getDay(e)
        return Ce ? ze.getDate(a, s + t, 1) : ze.getDate(a, s, n + t * se * 7)
      }
      function Y(e, t) {
        let a = 12 * Math.floor(ze.getYear(e) / 12)
        return ze.getDate(a + 12 * t, 0, 1)
      }
      function N(t, a, s, n) {
        a &&
          e._isVisible &&
          (t.queue.push(arguments), 1 == t.queue.length && F(t, a, s, n))
      }
      function F(e, t, a, s) {
        let n,
          i,
          r = '',
          o = e.$scroller,
          l = e.buffer,
          c = e.offset,
          d = e.pages,
          u = e.total,
          m = e.first,
          h = e.genPage,
          f = e.getFirst,
          p = t > 0 ? Math.min(t, l) : Math.max(t, -l),
          v = e.pos * je + p - t + c,
          b = Math.abs(t) > l
        e.callback && (e.load(), e.callback()),
          (e.first = f(m, t)),
          (e.pos += p * je),
          (e.changing = !0),
          (e.load = function () {
            if (b) {
              for (n = 0; n < d; n++) (i = t + n - c), (r += h(f(m, i), v + i))
              t > 0
                ? (Be('.mbsc-cal-slide', o).slice(-d).remove(), o.append(r))
                : t < 0 &&
                  (Be('.mbsc-cal-slide', o).slice(0, d).remove(), o.prepend(r))
            }
          }),
          (e.callback = function () {
            var a = Math.abs(p),
              r = ''
            for (n = 0; n < a; n++)
              (i = t + n - c - l + (t > 0 ? u - a : 0)),
                (r += h(f(m, i), v + i))
            if (
              (t > 0
                ? (o.append(r), Be('.mbsc-cal-slide', o).slice(0, p).remove())
                : t < 0 &&
                  (o.prepend(r), Be('.mbsc-cal-slide', o).slice(p).remove()),
              b)
            ) {
              for (r = '', n = 0; n < a; n++)
                (i = t + n - c - l + (t > 0 ? 0 : u - a)),
                  (r += h(f(m, i), v + i))
              t > 0
                ? (Be('.mbsc-cal-slide', o).slice(0, p).remove(), o.prepend(r))
                : t < 0 &&
                  (Be('.mbsc-cal-slide', o).slice(p).remove(), o.append(r))
            }
            q(e),
              s && s(),
              (e.callback = null),
              (e.load = null),
              e.queue.shift(),
              (b = !1),
              e.queue.length
                ? F.apply(this, e.queue[0])
                : ((e.changing = !1), e.onAfterChange(e.first))
          }),
          e.onBeforeChange(e.first),
          e.load(),
          e.scroller.scroll(-e.pos * e.size, a ? 200 : 0, !1, e.callback)
      }
      function $(t, a, s, n, i, r, o, l, c, d, u, m, h) {
        let f = Me ? 'Y' : 'X',
          p = {
            $scroller: Be('.mbsc-cal-scroll', t),
            queue: [],
            buffer: n,
            offset: i,
            pages: r,
            first: l,
            total: o,
            pos: 0,
            min: a,
            max: s,
            genPage: m,
            getFirst: h,
            onBeforeChange: d,
            onAfterChange: u
          }
        return (
          (p.scroller = new vt(t, {
            axis: f,
            easing: '',
            contSize: 0,
            maxSnapScroll: n,
            mousewheel: ze.mousewheel,
            time: 200,
            lock: !0,
            rtl: Te,
            stopProp: !1,
            minScroll: 0,
            maxScroll: 0,
            onBtnTap: function (e) {
              'touchend' == e.domEvent.type && y(), c(Be(e.target))
            },
            onAnimationEnd: function (e) {
              m &&
                N(p, Math.round((-p.pos * p.size - e['pos' + f]) / p.size) * je)
            }
          })),
          e._scrollers.push(p.scroller),
          p
        )
      }
      function q(e) {
        let t,
          a = 0,
          s = 0,
          n = e.first
        if (e.getFirst) {
          for (
            a = e.buffer, s = e.buffer;
            s && e.getFirst(n, s + e.pages - e.offset - 1) > e.max;

          )
            s--
          for (; a && e.getFirst(n, 1 - a - e.offset) <= e.min; ) a--
        }
        ;(t = Math.round(ne / e.pages)),
          we && e.size != t && e.$scroller[Me ? 'height' : 'width'](t),
          Ge(e.scroller.settings, {
            snap: t,
            minScroll: (-e.pos * je - s) * t,
            maxScroll: (-e.pos * je + a) * t
          }),
          (e.size = t),
          e.scroller.refresh()
      }
      function j(t) {
        e._isVisible &&
          ve &&
          se &&
          (fe && fe.changing ? (Fe = t) : x(me, t, !0)),
          e._onRefresh(t)
      }
      function z() {
        if (ve && se) {
          let t = Be('.mbsc-cal-scroll-c', X)
          ;(fe = $(t[0], Ee, De, $e, Re, We, qe, me, S, f, p, _, P)),
            ye &&
              ((He = $(t[1], null, null, 1, 0, 1, 3, me, V)),
              (at = $(t[2], Ie, Se, 1, 0, 1, 3, me, A, l, l, g, Y)),
              e.tap(K, function () {
                s(G), a(ee)
              }),
              e.tap(Q, function () {
                s(ee), a(G)
              })),
            L(Be('.mbsc-cal-btn', X), function (e, t, a) {
              N(fe, t, !0, a)
            }),
            p(me),
            (null === ze.defaultValue && !e._hasValue) ||
              e._multiple ||
              (e._activeElm = fe.$active[0]),
            U.on('keydown', function (e) {
              var t,
                a = ze.getYear(te),
                s = ze.getMonth(te),
                n = ze.getDay(te)
              switch (e.keyCode) {
                case 32:
                  S(fe.$active)
                  break
                case 37:
                  t = ze.getDate(a, s, n - 1)
                  break
                case 39:
                  t = ze.getDate(a, s, n + 1)
                  break
                case 38:
                  t = ze.getDate(a, s, n - 7)
                  break
                case 40:
                  t = ze.getDate(a, s, n + 7)
                  break
                case 36:
                  t = ze.getDate(a, s, 1)
                  break
                case 35:
                  t = ze.getDate(a, s + 1, 0)
                  break
                case 33:
                  t = e.altKey
                    ? ze.getDate(a - 1, s, n)
                    : Ce
                    ? ze.getDate(a, s - 1, n)
                    : ze.getDate(a, s, n - 7 * se)
                  break
                case 34:
                  t = e.altKey
                    ? ze.getDate(a + 1, s, n)
                    : Ce
                    ? ze.getDate(a, s + 1, n)
                    : ze.getDate(a, s, n + 7 * se)
              }
              t && (e.preventDefault(), M(t, !0, !1, !0))
            })
        }
        e.tap(Be('.mbsc-cal-tab', X), function () {
          e.changeTab(Be(this).attr('data-control'))
        })
      }
      let B,
        U,
        X,
        K,
        G,
        Z,
        J,
        Q,
        ee,
        te,
        ae,
        se,
        ne,
        ie,
        re,
        oe,
        le,
        ce,
        de,
        ue,
        me,
        he,
        fe,
        pe,
        ve,
        be,
        ge,
        ye,
        _e,
        xe,
        we,
        Ce,
        Te,
        Me,
        ke,
        De,
        Se,
        Ve,
        Ae,
        Ee,
        Ie,
        Le,
        Oe,
        Pe,
        Ye,
        He,
        Ne,
        Fe,
        $e,
        We,
        Re,
        qe,
        je,
        ze,
        Ue,
        Xe,
        Ke,
        Ze,
        Je,
        Qe,
        et,
        tt,
        at,
        st,
        nt = this
      return (
        n(),
        (ae = Vt.call(this, e)),
        i(),
        (e.refresh = function () {
          j(!1)
        }),
        (e.redraw = function () {
          j(!0)
        }),
        (e.navigate = function (e, t) {
          M(e, !0, t)
        }),
        (e.changeTab = function (t) {
          e._isVisible &&
            oe[t] &&
            Ze != t &&
            ((Ze = t),
            Be('.mbsc-cal-tab', X).removeClass(ue).removeAttr('aria-selected'),
            Be('.mbsc-cal-tab[data-control="' + t + '"]', X)
              .addClass(ue)
              .attr('aria-selected', 'true'),
            J.addClass('mbsc-cal-h'),
            oe[Ze].removeClass('mbsc-cal-h'),
            'calendar' == Ze && M(e.getDate(!0), !1, !0),
            e._showDayPicker(),
            e.trigger('onTabChange', { tab: Ze }))
        }),
        (e._onGenMonth = l),
        (e._onSelectShow = l),
        (e._onSetDate = l),
        (e._onRefresh = l),
        (e._getDayProps = l),
        (e._prepareObj = o),
        (e._showDayPicker = function () {
          ye && (a(ee, !0), a(G, !0))
        }),
        (e._selectDay = e.__selectDay =
          function (t, a, s) {
            var n = e.live
            ;(Ne = ze.outerMonthChange),
              (xe = !0),
              e.setDate(s, n, 1e3, !n, !0),
              n && Xe('onSet', { valueText: e._value })
          }),
        Ge(ae, {
          labels: null,
          compClass: 'mbsc-calendar mbsc-dt',
          onMarkupReady: function (t) {
            var a = 0
            ;(X = Be(t.target)),
              (Z = Be('.mbsc-fr-c', X)),
              (he = {}),
              (te = e.getDate(!0)),
              (me = E(te)),
              ve &&
                ((be = !(!ze.marked && !ze.data)),
                (ge = ze.showEventCount || !(!ze.events && !ze.labels)),
                (Ne = !0),
                (Ze = 'calendar'),
                m(),
                Z.append(b()),
                (K = Be('.mbsc-cal-month', X)),
                (Q = Be('.mbsc-cal-year', X)),
                (U = Be('.mbsc-cal-day-scroll-c', X))),
              ye &&
                ((ee = Be('.mbsc-cal-year-picker', X)),
                (G = Be('.mbsc-cal-month-picker', X))),
              (J = Be('.mbsc-w-p', X)),
              le.length > 1 && Z.before(v()),
              ['date', 'time', 'calendar'].forEach(function (e) {
                oe[e]
                  ? ((oe[e] = J.eq(a).addClass('mbsc-cal-h')), a++)
                  : 'date' == e && !oe.date && ve && (J.eq(a).remove(), a++)
              }),
              le.forEach(function (e) {
                Z.append(oe[e])
              }),
              !ve && oe.date && oe.date.css('position', 'relative'),
              (e._scrollers = []),
              z()
          },
          onShow: function () {
            ve && se && k(te)
          },
          onHide: function () {
            e._scrollers.forEach(function (e) {
              e.destroy()
            }),
              (fe = null),
              (He = null),
              (at = null),
              (Ze = null)
          },
          onValidated: function (t) {
            var a,
              s,
              n = t.index,
              i = e._order
            ;(s = e.getDate(!0)),
              xe
                ? (a = 'calendar')
                : void 0 !== n &&
                  (a =
                    i.dd == n || i.d == n || i.m == n || i.y == n
                      ? 'date'
                      : 'time'),
              Xe('onSetDate', { date: s, control: a }),
              M(s, !1, !!t.time, xe && !e._multiple),
              (xe = !1)
          },
          onPosition: function (t) {
            var a,
              s,
              n,
              i,
              r = t.windowHeight,
              o =
                (t.hasTabs || ze.tabs === !0 || (ze.tabs !== !1 && we)) &&
                le.length > 1
            if (
              (we &&
                (t.windowWidth > ze.breakPointMd
                  ? Be(t.target).addClass('mbsc-fr-md')
                  : Be(t.target).removeClass('mbsc-fr-md')),
              o
                ? (X.addClass('mbsc-cal-tabbed'),
                  (Ze = Be('.mbsc-cal-tab.mbsc-selected', X).attr(
                    'data-control'
                  )),
                  J.addClass('mbsc-cal-h'),
                  oe[Ze].removeClass('mbsc-cal-h'))
                : ((Ze = 'calendar'),
                  X.removeClass('mbsc-cal-tabbed'),
                  J.removeClass('mbsc-cal-h')),
              e._isFullScreen &&
                (U.height(''),
                (i = t.popup.offsetHeight),
                r >= i && U.height(r - i + U[0].offsetHeight)),
              ve && se)
            ) {
              if (
                ((we || Me || o) &&
                  (ne = U[0][Me ? 'offsetHeight' : 'offsetWidth']),
                we && et)
              )
                for (
                  Ye =
                    ze.maxMonthWidth > (We > 1 ? (ne - 80) / We : ne / 2 - 80)
                      ? ze.monthNamesShort
                      : ze.monthNames,
                    s = ze.getYear(me),
                    n = ze.getMonth(me),
                    a = 0;
                  a < We;
                  a++
                )
                  K.eq(a).text(Ye[ze.getMonth(ze.getDate(s, n - Re + a, 1))])
              q(fe)
            }
            ye && (q(He), q(at))
          }
        })
      )
    },
    Ot = {}
  ;(bt.calendar = function (e) {
    function t(e) {
      return O(e.getFullYear(), e.getMonth(), e.getDate())
    }
    function a(e) {
      var a,
        s,
        n = null
      if (((b = {}), e && e.length))
        for (s = 0; s < e.length; s++)
          (a = W(e[s], r, m, m.isoParts)), (n = n || a), (b[t(a)] = a)
      return n
    }
    function s() {
      e.redraw()
    }
    var n,
      i,
      r,
      o,
      l,
      d = Ge({}, e.settings),
      m = Ge(e.settings, Ot, d),
      h = 'mbsc-selected ' + (m.selectedClass || ''),
      f = m.defaultValue,
      p = 'multiple' == m.select || m.select > 1 || 'week' == m.selectType,
      v = u(m.select) ? m.select : 1 / 0,
      b = {}
    return (
      (n = Lt.call(this, e)),
      (o = void 0 === m.firstSelectDay ? m.firstDay : m.firstSelectDay),
      (r = e._format),
      p && a(f),
      (e._multiple = p),
      (e._getDayProps = function (e) {
        return { selected: p ? void 0 !== b[e] : void 0 }
      }),
      (e._selectDay = function (t, a, n, r) {
        if (m.setOnDayTap && 'multiple' != m.select && 'inline' != m.display)
          return e.setDate(n), void e.select()
        if (p)
          if ('week' == m.selectType) {
            var l,
              d,
              u = a.getDay() - o
            for (
              u = u < 0 ? 7 + u : u, 'multiple' != m.select && (b = {}), l = 0;
              l < 7;
              l++
            )
              (d = O(a.getFullYear(), a.getMonth(), a.getDate() - u + l)),
                r ? delete b[d] : c(b).length / 7 < v && (b[d] = d)
            s()
          } else {
            var f = Be(
              '.mbsc-cal-day[data-full="' + t.attr('data-full') + '"]',
              i
            )
            r
              ? (f.removeClass(h).removeAttr('aria-selected'), delete b[a])
              : c(b).length < v &&
                (f.addClass(h).attr('aria-selected', 'true'), (b[a] = a))
          }
        e.__selectDay(t, a, n)
      }),
      (e.setVal = function (t, n, i, r, o) {
        p && (t = a(t)), e._setVal(t, n, i, r, o), p && s()
      }),
      (e.getVal = function (t) {
        var a,
          s = []
        if (p) {
          for (a in b) s.push($(b[a], m, r))
          return s
        }
        return $(e.getDate(t), m, r)
      }),
      Ge({}, n, {
        highlight: !p,
        outerMonthChange: !p,
        parseValue: function (e) {
          return (
            p && e && 'string' == typeof e && (e = a(e.split(','))),
            p && f && f.length && (m.defaultValue = f[0]),
            n.parseValue.call(this, e)
          )
        },
        formatValue: function (t) {
          var a,
            s = []
          if (p) {
            for (a in b) s.push(P(r, b[a], m))
            return s.join(', ')
          }
          return n.formatValue.call(this, t, e)
        },
        onClear: function () {
          p && ((b = {}), s())
        },
        onBeforeShow: function () {
          void 0 !== m.setOnDayTap ||
            (m.buttons && m.buttons.length) ||
            (m.setOnDayTap = !0),
            m.setOnDayTap && 'inline' != m.display && (m.outerMonthChange = !1),
            m.counter &&
              p &&
              (m.headerText = function () {
                var e = 0,
                  t = 'week' == m.selectType ? 7 : 1
                return (
                  Be.each(b, function () {
                    e++
                  }),
                  (e = Math.round(e / t)),
                  (e > 1
                    ? m.selectedPluralText || m.selectedText
                    : m.selectedText
                  ).replace(/{count}/, e)
                )
              })
        },
        onMarkupReady: function (e) {
          n.onMarkupReady.call(this, e),
            (i = Be(e.target)),
            p &&
              (Be('.mbsc-fr-hdr', i).attr('aria-live', 'off'), (l = Ge({}, b)))
        },
        onCancel: function () {
          !e.live && p && (b = Ge({}, l))
        }
      })
    )
  }),
    o('calendar', xt)
  let Pt = {
    wheelOrder: 'hhiiss',
    useShortLabels: !1,
    min: 0,
    max: 1 / 0,
    labels: ['Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'],
    labelsShort: ['Yrs', 'Mths', 'Days', 'Hrs', 'Mins', 'Secs']
  }
  ;(bt.timespan = function (e) {
    function t(e) {
      var t = {}
      return (
        Be(v).each(function (a, s) {
          ;(t[s] = _[s] ? Math.floor(e / b[s].limit) : 0),
            (e -= t[s] * b[s].limit)
        }),
        t
      )
    }
    function a(e) {
      var t = !1,
        a = y[_[e] - 1] || 1,
        n = b[e],
        i = n.label,
        o = n.wheel
      if (
        ((o.data = []),
        (o.label = n.label),
        f.match(new RegExp(n.re + n.re, 'i')) && (t = !0),
        e == x)
      )
        (o.min = c[e]),
          (o.max = d[e]),
          (o.data = function (e) {
            return { value: e * a, display: s(e * a, t, i) }
          }),
          (o.getIndex = function (e) {
            return Math.round(e / a)
          })
      else
        for (r = 0; r <= n.until; r += a)
          o.data.push({ value: r, display: s(r, t, i) })
    }
    function s(e, t, a) {
      return (
        (e < 10 && t ? '0' : '') +
        e +
        '<span class="mbsc-ts-lbl">' +
        a +
        '</span>'
      )
    }
    function n(e) {
      var t = 0,
        a = 0
      return (
        Be.each(g, function (s, n) {
          isNaN(+e[t]) || (a += b[n.v].limit * e[s])
        }),
        a
      )
    }
    function i(e, t) {
      return Math.floor(e / t) * t
    }
    var r,
      o,
      l,
      c,
      d,
      m = Ge({}, e.settings),
      h = Ge(e.settings, Pt, m),
      f = h.wheelOrder,
      p = h.useShortLabels ? h.labelsShort : h.labels,
      v = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'],
      b = {
        years: {
          ord: 0,
          index: 6,
          until: 10,
          limit: 31536e6,
          label: p[0],
          re: 'y',
          wheel: {}
        },
        months: {
          ord: 1,
          index: 5,
          until: 11,
          limit: 2592e6,
          label: p[1],
          re: 'm',
          wheel: {}
        },
        days: {
          ord: 2,
          index: 4,
          until: 31,
          limit: 864e5,
          label: p[2],
          re: 'd',
          wheel: {}
        },
        hours: {
          ord: 3,
          index: 3,
          until: 23,
          limit: 36e5,
          label: p[3],
          re: 'h',
          wheel: {}
        },
        minutes: {
          ord: 4,
          index: 2,
          until: 59,
          limit: 6e4,
          label: p[4],
          re: 'i',
          wheel: {}
        },
        seconds: {
          ord: 5,
          index: 1,
          until: 59,
          limit: 1e3,
          label: p[5],
          re: 's',
          wheel: {}
        }
      },
      g = [],
      y = h.steps || [],
      _ = {},
      x = 'seconds',
      w = h.defaultValue || Math.max(h.min, Math.min(0, h.max)),
      C = [[]]
    return (
      Be(v).each(function (e, t) {
        ;(o = f.search(new RegExp(b[t].re, 'i'))),
          o > -1 && (g.push({ o: o, v: t }), b[t].index > b[x].index && (x = t))
      }),
      g.sort(function (e, t) {
        return e.o > t.o ? 1 : -1
      }),
      Be.each(g, function (e, t) {
        ;(_[t.v] = e + 1), C[0].push(b[t.v].wheel)
      }),
      (c = t(h.min)),
      (d = t(h.max)),
      Be.each(g, function (e, t) {
        a(t.v)
      }),
      (e.getVal = function (t, a) {
        return a ? e._getVal(t) : e._hasValue || t ? n(e.getArrayVal(t)) : null
      }),
      {
        showLabel: !0,
        wheels: C,
        compClass: 'mbsc-ts',
        parseValue: function (e) {
          var a,
            s = []
          return (
            u(e) || !e
              ? ((l = t(e || w)),
                Be.each(g, function (e, t) {
                  s.push(l[t.v])
                }))
              : Be.each(g, function (t, n) {
                  ;(a = new RegExp(
                    '(\\d+)\\s?(' +
                      h.labels[b[n.v].ord] +
                      '|' +
                      h.labelsShort[b[n.v].ord] +
                      ')',
                    'gi'
                  ).exec(e)),
                    s.push(a ? a[1] : 0)
                }),
            Be(s).each(function (e, t) {
              s[e] = i(t, y[e] || 1)
            }),
            s
          )
        },
        formatValue: function (e) {
          var t = ''
          return (
            Be.each(g, function (a, s) {
              t += +e[a] ? e[a] + ' ' + b[s.v].label + ' ' : ''
            }),
            t ? t.replace(/\s+$/g, '') : 0
          )
        },
        validate: function (a) {
          var s,
            i,
            r,
            o,
            l = a.values,
            u = a.direction,
            m = [],
            h = !0,
            f = !0
          return (
            Be(v).each(function (a, p) {
              if (void 0 !== _[p]) {
                if (((r = _[p] - 1), (m[r] = []), (o = {}), p != x)) {
                  if (h) for (i = d[p] + 1; i <= b[p].until; i++) o[i] = !0
                  if (f) for (i = 0; i < c[p]; i++) o[i] = !0
                }
                ;(l[r] = e.getValidValue(r, l[r], u, o)),
                  (s = t(n(l))),
                  (h = h && s[p] == d[p]),
                  (f = f && s[p] == c[p]),
                  Be.each(o, function (e) {
                    m[r].push(e)
                  })
              }
            }),
            { disabled: m }
          )
        }
      }
    )
  }),
    o('timespan', xt)
  let Yt = {
    autostart: !1,
    step: 1,
    useShortLabels: !1,
    labels: ['Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds', ''],
    labelsShort: ['Yrs', 'Mths', 'Days', 'Hrs', 'Mins', 'Secs', ''],
    startText: 'Start',
    stopText: 'Stop',
    resetText: 'Reset',
    lapText: 'Lap',
    hideText: 'Hide',
    mode: 'countdown'
  }
  ;(bt.timer = function (e) {
    function t(e) {
      return new Date(
        e.getUTCFullYear(),
        e.getUTCMonth(),
        e.getUTCDate(),
        e.getUTCHours(),
        e.getUTCMinutes(),
        e.getUTCSeconds(),
        e.getUTCMilliseconds()
      )
    }
    function a(e) {
      var a = {}
      if (Y && M[L].index > M.days.index) {
        var s,
          n,
          i,
          r,
          o = new Date(),
          l = v ? o : P,
          c = v ? P : o
        for (
          c = t(c),
            l = t(l),
            a.years = l.getFullYear() - c.getFullYear(),
            a.months = l.getMonth() - c.getMonth(),
            a.days = l.getDate() - c.getDate(),
            a.hours = l.getHours() - c.getHours(),
            a.minutes = l.getMinutes() - c.getMinutes(),
            a.seconds = l.getSeconds() - c.getSeconds(),
            a.fract = (l.getMilliseconds() - c.getMilliseconds()) / 10,
            s = T.length;
          s > 0;
          s--
        )
          (n = T[s - 1]),
            (i = M[n]),
            (r = T[Be.inArray(n, T) - 1]),
            M[r] &&
              a[n] < 0 &&
              (a[r]--,
              (a[n] +=
                'months' == r
                  ? 32 - new Date(l.getFullYear(), l.getMonth(), 32).getDate()
                  : i.until + 1))
        'months' == L && ((a.months += 12 * a.years), delete a.years)
      } else
        Be(T).each(function (t, s) {
          M[s].index <= M[L].index &&
            ((a[s] = Math.floor(e / M[s].limit)), (e -= a[s] * M[s].limit))
        })
      return a
    }
    function s(e) {
      var t = 1,
        a = M[e],
        s = a.wheel,
        i = a.prefix,
        r = 0,
        o = a.until,
        c = M[T[Be.inArray(e, T) - 1]]
      if (a.index <= M[L].index && (!c || c.limit > I))
        if (
          (k[e] || H[0].push(s),
          (k[e] = 1),
          (s.data = []),
          (s.label = a.label || ''),
          (s.cssClass = 'mbsc-timer-whl-' + e),
          I >= a.limit &&
            ((t = Math.max(Math.round(I / a.limit), 1)), (d = t * a.limit)),
          e == L)
        )
          (s.min = 0),
            (s.data = function (e) {
              return { value: e, display: n(e, i, a.label) }
            }),
            (s.getIndex = function (e) {
              return e
            })
        else
          for (l = r; l <= o; l += t)
            s.data.push({ value: l, display: n(l, i, a.label) })
    }
    function n(e, t, a) {
      return (
        (t || '') +
        (e < 10 ? '0' : '') +
        e +
        '<span class="mbsc-timer-lbl">' +
        a +
        '</span>'
      )
    }
    function i(e) {
      var t,
        s = [],
        n = a(e)
      return (
        Be(T).each(function (e, a) {
          k[a] &&
            ((t = Math.max(Math.round(I / M[a].limit), 1)),
            s.push(Math.round(n[a] / t) * t))
        }),
        s
      )
    }
    function r(e) {
      Y
        ? ((f = P - new Date()),
          f < 0 ? ((f *= -1), (v = !0)) : (v = !1),
          (p = 0),
          (E = !0))
        : void 0 !== P
        ? ((E = !1), (f = 1e3 * P), (v = 'countdown' != _.mode), e && (p = 0))
        : ((f = 0), (v = 'countdown' != _.mode), (E = v), e && (p = 0))
    }
    function o() {
      V
        ? (Be('.mbsc-fr-w', b).addClass('mbsc-timer-running mbsc-timer-locked'),
          Be('.mbsc-timer-btn-toggle-c > div', b).text(_.stopText),
          e.buttons.start.icon &&
            Be('.mbsc-timer-btn-toggle-c > div', b).removeClass(
              'mbsc-ic-' + e.buttons.start.icon
            ),
          e.buttons.stop.icon &&
            Be('.mbsc-timer-btn-toggle-c > div', b).addClass(
              'mbsc-ic-' + e.buttons.stop.icon
            ),
          'stopwatch' == _.mode &&
            (Be('.mbsc-timer-btn-resetlap-c > div', b).text(_.lapText),
            e.buttons.reset.icon &&
              Be('.mbsc-timer-btn-resetlap-c > div', b).removeClass(
                'mbsc-ic-' + e.buttons.reset.icon
              ),
            e.buttons.lap.icon &&
              Be('.mbsc-timer-btn-resetlap-c > div', b).addClass(
                'mbsc-ic-' + e.buttons.lap.icon
              )))
        : (Be('.mbsc-fr-w', b).removeClass('mbsc-timer-running'),
          Be('.mbsc-timer-btn-toggle-c > div', b).text(_.startText),
          e.buttons.start.icon &&
            Be('.mbsc-timer-btn-toggle-c > div', b).addClass(
              'mbsc-ic-' + e.buttons.start.icon
            ),
          e.buttons.stop.icon &&
            Be('.mbsc-timer-btn-toggle-c > div', b).removeClass(
              'mbsc-ic-' + e.buttons.stop.icon
            ),
          'stopwatch' == _.mode &&
            (Be('.mbsc-timer-btn-resetlap-c > div', b).text(_.resetText),
            e.buttons.reset.icon &&
              Be('.mbsc-timer-btn-resetlap-c > div', b).addClass(
                'mbsc-ic-' + e.buttons.reset.icon
              ),
            e.buttons.lap.icon &&
              Be('.mbsc-timer-btn-resetlap-c > div', b).removeClass(
                'mbsc-ic-' + e.buttons.lap.icon
              )))
    }
    var l,
      c,
      d,
      u,
      m,
      h,
      f,
      p,
      v,
      b,
      g,
      y = Ge({}, e.settings),
      _ = Ge(e.settings, Yt, y),
      x = _.useShortLabels ? _.labelsShort : _.labels,
      w = 1e3,
      C = ['resetlap', 'toggle'],
      T = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'fract'],
      M = {
        years: { index: 6, until: 10, limit: 31536e6, label: x[0], wheel: {} },
        months: { index: 5, until: 11, limit: 2592e6, label: x[1], wheel: {} },
        days: { index: 4, until: 31, limit: 864e5, label: x[2], wheel: {} },
        hours: { index: 3, until: 23, limit: 36e5, label: x[3], wheel: {} },
        minutes: { index: 2, until: 59, limit: 6e4, label: x[4], wheel: {} },
        seconds: { index: 1, until: 59, limit: 1e3, label: x[5], wheel: {} },
        fract: {
          index: 0,
          until: 99,
          limit: 10,
          label: x[6],
          prefix: '.',
          wheel: {}
        }
      },
      k = {},
      D = [],
      S = 0,
      V = !1,
      A = !0,
      E = !1,
      I = Math.max(10, 1e3 * _.step),
      L = _.maxWheel,
      O = 'stopwatch' == _.mode || Y,
      P = _.targetTime,
      Y = P && void 0 !== P.getTime,
      H = [[]]
    return (
      (e.start = function () {
        if ((A && e.reset(), !V)) {
          if ((r(), !E && p >= f)) return
          ;(V = !0),
            (A = !1),
            (m = new Date()),
            (u = p),
            (_.readonly = !0),
            e.setVal(i(v ? p : f - p), !0, !0, !1, 100),
            (c = setInterval(function () {
              ;(p = new Date() - m + u),
                e.setVal(i(v ? p : f - p), !0, !0, !1, Math.min(100, d - 10)),
                !E &&
                  p + d >= f &&
                  (clearInterval(c),
                  setTimeout(function () {
                    e.stop(),
                      (p = f),
                      e.setVal(i(v ? p : 0), !0, !0, !1, 100),
                      e.trigger('onFinish', { time: f }),
                      (A = !0)
                  }, f - p))
            }, d)),
            o(),
            e.trigger('onStart')
        }
      }),
      (e.stop = function () {
        V &&
          ((V = !1),
          clearInterval(c),
          (p = new Date() - m + u),
          o(),
          e.trigger('onStop', { ellapsed: p }))
      }),
      (e.toggle = function () {
        V ? e.stop() : e.start()
      }),
      (e.reset = function () {
        e.stop(),
          (p = 0),
          (D = []),
          (S = 0),
          e.setVal(i(v ? 0 : f), !0, !0, !1, w),
          (e.settings.readonly = O),
          (A = !0),
          O || Be('.mbsc-fr-w', b).removeClass('mbsc-timer-locked'),
          e.trigger('onReset')
      }),
      (e.lap = function () {
        V &&
          ((h = new Date() - m + u),
          (g = h - S),
          (S = h),
          D.push(h),
          e.trigger('onLap', { ellapsed: h, lap: g, laps: D }))
      }),
      (e.resetlap = function () {
        V && 'stopwatch' == _.mode ? e.lap() : e.reset()
      }),
      (e.getTime = function () {
        return f
      }),
      (e.setTime = function (e) {
        ;(P = e / 1e3), (f = e)
      }),
      (e.getEllapsedTime = function () {
        return A ? 0 : V ? new Date() - m + u : p
      }),
      (e.setEllapsedTime = function (t, a) {
        A ||
          ((u = p = t),
          (m = new Date()),
          e.setVal(i(v ? p : f - p), !0, a, !1, w))
      }),
      r(!0),
      L || f || (L = 'minutes'),
      'inline' !== _.display && C.unshift('hide'),
      L ||
        Be(T).each(function (e, t) {
          if (!L && f >= M[t].limit) return (L = t), !1
        }),
      Be(T).each(function (e, t) {
        s(t)
      }),
      (d = Math.max(97, d)),
      _.autostart &&
        setTimeout(function () {
          e.start()
        }, 0),
      (e.handlers.toggle = e.toggle),
      (e.handlers.start = e.start),
      (e.handlers.stop = e.stop),
      (e.handlers.resetlap = e.resetlap),
      (e.handlers.reset = e.reset),
      (e.handlers.lap = e.lap),
      (e.buttons.toggle = {
        parentClass: 'mbsc-timer-btn-toggle-c',
        text: _.startText,
        icon: _.startIcon,
        handler: 'toggle'
      }),
      (e.buttons.start = {
        text: _.startText,
        icon: _.startIcon,
        handler: 'start'
      }),
      (e.buttons.stop = {
        text: _.stopText,
        icon: _.stopIcon,
        handler: 'stop'
      }),
      (e.buttons.reset = {
        text: _.resetText,
        icon: _.resetIcon,
        handler: 'reset'
      }),
      (e.buttons.lap = { text: _.lapText, icon: _.lapIcon, handler: 'lap' }),
      (e.buttons.resetlap = {
        parentClass: 'mbsc-timer-btn-resetlap-c',
        text: _.resetText,
        icon: _.resetIcon,
        handler: 'resetlap'
      }),
      (e.buttons.hide = {
        parentClass: 'mbsc-timer-btn-hide-c',
        text: _.hideText,
        icon: _.closeIcon,
        handler: 'cancel'
      }),
      {
        wheels: H,
        headerText: !1,
        readonly: O,
        buttons: C,
        compClass: 'mbsc-timer',
        parseValue: function () {
          return i(v ? 0 : f)
        },
        formatValue: function (e) {
          var t = '',
            a = 0
          return (
            Be(T).each(function (s, n) {
              'fract' != n &&
                k[n] &&
                ((t +=
                  e[a] +
                  ('seconds' == n && k.fract ? '.' + e[a + 1] : '') +
                  ' ' +
                  x[s] +
                  ' '),
                a++)
            }),
            t
          )
        },
        validate: function (e) {
          var t = e.values,
            a = e.index,
            s = 0
          A &&
            void 0 !== a &&
            ((P = 0),
            Be(T).each(function (e, a) {
              k[a] && ((P += M[a].limit * t[s]), s++)
            }),
            (P /= 1e3),
            r(!0))
        },
        onBeforeShow: function () {
          _.showLabel = !0
        },
        onMarkupReady: function (e) {
          ;(b = Be(e.target)),
            o(),
            O && Be('.mbsc-fr-w', b).addClass('mbsc-timer-locked')
        },
        onPosition: function (e) {
          Be('.mbsc-fr-w', e.target)
            .css('min-width', 0)
            .css('min-width', Be('.mbsc-fr-btn-cont', e.target)[0].offsetWidth)
        },
        onDestroy: function () {
          clearInterval(c)
        }
      }
    )
  }),
    o('timer', xt)
  let Ht = function (e, t, a) {
      let s,
        n,
        i,
        r,
        o = this
      Ze.call(this, e, t, !0),
        (o.__init = l),
        (o.__destroy = l),
        (o._init = function (t) {
          var a
          ;(r = o.settings),
            (s = Be(e)),
            (a = !!n),
            (n = s.parent()),
            (n = n.hasClass('mbsc-input-wrap') ? n.parent() : n),
            (o._$parent = n),
            i && n.removeClass(i),
            (i =
              o._css +
              ' mbsc-progress-w mbsc-control-w mbsc-' +
              r.theme +
              (r.baseTheme ? ' mbsc-' + r.baseTheme : '') +
              (r.rtl ? ' mbsc-rtl' : ' mbsc-ltr')),
            n.addClass(i),
            s.addClass('mbsc-control'),
            o.__init(t),
            a || o._attachChange(),
            o.refresh(),
            (e.mbscInst = o)
        }),
        (o._destroy = function () {
          o.__destroy(),
            n.removeClass(i),
            s.removeClass('mbsc-control'),
            delete e.mbscInst
        }),
        a || o.init(t)
    },
    Nt = [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel',
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseleave'
    ],
    Ft = { tap: !at },
    $t = void 0,
    Wt = (function () {
      function e(t, a) {
        let s = this
        we(this, e)
        let n = Ge({}, Ft, ye.settings, a),
          i = Be(t),
          r = i.parent(),
          o = r.hasClass('mbsc-input-wrap') ? r.parent() : r,
          l = i.next().hasClass('mbsc-fr') ? i.next() : null,
          c = q(i)
        l && l.insertAfter(o),
          G(o, c),
          i.addClass('mbsc-control'),
          Nt.forEach(function (e) {
            t.addEventListener(e, s)
          }),
          (this.settings = n),
          (this._type = c),
          (this._elm = t),
          (this._$elm = i),
          (this._$parent = o),
          (this._$frame = l),
          (this._ripple = j(n.theme)),
          (t.mbscInst = this)
      }
      return (
        Ce(e, [
          {
            key: 'destroy',
            value: function () {
              var e = this
              this._$elm.removeClass('mbsc-control'),
                Nt.forEach(function (t) {
                  e._elm.removeEventListener(t, e)
                }),
                delete this._elm.mbscInst
            }
          },
          {
            key: 'option',
            value: function (e) {
              Ge(this.settings, e), (this._ripple = j(this.settings.theme))
            }
          },
          {
            key: 'handleEvent',
            value: function (e) {
              switch (e.type) {
                case 'touchstart':
                case 'mousedown':
                  this._onStart(e)
                  break
                case 'touchmove':
                case 'mousemove':
                  this._onMove(e)
                  break
                case 'touchend':
                case 'touchcancel':
                case 'mouseup':
                case 'mouseleave':
                  this._onEnd(e)
              }
            }
          },
          {
            key: '_addRipple',
            value: function (e) {
              this._ripple &&
                this._$rippleElm &&
                this._ripple.addRipple(this._$rippleElm, e)
            }
          },
          {
            key: '_removeRipple',
            value: function () {
              this._ripple && this._$rippleElm && this._ripple.removeRipple()
            }
          },
          {
            key: '_onStart',
            value: function (e) {
              var t = this._elm
              A(e, t) &&
                ((this._startX = x(e, 'X')),
                (this._startY = x(e, 'Y')),
                $t && $t.removeClass('mbsc-active'),
                t.disabled ||
                  ((this._isActive = !0),
                  ($t = this._$elm),
                  $t.addClass('mbsc-active'),
                  this._addRipple(e)))
            }
          },
          {
            key: '_onMove',
            value: function (e) {
              ;((this._isActive && Math.abs(x(e, 'X') - this._startX) > 9) ||
                Math.abs(x(e, 'Y') - this._startY) > 9) &&
                (this._$elm.removeClass('mbsc-active'),
                this._removeRipple(),
                (this._isActive = !1))
            }
          },
          {
            key: '_onEnd',
            value: function (e) {
              var t = this,
                a = this._elm,
                s = this._type
              this._isActive &&
                this.settings.tap &&
                'touchend' == e.type &&
                !a.readOnly &&
                (a.focus(),
                /(button|submit|checkbox|switch|radio)/.test(s) &&
                  e.preventDefault(),
                /select/.test(s) || _(e, a)),
                this._isActive &&
                  setTimeout(function () {
                    t._$elm.removeClass('mbsc-active'), t._removeRipple()
                  }, 100),
                (this._isActive = !1),
                ($t = null)
            }
          }
        ]),
        e
      )
    })(),
    Rt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
        )
        return K(s, s._$parent, s._$elm), s._$parent.addClass('mbsc-input'), s
      }
      return (
        ke(t, e),
        Ce(t, [
          {
            key: 'destroy',
            value: function () {
              Me(
                t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                'destroy',
                this
              ).call(this),
                this._$parent
                  .removeClass('mbsc-ic-left mbsc-ic-right')
                  .find('.mbsc-input-ic')
                  .remove()
            }
          }
        ]),
        t
      )
    })(Wt),
    qt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
          ),
          n = s._$elm,
          i = n.attr('data-icon')
        return (
          n.addClass('mbsc-btn').find('.mbsc-btn-ic').remove(),
          i &&
            (n.prepend(
              '<span class="mbsc-btn-ic mbsc-ic mbsc-ic-' + i + '"></span>'
            ),
            '' === n.text() && n.addClass('mbsc-btn-icon-only')),
          (s._$rippleElm = n),
          s
        )
      }
      return ke(t, e), t
    })(Wt),
    jt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
        )
        return (
          s._$parent
            .prepend(s._$elm)
            .addClass('mbsc-checkbox mbsc-control-w')
            .find('.mbsc-checkbox-box')
            .remove(),
          s._$elm.after('<span class="mbsc-checkbox-box"></span>'),
          s
        )
      }
      return ke(t, e), t
    })(Wt),
    zt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
        )
        return (
          s._$parent
            .addClass('mbsc-radio mbsc-control-w')
            .find('.mbsc-radio-box')
            .remove(),
          s._$elm.after('<span class="mbsc-radio-box"><span></span></span>'),
          s
        )
      }
      return ke(t, e), t
    })(Wt),
    Bt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
          ),
          n = s._$elm,
          i = s._$parent,
          r = i.find('input.mbsc-control'),
          o = r.length
            ? r
            : Be('<input tabindex="-1" class="mbsc-control" readonly>')
        return (
          (s._$input = o),
          (s._setText = s._setText.bind(s)),
          i.addClass('mbsc-select' + (s._$frame ? ' mbsc-select-inline' : '')),
          n.after(o),
          o.after(
            '<span class="mbsc-select-ic mbsc-ic mbsc-ic-arrow-down5"></span>'
          ),
          n.hasClass('mbsc-comp') || (n.on('change', s._setText), s._setText()),
          s
        )
      }
      return (
        ke(t, e),
        Ce(t, [
          {
            key: 'destroy',
            value: function () {
              Me(
                t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                'destroy',
                this
              ).call(this),
                this._$parent.find('.mbsc-select-ic').remove(),
                this._$elm.off('change', this._setText)
            }
          },
          {
            key: '_setText',
            value: function () {
              var e = this._elm
              this._$elm.hasClass('mbsc-comp') ||
                this._$input.val(
                  e.selectedIndex != -1 ? e.options[e.selectedIndex].text : ''
                )
            }
          }
        ]),
        t
      )
    })(Rt),
    Ut = ['keydown', 'input', 'scroll'],
    Xt = void 0
  Fe && Be(window).on('resize orientationchange', z)
  let Kt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
        )
        return (
          s._$parent.addClass('mbsc-textarea'),
          Ut.forEach(function (e) {
            s._elm.addEventListener(e, s)
          }),
          B(e),
          s
        )
      }
      return (
        ke(t, e),
        Ce(t, [
          {
            key: 'destroy',
            value: function () {
              var e = this
              Me(
                t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                'destroy',
                this
              ).call(this),
                Ut.forEach(function (t) {
                  e._elm.removeEventListener(t, e)
                })
            }
          },
          {
            key: 'handleEvent',
            value: function (e) {
              switch (
                (Me(
                  t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                  'handleEvent',
                  this
                ).call(this, e),
                e.type)
              ) {
                case 'keydown':
                case 'input':
                  this._onInput(e)
                  break
                case 'scroll':
                  U(this._elm)
              }
            }
          },
          {
            key: '_onInput',
            value: function () {
              var e = this
              clearTimeout(this._debounce),
                (this._debounce = setTimeout(function () {
                  B(e._elm)
                }, 100))
            }
          }
        ]),
        t
      )
    })(Rt),
    Gt = (function (e) {
      function t(e, a) {
        we(this, t)
        let s = De(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, a)
          ),
          n = void 0,
          i = void 0,
          r = s._$elm,
          o = s._$parent
        return (
          o.hasClass('mbsc-segmented-item-ready') ||
            ((n = Be('<div class="mbsc-segmented"></div>')),
            o.after(n),
            o
              .parent()
              .find('input[name="' + r.attr('name') + '"]')
              .each(function () {
                var e = Be(this)
                ;(i = e
                  .parent()
                  .addClass('mbsc-segmented-item mbsc-segmented-item-ready')),
                  Be(
                    '<span class="mbsc-segmented-content">' +
                      (e.attr('data-icon')
                        ? '<span class="mbsc-ic mbsc-ic-' +
                          e.attr('data-icon') +
                          '"></span>'
                        : '') +
                      '</span>'
                  )
                    .append(i.contents())
                    .appendTo(i),
                  i.prepend(e),
                  n.append(i)
              })),
          (s._$rippleElm = r.next()),
          s
        )
      }
      return ke(t, e), t
    })(Wt),
    Zt = function (e, t) {
      function a() {
        let t
        e.disabled || ((t = parseFloat(Be(this).val())), i(isNaN(t) ? g : t))
      }
      function s() {
        return e.disabled
      }
      function n(e, t) {
        i(g + t * f)
      }
      function i(e, t, a) {
        ;(C = g),
          void 0 === t && (t = !0),
          void 0 === a && (a = t),
          (g = Math.min(u, Math.max(Math.round(e / f) * f, m))),
          c.removeClass('mbsc-disabled'),
          t && w.val(g),
          g == m
            ? l.addClass('mbsc-disabled')
            : g == u && o.addClass('mbsc-disabled'),
          g !== C && a && w.trigger('change')
      }
      function r(e, t) {
        let a = w.attr(e)
        return void 0 === a || '' === a ? t : +a
      }
      let o,
        l,
        c,
        d,
        u,
        m,
        h,
        f,
        p,
        v,
        b,
        g,
        y,
        _,
        x = this,
        w = Be(e),
        C = g
      Ze.call(this, e, t, !0),
        (x.getVal = function () {
          var e = parseFloat(w.val())
          return (
            (e = isNaN(e) ? g : e),
            Math.min(u, Math.max(Math.round(e / f) * f, m))
          )
        }),
        (x.setVal = function (e, t, a) {
          ;(e = parseFloat(e)), i(isNaN(e) ? g : e, t, a)
        }),
        (x._init = function (t) {
          ;(y = w.parent().hasClass('mbsc-stepper')),
            (_ = y ? w.closest('.mbsc-stepper-cont') : w.parent()),
            (v = x.settings),
            (m = void 0 === t.min ? r('min', v.min) : t.min),
            (u = void 0 === t.max ? r('max', v.max) : t.max),
            (f = void 0 === t.step ? r('step', v.step) : t.step),
            (d = w.attr('data-val') || v.val),
            (g = Math.min(u, Math.max(Math.round(+e.value / f) * f || 0, m))),
            (b = ye.themes.form[v.theme]),
            (h = b && b.addRipple ? b : null),
            y ||
              _.addClass('mbsc-stepper-cont mbsc-control-w')
                .append('<span class="mbsc-segmented mbsc-stepper"></span>')
                .find('.mbsc-stepper')
                .append(
                  '<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-minus ' +
                    (g == m ? 'mbsc-disabled' : '') +
                    '" data-step="-1" tabindex="0"><span class="mbsc-segmented-content"><span class="mbsc-ic mbsc-ic-minus"></span></span></span>'
                )
                .append(
                  '<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-plus ' +
                    (g == u ? 'mbsc-disabled' : '') +
                    '"  data-step="1" tabindex="0"><span class="mbsc-segmented-content"> <span class="mbsc-ic mbsc-ic-plus"></span></span></span>'
                )
                .prepend(w),
            (l = Be('.mbsc-stepper-minus', _)),
            (o = Be('.mbsc-stepper-plus', _)),
            (c = Be('.mbsc-stepper-control', _)),
            y ||
              ('left' == d
                ? (_.addClass('mbsc-stepper-val-left'),
                  w.after(
                    '<span class="mbsc-segmented-item"><span class="mbsc-segmented-content"></span></span>'
                  ))
                : 'right' == d
                ? (_.addClass('mbsc-stepper-val-right'),
                  o.after(
                    '<span class="mbsc-segmented-item"><span class="mbsc-segmented-content"></span></span>'
                  ))
                : l.after(
                    '<span class="mbsc-segmented-item"><span class="mbsc-segmented-content mbsc-stepper-val"></span></span>'
                  )),
            p || (w.on('change', a), (p = L(c, n, 150, s, !1, h))),
            w
              .val(g)
              .attr('data-role', 'stepper')
              .attr('min', m)
              .attr('max', u)
              .attr('step', f)
              .addClass('mbsc-control'),
            (e.mbscInst = x)
        }),
        (x._destroy = function () {
          w.removeClass('mbsc-control').off('change', a),
            p.destroy(),
            delete e.mbscInst
        }),
        x.init(t)
    }
  ;(Zt.prototype = {
    _class: 'stepper',
    _hasDef: !0,
    _hasTheme: !0,
    _defaults: { min: 0, max: 100, step: 1 }
  }),
    (Ke.Stepper = Zt)
  let Jt = function (e, t, a) {
      function s(t) {
        'mousedown' === t.type && t.preventDefault(),
          !A(t, this) ||
            (k && !Y) ||
            e.disabled ||
            e.readOnly ||
            (B.stopProp && t.stopPropagation(),
            (k = !0),
            (R = !1),
            (S = !1),
            (X = x(t, 'X')),
            (K = x(t, 'Y')),
            (L = X),
            M.removeClass('mbsc-progress-anim'),
            (g = q ? Be('.mbsc-slider-handle', this) : w),
            _ && _.removeClass('mbsc-handle-curr'),
            (_ = g.parent().addClass('mbsc-active mbsc-handle-curr')),
            v.addClass('mbsc-active'),
            (P = +g.attr('data-index')),
            (J = M[0].offsetWidth),
            (I = M[0].getBoundingClientRect().left),
            'mousedown' === t.type &&
              ((H = !0), Be(document).on('mousemove', n).on('mouseup', i)),
            'mouseenter' === t.type &&
              ((Y = !0), Be(document).on('mousemove', n)))
      }
      function n(e) {
        k &&
          ((L = x(e, 'X')),
          (O = x(e, 'Y')),
          (V = L - X),
          (E = O - K),
          Math.abs(V) > 5 && (R = !0),
          (R || H || Y) &&
            Math.abs(te - new Date()) > 50 &&
            ((te = new Date()), f(L, B.round, F && (!Y || H))),
          R
            ? e.preventDefault()
            : Math.abs(E) > 7 && 'touchmove' == e.type && h(e))
      }
      function i(e) {
        k &&
          (e.preventDefault(),
          q || M.addClass('mbsc-progress-anim'),
          Y && !H ? p(Q[P], P, !1, !1, !0) : f(L, !0, !0),
          R || S || ('touchend' == e.type && y(), ee._onTap(Q[P])),
          'mouseup' == e.type && (H = !1),
          'mouseleave' == e.type && (Y = !1),
          Y || h())
      }
      function r() {
        k && h()
      }
      function o() {
        let e = ee._readValue(Be(this)),
          t = +Be(this).attr('data-index')
        e !== Q[t] && ((Q[t] = e), (j[t] = e), p(e, t))
      }
      function c(e) {
        e.stopPropagation()
      }
      function d(e) {
        e.preventDefault()
      }
      function u(t) {
        let a
        if (!e.disabled) {
          switch (t.keyCode) {
            case 38:
            case 39:
              a = 1
              break
            case 40:
            case 37:
              a = -1
          }
          a &&
            (t.preventDefault(),
            Z ||
              ((P = +Be(this).attr('data-index')),
              p(Q[P] + z * a, P, !0),
              (Z = setInterval(function () {
                p(Q[P] + z * a, P, !0)
              }, 200))))
        }
      }
      function m(e) {
        e.preventDefault(), clearInterval(Z), (Z = null)
      }
      function h() {
        ;(k = !1),
          _.removeClass('mbsc-active'),
          v.removeClass('mbsc-active'),
          Be(document).off('mousemove', n).off('mouseup', i)
      }
      function f(e, t, a) {
        let s = t
          ? Math.min(
              (Math[ee._rounding || 'round'](
                Math.max((100 * (e - I)) / J, 0) / U / z
              ) *
                z *
                100) /
                ($ - W + D),
              100
            )
          : Math.max(0, Math.min((100 * (e - I)) / J, 100))
        N && (s = 100 - s), p(Math.round((W - D + s / U) * G) / G, P, a, s)
      }
      function p(e, t, a, s, n, i) {
        let r = w.eq(t),
          o = r.parent()
        ;(e = Math.min($, Math.max(e, W))),
          void 0 === i && (i = a),
          ee._update
            ? (e = ee._update(e, Q, t, s, q, n, o))
            : o.css({
                left: N ? 'auto' : (s || b(e, W, $)) + '%',
                right: N ? (s || b(e, W, $)) + '%' : 'auto'
              }),
          e > W
            ? o.removeClass('mbsc-slider-start')
            : (Q[t] > W || n) && o.addClass('mbsc-slider-start'),
          a &&
            j[t] != e &&
            ((S = !0), (j[t] = e), (Q[t] = e), ee._fillValue(e, t, i)),
          r.attr('aria-valuenow', e)
      }
      let v,
        g,
        _,
        w,
        C,
        T,
        M,
        k,
        D,
        S,
        V,
        E,
        I,
        L,
        O,
        P,
        Y,
        H,
        N,
        F,
        $,
        W,
        R,
        q,
        j,
        z,
        B,
        U,
        X,
        K,
        G,
        Z,
        J,
        Q,
        ee = this,
        te = new Date()
      Ht.call(this, e, t, !0),
        (ee._onTap = l),
        (ee.___init = l),
        (ee.___destroy = l),
        (ee._attachChange = function () {
          v.on(B.changeEvent, o)
        }),
        (ee.__init = function (e) {
          var t
          w && ((t = !0), w.parent().remove()),
            ee.___init(e),
            (T = ee._$parent),
            (M = ee._$track),
            (v = T.find('input')),
            (B = ee.settings),
            (W = ee._min),
            ($ = ee._max),
            (D = ee._base || 0),
            (z = ee._step),
            (F = ee._live),
            (G = z % 1 !== 0 ? 100 / (100 * +(z % 1).toFixed(2)) : 1),
            (U = 100 / ($ - W + D) || 100),
            (q = v.length > 1),
            (N = B.rtl),
            (Q = []),
            (j = []),
            v.each(function (e) {
              ;(Q[e] = ee._readValue(Be(this))), Be(this).attr('data-index', e)
            }),
            (w = T.find('.mbsc-slider-handle')),
            (C = T.find(
              q ? '.mbsc-slider-handle-cont' : '.mbsc-progress-cont'
            )),
            w.on('keydown', u).on('keyup', m).on('blur', m),
            C.on('touchstart mousedown' + (B.hover ? ' mouseenter' : ''), s)
              .on('touchmove', n)
              .on('touchend touchcancel' + (B.hover ? ' mouseleave' : ''), i)
              .on('pointercancel', r),
            t || (v.on('click', c), T.on('click', d))
        }),
        (ee.__destroy = function () {
          T.off('click', d),
            v.off(B.changeEvent, o).off('click', c),
            w.off('keydown', u).off('keyup', m).off('blur', m),
            C.off('touchstart mousedown mouseenter', s)
              .off('touchmove', n)
              .off('touchend touchcancel mouseleave', i)
              .off('pointercancel', r),
            ee.___destroy()
        }),
        (ee.refresh = function () {
          v.each(function (e) {
            p(ee._readValue(Be(this)), e, !0, !1, !0, !1)
          })
        }),
        (ee.getVal = function () {
          return q ? Q.slice(0) : Q[0]
        }),
        (ee.setVal = ee._setVal =
          function (e, t, a) {
            Be.isArray(e) || (e = [e]),
              Be.each(e, function (e, t) {
                Q[e] = t
              }),
              Be.each(e, function (e, t) {
                p(t, e, !0, !1, !0, a)
              })
          }),
        a || ee.init(t)
    },
    Qt = function (e, t) {
      let a,
        s,
        n,
        i,
        r = this
      ;(t = t || {}),
        Ge(t, { changeEvent: 'click', round: !1 }),
        Jt.call(this, e, t, !0),
        (r._readValue = function () {
          return e.checked ? 1 : 0
        }),
        (r._fillValue = function (e, t, s) {
          a.prop('checked', !!e), s && a.trigger('change')
        }),
        (r._onTap = function (e) {
          r._setVal(e ? 0 : 1)
        }),
        (r.___init = function () {
          ;(n = r.settings),
            (a = Be(e)),
            (s = a.parent()),
            s.find('.mbsc-switch-track').remove(),
            s.prepend(a),
            a
              .attr('data-role', 'switch')
              .after(
                '<span class="mbsc-progress-cont mbsc-switch-track"><span class="mbsc-progress-track mbsc-progress-anim"><span class="mbsc-slider-handle-cont"><span class="mbsc-slider-handle mbsc-switch-handle" data-index="0"><span class="mbsc-switch-txt-off">' +
                  n.offText +
                  '</span><span class="mbsc-switch-txt-on">' +
                  n.onText +
                  '</span></span></span></span></span>'
              ),
            i && i.destroy(),
            (i = new Wt(e, n)),
            (r._$track = s.find('.mbsc-progress-track')),
            (r._min = 0),
            (r._max = 1),
            (r._step = 1)
        }),
        (r.___destroy = function () {
          i.destroy()
        }),
        (r.getVal = function () {
          return e.checked
        }),
        (r.setVal = function (e, t, a) {
          r._setVal(e ? 1 : 0, t, a)
        }),
        r.init(t)
    }
  ;(Qt.prototype = {
    _class: 'switch',
    _css: 'mbsc-switch',
    _hasTheme: !0,
    _hasLang: !0,
    _hasDef: !0,
    _defaults: { stopProp: !0, offText: 'Off', onText: 'On' }
  }),
    (Ke.Switch = Qt)
  let ea = function (e, t, a) {
    let s,
      n,
      i,
      r,
      o,
      l,
      c,
      d = this,
      u = Be(e)
    na.call(this, e, t, !0),
      (d._update = function (e, t, a, n, r, o) {
        return (
          s.css('width', b(e, 0, i) + '%'),
          r || (t[a] == e && !o) || d._display(e),
          e
        )
      }),
      (d._markupReady = function () {
        var e,
          t = '',
          a = ''
        for (
          n = d._$track,
            s = d._$progress,
            c = d.settings,
            r = d._min,
            i = d._max,
            d._base = r,
            d._rounding = c.rtl ? 'floor' : 'ceil',
            o = u.attr('data-empty') || c.empty,
            l = u.attr('data-filled') || c.filled,
            e = 0;
          e < i;
          ++e
        )
          (t += '<span class="mbsc-ic mbsc-ic-' + o + '"></span>'),
            (a += '<span class="mbsc-ic mbsc-ic-' + l + '"></span>')
        n.html(t),
          n.append(s),
          s.html(a),
          n.append(
            '<span class="mbsc-rating-handle-cont"><span tabindex="0" class="mbsc-slider-handle" aria-valuemin="' +
              r +
              '" aria-valuemax="' +
              i +
              '" data-index="0"></span></span>'
          )
      }),
      a || d.init(t)
  }
  ;(ea.prototype = {
    _class: 'progress',
    _css: 'mbsc-progress mbsc-rating',
    _hasTheme: !0,
    _hasLang: !0,
    _hasDef: !0,
    _defaults: {
      changeEvent: 'change',
      stopProp: !0,
      min: 1,
      max: 5,
      step: 1,
      live: !0,
      round: !0,
      hover: !0,
      highlight: !0,
      returnAffix: !0,
      empty: 'star',
      filled: 'star3'
    }
  }),
    (Ke.Rating = ea)
  let ta = 0,
    aa = 'mbsc-input-wrap',
    sa = function (e, t, a) {
      function s() {
        let e = n('value', m)
        e !== v && i(e)
      }
      function n(e, t) {
        let a = o.attr(e)
        return void 0 === a || '' === a ? t : +a
      }
      function i(e, t, a, s) {
        ;(e = Math.min(h, Math.max(e, m))),
          c.css('width', (100 * (e - m)) / (h - m) + '%'),
          void 0 === a && (a = !0),
          void 0 === s && (s = a),
          (e !== v || t) && g._display(e),
          e !== v &&
            ((v = e), a && o.attr('value', v), s && o.trigger('change'))
      }
      let r,
        o,
        l,
        c,
        d,
        u,
        m,
        h,
        f,
        p,
        v,
        b,
        g = this
      Ht.call(this, e, t, !0),
        (g._display = function (e) {
          ;(b =
            p && f.returnAffix
              ? p.replace(/\{value\}/, e).replace(/\{max\}/, h)
              : e),
            d && d.html(b),
            r && r.html(b)
        }),
        (g._attachChange = function () {
          o.on('change', s)
        }),
        (g.__init = function (t) {
          var a, s, i, b
          if (
            ((f = g.settings),
            (o = Be(e)),
            (b = !!l),
            (l = g._$parent),
            (m = g._min = void 0 === t.min ? n('min', f.min) : t.min),
            (h = g._max = void 0 === t.max ? n('max', f.max) : t.max),
            (v = n('value', m)),
            (a = o.attr('data-val') || f.val),
            (i = o.attr('data-step-labels')),
            (i = i ? JSON.parse(i) : f.stepLabels),
            (p =
              o.attr('data-template') ||
              (100 != h || f.template ? f.template : '{value}%')),
            b
              ? (a &&
                  (r.remove(),
                  l.removeClass(
                    'mbsc-progress-value-' + ('right' == a ? 'right' : 'left')
                  )),
                i && Be('.mbsc-progress-step-label', u).remove())
              : (G(l),
                X(o),
                l
                  .find('.mbsc-input-wrap')
                  .append(
                    '<span class="mbsc-progress-cont"><span class="mbsc-progress-track mbsc-progress-anim"><span class="mbsc-progress-bar"></span></span></span>'
                  ),
                (c = g._$progress = l.find('.mbsc-progress-bar')),
                (u = g._$track = l.find('.mbsc-progress-track'))),
            o.attr('min', m).attr('max', h),
            a &&
              ((r = Be('<span class="mbsc-progress-value"></span>')),
              l
                .addClass(
                  'mbsc-progress-value-' + ('right' == a ? 'right' : 'left')
                )
                .find('.mbsc-input-wrap')
                .append(r)),
            i)
          )
            for (s = 0; s < i.length; ++s)
              u.append(
                '<span class="mbsc-progress-step-label" style="' +
                  (f.rtl ? 'right' : 'left') +
                  ': ' +
                  (100 * (i[s] - m)) / (h - m) +
                  '%" >' +
                  i[s] +
                  '</span>'
              )
          d = Be(o.attr('data-target') || f.target)
        }),
        (g.__destroy = function () {
          l
            .removeClass('mbsc-ic-left mbsc-ic-right')
            .find('.mbsc-progress-cont')
            .remove(),
            l.find('.mbsc-input-ic').remove(),
            o.off('change', s)
        }),
        (g.refresh = function () {
          i(n('value', m), !0, !1)
        }),
        (g.getVal = function () {
          return v
        }),
        (g.setVal = function (e, t, a) {
          i(e, !0, t, a)
        }),
        a || g.init(t)
    }
  ;(sa.prototype = {
    _class: 'progress',
    _css: 'mbsc-progress',
    _hasTheme: !0,
    _hasLang: !0,
    _hasDef: !0,
    _defaults: { min: 0, max: 100, returnAffix: !0 }
  }),
    (Ke.Progress = sa)
  let na = function (e, t, a) {
    let s,
      n,
      i,
      r,
      o,
      l,
      c,
      d,
      u,
      m,
      h,
      f,
      p,
      v = this
    sa.call(this, e, t, !0)
    let y = v.__init,
      _ = v.__destroy
    Jt.call(this, e, t, !0)
    let x = v.__init,
      w = v.__destroy
    ;(v.__init = function (e) {
      y(e), x(e)
    }),
      (v.__destroy = function () {
        _(), w()
      }),
      (v._update = function (e, t, a, s, n, o, f) {
        return (
          d
            ? 0 === a
              ? ((e = Math.min(e, t[1])),
                i.css({
                  width: b(t[1], h, m) - b(e, h, m) + '%',
                  left: u ? 'auto' : b(e, h, m) + '%',
                  right: u ? b(e, h, m) + '%' : 'auto'
                }))
              : ((e = Math.max(e, t[0])),
                i.css({ width: b(e, h, m) - b(t[0], h, m) + '%' }))
            : n || !l
            ? f.css({
                left: u ? 'auto' : (s || b(e, h, m)) + '%',
                right: u ? (s || b(e, h, m)) + '%' : 'auto'
              })
            : i.css('width', (s || b(e, h, m)) + '%'),
          c && r.eq(a).html(e),
          n || (t[a] == e && !o) || v._display(e),
          e
        )
      }),
      (v._readValue = function (e) {
        return +e.val()
      }),
      (v._fillValue = function (e, t, a) {
        s.eq(t).val(e), a && s.eq(t).trigger('change')
      }),
      (v._markupReady = function () {
        var e, t
        if ((c && n.addClass('mbsc-slider-has-tooltip'), 1 != f))
          for (t = (m - h) / f, e = 0; e <= t; ++e)
            o.append(
              '<span class="mbsc-slider-step" style="' +
                (u ? 'right' : 'left') +
                ':' +
                (100 / t) * e +
                '%"></span>'
            )
        s.each(function (e) {
          'range' == this.type &&
            Be(this).attr('min', h).attr('max', m).attr('step', f),
            (l ? i : o).append(
              '<span class="mbsc-slider-handle-cont' +
                (d && !e ? ' mbsc-slider-handle-left' : '') +
                '"><span tabindex="0" class="mbsc-slider-handle" aria-valuemin="' +
                h +
                '" aria-valuemax="' +
                m +
                '" data-index="' +
                e +
                '"></span>' +
                (c ? '<span class="mbsc-slider-tooltip"></span>' : '') +
                '</span>'
            )
        }),
          (r = n.find('.mbsc-slider-tooltip'))
      }),
      (v.___init = function (e) {
        n &&
          (n.removeClass('mbsc-slider-has-tooltip'),
          1 != f && Be('.mbsc-slider-step', o).remove()),
          (n = v._$parent),
          (o = v._$track),
          (i = v._$progress),
          (s = n.find('input')),
          (p = v.settings),
          (h = v._min),
          (m = v._max),
          (v._step = f =
            void 0 === e.step ? +s.attr('step') || p.step : e.step),
          (v._live = g('data-live', p.live, s)),
          (c = g('data-tooltip', p.tooltip, s)),
          (l = g('data-highlight', p.highlight, s) && s.length < 3),
          (d = l && 2 == s.length),
          (u = p.rtl),
          v._markupReady()
      }),
      a || v.init(t)
  }
  ;(na.prototype = {
    _class: 'progress',
    _css: 'mbsc-progress mbsc-slider',
    _hasTheme: !0,
    _hasLang: !0,
    _hasDef: !0,
    _defaults: {
      changeEvent: 'change',
      stopProp: !0,
      min: 0,
      max: 100,
      step: 1,
      live: !0,
      highlight: !0,
      round: !0,
      returnAffix: !0
    }
  }),
    (Ke.Slider = na)
  let ia = function (e, t, a) {
    function s(e, t, a) {
      if (!a) {
        j._value = j._hasValue ? j._tempValue.slice(0) : null
        for (let s = 0; s < x.length; ++s)
          x[s].tempChangedColor &&
            j._value &&
            j._value.indexOf(x[s].tempChangedColor) != -1 &&
            (x[s].changedColor = x[s].tempChangedColor),
            delete x[s].tempChangedColor
      }
      e &&
        (j._isInput && z.val(j._hasValue ? j._tempValue : ''),
        w('onFill', { valueText: j._hasValue ? j._tempValue : '', change: t }),
        t &&
          ((U = Ge(!0, {}, X)), (j._preventChange = !0), z.trigger('change')),
        m(j._value, !0))
    }
    function n(e, t) {
      return (
        (t = void 0 !== t ? t : r(e)),
        '<div class="mbsc-color-input-item" data-color="' +
          (void 0 !== t ? t : e) +
          '" style="background: ' +
          e +
          ';">' +
          (Y
            ? ''
            : '<div class="mbsc-color-input-item-close mbsc-ic mbsc-ic-material-close"></div>') +
          '</div>'
      )
    }
    function i(e) {
      A[0].style.background = e
        ? tt +
          'linear-gradient(left, ' +
          (y.rtl ? '#000000' : '#FFFFFF') +
          ' 0%, ' +
          e +
          ' 50%, ' +
          (y.rtl ? '#FFFFFF' : '#000000') +
          ' 100%)'
        : ''
    }
    function r(e) {
      if (Object.keys(X).length && !isNaN(e)) return e
      for (let t in x) if (e == x[t].color || e == x[t].changedColor) return t
    }
    function o() {
      if (P) {
        let e,
          t = ''
        if ((F.empty(), j._hasValue)) {
          if (Y) t += n(j._value, O)
          else
            for (e = 0; e < j._value.length; ++e)
              t += n(
                j._value[e],
                Object.keys(X).length && X[e].colorIndex
                  ? X[e].colorIndex
                  : r(j._value[e])
              )
          F.append(t),
            j.tap(Be('.mbsc-color-input-item', F), function (e) {
              if (Be(e.target).hasClass('mbsc-color-input-item-close')) {
                var t = Be(this).index()
                e.stopPropagation(),
                  e.preventDefault(),
                  void 0 === O &&
                    (O = Be(e.target).parent().attr('data-color')),
                  V &&
                    ((B = x[O].previewInd),
                    W.eq(B).parent().removeClass('mbsc-color-active'),
                    (U[t] = {}),
                    (X[t] = {})),
                  j._value.splice(t, 1),
                  j.setVal(j._value, !0, !0)
              } else
                E &&
                  'inline' !== y.display &&
                  ((O = Be(e.target).attr('data-color')),
                  isNaN(O) && (O = r(O)),
                  O &&
                    x[O] &&
                    ((x[O].selected = !0),
                    (B = x[O].previewInd),
                    setTimeout(function () {
                      C.scroll($.eq(O), 400), V && T.scroll(W.eq(B), 400)
                    }, 200)))
            })
        }
      }
    }
    function l(e, t) {
      let a,
        s = e.match(/\d+/gim)
      switch (!0) {
        case e.indexOf('rgb') > -1:
          a = J({ r: s[0], g: s[1], b: s[2] })
          break
        case e.indexOf('hsl') > -1:
          a = ie({ h: s[0], s: s[1], l: s[2] })
          break
        case e.indexOf('hsv') > -1:
          a = re({ h: s[0], s: s[1], v: s[2] })
          break
        case e.indexOf('#') > -1:
          a = e
      }
      return c(a, t || y.format)
    }
    function c(e, t) {
      switch (t) {
        case 'rgb':
          return Q(e)
        case 'hsl':
          return ne(e)
        case 'hsv':
          return oe(e)
        default:
          return e
      }
    }
    function d() {
      let e
      for (e = 0; e < y.select; ++e) if (void 0 === X[e].colorIndex) return e
    }
    function u(e, t) {
      Be('.mbsc-color-active', t).removeClass('mbsc-color-active'),
        E &&
          (e.parent().addClass('mbsc-color-active'),
          V &&
            e &&
            void 0 !== B &&
            W.eq(B).parent().addClass('mbsc-color-active'))
    }
    function m(e, t) {
      let a,
        s,
        n = [],
        i = 0,
        r = Be.map(x, function (e) {
          return e.changedColor || e.color
        })
      if (Y) {
        if (
          ((e = Be.isArray(e) ? e[0] : e),
          (s = r.indexOf(e)),
          s > -1 && n.push(s),
          e && !n.length && E)
        ) {
          let l = +Be('.mbsc-color-input-item', F).attr('data-color')
          isNaN(l) || n.push(l), (O = l)
        }
      } else if (e)
        if (V && E)
          for (var c in U)
            void 0 !== U[c].colorIndex && n.push(+U[c].colorIndex)
        else
          for (a = 0; a < e.length; ++a)
            (s = r.indexOf(e[a])), s > -1 && (n.push(s), (r[s] = 'temp' + a))
      for (a = 0; a < n.length; ++a)
        x[n[a]] && h(!0, n[a], i++, x[n[a]].changedColor || x[n[a]].color, !0)
      for (a = 0; a < x.length; ++a)
        n.indexOf(a) == -1 &&
          h(!1, a, void 0, x[a].changedColor || x[a].color, !1)
      if (V)
        for (a = i; a < y.select; ++a)
          (X[a] = {}),
            W &&
              W.eq(a)
                .addClass('mbsc-color-preview-item-empty')
                .css({ background: 'transparent' })
      ;(U = Ge(!0, {}, X)), t !== !1 && o()
    }
    function h(e, t, a, s, n, i) {
      if (
        V &&
        n &&
        ((X[a].colorIndex = e ? t : void 0), (X[a].color = e ? s : void 0), W)
      ) {
        let r = W.eq(a)
        r
          .removeClass('mbsc-color-preview-item-empty')
          .css({ background: e ? s : 'transparent' }),
          e ||
            r
              .addClass('mbsc-color-preview-item-empty')
              .parent()
              .removeClass('mbsc-color-active')
      }
      i &&
        (e
          ? j._tempValue.splice(a, 0, s)
          : j._tempValue.splice(j._tempValue.indexOf(s), 1)),
        $ &&
          (e
            ? $.eq(t).addClass('mbsc-color-selected')
            : $.eq(t)
                .removeClass('mbsc-color-selected')
                .parent()
                .removeClass('mbsc-color-active')),
        (x[t].previewInd = e ? a : void 0),
        (x[t].selected = e)
    }
    function f(e, t) {
      void 0 !== e && (Y || x[e].selected)
        ? ((O = e),
          x[e] &&
            ((k = x[e].changedColor || x[e].color),
            (R = $.eq(e)),
            E &&
              (u($.eq(e), t || ''),
              (D = l(x[e].color, 'hsl')),
              (D.l = l(k, 'hsl').l),
              i(x[e].color),
              L.setVal(100 - D.l, !1, !1))))
        : E && i()
    }
    function v() {
      let e,
        t = []
      for (e = 0; e < x.length; ++e) x[e].selected && t.push(x[e])
      return t
    }
    function b(e, t) {
      let a = Be(e.target).index()
      ;(O = X[a].colorIndex),
        (R = $.eq(O)),
        (B = a),
        f(O, t),
        C.scroll(R, 250),
        w('onPreviewItemTap', { target: e.target, value: X[a].color, index: a })
    }
    function g(e, t) {
      let a = !1,
        s = Be('.mbsc-color-selected', t)
      return (
        (R = Be(e.target)),
        R.hasClass('mbsc-color-clear-item')
          ? ((k = ''), void j.clear())
          : void (
              (Y || H > +s.length || R.hasClass('mbsc-color-selected')) &&
              ((O = R.attr('data-index')),
              V &&
                ((B = void 0 !== x[O].previewInd ? x[O].previewInd : d()),
                (a =
                  E &&
                  R.hasClass('mbsc-color-selected') &&
                  !R.parent().hasClass('mbsc-color-active')),
                W.length > 6 && T.scroll(W.eq(B))),
              (k = x[O].changedColor || x[O].color),
              Y
                ? (s.removeClass('mbsc-color-selected'),
                  (j._tempValue = k),
                  k && R.toggleClass('mbsc-color-selected'),
                  u(R, t))
                : (u(R, t), a || h(!x[O].selected, O, B, k, !0, !0)),
              f(O, t),
              j.live && (j._fillValue(), w('onSet', { value: j._value })),
              w('onItemTap', {
                target: e.target,
                value: k,
                selected: x[O].selected,
                index: O
              }),
              j._updateHeader())
            )
      )
    }
    let y,
      _,
      x,
      w,
      C,
      T,
      M,
      k,
      D,
      S,
      V,
      A,
      E,
      I,
      L,
      O,
      P,
      Y,
      H,
      N,
      F,
      $,
      W,
      R,
      q,
      j = this,
      z = Be(e),
      B = 0,
      U = {},
      X = {}
    ft.call(this, e, t, !0),
      (j.setVal = j._setVal =
        function (e, t, a, n) {
          ;(j._hasValue = null !== e && void 0 !== e),
            (j._tempValue = Y
              ? Be.isArray(e)
                ? e[0]
                : e
              : Be.isArray(e)
              ? e
              : e
              ? [e]
              : []),
            s(t, void 0 === a ? t : a, n)
        }),
      (j.getVal = j._getVal =
        function (e) {
          return j._hasValue || e
            ? N
              ? v()
              : j[e ? '_tempValue' : '_value']
            : null
        }),
      (j._readValue = function () {
        var e = z.val() || ''
        ;(j._hasValue = !1),
          0 !== e.length && '' !== e && (j._hasValue = !0),
          j._hasValue
            ? ((j._tempValue = Y
                ? e
                : 'hex' == y.format
                ? e.split(',')
                : e.match(
                    /[a-z]{3}\((\d+\.?\d{0,}?),\s*([\d.]+)%{0,},\s*([\d.]+)%{0,}\)/gim
                  )),
              s(!0))
            : (j._tempValue = []),
          m(j._tempValue, j._hasValue)
      }),
      (j._fillValue = function () {
        ;(j._hasValue = !0), s(!0, !0)
      }),
      (j._generateContent = function () {
        var e,
          t,
          a,
          s = M ? 1 : 0
        for (
          I = S ? Math.ceil((x.length + s) / y.rows) : y.rows,
            t =
              '<div class="mbsc-color-scroll-cont mbsc-w-p ' +
              (S ? '' : 'mbsc-color-vertical') +
              '"><div class="mbsc-color-cont">' +
              (S ? '<div class="mbsc-color-row">' : ''),
            e = 0;
          e < x.length;
          ++e
        )
          (a = x[e].changedColor || x[e].color),
            M &&
              0 === e &&
              (t +=
                '<div class="mbsc-color-item-c"><div tabindex="0" class="mbsc-color-clear-item mbsc-btn-e mbsc-color-selected"><div class="mbsc-color-clear-cross"></div></div></div>'),
            0 !== e &&
              (e + s) % I === 0 &&
              (t += S ? '</div><div class="mbsc-color-row">' : ''),
            (t +=
              '<div class="mbsc-color-item-c"><div tabindex="0" data-index="' +
              e +
              '" class="mbsc-color-item mbsc-btn-e mbsc-ic mbsc-ic-material-check mbsc-color-btn-e ' +
              (x[e].selected ? 'mbsc-color-selected' : '') +
              '"  style="background:' +
              a +
              '"></div></div>')
        if (
          ((t += '</div></div>' + (S ? '</div>' : '')),
          E &&
            (t +=
              '<div class="mbsc-color-slider-cont"><input class="mbsc-color-slider" type="range" data-highlight="false" value="50" min="0" max="100"/></div>'),
          V)
        ) {
          t +=
            '<div class="mbsc-color-preview-cont"><div class="mbsc-color-refine-preview">'
          for (var n in U)
            t +=
              '<div class="mbsc-color-preview-item-c mbsc-btn-e mbsc-color-btn-e" tabindex="0"><div class="mbsc-color-preview-item ' +
              (U[n].color ? '' : 'mbsc-color-preview-item-empty') +
              '" style="background: ' +
              (U[n].color || 'initial') +
              ';"></div></div>'
          t += '</div></div>'
        }
        return t
      }),
      (j._position = function (e) {
        var t, a
        S ||
          ((t = e.find('.mbsc-color-cont')),
          (a = Math.ceil(t.find('.mbsc-color-item-c')[0].offsetWidth)),
          t.width(
            Math.min(
              Math.floor(e.find('.mbsc-fr-c').width() / a),
              Math.round(x.length / y.rows)
            ) *
              a +
              1
          )),
          C && C.refresh(),
          T && T.refresh()
      }),
      (j._markupInserted = function (e) {
        S ||
          e
            .find('.mbsc-color-scroll-cont')
            .css(
              'max-height',
              e.find('.mbsc-color-item-c')[0].offsetHeight * y.rows
            ),
          (C = new vt(e.find('.mbsc-color-scroll-cont')[0], {
            axis: S ? 'X' : 'Y',
            rtl: y.rtl,
            elastic: 60,
            stopProp: !1,
            mousewheel: y.mousewheel,
            onBtnTap: function (t) {
              g(t, e)
            }
          }))
      }),
      (j._attachEvents = function (e) {
        var t
        ;($ = Be('.mbsc-color-item', e)),
          e.on('keydown', '.mbsc-color-btn-e', function (t) {
            t.stopPropagation(),
              32 == t.keyCode &&
                (t.target.classList.contains('mbsc-color-item')
                  ? g(t, e)
                  : b(t, e))
          }),
          V && (W = Be('.mbsc-color-preview-item', e)),
          E &&
            (e.addClass('mbsc-color-refine'),
            (q = Be('.mbsc-color-slider', e)),
            (L = new na(q[0], { theme: y.theme, rtl: y.rtl })),
            (A = e.find('.mbsc-progress-track')),
            O && j._value && f(O, e),
            q.on('change', function () {
              void 0 !== O &&
                (Y || x[O].selected) &&
                ((D.l = 100 - this.value),
                (t = l(D.toString()).toString()),
                Y
                  ? (j._tempValue = t)
                  : (j._tempValue[void 0 !== B ? B : j._tempValue.length] = t),
                (x[O].tempChangedColor = t),
                $.eq(O).css('background', t),
                V &&
                  ((X[B].color = t),
                  W.eq(B)
                    .removeClass('mbsc-color-preview-item-empty')
                    .css({ background: t })),
                j.live && p(j._fillValue()))
            })),
          V &&
            (T = new vt(e.find('.mbsc-color-preview-cont')[0], {
              axis: 'X',
              rtl: y.rtl,
              mousewheel: y.mousewheel,
              onBtnTap: function (t) {
                b(t, e)
              }
            })),
          j._updateHeader()
      }),
      (j._markupRemove = function () {
        C && C.destroy(), L && L.destroy(), T && T.destroy()
      }),
      (j.__processSettings = function () {
        var t, a
        if (
          ((y = j.settings),
          (w = j.trigger),
          (S = 'horizontal' == y.navigation),
          (j._value = []),
          (j._tempValue = []),
          (Y = 'single' == y.select),
          (M = void 0 !== y.clear ? y.clear : Y),
          (a = y.data || []),
          !a.length)
        )
          switch (y.format) {
            case 'rgb':
              ;(a = [
                'rgb(255,235,60)',
                'rgb(255,153,0)',
                'rgb(244,68,55)',
                'rgb(234,30,99)',
                'rgb(156,38,176)',
                'rgb(104,58,183)',
                'rgb(63,81,181)',
                'rgb(33,150,243)',
                'rgb(0,151,136)',
                'rgb(75,175,79)',
                'rgb(126,93,78)',
                'rgb(158,158,158)'
              ]),
                M && a.splice(10, 0, 'rgb(83, 71, 65)')
              break
            case 'hsl':
              ;(a = [
                'hsl(54,100%,62%)',
                'hsl(36,100%,50%)',
                'hsl(4,90%,59%)',
                'hsl(340,83%,52%)',
                'hsl(291,64%,42%)',
                'hsl(262,52%,47%)',
                'hsl(231,48%,48%)',
                'hsl(207,90%,54%)',
                'hsl(174,100%,30%)',
                'hsl(122,40%,49%)',
                'hsl(19,24%,40%)',
                'hsl(0,0%,62%)'
              ]),
                M && a.splice(10, 0, 'hsl(20, 12%, 29%)')
              break
            default:
              ;(a = [
                '#ffeb3c',
                '#ff9900',
                '#f44437',
                '#ea1e63',
                '#9c26b0',
                '#683ab7',
                '#3f51b5',
                '#2196f3',
                '#009788',
                '#4baf4f',
                '#7e5d4e',
                '#9e9e9e'
              ]),
                M && a.splice(10, 0, '#534741')
          }
        if (
          ((E = 'refine' == y.mode),
          (V = !isNaN(y.select)),
          (H = isNaN(y.select) ? (Y ? 2 : a.length) : y.select),
          (N = Be.isPlainObject(a[0])),
          V && !Object.keys(U).length)
        )
          for (t = 0; t < y.select; ++t) (U[t] = {}), (X[t] = {})
        for (x = a.slice(0), t = 0; t < x.length; ++t)
          Be.isPlainObject(a[t])
            ? (x[t].color = a[t].color)
            : ((a[t] = a[t].toLowerCase()),
              (x[t] = { key: t, name: a[t], color: a[t] }))
        ;(_ = y.defaultValue || x[0].color),
          (k = _),
          (D = l(k, 'hsl')),
          (P = y.enhance && z.is('input')),
          P &&
            (z.hasClass('mbsc-color-input-hdn')
              ? (F = z.prev())
              : ((F = Be(
                  '<div ' +
                    (e.placeholder
                      ? 'data-placeholder="' + e.placeholder + '"'
                      : '') +
                    ' class="mbsc-control mbsc-color-input ' +
                    (y.inputClass || '') +
                    '" readonly ></div>'
                )),
                F.insertBefore(z),
                z.addClass('mbsc-color-input-hdn').attr('tabindex', -1)),
            (y.anchor = F),
            j.attachShow(F))
      }),
      (j.__init = function () {
        y.cssClass = (y.cssClass || '') + ' mbsc-color'
      }),
      (j.__destroy = function () {
        P && (z.removeClass('mbsc-color-input-hdn'), F.remove())
      }),
      a || j.init(t)
  }
  ;(ia.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _class: 'color',
    _defaults: Ge({}, ft.prototype._defaults, {
      headerText: !1,
      validate: l,
      parseValue: l,
      enhance: !0,
      rows: 2,
      select: 'single',
      format: 'hex',
      navigation: 'horizontal'
    })
  }),
    (Ke.Color = ia),
    (ye.themes.color = ye.themes.frame),
    (_e.color = {
      hsv2hex: re,
      hsv2rgb: ee,
      rgb2hsv: te,
      rgb2hex: J,
      rgb2hsl: ae,
      hex2rgb: Q,
      hex2hsv: oe,
      hex2hsl: ne
    }),
    o('color', ia, !1)
  let ra = {
    autoCorrect: !0,
    showSelector: !0,
    minRange: 1,
    rangeTap: !0,
    fromText: 'Start',
    toText: 'End'
  }
  ;(bt.range = function (e) {
    function t(e, t) {
      e &&
        (e.setFullYear(t.getFullYear()),
        e.setMonth(t.getMonth()),
        e.setDate(t.getDate()))
    }
    function a(t, a) {
      var s = e._order,
        n = new Date(t)
      return (
        void 0 === s.h && n.setHours(a ? 23 : 0),
        void 0 === s.i && n.setMinutes(a ? 59 : 0),
        void 0 === s.s && n.setSeconds(a ? 59 : 0),
        n.setMilliseconds(a ? 999 : 0),
        n
      )
    }
    function s(t) {
      ;(e._startDate = V = C),
        (e._endDate = E = M),
        H.startInput &&
          (Be(H.startInput).val(x), t && Be(H.startInput).trigger('change')),
        H.endInput &&
          (Be(H.endInput).val(w), t && Be(H.endInput).trigger('change'))
    }
    function n(e, t) {
      return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t)
    }
    function i(e) {
      v
        ? (M - C > H.maxRange - 1 &&
            (e
              ? (C = new Date(Math.max(y, M - H.maxRange + 1)))
              : (M = new Date(Math.min(g, +C + H.maxRange - 1)))),
          M - C < H.minRange - 1 &&
            (e
              ? (C = new Date(Math.max(y, M - H.minRange + 1)))
              : (M = new Date(Math.min(g, +C + H.minRange - 1)))))
        : (Math.ceil((M - C) / R) > j &&
            (e
              ? (C = a(Math.max(y, n(M, 1 - j)), !1))
              : (M = a(Math.min(g, n(C, j - 1)), !0))),
          Math.ceil((M - C) / R) < q &&
            (e
              ? (C = a(Math.max(y, n(M, 1 - q)), !1))
              : (M = a(Math.min(g, n(C, q - 1)), !0))))
    }
    function r(e, t) {
      var a = !0
      return e && C && M && (i(I), i(!I)), (C && M) || (a = !1), t && d(), a
    }
    function o() {
      return C && M
        ? Math.max(
            1,
            Math.round(
              (new Date(M).setHours(0, 0, 0, 0) -
                new Date(C).setHours(0, 0, 0, 0)) /
                864e5
            ) + 1
          )
        : 0
    }
    function l(e) {
      e.addClass(B).attr('aria-checked', 'true')
    }
    function c() {
      S &&
        h &&
        (Be('.mbsc-range-btn', h).removeClass(B).removeAttr('aria-checked'),
        l(Be('.mbsc-range-btn', h).eq(I)))
    }
    function d() {
      var e,
        t,
        a,
        s,
        n,
        i = 0,
        r =
          F || !I
            ? ' mbsc-cal-day-hl mbsc-cal-sel-start'
            : ' mbsc-cal-sel-start',
        o = F || I ? ' mbsc-cal-day-hl mbsc-cal-sel-end' : ' mbsc-cal-sel-end'
      if (
        ((x = C ? P(p, C, H) : ''),
        (w = M ? P(p, M, H) : ''),
        h &&
          (Be('.mbsc-range-btn-v-start', h).html(x || '&nbsp;'),
          Be('.mbsc-range-btn-v-end', h).html(w || '&nbsp;'),
          (e = C ? new Date(C) : null),
          (a = M ? new Date(M) : null),
          !e && a && (e = new Date(a)),
          !a && e && (a = new Date(e)),
          (n = I ? a : e),
          Be('.mbsc-cal-day-picker .mbsc-cal-day-hl', h).removeClass(U),
          Be('.mbsc-cal-day-picker .mbsc-selected', h)
            .removeClass('mbsc-cal-sel-start mbsc-cal-sel-end ' + B)
            .removeAttr('aria-selected'),
          e && a))
      )
        for (
          t = e.setHours(0, 0, 0, 0), s = a.setHours(0, 0, 0, 0);
          a >= e && i < 126;

        )
          Be(
            '.mbsc-cal-day[data-full="' +
              n.getFullYear() +
              '-' +
              (n.getMonth() + 1) +
              '-' +
              n.getDate() +
              '"]',
            h
          )
            .addClass(
              B +
                ' ' +
                (n.getTime() === t ? r : '') +
                (n.getTime() === s ? o : '')
            )
            .attr('aria-selected', 'true'),
            n.setDate(n.getDate() + (I ? -1 : 1)),
            i++
    }
    function u(e, t) {
      return {
        h: e ? e.getHours() : t ? 23 : 0,
        i: e ? e.getMinutes() : t ? 59 : 0,
        s: e ? e.getSeconds() : t ? 59 : 0
      }
    }
    var m,
      h,
      f,
      p,
      v,
      b,
      g,
      y,
      _,
      x,
      w,
      C,
      T,
      M,
      k,
      D,
      S,
      V = e._startDate,
      E = e._endDate,
      I = 0,
      L = new Date(),
      O = Ge({}, e.settings),
      H = Ge(e.settings, ra, O),
      N = H.anchor,
      F = H.rangeTap,
      R = 864e5,
      q = Math.max(1, Math.ceil(H.minRange / R)),
      j = Math.max(1, Math.ceil(H.maxRange / R)),
      z = 'mbsc-disabled ' + (H.disabledClass || ''),
      B = 'mbsc-selected ' + (H.selectedClass || ''),
      U = 'mbsc-cal-day-hl',
      X =
        null === H.defaultValue
          ? []
          : H.defaultValue || [
              new Date(L.setHours(0, 0, 0, 0)),
              new Date(
                L.getFullYear(),
                L.getMonth(),
                L.getDate() + 6,
                23,
                59,
                59,
                999
              )
            ]
    return (
      F && (H.tabs = !0),
      (m = Lt.call(this, e)),
      (p = e._format),
      (v = /time/i.test(H.controls.join(','))),
      (D = 'time' === H.controls.join('')),
      (S =
        1 != H.controls.length ||
        'calendar' != H.controls[0] ||
        H.showSelector),
      (g = H.max ? a(W(H.max, p, H), !0) : 1 / 0),
      (y = H.min ? a(W(H.min, p, H), !1) : -(1 / 0)),
      (X[0] = W(X[0], p, H, H.isoParts)),
      (X[1] = W(X[0], p, H, H.isoParts)),
      H.startInput &&
        e.attachShow(Be(H.startInput), function () {
          ;(I = 0), (H.anchor = N || Be(H.startInput))
        }),
      H.endInput &&
        e.attachShow(Be(H.endInput), function () {
          ;(I = 1), (H.anchor = N || Be(H.endInput))
        }),
      (e._getDayProps = function (e, t) {
        var a = C ? new Date(C.getFullYear(), C.getMonth(), C.getDate()) : null,
          s = M ? new Date(M.getFullYear(), M.getMonth(), M.getDate()) : null
        return {
          selected: a && s && e >= a && e <= M,
          cssClass:
            t.cssClass +
            ' ' +
            (((F || !I) && a && a.getTime() === e.getTime()) ||
            ((F || I) && s && s.getTime() === e.getTime())
              ? U
              : '') +
            (a && a.getTime() === e.getTime() ? ' mbsc-cal-sel-start' : '') +
            (s && s.getTime() === e.getTime() ? ' mbsc-cal-sel-end' : '')
        }
      }),
      (e.setVal = function (t, a, s, n, i) {
        var r = t || [],
          o = t
        ;(_ = !0),
          (C = W(r[0], p, H, H.isoParts)),
          (x = C ? P(p, C, H) : ''),
          I || (o = m.parseValue(C, e)),
          (M = W(r[1], p, H, H.isoParts)),
          (w = M ? P(p, M, H) : ''),
          I && (o = m.parseValue(M, e)),
          n || ((e._startDate = V = C), (e._endDate = E = M)),
          e._setVal(o, a, s, n, i)
      }),
      (e.getVal = function (t) {
        return t
          ? [$(C, H, p), $(M, H, p)]
          : e._hasValue
          ? [$(V, H, p), $(E, H, p)]
          : null
      }),
      (e.setActiveDate = function (t) {
        var a
        ;(I = 'start' == t ? 0 : 1),
          (a = 'start' == t ? C : M),
          e.isVisible() &&
            (c(),
            F ||
              (Be('.mbsc-cal-table .mbsc-cal-day-hl', h).removeClass(U),
              a &&
                Be(
                  '.mbsc-cal-day[data-full="' +
                    a.getFullYear() +
                    '-' +
                    (a.getMonth() + 1) +
                    '-' +
                    a.getDate() +
                    '"]',
                  h
                ).addClass(U)),
            a && ((b = !0), e.setDate(a, !1, 1e3, !0)))
      }),
      (e.getValue = e.getVal),
      Ge({}, m, {
        highlight: !1,
        outerMonthChange: !1,
        formatValue: function () {
          return x + (H.endInput ? '' : w ? ' - ' + w : '')
        },
        parseValue: function (t) {
          var a = t ? t.split(' - ') : []
          return (
            (H.defaultValue = X[1]),
            (E = Y(p, H.endInput ? Be(H.endInput).val() : a[1], H)),
            (H.defaultValue = X[0]),
            (V = Y(p, H.startInput ? Be(H.startInput).val() : a[0], H)),
            (H.defaultValue = X[I]),
            (x = V ? P(p, V, H) : ''),
            (w = E ? P(p, E, H) : ''),
            (e._startDate = V),
            (e._endDate = E),
            m.parseValue(I ? E : V, e)
          )
        },
        onFill: function (e) {
          s(e.change)
        },
        onBeforeClose: function (t) {
          if ('set' === t.button && !r(!0, !0))
            return e.setActiveDate(I ? 'start' : 'end'), !1
        },
        onHide: function () {
          m.onHide.call(e), (I = 0), (h = null), (H.anchor = N)
        },
        onClear: function () {
          F && (I = 0)
        },
        onBeforeShow: function () {
          ;(C = V || X[0]),
            (M = E || X[1]),
            (T = u(C, 0)),
            (k = u(M, 1)),
            H.counter &&
              (H.headerText = function () {
                var e = o()
                return (
                  e > 1
                    ? H.selectedPluralText || H.selectedText
                    : H.selectedText
                ).replace(/{count}/, e)
              }),
            (_ = !0)
        },
        onMarkupReady: function (t) {
          var a
          C && ((b = !0), e.setDate(C, !1, 0, !0), (C = e.getDate(!0))),
            M && ((b = !0), e.setDate(M, !1, 0, !0), (M = e.getDate(!0))),
            ((I && M) || (!I && C)) &&
              ((b = !0), e.setDate(I ? M : C, !1, 0, !0)),
            d(),
            m.onMarkupReady.call(this, t),
            (h = Be(t.target)),
            h.addClass('mbsc-range'),
            S &&
              ((a =
                '<div class="mbsc-range-btn-t" role="radiogroup"><div class="mbsc-range-btn-c mbsc-range-btn-start"><div role="radio" data-select="start" class="mbsc-fr-btn-e mbsc-fr-btn-nhl mbsc-range-btn">' +
                H.fromText +
                '<div class="mbsc-range-btn-v mbsc-range-btn-v-start">' +
                (x || '&nbsp;') +
                '</div></div></div><div class="mbsc-range-btn-c mbsc-range-btn-end"><div role="radio" data-select="end" class="mbsc-fr-btn-e mbsc-fr-btn-nhl mbsc-range-btn">' +
                H.toText +
                '<div class="mbsc-range-btn-v mbsc-range-btn-v-end">' +
                (w || '&nbsp;') +
                '</div></div></div></div>'),
              H.headerText
                ? Be('.mbsc-fr-hdr', h).after(a)
                : Be('.mbsc-fr-w', h).prepend(a),
              c()),
            Be('.mbsc-range-btn', h).on('touchstart click', function (t) {
              A(t, this) &&
                (e._showDayPicker(),
                e.setActiveDate(Be(this).attr('data-select')))
            })
        },
        onDayChange: function (e) {
          ;(e.active = I ? 'end' : 'start'), (f = !0)
        },
        onSetDate: function (s) {
          var n
          b ||
            ((n = a(s.date, I)),
            (_ && !f) ||
              (F &&
                f &&
                (1 == I && n < C && (I = 0),
                I
                  ? n.setHours(k.h, k.i, k.s, 999)
                  : n.setHours(T.h, T.i, T.s, 0)),
              I
                ? ((M = new Date(n)), (k = u(M)))
                : ((C = new Date(n)), (T = u(C))),
              D && H.autoCorrect && (t(C, n), t(M, n)),
              F && f && !I && (M = null))),
            D &&
              !H.autoCorrect &&
              M < C &&
              (M = new Date(M.setDate(M.getDate() + 1))),
            (e._isValid = r(_ || f || H.autoCorrect, !b)),
            (s.active = I ? 'end' : 'start'),
            !b && F && (f && (I = I ? 0 : 1), c()),
            e.isVisible() &&
              (e._isValid
                ? Be('.mbsc-fr-btn-s .mbsc-fr-btn', e._markup).removeClass(z)
                : Be('.mbsc-fr-btn-s .mbsc-fr-btn', e._markup).addClass(z)),
            (f = !1),
            (_ = !1),
            (b = !1)
        },
        onTabChange: function (t) {
          'calendar' != t.tab && e.setDate(I ? M : C, !1, 1e3, !0), r(!0, !0)
        }
      })
    )
  }),
    o('range', xt),
    o('scroller', xt, !1)
  let oa,
    la = 'ios' == Oe && Ye > 7,
    ca = 1,
    da = 'transparent',
    ua = function (e, t) {
      function a() {
        ;(Tt = !1),
          (vt = !1),
          (ee = 0),
          (Lt = 0),
          (Ot = new Date()),
          (Ue = re.width()),
          (ce = N(re)),
          (et = ce.index(Ke)),
          (Je = Ke[0].offsetHeight),
          (sa = Ke[0].offsetTop),
          (jt = zt[Ke.attr('data-type') || 'defaults']),
          (It = jt.stages)
      }
      function s(e) {
        let t
        'touchstart' === e.type && ((bt = !0), clearTimeout(gt)),
          !A(e, this) ||
            Z ||
            ta ||
            oa ||
            ua ||
            ((Z = !0),
            (te = !0),
            (Pt = x(e, 'X')),
            (Yt = x(e, 'Y')),
            (pe = 0),
            (ve = 0),
            (Ke = Be(this)),
            (t = Ke),
            a(),
            (Wt =
              Dt.onItemTap ||
              jt.tap ||
              Ke.hasClass('mbsc-lv-parent') ||
              Ke.hasClass('mbsc-lv-back')),
            (it = Ke.offset().top),
            Wt &&
              (Q = setTimeout(function () {
                t.addClass('mbsc-lv-item-active'),
                  Me('onItemActivate', { target: t[0], domEvent: e })
              }, 120)),
            Jt.sortable &&
              !Ke.hasClass('mbsc-lv-back') &&
              (Jt.sortable.group ||
                ((ft =
                  Ke.nextUntil('.mbsc-lv-gr-title').filter('.mbsc-lv-item')),
                (yt =
                  Ke.prevUntil('.mbsc-lv-gr-title').filter('.mbsc-lv-item'))),
              (ct =
                (Jt.sortable.group
                  ? re.children(nt).eq(0)
                  : yt.length
                  ? yt.eq(-1)
                  : Ke)[0].offsetTop - sa),
              (lt =
                (Jt.sortable.group
                  ? re.children(nt).eq(-1)
                  : ft.length
                  ? ft.eq(-1)
                  : Ke)[0].offsetTop - sa),
              Jt.sortable.handle
                ? Be(e.target).hasClass('mbsc-lv-handle') &&
                  (clearTimeout(Q),
                  'Moz' === st
                    ? (e.preventDefault(), d())
                    : (qt = setTimeout(function () {
                        d()
                      }, 100)))
                : (qt = setTimeout(function () {
                    ke.appendTo(Ke),
                      (ke[0].style[st + 'Animation'] =
                        'mbsc-lv-fill ' + (Dt.sortDelay - 100) + 'ms linear'),
                      clearTimeout(we),
                      clearTimeout(Q),
                      (te = !1),
                      (qt = setTimeout(function () {
                        ;(ke[0].style[st + 'Animation'] = ''), d()
                      }, Dt.sortDelay - 80))
                  }, 80))),
            'mousedown' == e.type &&
              Be(document).on('mousemove', n).on('mouseup', i))
      }
      function n(e) {
        let t = !1,
          a = !0,
          s = ee
        if (Z)
          if (
            ((Ce = x(e, 'X')),
            (Te = x(e, 'Y')),
            (pe = Ce - Pt),
            (ve = Te - Yt),
            clearTimeout(we),
            ye ||
              Nt ||
              St ||
              Ke.hasClass('mbsc-lv-back') ||
              (Math.abs(ve) > 10
                ? ((St = !0),
                  i(
                    Ge({}, e, {
                      type: 'mousemove' == e.type ? 'mouseup' : 'touchend'
                    })
                  ),
                  clearTimeout(Q))
                : Math.abs(pe) > 7 && r()),
            Nt)
          )
            e.preventDefault(), (ee = (pe / Ue) * 100), o(s)
          else if (ye) {
            e.preventDefault()
            var n,
              l = Xt.scrollTop(),
              c = Math.max(ct, Math.min(ve + Gt, lt)),
              d = Ee ? it - Zt + l - Gt : it
            Kt + l < d + c + Je
              ? (Xt.scrollTop(d + c - Kt + Je), (n = !0))
              : d + c < l && (Xt.scrollTop(d + c), (n = !0)),
              n && (Gt += Xt.scrollTop() - l),
              mt &&
                (Jt.sortable.multiLevel && ut.hasClass('mbsc-lv-parent')
                  ? sa + Je / 4 + c > mt
                    ? (t = !0)
                    : sa + Je - Je / 4 + c > mt &&
                      ((be = ut.addClass('mbsc-lv-item-hl')), (a = !1))
                  : sa + Je / 2 + c > mt &&
                    (ut.hasClass('mbsc-lv-back')
                      ? Jt.sortable.multiLevel &&
                        ((ge = ut.addClass('mbsc-lv-item-hl')), (a = !1))
                      : (t = !0)),
                t &&
                  (_t.insertAfter(ut),
                  (xt = ut),
                  (ut = W(ut, 'next')),
                  (wt = mt),
                  (mt = ut.length && ut[0].offsetTop),
                  ie++)),
              !t &&
                wt &&
                (Jt.sortable.multiLevel && xt.hasClass('mbsc-lv-parent')
                  ? sa + Je - Je / 4 + c < wt
                    ? (t = !0)
                    : sa + Je / 4 + c < wt &&
                      ((be = xt.addClass('mbsc-lv-item-hl')), (a = !1))
                  : sa + Je / 2 + c < wt &&
                    (xt.hasClass('mbsc-lv-back')
                      ? Jt.sortable.multiLevel &&
                        ((ge = xt.addClass('mbsc-lv-item-hl')), (a = !1))
                      : (t = !0)),
                t &&
                  (_t.insertBefore(xt),
                  (ut = xt),
                  (xt = W(xt, 'prev')),
                  (mt = wt),
                  (wt = xt.length && xt[0].offsetTop + xt[0].offsetHeight),
                  ie--)),
              a &&
                (be && (be.removeClass('mbsc-lv-item-hl'), (be = !1)),
                ge && (ge.removeClass('mbsc-lv-item-hl'), (ge = !1))),
              t && Me('onSortChange', { target: Ke[0], index: ie }),
              D(Ke, c),
              Me('onSort', { target: Ke[0], index: ie })
          } else (Math.abs(pe) > 5 || Math.abs(ve) > 5) && S()
      }
      function i(e) {
        let t,
          a,
          s,
          r,
          o = Ke
        Z &&
          ((Z = !1),
          S(),
          'mouseup' == e.type &&
            Be(document).off('mousemove', n).off('mouseup', i),
          St ||
            (gt = setTimeout(function () {
              bt = !1
            }, 300)),
          (Nt || St || ye) && (vt = !0),
          Nt
            ? c()
            : ye
            ? ((s = re),
              be
                ? (O(Ke.detach()),
                  (a = ra[be.attr('data-ref')]),
                  (ie = N(a.child).length),
                  be.removeClass('mbsc-lv-item-hl'),
                  Dt.navigateOnDrop
                    ? U(be, function () {
                        Jt.add(null, Ke, null, null, be, !0),
                          z(Ke),
                          m(Ke, et, s, !0)
                      })
                    : (Jt.add(null, Ke, null, null, be, !0), m(Ke, et, s, !0)))
                : ge
                ? (O(Ke.detach()),
                  (a = ra[ge.attr('data-back')]),
                  (ie = N(a.parent).index(a.item) + 1),
                  ge.removeClass('mbsc-lv-item-hl'),
                  Dt.navigateOnDrop
                    ? U(ge, function () {
                        Jt.add(null, Ke, ie, null, re, !0),
                          z(Ke),
                          m(Ke, et, s, !0)
                      })
                    : (Jt.add(null, Ke, ie, null, a.parent, !0),
                      m(Ke, et, s, !0)))
                : ((t = _t[0].offsetTop - sa),
                  D(
                    Ke,
                    t,
                    6 * Math.abs(t - Math.max(ct, Math.min(ve + Gt, lt))),
                    function () {
                      O(Ke), Ke.insertBefore(_t), m(Ke, et, s, ie !== et)
                    }
                  )),
              (ye = !1))
            : !St &&
              Math.abs(pe) < 5 &&
              Math.abs(ve) < 5 &&
              (jt.tap &&
                (r = jt.tap.call(
                  Qt,
                  { target: Ke, index: et, domEvent: e },
                  Jt
                )),
              Wt &&
                ('touchend' === e.type && y(),
                Ke.addClass('mbsc-lv-item-active'),
                Me('onItemActivate', { target: Ke[0], domEvent: e })),
              (r = Me('onItemTap', { target: Ke[0], index: et, domEvent: e })),
              r !== !1 && U(Ke)),
          clearTimeout(Q),
          setTimeout(function () {
            o.removeClass('mbsc-lv-item-active'),
              Me('onItemDeactivate', { target: o[0] })
          }, 100),
          (St = !1),
          (de = null))
      }
      function r() {
        ;(Nt = P(jt.swipe, {
          target: Ke[0],
          index: et,
          direction: pe > 0 ? 'right' : 'left'
        })),
          Nt &&
            (S(),
            clearTimeout(Q),
            jt.actions
              ? ((J = j(jt, pe)),
                dt
                  .html(jt.icons)
                  .show()
                  .children()
                  .css('width', J + '%'),
                je.hide(),
                Be('.mbsc-lv-ic-m', ze).removeClass('mbsc-lv-ic-disabled'),
                Be(jt.leftMenu).each(_),
                Be(jt.rightMenu).each(_))
              : (je.show(),
                dt.hide(),
                (ue = jt.start),
                (de = It[ue]),
                (Ct = It[ue - 1]),
                (ht = It[ue + 1])),
            Ke.addClass('mbsc-lv-item-swiping').removeClass(
              'mbsc-lv-item-active'
            ),
            Rt.css('line-height', Je + 'px'),
            ze
              .css({ top: sa, height: Je, backgroundColor: R(pe) })
              .addClass('mbsc-lv-stage-c-v')
              .appendTo(re.parent()),
            Dt.iconSlide && Ke.append(je),
            Me('onSlideStart', { target: Ke[0], index: et }))
      }
      function o(e) {
        let t = !1
        kt ||
          (jt.actions
            ? ze.attr(
                'class',
                'mbsc-lv-stage-c-v mbsc-lv-stage-c mbsc-lv-' +
                  (ee < 0 ? 'right' : 'left')
              )
            : (Ct && (ee < 0 ? ee <= Ct.percent : ee < de.percent)
                ? (ue--, (ht = de), (de = Ct), (Ct = It[ue - 1]), (t = !0))
                : ht &&
                  (ee < 0 ? ee > de.percent : ee >= ht.percent) &&
                  (ue++, (Ct = de), (de = ht), (ht = It[ue + 1]), (t = !0)),
              de &&
                ((t || ee > 0 == e <= 0) && V(de, Dt.iconSlide),
                t &&
                  Me('onStageChange', {
                    target: Ke[0],
                    index: et,
                    stage: de
                  }))),
          Vt || ((kt = !0), (Mt = Re(T))))
      }
      function c(e) {
        let t,
          a,
          s,
          n = !1,
          i = !0
        qe(Mt),
          (kt = !1),
          Vt || T(),
          jt.actions
            ? Math.abs(ee) > 10 &&
              J &&
              (k(Ke, ee < 0 ? -J : J, 200),
              (n = !0),
              (oa = !0),
              (ae = Ke),
              (se = et),
              Be(document).on(
                'touchstart.mbsc-lv-conf mousedown.mbsc-lv-conf',
                function (t) {
                  t.preventDefault(), M(Ke, !0, e)
                }
              ))
            : ee &&
              (Dt.quickSwipe &&
                !Vt &&
                ((s = new Date() - Ot),
                (t = s < 300 && pe < -50),
                (a = s < 300 && pe > 50),
                t
                  ? ((Tt = !0), (de = jt.left), V(de, Dt.iconSlide))
                  : a && ((Tt = !0), (de = jt.right), V(de, Dt.iconSlide))),
              de &&
                de.action &&
                ((fe = P(de.disabled, { target: Ke[0], index: et })),
                fe ||
                  ((n = !0),
                  (oa = Vt || P(de.confirm, { target: Ke[0], index: et })),
                  oa
                    ? (k(
                        Ke,
                        ((ee < 0 ? -1 : 1) * je[0].offsetWidth * 100) / Ue,
                        200,
                        !0
                      ),
                      C(de, Ke, et, !1, e))
                    : w(de, Ke, et, e)))),
          n || M(Ke, i, e),
          (Nt = !1)
      }
      function d() {
        ;(ye = !0),
          (be = !1),
          (ge = !1),
          (Gt = 0),
          (ie = et),
          Dt.vibrate && v(),
          (ut = W(Ke, 'next')),
          (mt = ut.length && ut[0].offsetTop),
          (xt = W(Ke, 'prev')),
          (wt = xt.length && xt[0].offsetTop + xt[0].offsetHeight),
          _t.height(Je).insertAfter(Ke),
          Ke.css({ top: sa })
            .addClass('mbsc-lv-item-dragging')
            .removeClass('mbsc-lv-item-active')
            .appendTo(_e),
          Me('onSortStart', { target: Ke[0], index: ie })
      }
      function m(e, t, a, s) {
        e.removeClass('mbsc-lv-item-dragging'),
          _t.remove(),
          Me('onSortEnd', { target: e[0], index: ie }),
          Dt.vibrate && v(),
          s &&
            (Jt.addUndoAction(function (s) {
              Jt.move(e, t, null, s, a, !0)
            }, !0),
            Me('onSortUpdate', { target: e[0], index: ie }))
      }
      function h() {
        bt ||
          (clearTimeout(Ne),
          oa && Be(document).trigger('touchstart'),
          Pe && (Jt.close(Oe, Ye), (Pe = !1), (Oe = null)))
      }
      function f() {
        clearTimeout(me),
          (me = setTimeout(function () {
            ;(Kt = Xt[0].innerHeight || Xt.innerHeight()),
              (Zt = Ee ? Xt.offset().top : 0),
              Z &&
                ((sa = Ke[0].offsetTop),
                (Je = Ke[0].offsetHeight),
                ze.css({ top: sa, height: Je }))
          }, 200))
      }
      function b(e) {
        vt && (e.stopPropagation(), e.preventDefault(), (vt = !1))
      }
      function g() {
        if (ye || !Z) {
          let e,
            t = Xt.scrollTop(),
            a = ea.offset().top,
            s = ea[0].offsetHeight,
            n = Ee ? Xt.offset().top : t
          Be('.mbsc-lv-gr-title', ea).each(function (t, a) {
            Be(a).offset().top < n && (e = a)
          }),
            a < n && a + s > n
              ? Se.show().empty().append(Be(e).clone())
              : Se.hide()
        }
      }
      function _(e, t) {
        P(t.disabled, { target: Ke[0], index: et }) &&
          Be('.mbsc-ic-' + t.icon, ze).addClass('mbsc-lv-ic-disabled')
      }
      function w(e, t, a, s) {
        let n,
          i = {
            icon: 'undo2',
            text: Dt.undoText,
            action: function () {
              Jt.undo()
            }
          }
        e.undo &&
          (Jt.startActionTrack(),
          Be.isFunction(e.undo) &&
            Jt.addUndoAction(function () {
              e.undo.call(Qt, { target: t[0], index: a }, Jt)
            }),
          (Bt = t.attr('data-ref'))),
          (n = e.action.call(Qt, { target: t[0], index: a }, Jt)),
          e.undo
            ? (Jt.endActionTrack(),
              n !== !1 && k(t, +t.attr('data-pos') < 0 ? -100 : 100, 200),
              _t.height(Je).insertAfter(t),
              t.css('top', sa).addClass('mbsc-lv-item-undo'),
              dt.hide(),
              je.show(),
              ze.append(je),
              V(i),
              C(i, t, a, !0, s))
            : M(t, n, s)
      }
      function C(e, t, a, s, n) {
        let i, r
        ;(oa = !0),
          Be(document)
            .off('.mbsc-lv-conf')
            .on('touchstart.mbsc-lv-conf mousedown.mbsc-lv-conf', function (e) {
              e.preventDefault(), s && L(t), M(t, !0, n)
            }),
          he ||
            je
              .off('.mbsc-lv-conf')
              .on(
                'touchstart.mbsc-lv-conf mousedown.mbsc-lv-conf',
                function (e) {
                  e.stopPropagation(), (i = x(e, 'X')), (r = x(e, 'Y'))
                }
              )
              .on('touchend.mbsc-lv-conf mouseup.mbsc-lv-conf', function (o) {
                o.preventDefault(),
                  'touchend' === o.type && y(),
                  Math.abs(x(o, 'X') - i) < 10 &&
                    Math.abs(x(o, 'Y') - r) < 10 &&
                    (w(e, t, a, n), s && ((Ut = null), L(t)))
              })
      }
      function T() {
        k(Ke, Lt + (100 * pe) / Ue), (kt = !1)
      }
      function M(e, t, a) {
        Be(document).off('.mbsc-lv-conf'),
          je.off('.mbsc-lv-conf'),
          t !== !1
            ? k(e, 0, '0' !== e.attr('data-pos') ? 200 : 0, !1, function () {
                I(e, a), O(e)
              })
            : I(e, a),
          (oa = !1)
      }
      function k(e, t, a, s, n) {
        ;(t = Math.max(
          'right' == Nt ? 0 : -100,
          Math.min(t, 'left' == Nt ? 0 : 100)
        )),
          (Ht = e[0].style),
          e.attr('data-pos', t),
          (Ht[st + 'Transform'] =
            'translate3d(' + (s ? (Ue * t) / 100 + 'px' : t + '%') + ',0,0)'),
          (Ht[st + 'Transition'] = tt + 'transform ' + (a || 0) + 'ms'),
          n &&
            (ta++,
            setTimeout(function () {
              n(), ta--
            }, a)),
          (ee = t)
      }
      function D(e, t, a, s) {
        ;(t = Math.max(ct, Math.min(t, lt))),
          (Ht = e[0].style),
          (Ht[st + 'Transform'] = 'translate3d(0,' + t + 'px,0)'),
          (Ht[st + 'Transition'] =
            tt + 'transform ' + (a || 0) + 'ms ease-out'),
          s &&
            (ta++,
            setTimeout(function () {
              s(), ta--
            }, a))
      }
      function S() {
        clearTimeout(qt), !te && Jt.sortable && ((te = !0), ke.remove())
      }
      function V(e, t) {
        let a = P(e.text, { target: Ke[0], index: et }) || ''
        P(e.disabled, { target: Ke[0], index: et })
          ? ze.addClass('mbsc-lv-ic-disabled')
          : ze.removeClass('mbsc-lv-ic-disabled'),
          ze.css('background-color', e.color || (0 === e.percent ? R(ee) : da)),
          je.attr(
            'class',
            'mbsc-lv-ic-c mbsc-lv-ic-' +
              (t ? 'move-' : '') +
              (ee < 0 ? 'right' : 'left')
          ),
          We.attr(
            'class',
            ' mbsc-lv-ic-s mbsc-lv-ic mbsc-ic mbsc-ic-' + (e.icon || 'none')
          ),
          Rt.attr(
            'class',
            'mbsc-lv-ic-text' +
              (e.icon ? '' : ' mbsc-lv-ic-text-only') +
              (a ? '' : ' mbsc-lv-ic-only')
          ).html(a || '&nbsp;'),
          Dt.animateIcons &&
            (Tt
              ? We.addClass('mbsc-lv-ic-v')
              : setTimeout(function () {
                  We.addClass('mbsc-lv-ic-a')
                }, 10))
      }
      function I(e, t) {
        Z ||
          (We.attr('class', 'mbsc-lv-ic-s mbsc-lv-ic mbsc-ic mbsc-ic-none'),
          ze.attr('style', '').removeClass('mbsc-lv-stage-c-v'),
          Rt.html('')),
          ze.removeClass('mbsc-lv-left mbsc-lv-right'),
          e && (Me('onSlideEnd', { target: e[0], index: et }), t && t())
      }
      function L(e) {
        e.css('top', '').removeClass('mbsc-lv-item-undo'),
          Ut
            ? Jt.animate(_t, 'collapse', function () {
                _t.remove()
              })
            : _t.remove(),
          I(),
          (Bt = null),
          (Ut = null)
      }
      function O(e) {
        ;(Ht = e[0].style),
          (Ht[st + 'Transform'] = ''),
          (Ht[st + 'Transition'] = ''),
          (Ht.top = ''),
          e.removeClass('mbsc-lv-item-swiping')
      }
      function P(e, t) {
        return Be.isFunction(e) ? e.call(this, t, Jt) : e
      }
      function Y(e) {
        let t,
          a = e.attr('data-role')
        if (
          (e.attr('data-ref') ||
            ((t = ca++),
            e.attr('data-ref', t),
            (ra[t] = {
              item: e,
              child: e.children(ot),
              parent: e.parent(),
              ref:
                e.parent()[0] === Qt
                  ? null
                  : e.parent().parent().attr('data-ref')
            })),
          e.addClass('list-divider' == a ? 'mbsc-lv-gr-title' : 'mbsc-lv-item'),
          Jt.sortable.handle &&
            'list-divider' != a &&
            !e.children('.mbsc-lv-handle-c').length &&
            e.append(Ie),
          Dt.enhance && !e.hasClass('mbsc-lv-item-enhanced'))
        ) {
          let s = e.attr('data-icon'),
            n = e.find('img').eq(0).addClass('mbsc-lv-img')
          n.is(':first-child')
            ? e.addClass('mbsc-lv-img-' + (Dt.rtl ? 'right' : 'left'))
            : n.length &&
              e.addClass('mbsc-lv-img-' + (Dt.rtl ? 'left' : 'right')),
            e
              .addClass('mbsc-lv-item-enhanced')
              .children()
              .each(function (e, t) {
                ;(t = Be(t)),
                  t.is('p, h1, h2, h3, h4, h5, h6') && t.addClass('mbsc-lv-txt')
              }),
            s &&
              e
                .addClass(
                  'mbsc-lv-item-ic-' +
                    (e.attr('data-icon-align') || (Dt.rtl ? 'right' : 'left'))
                )
                .append(
                  '<div class="mbsc-lv-item-ic mbsc-ic mbsc-ic-' +
                    s +
                    '"></div>'
                )
        }
      }
      function H(e) {
        Be(nt, e)
          .not('.mbsc-lv-item')
          .each(function () {
            Y(Be(this))
          }),
          Be(ot, e)
            .not('.mbsc-lv')
            .addClass('mbsc-lv')
            .prepend(Fe)
            .parent()
            .addClass('mbsc-lv-parent')
            .prepend($e),
          Be('.mbsc-lv-back', e).each(function () {
            Be(this).attr(
              'data-back',
              Be(this).parent().parent().attr('data-ref')
            )
          })
      }
      function N(e) {
        return e
          .children(nt)
          .not('.mbsc-lv-back')
          .not('.mbsc-lv-removed')
          .not('.mbsc-lv-ph')
      }
      function F(e) {
        return (
          'object' !== ('undefined' == typeof e ? 'undefined' : xe(e)) &&
            (e = Be(nt, ne).filter('[data-id="' + e + '"]')),
          Be(e)
        )
      }
      function $(e) {
        for (let t = 0, a = ra[e.attr('data-ref')]; a && a.ref; )
          t++, (a = ra[a.ref])
        return t
      }
      function W(e, t) {
        for (
          e = e[t]();
          e.length &&
          (!e.hasClass('mbsc-lv-item') ||
            e.hasClass('mbsc-lv-ph') ||
            e.hasClass('mbsc-lv-item-dragging'));

        ) {
          if (!Jt.sortable.group && e.hasClass('mbsc-lv-gr-title')) return !1
          e = e[t]()
        }
        return e
      }
      function R(e) {
        return (e > 0 ? jt.right : jt.left).color || da
      }
      function q(e) {
        return u(e) ? e + '' : 0
      }
      function j(e, t) {
        return +(t < 0
          ? q((e.actionsWidth || 0).right) ||
            q(e.actionsWidth) ||
            q(Dt.actionsWidth.right) ||
            q(Dt.actionsWidth)
          : q((e.actionsWidth || 0).left) ||
            q(e.actionsWidth) ||
            q(Dt.actionsWidth.left) ||
            q(Dt.actionsWidth))
      }
      function z(e, t) {
        if (e) {
          let a = Xt.scrollTop(),
            s = e.is('.mbsc-lv-item') ? e[0].offsetHeight : 0,
            n = e.offset().top + (Ee ? a - Zt : 0)
          t
            ? (n < a || n + s > a + Kt) && Xt.scrollTop(n)
            : n < a
            ? Xt.scrollTop(n)
            : n + s > a + Kt && Xt.scrollTop(Math.min(n, n + s - Kt / 2))
        }
      }
      function B(e, t, a, s, n) {
        let i = t.parent(),
          r = t.prev()
        ;(s = s || l),
          r[0] === je[0] && (r = je.prev()),
          re[0] !== t[0]
            ? (Me('onNavStart', { level: aa, direction: e, list: t[0] }),
              At.prepend(t.addClass('mbsc-lv-v mbsc-lv-sl-new')),
              z(ne),
              X(At, 'mbsc-lv-sl-' + e, function () {
                re.removeClass('mbsc-lv-sl-curr'),
                  t.removeClass('mbsc-lv-sl-new').addClass('mbsc-lv-sl-curr'),
                  oe && oe.length
                    ? re.removeClass('mbsc-lv-v').insertAfter(oe)
                    : le.append(re.removeClass('mbsc-lv-v')),
                  (oe = r),
                  (le = i),
                  (re = t),
                  z(a, n),
                  s.call(Qt, a),
                  Me('onNavEnd', { level: aa, direction: e, list: t[0] })
              }))
            : (z(a, n), s.call(Qt, a))
      }
      function U(e, t) {
        ta ||
          (e.hasClass('mbsc-lv-parent')
            ? (aa++, B('r', ra[e.attr('data-ref')].child, null, t))
            : e.hasClass('mbsc-lv-back') &&
              (aa--,
              B(
                'l',
                ra[e.attr('data-back')].parent,
                ra[e.attr('data-back')].item,
                t
              )))
      }
      function X(e, t, a) {
        function s() {
          clearTimeout(n), ta--, e.off(Qe, s).removeClass(t), a.call(Qt, e)
        }
        let n
        ;(a = a || l),
          Dt.animation && 'mbsc-lv-item-none' !== t
            ? (ta++, e.on(Qe, s).addClass(t), (n = setTimeout(s, 500)))
            : a.call(Qt, e)
      }
      function K(e, t) {
        let a,
          s = e.attr('data-ref')
        ;(a = ia[s] = ia[s] || []),
          t && a.push(t),
          e.attr('data-action') ||
            ((t = a.shift()),
            e.attr('data-action', 1),
            t(function () {
              e.removeAttr('data-action'), a.length ? K(e) : delete ia[s]
            }))
      }
      function G(e, t, a) {
        let s, n
        e &&
          e.length &&
          ((s = 100 / (e.length + 2)),
          Be.each(e, function (i, r) {
            void 0 === r.key && (r.key = Et++),
              void 0 === r.percent &&
                ((r.percent = t * s * (i + 1)),
                a &&
                  ((n = Ge({}, r)),
                  (n.key = Et++),
                  (n.percent = -s * (i + 1)),
                  e.push(n),
                  (na[n.key] = n))),
              (na[r.key] = r)
          }))
      }
      let Z,
        J,
        Q,
        ee,
        te,
        ae,
        se,
        ne,
        ie,
        re,
        oe,
        le,
        ce,
        de,
        ue,
        me,
        he,
        fe,
        pe,
        ve,
        be,
        ge,
        ye,
        _e,
        we,
        Ce,
        Te,
        Me,
        ke,
        De,
        Se,
        Ve,
        Ae,
        Ee,
        Ie,
        Le,
        Oe,
        Pe,
        Ye,
        He,
        Ne,
        Fe,
        $e,
        We,
        je,
        ze,
        Ue,
        Ke,
        Je,
        et,
        at,
        nt,
        it,
        rt,
        ot,
        lt,
        ct,
        dt,
        ut,
        mt,
        ht,
        ft,
        pt,
        vt,
        bt,
        gt,
        yt,
        _t,
        xt,
        wt,
        Ct,
        Tt,
        Mt,
        kt,
        Dt,
        St,
        Vt,
        At,
        Et,
        It,
        Lt,
        Ot,
        Pt,
        Yt,
        Ht,
        Nt,
        Ft,
        $t,
        Wt,
        Rt,
        qt,
        jt,
        zt,
        Bt,
        Ut,
        Xt,
        Kt,
        Gt,
        Zt,
        Jt = this,
        Qt = e,
        ea = Be(Qt),
        ta = 0,
        aa = 0,
        sa = 0,
        na = {},
        ia = {},
        ra = {}
      Ze.call(this, e, t, !0),
        (Jt.animate = function (e, t, a) {
          X(e, 'mbsc-lv-item-' + t, a)
        }),
        (Jt.add = function (e, t, a, s, n, i) {
          var r,
            o,
            c,
            d,
            u,
            m,
            h = '',
            f = void 0 === n ? ea : F(n),
            p = f,
            v = Be(
              'object' !== ('undefined' == typeof t ? 'undefined' : xe(t))
                ? '<' +
                    at +
                    ' data-ref="' +
                    ca++ +
                    '" data-id="' +
                    e +
                    '">' +
                    t +
                    '</' +
                    at +
                    '>'
                : t
            ),
            b = v[0],
            g = b.style,
            y = v.attr('data-pos') < 0 ? 'left' : 'right',
            _ = v.attr('data-ref')
          ;(s = s || l),
            _ || ((_ = ca++), v.attr('data-ref', _)),
            Y(v),
            i ||
              Jt.addUndoAction(function (e) {
                d
                  ? Jt.navigate(f, function () {
                      p.remove(),
                        f
                          .removeClass('mbsc-lv-parent')
                          .children('.mbsc-lv-arr')
                          .remove(),
                        (u.child = f.children(ot)),
                        Jt.remove(v, null, e, !0)
                    })
                  : Jt.remove(v, null, e, !0)
              }, !0),
            K(v, function (e) {
              O(v.css('top', '').removeClass('mbsc-lv-item-undo')),
                f.is(nt)
                  ? ((m = f.attr('data-ref')),
                    f.children(ot).length ||
                      ((d = !0), f.append('<' + rt + '></' + rt + '>')))
                  : (m = f.children('.mbsc-lv-back').attr('data-back')),
                (u = ra[m]),
                u &&
                  (u.child.length
                    ? (p = u.child)
                    : (f.addClass('mbsc-lv-parent').prepend($e),
                      (p = f.children(ot).prepend(Fe).addClass('mbsc-lv')),
                      (u.child = p),
                      Be('.mbsc-lv-back', f).attr('data-back', m))),
                (ra[_] = { item: v, child: v.children(ot), parent: p, ref: m }),
                (c = N(p)),
                (o = c.length),
                (void 0 !== a && null !== a) || (a = o),
                i && (h = 'mbsc-lv-item-new-' + (i ? y : '')),
                H(v.addClass(h)),
                a !== !1 &&
                  (o
                    ? a < o
                      ? v.insertBefore(c.eq(a))
                      : v.insertAfter(c.eq(o - 1))
                    : ((r = Be('.mbsc-lv-back', p)),
                      r.length ? v.insertAfter(r) : p.append(v))),
                p.hasClass('mbsc-lv-v')
                  ? ((g.height = b.offsetHeight + 'px'),
                    Jt.animate(
                      v,
                      i && Bt === _ ? 'none' : 'expand',
                      function (t) {
                        Jt.animate(t, i ? 'add-' + y : 'pop-in', function (t) {
                          ;(g.height = ''), s.call(Qt, t.removeClass(h)), e()
                        })
                      }
                    ))
                  : (s.call(Qt, v.removeClass(h)), e()),
                ne.trigger('mbsc-refresh'),
                Me('onItemAdd', { target: b })
            })
        }),
        (Jt.swipe = function (e, t, s, n, i) {
          var l
          ;(e = F(e)),
            (Ke = e),
            (he = n),
            (Vt = !0),
            (Z = !0),
            (s = void 0 === s ? 300 : s),
            (pe = t > 0 ? 1 : -1),
            a(),
            r(),
            k(e, t, s),
            clearTimeout($t),
            clearInterval(Ft),
            (Ft = setInterval(function () {
              ;(l = ee), (ee = (E(e) / Ue) * 100), o(l)
            }, 10)),
            ($t = setTimeout(function () {
              clearInterval(Ft),
                (l = ee),
                (ee = t),
                o(l),
                c(i),
                (he = !1),
                (Vt = !1),
                (Z = !1)
            }, s))
        }),
        (Jt.openStage = function (e, t, a, s) {
          na[t] && Jt.swipe(e, na[t].percent, a, s)
        }),
        (Jt.openActions = function (e, t, a, s) {
          e = F(e)
          var n = j(zt[e.attr('data-type') || 'defaults'], 'left' == t ? -1 : 1)
          Jt.swipe(e, 'left' == t ? -n : n, a, s)
        }),
        (Jt.close = function (e, t) {
          Jt.swipe(e, 0, t)
        }),
        (Jt.remove = function (e, t, a, s) {
          var n, i, r
          ;(a = a || l),
            (e = F(e)),
            e.length &&
              ((i = e.parent()),
              (n = N(i).index(e)),
              (r = e[0].style),
              s ||
                (e.attr('data-ref') === Bt && (Ut = !0),
                Jt.addUndoAction(function (t) {
                  Jt.add(null, e, n, t, i, !0)
                }, !0)),
              K(e, function (n) {
                ;(t = t || (e.attr('data-pos') < 0 ? 'left' : 'right')),
                  i.hasClass('mbsc-lv-v')
                    ? Jt.animate(
                        e.addClass('mbsc-lv-removed'),
                        s ? 'pop-out' : 'remove-' + t,
                        function (e) {
                          ;(r.height = e[0].offsetHeight + 'px'),
                            Jt.animate(e, 'collapse', function (e) {
                              ;(r.height = ''),
                                O(e.removeClass('mbsc-lv-removed')),
                                a.call(Qt, e) !== !1 && e.remove(),
                                n()
                            })
                        }
                      )
                    : (a.call(Qt, e) !== !1 && e.remove(), n()),
                  Me('onItemRemove', { target: e[0] })
              }))
        }),
        (Jt.move = function (e, t, a, s, n, i) {
          ;(e = F(e)),
            i || Jt.startActionTrack(),
            ze.append(je),
            Jt.remove(e, a, null, i),
            Jt.add(null, e, t, s, n, i),
            i || Jt.endActionTrack()
        }),
        (Jt.navigate = function (e, t) {
          var a, s
          ;(e = F(e)),
            (a = ra[e.attr('data-ref')]),
            (s = $(e)),
            a && (B(s >= aa ? 'r' : 'l', a.parent, e, t, !0), (aa = s))
        }),
        (Jt._processSettings = function () {
          ea.is('[mbsc-enhance]') && ((Ve = !0), ea.removeAttr('mbsc-enhance'))
        }),
        (Jt._init = function () {
          var e,
            t,
            a,
            r = ea.find(ot).length ? 'left' : 'right',
            o = 0,
            l = '',
            c = '',
            d = ''
          ;(rt = Dt.listNode),
            (ot = Dt.listSelector),
            (at = Dt.itemNode),
            (nt = Dt.itemSelector),
            (a = Dt.sort || Dt.sortable || !1),
            'group' === a && (a = { group: !1, multiLevel: !0 }),
            a === !0 &&
              (a = { group: !0, multiLevel: !0, handle: Dt.sortHandle }),
            a && void 0 === a.handle && (a.handle = Dt.sortHandle),
            a.handle &&
              ((Ae = a.handle === !0 ? r : a.handle),
              (Ie =
                '<div class="mbsc-lv-handle-c mbsc-lv-item-h-' +
                Ae +
                ' mbsc-lv-handle"><div class="' +
                Dt.handleClass +
                ' mbsc-lv-handle-bar-c mbsc-lv-handle">' +
                Dt.handleMarkup +
                '</div></div>')),
            (Fe =
              '<' +
              at +
              ' class="mbsc-lv-item mbsc-lv-back">' +
              Dt.backText +
              '<div class="mbsc-lv-arr mbsc-lv-ic mbsc-ic ' +
              Dt.leftArrowClass +
              '"></div></' +
              at +
              '>'),
            ($e =
              '<div class="mbsc-lv-arr mbsc-lv-ic mbsc-ic ' +
              Dt.rightArrowClass +
              '"></div>'),
            (e =
              'mbsc-lv-cont mbsc-lv-' +
              Dt.theme +
              (la ? ' mbsc-lv-hb' : '') +
              (Dt.rtl ? ' mbsc-lv-rtl' : '') +
              (Dt.baseTheme ? ' mbsc-lv-' + Dt.baseTheme : '') +
              (Dt.animateIcons ? ' mbsc-lv-ic-anim' : '') +
              (Dt.striped ? ' mbsc-lv-alt-row' : '') +
              (Dt.fixedHeader ? ' mbsc-lv-has-fixed-header' : '') +
              (a.handle ? ' mbsc-lv-handle-' + Ae : '')),
            (Jt.sortable = a || !1),
            ne
              ? (ne.attr('class', e),
                a.handle && Be('.mbsc-lv-handle-c', ne).remove(),
                Be(nt, ne).not('.mbsc-lv-back').removeClass('mbsc-lv-item'))
              : ((l += '<div class="mbsc-lv-multi-c"></div>'),
                (l +=
                  '<div class="mbsc-lv-ic-c"><div class="mbsc-lv-ic-s mbsc-lv-ic mbsc-ic mbsc-ic-none"></div><div class="mbsc-lv-ic-text"></div></div>'),
                ea
                  .addClass('mbsc-lv mbsc-lv-v mbsc-lv-root')
                  .removeClass('mbsc-cloak')
                  .show(),
                (ze = Be('<div class="mbsc-lv-stage-c">' + l + '</div>')),
                (je = Be('.mbsc-lv-ic-c', ze)),
                (dt = Be('.mbsc-lv-multi-c', ze)),
                (We = Be('.mbsc-lv-ic-s', ze)),
                (Rt = Be('.mbsc-lv-ic-text', ze)),
                (_t = Be(
                  '<' + at + ' class="mbsc-lv-item mbsc-lv-ph"></' + at + '>'
                )),
                (ke = Be('<div class="mbsc-lv-fill-item"></div>')),
                (ne = Be(
                  '<div class="' +
                    e +
                    '"><' +
                    rt +
                    ' class="mbsc-lv mbsc-lv-dummy"></' +
                    rt +
                    '><div class="mbsc-lv-sl-c"></div></div>'
                )),
                (Ee = 'body' !== Dt.context),
                (Xt = Be(Ee ? Dt.context : window)),
                (_e = Be('.mbsc-lv-dummy', ne)),
                ne.insertAfter(ea),
                Xt.on('orientationchange resize', f),
                f(),
                ne
                  .on('touchstart mousedown', '.mbsc-lv-item', s)
                  .on('touchmove', '.mbsc-lv-item', n)
                  .on('touchend touchcancel', '.mbsc-lv-item', i),
                Qt.addEventListener('click', b, !0),
                ne
                  .on('touchstart mousedown', '.mbsc-lv-ic-m', function (e) {
                    he || (e.stopPropagation(), e.preventDefault()),
                      (Pt = x(e, 'X')),
                      (Yt = x(e, 'Y'))
                  })
                  .on('touchend mouseup', '.mbsc-lv-ic-m', function (e) {
                    he ||
                      ('touchend' === e.type && y(),
                      oa &&
                        !Be(this).hasClass('mbsc-lv-ic-disabled') &&
                        Math.abs(x(e, 'X') - Pt) < 10 &&
                        Math.abs(x(e, 'Y') - Yt) < 10 &&
                        w(
                          (ee < 0 ? jt.rightMenu : jt.leftMenu)[
                            Be(this).index()
                          ],
                          ae,
                          se
                        ))
                  }),
                (At = Be('.mbsc-lv-sl-c', ne)
                  .append(ea.addClass('mbsc-lv-sl-curr'))
                  .attr('data-ref', ca++)),
                (re = ea),
                (le = ne)),
            H(ea),
            (Et = 0),
            (zt = Dt.itemGroups || {}),
            (zt.defaults = {
              swipeleft: Dt.swipeleft,
              swiperight: Dt.swiperight,
              stages: Dt.stages,
              actions: Dt.actions,
              actionsWidth: Dt.actionsWidth
            }),
            Be.each(zt, function (e, t) {
              if (
                ((t.swipe = void 0 !== t.swipe ? t.swipe : Dt.swipe),
                (t.stages = t.stages || []),
                G(t.stages, 1, !0),
                G(t.stages.left, 1),
                G(t.stages.right, -1),
                (t.stages.left || t.stages.right) &&
                  (t.stages = [].concat(
                    t.stages.left || [],
                    t.stages.right || []
                  )),
                (De = !1),
                t.stages.length ||
                  (t.swipeleft &&
                    t.stages.push({ percent: -30, action: t.swipeleft }),
                  t.swiperight &&
                    t.stages.push({ percent: 30, action: t.swiperight })),
                Be.each(t.stages, function (e, t) {
                  if (0 === t.percent) return (De = !0), !1
                }),
                De || t.stages.push({ percent: 0 }),
                t.stages.sort(function (e, t) {
                  return e.percent - t.percent
                }),
                Be.each(t.stages, function (e, a) {
                  if (0 === a.percent) return (t.start = e), !1
                }),
                De
                  ? (t.left = t.right = t.stages[t.start])
                  : ((t.left = t.stages[t.start - 1] || {}),
                    (t.right = t.stages[t.start + 1] || {})),
                t.actions)
              ) {
                for (
                  t.leftMenu = t.actions.left || t.actions,
                    t.rightMenu = t.actions.right || t.leftMenu,
                    c = '',
                    d = '',
                    o = 0;
                  o < t.leftMenu.length;
                  o++
                )
                  c +=
                    '<div ' +
                    (t.leftMenu[o].color
                      ? 'style="background-color: ' + t.leftMenu[o].color + '"'
                      : '') +
                    ' class="mbsc-lv-ic-m mbsc-lv-ic mbsc-ic mbsc-ic-' +
                    t.leftMenu[o].icon +
                    '">' +
                    (t.leftMenu[o].text || '') +
                    '</div>'
                for (o = 0; o < t.rightMenu.length; ++o)
                  d +=
                    '<div ' +
                    (t.rightMenu[o].color
                      ? 'style="background-color: ' + t.rightMenu[o].color + '"'
                      : '') +
                    ' class="mbsc-lv-ic-m mbsc-lv-ic mbsc-ic mbsc-ic-' +
                    t.rightMenu[o].icon +
                    '">' +
                    (t.rightMenu[o].text || '') +
                    '</div>'
                t.actions.left &&
                  (t.swipe = t.actions.right ? t.swipe : 'right'),
                  t.actions.right &&
                    (t.swipe = t.actions.left ? t.swipe : 'left'),
                  (t.icons =
                    '<div class="mbsc-lv-multi mbsc-lv-multi-ic-left">' +
                    c +
                    '</div><div class="mbsc-lv-multi mbsc-lv-multi-ic-right">' +
                    d +
                    '</div>')
              }
            }),
            Dt.fixedHeader &&
              ((t =
                'mbsc-lv-fixed-header' +
                (Ee
                  ? ' mbsc-lv-fixed-header-ctx mbsc-lv-' +
                    Dt.theme +
                    (Dt.baseTheme ? ' mbsc-lv-' + Dt.baseTheme : '')
                  : '')),
              Se
                ? Se.attr('class', t)
                : ((Se = Be('<div class="' + t + '"></div>')),
                  Ee ? Xt.before(Se) : ne.prepend(Se),
                  (pt = p(g, 200)),
                  Xt.on('scroll touchmove', pt))),
            Dt.hover &&
              (Ye ||
                ne
                  .on('mouseover.mbsc-lv', '.mbsc-lv-item', function () {
                    ;(Oe && Oe[0] == this) ||
                      (h(),
                      (Oe = Be(this)),
                      zt[Oe.attr('data-type') || 'defaults'].actions &&
                        (Ne = setTimeout(function () {
                          bt
                            ? (Oe = null)
                            : ((Pe = !0), Jt.openActions(Oe, Le, Ye, !1))
                        }, He)))
                  })
                  .on('mouseleave.mbsc-lv', h),
              (Ye = Dt.hover.time || 200),
              (He = Dt.hover.timeout || 200),
              (Le = Dt.hover.direction || Dt.hover || 'right')),
            Ve && ne.attr('mbsc-enhance', ''),
            ne.trigger('mbsc-enhance', [{ theme: Dt.theme, lang: Dt.lang }])
        }),
        (Jt._destroy = function () {
          var e
          le.append(re),
            Ee && Se && Se.remove(),
            Ve &&
              (ea.attr('mbsc-enhance', ''),
              (e = Xe[ne[0].id]),
              e && e.destroy()),
            Qt.removeEventListener('click', b, !0),
            ne
              .find('.mbsc-lv-txt,.mbsc-lv-img')
              .removeClass('mbsc-lv-txt mbsc-lv-img'),
            ne
              .find(ot)
              .removeClass('mbsc-lv mbsc-lv-v mbsc-lv-root mbsc-lv-sl-curr')
              .find(nt)
              .removeClass(
                'mbsc-lv-gr-title mbsc-lv-item mbsc-lv-item-enhanced mbsc-lv-parent mbsc-lv-img-left mbsc-lv-img-right mbsc-lv-item-ic-left mbsc-lv-item-ic-right'
              )
              .removeAttr('data-ref'),
            Be(
              '.mbsc-lv-back,.mbsc-lv-handle-c,.mbsc-lv-arr,.mbsc-lv-item-ic',
              ne
            ).remove(),
            ea.insertAfter(ne),
            ne.remove(),
            ze.remove(),
            Xt.off('orientationchange resize', f),
            pt && Xt.off('scroll touchmove', pt)
        })
      let ua,
        ma = [],
        ha = [],
        fa = [],
        pa = 0
      ;(Jt.startActionTrack = function () {
        pa || (fa = []), pa++
      }),
        (Jt.endActionTrack = function () {
          pa--, pa || ha.push(fa)
        }),
        (Jt.addUndoAction = function (e, t) {
          var a = { action: e, async: t }
          pa
            ? fa.push(a)
            : (ha.push([a]), ha.length > Dt.undoLimit && ha.shift())
        }),
        (Jt.undo = function () {
          function e() {
            s < 0
              ? ((ua = !1), t())
              : ((a = n[s]), s--, a.async ? a.action(e) : (a.action(), e()))
          }
          function t() {
            ;(n = ma.shift()), n && ((ua = !0), (s = n.length - 1), e())
          }
          var a, s, n
          ha.length && ma.push(ha.pop()), ua || t()
        }),
        (Dt = Jt.settings),
        (Me = Jt.trigger),
        Jt.init(t)
    }
  ;(ua.prototype = {
    _class: 'listview',
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _defaults: {
      context: 'body',
      actionsWidth: 90,
      sortDelay: 250,
      undoLimit: 10,
      swipe: !0,
      quickSwipe: !0,
      animateIcons: !0,
      animation: !0,
      revert: !0,
      vibrate: !0,
      handleClass: '',
      handleMarkup:
        '<div class="mbsc-lv-handle-bar mbsc-lv-handle"></div><div class="mbsc-lv-handle-bar mbsc-lv-handle"></div><div class="mbsc-lv-handle-bar mbsc-lv-handle"></div>',
      listNode: 'ul',
      listSelector: 'ul,ol',
      itemNode: 'li',
      itemSelector: 'li',
      leftArrowClass: 'mbsc-ic-arrow-left4',
      rightArrowClass: 'mbsc-ic-arrow-right4',
      backText: 'Back',
      undoText: 'Undo',
      stages: []
    }
  }),
    (Ke.ListView = ua),
    (ye.themes.listview.mobiscroll = {
      leftArrowClass: 'mbsc-ic-arrow-left5',
      rightArrowClass: 'mbsc-ic-arrow-right5'
    }),
    o('listview', ua, !1)
  let ma = {
    batch: 50,
    min: 0,
    max: 100,
    defaultUnit: '',
    units: null,
    unitNames: null,
    invalid: [],
    sign: !1,
    step: 0.05,
    scale: 2,
    convert: function (e) {
      return e
    },
    signText: '&nbsp;',
    wholeText: 'Whole',
    fractionText: 'Fraction',
    unitText: 'Unit'
  }
  ;(bt.measurement = function (e) {
    function t(e) {
      return Math.max(
        y,
        Math.min(
          _,
          H
            ? e < 0
              ? Math.ceil(e)
              : Math.floor(e)
            : i(Math.round(e - R), W) + R
        )
      )
    }
    function a(e) {
      return H ? i((Math.abs(e) - Math.abs(t(e))) * $ - q, W) + q : 0
    }
    function s(e) {
      var s = t(e),
        n = a(e),
        i = e < 0 ? '-' : '+'
      return n >= $ && (e < 0 ? s-- : s++, (n = 0)), [i, s, n]
    }
    function n(e) {
      var t = +e[p],
        a = H ? (e[m] / $) * (t < 0 ? -1 : 1) : 0
      return (L && '-' == e[0] ? -1 : 1) * (t + a)
    }
    function i(e, t) {
      return Math.round(e / t) * t
    }
    function r(e, t, a) {
      return t !== a && k.convert ? k.convert.call(this, e, t, a) : e
    }
    function o(e) {
      var t, s
      ;(b = r(k.min, P, e)),
        (g = r(k.max, P, e)),
        H
          ? ((y = b < 0 ? Math.ceil(b) : Math.floor(b)),
            (_ = g < 0 ? Math.ceil(g) : Math.floor(g)),
            (x = a(b)),
            (w = a(g)))
          : ((y = Math.round(b)),
            (_ = Math.round(g)),
            (_ = y + Math.floor((_ - y) / W) * W),
            (R = y % W)),
        (t = y),
        (s = _),
        L &&
          ((s = Math.abs(t) > Math.abs(s) ? Math.abs(t) : Math.abs(s)),
          (t = t < 0 ? 0 : t)),
        (A.min = t < 0 ? Math.ceil(t / N) : Math.floor(t / N)),
        (A.max = s < 0 ? Math.ceil(s / N) : Math.floor(s / N))
    }
    function l(e) {
      return n(e).toFixed(H ? F : 0) + (O ? ' ' + Y[e[v]] : '')
    }
    var c,
      d,
      u,
      m,
      p,
      v,
      b,
      g,
      y,
      _,
      x,
      w,
      C,
      T,
      M = Ge({}, e.settings),
      k = Ge(e.settings, ma, M),
      D = {},
      S = [[]],
      V = {},
      A = {},
      E = {},
      I = [],
      L = k.sign,
      O = k.units && k.units.length,
      P = O ? k.defaultUnit || k.units[0] : '',
      Y = [],
      H = k.step < 1,
      N = k.step > 1 ? k.step : 1,
      F = H ? Math.max(k.scale, (k.step + '').split('.')[1].length) : 1,
      $ = Math.pow(10, F),
      W = Math.round(H ? k.step * $ : k.step),
      R = 0,
      q = 0,
      j = 0
    if (
      ((e.setVal = function (t, a, s, n, i) {
        e._setVal(Be.isArray(t) ? l(t) : t, a, s, n, i)
      }),
      k.units)
    )
      for (T = 0; T < k.units.length; ++T)
        (C = k.units[T]), Y.push(k.unitNames ? k.unitNames[C] || C : C)
    if (L)
      if (((L = !1), O))
        for (T = 0; T < k.units.length; T++)
          r(k.min, P, k.units[T]) < 0 && (L = !0)
      else L = k.min < 0
    if (
      (L && (S[0].push({ data: ['-', '+'], label: k.signText }), j++),
      (A = {
        label: k.wholeText,
        data: function (e) {
          return (y % N) + e * N
        },
        getIndex: function (e) {
          return Math.round((e - (y % N)) / N)
        }
      }),
      S[0].push(A),
      (p = j++),
      o(P),
      H)
    ) {
      for (
        S[0].push(E), E.data = [], E.label = k.fractionText, T = q;
        T < $;
        T += W
      )
        I.push(T), E.data.push({ value: T, display: '.' + f(T, F) })
      ;(m = j++),
        (c = Math.ceil(100 / W)),
        k.invalid &&
          k.invalid.length &&
          (Be.each(k.invalid, function (e, t) {
            var a = t > 0 ? Math.floor(t) : Math.ceil(t)
            0 === a && (a = t <= 0 ? -0.001 : 0.001),
              (V[a] = (V[a] || 0) + 1),
              0 === t && ((a = 0.001), (V[a] = (V[a] || 0) + 1))
          }),
          Be.each(V, function (e, t) {
            t < c ? delete V[e] : (V[e] = e)
          }))
    }
    if (O) {
      for (
        D = {
          data: [],
          label: k.unitText,
          cssClass: 'mbsc-msr-whl-unit',
          circular: !1
        },
          T = 0;
        T < k.units.length;
        T++
      )
        D.data.push({ value: T, display: Y[T] })
      S[0].push(D)
    }
    return (
      (v = j),
      {
        wheels: S,
        minWidth: L && H ? 70 : 80,
        showLabel: !1,
        formatValue: l,
        compClass: 'mbsc-msr',
        parseValue: function (e) {
          var t,
            a = ('number' == typeof e ? e + '' : e) || k.defaultValue,
            n = (a + '').split(' '),
            i = +n[0],
            r = [],
            l = ''
          return (
            O &&
              ((l = Be.inArray(n[1], Y)),
              (l = l == -1 ? Be.inArray(P, k.units) : l),
              (l = l == -1 ? 0 : l)),
            (u = O ? k.units[l] : ''),
            o(u),
            (i = isNaN(i) ? 0 : i),
            (i = h(i, b, g)),
            (t = s(i)),
            (t[1] = h(t[1], y, _)),
            (d = i),
            L && ((r[0] = t[0]), (t[1] = Math.abs(t[1]))),
            (r[p] = t[1]),
            H && (r[m] = t[2]),
            O && (r[v] = l),
            r
          )
        },
        onCancel: function () {
          d = void 0
        },
        validate: function (t) {
          var a,
            l,
            c,
            f,
            C,
            T = t.values,
            M = t.index,
            D = t.direction,
            S = {},
            E = [],
            Y = {},
            F = O ? k.units[T[v]] : ''
          if (
            (L && 0 === M && (d = Math.abs(d) * ('-' == T[0] ? -1 : 1)),
            (M === p || (M === m && H) || void 0 === d || void 0 === M) &&
              ((d = n(T)), (u = F)),
            ((O && M === v && u !== F) || void 0 === M) &&
              (o(F),
              (d = r(d, u, F)),
              (u = F),
              (l = s(d)),
              void 0 !== M && ((Y[p] = A), e.changeWheel(Y)),
              L && (T[0] = l[0])),
            (E[p] = []),
            L)
          )
            for (
              E[0] = [],
                b > 0 && (E[0].push('-'), (T[0] = '+')),
                g < 0 && (E[0].push('+'), (T[0] = '-')),
                C = Math.abs('-' == T[0] ? y : _),
                j = C + N;
              j < C + 20 * N;
              j += N
            )
              E[p].push(j), (S[j] = !0)
          if (
            ((d = h(d, b, g)),
            (l = s(d)),
            (c = L ? Math.abs(l[1]) : l[1]),
            (a = L ? '-' == T[0] : d < 0),
            (T[p] = c),
            a && (l[0] = '-'),
            H && (T[m] = l[2]),
            Be.each(H ? V : k.invalid, function (e, t) {
              if (L && a) {
                if (!(t <= 0)) return
                t = Math.abs(t)
              }
              ;(t = i(r(t, P, F), H ? 1 : W)), (S[t] = !0), E[p].push(t)
            }),
            (T[p] = e.getValidValue(p, c, D, S)),
            (l[1] = T[p] * (L && a ? -1 : 1)),
            H)
          ) {
            E[m] = []
            var $ = L ? T[0] + T[1] : (d < 0 ? '-' : '+') + Math.abs(l[1]),
              R = (b < 0 ? '-' : '+') + Math.abs(y),
              q = (g < 0 ? '-' : '+') + Math.abs(_)
            $ === R &&
              Be(I).each(function (e, t) {
                ;(a ? t > x : t < x) && E[m].push(t)
              }),
              $ === q &&
                Be(I).each(function (e, t) {
                  ;(a ? t < w : t > w) && E[m].push(t)
                }),
              Be.each(k.invalid, function (e, t) {
                ;(f = s(r(t, P, F))),
                  (l[0] === f[0] || (0 === l[1] && 0 === f[1] && 0 === f[2])) &&
                    l[1] === f[1] &&
                    E[m].push(f[2])
              })
          }
          return { disabled: E, valid: T }
        }
      }
    )
  }),
    (bt.number = bt.measurement),
    o('number', xt)
  let ha = {},
    fa = function (e, t, a) {
      function s(t) {
        let a,
          s = y.validate.call(e, { values: E.slice(0), variables: $ }, H) || [],
          i = (s && s.disabled) || []
        if (
          ((H._isValid = !s.invalid),
          (H._tempValue = y.formatValue.call(e, E.slice(0), $, H)),
          (g = E.length),
          (I = s.length || O),
          H._isVisible)
        ) {
          if (
            (Be('.mbsc-np-ph', p).each(function (e) {
              Be(this).html(
                'ltr' == y.fill
                  ? e >= g
                    ? b
                    : _ || E[e]
                  : e >= O - I
                  ? e + g < O
                    ? b
                    : _ || E[e + g - O]
                  : ''
              )
            }),
            Be('.mbsc-np-cph', p).each(function () {
              Be(this).html(
                $[Be(this).attr('data-var')] || Be(this).attr('data-ph')
              )
            }),
            g === O)
          )
            for (a = 0; a <= 9; a++) i.push(a)
          for (Be('.mbsc-np-btn', p).removeClass(v), a = 0; a < i.length; a++)
            Be('.mbsc-np-btn[data-val="' + i[a] + '"]', p).addClass(v)
          H._isValid
            ? Be('.mbsc-fr-btn-s .mbsc-fr-btn', p).removeClass(v)
            : Be('.mbsc-fr-btn-s .mbsc-fr-btn', p).addClass(v),
            H.live &&
              ((H._hasValue = t || H._hasValue),
              n(t, !1, t),
              t && L('onSet', { valueText: H._value }))
        }
      }
      function n(e, t, a, n) {
        t && s(),
          n ||
            ((P = E.slice(0)),
            (W = Ge({}, $)),
            (N = F.slice(0)),
            (H._value = H._hasValue ? H._tempValue : null)),
          e &&
            (H._isInput && Y.val(H._hasValue && H._isValid ? H._value : ''),
            L('onFill', {
              valueText: H._hasValue ? H._tempValue : '',
              change: a
            }),
            a && ((H._preventChange = !0), Y.trigger('change')))
      }
      function i(e) {
        let t,
          a,
          s = e || [],
          n = []
        for (F = [], $ = {}, t = 0; t < s.length; t++)
          /:/.test(s[t])
            ? ((a = s[t].split(':')), ($[a[0]] = a[1]), F.push(a[0]))
            : (n.push(s[t]), F.push('digit'))
        return n
      }
      function r(e, t) {
        !(g || t || y.allowLeadingZero) ||
          e.hasClass('mbsc-disabled') ||
          e.hasClass('mbsc-np-btn-empty') ||
          (g < O && (F.push('digit'), E.push(t), s(!0)))
      }
      function o(e) {
        let t,
          a,
          n = e.attr('data-val'),
          i = 'false' !== e.attr('data-track'),
          r = e.attr('data-var')
        if (!e.hasClass('mbsc-disabled')) {
          if (
            (r &&
              ((a = r.split(':')),
              i && F.push(a[0]),
              ($[a[0]] =
                void 0 === a[2] ? a[1] : $[a[0]] == a[1] ? a[2] : a[1])),
            n.length + g <= I)
          )
            for (t = 0; t < n.length; ++t)
              (a = u(n[t]) ? +n[t] : n[t]),
                (y.allowLeadingZero || g || a) &&
                  (F.push('digit'), E.push(a), (g = E.length))
          s(!0)
        }
      }
      function l() {
        let e,
          t,
          a = F.pop()
        if (g || 'digit' !== a) {
          if ('digit' !== a && $[a])
            for (delete $[a], t = F.slice(0), F = [], e = 0; e < t.length; e++)
              t[e] !== a && F.push(t[e])
          else E.pop()
          s(!0)
        }
      }
      function c(e) {
        ;(S = !0),
          (w = x(e, 'X')),
          (C = x(e, 'Y')),
          clearInterval(V),
          clearTimeout(V),
          l(),
          (V = setInterval(function () {
            l()
          }, 150))
      }
      function d() {
        clearInterval(V), (S = !1)
      }
      function m(e) {
        if (A(e, this)) {
          if ('keydown' == e.type && 32 != e.keyCode) return
          c(e),
            'mousedown' == e.type &&
              Be(document).on('mousemove', h).on('mouseup', f)
        }
      }
      function h(e) {
        S &&
          ((T = x(e, 'X')),
          (M = x(e, 'Y')),
          (k = T - w),
          (D = M - C),
          (Math.abs(k) > 7 || Math.abs(D) > 7) && d())
      }
      function f(e) {
        S &&
          (e.preventDefault(),
          d(),
          'mouseup' == e.type &&
            Be(document).off('mousemove', h).off('mouseup', f))
      }
      let p,
        v,
        b,
        g,
        y,
        _,
        w,
        C,
        T,
        M,
        k,
        D,
        S,
        V,
        E,
        I,
        L,
        O,
        P,
        Y = Be(e),
        H = this,
        N = [],
        F = [],
        $ = {},
        W = {},
        R = { 107: '+', 109: '-' },
        q = {
          48: 0,
          49: 1,
          50: 2,
          51: 3,
          52: 4,
          53: 5,
          54: 6,
          55: 7,
          56: 8,
          57: 9,
          96: 0,
          97: 1,
          98: 2,
          99: 3,
          100: 4,
          101: 5,
          102: 6,
          103: 7,
          104: 8,
          105: 9
        }
      ft.call(this, e, t, !0),
        (H.setVal = H._setVal =
          function (t, a, s, r) {
            ;(H._hasValue = null !== t && void 0 !== t),
              (E = i(Be.isArray(t) ? t.slice(0) : y.parseValue.call(e, t, H))),
              n(a, !0, void 0 === s ? a : s, r)
          }),
        (H.getVal = H._getVal =
          function (e) {
            return H._hasValue || e ? H[e ? '_tempValue' : '_value'] : null
          }),
        (H.setArrayVal = H.setVal),
        (H.getArrayVal = function (e) {
          return e ? E.slice(0) : H._hasValue ? P.slice(0) : null
        }),
        (H._readValue = function () {
          var t = Y.val() || ''
          '' !== t && (H._hasValue = !0),
            _
              ? (($ = {}), (F = []), (E = []))
              : (($ = H._hasValue ? W : {}),
                (F = H._hasValue ? N : []),
                (E =
                  H._hasValue && P
                    ? P.slice(0)
                    : i(y.parseValue.call(e, t, H))),
                n(!1, !0))
        }),
        (H._fillValue = function () {
          ;(H._hasValue = !0), n(!0, !1, !0)
        }),
        (H._generateContent = function () {
          var e,
            t,
            a,
            s = 1,
            n = '',
            i = ''
          for (
            i +=
              '<div class="mbsc-np-hdr"><div role="button" tabindex="0" aria-label="' +
              y.deleteText +
              '" class="mbsc-np-del mbsc-fr-btn-e mbsc-ic mbsc-ic-' +
              y.deleteIcon +
              '"></div><div class="mbsc-np-dsp">',
              n = y.template
                .replace(/d/g, '<span class="mbsc-np-ph">' + b + '</span>')
                .replace(/&#100;/g, 'd'),
              n = n.replace(
                /{([a-zA-Z0-9]*)\:?([a-zA-Z0-9\-\_]*)}/g,
                '<span class="mbsc-np-cph" data-var="$1" data-ph="$2">$2</span>'
              ),
              i += n,
              i += '</div></div>',
              i +=
                '<div class="mbsc-np-tbl-c mbsc-w-p"><div class="mbsc-np-tbl">',
              e = 0;
            e < 4;
            e++
          ) {
            for (i += '<div class="mbsc-np-row">', t = 0; t < 3; t++)
              (a = s),
                10 == s || 12 == s ? (a = '') : 11 == s && (a = 0),
                (i +=
                  '' === a
                    ? 10 == s && y.leftKey
                      ? '<div role="button" tabindex="0" class="mbsc-np-btn mbsc-np-btn-custom mbsc-fr-btn-e" ' +
                        (y.leftKey.variable
                          ? 'data-var="' + y.leftKey.variable + '"'
                          : '') +
                        ' data-val="' +
                        (y.leftKey.value || '') +
                        '" ' +
                        (void 0 !== y.leftKey.track
                          ? ' data-track="' + y.leftKey.track + '"'
                          : '') +
                        '>' +
                        y.leftKey.text +
                        '</div>'
                      : 12 == s && y.rightKey
                      ? '<div role="button" tabindex="0" class="mbsc-np-btn mbsc-np-btn-custom mbsc-fr-btn-e" ' +
                        (y.rightKey.variable
                          ? 'data-var="' + y.rightKey.variable + '"'
                          : '') +
                        ' data-val="' +
                        (y.rightKey.value || '') +
                        '" ' +
                        (void 0 !== y.rightKey.track
                          ? ' data-track="' + y.rightKey.track + '"'
                          : '') +
                        ' >' +
                        y.rightKey.text +
                        '</div>'
                      : '<div class="mbsc-np-btn mbsc-np-btn-empty"></div>'
                    : '<div tabindex="0" role="button" class="mbsc-np-btn mbsc-fr-btn-e" data-val="' +
                      a +
                      '">' +
                      a +
                      '</div>'),
                s++
            i += '</div>'
          }
          return (i += '</div></div>')
        }),
        (H._markupReady = function () {
          ;(p = H._markup), s()
        }),
        (H._attachEvents = function (e) {
          e.on('keydown', function (t) {
            var a
            void 0 !== R[t.keyCode]
              ? ((a = Be('.mbsc-np-btn[data-var="sign:-:"]', e)),
                a.length && (($.sign = 107 == t.keyCode ? '-' : ''), o(a)))
              : void 0 !== q[t.keyCode]
              ? r(
                  Be('.mbsc-np-btn[data-val="' + q[t.keyCode] + '"]', e),
                  q[t.keyCode]
                )
              : 8 == t.keyCode && (t.preventDefault(), l())
          }),
            H.tap(
              Be('.mbsc-np-btn', e),
              function () {
                var e = Be(this)
                e.hasClass('mbsc-np-btn-custom')
                  ? o(e)
                  : r(e, +e.attr('data-val'))
              },
              !1,
              30,
              !0
            ),
            Be('.mbsc-np-del', e)
              .on('touchstart mousedown keydown', m)
              .on('touchmove mousemove', h)
              .on('touchend mouseup keyup', f)
        }),
        (H.__init = function () {
          ;(y = H.settings),
            (y.cssClass = (y.cssClass || '') + ' mbsc-np'),
            (y.template = y.template.replace(/\\d/, '&#100;')),
            (b = y.placeholder),
            (O = (y.template.match(/d/g) || []).length),
            (v = 'mbsc-disabled ' + (y.disabledClass || '')),
            (_ = y.mask),
            (L = H.trigger),
            _ && Y.is('input') && Y.attr('type', 'password')
        }),
        (H._indexOf = function (e, t) {
          var a
          for (a = 0; a < e.length; ++a)
            if (e[a].toString() === t.toString()) return a
          return -1
        }),
        a || H.init(t)
    }
  ;(fa.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _class: 'numpad',
    _presets: ha,
    _defaults: Ge({}, ft.prototype._defaults, {
      template: 'dd.dd',
      placeholder: '0',
      deleteIcon: 'backspace',
      allowLeadingZero: !1,
      headerText: !1,
      fill: 'rtl',
      deleteText: 'Delete',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      validate: l,
      parseValue: l,
      formatValue: function (e, t, a) {
        var s,
          n = 1,
          i = a.settings,
          r = i.placeholder,
          o = i.template,
          l = e.length,
          c = o.length,
          d = ''
        for (s = 0; s < c; s++)
          'd' == o[c - s - 1]
            ? ((d = n <= l ? e[l - n] + d : r + d), n++)
            : (d = o[c - s - 1] + d)
        return (
          Be.each(t, function (e, t) {
            d = d.replace('{' + e + '}', t)
          }),
          Be('<div>' + d + '</div>').text()
        )
      }
    })
  }),
    (Ke.Numpad = fa),
    (ye.themes.numpad = ye.themes.frame)
  let pa = {
    min: 0,
    max: 99.99,
    scale: 2,
    prefix: '',
    suffix: '',
    returnAffix: !1
  }
  ha.decimal = function (e) {
    function t(e, t) {
      for (let a, s = e.slice(0), i = 0; s.length; ) i = 10 * i + s.shift()
      for (a = 0; a < n.scale; a++) i /= 10
      return t ? i * -1 : i
    }
    function a(e) {
      let a = t(e)
        .toFixed(n.scale)
        .replace('.', n.decimalSeparator)
        .replace(/\B(?=(\d{3})+(?!\d))/g, n.thousandsSeparator)
      return a
    }
    let s = Ge({}, e.settings),
      n = Ge(e.settings, pa, s),
      i = n.min < 0
    return (
      (e.getVal = function (t) {
        var a = new RegExp(n.thousandsSeparator, 'g'),
          s = e._getVal(t),
          i = (s + '').replace(n.decimalSeparator, '.').replace(a, '')
        return u(i) ? +i : s
      }),
      {
        template:
          (i ? '{sign}' : '') +
          n.prefix.replace(/d/g, '\\d') +
          Array(
            (Math.floor(Math.max(n.max, Math.abs(n.min))) + '').length + 1
          ).join('d') +
          (n.scale ? '.' + Array(n.scale + 1).join('d') : '') +
          n.suffix.replace(/d/g, '\\d'),
        leftKey: i ? { text: '-/+', variable: 'sign:-:', track: !1 } : void 0,
        parseValue: function (e) {
          var t,
            a,
            s = e || n.defaultValue,
            i = []
          if (
            s &&
            ((s = (s + '')
              .replace(n.decimalSeparator, '.')
              .replace(n.thousandsSeparator, '')),
            (a = s.match(/\d+\.?\d*/g)))
          )
            for (a = (+a[0]).toFixed(n.scale), t = 0; t < a.length; t++)
              '.' != a[t] && (+a[t] ? i.push(+a[t]) : i.length && i.push(0))
          return e < 0 && i.push('sign:-'), i
        },
        formatValue: function (e, s) {
          var i = a(e),
            r = t(e, s && '-' == s.sign)
          return (
            (r < 0 ? '-' : '') + (n.returnAffix ? n.prefix + i + n.suffix : i)
          )
        },
        validate: function (s) {
          var i = s.values,
            r = a(i),
            o = t(i, s.variables && '-' == s.variables.sign),
            l = []
          return (
            i.length || n.allowLeadingZero || l.push(0),
            e.isVisible() &&
              Be('.mbsc-np-dsp', e._markup).html(
                (s.variables.sign || '') + n.prefix + r + n.suffix
              ),
            {
              disabled: l,
              invalid:
                o > n.max ||
                o < n.min ||
                (!!n.invalid && e._indexOf(n.invalid, o) != -1)
            }
          )
        }
      }
    )
  }
  let va = ['h', 'm', 's'],
    ba = {
      min: 0,
      max: 362439,
      defaultValue: 0,
      hourTextShort: 'h',
      minuteTextShort: 'm',
      secTextShort: 's'
    }
  ha.timespan = function (e) {
    function t(e) {
      let t,
        a = '',
        s = 3600
      return (
        Be(va).each(function (i, r) {
          ;(t = Math.floor(e / s)),
            (e -= t * s),
            (s /= 60),
            (t > 0 || ('s' == r && !a)) && (a = a + (a ? ' ' : '') + t + n[r])
        }),
        a
      )
    }
    let a = Ge({}, e.settings),
      s = Ge(e.settings, ba, a),
      n = {
        h: s.hourTextShort.replace(/d/g, '\\d'),
        m: s.minuteTextShort.replace(/d/g, '\\d'),
        s: s.secTextShort.replace(/d/g, '\\d')
      },
      i = 'd<span class="mbsc-np-sup mbsc-np-time">' + n.s + '</span>'
    return (
      s.max > 9 && (i = 'd' + i),
      s.max > 99 &&
        (i =
          '<span class="mbsc-np-ts-m">' +
          (s.max > 639 ? 'd' : '') +
          'd</span><span class="mbsc-np-sup mbsc-np-time">' +
          n.m +
          '</span>' +
          i),
      s.max > 6039 &&
        (i =
          '<span class="mbsc-np-ts-h">' +
          (s.max > 38439 ? 'd' : '') +
          'd</span><span class="mbsc-np-sup mbsc-np-time">' +
          n.h +
          '</span>' +
          i),
      (e.setVal = function (a, s, n, i) {
        return u(a) && (a = t(a)), e._setVal(a, s, n, i)
      }),
      (e.getVal = function (t) {
        return e._hasValue || t ? le(e.getArrayVal(t)) : null
      }),
      {
        template: i,
        parseValue: function (e) {
          var a,
            i = e || t(s.defaultValue),
            r = []
          return (
            i &&
              Be(va).each(function (e, t) {
                ;(a = new RegExp('(\\d+)' + n[t], 'gi').exec(i)),
                  a
                    ? ((a = +a[1]),
                      a > 9
                        ? (r.push(Math.floor(a / 10)), r.push(a % 10))
                        : (r.length && r.push(0), (a || r.length) && r.push(a)))
                    : r.length && (r.push(0), r.push(0))
              }),
            r
          )
        },
        formatValue: function (e) {
          return t(le(e))
        },
        validate: function (t) {
          var a = t.values,
            n = le(a.slice(0)),
            i = []
          return (
            a.length || i.push(0),
            {
              disabled: i,
              invalid:
                n > s.max ||
                n < s.min ||
                (!!s.invalid && e._indexOf(s.invalid, +n) != -1)
            }
          )
        }
      }
    )
  }
  let ga = { timeFormat: 'hh:ii A', amText: 'am', pmText: 'pm' }
  ha.time = function (e) {
    function t(e, t) {
      let a,
        s = ''
      for (a = 0; a < e.length; ++a)
        s +=
          e[a] +
          (a % 2 == (e.length % 2 == 1 ? 0 : 1) && a != e.length - 1 ? ':' : '')
      return (
        Be.each(t, function (e, t) {
          s += ' ' + t
        }),
        s
      )
    }
    function a(e) {
      let t,
        a,
        s,
        o,
        l,
        v,
        b,
        g,
        y,
        _,
        x = [],
        w = 2 * i.length
      if (
        ((c = w),
        e.length ||
          (r && (x.push(0), x.push(n.leftKey.value)), x.push(n.rightKey.value)),
        !r &&
          (w - e.length < 2 ||
            (1 != e[0] && (e[0] > 2 || e[1] > 3) && w - e.length <= 2)) &&
          (x.push('30'), x.push('00')),
        (r ? e[0] > 1 || e[1] > 2 : 1 != e[0] && (e[0] > 2 || e[1] > 3)) &&
          e[0] &&
          (e.unshift(0), (c = w - 1)),
        e.length == w)
      )
        for (t = 0; t <= 9; ++t) x.push(t)
      else if (
        (1 == e.length && r && 1 == e[0]) ||
        (e.length && e.length % 2 === 0) ||
        (!r && 2 == e[0] && e[1] > 3 && e.length % 2 == 1)
      )
        for (t = 6; t <= 9; ++t) x.push(t)
      if (
        ((y = void 0 !== e[1] ? '' + e[0] + e[1] : ''),
        (_ = +h == +(void 0 !== e[3] ? '' + e[2] + e[3] : '')),
        n.invalid)
      )
        for (t = 0; t < n.invalid.length; ++t)
          if (
            ((v = n.invalid[t].getHours()),
            (b = n.invalid[t].getMinutes()),
            (g = n.invalid[t].getSeconds()),
            v == +y)
          ) {
            if (2 == i.length && (b < 10 ? 0 : +('' + b)[0]) == +e[2]) {
              x.push(b < 10 ? b : +('' + b)[1])
              break
            }
            if ((g < 10 ? 0 : +('' + g)[0]) == +e[4]) {
              x.push(g < 10 ? g : +('' + g)[1])
              break
            }
          }
      if (n.min || n.max) {
        if (
          ((a = +d == +y),
          (s = +u == +y),
          (l = s && _),
          (o = a && _),
          0 === e.length)
        ) {
          for (
            t = r ? 2 : d > 19 ? d[0] : 3;
            t <= (1 == d[0] ? 9 : d[0] - 1);
            ++t
          )
            x.push(t)
          if (d >= 10 && (x.push(0), 2 == d[0]))
            for (t = 3; t <= 9; ++t) x.push(t)
          if ((u && u < 10) || (d && d >= 10))
            for (
              t = u && u < 10 ? +u[0] + 1 : 0;
              t < (d && d >= 10 ? d[0] : 10);
              ++t
            )
              x.push(t)
        }
        if (1 == e.length) {
          if (0 === e[0]) for (t = 0; t < d[0]; ++t) x.push(t)
          if (d && 0 !== e[0] && (r ? 1 == e[0] : 2 == e[0]))
            for (t = r ? 3 : 4; t <= 9; ++t) x.push(t)
          if (e[0] == d[0]) for (t = 0; t < d[1]; ++t) x.push(t)
          if (e[0] == u[0] && !r) for (t = +u[1] + 1; t <= 9; ++t) x.push(t)
        }
        if (2 == e.length && (a || s))
          for (t = s ? +h[0] + 1 : 0; t < (a ? +m[0] : 10); ++t) x.push(t)
        if (3 == e.length && ((s && e[2] == h[0]) || (a && e[2] == m[0])))
          for (
            t = s && e[2] == h[0] ? +h[1] + 1 : 0;
            t < (a && e[2] == m[0] ? +m[1] : 10);
            ++t
          )
            x.push(t)
        if (4 == e.length && (o || l))
          for (t = l ? +p[0] + 1 : 0; t < (o ? +f[0] : 10); ++t) x.push(t)
        if (5 == e.length && ((o && e[4] == f[0]) || (l && e[4] == p[0])))
          for (
            t = l && e[4] == p[0] ? +p[1] + 1 : 0;
            t < (o && e[4] == f[0] ? +f[1] : 10);
            ++t
          )
            x.push(t)
      }
      return x
    }
    let s = Ge({}, e.settings),
      n = Ge(e.settings, ga, s),
      i = n.timeFormat.split(':'),
      r = n.timeFormat.match(/a/i),
      o = r ? ('a' == r[0] ? n.amText : n.amText.toUpperCase()) : '',
      l = r ? ('a' == r[0] ? n.pmText : n.pmText.toUpperCase()) : '',
      c = 0,
      d = n.min ? '' + n.min.getHours() : '',
      u = n.max ? '' + n.max.getHours() : '',
      m = n.min
        ? '' +
          (n.min.getMinutes() < 10
            ? '0' + n.min.getMinutes()
            : n.min.getMinutes())
        : '',
      h = n.max
        ? '' +
          (n.max.getMinutes() < 10
            ? '0' + n.max.getMinutes()
            : n.max.getMinutes())
        : '',
      f = n.min
        ? '' +
          (n.min.getSeconds() < 10
            ? '0' + n.min.getSeconds()
            : n.min.getSeconds())
        : '',
      p = n.max
        ? '' +
          (n.max.getSeconds() < 10
            ? '0' + n.max.getSeconds()
            : n.max.getSeconds())
        : ''
    return (
      n.min ? n.min.setFullYear(2014, 7, 20) : '',
      n.max ? n.max.setFullYear(2014, 7, 20) : '',
      {
        placeholder: '-',
        allowLeadingZero: !0,
        template:
          (3 == i.length ? 'dd:dd:dd' : 2 == i.length ? 'dd:dd' : 'dd') +
          (r ? '<span class="mbsc-np-sup">{ampm:--}</span>' : ''),
        leftKey: r
          ? { text: o, variable: 'ampm:' + o, value: '00' }
          : { text: ':00', value: '00' },
        rightKey: r
          ? { text: l, variable: 'ampm:' + l, value: '00' }
          : { text: ':30', value: '30' },
        parseValue: function (e) {
          var t,
            a,
            s = e || n.defaultValue,
            i = []
          if (s) {
            if (((s += ''), (a = s.match(/\d/g))))
              for (t = 0; t < a.length; t++) i.push(+a[t])
            r && i.push('ampm:' + (s.match(new RegExp(n.pmText, 'gi')) ? l : o))
          }
          return i
        },
        formatValue: function (e, a) {
          return t(e, a)
        },
        validate: function (s) {
          var i = s.values,
            o = s.variables,
            l = t(i, o),
            d =
              i.length >= 3
                ? new Date(
                    2014,
                    7,
                    20,
                    '' + i[0] + (i.length % 2 === 0 ? i[1] : ''),
                    '' +
                      i[i.length % 2 === 0 ? 2 : 1] +
                      i[i.length % 2 === 0 ? 3 : 2]
                  )
                : ''
          return {
            disabled: a(i),
            length: c,
            invalid:
              (r
                ? !new RegExp(
                    '^(0?[1-9]|1[012])(:[0-5]\\d)?(:[0-5][0-9]) (?:' +
                      n.amText +
                      '|' +
                      n.pmText +
                      ')$',
                    'i'
                  ).test(l)
                : !/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
                    l
                  )) ||
              (!!n.invalid && e._indexOf(n.invalid, d) != -1) ||
              !((!n.min || n.min <= d) && (!n.max || d <= n.max))
          }
        }
      }
    )
  }
  let ya = { dateOrder: 'mdy', dateFormat: 'mm/dd/yy', delimiter: '/' }
  ;(ha.date = function (e) {
    function t(e) {
      return (e % 4 === 0 && e % 100 !== 0) || e % 400 === 0
    }
    function a(e) {
      var a,
        s,
        o,
        l,
        c,
        u = [],
        g =
          void 0 !== e[n + 3] ? '' + e[n] + e[n + 1] + e[n + 2] + e[n + 3] : '',
        y = void 0 !== e[i + 1] ? '' + e[i] + e[i + 1] : '',
        _ = void 0 !== e[r + 1] ? '' + e[r] + e[r + 1] : '',
        x = '' + d.getMaxDayOfMonth(g || 2012, y - 1 || 0),
        w = v === g && +m === +y,
        C = b === g && +h === +y
      if (d.invalid)
        for (a = 0; a < d.invalid.length; ++a) {
          if (
            ((o = d.getYear(d.invalid[a])),
            (l = d.getMonth(d.invalid[a])),
            (c = d.getDay(d.invalid[a])),
            o == +g && l + 1 == +y && (c < 10 ? 0 : +('' + c)[0]) == +e[r])
          ) {
            u.push(c < 10 ? c : +('' + c)[1])
            break
          }
          if (
            l + 1 == +y &&
            c == +_ &&
            ('' + o).substring(0, 3) == '' + e[n] + e[n + 1] + e[n + 2]
          ) {
            u.push(('' + o)[3])
            break
          }
          if (
            o == +g &&
            c == +_ &&
            (l < 10 ? 0 : +('' + (l + 1))[0]) == +e[i]
          ) {
            u.push(l < 10 ? l : +('' + (l + 1))[1])
            break
          }
        }
      if (
        ('31' != _ ||
          (e.length != i && e.length != i + 1) ||
          (1 != e[i] ? u.push(2, 4, 6, 9, 11) : u.push(1)),
        '30' == _ && 0 === e[i] && e.length <= i + 1 && u.push(2),
        e.length == i)
      ) {
        for (a = b === g && +h < 10 ? 1 : 2; a <= 9; ++a) u.push(a)
        v === g && +m >= 10 && u.push(0)
      }
      if (e.length == i + 1) {
        if (1 == e[i]) {
          for (a = b === g ? +h[1] + 1 : 3; a <= 9; ++a) u.push(a)
          if (v == g) for (a = 0; a < +m[1]; ++a) u.push(a)
        }
        if (0 === e[i] && (u.push(0), b === g || v === g))
          for (
            a = b === g ? (+_ > +p ? +h : +h + 1) : 0;
            a <= (v === g ? (+_ < +f ? +m - 1 : +m - 1) : 9);
            ++a
          )
            u.push(a)
      }
      if (e.length == r) {
        for (a = C ? (+p > 10 ? +p[0] : 0) + 1 : +x[0] + 1; a <= 9; ++a)
          u.push(a)
        if (w) for (a = 0; a < (+f < 10 ? 0 : f[0]); ++a) u.push(a)
      }
      if (e.length == r + 1) {
        if (e[r] >= 3 || '02' == y) for (a = +x[1] + 1; a <= 9; ++a) u.push(a)
        if (C && +p[0] == e[r]) for (a = +p[1] + 1; a <= 9; ++a) u.push(a)
        if (w && f[0] == e[r]) for (a = 0; a < +f[1]; ++a) u.push(a)
        if (0 === e[r] && (u.push(0), C || w))
          for (a = C ? +p + 1 : 1; a <= (w ? +f - 1 : 9); ++a) u.push(a)
      }
      if (void 0 !== e[n + 2] && '02' == y && '29' == _)
        for (
          s = +('' + e[n] + e[n + 1] + e[n + 2] + 0);
          s <= +('' + e[n] + e[n + 1] + e[n + 2] + 9);
          ++s
        )
          u.push(t(s) ? '' : s % 10)
      if (e.length == n) {
        if (d.min) for (a = 0; a < +v[0]; ++a) u.push(a)
        if (d.max) for (a = +b[0] + 1; a <= 9; ++a) u.push(a)
        u.push(0)
      }
      if (d.min || d.max)
        for (s = 1; s < 4; ++s)
          if (e.length == n + s) {
            if (
              e[n + s - 1] == +v[s - 1] &&
              (3 != s || e[n + s - 2] == +v[s - 2])
            )
              for (
                a = 0;
                a < +v[s] + (3 == s && e[i + 1] && +m > +y ? 1 : 0);
                ++a
              )
                u.push(a)
            if (
              e[n + s - 1] == +b[s - 1] &&
              (3 != s || e[n + s - 2] == +b[s - 2])
            )
              for (a = +b[s] + (3 == s && +h < +y ? 0 : 1); a <= 9; ++a)
                u.push(a)
          }
      return u
    }
    function s(e) {
      return new Date(
        +('' + e[n] + e[n + 1] + e[n + 2] + e[n + 3]),
        +('' + e[i] + e[i + 1]) - 1,
        +('' + e[r] + e[r + 1])
      )
    }
    var n,
      i,
      r,
      o,
      l = [],
      c = Ge({}, e.settings),
      d = Ge(e.settings, Dt, ya, c),
      u = d.dateOrder,
      m = d.min ? '' + (d.getMonth(d.min) + 1) : 0,
      h = d.max ? '' + (d.getMonth(d.max) + 1) : 0,
      f = d.min ? '' + d.getDay(d.min) : 0,
      p = d.max ? '' + d.getDay(d.max) : 0,
      v = d.min ? '' + d.getYear(d.min) : 0,
      b = d.max ? '' + d.getYear(d.max) : 0
    for (
      u = u.replace(/y+/gi, 'yyyy'),
        u = u.replace(/m+/gi, 'mm'),
        u = u.replace(/d+/gi, 'dd'),
        n = u.toUpperCase().indexOf('Y'),
        i = u.toUpperCase().indexOf('M'),
        r = u.toUpperCase().indexOf('D'),
        u = '',
        l.push({ val: n, n: 'yyyy' }, { val: i, n: 'mm' }, { val: r, n: 'dd' }),
        l.sort(function (e, t) {
          return e.val - t.val
        }),
        Be.each(l, function (e, t) {
          u += t.n
        }),
        n = u.indexOf('y'),
        i = u.indexOf('m'),
        r = u.indexOf('d'),
        u = '',
        o = 0;
      o < 8;
      ++o
    )
      (u += 'd'), (o + 1 != n && o + 1 != i && o + 1 != r) || (u += d.delimiter)
    return (
      (e.getVal = function (t) {
        return e._hasValue || t ? s(e.getArrayVal(t)) : null
      }),
      {
        placeholder: '-',
        fill: 'ltr',
        allowLeadingZero: !0,
        template: u,
        parseValue: function (e) {
          var t,
            a = [],
            s = e || d.defaultValue,
            n = Y(d.dateFormat, s, d)
          if (s)
            for (t = 0; t < l.length; ++t)
              a = /m/i.test(l[t].n)
                ? a.concat(
                    (
                      (d.getMonth(n) < 9 ? '0' : '') +
                      (d.getMonth(n) + 1)
                    ).split('')
                  )
                : /d/i.test(l[t].n)
                ? a.concat(
                    ((d.getDay(n) < 10 ? '0' : '') + d.getDay(n)).split('')
                  )
                : a.concat((d.getYear(n) + '').split(''))
          return a
        },
        formatValue: function (e) {
          return P(d.dateFormat, s(e), d)
        },
        validate: function (t) {
          var n = t.values,
            i = s(n)
          return {
            disabled: a(n),
            invalid:
              !(
                'Invalid Date' != i &&
                (!d.min || d.min <= i) &&
                (!d.max || i <= d.max)
              ) ||
              (!!d.invalid && e._indexOf(d.invalid, i) != -1)
          }
        }
      }
    )
  }),
    o('numpad', fa, !1)
  let _a = function (e, t, a) {
    function s(e) {
      Be('.mbsc-fr-c', e).hasClass('mbsc-wdg-c') ||
        (Be('.mbsc-fr-c', e).addClass('mbsc-wdg-c').append(o.show()),
        Be('.mbsc-w-p', e).length || Be('.mbsc-fr-c', e).addClass('mbsc-w-p'))
    }
    let n,
      i,
      r,
      o = Be(e),
      l = this
    ft.call(this, e, t, !0),
      (l._generateContent = function () {
        return ''
      }),
      (l._markupReady = function (e) {
        'inline' != n.display && s(e)
      }),
      (l._markupInserted = function (e) {
        'inline' == n.display && s(e),
          e.trigger('mbsc-enhance', [{ theme: n.theme, lang: n.lang }])
      }),
      (l._markupRemove = function () {
        o.hide(), i ? i.prepend(o) : r.after(o)
      }),
      (l.__processSettings = function () {
        ;(n = l.settings),
          (l.buttons.ok = { text: n.okText, icon: n.okIcon, handler: 'set' }),
          (n.buttons = n.buttons || ('inline' == n.display ? [] : ['ok'])),
          i || r || ((r = o.prev()), r.length || (i = o.parent())),
          o.hide()
      }),
      (l.__init = function () {
        n.cssClass = (n.cssClass || '') + ' mbsc-wdg'
      }),
      a || l.init(t)
  }
  ;(_a.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasContent: !0,
    _hasLang: !0,
    _class: 'widget',
    _defaults: Ge({}, ft.prototype._defaults, { okText: 'OK', headerText: !1 })
  }),
    (Ke.Widget = _a),
    (ye.themes.widget = ye.themes.frame),
    o('widget', _a, !1)
  let xa = Fe && !!window.Promise,
    wa = [],
    Ca = []
  ;(ye.alert = function (e) {
    var t = document.createElement('div')
    return (t.innerHTML = me(e)), ge(he, t, e)
  }),
    (ye.confirm = function (e) {
      var t = document.createElement('div')
      return (t.innerHTML = me(e)), ge(fe, t, e)
    }),
    (ye.prompt = function (e) {
      var t = document.createElement('div')
      return (
        (t.innerHTML =
          me(e) +
          '<label class="mbsc-input">' +
          (e.label ? '<span class="mbsc-label">' + e.label + '</span>' : '') +
          '<input tabindex="0" type="' +
          (e.inputType || 'text') +
          '" placeholder="' +
          (e.placeholder || '') +
          '" value="' +
          (e.value || '') +
          '"></label>'),
        ge(pe, t, e)
      )
    }),
    (ye.snackbar = function (e) {
      var t = document.createElement('div'),
        a = e.button
      return (
        (t.innerHTML =
          '<div class="mbsc-snackbar-cont"><div class="mbsc-snackbar-msg">' +
          (e.message || '') +
          '</div>' +
          (a
            ? '<button class="mbsc-snackbar-btn mbsc-btn mbsc-btn-flat">' +
              (a.icon
                ? '<span class="mbsc-ic ' +
                  (a.text ? 'mbsc-btn-ic ' : '') +
                  'mbsc-ic-' +
                  a.icon +
                  '"></span>'
                : '') +
              (a.text || '') +
              '</button>'
            : '') +
          '</div>'),
        ge(ve, t, e)
      )
    }),
    (ye.toast = function (e) {
      var t = document.createElement('div')
      return (
        (t.innerHTML =
          '<div class="mbsc-toast-msg">' + (e.message || '') + '</div>'),
        ge(be, t, e)
      )
    })
  let Ta = 'ios' == Oe && Ye > 7,
    Ma = function (e, t) {
      function a() {
        i.removeClass('mbsc-no-touch')
      }
      let s,
        n = '',
        i = Be(e),
        r = {},
        o = this
      Ze.call(this, e, t, !0),
        (o.refresh = function (e) {
          Z(i, r, s, e)
        }),
        (o._init = function () {
          ye.themes.form[s.theme] || (s.theme = 'mobiscroll'),
            i.hasClass('mbsc-form') || i.on('touchstart', a).show(),
            n && i.removeClass(n),
            (n =
              'mbsc-form mbsc-no-touch mbsc-' +
              s.theme +
              (Ta ? ' mbsc-form-hb' : '') +
              (s.baseTheme ? ' mbsc-' + s.baseTheme : '') +
              (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr')),
            i.addClass(n).removeClass('mbsc-cloak'),
            o.refresh()
        }),
        (o._destroy = function () {
          i.removeClass(n).off('touchstart', a)
          for (var e in r) r[e].destroy()
        }),
        (s = o.settings),
        o.init(t)
    }
  ;(Ma.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _class: 'form',
    _defaults: { tap: !at, stopProp: !0, lang: 'en' }
  }),
    (ye.themes.form.mobiscroll = {}),
    (Ke.Form = Ma),
    T('[mbsc-enhance],[mbsc-form]', Ma, !0)
  let ka = function (e, t) {
    let a = '',
      s = Be(e),
      n = this,
      i = n.settings
    Ze.call(this, e, t, !0),
      (n._init = function () {
        var e = i.context,
          t = Be(e),
          n = t.find('.mbsc-ms-top .mbsc-ms'),
          r = t.find('.mbsc-ms-bottom .mbsc-ms'),
          o = {}
        'body' == e
          ? Be('body,html').addClass('mbsc-page-ctx')
          : t.addClass('mbsc-page-ctx'),
          a && s.removeClass(a),
          n.length && (o.paddingTop = n[0].offsetHeight),
          r.length && (o.paddingBottom = r[0].offsetHeight),
          (a =
            'mbsc-page mbsc-' +
            i.theme +
            (i.baseTheme ? ' mbsc-' + i.baseTheme : '') +
            (i.rtl ? ' mbsc-rtl' : ' mbsc-ltr')),
          s.addClass(a).removeClass('mbsc-cloak').css(o)
      }),
      (n._destroy = function () {
        s.removeClass(a)
      }),
      (i = n.settings),
      n.init(t)
  }
  ;(ka.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _class: 'page',
    _defaults: { context: 'body' }
  }),
    (Ke.Page = ka),
    (ye.themes.page.mobiscroll = {}),
    T('[mbsc-page]', ka),
    o('page', ka, !1),
    o('form', Ma, !1),
    o('progress', sa, !1),
    o('slider', na, !1),
    o('stepper', Zt, !1),
    o('switch', Qt, !1),
    o('rating', ea, !1) /* eslint-disable no-unused-vars */
  let Da = {
      view: { calendar: { type: 'month', popover: !0 } },
      allDayText: 'All-day',
      labelsShort: ['Yrs', 'Mths', 'Days', 'Hrs', 'Mins', 'Secs'],
      eventText: 'event',
      eventsText: 'events',
      noEventsText: 'No events'
    },
    Sa = { yearChange: !1, weekDays: 'short' }
  ;(bt.eventcalendar = function (e, t) {
    function a() {
      var e = $.view,
        t = e.calendar,
        a = e.eventList,
        s = $.months,
        n = $.weeks
      t
        ? ('week' == t.type ? (n = t.size || 1) : t.size && (s = t.size),
          (A = !1))
        : ((n = 0), (A = !0)),
        a && ((E = a.type), (I = a.size || 1)),
        (Y = e.eventList),
        (N = (t && t.popover && $.eventBubble !== !1) || $.eventBubble),
        ($.weeks = n),
        ($.months = s)
    }
    function s(e, t) {
      var a,
        s = ($.dateWheels || $.dateFormat).search(/m/i),
        n = ($.dateWheels || $.dateFormat).search(/y/i),
        i = $.getYear(e),
        r = $.getMonth(e),
        o = $.getYear(t),
        l = $.getMonth(t)
      'day' == E
        ? (a =
            P($.dateFormat, e, $) +
            (I > 1 ? ' - ' + P($.dateFormat, t, $) : ''))
        : 'week' == E
        ? (a = P($.dateFormat, e, $) + ' - ' + P($.dateFormat, t, $))
        : 'month' == E
        ? (a =
            1 == I
              ? n < s
                ? i + ' ' + $.monthNames[r]
                : $.monthNames[r] + ' ' + i
              : n < s
              ? i +
                ' ' +
                $.monthNamesShort[r] +
                ' - ' +
                o +
                ' ' +
                $.monthNamesShort[l]
              : $.monthNamesShort[r] +
                ' ' +
                i +
                ' - ' +
                $.monthNamesShort[l] +
                ' ' +
                o)
        : 'year' == E && (a = i + (I > 1 ? ' - ' + o : '')),
        w.html(a)
    }
    function n(t, a, s) {
      var n,
        i,
        r,
        l,
        c = 0,
        d = [],
        u = '',
        m = []
      for (
        s || (s = e._prepareObj(q, t, a)), n = H(t);
        n <= a;
        n.setDate(n.getDate() + 1)
      )
        (l = s[n]), l && l.length && m.push({ d: new Date(n), list: o(l) })
      if (m.length > 0)
        for (i = 0; i < m.length; i++)
          for (
            u +=
              '<li class="mbsc-lv-gr-title mbsc-event-day">' +
              P($.dateFormat, m[i].d, $) +
              '</li>',
              r = 0;
            r < m[i].list.length;
            r++
          ) {
            var h = m[i].list[r],
              f = h.start ? W(h.start) : null,
              p = h.end ? W(h.end) : null,
              v = h.color,
              b = kt.test(h.d) || Mt.test(h.d),
              g = h.d ? (b ? h.d : W(h.d)) : f,
              y =
                h.allDay ||
                b ||
                (f && p && f.toDateString() !== p.toDateString())
            d.push(h),
              (u +=
                '<li class="mbsc-lv-item" data-index="' +
                c +
                '"><div class="mbsc-event-time">' +
                (y ? $.allDayText : g && g.getTime ? P($.timeFormat, g) : '') +
                (!y && p && p.getTime ? '<br/>' + P($.timeFormat, p) : '') +
                '</div><div class="mbsc-event-color"' +
                (v ? ' style="background:' + v + ';"' : '') +
                '></div><div class="mbsc-event-txt">' +
                h.text +
                '</div></li>'),
              c++
          }
      else
        u +=
          '<li class="mbsc-lv-gr-title mbsc-event-empty"><div class="mbsc-empty"><h3>' +
          $.noEventsText +
          '</h3></div></li>'
      x.html('<ul class="mbsc-lv mbsc-lv-v">' + u + '</ul>'),
        e.tap(Be('.mbsc-lv-item', x), function (e) {
          j('onEventSelect', {
            domEvent: e,
            event: d[Be(this).attr('data-index')],
            date: n
          })
        })
    }
    function i() {
      if (O) {
        var t = H(O.d),
          a = O.events || k[t],
          s =
            O.cell ||
            Be(
              '.mbsc-cal-slide-a .mbsc-cal-day[data-full="' +
                t.getFullYear() +
                '-' +
                (t.getMonth() + 1) +
                '-' +
                t.getDate() +
                '"]',
              e._markup
            )[0]
        c(a, t, s), (O = null)
      }
    }
    function r(e) {
      var t = $.labelsShort,
        a = Math.abs(e) / 1e3,
        s = a / 60,
        n = s / 60,
        i = n / 24,
        r = i / 365
      return (
        (a < 45 && Math.round(a) + ' ' + t[5].toLowerCase()) ||
        (s < 45 && Math.round(s) + ' ' + t[4].toLowerCase()) ||
        (n < 24 && Math.round(n) + ' ' + t[3].toLowerCase()) ||
        (i < 30 && Math.round(i) + ' ' + t[2].toLowerCase()) ||
        (i < 365 && Math.round(i / 30) + ' ' + t[1].toLowerCase()) ||
        Math.round(r) + ' ' + t[0].toLowerCase()
      )
    }
    function o(e) {
      return e.sort(function (e, t) {
        var a = e.start ? W(e.start) : null,
          s = t.start ? W(t.start) : null,
          n = e.end ? W(e.end) : null,
          i = t.end ? W(t.end) : null,
          r = kt.test(e.d) || Mt.test(e.d),
          o = kt.test(t.d) || Mt.test(t.d),
          l = e.d ? (r ? e.d : W(e.d)) : a,
          c = t.d ? (o ? t.d : W(t.d)) : s,
          d = l.getTime
            ? a && n && a.toDateString() !== n.toDateString()
              ? 1
              : e.allDay
              ? 2
              : l.getTime()
            : 0,
          u = c.getTime
            ? s && i && s.toDateString() !== i.toDateString()
              ? 1
              : t.allDay
              ? 2
              : c.getTime()
            : 0
        return d == u ? (e.text > t.text ? 1 : -1) : d - u
      })
    }
    function l(e) {
      var t = v[0].offsetHeight,
        a = v[0].offsetWidth,
        s = v.offset(),
        n = s.left,
        i = Be(e),
        r = e.offsetHeight,
        o = e.offsetWidth,
        l = i.offset(),
        c = l.left,
        d = l.top - s.top,
        u = i.closest('.mbsc-cal-row').index() < 2,
        m = getComputedStyle(
          g
            .addClass('mbsc-cal-events-t')
            .css({ left: 0, top: u ? d + r : 0, bottom: u ? 0 : t - d })
            .addClass('mbsc-cal-events-v')[0]
        ),
        f = m.height,
        p = g[0].offsetWidth,
        b = h(c - n - (p - o) / 2, 0, a - p)
      g
        .css(Te({ left: b }, u ? 'bottom' : 'top', 'auto'))
        .removeClass('mbsc-cal-events-t'),
        y.css('max-height', f),
        D.refresh(),
        D.scroll(0),
        u
          ? g.addClass('mbsc-cal-events-b')
          : g.removeClass('mbsc-cal-events-b'),
        Be('.mbsc-cal-events-arr', g).css('left', c - n + o / 2 - b)
    }
    function c(t, a, s) {
      if (t) {
        var n,
          i,
          c,
          d,
          u,
          m,
          h,
          f,
          p = '<ul class="mbsc-cal-event-list">'
        ;(M = s),
          (t = o(t)),
          Be.each(t, function (e, t) {
            ;(m = t.start ? W(t.start) : null),
              (h = t.end ? W(t.end) : null),
              (f = kt.test(t.d) || Mt.test(t.d)),
              (d = t.d ? (f ? t.d : W(t.d)) : m),
              (u = m && h && m.toDateString() !== h.toDateString()),
              (c = t.color),
              (n = ''),
              (i = ''),
              d.getTime && (n = P((u ? 'MM d yy ' : '') + $.timeFormat, d)),
              h && (i = P((u ? 'MM d yy ' : '') + $.timeFormat, h)),
              (p +=
                '<li role="button" aria-label="' +
                t.text +
                (n ? ', ' + $.fromText + ' ' + n : '') +
                (i ? ', ' + $.toText + ' ' + i : '') +
                '" class="mbsc-cal-event"><div class="mbsc-cal-event-color" style="' +
                (c ? 'background:' + c + ';' : '') +
                '"></div><div class="mbsc-cal-event-text">' +
                (!d.getTime || u || t.allDay
                  ? ''
                  : '<div class="mbsc-cal-event-time">' +
                    P($.timeFormat, d) +
                    '</div>') +
                t.text +
                '</div>' +
                (m && h
                  ? '<div class="mbsc-cal-event-dur">' + r(h - m) + '</div>'
                  : '') +
                '</li>')
          }),
          (p += '</ul>'),
          _.html(p),
          j('onEventBubbleShow', { target: M, eventList: g[0] }),
          l(M),
          e.tap(Be('.mbsc-cal-event', _), function (e) {
            D.scrolled ||
              j('onEventSelect', {
                domEvent: e,
                event: t[Be(this).index()],
                date: a
              })
          }),
          (S = !0)
      }
    }
    function d() {
      g && g.removeClass('mbsc-cal-events-v'), (M = null), (S = !1)
    }
    function u() {
      d(), e.redraw()
    }
    function m(e) {
      var t = $.getYear(e),
        a = $.getMonth(e),
        s = $.getDay(e)
      if (((C = e), 'day' == E)) T = $.getDate(t, a, s + I - 1)
      else if ('week' == E) {
        var n,
          i = C.getDay()
        ;(n = s + $.firstDay - ($.firstDay - i > 0 ? 7 : 0) - i),
          (C = $.getDate(t, a, n)),
          (T = $.getDate(t, a, n + 7 * I - 1))
      } else
        'month' == E
          ? ((C = $.getDate(t, a, 1)), (T = $.getDate(t, a + I, 0)))
          : 'year' == E &&
            ((C = $.getDate(t, 0, 1)), (T = $.getDate(t + I, 0, 0)))
    }
    function f(e, t) {
      e && j('onPageChange', { firstDay: C, lastDay: T }),
        t || j('onPageLoading', { firstDay: C, lastDay: T }),
        j('onPageLoaded', { firstDay: C, lastDay: T })
    }
    var p,
      v,
      b,
      g,
      y,
      _,
      x,
      w,
      C,
      T,
      M,
      k,
      D,
      S,
      V,
      A,
      E,
      I,
      O,
      Y,
      N,
      F = Ge({}, e.settings),
      $ = Ge(e.settings, Da, F, Sa, t),
      R = 0,
      q = Ge(!0, [], $.data),
      j = e.trigger
    return (
      ($.data = q),
      Be.each(q, function (e, t) {
        void 0 === t._id && (t._id = R++)
      }),
      a(),
      (p = Lt.call(this, e)),
      (e._onSelectShow = function () {
        d()
      }),
      (e._onGenMonth = function (t, a) {
        k = e._prepareObj(q, t, a)
      }),
      (e._onRefresh = function (e) {
        A && f(!1, e)
      }),
      (e._onSetDate = function (e, t) {
        A ? (m(e), f(!0)) : t || V || (Y && 'day' == E ? n(e, e, k) : N && i())
      }),
      (e._getDayProps = function (e) {
        var t = k[e],
          a = { events: t }
        return (
          $.marked ||
            $.labels ||
            (t
              ? ((a.background = t[0] && t[0].background),
                (a.marked = t),
                (a.markup = $.showEventCount
                  ? '<div class="mbsc-cal-txt">' +
                    t.length +
                    ' ' +
                    (t.length > 1 ? $.eventsText : $.eventText) +
                    '</div>'
                  : '<div class="mbsc-cal-marks"><div class="mbsc-cal-mark"></div></div>'))
              : (a.markup = '')),
          a
        )
      }),
      (e.addEvent = function (e) {
        var t = []
        return (
          (e = Ge(!0, [], Be.isArray(e) ? e : [e])),
          Be.each(e, function (e, a) {
            void 0 === a._id && (a._id = R++), q.push(a), t.push(a._id)
          }),
          u(),
          t
        )
      }),
      (e.removeEvent = function (e) {
        ;(e = Be.isArray(e) ? e : [e]),
          Be.each(e, function (e, t) {
            Be.each(q, function (e, a) {
              if (a._id === t) return q.splice(e, 1), !1
            })
          }),
          u()
      }),
      (e.getEvents = function (t) {
        var a
        return t
          ? (t.setHours(0, 0, 0, 0),
            (a = e._prepareObj(q, t, t)),
            a[t] ? o(a[t]) : [])
          : Ge(!0, [], q)
      }),
      (e.setEvents = function (e) {
        var t = []
        return (
          ($.data = q = Ge(!0, [], e)),
          Be.each(q, function (e, a) {
            void 0 === a._id && (a._id = R++), t.push(a._id)
          }),
          u(),
          t
        )
      }),
      (e.navigate = function (t, a, s) {
        s && (O = { d: t }), e.setVal(t, !0, !0, !1, a ? 200 : 0)
      }),
      Ge({}, p, {
        outerMonthChange: !1,
        headerText: !1,
        buttons: 'inline' !== $.display ? ['close'] : $.buttons,
        compClass: 'mbsc-ev-cal mbsc-calendar mbsc-dt',
        onMarkupReady: function (e, t) {
          ;(b = Be(e.target)),
            (x = Be(
              '<div class="mbsc-lv-cont mbsc-lv-' +
                $.theme +
                ($.baseTheme ? ' mbsc-lv-' + $.baseTheme : '') +
                ' mbsc-event-list"></div>'
            ).appendTo(Be('.mbsc-fr-w', b))),
            p.onMarkupReady.call(this, e),
            (v = Be('.mbsc-cal-c', b)),
            (g = Be(
              '<div class="mbsc-cal-events ' +
                ($.eventBubbleClass || '') +
                '"><div class="mbsc-cal-events-arr"></div><div class="mbsc-cal-events-i"><div class="mbsc-cal-events-sc"></div></div></div>'
            ).appendTo(v)),
            (y = Be('.mbsc-cal-events-i', g)),
            (_ = Be('.mbsc-cal-events-sc', g)),
            (w = Be('.mbsc-cal-month', b)),
            (D = new vt(y[0])),
            (S = !1),
            m(t.getDate(!0)),
            t.tap(y, function () {
              D.scrolled || d()
            }),
            Y &&
              A &&
              (f(),
              L(
                Be('.mbsc-cal-btn', b),
                function (e, t) {
                  var a = $.getYear(C),
                    s = $.getMonth(C),
                    n = $.getDay(C)
                  'day' == E
                    ? ((C = $.getDate(a, s, n + t * I)),
                      (T = $.getDate(a, s, n + (t + 1) * I - 1)))
                    : 'week' == E
                    ? ((C = $.getDate(a, s, n + t * I * 7)),
                      (T = $.getDate(a, s, n + (t + 1) * I * 7 - 1)))
                    : 'month' == E
                    ? ((C = $.getDate(a, s + t * I, 1)),
                      (T = $.getDate(a, s + (t + 1) * I, 0)))
                    : 'year' == E &&
                      ((C = $.getDate(a + t * I, 0, 1)),
                      (T = $.getDate(a + (t + 1) * I, 0, 0))),
                    f(!0)
                },
                200
              ))
        },
        onDayChange: function (e) {
          var t = e.target !== M
          d(), t && (O = { d: e.date, cell: e.target, events: e.events })
        },
        onPageChange: function (t) {
          d(), (V = !0), A || e._isSetDate || e.setVal(t.firstDay)
        },
        onPageLoaded: function (t) {
          var a = t.firstDay,
            r = t.lastDay
          Y
            ? A
              ? (n(a, r), s(a, r))
              : ('month' == E
                  ? (r = $.getDate($.getYear(a), $.getMonth(a) + I, 0))
                  : 'week' == E
                  ? (r = $.getDate(
                      $.getYear(a),
                      $.getMonth(a),
                      $.getDay(a) + 7 * I - 1
                    ))
                  : ((a = e.getVal(!0)), (r = a)),
                n(a, r, k))
            : N && i(),
            (V = !1)
        },
        onPosition: function (e) {
          p.onPosition.call(this, e), S && l(M)
        },
        onHide: function () {
          p.onHide.call(this), D && D.destroy()
        }
      })
    )
  }),
    o('eventcalendar', xt)
  let Va = {
      min: 0,
      max: 100,
      defaultUnit: 'km',
      units: ['m', 'km', 'in', 'ft', 'yd', 'mi']
    },
    Aa = {
      mm: 0.001,
      cm: 0.01,
      dm: 0.1,
      m: 1,
      dam: 10,
      hm: 100,
      km: 1e3,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      ch: 20.1168,
      fur: 201.168,
      mi: 1609.344,
      lea: 4828.032
    }
  bt.distance = function (e) {
    let t = Ge({}, Va, e.settings)
    return (
      Ge(e.settings, t, {
        sign: !1,
        convert: function (e, t, a) {
          return (e * Aa[t]) / Aa[a]
        }
      }),
      bt.measurement.call(this, e)
    )
  }
  let Ea = {
      min: 0,
      max: 100,
      defaultUnit: 'N',
      units: ['N', 'kp', 'lbf', 'pdl']
    },
    Ia = { N: 1, kp: 9.80665, lbf: 4.448222, pdl: 0.138255 }
  bt.force = function (e) {
    let t = Ge({}, Ea, e.settings)
    return (
      Ge(e.settings, t, {
        sign: !1,
        convert: function (e, t, a) {
          return (e * Ia[t]) / Ia[a]
        }
      }),
      bt.measurement.call(this, e)
    )
  }
  let La = {
      min: 0,
      max: 1e3,
      defaultUnit: 'kg',
      units: ['g', 'kg', 'oz', 'lb'],
      unitNames: { tlong: 't (long)', tshort: 't (short)' }
    },
    Oa = {
      mg: 0.001,
      cg: 0.01,
      dg: 0.1,
      g: 1,
      dag: 10,
      hg: 100,
      kg: 1e3,
      t: 1e6,
      drc: 1.7718452,
      oz: 28.3495,
      lb: 453.59237,
      st: 6350.29318,
      qtr: 12700.58636,
      cwt: 50802.34544,
      tlong: 1016046.9088,
      tshort: 907184.74
    }
  bt.mass = function (e) {
    let t = Ge({}, La, e.settings)
    return (
      Ge(e.settings, t, {
        sign: !1,
        convert: function (e, t, a) {
          return (e * Oa[t]) / Oa[a]
        }
      }),
      bt.measurement.call(this, e)
    )
  }
  let Pa = {
      min: 0,
      max: 100,
      defaultUnit: 'kph',
      units: ['kph', 'mph', 'mps', 'fps', 'knot'],
      unitNames: {
        kph: 'km/h',
        mph: 'mi/h',
        mps: 'm/s',
        fps: 'ft/s',
        knot: 'knot'
      }
    },
    Ya = { kph: 1, mph: 1.60934, mps: 3.6, fps: 1.09728, knot: 1.852 }
  bt.speed = function (e) {
    let t = Ge({}, Pa, e.settings)
    return (
      Ge(e.settings, t, {
        sign: !1,
        convert: function (e, t, a) {
          return (e * Ya[t]) / Ya[a]
        }
      }),
      bt.measurement.call(this, e)
    )
  }
  let Ha = {
      min: -20,
      max: 40,
      defaultUnit: 'c',
      units: ['c', 'k', 'f', 'r'],
      unitNames: { c: '°C', k: 'K', f: '°F', r: '°R' }
    },
    Na = {
      c2k: function (e) {
        return e + 273.15
      },
      c2f: function (e) {
        return (9 * e) / 5 + 32
      },
      c2r: function (e) {
        return (9 * (e + 273.15)) / 5
      },
      k2c: function (e) {
        return e - 273.15
      },
      k2f: function (e) {
        return (9 * e) / 5 - 459.67
      },
      k2r: function (e) {
        return (9 * e) / 5
      },
      f2c: function (e) {
        return (5 * (e - 32)) / 9
      },
      f2k: function (e) {
        return (5 * (e + 459.67)) / 9
      },
      f2r: function (e) {
        return e + 459.67
      },
      r2c: function (e) {
        return (5 * (e - 491.67)) / 9
      },
      r2k: function (e) {
        return (5 * e) / 9
      },
      r2f: function (e) {
        return e - 459.67
      }
    }
  ;(bt.temperature = function (e) {
    var t = Ge({}, Ha, e.settings)
    return (
      Ge(e.settings, t, {
        sign: !0,
        convert: function (e, t, a) {
          return Na[t + '2' + a](e)
        }
      }),
      bt.measurement.call(this, e)
    )
  }),
    o('measurement', xt),
    o('distance', xt),
    o('force', xt),
    o('mass', xt),
    o('speed', xt),
    o('temperature', xt) /* eslint-disable no-unused-vars */
  let Fa = 1,
    $a = function (e, t, a) {
      function s(e) {
        clearTimeout(v),
          (v = setTimeout(function () {
            r('load' !== e.type)
          }, 200))
      }
      function n(t, a) {
        if (t.length) {
          if (((a = D._onItemTap(t, a)), (o = t), t.parent()[0] == e)) {
            let s = t.offset().left,
              n = t[0].offsetLeft,
              i = t[0].offsetWidth,
              r = c.offset().left
            b && (n = w - n - i),
              'a' == x.variant
                ? s < r
                  ? g.scroll(b ? n + i - h : -n, k, !0)
                  : s + i > r + h && g.scroll(b ? n : h - n - i, k, !0)
                : g.scroll(h / 2 - n - i / 2, k, !0)
          }
          a && T('onItemTap', { target: t[0] })
        }
      }
      function i() {
        let e, t
        D._initMarkup(c),
          S.find('.mbsc-ripple').remove(),
          (D._$items = S.children()),
          D._$items.each(function (a) {
            var s,
              n = Be(this),
              i = n.attr('data-ref')
            i || (i = Fa++),
              0 === a && (e = n),
              o || (o = D._getActiveItem(n)),
              (t = D._getItemProps(n) || {}),
              (s = 'mbsc-scv-item mbsc-btn-e ' + (t.cssClass || '')),
              n.attr('data-ref', i).removeClass(M[i]).addClass(s),
              (M[i] = s)
          }),
          o || (o = e),
          D._markupReady(c)
      }
      function r(t, a) {
        let s = x.itemWidth,
          n = x.layout
        ;(D.contWidth = h = c.width()),
          (t && p === h) ||
            !h ||
            ((p = h),
            u(n) && ((f = h ? h / n : s), f < s && (n = 'liquid')),
            s &&
              ('liquid' == n
                ? (f = h
                    ? h / Math.min(Math.floor(h / s), D._$items.length)
                    : s)
                : 'fixed' == n && (f = s)),
            D._size(h, f),
            f && S.children().css('width', f + 'px'),
            (D.totalWidth = w = e.offsetWidth),
            Ge(g.settings, {
              contSize: h,
              maxSnapScroll: !!x.paging && 1,
              maxScroll: 0,
              minScroll: w > h ? h - w : 0,
              snap: x.paging ? h : !!y && (f || '.mbsc-scv-item'),
              elastic: w > h && (f || h)
            }),
            g.refresh(a))
      }
      let o,
        c,
        d,
        m,
        h,
        f,
        p,
        v,
        b,
        g,
        y,
        x,
        w,
        C,
        T,
        M = {},
        k = 1e3,
        D = this,
        S = Be(e)
      Ze.call(this, e, t, !0),
        (D.navigate = function (e, t) {
          n(D._getItem(e), t)
        }),
        (D.next = function (e) {
          if (o) {
            var t = o.next()
            t.length && ((o = t), n(o, e))
          }
        }),
        (D.prev = function (e) {
          if (o) {
            var t = o.prev()
            t.length && ((o = t), n(o, e))
          }
        }),
        (D.refresh = D.position =
          function (e) {
            i(), r(!1, e)
          }),
        (D._init = function () {
          var e
          ;(d = Be(x.context)),
            (m = Be('body' == x.context ? window : x.context)),
            D.__init(),
            (b = x.rtl),
            (y = !(!x.itemWidth || void 0 !== x.snap) || x.snap),
            (e =
              'mbsc-scv-c mbsc-no-touch mbsc-' +
              x.theme +
              ' ' +
              (x.cssClass || '') +
              ' ' +
              (x.wrapperClass || '') +
              (x.baseTheme ? ' mbsc-' + x.baseTheme : '') +
              (b ? ' mbsc-rtl' : ' mbsc-ltr') +
              (x.itemWidth ? ' mbsc-scv-hasw' : '') +
              ('body' == x.context ? '' : ' mbsc-scv-ctx') +
              ' ' +
              (D._getContClass() || '')),
            c
              ? (c.attr('class', e), S.off('.mbsc-ripple'))
              : ((c = Be(
                  '<div class="' + e + '"><div class="mbsc-scv-sc"></div></div>'
                ).insertAfter(S)),
                c.find('.mbsc-scv-sc').append(S),
                (g = new vt(c[0], {
                  axis: 'X',
                  contSize: 0,
                  maxScroll: 0,
                  maxSnapScroll: 1,
                  minScroll: 0,
                  snap: 1,
                  elastic: 1,
                  rtl: b,
                  mousewheel: x.mousewheel,
                  thresholdX: x.threshold,
                  stopProp: x.stopProp,
                  onStart: function (e) {
                    C ||
                      'touchstart' != e.domEvent.type ||
                      ((C = !0),
                      d.find('.mbsc-no-touch').removeClass('mbsc-no-touch'))
                  },
                  onBtnTap: function (e) {
                    'touchend' === e.domEvent.type &&
                      _(e.domEvent, e.domEvent.target),
                      n(Be(e.target), !0)
                  },
                  onGestureStart: function (e) {
                    T('onGestureStart', e)
                  },
                  onGestureEnd: function (e) {
                    T('onGestureEnd', e)
                  },
                  onMove: function (e) {
                    T('onMove', e)
                  },
                  onAnimationStart: function (e) {
                    T('onAnimationStart', e)
                  },
                  onAnimationEnd: function (e) {
                    T('onAnimationEnd', e)
                  }
                }))),
            S.css('display', '').addClass('mbsc-scv').removeClass('mbsc-cloak'),
            i(),
            T('onMarkupReady', { target: c[0] }),
            r(),
            c.find('img').on('load', s),
            m.on('orientationchange resize', s)
        }),
        (D._size = l),
        (D._initMarkup = l),
        (D._markupReady = l),
        (D._getContClass = l),
        (D._getItemProps = l),
        (D._getActiveItem = l),
        (D.__init = l),
        (D.__destroy = l),
        (D._destroy = function () {
          D.__destroy(),
            m.off('orientationchange resize', s),
            S.removeClass('mbsc-scv')
              .insertAfter(c)
              .find('.mbsc-scv-item')
              .each(function () {
                var e = Be(this)
                e.width('').removeClass(M[e.attr('data-ref')])
              }),
            c.remove(),
            g.destroy()
        }),
        (D._getItem = function (e) {
          return (
            'object' !== ('undefined' == typeof e ? 'undefined' : xe(e)) &&
              (e = D._$items.filter('[data-id="' + e + '"]')),
            Be(e)
          )
        }),
        (D._onItemTap = function (e, t) {
          return void 0 === t || t
        }),
        (x = D.settings),
        (T = D.trigger),
        a || D.init(t)
    }
  ;($a.prototype = {
    _class: 'scrollview',
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _defaults: { tap: !0, stopProp: !1, context: 'body', layout: 'liquid' }
  }),
    (Ke.ScrollView = $a)
  let Wa = function (e, t, a) {
    function s() {
      o && 'inline' != o && r.find('.mbsc-page').css('padding-' + o, '')
    }
    function n(e) {
      e.addClass(u).attr('data-selected', 'true').attr('aria-selected', 'true')
    }
    function i(e) {
      e.removeClass(u).removeAttr('data-selected').removeAttr('aria-selected')
    }
    let r,
      o,
      c,
      d,
      u,
      m,
      h = Be(e),
      f = this
    $a.call(this, e, t, !0),
      (f.select = function (e) {
        c || i(f._$items.filter('.mbsc-ms-item-sel')), n(f._getItem(e))
      }),
      (f.deselect = function (e) {
        i(f._getItem(e))
      }),
      (f.enable = function (e) {
        f._getItem(e)
          .removeClass('mbsc-disabled')
          .removeAttr('data-disabled')
          .removeAttr('aria-disabled')
      }),
      (f.disable = function (e) {
        f._getItem(e)
          .addClass('mbsc-disabled')
          .attr('data-disabled', 'true')
          .attr('aria-disabled', 'true')
      }),
      (f.setBadge = function (e, t) {
        var a
        ;(e = f._getItem(e).attr('data-badge', t)),
          (a = Be('.mbsc-ms-badge', e)),
          a.length
            ? t
              ? a.html(t)
              : a.remove()
            : t && e.append('<span class="mbsc-ms-badge">' + t + '</span>')
      }),
      (f._markupReady = function (e) {
        f._hasIcons
          ? e.addClass('mbsc-ms-icons')
          : e.removeClass('mbsc-ms-icons'),
          f._hasText ? e.addClass('mbsc-ms-txt') : e.removeClass('mbsc-ms-txt'),
          f.__markupReady(e)
      }),
      (f._size = function (t, a) {
        f.__size(t, a),
          'inline' != o &&
            r.find('.mbsc-page').css('padding-' + o, e.offsetHeight + 'px')
      }),
      (f._onItemTap = function (e, t) {
        return (
          f.__onItemTap(e, t) !== !1 &&
          (void 0 === t && (t = !c),
          d &&
            t &&
            !e.hasClass('mbsc-disabled') &&
            (c
              ? 'true' == e.attr('data-selected')
                ? i(e)
                : n(e)
              : (i(f._$items.filter('.mbsc-ms-item-sel')), n(e))),
          t)
        )
      }),
      (f._getActiveItem = function (e) {
        var t = 'true' == e.attr('data-selected')
        if (d && !c && t) return e
      }),
      (f._getItemProps = function (e) {
        var t = 'true' == e.attr('data-selected'),
          a = 'true' == e.attr('data-disabled'),
          s = e.attr('data-icon'),
          n = e.attr('data-badge')
        return (
          e
            .attr('data-role', 'button')
            .attr('aria-selected', t ? 'true' : 'false')
            .attr('aria-disabled', a ? 'true' : 'false'),
          n && e.append('<span class="mbsc-ms-badge">' + n + '</span>'),
          s && (f._hasIcons = !0),
          e.text() && (f._hasText = !0),
          {
            cssClass:
              'mbsc-ms-item ' +
              (m.itemClass || '') +
              ' ' +
              (t ? u : '') +
              (a ? ' mbsc-disabled ' + (m.disabledClass || '') : '') +
              (s ? ' mbsc-ms-ic mbsc-ic mbsc-ic-' + s : '')
          }
        )
      }),
      (f._getContClass = function () {
        return (
          ' mbsc-ms-c mbsc-ms-' +
          m.variant +
          ' mbsc-ms-' +
          o +
          (d ? '' : ' mbsc-ms-nosel') +
          (f.__getContClass() || '')
        )
      }),
      (f.__init = function () {
        f.___init(),
          (r = Be(m.context)),
          s(),
          (o = m.display),
          (c = 'multiple' == m.select),
          (d = 'off' != m.select),
          (u = ' mbsc-ms-item-sel ' + (m.activeClass || '')),
          h.addClass('mbsc-ms mbsc-ms-base ' + (m.groupClass || ''))
      }),
      (f.__destroy = function () {
        h.removeClass('mbsc-ms mbsc-ms-base ' + (m.groupClass || '')),
          s(),
          f.___destroy()
      }),
      (f.__onItemTap = l),
      (f.__getContClass = l),
      (f.__markupReady = l),
      (f.__size = l),
      (f.___init = l),
      (f.___destroy = l),
      (m = f.settings),
      a || f.init(t)
  }
  Wa.prototype = { _defaults: Ge({}, $a.prototype._defaults) }
  let Ra = function (e, t) {
    let a,
      s,
      n,
      i,
      r,
      o = Be(e),
      l = o.is('ul,ol'),
      c = this
    Wa.call(this, e, t, !0),
      (c._initMarkup = function () {
        a && a.remove(), s && o.append(s.children())
      }),
      (c.__size = function (e, t) {
        var l,
          d = t || 72,
          u = c._$items.length,
          m = 0
        r.hide(),
          'bottom' == i.type &&
            (o.removeClass('mbsc-scv-liq'),
            a.remove(),
            c._$items.remove().each(function (a) {
              var n = Be(this)
              o.append(n),
                (m += t || this.offsetWidth || 0),
                Math.round(m + (a < u - 1 ? d : 0)) > e &&
                  ((l = !0),
                  s.append(n.css('width', '').addClass('mbsc-fr-btn-e')))
            }),
            a
              .attr(
                'class',
                n +
                  (i.moreIcon
                    ? ' mbsc-menu-item-ic mbsc-ms-ic mbsc-ic mbsc-ic-' +
                      i.moreIcon
                    : '')
              )
              .html(c._hasIcons && c._hasText ? i.moreText : ''),
            l && o.append(a)),
          'liquid' == i.layout && o.addClass('mbsc-scv-liq')
      }),
      (c.__onItemTap = function (e) {
        if (
          e.hasClass('mbsc-menu-item') &&
          c.trigger('onMenuShow', { target: e[0], menu: r }) !== !1
        )
          return r.show(!1, !0), !1
      }),
      (c.__getContClass = function () {
        return 'hamburger' == i.type ? ' mbsc-ms-hamburger' : ''
      }),
      (c.__markupReady = function (e) {
        'hamburger' == i.type &&
          (s.append(c._$items.addClass('mbsc-fr-btn-e')),
          a
            .attr(
              'class',
              n +
                (i.menuIcon
                  ? ' mbsc-menu-item-ic mbsc-ms-ic mbsc-ic mbsc-ic-' +
                    i.menuIcon
                  : '')
            )
            .html(i.menuText || ''),
          o.append(a),
          (i.menuText && i.menuIcon) || e.removeClass('mbsc-ms-icons'),
          i.menuText ? e.addClass('mbsc-ms-txt') : e.removeClass('mbsc-ms-txt'))
      }),
      (c.___init = function () {
        var e
        'tab' == i.type
          ? ((i.display = i.display || 'top'), (i.variant = i.variant || 'b'))
          : 'bottom' == i.type
          ? ((i.display = i.display || 'bottom'),
            (i.variant = i.variant || 'a'))
          : 'hamburger' == i.type &&
            ((i.display = i.display || 'inline'),
            (i.variant = i.variant || 'a')),
          (n =
            'mbsc-scv-item mbsc-ms-item mbsc-btn-e mbsc-menu-item ' +
            (i.itemClass || '')),
          a ||
            ((a = Be(l ? '<li></li>' : '<div></div>')),
            (s = Be(l ? '<ul></ul>' : '<div></div>').addClass(
              'mbsc-scv mbsc-ms'
            ))),
          (r = new _a(s[0], {
            display: 'bubble',
            theme: i.theme,
            lang: i.lang,
            context: i.context,
            buttons: [],
            anchor: a,
            onBeforeShow: function (t, a) {
              ;(e = null),
                (a.settings.cssClass =
                  'mbsc-wdg mbsc-ms-a mbsc-ms-more' +
                  (c._hasText ? '' : ' mbsc-ms-more-icons'))
            },
            onBeforeClose: function () {
              return c.trigger('onMenuHide', { target: e && e[0], menu: r })
            },
            onMarkupReady: function (t, a) {
              c.tap(a._markup.find('.mbsc-fr-c'), function (t) {
                ;(e = Be(t.target).closest('.mbsc-ms-item')),
                  e.length &&
                    !e.hasClass('mbsc-disabled') &&
                    ('touchend' === t.type
                      ? _(t, t.target)
                      : (c.navigate(e, !0), r.hide()))
              })
            }
          }))
      }),
      (c.___destroy = function () {
        r.destroy(), o.append(c._$items), a.remove()
      }),
      (i = c.settings),
      c.init(t)
  }
  ;(Ra.prototype = {
    _class: 'navigation',
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _defaults: Ge({}, Wa.prototype._defaults, {
      type: 'bottom',
      moreText: 'More',
      moreIcon: 'material-more-horiz',
      menuIcon: 'material-menu'
    })
  }),
    (Ke.Navigation = Ra),
    o('nav', Ra, !1),
    o('scrollview', $a, !1)
  let qa = function (e, t) {
    let a = this
    Wa.call(this, e, t, !0), (a.___init = function () {}), a.init(t)
  }
  ;(qa.prototype = {
    _class: 'optionlist',
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _defaults: Ge({}, Wa.prototype._defaults, {
      select: 'multiple',
      variant: 'a',
      display: 'inline'
    })
  }),
    (Ke.Optionlist = qa),
    (ye.themes.optionlist = ye.themes.navigation),
    o('optionlist', qa, !1) /* eslint-disable no-unused-vars */
  let ja = 'ios' == Oe && Ye > 7,
    za = function (e, t) {
      function a() {
        i.removeClass('mbsc-no-touch')
      }
      let s,
        n = '',
        i = Be(e),
        r = {},
        o = this
      Ze.call(this, e, t, !0),
        (o.refresh = function (e) {
          Z(i, r, s, e)
        }),
        (o._init = function () {
          i.hasClass('mbsc-card') || i.on('touchstart', a).show(),
            n && i.removeClass(n),
            (n =
              'mbsc-card mbsc-form mbsc-no-touch mbsc-' +
              s.theme +
              (ja ? ' mbsc-form-hb' : '') +
              (s.baseTheme ? ' mbsc-' + s.baseTheme : '') +
              (s.rtl ? ' mbsc-rtl' : ' mbsc-ltr')),
            i.addClass(n).removeClass('mbsc-cloak'),
            o.refresh()
        }),
        (o._destroy = function () {
          i.removeClass(n).off('touchstart', a)
          for (var e in r) r[e].destroy()
        }),
        (s = o.settings),
        o.init(t)
    }
  ;(za.prototype = {
    _hasDef: !0,
    _hasTheme: !0,
    _hasLang: !0,
    _class: 'card',
    _defaults: { tap: !0, stopProp: !0, lang: 'en' }
  }),
    (Ke.Card = za),
    T('[mbsc-card]', za, !0),
    o('card', za, !1),
    (ye.i18n.zh = {
      setText: '确定',
      cancelText: '取消',
      clearText: '明确',
      selectedText: '{count} 选',
      dateFormat: 'yy/mm/dd',
      dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      dayText: '日',
      hourText: '时',
      minuteText: '分',
      monthNames: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      monthNamesShort: [
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二'
      ],
      monthText: '月',
      secText: '秒',
      timeFormat: 'HH:ii',
      yearText: '年',
      nowText: '当前',
      pmText: '下午',
      amText: '上午',
      todayText: '今天',
      dateText: '日',
      timeText: '时间',
      closeText: '关闭',
      allDayText: '全天',
      noEventsText: '无事件',
      eventText: '活动',
      eventsText: '活动',
      fromText: '开始时间',
      toText: '结束时间',
      wholeText: '合计',
      fractionText: '分数',
      unitText: '单位',
      labels: ['年', '月', '日', '小时', '分钟', '秒', ''],
      labelsShort: ['年', '月', '日', '点', '分', '秒', ''],
      startText: '开始',
      stopText: '停止',
      resetText: '重置',
      lapText: '圈',
      hideText: '隐藏',
      backText: '返回',
      undoText: '复原',
      offText: '关闭',
      onText: '开启',
      decimalSeparator: ',',
      thousandsSeparator: ' '
    })
  let Ba = ye.themes
  ;(Ba.frame.ios = {
    display: 'bottom',
    headerText: !1,
    btnWidth: !1,
    deleteIcon: 'ios-backspace',
    scroll3d: !0
  }),
    (Ba.scroller.ios = Ge({}, Ba.frame.ios, {
      rows: 5,
      height: 34,
      minWidth: 55,
      selectedLineHeight: !0,
      selectedLineBorder: 1,
      showLabel: !1,
      useShortLabels: !0,
      btnPlusClass: 'mbsc-ic mbsc-ic-arrow-down5',
      btnMinusClass: 'mbsc-ic mbsc-ic-arrow-up5',
      checkIcon: 'ion-ios7-checkmark-empty',
      filterClearIcon: 'ion-close-circled',
      dateDisplay: 'MMdyy',
      btnCalPrevClass: 'mbsc-ic mbsc-ic-arrow-left5',
      btnCalNextClass: 'mbsc-ic mbsc-ic-arrow-right5'
    })),
    (Ba.listview.ios = {
      leftArrowClass: 'mbsc-ic-ion-ios7-arrow-back',
      rightArrowClass: 'mbsc-ic-ion-ios7-arrow-forward'
    }),
    (Ba.form.ios = {}),
    ye.customTheme('mobiscroll-dark', 'mobiscroll'),
    ye.customTheme('ios-dark', 'ios')
  let Ua = ye.themes,
    Xa = void 0
  return (
    'android' == Oe
      ? (Xa = 'material')
      : 'ios' == Oe
      ? (Xa = 'ios')
      : 'wp' == Oe && (Xa = 'windows'),
    Be.each(Ua.frame, function (e, t) {
      return Xa &&
        t.baseTheme == Xa &&
        'material-dark' != e &&
        'windows-dark' != e &&
        'ios-dark' != e
        ? ((ye.autoTheme = e), !1)
        : void (e == Xa && (ye.autoTheme = e))
    }),
    (ye.uid = '56dc61d1'),
    ye
  )
})
mobiscroll.settings = { theme: 'ios', lang: 'zh' }
