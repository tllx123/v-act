'use strict'

var require$$1 = require('object-assign')
var jsxRuntime = require('react/jsx-runtime')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var require$$1__default = /*#__PURE__*/ _interopDefaultLegacy(require$$1)

const common = {
  black: '#000',
  white: '#fff'
}

const red = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
  A100: '#ff8a80',
  A200: '#ff5252',
  A400: '#ff1744',
  A700: '#d50000'
}

const purple = {
  50: '#f3e5f5',
  100: '#e1bee7',
  200: '#ce93d8',
  300: '#ba68c8',
  400: '#ab47bc',
  500: '#9c27b0',
  600: '#8e24aa',
  700: '#7b1fa2',
  800: '#6a1b9a',
  900: '#4a148c',
  A100: '#ea80fc',
  A200: '#e040fb',
  A400: '#d500f9',
  A700: '#aa00ff'
}

const blue = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
  A100: '#82b1ff',
  A200: '#448aff',
  A400: '#2979ff',
  A700: '#2962ff'
}

const lightBlue = {
  50: '#e1f5fe',
  100: '#b3e5fc',
  200: '#81d4fa',
  300: '#4fc3f7',
  400: '#29b6f6',
  500: '#03a9f4',
  600: '#039be5',
  700: '#0288d1',
  800: '#0277bd',
  900: '#01579b',
  A100: '#80d8ff',
  A200: '#40c4ff',
  A400: '#00b0ff',
  A700: '#0091ea'
}

const green = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
  A100: '#b9f6ca',
  A200: '#69f0ae',
  A400: '#00e676',
  A700: '#00c853'
}

const orange = {
  50: '#fff3e0',
  100: '#ffe0b2',
  200: '#ffcc80',
  300: '#ffb74d',
  400: '#ffa726',
  500: '#ff9800',
  600: '#fb8c00',
  700: '#f57c00',
  800: '#ef6c00',
  900: '#e65100',
  A100: '#ffd180',
  A200: '#ffab40',
  A400: '#ff9100',
  A700: '#ff6d00'
}

const grey = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161'
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {}
  var target = {}
  var sourceKeys = Object.keys(source)
  var key, i

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i]
    if (excluded.indexOf(key) >= 0) continue
    target[key] = source[key]
  }

  return target
}

var react = { exports: {} }

var react_production_min = {}

/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$3 = require$$1__default['default'],
  n$3 = 60103,
  p$3 = 60106
react_production_min.Fragment = 60107
react_production_min.StrictMode = 60108
react_production_min.Profiler = 60114
var q$3 = 60109,
  r$3 = 60110,
  t$2 = 60112
react_production_min.Suspense = 60113
var u$1 = 60115,
  v$3 = 60116
if ('function' === typeof Symbol && Symbol.for) {
  var w$3 = Symbol.for
  n$3 = w$3('react.element')
  p$3 = w$3('react.portal')
  react_production_min.Fragment = w$3('react.fragment')
  react_production_min.StrictMode = w$3('react.strict_mode')
  react_production_min.Profiler = w$3('react.profiler')
  q$3 = w$3('react.provider')
  r$3 = w$3('react.context')
  t$2 = w$3('react.forward_ref')
  react_production_min.Suspense = w$3('react.suspense')
  u$1 = w$3('react.memo')
  v$3 = w$3('react.lazy')
}
var x$3 = 'function' === typeof Symbol && Symbol.iterator
function y$3(a) {
  if (null === a || 'object' !== typeof a) return null
  a = (x$3 && a[x$3]) || a['@@iterator']
  return 'function' === typeof a ? a : null
}
function z$3(a) {
  for (
    var b = 'https://reactjs.org/docs/error-decoder.html?invariant=' + a, c = 1;
    c < arguments.length;
    c++
  )
    b += '&args[]=' + encodeURIComponent(arguments[c])
  return (
    'Minified React error #' +
    a +
    '; visit ' +
    b +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  )
}
var A$3 = {
    isMounted: function () {
      return !1
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {}
  },
  B$1 = {}
function C$1(a, b, c) {
  this.props = a
  this.context = b
  this.refs = B$1
  this.updater = c || A$3
}
C$1.prototype.isReactComponent = {}
C$1.prototype.setState = function (a, b) {
  if ('object' !== typeof a && 'function' !== typeof a && null != a)
    throw Error(z$3(85))
  this.updater.enqueueSetState(this, a, b, 'setState')
}
C$1.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, 'forceUpdate')
}
function D$1() {}
D$1.prototype = C$1.prototype
function E$1(a, b, c) {
  this.props = a
  this.context = b
  this.refs = B$1
  this.updater = c || A$3
}
var F$1 = (E$1.prototype = new D$1())
F$1.constructor = E$1
l$3(F$1, C$1.prototype)
F$1.isPureReactComponent = !0
var G$1 = { current: null },
  H$1 = Object.prototype.hasOwnProperty,
  I$1 = { key: !0, ref: !0, __self: !0, __source: !0 }
function J(a, b, c) {
  var e,
    d = {},
    k = null,
    h = null
  if (null != b)
    for (e in (void 0 !== b.ref && (h = b.ref),
    void 0 !== b.key && (k = '' + b.key),
    b))
      H$1.call(b, e) && !I$1.hasOwnProperty(e) && (d[e] = b[e])
  var g = arguments.length - 2
  if (1 === g) d.children = c
  else if (1 < g) {
    for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2]
    d.children = f
  }
  if (a && a.defaultProps)
    for (e in ((g = a.defaultProps), g)) void 0 === d[e] && (d[e] = g[e])
  return {
    $$typeof: n$3,
    type: a,
    key: k,
    ref: h,
    props: d,
    _owner: G$1.current
  }
}
function K(a, b) {
  return {
    $$typeof: n$3,
    type: a.type,
    key: b,
    ref: a.ref,
    props: a.props,
    _owner: a._owner
  }
}
function L(a) {
  return 'object' === typeof a && null !== a && a.$$typeof === n$3
}
function escape(a) {
  var b = { '=': '=0', ':': '=2' }
  return (
    '$' +
    a.replace(/[=:]/g, function (a) {
      return b[a]
    })
  )
}
var M = /\/+/g
function N(a, b) {
  return 'object' === typeof a && null !== a && null != a.key
    ? escape('' + a.key)
    : b.toString(36)
}
function O(a, b, c, e, d) {
  var k = typeof a
  if ('undefined' === k || 'boolean' === k) a = null
  var h = !1
  if (null === a) h = !0
  else
    switch (k) {
      case 'string':
      case 'number':
        h = !0
        break
      case 'object':
        switch (a.$$typeof) {
          case n$3:
          case p$3:
            h = !0
        }
    }
  if (h)
    return (
      (h = a),
      (d = d(h)),
      (a = '' === e ? '.' + N(h, 0) : e),
      Array.isArray(d)
        ? ((c = ''),
          null != a && (c = a.replace(M, '$&/') + '/'),
          O(d, b, c, '', function (a) {
            return a
          }))
        : null != d &&
          (L(d) &&
            (d = K(
              d,
              c +
                (!d.key || (h && h.key === d.key)
                  ? ''
                  : ('' + d.key).replace(M, '$&/') + '/') +
                a
            )),
          b.push(d)),
      1
    )
  h = 0
  e = '' === e ? '.' : e + ':'
  if (Array.isArray(a))
    for (var g = 0; g < a.length; g++) {
      k = a[g]
      var f = e + N(k, g)
      h += O(k, b, c, f, d)
    }
  else if (((f = y$3(a)), 'function' === typeof f))
    for (a = f.call(a), g = 0; !(k = a.next()).done; )
      (k = k.value), (f = e + N(k, g++)), (h += O(k, b, c, f, d))
  else if ('object' === k)
    throw (
      ((b = '' + a),
      Error(
        z$3(
          31,
          '[object Object]' === b
            ? 'object with keys {' + Object.keys(a).join(', ') + '}'
            : b
        )
      ))
    )
  return h
}
function P(a, b, c) {
  if (null == a) return a
  var e = [],
    d = 0
  O(a, e, '', '', function (a) {
    return b.call(c, a, d++)
  })
  return e
}
function Q(a) {
  if (-1 === a._status) {
    var b = a._result
    b = b()
    a._status = 0
    a._result = b
    b.then(
      function (b) {
        0 === a._status && ((b = b.default), (a._status = 1), (a._result = b))
      },
      function (b) {
        0 === a._status && ((a._status = 2), (a._result = b))
      }
    )
  }
  if (1 === a._status) return a._result
  throw a._result
}
var R = { current: null }
function S() {
  var a = R.current
  if (null === a) throw Error(z$3(321))
  return a
}
var T = {
  ReactCurrentDispatcher: R,
  ReactCurrentBatchConfig: { transition: 0 },
  ReactCurrentOwner: G$1,
  IsSomeRendererActing: { current: !1 },
  assign: l$3
}
react_production_min.Children = {
  map: P,
  forEach: function (a, b, c) {
    P(
      a,
      function () {
        b.apply(this, arguments)
      },
      c
    )
  },
  count: function (a) {
    var b = 0
    P(a, function () {
      b++
    })
    return b
  },
  toArray: function (a) {
    return (
      P(a, function (a) {
        return a
      }) || []
    )
  },
  only: function (a) {
    if (!L(a)) throw Error(z$3(143))
    return a
  }
}
react_production_min.Component = C$1
react_production_min.PureComponent = E$1
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T
react_production_min.cloneElement = function (a, b, c) {
  if (null === a || void 0 === a) throw Error(z$3(267, a))
  var e = l$3({}, a.props),
    d = a.key,
    k = a.ref,
    h = a._owner
  if (null != b) {
    void 0 !== b.ref && ((k = b.ref), (h = G$1.current))
    void 0 !== b.key && (d = '' + b.key)
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps
    for (f in b)
      H$1.call(b, f) &&
        !I$1.hasOwnProperty(f) &&
        (e[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f])
  }
  var f = arguments.length - 2
  if (1 === f) e.children = c
  else if (1 < f) {
    g = Array(f)
    for (var m = 0; m < f; m++) g[m] = arguments[m + 2]
    e.children = g
  }
  return { $$typeof: n$3, type: a.type, key: d, ref: k, props: e, _owner: h }
}
react_production_min.createContext = function (a, b) {
  void 0 === b && (b = null)
  a = {
    $$typeof: r$3,
    _calculateChangedBits: b,
    _currentValue: a,
    _currentValue2: a,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  }
  a.Provider = { $$typeof: q$3, _context: a }
  return (a.Consumer = a)
}
react_production_min.createElement = J
react_production_min.createFactory = function (a) {
  var b = J.bind(null, a)
  b.type = a
  return b
}
react_production_min.createRef = function () {
  return { current: null }
}
react_production_min.forwardRef = function (a) {
  return { $$typeof: t$2, render: a }
}
react_production_min.isValidElement = L
react_production_min.lazy = function (a) {
  return { $$typeof: v$3, _payload: { _status: -1, _result: a }, _init: Q }
}
react_production_min.memo = function (a, b) {
  return { $$typeof: u$1, type: a, compare: void 0 === b ? null : b }
}
react_production_min.useCallback = function (a, b) {
  return S().useCallback(a, b)
}
react_production_min.useContext = function (a, b) {
  return S().useContext(a, b)
}
react_production_min.useDebugValue = function () {}
react_production_min.useEffect = function (a, b) {
  return S().useEffect(a, b)
}
react_production_min.useImperativeHandle = function (a, b, c) {
  return S().useImperativeHandle(a, b, c)
}
react_production_min.useLayoutEffect = function (a, b) {
  return S().useLayoutEffect(a, b)
}
react_production_min.useMemo = function (a, b) {
  return S().useMemo(a, b)
}
react_production_min.useReducer = function (a, b, c) {
  return S().useReducer(a, b, c)
}
react_production_min.useRef = function (a) {
  return S().useRef(a)
}
react_production_min.useState = function (a) {
  return S().useState(a)
}
react_production_min.version = '17.0.2'

var react_development = {}

/** @license React v17.0.2
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

;(function (exports) {
  if (process.env.NODE_ENV !== 'production') {
    ;(function () {
      var _assign = require$$1__default['default']

      // TODO: this is special because it gets imported during build.
      var ReactVersion = '17.0.2'

      // ATTENTION
      // When adding new symbols to this file,
      // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
      // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.
      var REACT_ELEMENT_TYPE = 0xeac7
      var REACT_PORTAL_TYPE = 0xeaca
      exports.Fragment = 0xeacb
      exports.StrictMode = 0xeacc
      exports.Profiler = 0xead2
      var REACT_PROVIDER_TYPE = 0xeacd
      var REACT_CONTEXT_TYPE = 0xeace
      var REACT_FORWARD_REF_TYPE = 0xead0
      exports.Suspense = 0xead1
      var REACT_SUSPENSE_LIST_TYPE = 0xead8
      var REACT_MEMO_TYPE = 0xead3
      var REACT_LAZY_TYPE = 0xead4
      var REACT_BLOCK_TYPE = 0xead9
      var REACT_SERVER_BLOCK_TYPE = 0xeada
      var REACT_FUNDAMENTAL_TYPE = 0xead5
      var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1
      var REACT_LEGACY_HIDDEN_TYPE = 0xeae3

      if (typeof Symbol === 'function' && Symbol.for) {
        var symbolFor = Symbol.for
        REACT_ELEMENT_TYPE = symbolFor('react.element')
        REACT_PORTAL_TYPE = symbolFor('react.portal')
        exports.Fragment = symbolFor('react.fragment')
        exports.StrictMode = symbolFor('react.strict_mode')
        exports.Profiler = symbolFor('react.profiler')
        REACT_PROVIDER_TYPE = symbolFor('react.provider')
        REACT_CONTEXT_TYPE = symbolFor('react.context')
        REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref')
        exports.Suspense = symbolFor('react.suspense')
        REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list')
        REACT_MEMO_TYPE = symbolFor('react.memo')
        REACT_LAZY_TYPE = symbolFor('react.lazy')
        REACT_BLOCK_TYPE = symbolFor('react.block')
        REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block')
        REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental')
        symbolFor('react.scope')
        symbolFor('react.opaque.id')
        REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode')
        symbolFor('react.offscreen')
        REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden')
      }

      var MAYBE_ITERATOR_SYMBOL =
        typeof Symbol === 'function' && Symbol.iterator
      var FAUX_ITERATOR_SYMBOL = '@@iterator'
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== 'object') {
          return null
        }

        var maybeIterator =
          (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
          maybeIterable[FAUX_ITERATOR_SYMBOL]

        if (typeof maybeIterator === 'function') {
          return maybeIterator
        }

        return null
      }

      /**
       * Keeps track of the current dispatcher.
       */
      var ReactCurrentDispatcher = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }

      /**
       * Keeps track of the current batch's configuration such as how long an update
       * should suspend for if it needs to.
       */
      var ReactCurrentBatchConfig = {
        transition: 0
      }

      /**
       * Keeps track of the current owner.
       *
       * The current owner is the component who should own any components that are
       * currently being constructed.
       */
      var ReactCurrentOwner = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }

      var ReactDebugCurrentFrame = {}
      var currentExtraStackFrame = null
      function setExtraStackFrame(stack) {
        {
          currentExtraStackFrame = stack
        }
      }

      {
        ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
          {
            currentExtraStackFrame = stack
          }
        } // Stack implementation injected by the current renderer.

        ReactDebugCurrentFrame.getCurrentStack = null

        ReactDebugCurrentFrame.getStackAddendum = function () {
          var stack = '' // Add an extra top frame while an element is being validated

          if (currentExtraStackFrame) {
            stack += currentExtraStackFrame
          } // Delegate to the injected renderer-specific implementation

          var impl = ReactDebugCurrentFrame.getCurrentStack

          if (impl) {
            stack += impl() || ''
          }

          return stack
        }
      }

      /**
       * Used by act() to track whether you're inside an act() scope.
       */
      var IsSomeRendererActing = {
        current: false
      }

      var ReactSharedInternals = {
        ReactCurrentDispatcher: ReactCurrentDispatcher,
        ReactCurrentBatchConfig: ReactCurrentBatchConfig,
        ReactCurrentOwner: ReactCurrentOwner,
        IsSomeRendererActing: IsSomeRendererActing,
        // Used by renderers to avoid bundling object-assign twice in UMD bundles:
        assign: _assign
      }

      {
        ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame
      }

      // by calls to these methods by a Babel plugin.
      //
      // In PROD (or in packages without access to React internals),
      // they are left as they are instead.

      function warn(format) {
        {
          for (
            var _len = arguments.length,
              args = new Array(_len > 1 ? _len - 1 : 0),
              _key = 1;
            _key < _len;
            _key++
          ) {
            args[_key - 1] = arguments[_key]
          }

          printWarning('warn', format, args)
        }
      }
      function error(format) {
        {
          for (
            var _len2 = arguments.length,
              args = new Array(_len2 > 1 ? _len2 - 1 : 0),
              _key2 = 1;
            _key2 < _len2;
            _key2++
          ) {
            args[_key2 - 1] = arguments[_key2]
          }

          printWarning('error', format, args)
        }
      }

      function printWarning(level, format, args) {
        // When changing this logic, you might want to also
        // update consoleWithStackDev.www.js as well.
        {
          var ReactDebugCurrentFrame =
            ReactSharedInternals.ReactDebugCurrentFrame
          var stack = ReactDebugCurrentFrame.getStackAddendum()

          if (stack !== '') {
            format += '%s'
            args = args.concat([stack])
          }

          var argsWithFormat = args.map(function (item) {
            return '' + item
          }) // Careful: RN currently depends on this prefix

          argsWithFormat.unshift('Warning: ' + format) // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610
          // eslint-disable-next-line react-internal/no-production-logging

          Function.prototype.apply.call(console[level], console, argsWithFormat)
        }
      }

      var didWarnStateUpdateForUnmountedComponent = {}

      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor
          var componentName =
            (_constructor && (_constructor.displayName || _constructor.name)) ||
            'ReactClass'
          var warningKey = componentName + '.' + callerName

          if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
            return
          }

          error(
            "Can't call %s on a component that is not yet mounted. " +
              'This is a no-op, but it might indicate a bug in your application. ' +
              'Instead, assign to `this.state` directly or define a `state = {};` ' +
              'class property with the desired state in the %s component.',
            callerName,
            componentName
          )

          didWarnStateUpdateForUnmountedComponent[warningKey] = true
        }
      }
      /**
       * This is the abstract API for an update queue.
       */

      var ReactNoopUpdateQueue = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function (publicInstance) {
          return false
        },

        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function (publicInstance, callback, callerName) {
          warnNoop(publicInstance, 'forceUpdate')
        },

        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function (
          publicInstance,
          completeState,
          callback,
          callerName
        ) {
          warnNoop(publicInstance, 'replaceState')
        },

        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function (
          publicInstance,
          partialState,
          callback,
          callerName
        ) {
          warnNoop(publicInstance, 'setState')
        }
      }

      var emptyObject = {}

      {
        Object.freeze(emptyObject)
      }
      /**
       * Base class helpers for the updating state of a component.
       */

      function Component(props, context, updater) {
        this.props = props
        this.context = context // If a component has string refs, we will assign a different object later.

        this.refs = emptyObject // We initialize the default updater but the real one gets injected by the
        // renderer.

        this.updater = updater || ReactNoopUpdateQueue
      }

      Component.prototype.isReactComponent = {}
      /**
       * Sets a subset of the state. Always use this to mutate
       * state. You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * There is no guarantee that calls to `setState` will run synchronously,
       * as they may eventually be batched together.  You can provide an optional
       * callback that will be executed when the call to setState is actually
       * completed.
       *
       * When a function is provided to setState, it will be called at some point in
       * the future (not synchronously). It will be called with the up to date
       * component arguments (state, props, context). These values can be different
       * from this.* because your function may be called after receiveProps but before
       * shouldComponentUpdate, and this new state, props, and context will not yet be
       * assigned to this.
       *
       * @param {object|function} partialState Next partial state or function to
       *        produce next partial state to be merged with current state.
       * @param {?function} callback Called after state is updated.
       * @final
       * @protected
       */

      Component.prototype.setState = function (partialState, callback) {
        if (
          !(
            typeof partialState === 'object' ||
            typeof partialState === 'function' ||
            partialState == null
          )
        ) {
          {
            throw Error(
              'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
            )
          }
        }

        this.updater.enqueueSetState(this, partialState, callback, 'setState')
      }
      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {?function} callback Called after update is complete.
       * @final
       * @protected
       */

      Component.prototype.forceUpdate = function (callback) {
        this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
      }
      /**
       * Deprecated APIs. These APIs used to exist on classic React classes but since
       * we would like to deprecate them, we're not going to move them over to this
       * modern base class. Instead, we define a getter that warns if it's accessed.
       */

      {
        var deprecatedAPIs = {
          isMounted: [
            'isMounted',
            'Instead, make sure to clean up subscriptions and pending requests in ' +
              'componentWillUnmount to prevent memory leaks.'
          ],
          replaceState: [
            'replaceState',
            'Refactor your code to use setState instead (see ' +
              'https://github.com/facebook/react/issues/3236).'
          ]
        }

        var defineDeprecationWarning = function (methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function () {
              warn(
                '%s(...) is deprecated in plain JavaScript React classes. %s',
                info[0],
                info[1]
              )

              return undefined
            }
          })
        }

        for (var fnName in deprecatedAPIs) {
          if (deprecatedAPIs.hasOwnProperty(fnName)) {
            defineDeprecationWarning(fnName, deprecatedAPIs[fnName])
          }
        }
      }

      function ComponentDummy() {}

      ComponentDummy.prototype = Component.prototype
      /**
       * Convenience component with default shallow equality check for sCU.
       */

      function PureComponent(props, context, updater) {
        this.props = props
        this.context = context // If a component has string refs, we will assign a different object later.

        this.refs = emptyObject
        this.updater = updater || ReactNoopUpdateQueue
      }

      var pureComponentPrototype = (PureComponent.prototype =
        new ComponentDummy())
      pureComponentPrototype.constructor = PureComponent // Avoid an extra prototype jump for these methods.

      _assign(pureComponentPrototype, Component.prototype)

      pureComponentPrototype.isPureReactComponent = true

      // an immutable object with a single mutable value
      function createRef() {
        var refObject = {
          current: null
        }

        {
          Object.seal(refObject)
        }

        return refObject
      }

      function getWrappedName(outerType, innerType, wrapperName) {
        var functionName = innerType.displayName || innerType.name || ''
        return (
          outerType.displayName ||
          (functionName !== ''
            ? wrapperName + '(' + functionName + ')'
            : wrapperName)
        )
      }

      function getContextName(type) {
        return type.displayName || 'Context'
      }

      function getComponentName(type) {
        if (type == null) {
          // Host root, text node or just invalid type.
          return null
        }

        {
          if (typeof type.tag === 'number') {
            error(
              'Received an unexpected object in getComponentName(). ' +
                'This is likely a bug in React. Please file an issue.'
            )
          }
        }

        if (typeof type === 'function') {
          return type.displayName || type.name || null
        }

        if (typeof type === 'string') {
          return type
        }

        switch (type) {
          case exports.Fragment:
            return 'Fragment'

          case REACT_PORTAL_TYPE:
            return 'Portal'

          case exports.Profiler:
            return 'Profiler'

          case exports.StrictMode:
            return 'StrictMode'

          case exports.Suspense:
            return 'Suspense'

          case REACT_SUSPENSE_LIST_TYPE:
            return 'SuspenseList'
        }

        if (typeof type === 'object') {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type
              return getContextName(context) + '.Consumer'

            case REACT_PROVIDER_TYPE:
              var provider = type
              return getContextName(provider._context) + '.Provider'

            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, 'ForwardRef')

            case REACT_MEMO_TYPE:
              return getComponentName(type.type)

            case REACT_BLOCK_TYPE:
              return getComponentName(type._render)

            case REACT_LAZY_TYPE: {
              var lazyComponent = type
              var payload = lazyComponent._payload
              var init = lazyComponent._init

              try {
                return getComponentName(init(payload))
              } catch (x) {
                return null
              }
            }
          }
        }

        return null
      }

      var hasOwnProperty = Object.prototype.hasOwnProperty
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      }
      var specialPropKeyWarningShown,
        specialPropRefWarningShown,
        didWarnAboutStringRefs

      {
        didWarnAboutStringRefs = {}
      }

      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get

            if (getter && getter.isReactWarning) {
              return false
            }
          }
        }

        return config.ref !== undefined
      }

      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get

            if (getter && getter.isReactWarning) {
              return false
            }
          }
        }

        return config.key !== undefined
      }

      function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function () {
          {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true

              error(
                '%s: `key` is not a prop. Trying to access it will result ' +
                  'in `undefined` being returned. If you need to access the same ' +
                  'value within the child component, you should pass it as a different ' +
                  'prop. (https://reactjs.org/link/special-props)',
                displayName
              )
            }
          }
        }

        warnAboutAccessingKey.isReactWarning = true
        Object.defineProperty(props, 'key', {
          get: warnAboutAccessingKey,
          configurable: true
        })
      }

      function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function () {
          {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true

              error(
                '%s: `ref` is not a prop. Trying to access it will result ' +
                  'in `undefined` being returned. If you need to access the same ' +
                  'value within the child component, you should pass it as a different ' +
                  'prop. (https://reactjs.org/link/special-props)',
                displayName
              )
            }
          }
        }

        warnAboutAccessingRef.isReactWarning = true
        Object.defineProperty(props, 'ref', {
          get: warnAboutAccessingRef,
          configurable: true
        })
      }

      function warnIfStringRefCannotBeAutoConverted(config) {
        {
          if (
            typeof config.ref === 'string' &&
            ReactCurrentOwner.current &&
            config.__self &&
            ReactCurrentOwner.current.stateNode !== config.__self
          ) {
            var componentName = getComponentName(ReactCurrentOwner.current.type)

            if (!didWarnAboutStringRefs[componentName]) {
              error(
                'Component "%s" contains the string ref "%s". ' +
                  'Support for string refs will be removed in a future major release. ' +
                  'This case cannot be automatically converted to an arrow function. ' +
                  'We ask you to manually fix this case by using useRef() or createRef() instead. ' +
                  'Learn more about using refs safely here: ' +
                  'https://reactjs.org/link/strict-mode-string-ref',
                componentName,
                config.ref
              )

              didWarnAboutStringRefs[componentName] = true
            }
          }
        }
      }
      /**
       * Factory method to create a new React element. This no longer adheres to
       * the class pattern, so do not use new to call it. Also, instanceof check
       * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
       * if something is a React Element.
       *
       * @param {*} type
       * @param {*} props
       * @param {*} key
       * @param {string|object} ref
       * @param {*} owner
       * @param {*} self A *temporary* helper to detect places where `this` is
       * different from the `owner` when React.createElement is called, so that we
       * can warn. We want to get rid of owner and replace string `ref`s with arrow
       * functions, and as long as `this` and owner are the same, there will be no
       * change in behavior.
       * @param {*} source An annotation object (added by a transpiler or otherwise)
       * indicating filename, line number, and/or other information.
       * @internal
       */

      var ReactElement = function (type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,
          // Record the component responsible for creating this element.
          _owner: owner
        }

        {
          // The validation flag is currently mutative. We put it on
          // an external backing store so that we can freeze the whole object.
          // This can be replaced with a WeakMap once they are implemented in
          // commonly used development environments.
          element._store = {} // To make comparing ReactElements easier for testing purposes, we make
          // the validation flag non-enumerable (where possible, which should
          // include every environment we run tests in), so the test framework
          // ignores it.

          Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          }) // self and source are DEV only properties.

          Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          }) // Two elements created in two different places should be considered
          // equal for testing purposes and therefore we hide it from enumeration.

          Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          })

          if (Object.freeze) {
            Object.freeze(element.props)
            Object.freeze(element)
          }
        }

        return element
      }
      /**
       * Create and return a new ReactElement of the given type.
       * See https://reactjs.org/docs/react-api.html#createelement
       */

      function createElement(type, config, children) {
        var propName // Reserved names are extracted

        var props = {}
        var key = null
        var ref = null
        var self = null
        var source = null

        if (config != null) {
          if (hasValidRef(config)) {
            ref = config.ref

            {
              warnIfStringRefCannotBeAutoConverted(config)
            }
          }

          if (hasValidKey(config)) {
            key = '' + config.key
          }

          self = config.__self === undefined ? null : config.__self
          source = config.__source === undefined ? null : config.__source // Remaining properties are added to a new props object

          for (propName in config) {
            if (
              hasOwnProperty.call(config, propName) &&
              !RESERVED_PROPS.hasOwnProperty(propName)
            ) {
              props[propName] = config[propName]
            }
          }
        } // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.

        var childrenLength = arguments.length - 2

        if (childrenLength === 1) {
          props.children = children
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength)

          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2]
          }

          {
            if (Object.freeze) {
              Object.freeze(childArray)
            }
          }

          props.children = childArray
        } // Resolve default props

        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps

          for (propName in defaultProps) {
            if (props[propName] === undefined) {
              props[propName] = defaultProps[propName]
            }
          }
        }

        {
          if (key || ref) {
            var displayName =
              typeof type === 'function'
                ? type.displayName || type.name || 'Unknown'
                : type

            if (key) {
              defineKeyPropWarningGetter(props, displayName)
            }

            if (ref) {
              defineRefPropWarningGetter(props, displayName)
            }
          }
        }

        return ReactElement(
          type,
          key,
          ref,
          self,
          source,
          ReactCurrentOwner.current,
          props
        )
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        var newElement = ReactElement(
          oldElement.type,
          newKey,
          oldElement.ref,
          oldElement._self,
          oldElement._source,
          oldElement._owner,
          oldElement.props
        )
        return newElement
      }
      /**
       * Clone and return a new ReactElement using element as the starting point.
       * See https://reactjs.org/docs/react-api.html#cloneelement
       */

      function cloneElement(element, config, children) {
        if (!!(element === null || element === undefined)) {
          {
            throw Error(
              'React.cloneElement(...): The argument must be a React element, but you passed ' +
                element +
                '.'
            )
          }
        }

        var propName // Original props are copied

        var props = _assign({}, element.props) // Reserved names are extracted

        var key = element.key
        var ref = element.ref // Self is preserved since the owner is preserved.

        var self = element._self // Source is preserved since cloneElement is unlikely to be targeted by a
        // transpiler, and the original source is probably a better indicator of the
        // true owner.

        var source = element._source // Owner will be preserved, unless ref is overridden

        var owner = element._owner

        if (config != null) {
          if (hasValidRef(config)) {
            // Silently steal the ref from the parent.
            ref = config.ref
            owner = ReactCurrentOwner.current
          }

          if (hasValidKey(config)) {
            key = '' + config.key
          } // Remaining properties override existing props

          var defaultProps

          if (element.type && element.type.defaultProps) {
            defaultProps = element.type.defaultProps
          }

          for (propName in config) {
            if (
              hasOwnProperty.call(config, propName) &&
              !RESERVED_PROPS.hasOwnProperty(propName)
            ) {
              if (
                config[propName] === undefined &&
                defaultProps !== undefined
              ) {
                // Resolve default props
                props[propName] = defaultProps[propName]
              } else {
                props[propName] = config[propName]
              }
            }
          }
        } // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.

        var childrenLength = arguments.length - 2

        if (childrenLength === 1) {
          props.children = children
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength)

          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2]
          }

          props.children = childArray
        }

        return ReactElement(element.type, key, ref, self, source, owner, props)
      }
      /**
       * Verifies the object is a ReactElement.
       * See https://reactjs.org/docs/react-api.html#isvalidelement
       * @param {?object} object
       * @return {boolean} True if `object` is a ReactElement.
       * @final
       */

      function isValidElement(object) {
        return (
          typeof object === 'object' &&
          object !== null &&
          object.$$typeof === REACT_ELEMENT_TYPE
        )
      }

      var SEPARATOR = '.'
      var SUBSEPARATOR = ':'
      /**
       * Escape and wrap key so it is safe to use as a reactid
       *
       * @param {string} key to be escaped.
       * @return {string} the escaped key.
       */

      function escape(key) {
        var escapeRegex = /[=:]/g
        var escaperLookup = {
          '=': '=0',
          ':': '=2'
        }
        var escapedString = key.replace(escapeRegex, function (match) {
          return escaperLookup[match]
        })
        return '$' + escapedString
      }
      /**
       * TODO: Test that a single child and an array with one item have the same key
       * pattern.
       */

      var didWarnAboutMaps = false
      var userProvidedKeyEscapeRegex = /\/+/g

      function escapeUserProvidedKey(text) {
        return text.replace(userProvidedKeyEscapeRegex, '$&/')
      }
      /**
       * Generate a key string that identifies a element within a set.
       *
       * @param {*} element A element that could contain a manual key.
       * @param {number} index Index that is used if a manual key is not provided.
       * @return {string}
       */

      function getElementKey(element, index) {
        // Do some typechecking here since we call this blindly. We want to ensure
        // that we don't block potential future ES APIs.
        if (
          typeof element === 'object' &&
          element !== null &&
          element.key != null
        ) {
          // Explicit key
          return escape('' + element.key)
        } // Implicit key determined by the index in the set

        return index.toString(36)
      }

      function mapIntoArray(
        children,
        array,
        escapedPrefix,
        nameSoFar,
        callback
      ) {
        var type = typeof children

        if (type === 'undefined' || type === 'boolean') {
          // All of the above are perceived as null.
          children = null
        }

        var invokeCallback = false

        if (children === null) {
          invokeCallback = true
        } else {
          switch (type) {
            case 'string':
            case 'number':
              invokeCallback = true
              break

            case 'object':
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true
              }
          }
        }

        if (invokeCallback) {
          var _child = children
          var mappedChild = callback(_child) // If it's the only child, treat the name as if it was wrapped in an array
          // so that it's consistent if the number of children grows:

          var childKey =
            nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar

          if (Array.isArray(mappedChild)) {
            var escapedChildKey = ''

            if (childKey != null) {
              escapedChildKey = escapeUserProvidedKey(childKey) + '/'
            }

            mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
              return c
            })
          } else if (mappedChild != null) {
            if (isValidElement(mappedChild)) {
              mappedChild = cloneAndReplaceKey(
                mappedChild, // Keep both the (mapped) and old keys if they differ, just as
                // traverseAllChildren used to do for objects as children
                escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                  (mappedChild.key &&
                  (!_child || _child.key !== mappedChild.key) // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                    ? escapeUserProvidedKey('' + mappedChild.key) + '/'
                    : '') +
                  childKey
              )
            }

            array.push(mappedChild)
          }

          return 1
        }

        var child
        var nextName
        var subtreeCount = 0 // Count of children found in the current subtree.

        var nextNamePrefix =
          nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR

        if (Array.isArray(children)) {
          for (var i = 0; i < children.length; i++) {
            child = children[i]
            nextName = nextNamePrefix + getElementKey(child, i)
            subtreeCount += mapIntoArray(
              child,
              array,
              escapedPrefix,
              nextName,
              callback
            )
          }
        } else {
          var iteratorFn = getIteratorFn(children)

          if (typeof iteratorFn === 'function') {
            var iterableChildren = children

            {
              // Warn about using Maps as children
              if (iteratorFn === iterableChildren.entries) {
                if (!didWarnAboutMaps) {
                  warn(
                    'Using Maps as children is not supported. ' +
                      'Use an array of keyed ReactElements instead.'
                  )
                }

                didWarnAboutMaps = true
              }
            }

            var iterator = iteratorFn.call(iterableChildren)
            var step
            var ii = 0

            while (!(step = iterator.next()).done) {
              child = step.value
              nextName = nextNamePrefix + getElementKey(child, ii++)
              subtreeCount += mapIntoArray(
                child,
                array,
                escapedPrefix,
                nextName,
                callback
              )
            }
          } else if (type === 'object') {
            var childrenString = '' + children

            {
              {
                throw Error(
                  'Objects are not valid as a React child (found: ' +
                    (childrenString === '[object Object]'
                      ? 'object with keys {' +
                        Object.keys(children).join(', ') +
                        '}'
                      : childrenString) +
                    '). If you meant to render a collection of children, use an array instead.'
                )
              }
            }
          }
        }

        return subtreeCount
      }

      /**
       * Maps children that are typically specified as `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrenmap
       *
       * The provided mapFunction(child, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} func The map function.
       * @param {*} context Context for mapFunction.
       * @return {object} Object containing the ordered map of results.
       */
      function mapChildren(children, func, context) {
        if (children == null) {
          return children
        }

        var result = []
        var count = 0
        mapIntoArray(children, result, '', '', function (child) {
          return func.call(context, child, count++)
        })
        return result
      }
      /**
       * Count the number of children that are typically specified as
       * `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrencount
       *
       * @param {?*} children Children tree container.
       * @return {number} The number of children.
       */

      function countChildren(children) {
        var n = 0
        mapChildren(children, function () {
          n++ // Don't return anything
        })
        return n
      }

      /**
       * Iterates through children that are typically specified as `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
       *
       * The provided forEachFunc(child, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} forEachFunc
       * @param {*} forEachContext Context for forEachContext.
       */
      function forEachChildren(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function () {
            forEachFunc.apply(this, arguments) // Don't return anything.
          },
          forEachContext
        )
      }
      /**
       * Flatten a children object (typically specified as `props.children`) and
       * return an array with appropriately re-keyed children.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
       */

      function toArray(children) {
        return (
          mapChildren(children, function (child) {
            return child
          }) || []
        )
      }
      /**
       * Returns the first child in a collection of children and verifies that there
       * is only one child in the collection.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrenonly
       *
       * The current implementation of this function assumes that a single child gets
       * passed without a wrapper, but the purpose of this helper function is to
       * abstract away the particular structure of children.
       *
       * @param {?object} children Child collection structure.
       * @return {ReactElement} The first and only `ReactElement` contained in the
       * structure.
       */

      function onlyChild(children) {
        if (!isValidElement(children)) {
          {
            throw Error(
              'React.Children.only expected to receive a single React element child.'
            )
          }
        }

        return children
      }

      function createContext(defaultValue, calculateChangedBits) {
        if (calculateChangedBits === undefined) {
          calculateChangedBits = null
        } else {
          {
            if (
              calculateChangedBits !== null &&
              typeof calculateChangedBits !== 'function'
            ) {
              error(
                'createContext: Expected the optional second argument to be a ' +
                  'function. Instead received: %s',
                calculateChangedBits
              )
            }
          }
        }

        var context = {
          $$typeof: REACT_CONTEXT_TYPE,
          _calculateChangedBits: calculateChangedBits,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null
        }
        context.Provider = {
          $$typeof: REACT_PROVIDER_TYPE,
          _context: context
        }
        var hasWarnedAboutUsingNestedContextConsumers = false
        var hasWarnedAboutUsingConsumerProvider = false
        var hasWarnedAboutDisplayNameOnConsumer = false

        {
          // A separate object, but proxies back to the original context object for
          // backwards compatibility. It has a different $$typeof, so we can properly
          // warn for the incorrect usage of Context as a Consumer.
          var Consumer = {
            $$typeof: REACT_CONTEXT_TYPE,
            _context: context,
            _calculateChangedBits: context._calculateChangedBits
          } // $FlowFixMe: Flow complains about not setting a value, which is intentional here

          Object.defineProperties(Consumer, {
            Provider: {
              get: function () {
                if (!hasWarnedAboutUsingConsumerProvider) {
                  hasWarnedAboutUsingConsumerProvider = true

                  error(
                    'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' +
                      'a future major release. Did you mean to render <Context.Provider> instead?'
                  )
                }

                return context.Provider
              },
              set: function (_Provider) {
                context.Provider = _Provider
              }
            },
            _currentValue: {
              get: function () {
                return context._currentValue
              },
              set: function (_currentValue) {
                context._currentValue = _currentValue
              }
            },
            _currentValue2: {
              get: function () {
                return context._currentValue2
              },
              set: function (_currentValue2) {
                context._currentValue2 = _currentValue2
              }
            },
            _threadCount: {
              get: function () {
                return context._threadCount
              },
              set: function (_threadCount) {
                context._threadCount = _threadCount
              }
            },
            Consumer: {
              get: function () {
                if (!hasWarnedAboutUsingNestedContextConsumers) {
                  hasWarnedAboutUsingNestedContextConsumers = true

                  error(
                    'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' +
                      'a future major release. Did you mean to render <Context.Consumer> instead?'
                  )
                }

                return context.Consumer
              }
            },
            displayName: {
              get: function () {
                return context.displayName
              },
              set: function (displayName) {
                if (!hasWarnedAboutDisplayNameOnConsumer) {
                  warn(
                    'Setting `displayName` on Context.Consumer has no effect. ' +
                      "You should set it directly on the context with Context.displayName = '%s'.",
                    displayName
                  )

                  hasWarnedAboutDisplayNameOnConsumer = true
                }
              }
            }
          }) // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

          context.Consumer = Consumer
        }

        {
          context._currentRenderer = null
          context._currentRenderer2 = null
        }

        return context
      }

      var Uninitialized = -1
      var Pending = 0
      var Resolved = 1
      var Rejected = 2

      function lazyInitializer(payload) {
        if (payload._status === Uninitialized) {
          var ctor = payload._result
          var thenable = ctor() // Transition to the next state.

          var pending = payload
          pending._status = Pending
          pending._result = thenable
          thenable.then(
            function (moduleObject) {
              if (payload._status === Pending) {
                var defaultExport = moduleObject.default

                {
                  if (defaultExport === undefined) {
                    error(
                      'lazy: Expected the result of a dynamic import() call. ' +
                        'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
                        'const MyComponent = lazy(() => imp' +
                        "ort('./MyComponent'))",
                      moduleObject
                    )
                  }
                } // Transition to the next state.

                var resolved = payload
                resolved._status = Resolved
                resolved._result = defaultExport
              }
            },
            function (error) {
              if (payload._status === Pending) {
                // Transition to the next state.
                var rejected = payload
                rejected._status = Rejected
                rejected._result = error
              }
            }
          )
        }

        if (payload._status === Resolved) {
          return payload._result
        } else {
          throw payload._result
        }
      }

      function lazy(ctor) {
        var payload = {
          // We use these fields to store the result.
          _status: -1,
          _result: ctor
        }
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: payload,
          _init: lazyInitializer
        }

        {
          // In production, this would just set it on the object.
          var defaultProps
          var propTypes // $FlowFixMe

          Object.defineProperties(lazyType, {
            defaultProps: {
              configurable: true,
              get: function () {
                return defaultProps
              },
              set: function (newDefaultProps) {
                error(
                  'React.lazy(...): It is not supported to assign `defaultProps` to ' +
                    'a lazy component import. Either specify them where the component ' +
                    'is defined, or create a wrapping component around it.'
                )

                defaultProps = newDefaultProps // Match production behavior more closely:
                // $FlowFixMe

                Object.defineProperty(lazyType, 'defaultProps', {
                  enumerable: true
                })
              }
            },
            propTypes: {
              configurable: true,
              get: function () {
                return propTypes
              },
              set: function (newPropTypes) {
                error(
                  'React.lazy(...): It is not supported to assign `propTypes` to ' +
                    'a lazy component import. Either specify them where the component ' +
                    'is defined, or create a wrapping component around it.'
                )

                propTypes = newPropTypes // Match production behavior more closely:
                // $FlowFixMe

                Object.defineProperty(lazyType, 'propTypes', {
                  enumerable: true
                })
              }
            }
          })
        }

        return lazyType
      }

      function forwardRef(render) {
        {
          if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
            error(
              'forwardRef requires a render function but received a `memo` ' +
                'component. Instead of forwardRef(memo(...)), use ' +
                'memo(forwardRef(...)).'
            )
          } else if (typeof render !== 'function') {
            error(
              'forwardRef requires a render function but was given %s.',
              render === null ? 'null' : typeof render
            )
          } else {
            if (render.length !== 0 && render.length !== 2) {
              error(
                'forwardRef render functions accept exactly two parameters: props and ref. %s',
                render.length === 1
                  ? 'Did you forget to use the ref parameter?'
                  : 'Any additional parameter will be undefined.'
              )
            }
          }

          if (render != null) {
            if (render.defaultProps != null || render.propTypes != null) {
              error(
                'forwardRef render functions do not support propTypes or defaultProps. ' +
                  'Did you accidentally pass a React component?'
              )
            }
          }
        }

        var elementType = {
          $$typeof: REACT_FORWARD_REF_TYPE,
          render: render
        }

        {
          var ownName
          Object.defineProperty(elementType, 'displayName', {
            enumerable: false,
            configurable: true,
            get: function () {
              return ownName
            },
            set: function (name) {
              ownName = name

              if (render.displayName == null) {
                render.displayName = name
              }
            }
          })
        }

        return elementType
      }

      // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

      var enableScopeAPI = false // Experimental Create Event Handle API.

      function isValidElementType(type) {
        if (typeof type === 'string' || typeof type === 'function') {
          return true
        } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

        if (
          type === exports.Fragment ||
          type === exports.Profiler ||
          type === REACT_DEBUG_TRACING_MODE_TYPE ||
          type === exports.StrictMode ||
          type === exports.Suspense ||
          type === REACT_SUSPENSE_LIST_TYPE ||
          type === REACT_LEGACY_HIDDEN_TYPE ||
          enableScopeAPI
        ) {
          return true
        }

        if (typeof type === 'object' && type !== null) {
          if (
            type.$$typeof === REACT_LAZY_TYPE ||
            type.$$typeof === REACT_MEMO_TYPE ||
            type.$$typeof === REACT_PROVIDER_TYPE ||
            type.$$typeof === REACT_CONTEXT_TYPE ||
            type.$$typeof === REACT_FORWARD_REF_TYPE ||
            type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
            type.$$typeof === REACT_BLOCK_TYPE ||
            type[0] === REACT_SERVER_BLOCK_TYPE
          ) {
            return true
          }
        }

        return false
      }

      function memo(type, compare) {
        {
          if (!isValidElementType(type)) {
            error(
              'memo: The first argument must be a component. Instead ' +
                'received: %s',
              type === null ? 'null' : typeof type
            )
          }
        }

        var elementType = {
          $$typeof: REACT_MEMO_TYPE,
          type: type,
          compare: compare === undefined ? null : compare
        }

        {
          var ownName
          Object.defineProperty(elementType, 'displayName', {
            enumerable: false,
            configurable: true,
            get: function () {
              return ownName
            },
            set: function (name) {
              ownName = name

              if (type.displayName == null) {
                type.displayName = name
              }
            }
          })
        }

        return elementType
      }

      function resolveDispatcher() {
        var dispatcher = ReactCurrentDispatcher.current

        if (!(dispatcher !== null)) {
          {
            throw Error(
              'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.'
            )
          }
        }

        return dispatcher
      }

      function useContext(Context, unstable_observedBits) {
        var dispatcher = resolveDispatcher()

        {
          if (unstable_observedBits !== undefined) {
            error(
              'useContext() second argument is reserved for future ' +
                'use in React. Passing it is not supported. ' +
                'You passed: %s.%s',
              unstable_observedBits,
              typeof unstable_observedBits === 'number' &&
                Array.isArray(arguments[2])
                ? '\n\nDid you call array.map(useContext)? ' +
                    'Calling Hooks inside a loop is not supported. ' +
                    'Learn more at https://reactjs.org/link/rules-of-hooks'
                : ''
            )
          } // TODO: add a more generic warning for invalid values.

          if (Context._context !== undefined) {
            var realContext = Context._context // Don't deduplicate because this legitimately causes bugs
            // and nobody should be using this in existing code.

            if (realContext.Consumer === Context) {
              error(
                'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' +
                  'removed in a future major release. Did you mean to call useContext(Context) instead?'
              )
            } else if (realContext.Provider === Context) {
              error(
                'Calling useContext(Context.Provider) is not supported. ' +
                  'Did you mean to call useContext(Context) instead?'
              )
            }
          }
        }

        return dispatcher.useContext(Context, unstable_observedBits)
      }
      function useState(initialState) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useState(initialState)
      }
      function useReducer(reducer, initialArg, init) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useReducer(reducer, initialArg, init)
      }
      function useRef(initialValue) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useRef(initialValue)
      }
      function useEffect(create, deps) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useEffect(create, deps)
      }
      function useLayoutEffect(create, deps) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useLayoutEffect(create, deps)
      }
      function useCallback(callback, deps) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useCallback(callback, deps)
      }
      function useMemo(create, deps) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useMemo(create, deps)
      }
      function useImperativeHandle(ref, create, deps) {
        var dispatcher = resolveDispatcher()
        return dispatcher.useImperativeHandle(ref, create, deps)
      }
      function useDebugValue(value, formatterFn) {
        {
          var dispatcher = resolveDispatcher()
          return dispatcher.useDebugValue(value, formatterFn)
        }
      }

      // Helpers to patch console.logs to avoid logging during side-effect free
      // replaying on render function. This currently only patches the object
      // lazily which won't cover if the log function was extracted eagerly.
      // We could also eagerly patch the method.
      var disabledDepth = 0
      var prevLog
      var prevInfo
      var prevWarn
      var prevError
      var prevGroup
      var prevGroupCollapsed
      var prevGroupEnd

      function disabledLog() {}

      disabledLog.__reactDisabledLog = true
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            /* eslint-disable react-internal/no-production-logging */
            prevLog = console.log
            prevInfo = console.info
            prevWarn = console.warn
            prevError = console.error
            prevGroup = console.group
            prevGroupCollapsed = console.groupCollapsed
            prevGroupEnd = console.groupEnd // https://github.com/facebook/react/issues/19099

            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            } // $FlowFixMe Flow thinks console is immutable.

            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            })
            /* eslint-enable react-internal/no-production-logging */
          }

          disabledDepth++
        }
      }
      function reenableLogs() {
        {
          disabledDepth--

          if (disabledDepth === 0) {
            /* eslint-disable react-internal/no-production-logging */
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            } // $FlowFixMe Flow thinks console is immutable.

            Object.defineProperties(console, {
              log: _assign({}, props, {
                value: prevLog
              }),
              info: _assign({}, props, {
                value: prevInfo
              }),
              warn: _assign({}, props, {
                value: prevWarn
              }),
              error: _assign({}, props, {
                value: prevError
              }),
              group: _assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: _assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: _assign({}, props, {
                value: prevGroupEnd
              })
            })
            /* eslint-enable react-internal/no-production-logging */
          }

          if (disabledDepth < 0) {
            error(
              'disabledDepth fell below zero. ' +
                'This is a bug in React. Please file an issue.'
            )
          }
        }
      }

      var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher
      var prefix
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === undefined) {
            // Extract the VM specific prefix used by each line.
            try {
              throw Error()
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/)
              prefix = (match && match[1]) || ''
            }
          } // We use the prefix to ensure our stacks line up with native stack frames.

          return '\n' + prefix + name
        }
      }
      var reentry = false
      var componentFrameCache

      {
        var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map
        componentFrameCache = new PossiblyWeakMap()
      }

      function describeNativeComponentFrame(fn, construct) {
        // If something asked for a stack inside a fake render, it should get ignored.
        if (!fn || reentry) {
          return ''
        }

        {
          var frame = componentFrameCache.get(fn)

          if (frame !== undefined) {
            return frame
          }
        }

        var control
        reentry = true
        var previousPrepareStackTrace = Error.prepareStackTrace // $FlowFixMe It does accept undefined.

        Error.prepareStackTrace = undefined
        var previousDispatcher

        {
          previousDispatcher = ReactCurrentDispatcher$1.current // Set the dispatcher in DEV because this might be call in the render function
          // for warnings.

          ReactCurrentDispatcher$1.current = null
          disableLogs()
        }

        try {
          // This should throw.
          if (construct) {
            // Something should be setting the props in the constructor.
            var Fake = function () {
              throw Error()
            } // $FlowFixMe

            Object.defineProperty(Fake.prototype, 'props', {
              set: function () {
                // We use a throwing setter instead of frozen or non-writable props
                // because that won't throw in a non-strict mode function.
                throw Error()
              }
            })

            if (typeof Reflect === 'object' && Reflect.construct) {
              // We construct a different control for this case to include any extra
              // frames added by the construct call.
              try {
                Reflect.construct(Fake, [])
              } catch (x) {
                control = x
              }

              Reflect.construct(fn, [], Fake)
            } else {
              try {
                Fake.call()
              } catch (x) {
                control = x
              }

              fn.call(Fake.prototype)
            }
          } else {
            try {
              throw Error()
            } catch (x) {
              control = x
            }

            fn()
          }
        } catch (sample) {
          // This is inlined manually because closure doesn't do it for us.
          if (sample && control && typeof sample.stack === 'string') {
            // This extracts the first frame from the sample that isn't also in the control.
            // Skipping one frame that we assume is the frame that calls the two.
            var sampleLines = sample.stack.split('\n')
            var controlLines = control.stack.split('\n')
            var s = sampleLines.length - 1
            var c = controlLines.length - 1

            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              // We expect at least one stack frame to be shared.
              // Typically this will be the root most one. However, stack frames may be
              // cut off due to maximum stack limits. In this case, one maybe cut off
              // earlier than the other. We assume that the sample is longer or the same
              // and there for cut off earlier. So we should find the root most frame in
              // the sample somewhere in the control.
              c--
            }

            for (; s >= 1 && c >= 0; s--, c--) {
              // Next we find the first one that isn't the same which should be the
              // frame that called our sample function and the control.
              if (sampleLines[s] !== controlLines[c]) {
                // In V8, the first line is describing the message but other VMs don't.
                // If we're about to return the first line, and the control is also on the same
                // line, that's a pretty good indicator that our sample threw at same line as
                // the control. I.e. before we entered the sample frame. So we ignore this result.
                // This can happen if you passed a class to function component, or non-function.
                if (s !== 1 || c !== 1) {
                  do {
                    s--
                    c-- // We may still have similar intermediate frames from the construct call.
                    // The next one that isn't the same should be our match though.

                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                      var _frame =
                        '\n' + sampleLines[s].replace(' at new ', ' at ')

                      {
                        if (typeof fn === 'function') {
                          componentFrameCache.set(fn, _frame)
                        }
                      } // Return the line we found.

                      return _frame
                    }
                  } while (s >= 1 && c >= 0)
                }

                break
              }
            }
          }
        } finally {
          reentry = false

          {
            ReactCurrentDispatcher$1.current = previousDispatcher
            reenableLogs()
          }

          Error.prepareStackTrace = previousPrepareStackTrace
        } // Fallback to just using the name if we couldn't make it throw.

        var name = fn ? fn.displayName || fn.name : ''
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : ''

        {
          if (typeof fn === 'function') {
            componentFrameCache.set(fn, syntheticFrame)
          }
        }

        return syntheticFrame
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false)
        }
      }

      function shouldConstruct(Component) {
        var prototype = Component.prototype
        return !!(prototype && prototype.isReactComponent)
      }

      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return ''
        }

        if (typeof type === 'function') {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type))
          }
        }

        if (typeof type === 'string') {
          return describeBuiltInComponentFrame(type)
        }

        switch (type) {
          case exports.Suspense:
            return describeBuiltInComponentFrame('Suspense')

          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame('SuspenseList')
        }

        if (typeof type === 'object') {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render)

            case REACT_MEMO_TYPE:
              // Memo may contain any component type so we recursively resolve it.
              return describeUnknownElementTypeFrameInDEV(
                type.type,
                source,
                ownerFn
              )

            case REACT_BLOCK_TYPE:
              return describeFunctionComponentFrame(type._render)

            case REACT_LAZY_TYPE: {
              var lazyComponent = type
              var payload = lazyComponent._payload
              var init = lazyComponent._init

              try {
                // Lazy may contain any component type so we recursively resolve it.
                return describeUnknownElementTypeFrameInDEV(
                  init(payload),
                  source,
                  ownerFn
                )
              } catch (x) {}
            }
          }
        }

        return ''
      }

      var loggedTypeFailures = {}
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame

      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner
            var stack = describeUnknownElementTypeFrameInDEV(
              element.type,
              element._source,
              owner ? owner.type : null
            )
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack)
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null)
          }
        }
      }

      function checkPropTypes(
        typeSpecs,
        values,
        location,
        componentName,
        element
      ) {
        {
          // $FlowFixMe This is okay but Flow doesn't know it.
          var has = Function.call.bind(Object.prototype.hasOwnProperty)

          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0 // Prop type validation may throw. In case they do, we don't want to
              // fail the render phase where it didn't fail before. So we log it.
              // After these have been cleaned up, we'll let them throw.

              try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                if (typeof typeSpecs[typeSpecName] !== 'function') {
                  var err = Error(
                    (componentName || 'React class') +
                      ': ' +
                      location +
                      ' type `' +
                      typeSpecName +
                      '` is invalid; ' +
                      'it must be a function, usually from the `prop-types` package, but received `' +
                      typeof typeSpecs[typeSpecName] +
                      '`.' +
                      'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
                  )
                  err.name = 'Invariant Violation'
                  throw err
                }

                error$1 = typeSpecs[typeSpecName](
                  values,
                  typeSpecName,
                  componentName,
                  location,
                  null,
                  'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
                )
              } catch (ex) {
                error$1 = ex
              }

              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element)

                error(
                  '%s: type specification of %s' +
                    ' `%s` is invalid; the type checker ' +
                    'function must return `null` or an `Error` but returned a %s. ' +
                    'You may have forgotten to pass an argument to the type checker ' +
                    'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                    'shape all require an argument).',
                  componentName || 'React class',
                  location,
                  typeSpecName,
                  typeof error$1
                )

                setCurrentlyValidatingElement(null)
              }

              if (
                error$1 instanceof Error &&
                !(error$1.message in loggedTypeFailures)
              ) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error$1.message] = true
                setCurrentlyValidatingElement(element)

                error('Failed %s type: %s', location, error$1.message)

                setCurrentlyValidatingElement(null)
              }
            }
          }
        }
      }

      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner
            var stack = describeUnknownElementTypeFrameInDEV(
              element.type,
              element._source,
              owner ? owner.type : null
            )
            setExtraStackFrame(stack)
          } else {
            setExtraStackFrame(null)
          }
        }
      }

      var propTypesMisspellWarningShown

      {
        propTypesMisspellWarningShown = false
      }

      function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
          var name = getComponentName(ReactCurrentOwner.current.type)

          if (name) {
            return '\n\nCheck the render method of `' + name + '`.'
          }
        }

        return ''
      }

      function getSourceInfoErrorAddendum(source) {
        if (source !== undefined) {
          var fileName = source.fileName.replace(/^.*[\\\/]/, '')
          var lineNumber = source.lineNumber
          return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.'
        }

        return ''
      }

      function getSourceInfoErrorAddendumForProps(elementProps) {
        if (elementProps !== null && elementProps !== undefined) {
          return getSourceInfoErrorAddendum(elementProps.__source)
        }

        return ''
      }
      /**
       * Warn if there's no key explicitly set on dynamic arrays of children or
       * object keys are not valid. This allows us to keep track of children between
       * updates.
       */

      var ownerHasKeyUseWarning = {}

      function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum()

        if (!info) {
          var parentName =
            typeof parentType === 'string'
              ? parentType
              : parentType.displayName || parentType.name

          if (parentName) {
            info =
              '\n\nCheck the top-level render call using <' + parentName + '>.'
          }
        }

        return info
      }
      /**
       * Warn if the element doesn't have an explicit key assigned to it.
       * This element is in an array. The array could grow and shrink or be
       * reordered. All children that haven't already been validated are required to
       * have a "key" property assigned to it. Error statuses are cached so a warning
       * will only be shown once.
       *
       * @internal
       * @param {ReactElement} element Element that requires a key.
       * @param {*} parentType element's parent's type.
       */

      function validateExplicitKey(element, parentType) {
        if (
          !element._store ||
          element._store.validated ||
          element.key != null
        ) {
          return
        }

        element._store.validated = true
        var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType)

        if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
          return
        }

        ownerHasKeyUseWarning[currentComponentErrorInfo] = true // Usually the current owner is the offender, but if it accepts children as a
        // property, it may be the creator of the child that's responsible for
        // assigning it a key.

        var childOwner = ''

        if (
          element &&
          element._owner &&
          element._owner !== ReactCurrentOwner.current
        ) {
          // Give the component that originally created this child.
          childOwner =
            ' It was passed a child from ' +
            getComponentName(element._owner.type) +
            '.'
        }

        {
          setCurrentlyValidatingElement$1(element)

          error(
            'Each child in a list should have a unique "key" prop.' +
              '%s%s See https://reactjs.org/link/warning-keys for more information.',
            currentComponentErrorInfo,
            childOwner
          )

          setCurrentlyValidatingElement$1(null)
        }
      }
      /**
       * Ensure that every element either is passed in a static location, in an
       * array with an explicit keys property defined, or in an object literal
       * with valid key property.
       *
       * @internal
       * @param {ReactNode} node Statically passed child of any type.
       * @param {*} parentType node's parent's type.
       */

      function validateChildKeys(node, parentType) {
        if (typeof node !== 'object') {
          return
        }

        if (Array.isArray(node)) {
          for (var i = 0; i < node.length; i++) {
            var child = node[i]

            if (isValidElement(child)) {
              validateExplicitKey(child, parentType)
            }
          }
        } else if (isValidElement(node)) {
          // This element was passed in a valid location.
          if (node._store) {
            node._store.validated = true
          }
        } else if (node) {
          var iteratorFn = getIteratorFn(node)

          if (typeof iteratorFn === 'function') {
            // Entry iterators used to provide implicit keys,
            // but now we print a separate warning for them later.
            if (iteratorFn !== node.entries) {
              var iterator = iteratorFn.call(node)
              var step

              while (!(step = iterator.next()).done) {
                if (isValidElement(step.value)) {
                  validateExplicitKey(step.value, parentType)
                }
              }
            }
          }
        }
      }
      /**
       * Given an element, validate that its props follow the propTypes definition,
       * provided by the type.
       *
       * @param {ReactElement} element
       */

      function validatePropTypes(element) {
        {
          var type = element.type

          if (type === null || type === undefined || typeof type === 'string') {
            return
          }

          var propTypes

          if (typeof type === 'function') {
            propTypes = type.propTypes
          } else if (
            typeof type === 'object' &&
            (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
              // Inner props are checked in the reconciler.
              type.$$typeof === REACT_MEMO_TYPE)
          ) {
            propTypes = type.propTypes
          } else {
            return
          }

          if (propTypes) {
            // Intentionally inside to avoid triggering lazy initializers:
            var name = getComponentName(type)
            checkPropTypes(propTypes, element.props, 'prop', name, element)
          } else if (
            type.PropTypes !== undefined &&
            !propTypesMisspellWarningShown
          ) {
            propTypesMisspellWarningShown = true // Intentionally inside to avoid triggering lazy initializers:

            var _name = getComponentName(type)

            error(
              'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?',
              _name || 'Unknown'
            )
          }

          if (
            typeof type.getDefaultProps === 'function' &&
            !type.getDefaultProps.isReactClassApproved
          ) {
            error(
              'getDefaultProps is only used on classic React.createClass ' +
                'definitions. Use a static property named `defaultProps` instead.'
            )
          }
        }
      }
      /**
       * Given a fragment, validate that it can only be provided with fragment props
       * @param {ReactElement} fragment
       */

      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props)

          for (var i = 0; i < keys.length; i++) {
            var key = keys[i]

            if (key !== 'children' && key !== 'key') {
              setCurrentlyValidatingElement$1(fragment)

              error(
                'Invalid prop `%s` supplied to `React.Fragment`. ' +
                  'React.Fragment can only have `key` and `children` props.',
                key
              )

              setCurrentlyValidatingElement$1(null)
              break
            }
          }

          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment)

            error('Invalid attribute `ref` supplied to `React.Fragment`.')

            setCurrentlyValidatingElement$1(null)
          }
        }
      }
      function createElementWithValidation(type, props, children) {
        var validType = isValidElementType(type) // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.

        if (!validType) {
          var info = ''

          if (
            type === undefined ||
            (typeof type === 'object' &&
              type !== null &&
              Object.keys(type).length === 0)
          ) {
            info +=
              ' You likely forgot to export your component from the file ' +
              "it's defined in, or you might have mixed up default and named imports."
          }

          var sourceInfo = getSourceInfoErrorAddendumForProps(props)

          if (sourceInfo) {
            info += sourceInfo
          } else {
            info += getDeclarationErrorAddendum()
          }

          var typeString

          if (type === null) {
            typeString = 'null'
          } else if (Array.isArray(type)) {
            typeString = 'array'
          } else if (
            type !== undefined &&
            type.$$typeof === REACT_ELEMENT_TYPE
          ) {
            typeString =
              '<' + (getComponentName(type.type) || 'Unknown') + ' />'
            info =
              ' Did you accidentally export a JSX literal instead of a component?'
          } else {
            typeString = typeof type
          }

          {
            error(
              'React.createElement: type is invalid -- expected a string (for ' +
                'built-in components) or a class/function (for composite ' +
                'components) but got: %s.%s',
              typeString,
              info
            )
          }
        }

        var element = createElement.apply(this, arguments) // The result can be nullish if a mock or a custom function is used.
        // TODO: Drop this when these are no longer allowed as the type argument.

        if (element == null) {
          return element
        } // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing errors.
        // We don't want exception behavior to differ between dev and prod.
        // (Rendering will throw with a helpful message and as soon as the type is
        // fixed, the key warnings will appear.)

        if (validType) {
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], type)
          }
        }

        if (type === exports.Fragment) {
          validateFragmentProps(element)
        } else {
          validatePropTypes(element)
        }

        return element
      }
      var didWarnAboutDeprecatedCreateFactory = false
      function createFactoryWithValidation(type) {
        var validatedFactory = createElementWithValidation.bind(null, type)
        validatedFactory.type = type

        {
          if (!didWarnAboutDeprecatedCreateFactory) {
            didWarnAboutDeprecatedCreateFactory = true

            warn(
              'React.createFactory() is deprecated and will be removed in ' +
                'a future major release. Consider using JSX ' +
                'or use React.createElement() directly instead.'
            )
          } // Legacy hook: remove it

          Object.defineProperty(validatedFactory, 'type', {
            enumerable: false,
            get: function () {
              warn(
                'Factory.type is deprecated. Access the class directly ' +
                  'before passing it to createFactory.'
              )

              Object.defineProperty(this, 'type', {
                value: type
              })
              return type
            }
          })
        }

        return validatedFactory
      }
      function cloneElementWithValidation(element, props, children) {
        var newElement = cloneElement.apply(this, arguments)

        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], newElement.type)
        }

        validatePropTypes(newElement)
        return newElement
      }

      {
        try {
          var frozenObject = Object.freeze({})
          /* eslint-disable no-new */

          new Map([[frozenObject, null]])
          new Set([frozenObject])
          /* eslint-enable no-new */
        } catch (e) {}
      }

      var createElement$1 = createElementWithValidation
      var cloneElement$1 = cloneElementWithValidation
      var createFactory = createFactoryWithValidation
      var Children = {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray: toArray,
        only: onlyChild
      }

      exports.Children = Children
      exports.Component = Component
      exports.PureComponent = PureComponent
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
        ReactSharedInternals
      exports.cloneElement = cloneElement$1
      exports.createContext = createContext
      exports.createElement = createElement$1
      exports.createFactory = createFactory
      exports.createRef = createRef
      exports.forwardRef = forwardRef
      exports.isValidElement = isValidElement
      exports.lazy = lazy
      exports.memo = memo
      exports.useCallback = useCallback
      exports.useContext = useContext
      exports.useDebugValue = useDebugValue
      exports.useEffect = useEffect
      exports.useImperativeHandle = useImperativeHandle
      exports.useLayoutEffect = useLayoutEffect
      exports.useMemo = useMemo
      exports.useReducer = useReducer
      exports.useRef = useRef
      exports.useState = useState
      exports.version = ReactVersion
    })()
  }
})(react_development)

if (process.env.NODE_ENV === 'production') {
  react.exports = react_production_min
} else {
  react.exports = react_development
}

var React$1 = react.exports

function memoize$1(fn) {
  var cache = Object.create(null)
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg)
    return cache[arg]
  }
}

var reactPropsRegex =
  /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/ // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */ memoize$1(
  function (prop) {
    return (
      reactPropsRegex.test(prop) ||
      (prop.charCodeAt(0) === 111 &&
        /* o */
        prop.charCodeAt(1) === 110 &&
        /* n */
        prop.charCodeAt(2) < 91)
    )
  }
  /* Z+1 */
)

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */

  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i]
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style')
  tag.setAttribute('data-emotion', options.key)

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce)
  }

  tag.appendChild(document.createTextNode(''))
  tag.setAttribute('data-s', '')
  return tag
}

var StyleSheet = /*#__PURE__*/ (function () {
  function StyleSheet(options) {
    var _this = this

    this._insertTag = function (tag) {
      var before

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling
        } else if (_this.prepend) {
          before = _this.container.firstChild
        } else {
          before = _this.before
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling
      }

      _this.container.insertBefore(tag, before)

      _this.tags.push(tag)
    }

    this.isSpeedy =
      options.speedy === undefined
        ? process.env.NODE_ENV === 'production'
        : options.speedy
    this.tags = []
    this.ctr = 0
    this.nonce = options.nonce // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key
    this.container = options.container
    this.prepend = options.prepend
    this.insertionPoint = options.insertionPoint
    this.before = null
  }

  var _proto = StyleSheet.prototype

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag)
  }

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this))
    }

    var tag = this.tags[this.tags.length - 1]

    if (process.env.NODE_ENV !== 'production') {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error(
          "You're attempting to insert the following rule:\n" +
            rule +
            '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.'
        )
      }
      this._alreadyInsertedOrderInsensitiveRule =
        this._alreadyInsertedOrderInsensitiveRule || !isImportRule
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag)

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length)
      } catch (e) {
        if (
          process.env.NODE_ENV !== 'production' &&
          !/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear){/.test(
            rule
          )
        ) {
          console.error(
            'There was a problem inserting the following rule: "' + rule + '"',
            e
          )
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule))
    }

    this.ctr++
  }

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode && tag.parentNode.removeChild(tag)
    })
    this.tags = []
    this.ctr = 0

    if (process.env.NODE_ENV !== 'production') {
      this._alreadyInsertedOrderInsensitiveRule = false
    }
  }

  return StyleSheet
})()

var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'
var IMPORT = '@import'
var KEYFRAMES = '@keyframes'

/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash(value, length) {
  return (
    (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^
      charat(value, 2)) <<
      2) ^
    charat(value, 3)
  )
}

/**
 * @param {string} value
 * @return {string}
 */
function trim(value) {
  return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} value
 * @return {number}
 */
function indexof(value, search) {
  return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat(value, index) {
  return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr(value, begin, end) {
  return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen(value) {
  return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof(value) {
  return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append(value, array) {
  return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine(array, callback) {
  return array.map(callback).join('')
}

var line = 1
var column = 1
var length = 0
var position$1 = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string} type
 * @param {string[]} props
 * @param {object[]} children
 * @param {number} length
 */
function node(value, root, parent, type, props, children, length) {
  return {
    value: value,
    root: root,
    parent: parent,
    type: type,
    props: props,
    children: children,
    line: line,
    column: column,
    length: length,
    return: ''
  }
}

/**
 * @param {string} value
 * @param {object} root
 * @param {string} type
 */
function copy(value, root, type) {
  return node(value, root.root, root.parent, type, root.props, root.children, 0)
}

/**
 * @return {number}
 */
function char() {
  return character
}

/**
 * @return {number}
 */
function prev() {
  character = position$1 > 0 ? charat(characters, --position$1) : 0

  if ((column--, character === 10)) (column = 1), line--

  return character
}

/**
 * @return {number}
 */
function next() {
  character = position$1 < length ? charat(characters, position$1++) : 0

  if ((column++, character === 10)) (column = 1), line++

  return character
}

/**
 * @return {number}
 */
function peek() {
  return charat(characters, position$1)
}

/**
 * @return {number}
 */
function caret() {
  return position$1
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice(begin, end) {
  return substr(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token(type) {
  switch (type) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4
    // : accompanied token
    case 58:
      return 3
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1
  }

  return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc(value) {
  return (
    (line = column = 1),
    (length = strlen((characters = value))),
    (position$1 = 0),
    []
  )
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc(value) {
  return (characters = ''), value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit(type) {
  return trim(
    slice(
      position$1 - 1,
      delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)
    )
  )
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace(type) {
  while ((character = peek()))
    if (character < 33) next()
    else break

  return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping(index, count) {
  while (--count && next())
    // not 0-9 A-F a-f
    if (
      character < 48 ||
      character > 102 ||
      (character > 57 && character < 65) ||
      (character > 70 && character < 97)
    )
      break

  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter(type) {
  while (next())
    switch (character) {
      // ] ) " '
      case type:
        return position$1
      // " '
      case 34:
      case 39:
        return delimiter(type === 34 || type === 39 ? type : character)
      // (
      case 40:
        if (type === 41) delimiter(type)
        break
      // \
      case 92:
        next()
        break
    }

  return position$1
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter(type, index) {
  while (next())
    // //
    if (type + character === 47 + 10) break
    // /*
    else if (type + character === 42 + 42 && peek() === 47) break

  return (
    '/*' +
    slice(index, position$1 - 1) +
    '*' +
    from(type === 47 ? type : next())
  )
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier(index) {
  while (!token(peek())) next()

  return slice(index, position$1)
}

/**
 * @param {string} value
 * @return {object[]}
 */
function compile(value) {
  return dealloc(
    parse('', null, null, null, [''], (value = alloc(value)), 0, [0], value)
  )
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse(
  value,
  root,
  parent,
  rule,
  rules,
  rulesets,
  pseudo,
  points,
  declarations
) {
  var index = 0
  var offset = 0
  var length = pseudo
  var atrule = 0
  var property = 0
  var previous = 0
  var variable = 1
  var scanning = 1
  var ampersand = 1
  var character = 0
  var type = ''
  var props = rules
  var children = rulesets
  var reference = rule
  var characters = type

  while (scanning)
    switch (((previous = character), (character = next()))) {
      // " ' [ (
      case 34:
      case 39:
      case 91:
      case 40:
        characters += delimit(character)
        break
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        characters += whitespace(previous)
        break
      // \
      case 92:
        characters += escaping(caret() - 1, 7)
        continue
      // /
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(
              comment(commenter(next(), caret()), root, parent),
              declarations
            )
            break
          default:
            characters += '/'
        }
        break
      // {
      case 123 * variable:
        points[index++] = strlen(characters) * ampersand
      // } ; \0
      case 125 * variable:
      case 59:
      case 0:
        switch (character) {
          // \0 }
          case 0:
          case 125:
            scanning = 0
          // ;
          case 59 + offset:
            if (property > 0 && strlen(characters) - length)
              append(
                property > 32
                  ? declaration(characters + ';', rule, parent, length - 1)
                  : declaration(
                      replace(characters, ' ', '') + ';',
                      rule,
                      parent,
                      length - 2
                    ),
                declarations
              )
            break
          // @ ;
          case 59:
            characters += ';'
          // { rule/at-rule
          default:
            append(
              (reference = ruleset(
                characters,
                root,
                parent,
                index,
                offset,
                rules,
                points,
                type,
                (props = []),
                (children = []),
                length
              )),
              rulesets
            )

            if (character === 123)
              if (offset === 0)
                parse(
                  characters,
                  root,
                  reference,
                  reference,
                  props,
                  rulesets,
                  length,
                  points,
                  children
                )
              else
                switch (atrule) {
                  // d m s
                  case 100:
                  case 109:
                  case 115:
                    parse(
                      value,
                      reference,
                      reference,
                      rule &&
                        append(
                          ruleset(
                            value,
                            reference,
                            reference,
                            0,
                            0,
                            rules,
                            points,
                            type,
                            rules,
                            (props = []),
                            length
                          ),
                          children
                        ),
                      rules,
                      children,
                      length,
                      points,
                      rule ? props : children
                    )
                    break
                  default:
                    parse(
                      characters,
                      reference,
                      reference,
                      reference,
                      [''],
                      children,
                      length,
                      points,
                      children
                    )
                }
        }

        ;(index = offset = property = 0),
          (variable = ampersand = 1),
          (type = characters = ''),
          (length = pseudo)
        break
      // :
      case 58:
        ;(length = 1 + strlen(characters)), (property = previous)
      default:
        if (variable < 1)
          if (character == 123) --variable
          else if (character == 125 && variable++ == 0 && prev() == 125)
            continue

        switch (((characters += from(character)), character * variable)) {
          // &
          case 38:
            ampersand = offset > 0 ? 1 : ((characters += '\f'), -1)
            break
          // ,
          case 44:
            ;(points[index++] = (strlen(characters) - 1) * ampersand),
              (ampersand = 1)
            break
          // @
          case 64:
            // -
            if (peek() === 45) characters += delimit(next())

            ;(atrule = peek()),
              (offset = strlen((type = characters += identifier(caret())))),
              character++
            break
          // -
          case 45:
            if (previous === 45 && strlen(characters) == 2) variable = 0
        }
    }

  return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset(
  value,
  root,
  parent,
  index,
  offset,
  rules,
  points,
  type,
  props,
  children,
  length
) {
  var post = offset - 1
  var rule = offset === 0 ? rules : ['']
  var size = sizeof(rule)

  for (var i = 0, j = 0, k = 0; i < index; ++i)
    for (
      var x = 0,
        y = substr(value, post + 1, (post = abs((j = points[i])))),
        z = value;
      x < size;
      ++x
    )
      if ((z = trim(j > 0 ? rule[x] + ' ' + y : replace(y, /&\f/g, rule[x]))))
        props[k++] = z

  return node(
    value,
    root,
    parent,
    offset === 0 ? RULESET : type,
    props,
    children,
    length
  )
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment(value, root, parent) {
  return node(
    value,
    root,
    parent,
    COMMENT,
    from(char()),
    substr(value, 2, -2),
    0
  )
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration(value, root, parent, length) {
  return node(
    value,
    root,
    parent,
    DECLARATION,
    substr(value, 0, length),
    substr(value, length + 1, -1),
    length
  )
}

/**
 * @param {string} value
 * @param {number} length
 * @return {string}
 */
function prefix(value, length) {
  switch (hash(value, length)) {
    // color-adjust
    case 5103:
      return WEBKIT + 'print-' + value + value
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value
    // appearance, user-select, transform, hyphens, text-size-adjust
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value
    // flex, flex-direction
    case 6828:
    case 4268:
      return WEBKIT + value + MS + value + value
    // order
    case 6165:
      return WEBKIT + value + MS + 'flex-' + value + value
    // align-items
    case 5187:
      return (
        WEBKIT +
        value +
        replace(
          value,
          /(\w+).+(:[^]+)/,
          WEBKIT + 'box-$1$2' + MS + 'flex-$1$2'
        ) +
        value
      )
    // align-self
    case 5443:
      return (
        WEBKIT +
        value +
        MS +
        'flex-item-' +
        replace(value, /flex-|-self/, '') +
        value
      )
    // align-content
    case 4675:
      return (
        WEBKIT +
        value +
        MS +
        'flex-line-pack' +
        replace(value, /align-content|flex-|-self/, '') +
        value
      )
    // flex-shrink
    case 5548:
      return WEBKIT + value + MS + replace(value, 'shrink', 'negative') + value
    // flex-basis
    case 5292:
      return (
        WEBKIT + value + MS + replace(value, 'basis', 'preferred-size') + value
      )
    // flex-grow
    case 6060:
      return (
        WEBKIT +
        'box-' +
        replace(value, '-grow', '') +
        WEBKIT +
        value +
        MS +
        replace(value, 'grow', 'positive') +
        value
      )
    // transition
    case 4554:
      return (
        WEBKIT +
        replace(value, /([^-])(transform)/g, '$1' + WEBKIT + '$2') +
        value
      )
    // cursor
    case 6187:
      return (
        replace(
          replace(
            replace(value, /(zoom-|grab)/, WEBKIT + '$1'),
            /(image-set)/,
            WEBKIT + '$1'
          ),
          value,
          ''
        ) + value
      )
    // background, background-image
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + '$1' + '$`$1')
    // justify-content
    case 4968:
      return (
        replace(
          replace(
            value,
            /(.+:)(flex-)?(.*)/,
            WEBKIT + 'box-pack:$3' + MS + 'flex-pack:$3'
          ),
          /s.+-b[^;]+/,
          'justify'
        ) +
        WEBKIT +
        value +
        value
      )
    // (margin|padding)-inline-(start|end)
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + '$1$2') + value
    // (min|max)?(width|height|inline-size|block-size)
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if (strlen(value) - 1 - length > 6)
        switch (charat(value, length + 1)) {
          // (m)ax-content, (m)in-content
          case 109:
            // -
            if (charat(value, length + 4) !== 45) break
          // (f)ill-available, (f)it-content
          case 102:
            return (
              replace(
                value,
                /(.+:)(.+)-([^]+)/,
                '$1' +
                  WEBKIT +
                  '$2-$3' +
                  '$1' +
                  MOZ +
                  (charat(value, length + 3) == 108 ? '$3' : '$2-$3')
              ) + value
            )
          // (s)tretch
          case 115:
            return ~indexof(value, 'stretch')
              ? prefix(replace(value, 'stretch', 'fill-available'), length) +
                  value
              : value
        }
      break
    // position: sticky
    case 4949:
      // (s)ticky?
      if (charat(value, length + 1) !== 115) break
    // display: (flex|inline-flex)
    case 6444:
      switch (
        charat(value, strlen(value) - 3 - (~indexof(value, '!important') && 10))
      ) {
        // stic(k)y
        case 107:
          return replace(value, ':', ':' + WEBKIT) + value
        // (inline-)?fl(e)x
        case 101:
          return (
            replace(
              value,
              /(.+:)([^;!]+)(;|!.+)?/,
              '$1' +
                WEBKIT +
                (charat(value, 14) === 45 ? 'inline-' : '') +
                'box$3' +
                '$1' +
                WEBKIT +
                '$2$3' +
                '$1' +
                MS +
                '$2box$3'
            ) + value
          )
      }
      break
    // writing-mode
    case 5936:
      switch (charat(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return (
            WEBKIT +
            value +
            MS +
            replace(value, /[svh]\w+-[tblr]{2}/, 'tb') +
            value
          )
        // vertical-r(l)
        case 108:
          return (
            WEBKIT +
            value +
            MS +
            replace(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') +
            value
          )
        // horizontal(-)tb
        case 45:
          return (
            WEBKIT +
            value +
            MS +
            replace(value, /[svh]\w+-[tblr]{2}/, 'lr') +
            value
          )
      }

      return WEBKIT + value + MS + value + value
  }

  return value
}

/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize(children, callback) {
  var output = ''
  var length = sizeof(children)

  for (var i = 0; i < length; i++)
    output += callback(children[i], i, children, callback) || ''

  return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify(element, index, children, callback) {
  switch (element.type) {
    case IMPORT:
    case DECLARATION:
      return (element.return = element.return || element.value)
    case COMMENT:
      return ''
    case RULESET:
      element.value = element.props.join(',')
  }

  return strlen((children = serialize(element.children, callback)))
    ? (element.return = element.value + '{' + children + '}')
    : ''
}

/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware(collection) {
  var length = sizeof(collection)

  return function (element, index, children, callback) {
    var output = ''

    for (var i = 0; i < length; i++)
      output += collection[i](element, index, children, callback) || ''

    return output
  }
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet(callback) {
  return function (element) {
    if (!element.root) if ((element = element.return)) callback(element)
  }
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer(element, index, children, callback) {
  if (!element.return)
    switch (element.type) {
      case DECLARATION:
        element.return = prefix(element.value, element.length)
        break
      case KEYFRAMES:
        return serialize(
          [copy(replace(element.value, '@', '@' + WEBKIT), element, '')],
          callback
        )
      case RULESET:
        if (element.length)
          return combine(element.props, function (value) {
            switch (match(value, /(::plac\w+|:read-\w+)/)) {
              // :read-(only|write)
              case ':read-only':
              case ':read-write':
                return serialize(
                  [
                    copy(
                      replace(value, /:(read-\w+)/, ':' + MOZ + '$1'),
                      element,
                      ''
                    )
                  ],
                  callback
                )
              // :placeholder
              case '::placeholder':
                return serialize(
                  [
                    copy(
                      replace(value, /:(plac\w+)/, ':' + WEBKIT + 'input-$1'),
                      element,
                      ''
                    ),
                    copy(
                      replace(value, /:(plac\w+)/, ':' + MOZ + '$1'),
                      element,
                      ''
                    ),
                    copy(
                      replace(value, /:(plac\w+)/, MS + 'input-$1'),
                      element,
                      ''
                    )
                  ],
                  callback
                )
            }

            return ''
          })
    }
}

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap()
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg)
    }

    var ret = func(arg)
    cache.set(arg, ret)
    return ret
  }
}

var last = function last(arr) {
  return arr.length ? arr[arr.length - 1] : null
} // based on https://github.com/thysultan/stylis.js/blob/e6843c373ebcbbfade25ebcc23f540ed8508da0a/src/Tokenizer.js#L239-L244

var identifierWithPointTracking = function identifierWithPointTracking(
  begin,
  points,
  index
) {
  var previous = 0
  var character = 0

  while (true) {
    previous = character
    character = peek() // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1
    }

    if (token(character)) {
      break
    }

    next()
  }

  return slice(begin, position$1)
}

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1
  var character = 44

  do {
    switch (token(character)) {
      case 0:
        // &\f
        if (character === 38 && peek() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1
        }

        parsed[index] += identifierWithPointTracking(
          position$1 - 1,
          points,
          index
        )
        break

      case 2:
        parsed[index] += delimit(character)
        break

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = peek() === 58 ? '&\f' : ''
          points[index] = parsed[index].length
          break
        }

      // fallthrough

      default:
        parsed[index] += from(character)
    }
  } while ((character = next()))

  return parsed
}

var getRules = function getRules(value, points) {
  return dealloc(toRules(alloc(value), points))
} // WeakSet would be more appropriate, but only WeakMap is supported in IE11

var fixedElements = /* #__PURE__ */ new WeakMap()
var compat = function compat(element) {
  if (
    element.type !== 'rule' ||
    !element.parent || // .length indicates if this rule contains pseudo or not
    !element.length
  ) {
    return
  }

  var value = element.value,
    parent = element.parent
  var isImplicitRule =
    element.column === parent.column && element.line === parent.line

  while (parent.type !== 'rule') {
    parent = parent.parent
    if (!parent) return
  } // short-circuit for the simplest case

  if (
    element.props.length === 1 &&
    value.charCodeAt(0) !== 58 &&
    /* colon */
    !fixedElements.get(parent)
  ) {
    return
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"

  if (isImplicitRule) {
    return
  }

  fixedElements.set(element, true)
  var points = []
  var rules = getRules(value, points)
  var parentRules = parent.props

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i]
        ? rules[i].replace(/&\f/g, parentRules[j])
        : parentRules[j] + ' ' + rules[i]
    }
  }
}
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value

    if (
      // charcode for l
      value.charCodeAt(0) === 108 && // charcode for b
      value.charCodeAt(2) === 98
    ) {
      // this ignores label
      element['return'] = ''
      element.value = ''
    }
  }
}
var ignoreFlag =
  'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason'

var isIgnoringComment = function isIgnoringComment(element) {
  return (
    !!element &&
    element.type === 'comm' &&
    element.children.indexOf(ignoreFlag) > -1
  )
}

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule') return
    var unsafePseudoClasses = element.value.match(
      /(:first|:nth|:nth-last)-child/g
    )

    if (unsafePseudoClasses && cache.compat !== true) {
      var prevElement = index > 0 ? children[index - 1] : null

      if (prevElement && isIgnoringComment(last(prevElement.children))) {
        return
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error(
          'The pseudo class "' +
            unsafePseudoClass +
            '" is potentially unsafe when doing server-side rendering. Try changing it to "' +
            unsafePseudoClass.split('-child')[0] +
            '-of-type".'
        )
      })
    }
  }
}

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64
}

var isPrependedWithRegularRules = function isPrependedWithRegularRules(
  index,
  children
) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true
    }
  }

  return false
} // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user

var nullifyElement = function nullifyElement(element) {
  element.type = ''
  element.value = ''
  element['return'] = ''
  element.children = ''
  element.props = ''
}

var incorrectImportAlarm = function incorrectImportAlarm(
  element,
  index,
  children
) {
  if (!isImportRule(element)) {
    return
  }

  if (element.parent) {
    console.error(
      "`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles."
    )
    nullifyElement(element)
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error(
      "`@import` rules can't be after other rules. Please put your `@import` rules before your other rules."
    )
    nullifyElement(element)
  }
}

var isBrowser$4 = typeof document !== 'undefined'
var getServerStylisCache = isBrowser$4
  ? undefined
  : weakMemoize(function () {
      return memoize$1(function () {
        var cache = {}
        return function (name) {
          return cache[name]
        }
      })
    })
var defaultStylisPlugins = [prefixer]

var createCache = function createCache(options) {
  var key = options.key

  if (process.env.NODE_ENV !== 'production' && !key) {
    throw new Error(
      "You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" +
        'If multiple caches share the same key they might "fight" for each other\'s style elements.'
    )
  }

  if (isBrowser$4 && key === 'css') {
    var ssrStyles = document.querySelectorAll(
      'style[data-emotion]:not([data-s])'
    ) // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion')

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return
      }
      document.head.appendChild(node)
      node.setAttribute('data-s', '')
    })
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error(
        'Emotion key must only contain lower case alphabetical characters and - but "' +
          key +
          '" was passed'
      )
    }
  }

  var inserted = {} // $FlowFixMe

  var container
  var nodesToHydrate = []

  if (isBrowser$4) {
    container = options.container || document.head
    Array.prototype.forEach.call(
      // this means we will ignore elements which don't have a space in them which
      // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
      document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
      function (node) {
        var attrib = node.getAttribute('data-emotion').split(' ') // $FlowFixMe

        for (var i = 1; i < attrib.length; i++) {
          inserted[attrib[i]] = true
        }

        nodesToHydrate.push(node)
      }
    )
  }

  var _insert

  var omnipresentPlugins = [compat, removeLabel]

  if (process.env.NODE_ENV !== 'production') {
    omnipresentPlugins.push(
      createUnsafeSelectorsAlarm({
        get compat() {
          return cache.compat
        }
      }),
      incorrectImportAlarm
    )
  }

  if (isBrowser$4) {
    var currentSheet
    var finalizingPlugins = [
      stringify,
      process.env.NODE_ENV !== 'production'
        ? function (element) {
            if (!element.root) {
              if (element['return']) {
                currentSheet.insert(element['return'])
              } else if (element.value && element.type !== COMMENT) {
                // insert empty rule in non-production environments
                // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
                currentSheet.insert(element.value + '{}')
              }
            }
          }
        : rulesheet(function (rule) {
            currentSheet.insert(rule)
          })
    ]
    var serializer = middleware(
      omnipresentPlugins.concat(stylisPlugins, finalizingPlugins)
    )

    var stylis = function stylis(styles) {
      return serialize(compile(styles), serializer)
    }

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet

      if (
        process.env.NODE_ENV !== 'production' &&
        serialized.map !== undefined
      ) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map)
          }
        }
      }

      stylis(
        selector ? selector + '{' + serialized.styles + '}' : serialized.styles
      )

      if (shouldCache) {
        cache.inserted[serialized.name] = true
      }
    }
  } else {
    var _finalizingPlugins = [stringify]

    var _serializer = middleware(
      omnipresentPlugins.concat(stylisPlugins, _finalizingPlugins)
    )

    var _stylis = function _stylis(styles) {
      return serialize(compile(styles), _serializer)
    } // $FlowFixMe

    var serverStylisCache = getServerStylisCache(stylisPlugins)(key)

    var getRules = function getRules(selector, serialized) {
      var name = serialized.name

      if (serverStylisCache[name] === undefined) {
        serverStylisCache[name] = _stylis(
          selector
            ? selector + '{' + serialized.styles + '}'
            : serialized.styles
        )
      }

      return serverStylisCache[name]
    }

    _insert = function _insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name
      var rules = getRules(selector, serialized)

      if (cache.compat === undefined) {
        // in regular mode, we don't set the styles on the inserted cache
        // since we don't need to and that would be wasting memory
        // we return them so that they are rendered in a style tag
        if (shouldCache) {
          cache.inserted[name] = true
        }

        if (
          // using === development instead of !== production
          // because if people do ssr in tests, the source maps showing up would be annoying
          process.env.NODE_ENV === 'development' &&
          serialized.map !== undefined
        ) {
          return rules + serialized.map
        }

        return rules
      } else {
        // in compat mode, we put the styles on the inserted cache so
        // that emotion-server can pull out the styles
        // except when we don't want to cache it which was in Global but now
        // is nowhere but we don't want to do a major right now
        // and just in case we're going to leave the case here
        // it's also not affecting client side bundle size
        // so it's really not a big deal
        if (shouldCache) {
          cache.inserted[name] = rules
        } else {
          return rules
        }
      }
    }
  }

  var cache = {
    key: key,
    sheet: new StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  }
  cache.sheet.hydrate(nodesToHydrate)
  return cache
}

var reactIs$3 = { exports: {} }

var reactIs_production_min$2 = {}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$2 = 'function' === typeof Symbol && Symbol.for,
  c$2 = b$2 ? Symbol.for('react.element') : 60103,
  d$2 = b$2 ? Symbol.for('react.portal') : 60106,
  e$2 = b$2 ? Symbol.for('react.fragment') : 60107,
  f$2 = b$2 ? Symbol.for('react.strict_mode') : 60108,
  g$2 = b$2 ? Symbol.for('react.profiler') : 60114,
  h$2 = b$2 ? Symbol.for('react.provider') : 60109,
  k$2 = b$2 ? Symbol.for('react.context') : 60110,
  l$2 = b$2 ? Symbol.for('react.async_mode') : 60111,
  m$2 = b$2 ? Symbol.for('react.concurrent_mode') : 60111,
  n$2 = b$2 ? Symbol.for('react.forward_ref') : 60112,
  p$2 = b$2 ? Symbol.for('react.suspense') : 60113,
  q$2 = b$2 ? Symbol.for('react.suspense_list') : 60120,
  r$2 = b$2 ? Symbol.for('react.memo') : 60115,
  t$1 = b$2 ? Symbol.for('react.lazy') : 60116,
  v$2 = b$2 ? Symbol.for('react.block') : 60121,
  w$2 = b$2 ? Symbol.for('react.fundamental') : 60117,
  x$2 = b$2 ? Symbol.for('react.responder') : 60118,
  y$2 = b$2 ? Symbol.for('react.scope') : 60119
function z$2(a) {
  if ('object' === typeof a && null !== a) {
    var u = a.$$typeof
    switch (u) {
      case c$2:
        switch (((a = a.type), a)) {
          case l$2:
          case m$2:
          case e$2:
          case g$2:
          case f$2:
          case p$2:
            return a
          default:
            switch (((a = a && a.$$typeof), a)) {
              case k$2:
              case n$2:
              case t$1:
              case r$2:
              case h$2:
                return a
              default:
                return u
            }
        }
      case d$2:
        return u
    }
  }
}
function A$2(a) {
  return z$2(a) === m$2
}
reactIs_production_min$2.AsyncMode = l$2
reactIs_production_min$2.ConcurrentMode = m$2
reactIs_production_min$2.ContextConsumer = k$2
reactIs_production_min$2.ContextProvider = h$2
reactIs_production_min$2.Element = c$2
reactIs_production_min$2.ForwardRef = n$2
reactIs_production_min$2.Fragment = e$2
reactIs_production_min$2.Lazy = t$1
reactIs_production_min$2.Memo = r$2
reactIs_production_min$2.Portal = d$2
reactIs_production_min$2.Profiler = g$2
reactIs_production_min$2.StrictMode = f$2
reactIs_production_min$2.Suspense = p$2
reactIs_production_min$2.isAsyncMode = function (a) {
  return A$2(a) || z$2(a) === l$2
}
reactIs_production_min$2.isConcurrentMode = A$2
reactIs_production_min$2.isContextConsumer = function (a) {
  return z$2(a) === k$2
}
reactIs_production_min$2.isContextProvider = function (a) {
  return z$2(a) === h$2
}
reactIs_production_min$2.isElement = function (a) {
  return 'object' === typeof a && null !== a && a.$$typeof === c$2
}
reactIs_production_min$2.isForwardRef = function (a) {
  return z$2(a) === n$2
}
reactIs_production_min$2.isFragment = function (a) {
  return z$2(a) === e$2
}
reactIs_production_min$2.isLazy = function (a) {
  return z$2(a) === t$1
}
reactIs_production_min$2.isMemo = function (a) {
  return z$2(a) === r$2
}
reactIs_production_min$2.isPortal = function (a) {
  return z$2(a) === d$2
}
reactIs_production_min$2.isProfiler = function (a) {
  return z$2(a) === g$2
}
reactIs_production_min$2.isStrictMode = function (a) {
  return z$2(a) === f$2
}
reactIs_production_min$2.isSuspense = function (a) {
  return z$2(a) === p$2
}
reactIs_production_min$2.isValidElementType = function (a) {
  return (
    'string' === typeof a ||
    'function' === typeof a ||
    a === e$2 ||
    a === m$2 ||
    a === g$2 ||
    a === f$2 ||
    a === p$2 ||
    a === q$2 ||
    ('object' === typeof a &&
      null !== a &&
      (a.$$typeof === t$1 ||
        a.$$typeof === r$2 ||
        a.$$typeof === h$2 ||
        a.$$typeof === k$2 ||
        a.$$typeof === n$2 ||
        a.$$typeof === w$2 ||
        a.$$typeof === x$2 ||
        a.$$typeof === y$2 ||
        a.$$typeof === v$2))
  )
}
reactIs_production_min$2.typeOf = z$2

var reactIs_development$2 = {}

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  ;(function () {
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb
    var REACT_STRICT_MODE_TYPE = hasSymbol
      ? Symbol.for('react.strict_mode')
      : 0xeacc
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_ASYNC_MODE_TYPE = hasSymbol
      ? Symbol.for('react.async_mode')
      : 0xeacf
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol
      ? Symbol.for('react.concurrent_mode')
      : 0xeacf
    var REACT_FORWARD_REF_TYPE = hasSymbol
      ? Symbol.for('react.forward_ref')
      : 0xead0
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol
      ? Symbol.for('react.suspense_list')
      : 0xead8
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4
    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9
    var REACT_FUNDAMENTAL_TYPE = hasSymbol
      ? Symbol.for('react.fundamental')
      : 0xead5
    var REACT_RESPONDER_TYPE = hasSymbol
      ? Symbol.for('react.responder')
      : 0xead6
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7

    function isValidElementType(type) {
      return (
        typeof type === 'string' ||
        typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE ||
        type === REACT_CONCURRENT_MODE_TYPE ||
        type === REACT_PROFILER_TYPE ||
        type === REACT_STRICT_MODE_TYPE ||
        type === REACT_SUSPENSE_TYPE ||
        type === REACT_SUSPENSE_LIST_TYPE ||
        (typeof type === 'object' &&
          type !== null &&
          (type.$$typeof === REACT_LAZY_TYPE ||
            type.$$typeof === REACT_MEMO_TYPE ||
            type.$$typeof === REACT_PROVIDER_TYPE ||
            type.$$typeof === REACT_CONTEXT_TYPE ||
            type.$$typeof === REACT_FORWARD_REF_TYPE ||
            type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
            type.$$typeof === REACT_RESPONDER_TYPE ||
            type.$$typeof === REACT_SCOPE_TYPE ||
            type.$$typeof === REACT_BLOCK_TYPE))
      )
    }

    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof

        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type

            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type

              default:
                var $$typeofType = type && type.$$typeof

                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType

                  default:
                    return $$typeof
                }
            }

          case REACT_PORTAL_TYPE:
            return $$typeof
        }
      }

      return undefined
    } // AsyncMode is deprecated along with isAsyncMode

    var AsyncMode = REACT_ASYNC_MODE_TYPE
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE
    var ContextConsumer = REACT_CONTEXT_TYPE
    var ContextProvider = REACT_PROVIDER_TYPE
    var Element = REACT_ELEMENT_TYPE
    var ForwardRef = REACT_FORWARD_REF_TYPE
    var Fragment = REACT_FRAGMENT_TYPE
    var Lazy = REACT_LAZY_TYPE
    var Memo = REACT_MEMO_TYPE
    var Portal = REACT_PORTAL_TYPE
    var Profiler = REACT_PROFILER_TYPE
    var StrictMode = REACT_STRICT_MODE_TYPE
    var Suspense = REACT_SUSPENSE_TYPE
    var hasWarnedAboutDeprecatedIsAsyncMode = false // AsyncMode should be deprecated

    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true // Using console['warn'] to evade Babel and ESLint

          console['warn'](
            'The ReactIs.isAsyncMode() alias has been deprecated, ' +
              'and will be removed in React 17+. Update your code to use ' +
              'ReactIs.isConcurrentMode() instead. It has the exact same API.'
          )
        }
      }

      return (
        isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE
      )
    }
    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE
    }
    function isElement(object) {
      return (
        typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE
      )
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE
    }

    reactIs_development$2.AsyncMode = AsyncMode
    reactIs_development$2.ConcurrentMode = ConcurrentMode
    reactIs_development$2.ContextConsumer = ContextConsumer
    reactIs_development$2.ContextProvider = ContextProvider
    reactIs_development$2.Element = Element
    reactIs_development$2.ForwardRef = ForwardRef
    reactIs_development$2.Fragment = Fragment
    reactIs_development$2.Lazy = Lazy
    reactIs_development$2.Memo = Memo
    reactIs_development$2.Portal = Portal
    reactIs_development$2.Profiler = Profiler
    reactIs_development$2.StrictMode = StrictMode
    reactIs_development$2.Suspense = Suspense
    reactIs_development$2.isAsyncMode = isAsyncMode
    reactIs_development$2.isConcurrentMode = isConcurrentMode
    reactIs_development$2.isContextConsumer = isContextConsumer
    reactIs_development$2.isContextProvider = isContextProvider
    reactIs_development$2.isElement = isElement
    reactIs_development$2.isForwardRef = isForwardRef
    reactIs_development$2.isFragment = isFragment
    reactIs_development$2.isLazy = isLazy
    reactIs_development$2.isMemo = isMemo
    reactIs_development$2.isPortal = isPortal
    reactIs_development$2.isProfiler = isProfiler
    reactIs_development$2.isStrictMode = isStrictMode
    reactIs_development$2.isSuspense = isSuspense
    reactIs_development$2.isValidElementType = isValidElementType
    reactIs_development$2.typeOf = typeOf
  })()
}

if (process.env.NODE_ENV === 'production') {
  reactIs$3.exports = reactIs_production_min$2
} else {
  reactIs$3.exports = reactIs_development$2
}

var reactIs$2 = reactIs$3.exports
var FORWARD_REF_STATICS = {
  $$typeof: true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
}
var MEMO_STATICS = {
  $$typeof: true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
}
var TYPE_STATICS = {}
TYPE_STATICS[reactIs$2.ForwardRef] = FORWARD_REF_STATICS
TYPE_STATICS[reactIs$2.Memo] = MEMO_STATICS

var isBrowser$3 = typeof document !== 'undefined'
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = ''
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ';')
    } else {
      rawClassName += className + ' '
    }
  })
  return rawClassName
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + '-' + serialized.name

  if (
    // we only need to add the styles to the registered cache if the
    // class name could be used further down
    // the tree but if it's a string tag, we know it won't
    // so we don't have to add it to registered cache.
    // this improves memory usage since we can avoid storing the whole style string
    (isStringTag === false || // we need to always store it if we're in compat mode and
      // in node since emotion-server relies on whether a style is in
      // the registered cache to know whether a style is global or not
      // also, note that this check will be dead code eliminated in the browser
      (isBrowser$3 === false && cache.compat !== undefined)) &&
    cache.registered[className] === undefined
  ) {
    cache.registered[className] = serialized.styles
  }

  if (cache.inserted[serialized.name] === undefined) {
    var stylesForSSR = ''
    var current = serialized

    do {
      var maybeStyles = cache.insert(
        serialized === current ? '.' + className : '',
        current,
        cache.sheet,
        true
      )

      if (!isBrowser$3 && maybeStyles !== undefined) {
        stylesForSSR += maybeStyles
      }

      current = current.next
    } while (current !== undefined)

    if (!isBrowser$3 && stylesForSSR.length !== 0) {
      return stylesForSSR
    }
  }
}

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0 // Mix 4 bytes at a time into the hash

  var k,
    i = 0,
    len = str.length

  for (; len >= 4; ++i, len -= 4) {
    k =
      (str.charCodeAt(i) & 0xff) |
      ((str.charCodeAt(++i) & 0xff) << 8) |
      ((str.charCodeAt(++i) & 0xff) << 16) |
      ((str.charCodeAt(++i) & 0xff) << 24)
    k =
      /* Math.imul(k, m): */
      (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16)
    k ^=
      /* k >>> r: */
      k >>> 24
    h =
      /* Math.imul(k, m): */
      ((k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16)) ^
      /* Math.imul(h, m): */
      ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16))
  } // Handle the last few bytes of the input array

  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8

    case 1:
      h ^= str.charCodeAt(i) & 0xff
      h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16)
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.

  h ^= h >>> 13
  h =
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16)
  return ((h ^ (h >>> 15)) >>> 0).toString(36)
}

var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
}

var ILLEGAL_ESCAPE_SEQUENCE_ERROR$1 =
  "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences"
var UNDEFINED_AS_OBJECT_KEY_ERROR =
  "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key)."
var hyphenateRegex = /[A-Z]|^ms/g
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45
}

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean'
}

var processStyleName = /* #__PURE__ */ memoize$1(function (styleName) {
  return isCustomProperty(styleName)
    ? styleName
    : styleName.replace(hyphenateRegex, '-$&').toLowerCase()
})

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName': {
      if (typeof value === 'string') {
        return value.replace(animationRegex, function (match, p1, p2) {
          cursor = {
            name: p1,
            styles: p2,
            next: cursor
          }
          return p1
        })
      }
    }
  }

  if (
    unitlessKeys[key] !== 1 &&
    !isCustomProperty(key) &&
    typeof value === 'number' &&
    value !== 0
  ) {
    return value + 'px'
  }

  return value
}

if (process.env.NODE_ENV !== 'production') {
  var contentValuePattern =
    /(attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset']
  var oldProcessStyleValue = processStyleValue
  var msPattern = /^-ms-/
  var hyphenPattern = /-(.)/g
  var hyphenatedCache = {}

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (
        typeof value !== 'string' ||
        (contentValues.indexOf(value) === -1 &&
          !contentValuePattern.test(value) &&
          (value.charAt(0) !== value.charAt(value.length - 1) ||
            (value.charAt(0) !== '"' && value.charAt(0) !== "'")))
      ) {
        throw new Error(
          "You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" +
            value +
            '"\'`'
        )
      }
    }

    var processed = oldProcessStyleValue(key, value)

    if (
      processed !== '' &&
      !isCustomProperty(key) &&
      key.indexOf('-') !== -1 &&
      hyphenatedCache[key] === undefined
    ) {
      hyphenatedCache[key] = true
      console.error(
        'Using kebab-case for css properties in objects is not supported. Did you mean ' +
          key
            .replace(msPattern, 'ms-')
            .replace(hyphenPattern, function (str, _char) {
              return _char.toUpperCase()
            }) +
          '?'
      )
    }

    return processed
  }
}

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return ''
  }

  if (interpolation.__emotion_styles !== undefined) {
    if (
      process.env.NODE_ENV !== 'production' &&
      interpolation.toString() === 'NO_COMPONENT_SELECTOR'
    ) {
      throw new Error(
        'Component selectors can only be used in conjunction with @emotion/babel-plugin.'
      )
    }

    return interpolation
  }

  switch (typeof interpolation) {
    case 'boolean': {
      return ''
    }

    case 'object': {
      if (interpolation.anim === 1) {
        cursor = {
          name: interpolation.name,
          styles: interpolation.styles,
          next: cursor
        }
        return interpolation.name
      }

      if (interpolation.styles !== undefined) {
        var next = interpolation.next

        if (next !== undefined) {
          // not the most efficient thing ever but this is a pretty rare case
          // and there will be very few iterations of this generally
          while (next !== undefined) {
            cursor = {
              name: next.name,
              styles: next.styles,
              next: cursor
            }
            next = next.next
          }
        }

        var styles = interpolation.styles + ';'

        if (
          process.env.NODE_ENV !== 'production' &&
          interpolation.map !== undefined
        ) {
          styles += interpolation.map
        }

        return styles
      }

      return createStringFromObject(mergedProps, registered, interpolation)
    }

    case 'function': {
      if (mergedProps !== undefined) {
        var previousCursor = cursor
        var result = interpolation(mergedProps)
        cursor = previousCursor
        return handleInterpolation(mergedProps, registered, result)
      } else if (process.env.NODE_ENV !== 'production') {
        console.error(
          'Functions that are interpolated in css calls will be stringified.\n' +
            'If you want to have a css call based on props, create a function that returns a css call like this\n' +
            'let dynamicStyle = (props) => css`color: ${props.color}`\n' +
            'It can be called directly with props or interpolated in a styled call like this\n' +
            "let SomeComponent = styled('div')`${dynamicStyle}`"
        )
      }

      break
    }

    case 'string':
      if (process.env.NODE_ENV !== 'production') {
        var matched = []
        var replaced = interpolation.replace(
          animationRegex,
          function (match, p1, p2) {
            var fakeVarName = 'animation' + matched.length
            matched.push(
              'const ' +
                fakeVarName +
                ' = keyframes`' +
                p2.replace(/^@keyframes animation-\w+/, '') +
                '`'
            )
            return '${' + fakeVarName + '}'
          }
        )

        if (matched.length) {
          console.error(
            '`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' +
              'Instead of doing this:\n\n' +
              [].concat(matched, ['`' + replaced + '`']).join('\n') +
              '\n\nYou should wrap it with `css` like this:\n\n' +
              ('css`' + replaced + '`')
          )
        }
      }

      break
  } // finalize string values (regular strings and functions interpolated into css calls)

  if (registered == null) {
    return interpolation
  }

  var cached = registered[interpolation]
  return cached !== undefined ? cached : interpolation
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = ''

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ';'
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key]

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + '{' + registered[value] + '}'
        } else if (isProcessableValue(value)) {
          string +=
            processStyleName(_key) + ':' + processStyleValue(_key, value) + ';'
        }
      } else {
        if (
          _key === 'NO_COMPONENT_SELECTOR' &&
          process.env.NODE_ENV !== 'production'
        ) {
          throw new Error(
            'Component selectors can only be used in conjunction with @emotion/babel-plugin.'
          )
        }

        if (
          Array.isArray(value) &&
          typeof value[0] === 'string' &&
          (registered == null || registered[value[0]] === undefined)
        ) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string +=
                processStyleName(_key) +
                ':' +
                processStyleValue(_key, value[_i]) +
                ';'
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value)

          switch (_key) {
            case 'animation':
            case 'animationName': {
              string += processStyleName(_key) + ':' + interpolated + ';'
              break
            }

            default: {
              if (
                process.env.NODE_ENV !== 'production' &&
                _key === 'undefined'
              ) {
                console.error(UNDEFINED_AS_OBJECT_KEY_ERROR)
              }

              string += _key + '{' + interpolated + '}'
            }
          }
        }
      }
    }
  }

  return string
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g
var sourceMapPattern

if (process.env.NODE_ENV !== 'production') {
  sourceMapPattern =
    /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list

var cursor
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (
    args.length === 1 &&
    typeof args[0] === 'object' &&
    args[0] !== null &&
    args[0].styles !== undefined
  ) {
    return args[0]
  }

  var stringMode = true
  var styles = ''
  cursor = undefined
  var strings = args[0]

  if (strings == null || strings.raw === undefined) {
    stringMode = false
    styles += handleInterpolation(mergedProps, registered, strings)
  } else {
    if (process.env.NODE_ENV !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1)
    }

    styles += strings[0]
  } // we start at 1 since we've already handled the first arg

  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i])

    if (stringMode) {
      if (process.env.NODE_ENV !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1)
      }

      styles += strings[i]
    }
  }

  var sourceMap

  if (process.env.NODE_ENV !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match
      return ''
    })
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time

  labelPattern.lastIndex = 0
  var identifierName = ''
  var match // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName +=
      '-' + // $FlowFixMe we know it's not null
      match[1]
  }

  var name = murmur2(styles) + identifierName

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."
      }
    }
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  }
}

var isBrowser$2 = typeof document !== 'undefined'
var hasOwnProperty = {}.hasOwnProperty

var EmotionCacheContext = /* #__PURE__ */ react.exports.createContext(
  // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement !== 'undefined'
    ? /* #__PURE__ */ createCache({
        key: 'css'
      })
    : null
)

if (process.env.NODE_ENV !== 'production') {
  EmotionCacheContext.displayName = 'EmotionCacheContext'
}

EmotionCacheContext.Provider

var withEmotionCache = function withEmotionCache(func) {
  // $FlowFixMe
  return /*#__PURE__*/ react.exports.forwardRef(function (props, ref) {
    // the cache will never be null in the browser
    var cache = react.exports.useContext(EmotionCacheContext)
    return func(props, cache, ref)
  })
}

if (!isBrowser$2) {
  withEmotionCache = function withEmotionCache(func) {
    return function (props) {
      var cache = react.exports.useContext(EmotionCacheContext)

      if (cache === null) {
        // yes, we're potentially creating this on every render
        // it doesn't actually matter though since it's only on the server
        // so there will only every be a single render
        // that could change in the future because of suspense and etc. but for now,
        // this works and i don't want to optimise for a future thing that we aren't sure about
        cache = createCache({
          key: 'css'
        })
        return /*#__PURE__*/ react.exports.createElement(
          EmotionCacheContext.Provider,
          {
            value: cache
          },
          func(props, cache)
        )
      } else {
        return func(props, cache)
      }
    }
  }
}

var ThemeContext$2 = /* #__PURE__ */ react.exports.createContext({})

if (process.env.NODE_ENV !== 'production') {
  ThemeContext$2.displayName = 'EmotionThemeContext'
}

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__'
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__'

var Noop$2 = function Noop() {
  return null
}

var Emotion = /* #__PURE__ */ withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp]
  }

  var type = props[typePropName]
  var registeredStyles = [cssProp]
  var className = ''

  if (typeof props.className === 'string') {
    className = getRegisteredStyles(
      cache.registered,
      registeredStyles,
      props.className
    )
  } else if (props.className != null) {
    className = props.className + ' '
  }

  var serialized = serializeStyles(
    registeredStyles,
    undefined,
    react.exports.useContext(ThemeContext$2)
  )

  if (
    process.env.NODE_ENV !== 'production' &&
    serialized.name.indexOf('-') === -1
  ) {
    var labelFromStack = props[labelPropName]

    if (labelFromStack) {
      serialized = serializeStyles([
        serialized,
        'label:' + labelFromStack + ';'
      ])
    }
  }

  var rules = insertStyles(cache, serialized, typeof type === 'string')
  className += cache.key + '-' + serialized.name
  var newProps = {}

  for (var key in props) {
    if (
      hasOwnProperty.call(props, key) &&
      key !== 'css' &&
      key !== typePropName &&
      (process.env.NODE_ENV === 'production' || key !== labelPropName)
    ) {
      newProps[key] = props[key]
    }
  }

  newProps.ref = ref
  newProps.className = className
  var ele = /*#__PURE__*/ react.exports.createElement(type, newProps)
  var possiblyStyleElement = /*#__PURE__*/ react.exports.createElement(
    Noop$2,
    null
  )

  if (!isBrowser$2 && rules !== undefined) {
    var _ref

    var serializedNames = serialized.name
    var next = serialized.next

    while (next !== undefined) {
      serializedNames += ' ' + next.name
      next = next.next
    }

    possiblyStyleElement = /*#__PURE__*/ react.exports.createElement(
      'style',
      ((_ref = {}),
      (_ref['data-emotion'] = cache.key + ' ' + serializedNames),
      (_ref.dangerouslySetInnerHTML = {
        __html: rules
      }),
      (_ref.nonce = cache.sheet.nonce),
      _ref)
    )
  } // Need to return the same number of siblings or else `React.useId` will cause hydration mismatches.

  return /*#__PURE__*/ react.exports.createElement(
    react.exports.Fragment,
    null,
    possiblyStyleElement,
    ele
  )
})

if (process.env.NODE_ENV !== 'production') {
  Emotion.displayName = 'EmotionCssPropInternal'
}

var pkg = {
  'name': '@emotion/react',
  'version': '11.6.0',
  'main': 'dist/emotion-react.cjs.js',
  'module': 'dist/emotion-react.esm.js',
  'browser': {
    './dist/emotion-react.cjs.js': './dist/emotion-react.browser.cjs.js',
    './dist/emotion-react.esm.js': './dist/emotion-react.browser.esm.js'
  },
  'types': 'types/index.d.ts',
  'files': [
    'src',
    'dist',
    'jsx-runtime',
    'jsx-dev-runtime',
    '_isolated-hnrs',
    'types/*.d.ts',
    'macro.js',
    'macro.d.ts',
    'macro.js.flow'
  ],
  'sideEffects': false,
  'author': 'mitchellhamilton <mitchell@mitchellhamilton.me>',
  'license': 'MIT',
  'scripts': {
    'test:typescript': 'dtslint types'
  },
  'dependencies': {
    '@babel/runtime': '^7.13.10',
    '@emotion/cache': '^11.6.0',
    '@emotion/serialize': '^1.0.2',
    '@emotion/sheet': '^1.1.0',
    '@emotion/utils': '^1.0.0',
    '@emotion/weak-memoize': '^0.2.5',
    'hoist-non-react-statics': '^3.3.1'
  },
  'peerDependencies': {
    '@babel/core': '^7.0.0',
    'react': '>=16.8.0'
  },
  'peerDependenciesMeta': {
    '@babel/core': {
      optional: true
    },
    '@types/react': {
      optional: true
    }
  },
  'devDependencies': {
    '@babel/core': '^7.13.10',
    '@emotion/css': '11.5.0',
    '@emotion/css-prettifier': '1.0.0',
    '@emotion/server': '11.4.0',
    '@emotion/styled': '11.6.0',
    '@types/react': '^16.9.11',
    'dtslint': '^0.3.0',
    'html-tag-names': '^1.1.2',
    'react': '16.14.0',
    'svg-tag-names': '^1.1.1'
  },
  'repository':
    'https://github.com/emotion-js/emotion/tree/main/packages/react',
  'publishConfig': {
    access: 'public'
  },
  'umd:main': 'dist/emotion-react.umd.min.js',
  'preconstruct': {
    entrypoints: [
      './index.js',
      './jsx-runtime.js',
      './jsx-dev-runtime.js',
      './_isolated-hnrs.js'
    ],
    umdName: 'emotionReact'
  }
}

var warnedAboutCssPropForGlobal = false // maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag

var Global = /* #__PURE__ */ withEmotionCache(function (props, cache) {
  if (
    process.env.NODE_ENV !== 'production' &&
    !warnedAboutCssPropForGlobal && // check for className as well since the user is
    // probably using the custom createElement which
    // means it will be turned into a className prop
    // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
    (props.className || props.css)
  ) {
    console.error(
      "It looks like you're using the css prop on Global, did you mean to use the styles prop instead?"
    )
    warnedAboutCssPropForGlobal = true
  }

  var styles = props.styles
  var serialized = serializeStyles(
    [styles],
    undefined,
    react.exports.useContext(ThemeContext$2)
  )

  if (!isBrowser$2) {
    var _ref

    var serializedNames = serialized.name
    var serializedStyles = serialized.styles
    var next = serialized.next

    while (next !== undefined) {
      serializedNames += ' ' + next.name
      serializedStyles += next.styles
      next = next.next
    }

    var shouldCache = cache.compat === true
    var rules = cache.insert(
      '',
      {
        name: serializedNames,
        styles: serializedStyles
      },
      cache.sheet,
      shouldCache
    )

    if (shouldCache) {
      return null
    }

    return /*#__PURE__*/ react.exports.createElement(
      'style',
      ((_ref = {}),
      (_ref['data-emotion'] = cache.key + '-global ' + serializedNames),
      (_ref.dangerouslySetInnerHTML = {
        __html: rules
      }),
      (_ref.nonce = cache.sheet.nonce),
      _ref)
    )
  } // yes, i know these hooks are used conditionally
  // but it is based on a constant that will never change at runtime
  // it's effectively like having two implementations and switching them out
  // so it's not actually breaking anything

  var sheetRef = react.exports.useRef()
  react.exports.useLayoutEffect(
    function () {
      var key = cache.key + '-global'
      var sheet = new StyleSheet({
        key: key,
        nonce: cache.sheet.nonce,
        container: cache.sheet.container,
        speedy: cache.sheet.isSpeedy
      })
      var rehydrating = false // $FlowFixMe

      var node = document.querySelector(
        'style[data-emotion="' + key + ' ' + serialized.name + '"]'
      )

      if (cache.sheet.tags.length) {
        sheet.before = cache.sheet.tags[0]
      }

      if (node !== null) {
        rehydrating = true // clear the hash so this node won't be recognizable as rehydratable by other <Global/>s

        node.setAttribute('data-emotion', key)
        sheet.hydrate([node])
      }

      sheetRef.current = [sheet, rehydrating]
      return function () {
        sheet.flush()
      }
    },
    [cache]
  )
  react.exports.useLayoutEffect(
    function () {
      var sheetRefCurrent = sheetRef.current
      var sheet = sheetRefCurrent[0],
        rehydrating = sheetRefCurrent[1]

      if (rehydrating) {
        sheetRefCurrent[1] = false
        return
      }

      if (serialized.next !== undefined) {
        // insert keyframes
        insertStyles(cache, serialized.next, true)
      }

      if (sheet.tags.length) {
        // if this doesn't exist then it will be null so the style element will be appended
        var element = sheet.tags[sheet.tags.length - 1].nextElementSibling
        sheet.before = element
        sheet.flush()
      }

      cache.insert('', serialized, sheet, false)
    },
    [cache, serialized.name]
  )
  return null
})

if (process.env.NODE_ENV !== 'production') {
  Global.displayName = 'EmotionGlobal'
}

function css() {
  for (
    var _len = arguments.length, args = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    args[_key] = arguments[_key]
  }

  return serializeStyles(args)
}

var keyframes = function keyframes() {
  var insertable = css.apply(void 0, arguments)
  var name = 'animation-' + insertable.name // $FlowFixMe

  return {
    name: name,
    styles: '@keyframes ' + name + '{' + insertable.styles + '}',
    anim: 1,
    toString: function toString() {
      return '_EMO_' + this.name + '_' + this.styles + '_EMO_'
    }
  }
}

var classnames = function classnames(args) {
  var len = args.length
  var i = 0
  var cls = ''

  for (; i < len; i++) {
    var arg = args[i]
    if (arg == null) continue
    var toAdd = void 0

    switch (typeof arg) {
      case 'boolean':
        break

      case 'object': {
        if (Array.isArray(arg)) {
          toAdd = classnames(arg)
        } else {
          if (
            process.env.NODE_ENV !== 'production' &&
            arg.styles !== undefined &&
            arg.name !== undefined
          ) {
            console.error(
              'You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n' +
                '`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.'
            )
          }

          toAdd = ''

          for (var k in arg) {
            if (arg[k] && k) {
              toAdd && (toAdd += ' ')
              toAdd += k
            }
          }
        }

        break
      }

      default: {
        toAdd = arg
      }
    }

    if (toAdd) {
      cls && (cls += ' ')
      cls += toAdd
    }
  }

  return cls
}

function merge$1(registered, css, className) {
  var registeredStyles = []
  var rawClassName = getRegisteredStyles(
    registered,
    registeredStyles,
    className
  )

  if (registeredStyles.length < 2) {
    return className
  }

  return rawClassName + css(registeredStyles)
}

var Noop$1 = function Noop() {
  return null
}

var ClassNames = /* #__PURE__ */ withEmotionCache(function (props, cache) {
  var rules = ''
  var serializedHashes = ''
  var hasRendered = false

  var css = function css() {
    if (hasRendered && process.env.NODE_ENV !== 'production') {
      throw new Error('css can only be used during render')
    }

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    var serialized = serializeStyles(args, cache.registered)

    if (isBrowser$2) {
      insertStyles(cache, serialized, false)
    } else {
      var res = insertStyles(cache, serialized, false)

      if (res !== undefined) {
        rules += res
      }
    }

    if (!isBrowser$2) {
      serializedHashes += ' ' + serialized.name
    }

    return cache.key + '-' + serialized.name
  }

  var cx = function cx() {
    if (hasRendered && process.env.NODE_ENV !== 'production') {
      throw new Error('cx can only be used during render')
    }

    for (
      var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2]
    }

    return merge$1(cache.registered, css, classnames(args))
  }

  var content = {
    css: css,
    cx: cx,
    theme: react.exports.useContext(ThemeContext$2)
  }
  var ele = props.children(content)
  hasRendered = true
  var possiblyStyleElement = /*#__PURE__*/ react.exports.createElement(
    Noop$1,
    null
  )

  if (!isBrowser$2 && rules.length !== 0) {
    var _ref

    possiblyStyleElement = /*#__PURE__*/ react.exports.createElement(
      'style',
      ((_ref = {}),
      (_ref['data-emotion'] = cache.key + ' ' + serializedHashes.substring(1)),
      (_ref.dangerouslySetInnerHTML = {
        __html: rules
      }),
      (_ref.nonce = cache.sheet.nonce),
      _ref)
    )
  } // Need to return the same number of siblings or else `React.useId` will cause hydration mismatches.

  return /*#__PURE__*/ react.exports.createElement(
    react.exports.Fragment,
    null,
    possiblyStyleElement,
    ele
  )
})

if (process.env.NODE_ENV !== 'production') {
  ClassNames.displayName = 'EmotionClassNames'
}

if (process.env.NODE_ENV !== 'production') {
  var isBrowser$1 = typeof document !== 'undefined' // #1727 for some reason Jest evaluates modules twice if some consuming module gets mocked with jest.mock

  var isJest = typeof jest !== 'undefined'

  if (isBrowser$1 && !isJest) {
    // globalThis has wide browser support - https://caniuse.com/?search=globalThis, Node.js 12 and later
    var globalContext = // $FlowIgnore
      typeof globalThis !== 'undefined'
        ? globalThis // eslint-disable-line no-undef
        : isBrowser$1
        ? window
        : global
    var globalKey = '__EMOTION_REACT_' + pkg.version.split('.')[0] + '__'

    if (globalContext[globalKey]) {
      console.warn(
        'You are loading @emotion/react when it is already loaded. Running ' +
          'multiple instances may cause problems. This can happen if multiple ' +
          'versions are used, or if multiple builds of the same version are ' +
          'used.'
      )
    }

    globalContext[globalKey] = true
  }
}

var testOmitPropsOnStringTag = isPropValid

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme'
}

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96
    ? testOmitPropsOnStringTag
    : testOmitPropsOnComponent
}
var composeShouldForwardProps = function composeShouldForwardProps(
  tag,
  options,
  isReal
) {
  var shouldForwardProp

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp
    shouldForwardProp =
      tag.__emotion_forwardProp && optionsShouldForwardProp
        ? function (propName) {
            return (
              tag.__emotion_forwardProp(propName) &&
              optionsShouldForwardProp(propName)
            )
          }
        : optionsShouldForwardProp
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp
  }

  return shouldForwardProp
}

var ILLEGAL_ESCAPE_SEQUENCE_ERROR =
  "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences"
var isBrowser = typeof document !== 'undefined'

var Noop = function Noop() {
  return null
}

var createStyled$1 = function createStyled(tag, options) {
  if (process.env.NODE_ENV !== 'production') {
    if (tag === undefined) {
      throw new Error(
        'You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.'
      )
    }
  }

  var isReal = tag.__emotion_real === tag
  var baseTag = (isReal && tag.__emotion_base) || tag
  var identifierName
  var targetClassName

  if (options !== undefined) {
    identifierName = options.label
    targetClassName = options.target
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal)
  var defaultShouldForwardProp =
    shouldForwardProp || getDefaultShouldForwardProp(baseTag)
  var shouldUseAs = !defaultShouldForwardProp('as')
  return function () {
    var args = arguments
    var styles =
      isReal && tag.__emotion_styles !== undefined
        ? tag.__emotion_styles.slice(0)
        : []

    if (identifierName !== undefined) {
      styles.push('label:' + identifierName + ';')
    }

    if (args[0] == null || args[0].raw === undefined) {
      styles.push.apply(styles, args)
    } else {
      if (process.env.NODE_ENV !== 'production' && args[0][0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR)
      }

      styles.push(args[0][0])
      var len = args.length
      var i = 1

      for (; i < len; i++) {
        if (process.env.NODE_ENV !== 'production' && args[0][i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR)
        }

        styles.push(args[i], args[0][i])
      }
    } // $FlowFixMe: we need to cast StatelessFunctionalComponent to our PrivateStyledComponent class

    var Styled = withEmotionCache(function (props, cache, ref) {
      var finalTag = (shouldUseAs && props.as) || baseTag
      var className = ''
      var classInterpolations = []
      var mergedProps = props

      if (props.theme == null) {
        mergedProps = {}

        for (var key in props) {
          mergedProps[key] = props[key]
        }

        mergedProps.theme = react.exports.useContext(ThemeContext$2)
      }

      if (typeof props.className === 'string') {
        className = getRegisteredStyles(
          cache.registered,
          classInterpolations,
          props.className
        )
      } else if (props.className != null) {
        className = props.className + ' '
      }

      var serialized = serializeStyles(
        styles.concat(classInterpolations),
        cache.registered,
        mergedProps
      )
      var rules = insertStyles(cache, serialized, typeof finalTag === 'string')
      className += cache.key + '-' + serialized.name

      if (targetClassName !== undefined) {
        className += ' ' + targetClassName
      }

      var finalShouldForwardProp =
        shouldUseAs && shouldForwardProp === undefined
          ? getDefaultShouldForwardProp(finalTag)
          : defaultShouldForwardProp
      var newProps = {}

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue

        if (
          // $FlowFixMe
          finalShouldForwardProp(_key)
        ) {
          newProps[_key] = props[_key]
        }
      }

      newProps.className = className
      newProps.ref = ref
      var ele = /*#__PURE__*/ react.exports.createElement(finalTag, newProps)
      var possiblyStyleElement = /*#__PURE__*/ react.exports.createElement(
        Noop,
        null
      )

      if (!isBrowser && rules !== undefined) {
        var _ref

        var serializedNames = serialized.name
        var next = serialized.next

        while (next !== undefined) {
          serializedNames += ' ' + next.name
          next = next.next
        }

        possiblyStyleElement = /*#__PURE__*/ react.exports.createElement(
          'style',
          ((_ref = {}),
          (_ref['data-emotion'] = cache.key + ' ' + serializedNames),
          (_ref.dangerouslySetInnerHTML = {
            __html: rules
          }),
          (_ref.nonce = cache.sheet.nonce),
          _ref)
        )
      } // Need to return the same number of siblings or else `React.useId` will cause hydration mismatches.

      return /*#__PURE__*/ react.exports.createElement(
        react.exports.Fragment,
        null,
        possiblyStyleElement,
        ele
      )
    })
    Styled.displayName =
      identifierName !== undefined
        ? identifierName
        : 'Styled(' +
          (typeof baseTag === 'string'
            ? baseTag
            : baseTag.displayName || baseTag.name || 'Component') +
          ')'
    Styled.defaultProps = tag.defaultProps
    Styled.__emotion_real = Styled
    Styled.__emotion_base = baseTag
    Styled.__emotion_styles = styles
    Styled.__emotion_forwardProp = shouldForwardProp
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (
          targetClassName === undefined &&
          process.env.NODE_ENV !== 'production'
        ) {
          return 'NO_COMPONENT_SELECTOR'
        } // $FlowFixMe: coerce undefined to string

        return '.' + targetClassName
      }
    })

    Styled.withComponent = function (nextTag, nextOptions) {
      return createStyled(
        nextTag,
        _extends({}, options, nextOptions, {
          shouldForwardProp: composeShouldForwardProps(
            Styled,
            nextOptions,
            true
          )
        })
      ).apply(void 0, styles)
    }

    return Styled
  }
}

var tags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr', // SVG
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan'
]

var newStyled = createStyled$1.bind()
tags.forEach(function (tagName) {
  // $FlowFixMe: we can ignore this because its exposed type is defined by the CreateStyled type
  newStyled[tagName] = newStyled(tagName)
})

var emStyled = newStyled

var propTypes = { exports: {} }

var reactIs$1 = { exports: {} }

var reactIs_production_min$1 = {}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$1 = 'function' === typeof Symbol && Symbol.for,
  c$1 = b$1 ? Symbol.for('react.element') : 60103,
  d$1 = b$1 ? Symbol.for('react.portal') : 60106,
  e$1 = b$1 ? Symbol.for('react.fragment') : 60107,
  f$1 = b$1 ? Symbol.for('react.strict_mode') : 60108,
  g$1 = b$1 ? Symbol.for('react.profiler') : 60114,
  h$1 = b$1 ? Symbol.for('react.provider') : 60109,
  k$1 = b$1 ? Symbol.for('react.context') : 60110,
  l$1 = b$1 ? Symbol.for('react.async_mode') : 60111,
  m$1 = b$1 ? Symbol.for('react.concurrent_mode') : 60111,
  n$1 = b$1 ? Symbol.for('react.forward_ref') : 60112,
  p$1 = b$1 ? Symbol.for('react.suspense') : 60113,
  q$1 = b$1 ? Symbol.for('react.suspense_list') : 60120,
  r$1 = b$1 ? Symbol.for('react.memo') : 60115,
  t = b$1 ? Symbol.for('react.lazy') : 60116,
  v$1 = b$1 ? Symbol.for('react.block') : 60121,
  w$1 = b$1 ? Symbol.for('react.fundamental') : 60117,
  x$1 = b$1 ? Symbol.for('react.responder') : 60118,
  y$1 = b$1 ? Symbol.for('react.scope') : 60119
function z$1(a) {
  if ('object' === typeof a && null !== a) {
    var u = a.$$typeof
    switch (u) {
      case c$1:
        switch (((a = a.type), a)) {
          case l$1:
          case m$1:
          case e$1:
          case g$1:
          case f$1:
          case p$1:
            return a
          default:
            switch (((a = a && a.$$typeof), a)) {
              case k$1:
              case n$1:
              case t:
              case r$1:
              case h$1:
                return a
              default:
                return u
            }
        }
      case d$1:
        return u
    }
  }
}
function A$1(a) {
  return z$1(a) === m$1
}
reactIs_production_min$1.AsyncMode = l$1
reactIs_production_min$1.ConcurrentMode = m$1
reactIs_production_min$1.ContextConsumer = k$1
reactIs_production_min$1.ContextProvider = h$1
reactIs_production_min$1.Element = c$1
reactIs_production_min$1.ForwardRef = n$1
reactIs_production_min$1.Fragment = e$1
reactIs_production_min$1.Lazy = t
reactIs_production_min$1.Memo = r$1
reactIs_production_min$1.Portal = d$1
reactIs_production_min$1.Profiler = g$1
reactIs_production_min$1.StrictMode = f$1
reactIs_production_min$1.Suspense = p$1
reactIs_production_min$1.isAsyncMode = function (a) {
  return A$1(a) || z$1(a) === l$1
}
reactIs_production_min$1.isConcurrentMode = A$1
reactIs_production_min$1.isContextConsumer = function (a) {
  return z$1(a) === k$1
}
reactIs_production_min$1.isContextProvider = function (a) {
  return z$1(a) === h$1
}
reactIs_production_min$1.isElement = function (a) {
  return 'object' === typeof a && null !== a && a.$$typeof === c$1
}
reactIs_production_min$1.isForwardRef = function (a) {
  return z$1(a) === n$1
}
reactIs_production_min$1.isFragment = function (a) {
  return z$1(a) === e$1
}
reactIs_production_min$1.isLazy = function (a) {
  return z$1(a) === t
}
reactIs_production_min$1.isMemo = function (a) {
  return z$1(a) === r$1
}
reactIs_production_min$1.isPortal = function (a) {
  return z$1(a) === d$1
}
reactIs_production_min$1.isProfiler = function (a) {
  return z$1(a) === g$1
}
reactIs_production_min$1.isStrictMode = function (a) {
  return z$1(a) === f$1
}
reactIs_production_min$1.isSuspense = function (a) {
  return z$1(a) === p$1
}
reactIs_production_min$1.isValidElementType = function (a) {
  return (
    'string' === typeof a ||
    'function' === typeof a ||
    a === e$1 ||
    a === m$1 ||
    a === g$1 ||
    a === f$1 ||
    a === p$1 ||
    a === q$1 ||
    ('object' === typeof a &&
      null !== a &&
      (a.$$typeof === t ||
        a.$$typeof === r$1 ||
        a.$$typeof === h$1 ||
        a.$$typeof === k$1 ||
        a.$$typeof === n$1 ||
        a.$$typeof === w$1 ||
        a.$$typeof === x$1 ||
        a.$$typeof === y$1 ||
        a.$$typeof === v$1))
  )
}
reactIs_production_min$1.typeOf = z$1

var reactIs_development$1 = {}

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  ;(function () {
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb
    var REACT_STRICT_MODE_TYPE = hasSymbol
      ? Symbol.for('react.strict_mode')
      : 0xeacc
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_ASYNC_MODE_TYPE = hasSymbol
      ? Symbol.for('react.async_mode')
      : 0xeacf
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol
      ? Symbol.for('react.concurrent_mode')
      : 0xeacf
    var REACT_FORWARD_REF_TYPE = hasSymbol
      ? Symbol.for('react.forward_ref')
      : 0xead0
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol
      ? Symbol.for('react.suspense_list')
      : 0xead8
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4
    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9
    var REACT_FUNDAMENTAL_TYPE = hasSymbol
      ? Symbol.for('react.fundamental')
      : 0xead5
    var REACT_RESPONDER_TYPE = hasSymbol
      ? Symbol.for('react.responder')
      : 0xead6
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7

    function isValidElementType(type) {
      return (
        typeof type === 'string' ||
        typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE ||
        type === REACT_CONCURRENT_MODE_TYPE ||
        type === REACT_PROFILER_TYPE ||
        type === REACT_STRICT_MODE_TYPE ||
        type === REACT_SUSPENSE_TYPE ||
        type === REACT_SUSPENSE_LIST_TYPE ||
        (typeof type === 'object' &&
          type !== null &&
          (type.$$typeof === REACT_LAZY_TYPE ||
            type.$$typeof === REACT_MEMO_TYPE ||
            type.$$typeof === REACT_PROVIDER_TYPE ||
            type.$$typeof === REACT_CONTEXT_TYPE ||
            type.$$typeof === REACT_FORWARD_REF_TYPE ||
            type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
            type.$$typeof === REACT_RESPONDER_TYPE ||
            type.$$typeof === REACT_SCOPE_TYPE ||
            type.$$typeof === REACT_BLOCK_TYPE))
      )
    }

    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof

        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type

            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type

              default:
                var $$typeofType = type && type.$$typeof

                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType

                  default:
                    return $$typeof
                }
            }

          case REACT_PORTAL_TYPE:
            return $$typeof
        }
      }

      return undefined
    } // AsyncMode is deprecated along with isAsyncMode

    var AsyncMode = REACT_ASYNC_MODE_TYPE
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE
    var ContextConsumer = REACT_CONTEXT_TYPE
    var ContextProvider = REACT_PROVIDER_TYPE
    var Element = REACT_ELEMENT_TYPE
    var ForwardRef = REACT_FORWARD_REF_TYPE
    var Fragment = REACT_FRAGMENT_TYPE
    var Lazy = REACT_LAZY_TYPE
    var Memo = REACT_MEMO_TYPE
    var Portal = REACT_PORTAL_TYPE
    var Profiler = REACT_PROFILER_TYPE
    var StrictMode = REACT_STRICT_MODE_TYPE
    var Suspense = REACT_SUSPENSE_TYPE
    var hasWarnedAboutDeprecatedIsAsyncMode = false // AsyncMode should be deprecated

    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true // Using console['warn'] to evade Babel and ESLint

          console['warn'](
            'The ReactIs.isAsyncMode() alias has been deprecated, ' +
              'and will be removed in React 17+. Update your code to use ' +
              'ReactIs.isConcurrentMode() instead. It has the exact same API.'
          )
        }
      }

      return (
        isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE
      )
    }
    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE
    }
    function isElement(object) {
      return (
        typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE
      )
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE
    }

    reactIs_development$1.AsyncMode = AsyncMode
    reactIs_development$1.ConcurrentMode = ConcurrentMode
    reactIs_development$1.ContextConsumer = ContextConsumer
    reactIs_development$1.ContextProvider = ContextProvider
    reactIs_development$1.Element = Element
    reactIs_development$1.ForwardRef = ForwardRef
    reactIs_development$1.Fragment = Fragment
    reactIs_development$1.Lazy = Lazy
    reactIs_development$1.Memo = Memo
    reactIs_development$1.Portal = Portal
    reactIs_development$1.Profiler = Profiler
    reactIs_development$1.StrictMode = StrictMode
    reactIs_development$1.Suspense = Suspense
    reactIs_development$1.isAsyncMode = isAsyncMode
    reactIs_development$1.isConcurrentMode = isConcurrentMode
    reactIs_development$1.isContextConsumer = isContextConsumer
    reactIs_development$1.isContextProvider = isContextProvider
    reactIs_development$1.isElement = isElement
    reactIs_development$1.isForwardRef = isForwardRef
    reactIs_development$1.isFragment = isFragment
    reactIs_development$1.isLazy = isLazy
    reactIs_development$1.isMemo = isMemo
    reactIs_development$1.isPortal = isPortal
    reactIs_development$1.isProfiler = isProfiler
    reactIs_development$1.isStrictMode = isStrictMode
    reactIs_development$1.isSuspense = isSuspense
    reactIs_development$1.isValidElementType = isValidElementType
    reactIs_development$1.typeOf = typeOf
  })()
}

if (process.env.NODE_ENV === 'production') {
  reactIs$1.exports = reactIs_production_min$1
} else {
  reactIs$1.exports = reactIs_development$1
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$3 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'

var ReactPropTypesSecret_1 = ReactPropTypesSecret$3

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var printWarning$1 = function () {}

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$2 = ReactPropTypesSecret_1
  var loggedTypeFailures = {}
  var has$1 = Function.call.bind(Object.prototype.hasOwnProperty)

  printWarning$1 = function (text) {
    var message = 'Warning: ' + text
    if (typeof console !== 'undefined') {
      console.error(message)
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message)
    } catch (x) {}
  }
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes$1(
  typeSpecs,
  values,
  location,
  componentName,
  getStack
) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has$1(typeSpecs, typeSpecName)) {
        var error
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') +
                ': ' +
                location +
                ' type `' +
                typeSpecName +
                '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' +
                typeof typeSpecs[typeSpecName] +
                '`.'
            )
            err.name = 'Invariant Violation'
            throw err
          }
          error = typeSpecs[typeSpecName](
            values,
            typeSpecName,
            componentName,
            location,
            null,
            ReactPropTypesSecret$2
          )
        } catch (ex) {
          error = ex
        }
        if (error && !(error instanceof Error)) {
          printWarning$1(
            (componentName || 'React class') +
              ': type specification of ' +
              location +
              ' `' +
              typeSpecName +
              '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' +
              typeof error +
              '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
          )
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true

          var stack = getStack ? getStack() : ''

          printWarning$1(
            'Failed ' +
              location +
              ' type: ' +
              error.message +
              (stack != null ? stack : '')
          )
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes$1.resetWarningCache = function () {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {}
  }
}

var checkPropTypes_1 = checkPropTypes$1

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactIs$1 = reactIs$1.exports
var assign = require$$1__default['default']

var ReactPropTypesSecret$1 = ReactPropTypesSecret_1
var checkPropTypes = checkPropTypes_1

var has = Function.call.bind(Object.prototype.hasOwnProperty)
var printWarning = function () {}

if (process.env.NODE_ENV !== 'production') {
  printWarning = function (text) {
    var message = 'Warning: ' + text
    if (typeof console !== 'undefined') {
      console.error(message)
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message)
    } catch (x) {}
  }
}

function emptyFunctionThatReturnsNull() {
  return null
}

var factoryWithTypeCheckers = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator
  var FAUX_ITERATOR_SYMBOL = '@@iterator' // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn =
      maybeIterable &&
      ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
        maybeIterable[FAUX_ITERATOR_SYMBOL])
    if (typeof iteratorFn === 'function') {
      return iteratorFn
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>'

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  }

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message
    this.stack = ''
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {}
      var manualPropTypeWarningCount = 0
    }
    function checkType(
      isRequired,
      props,
      propName,
      componentName,
      location,
      propFullName,
      secret
    ) {
      componentName = componentName || ANONYMOUS
      propFullName = propFullName || propName

      if (secret !== ReactPropTypesSecret$1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
          )
          err.name = 'Invariant Violation'
          throw err
        } else if (
          process.env.NODE_ENV !== 'production' &&
          typeof console !== 'undefined'
        ) {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
                'function for the `' +
                propFullName +
                '` prop on `' +
                componentName +
                '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' +
                'for details.'
            )
            manualPropTypeCallCache[cacheKey] = true
            manualPropTypeWarningCount++
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError(
              'The ' +
                location +
                ' `' +
                propFullName +
                '` is marked as required ' +
                ('in `' + componentName + '`, but its value is `null`.')
            )
          }
          return new PropTypeError(
            'The ' +
              location +
              ' `' +
              propFullName +
              '` is marked as required in ' +
              ('`' + componentName + '`, but its value is `undefined`.')
          )
        }
        return null
      } else {
        return validate(props, propName, componentName, location, propFullName)
      }
    }

    var chainedCheckType = checkType.bind(null, false)
    chainedCheckType.isRequired = checkType.bind(null, true)

    return chainedCheckType
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(
      props,
      propName,
      componentName,
      location,
      propFullName,
      secret
    ) {
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue)

        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              preciseType +
              '` supplied to `' +
              componentName +
              '`, expected ') +
            ('`' + expectedType + '`.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull)
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError(
          'Property `' +
            propFullName +
            '` of component `' +
            componentName +
            '` has invalid PropType notation inside arrayOf.'
        )
      }
      var propValue = props[propName]
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue)
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected an array.')
        )
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(
          propValue,
          i,
          componentName,
          location,
          propFullName + '[' + i + ']',
          ReactPropTypesSecret$1
        )
        if (error instanceof Error) {
          return error
        }
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue)
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected a single ReactElement.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      if (!ReactIs$1.isValidElementType(propValue)) {
        var propType = getPropType(propValue)
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected a single ReactElement type.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS
        var actualClassName = getClassName(props[propName])
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              actualClassName +
              '` supplied to `' +
              componentName +
              '`, expected ') +
            ('instance of `' + expectedClassName + '`.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' +
              arguments.length +
              ' arguments. ' +
              'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          )
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.')
        }
      }
      return emptyFunctionThatReturnsNull
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null
        }
      }

      var valuesString = JSON.stringify(
        expectedValues,
        function replacer(key, value) {
          var type = getPreciseType(value)
          if (type === 'symbol') {
            return String(value)
          }
          return value
        }
      )
      return new PropTypeError(
        'Invalid ' +
          location +
          ' `' +
          propFullName +
          '` of value `' +
          String(propValue) +
          '` ' +
          ('supplied to `' +
            componentName +
            '`, expected one of ' +
            valuesString +
            '.')
      )
    }
    return createChainableTypeChecker(validate)
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError(
          'Property `' +
            propFullName +
            '` of component `' +
            componentName +
            '` has invalid PropType notation inside objectOf.'
        )
      }
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected an object.')
        )
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(
            propValue,
            key,
            componentName,
            location,
            propFullName + '.' + key,
            ReactPropTypesSecret$1
          )
          if (error instanceof Error) {
            return error
          }
        }
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production'
        ? printWarning(
            'Invalid argument supplied to oneOfType, expected an instance of array.'
          )
        : void 0
      return emptyFunctionThatReturnsNull
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i]
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' +
            getPostfixForTypeWarning(checker) +
            ' at index ' +
            i +
            '.'
        )
        return emptyFunctionThatReturnsNull
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i]
        if (
          checker(
            props,
            propName,
            componentName,
            location,
            propFullName,
            ReactPropTypesSecret$1
          ) == null
        ) {
          return null
        }
      }

      return new PropTypeError(
        'Invalid ' +
          location +
          ' `' +
          propFullName +
          '` supplied to ' +
          ('`' + componentName + '`.')
      )
    }
    return createChainableTypeChecker(validate)
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` supplied to ' +
            ('`' + componentName + '`, expected a ReactNode.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type `' +
            propType +
            '` ' +
            ('supplied to `' + componentName + '`, expected `object`.')
        )
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key]
        if (!checker) {
          continue
        }
        var error = checker(
          propValue,
          key,
          componentName,
          location,
          propFullName + '.' + key,
          ReactPropTypesSecret$1
        )
        if (error) {
          return error
        }
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type `' +
            propType +
            '` ' +
            ('supplied to `' + componentName + '`, expected `object`.')
        )
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes)
      for (var key in allKeys) {
        var checker = shapeTypes[key]
        if (!checker) {
          return new PropTypeError(
            'Invalid ' +
              location +
              ' `' +
              propFullName +
              '` key `' +
              key +
              '` supplied to `' +
              componentName +
              '`.' +
              '\nBad object: ' +
              JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' +
              JSON.stringify(Object.keys(shapeTypes), null, '  ')
          )
        }
        var error = checker(
          propValue,
          key,
          componentName,
          location,
          propFullName + '.' + key,
          ReactPropTypesSecret$1
        )
        if (error) {
          return error
        }
      }
      return null
    }

    return createChainableTypeChecker(validate)
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true
      case 'boolean':
        return !propValue
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode)
        }
        if (propValue === null || isValidElement(propValue)) {
          return true
        }

        var iteratorFn = getIteratorFn(propValue)
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue)
          var step
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value
              if (entry) {
                if (!isNode(entry[1])) {
                  return false
                }
              }
            }
          }
        } else {
          return false
        }

        return true
      default:
        return false
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true
    }

    return false
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue
    if (Array.isArray(propValue)) {
      return 'array'
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object'
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol'
    }
    return propType
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue
    }
    var propType = getPropType(propValue)
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date'
      } else if (propValue instanceof RegExp) {
        return 'regexp'
      }
    }
    return propType
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value)
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type
      default:
        return type
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS
    }
    return propValue.constructor.name
  }

  ReactPropTypes.checkPropTypes = checkPropTypes
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache
  ReactPropTypes.PropTypes = ReactPropTypes

  return ReactPropTypes
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = ReactPropTypesSecret_1

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction

var factoryWithThrowingShims = function () {
  function shim(
    props,
    propName,
    componentName,
    location,
    propFullName,
    secret
  ) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
    )
    err.name = 'Invariant Violation'
    throw err
  }
  shim.isRequired = shim
  function getShim() {
    return shim
  } // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  }

  ReactPropTypes.PropTypes = ReactPropTypes

  return ReactPropTypes
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs$1.exports

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true
  propTypes.exports = factoryWithTypeCheckers(
    ReactIs.isElement,
    throwOnDirectAccess
  )
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  propTypes.exports = factoryWithThrowingShims()
}

var PropTypes = propTypes.exports

/** @license MUI v5.1.1
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function styled$1(tag, options) {
  const stylesFactory = emStyled(tag, options)

  if (process.env.NODE_ENV !== 'production') {
    return (...styles) => {
      const component = typeof tag === 'string' ? `"${tag}"` : 'component'

      if (styles.length === 0) {
        console.error(
          [
            `MUI: Seems like you called \`styled(${component})()\` without a \`style\` argument.`,
            'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'
          ].join('\n')
        )
      } else if (styles.some((style) => style === undefined)) {
        console.error(
          `MUI: the styled(${component})(...args) API requires all its args to be defined.`
        )
      }

      return stylesFactory(...styles)
    }
  }

  return stylesFactory
}

const responsivePropType =
  process.env.NODE_ENV !== 'production'
    ? PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
      ])
    : {}

function chainPropTypes(propType1, propType2) {
  if (process.env.NODE_ENV === 'production') {
    return () => null
  }

  return function validate(...args) {
    return propType1(...args) || propType2(...args)
  }
}

function isPlainObject(item) {
  return (
    item !== null &&
    typeof item === 'object' && // TS thinks `item is possibly null` even though this was our first guard.
    // @ts-expect-error
    item.constructor === Object
  )
}
function deepmerge(
  target,
  source,
  options = {
    clone: true
  }
) {
  const output = options.clone ? _extends({}, target) : target

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      // Avoid prototype pollution
      if (key === '__proto__') {
        return
      }

      if (
        isPlainObject(source[key]) &&
        key in target &&
        isPlainObject(target[key])
      ) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        output[key] = deepmerge(target[key], source[key], options)
      } else {
        output[key] = source[key]
      }
    })
  }

  return output
}

function isClassComponent(elementType) {
  // elementType.prototype?.isReactComponent
  const { prototype = {} } = elementType
  return Boolean(prototype.isReactComponent)
}

function elementTypeAcceptingRef(
  props,
  propName,
  componentName,
  location,
  propFullName
) {
  const propValue = props[propName]
  const safePropName = propFullName || propName

  if (
    propValue == null || // When server-side rendering React doesn't warn either.
    // This is not an accurate check for SSR.
    // This is only in place for emotion compat.
    // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
    typeof window === 'undefined'
  ) {
    return null
  }

  let warningHint
  /**
   * Blacklisting instead of whitelisting
   *
   * Blacklisting will miss some components, such as React.Fragment. Those will at least
   * trigger a warning in React.
   * We can't whitelist because there is no safe way to detect React.forwardRef
   * or class components. "Safe" means there's no public API.
   *
   */

  if (typeof propValue === 'function' && !isClassComponent(propValue)) {
    warningHint =
      'Did you accidentally provide a plain function component instead?'
  }

  if (warningHint !== undefined) {
    return new Error(
      `Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. ` +
        `Expected an element type that can hold a ref. ${warningHint} ` +
        'For more information see https://mui.com/r/caveat-with-refs-guide'
    )
  }

  return null
}

var elementTypeAcceptingRef$1 = chainPropTypes(
  PropTypes.elementType,
  elementTypeAcceptingRef
)

/**
 * WARNING: Don't import this directly.
 * Use `MuiError` from `@mui/utils/macros/MuiError.macro` instead.
 * @param {number} code
 */
function formatMuiErrorMessage(code) {
  // Apply babel-plugin-transform-template-literals in loose mode
  // loose mode is safe iff we're concatenating primitives
  // see https://babeljs.io/docs/en/babel-plugin-transform-template-literals#loose

  /* eslint-disable prefer-template */
  let url = 'https://mui.com/production-error/?code=' + code

  for (let i = 1; i < arguments.length; i += 1) {
    // rest params over-transpile for this case
    // eslint-disable-next-line prefer-rest-params
    url += '&args[]=' + encodeURIComponent(arguments[i])
  }

  return (
    'Minified MUI error #' + code + '; visit ' + url + ' for the full message.'
  )
  /* eslint-enable prefer-template */
}

var reactIs = { exports: {} }

var reactIs_production_min = {}

/** @license React v17.0.2
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b = 60103,
  c = 60106,
  d = 60107,
  e = 60108,
  f = 60114,
  g = 60109,
  h = 60110,
  k = 60112,
  l = 60113,
  m = 60120,
  n = 60115,
  p = 60116,
  q = 60121,
  r = 60122,
  u = 60117,
  v = 60129,
  w = 60131
if ('function' === typeof Symbol && Symbol.for) {
  var x = Symbol.for
  b = x('react.element')
  c = x('react.portal')
  d = x('react.fragment')
  e = x('react.strict_mode')
  f = x('react.profiler')
  g = x('react.provider')
  h = x('react.context')
  k = x('react.forward_ref')
  l = x('react.suspense')
  m = x('react.suspense_list')
  n = x('react.memo')
  p = x('react.lazy')
  q = x('react.block')
  r = x('react.server.block')
  u = x('react.fundamental')
  v = x('react.debug_trace_mode')
  w = x('react.legacy_hidden')
}
function y(a) {
  if ('object' === typeof a && null !== a) {
    var t = a.$$typeof
    switch (t) {
      case b:
        switch (((a = a.type), a)) {
          case d:
          case f:
          case e:
          case l:
          case m:
            return a
          default:
            switch (((a = a && a.$$typeof), a)) {
              case h:
              case k:
              case p:
              case n:
              case g:
                return a
              default:
                return t
            }
        }
      case c:
        return t
    }
  }
}
var z = g,
  A = b,
  B = k,
  C = d,
  D = p,
  E = n,
  F = c,
  G = f,
  H = e,
  I = l
reactIs_production_min.ContextConsumer = h
reactIs_production_min.ContextProvider = z
reactIs_production_min.Element = A
reactIs_production_min.ForwardRef = B
reactIs_production_min.Fragment = C
reactIs_production_min.Lazy = D
reactIs_production_min.Memo = E
reactIs_production_min.Portal = F
reactIs_production_min.Profiler = G
reactIs_production_min.StrictMode = H
reactIs_production_min.Suspense = I
reactIs_production_min.isAsyncMode = function () {
  return !1
}
reactIs_production_min.isConcurrentMode = function () {
  return !1
}
reactIs_production_min.isContextConsumer = function (a) {
  return y(a) === h
}
reactIs_production_min.isContextProvider = function (a) {
  return y(a) === g
}
reactIs_production_min.isElement = function (a) {
  return 'object' === typeof a && null !== a && a.$$typeof === b
}
reactIs_production_min.isForwardRef = function (a) {
  return y(a) === k
}
reactIs_production_min.isFragment = function (a) {
  return y(a) === d
}
reactIs_production_min.isLazy = function (a) {
  return y(a) === p
}
reactIs_production_min.isMemo = function (a) {
  return y(a) === n
}
reactIs_production_min.isPortal = function (a) {
  return y(a) === c
}
reactIs_production_min.isProfiler = function (a) {
  return y(a) === f
}
reactIs_production_min.isStrictMode = function (a) {
  return y(a) === e
}
reactIs_production_min.isSuspense = function (a) {
  return y(a) === l
}
reactIs_production_min.isValidElementType = function (a) {
  return 'string' === typeof a ||
    'function' === typeof a ||
    a === d ||
    a === f ||
    a === v ||
    a === e ||
    a === l ||
    a === m ||
    a === w ||
    ('object' === typeof a &&
      null !== a &&
      (a.$$typeof === p ||
        a.$$typeof === n ||
        a.$$typeof === g ||
        a.$$typeof === h ||
        a.$$typeof === k ||
        a.$$typeof === u ||
        a.$$typeof === q ||
        a[0] === r))
    ? !0
    : !1
}
reactIs_production_min.typeOf = y

var reactIs_development = {}

/** @license React v17.0.2
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  ;(function () {
    // ATTENTION
    // When adding new symbols to this file,
    // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var REACT_ELEMENT_TYPE = 0xeac7
    var REACT_PORTAL_TYPE = 0xeaca
    var REACT_FRAGMENT_TYPE = 0xeacb
    var REACT_STRICT_MODE_TYPE = 0xeacc
    var REACT_PROFILER_TYPE = 0xead2
    var REACT_PROVIDER_TYPE = 0xeacd
    var REACT_CONTEXT_TYPE = 0xeace
    var REACT_FORWARD_REF_TYPE = 0xead0
    var REACT_SUSPENSE_TYPE = 0xead1
    var REACT_SUSPENSE_LIST_TYPE = 0xead8
    var REACT_MEMO_TYPE = 0xead3
    var REACT_LAZY_TYPE = 0xead4
    var REACT_BLOCK_TYPE = 0xead9
    var REACT_SERVER_BLOCK_TYPE = 0xeada
    var REACT_FUNDAMENTAL_TYPE = 0xead5
    var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1
    var REACT_LEGACY_HIDDEN_TYPE = 0xeae3

    if (typeof Symbol === 'function' && Symbol.for) {
      var symbolFor = Symbol.for
      REACT_ELEMENT_TYPE = symbolFor('react.element')
      REACT_PORTAL_TYPE = symbolFor('react.portal')
      REACT_FRAGMENT_TYPE = symbolFor('react.fragment')
      REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode')
      REACT_PROFILER_TYPE = symbolFor('react.profiler')
      REACT_PROVIDER_TYPE = symbolFor('react.provider')
      REACT_CONTEXT_TYPE = symbolFor('react.context')
      REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref')
      REACT_SUSPENSE_TYPE = symbolFor('react.suspense')
      REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list')
      REACT_MEMO_TYPE = symbolFor('react.memo')
      REACT_LAZY_TYPE = symbolFor('react.lazy')
      REACT_BLOCK_TYPE = symbolFor('react.block')
      REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block')
      REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental')
      symbolFor('react.scope')
      symbolFor('react.opaque.id')
      REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode')
      symbolFor('react.offscreen')
      REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden')
    }

    // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

    var enableScopeAPI = false // Experimental Create Event Handle API.

    function isValidElementType(type) {
      if (typeof type === 'string' || typeof type === 'function') {
        return true
      } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

      if (
        type === REACT_FRAGMENT_TYPE ||
        type === REACT_PROFILER_TYPE ||
        type === REACT_DEBUG_TRACING_MODE_TYPE ||
        type === REACT_STRICT_MODE_TYPE ||
        type === REACT_SUSPENSE_TYPE ||
        type === REACT_SUSPENSE_LIST_TYPE ||
        type === REACT_LEGACY_HIDDEN_TYPE ||
        enableScopeAPI
      ) {
        return true
      }

      if (typeof type === 'object' && type !== null) {
        if (
          type.$$typeof === REACT_LAZY_TYPE ||
          type.$$typeof === REACT_MEMO_TYPE ||
          type.$$typeof === REACT_PROVIDER_TYPE ||
          type.$$typeof === REACT_CONTEXT_TYPE ||
          type.$$typeof === REACT_FORWARD_REF_TYPE ||
          type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
          type.$$typeof === REACT_BLOCK_TYPE ||
          type[0] === REACT_SERVER_BLOCK_TYPE
        ) {
          return true
        }
      }

      return false
    }

    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof

        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type

            switch (type) {
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
              case REACT_SUSPENSE_LIST_TYPE:
                return type

              default:
                var $$typeofType = type && type.$$typeof

                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType

                  default:
                    return $$typeof
                }
            }

          case REACT_PORTAL_TYPE:
            return $$typeof
        }
      }

      return undefined
    }
    var ContextConsumer = REACT_CONTEXT_TYPE
    var ContextProvider = REACT_PROVIDER_TYPE
    var Element = REACT_ELEMENT_TYPE
    var ForwardRef = REACT_FORWARD_REF_TYPE
    var Fragment = REACT_FRAGMENT_TYPE
    var Lazy = REACT_LAZY_TYPE
    var Memo = REACT_MEMO_TYPE
    var Portal = REACT_PORTAL_TYPE
    var Profiler = REACT_PROFILER_TYPE
    var StrictMode = REACT_STRICT_MODE_TYPE
    var Suspense = REACT_SUSPENSE_TYPE
    var hasWarnedAboutDeprecatedIsAsyncMode = false
    var hasWarnedAboutDeprecatedIsConcurrentMode = false // AsyncMode should be deprecated

    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true // Using console['warn'] to evade Babel and ESLint

          console['warn'](
            'The ReactIs.isAsyncMode() alias has been deprecated, ' +
              'and will be removed in React 18+.'
          )
        }
      }

      return false
    }
    function isConcurrentMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
          hasWarnedAboutDeprecatedIsConcurrentMode = true // Using console['warn'] to evade Babel and ESLint

          console['warn'](
            'The ReactIs.isConcurrentMode() alias has been deprecated, ' +
              'and will be removed in React 18+.'
          )
        }
      }

      return false
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE
    }
    function isElement(object) {
      return (
        typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE
      )
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE
    }

    reactIs_development.ContextConsumer = ContextConsumer
    reactIs_development.ContextProvider = ContextProvider
    reactIs_development.Element = Element
    reactIs_development.ForwardRef = ForwardRef
    reactIs_development.Fragment = Fragment
    reactIs_development.Lazy = Lazy
    reactIs_development.Memo = Memo
    reactIs_development.Portal = Portal
    reactIs_development.Profiler = Profiler
    reactIs_development.StrictMode = StrictMode
    reactIs_development.Suspense = Suspense
    reactIs_development.isAsyncMode = isAsyncMode
    reactIs_development.isConcurrentMode = isConcurrentMode
    reactIs_development.isContextConsumer = isContextConsumer
    reactIs_development.isContextProvider = isContextProvider
    reactIs_development.isElement = isElement
    reactIs_development.isForwardRef = isForwardRef
    reactIs_development.isFragment = isFragment
    reactIs_development.isLazy = isLazy
    reactIs_development.isMemo = isMemo
    reactIs_development.isPortal = isPortal
    reactIs_development.isProfiler = isProfiler
    reactIs_development.isStrictMode = isStrictMode
    reactIs_development.isSuspense = isSuspense
    reactIs_development.isValidElementType = isValidElementType
    reactIs_development.typeOf = typeOf
  })()
}

if (process.env.NODE_ENV === 'production') {
  reactIs.exports = reactIs_production_min
} else {
  reactIs.exports = reactIs_development
}

// https://github.com/JamesMGreene/Function.name/blob/58b314d4a983110c3682f1228f845d39ccca1817/Function.name.js#L3

const fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/
function getFunctionName(fn) {
  const match = `${fn}`.match(fnNameMatchRegex)
  const name = match && match[1]
  return name || ''
}

function getFunctionComponentName(Component, fallback = '') {
  return (
    Component.displayName ||
    Component.name ||
    getFunctionName(Component) ||
    fallback
  )
}

function getWrappedName(outerType, innerType, wrapperName) {
  const functionName = getFunctionComponentName(innerType)
  return (
    outerType.displayName ||
    (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName)
  )
}
/**
 * cherry-pick from
 * https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/shared/getComponentName.js
 * originally forked from recompose/getDisplayName with added IE11 support
 */

function getDisplayName(Component) {
  if (Component == null) {
    return undefined
  }

  if (typeof Component === 'string') {
    return Component
  }

  if (typeof Component === 'function') {
    return getFunctionComponentName(Component, 'Component')
  } // TypeScript can't have components as objects but they exist in the form of `memo` or `Suspense`

  if (typeof Component === 'object') {
    switch (Component.$$typeof) {
      case reactIs.exports.ForwardRef:
        return getWrappedName(Component, Component.render, 'ForwardRef')

      case reactIs.exports.Memo:
        return getWrappedName(Component, Component.type, 'memo')

      default:
        return undefined
    }
  }

  return undefined
}

const refType = PropTypes.oneOfType([PropTypes.func, PropTypes.object])
var refType$1 = refType

// It should to be noted that this function isn't equivalent to `text-transform: capitalize`.
//
// A strict capitalization should uppercase the first letter of each word in the sentence.
// We only handle the first word.
function capitalize(string) {
  if (typeof string !== 'string') {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `MUI: \`capitalize(string)\` expects a string argument.`
        : formatMuiErrorMessage(7)
    )
  }

  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * TODO v5: consider making it private
 *
 * passes {value} to {ref}
 *
 * WARNING: Be sure to only call this inside a callback that is passed as a ref.
 * Otherwise, make sure to cleanup the previous {ref} if it changes. See
 * https://github.com/mui-org/material-ui/issues/13539
 *
 * Useful if you want to expose the ref of an inner component to the public API
 * while still using it inside the component.
 * @param ref A ref callback or ref object. If anything falsy, this is a no-op.
 */
function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

const useEnhancedEffect =
  typeof window !== 'undefined'
    ? react.exports.useLayoutEffect
    : react.exports.useEffect
var useEnhancedEffect$1 = useEnhancedEffect

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */

function useEventCallback(fn) {
  const ref = react.exports.useRef(fn)
  useEnhancedEffect$1(() => {
    ref.current = fn
  })
  return react.exports.useCallback(
    (
      ...args // @ts-expect-error hide `this`
    ) =>
      // tslint:disable-next-line:ban-comma-operator
      (0, ref.current)(...args),
    []
  )
}

function useForkRef(refA, refB) {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */
  return react.exports.useMemo(() => {
    if (refA == null && refB == null) {
      return null
    }

    return (refValue) => {
      setRef(refA, refValue)
      setRef(refB, refValue)
    }
  }, [refA, refB])
}

// based on https://github.com/WICG/focus-visible/blob/v4.1.5/src/focus-visible.js
let hadKeyboardEvent = true
let hadFocusVisibleRecently = false
let hadFocusVisibleRecentlyTimeout = null
const inputTypesWhitelist = {
  'text': true,
  'search': true,
  'url': true,
  'tel': true,
  'email': true,
  'password': true,
  'number': true,
  'date': true,
  'month': true,
  'week': true,
  'time': true,
  'datetime': true,
  'datetime-local': true
}
/**
 * Computes whether the given element should automatically trigger the
 * `focus-visible` class being added, i.e. whether it should always match
 * `:focus-visible` when focused.
 * @param {Element} node
 * @returns {boolean}
 */

function focusTriggersKeyboardModality(node) {
  const { type, tagName } = node

  if (tagName === 'INPUT' && inputTypesWhitelist[type] && !node.readOnly) {
    return true
  }

  if (tagName === 'TEXTAREA' && !node.readOnly) {
    return true
  }

  if (node.isContentEditable) {
    return true
  }

  return false
}
/**
 * Keep track of our keyboard modality state with `hadKeyboardEvent`.
 * If the most recent user interaction was via the keyboard;
 * and the key press did not include a meta, alt/option, or control key;
 * then the modality is keyboard. Otherwise, the modality is not keyboard.
 * @param {KeyboardEvent} event
 */

function handleKeyDown(event) {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return
  }

  hadKeyboardEvent = true
}
/**
 * If at any point a user clicks with a pointing device, ensure that we change
 * the modality away from keyboard.
 * This avoids the situation where a user presses a key on an already focused
 * element, and then clicks on a different element, focusing it with a
 * pointing device, while we still think we're in keyboard modality.
 */

function handlePointerDown() {
  hadKeyboardEvent = false
}

function handleVisibilityChange() {
  if (this.visibilityState === 'hidden') {
    // If the tab becomes active again, the browser will handle calling focus
    // on the element (Safari actually calls it twice).
    // If this tab change caused a blur on an element with focus-visible,
    // re-apply the class when the user switches back to the tab.
    if (hadFocusVisibleRecently) {
      hadKeyboardEvent = true
    }
  }
}

function prepare(doc) {
  doc.addEventListener('keydown', handleKeyDown, true)
  doc.addEventListener('mousedown', handlePointerDown, true)
  doc.addEventListener('pointerdown', handlePointerDown, true)
  doc.addEventListener('touchstart', handlePointerDown, true)
  doc.addEventListener('visibilitychange', handleVisibilityChange, true)
}

function isFocusVisible(event) {
  const { target } = event

  try {
    return target.matches(':focus-visible')
  } catch (error) {
    // Browsers not implementing :focus-visible will throw a SyntaxError.
    // We use our own heuristic for those browsers.
    // Rethrow might be better if it's not the expected error but do we really
    // want to crash if focus-visible malfunctioned?
  } // No need for validFocusTarget check. The user does that by attaching it to
  // focusable events only.

  return hadKeyboardEvent || focusTriggersKeyboardModality(target)
}

function useIsFocusVisible() {
  const ref = react.exports.useCallback((node) => {
    if (node != null) {
      prepare(node.ownerDocument)
    }
  }, [])
  const isFocusVisibleRef = react.exports.useRef(false)
  /**
   * Should be called if a blur event is fired
   */

  function handleBlurVisible() {
    // checking against potential state variable does not suffice if we focus and blur synchronously.
    // React wouldn't have time to trigger a re-render so `focusVisible` would be stale.
    // Ideally we would adjust `isFocusVisible(event)` to look at `relatedTarget` for blur events.
    // This doesn't work in IE11 due to https://github.com/facebook/react/issues/3751
    // TODO: check again if React releases their internal changes to focus event handling (https://github.com/facebook/react/pull/19186).
    if (isFocusVisibleRef.current) {
      // To detect a tab/window switch, we look for a blur event followed
      // rapidly by a visibility change.
      // If we don't see a visibility change within 100ms, it's probably a
      // regular focus change.
      hadFocusVisibleRecently = true
      window.clearTimeout(hadFocusVisibleRecentlyTimeout)
      hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false
      }, 100)
      isFocusVisibleRef.current = false
      return true
    }

    return false
  }
  /**
   * Should be called if a blur event is fired
   */

  function handleFocusVisible(event) {
    if (isFocusVisible(event)) {
      isFocusVisibleRef.current = true
      return true
    }

    return false
  }

  return {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref
  }
}

function merge(acc, item) {
  if (!item) {
    return acc
  }

  return deepmerge(acc, item, {
    clone: false // No need to clone deep, it's way faster.
  })
}

// For instance with the first breakpoint xs: [xs, sm[.

const values$1 = {
  xs: 0,
  // phone
  sm: 600,
  // tablet
  md: 900,
  // small laptop
  lg: 1200,
  // desktop
  xl: 1536 // large screen
}
const defaultBreakpoints = {
  // Sorted ASC by size. That's important.
  // It can't be configured as it's used statically for propTypes.
  keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  up: (key) => `@media (min-width:${values$1[key]}px)`
}
function handleBreakpoints(props, propValue, styleFromPropValue) {
  const theme = props.theme || {}

  if (Array.isArray(propValue)) {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints
    return propValue.reduce((acc, item, index) => {
      acc[themeBreakpoints.up(themeBreakpoints.keys[index])] =
        styleFromPropValue(propValue[index])
      return acc
    }, {})
  }

  if (typeof propValue === 'object') {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints
    return Object.keys(propValue).reduce((acc, breakpoint) => {
      // key is breakpoint
      if (
        Object.keys(themeBreakpoints.values || values$1).indexOf(breakpoint) !==
        -1
      ) {
        const mediaKey = themeBreakpoints.up(breakpoint)
        acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint)
      } else {
        const cssKey = breakpoint
        acc[cssKey] = propValue[cssKey]
      }

      return acc
    }, {})
  }

  const output = styleFromPropValue(propValue)
  return output
}

function createEmptyBreakpointObject(breakpointsInput = {}) {
  var _breakpointsInput$key

  const breakpointsInOrder =
    breakpointsInput == null
      ? void 0
      : (_breakpointsInput$key = breakpointsInput.keys) == null
      ? void 0
      : _breakpointsInput$key.reduce((acc, key) => {
          const breakpointStyleKey = breakpointsInput.up(key)
          acc[breakpointStyleKey] = {}
          return acc
        }, {})
  return breakpointsInOrder || {}
}
function removeUnusedBreakpoints(breakpointKeys, style) {
  return breakpointKeys.reduce((acc, key) => {
    const breakpointOutput = acc[key]
    const isBreakpointUnused = Object.keys(breakpointOutput).length === 0

    if (isBreakpointUnused) {
      delete acc[key]
    }

    return acc
  }, style)
}

function getPath(obj, path) {
  if (!path || typeof path !== 'string') {
    return null
  }

  return path
    .split('.')
    .reduce((acc, item) => (acc && acc[item] ? acc[item] : null), obj)
}

function getValue$1(
  themeMapping,
  transform,
  propValueFinal,
  userValue = propValueFinal
) {
  let value

  if (typeof themeMapping === 'function') {
    value = themeMapping(propValueFinal)
  } else if (Array.isArray(themeMapping)) {
    value = themeMapping[propValueFinal] || userValue
  } else {
    value = getPath(themeMapping, propValueFinal) || userValue
  }

  if (transform) {
    value = transform(value)
  }

  return value
}

function style$1(options) {
  const { prop, cssProperty = options.prop, themeKey, transform } = options

  const fn = (props) => {
    if (props[prop] == null) {
      return null
    }

    const propValue = props[prop]
    const theme = props.theme
    const themeMapping = getPath(theme, themeKey) || {}

    const styleFromPropValue = (propValueFinal) => {
      let value = getValue$1(themeMapping, transform, propValueFinal)

      if (propValueFinal === value && typeof propValueFinal === 'string') {
        // Haven't found value
        value = getValue$1(
          themeMapping,
          transform,
          `${prop}${
            propValueFinal === 'default' ? '' : capitalize(propValueFinal)
          }`,
          propValueFinal
        )
      }

      if (cssProperty === false) {
        return value
      }

      return {
        [cssProperty]: value
      }
    }

    return handleBreakpoints(props, propValue, styleFromPropValue)
  }

  fn.propTypes =
    process.env.NODE_ENV !== 'production'
      ? {
          [prop]: responsivePropType
        }
      : {}
  fn.filterProps = [prop]
  return fn
}

function compose(...styles) {
  const handlers = styles.reduce((acc, style) => {
    style.filterProps.forEach((prop) => {
      acc[prop] = style
    })
    return acc
  }, {})

  const fn = (props) => {
    return Object.keys(props).reduce((acc, prop) => {
      if (handlers[prop]) {
        return merge(acc, handlers[prop](props))
      }

      return acc
    }, {})
  }

  fn.propTypes =
    process.env.NODE_ENV !== 'production'
      ? styles.reduce((acc, style) => Object.assign(acc, style.propTypes), {})
      : {}
  fn.filterProps = styles.reduce(
    (acc, style) => acc.concat(style.filterProps),
    []
  )
  return fn
}

function memoize(fn) {
  const cache = {}
  return (arg) => {
    if (cache[arg] === undefined) {
      cache[arg] = fn(arg)
    }

    return cache[arg]
  }
}

const properties = {
  m: 'margin',
  p: 'padding'
}
const directions = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom']
}
const aliases = {
  marginX: 'mx',
  marginY: 'my',
  paddingX: 'px',
  paddingY: 'py'
} // memoize() impact:
// From 300,000 ops/sec
// To 350,000 ops/sec

const getCssProperties = memoize((prop) => {
  // It's not a shorthand notation.
  if (prop.length > 2) {
    if (aliases[prop]) {
      prop = aliases[prop]
    } else {
      return [prop]
    }
  }

  const [a, b] = prop.split('')
  const property = properties[a]
  const direction = directions[b] || ''
  return Array.isArray(direction)
    ? direction.map((dir) => property + dir)
    : [property + direction]
})
const marginKeys = [
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginX',
  'marginY',
  'marginInline',
  'marginInlineStart',
  'marginInlineEnd',
  'marginBlock',
  'marginBlockStart',
  'marginBlockEnd'
]
const paddingKeys = [
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingX',
  'paddingY',
  'paddingInline',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingBlock',
  'paddingBlockStart',
  'paddingBlockEnd'
]
const spacingKeys = [...marginKeys, ...paddingKeys]
function createUnaryUnit(theme, themeKey, defaultValue, propName) {
  const themeSpacing = getPath(theme, themeKey) || defaultValue

  if (typeof themeSpacing === 'number') {
    return (abs) => {
      if (typeof abs === 'string') {
        return abs
      }

      if (process.env.NODE_ENV !== 'production') {
        if (typeof abs !== 'number') {
          console.error(
            `MUI: Expected ${propName} argument to be a number or a string, got ${abs}.`
          )
        }
      }

      return themeSpacing * abs
    }
  }

  if (Array.isArray(themeSpacing)) {
    return (abs) => {
      if (typeof abs === 'string') {
        return abs
      }

      if (process.env.NODE_ENV !== 'production') {
        if (!Number.isInteger(abs)) {
          console.error(
            [
              `MUI: The \`theme.${themeKey}\` array type cannot be combined with non integer values.` +
                `You should either use an integer value that can be used as index, or define the \`theme.${themeKey}\` as a number.`
            ].join('\n')
          )
        } else if (abs > themeSpacing.length - 1) {
          console.error(
            [
              `MUI: The value provided (${abs}) overflows.`,
              `The supported values are: ${JSON.stringify(themeSpacing)}.`,
              `${abs} > ${
                themeSpacing.length - 1
              }, you need to add the missing values.`
            ].join('\n')
          )
        }
      }

      return themeSpacing[abs]
    }
  }

  if (typeof themeSpacing === 'function') {
    return themeSpacing
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(
      [
        `MUI: The \`theme.${themeKey}\` value (${themeSpacing}) is invalid.`,
        'It should be a number, an array or a function.'
      ].join('\n')
    )
  }

  return () => undefined
}
function createUnarySpacing(theme) {
  return createUnaryUnit(theme, 'spacing', 8, 'spacing')
}
function getValue(transformer, propValue) {
  if (typeof propValue === 'string' || propValue == null) {
    return propValue
  }

  const abs = Math.abs(propValue)
  const transformed = transformer(abs)

  if (propValue >= 0) {
    return transformed
  }

  if (typeof transformed === 'number') {
    return -transformed
  }

  return `-${transformed}`
}
function getStyleFromPropValue(cssProperties, transformer) {
  return (propValue) =>
    cssProperties.reduce((acc, cssProperty) => {
      acc[cssProperty] = getValue(transformer, propValue)
      return acc
    }, {})
}

function resolveCssProperty(props, keys, prop, transformer) {
  // Using a hash computation over an array iteration could be faster, but with only 28 items,
  // it's doesn't worth the bundle size.
  if (keys.indexOf(prop) === -1) {
    return null
  }

  const cssProperties = getCssProperties(prop)
  const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer)
  const propValue = props[prop]
  return handleBreakpoints(props, propValue, styleFromPropValue)
}

function style(props, keys) {
  const transformer = createUnarySpacing(props.theme)
  return Object.keys(props)
    .map((prop) => resolveCssProperty(props, keys, prop, transformer))
    .reduce(merge, {})
}
process.env.NODE_ENV !== 'production'
  ? marginKeys.reduce((obj, key) => {
      obj[key] = responsivePropType
      return obj
    }, {})
  : {}
process.env.NODE_ENV !== 'production'
  ? paddingKeys.reduce((obj, key) => {
      obj[key] = responsivePropType
      return obj
    }, {})
  : {}

function spacing(props) {
  return style(props, spacingKeys)
}

spacing.propTypes =
  process.env.NODE_ENV !== 'production'
    ? spacingKeys.reduce((obj, key) => {
        obj[key] = responsivePropType
        return obj
      }, {})
    : {}
spacing.filterProps = spacingKeys

function getBorder(value) {
  if (typeof value !== 'number') {
    return value
  }

  return `${value}px solid`
}

const border = style$1({
  prop: 'border',
  themeKey: 'borders',
  transform: getBorder
})
const borderTop = style$1({
  prop: 'borderTop',
  themeKey: 'borders',
  transform: getBorder
})
const borderRight = style$1({
  prop: 'borderRight',
  themeKey: 'borders',
  transform: getBorder
})
const borderBottom = style$1({
  prop: 'borderBottom',
  themeKey: 'borders',
  transform: getBorder
})
const borderLeft = style$1({
  prop: 'borderLeft',
  themeKey: 'borders',
  transform: getBorder
})
const borderColor = style$1({
  prop: 'borderColor',
  themeKey: 'palette'
})
const borderTopColor = style$1({
  prop: 'borderTopColor',
  themeKey: 'palette'
})
const borderRightColor = style$1({
  prop: 'borderRightColor',
  themeKey: 'palette'
})
const borderBottomColor = style$1({
  prop: 'borderBottomColor',
  themeKey: 'palette'
})
const borderLeftColor = style$1({
  prop: 'borderLeftColor',
  themeKey: 'palette'
})
const borderRadius = (props) => {
  if (props.borderRadius !== undefined && props.borderRadius !== null) {
    const transformer = createUnaryUnit(
      props.theme,
      'shape.borderRadius',
      4,
      'borderRadius'
    )

    const styleFromPropValue = (propValue) => ({
      borderRadius: getValue(transformer, propValue)
    })

    return handleBreakpoints(props, props.borderRadius, styleFromPropValue)
  }

  return null
}
borderRadius.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        borderRadius: responsivePropType
      }
    : {}
borderRadius.filterProps = ['borderRadius']
const borders = compose(
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderColor,
  borderTopColor,
  borderRightColor,
  borderBottomColor,
  borderLeftColor,
  borderRadius
)

const displayPrint = style$1({
  prop: 'displayPrint',
  cssProperty: false,
  transform: (value) => ({
    '@media print': {
      display: value
    }
  })
})
const displayRaw = style$1({
  prop: 'display'
})
const overflow = style$1({
  prop: 'overflow'
})
const textOverflow = style$1({
  prop: 'textOverflow'
})
const visibility = style$1({
  prop: 'visibility'
})
const whiteSpace = style$1({
  prop: 'whiteSpace'
})
var display = compose(
  displayPrint,
  displayRaw,
  overflow,
  textOverflow,
  visibility,
  whiteSpace
)

const flexBasis = style$1({
  prop: 'flexBasis'
})
const flexDirection = style$1({
  prop: 'flexDirection'
})
const flexWrap = style$1({
  prop: 'flexWrap'
})
const justifyContent = style$1({
  prop: 'justifyContent'
})
const alignItems = style$1({
  prop: 'alignItems'
})
const alignContent = style$1({
  prop: 'alignContent'
})
const order = style$1({
  prop: 'order'
})
const flex = style$1({
  prop: 'flex'
})
const flexGrow = style$1({
  prop: 'flexGrow'
})
const flexShrink = style$1({
  prop: 'flexShrink'
})
const alignSelf = style$1({
  prop: 'alignSelf'
})
const justifyItems = style$1({
  prop: 'justifyItems'
})
const justifySelf = style$1({
  prop: 'justifySelf'
})
const flexbox = compose(
  flexBasis,
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  alignContent,
  order,
  flex,
  flexGrow,
  flexShrink,
  alignSelf,
  justifyItems,
  justifySelf
)

const gap = (props) => {
  if (props.gap !== undefined && props.gap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8, 'gap')

    const styleFromPropValue = (propValue) => ({
      gap: getValue(transformer, propValue)
    })

    return handleBreakpoints(props, props.gap, styleFromPropValue)
  }

  return null
}
gap.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        gap: responsivePropType
      }
    : {}
gap.filterProps = ['gap']
const columnGap = (props) => {
  if (props.columnGap !== undefined && props.columnGap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8, 'columnGap')

    const styleFromPropValue = (propValue) => ({
      columnGap: getValue(transformer, propValue)
    })

    return handleBreakpoints(props, props.columnGap, styleFromPropValue)
  }

  return null
}
columnGap.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        columnGap: responsivePropType
      }
    : {}
columnGap.filterProps = ['columnGap']
const rowGap = (props) => {
  if (props.rowGap !== undefined && props.rowGap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8, 'rowGap')

    const styleFromPropValue = (propValue) => ({
      rowGap: getValue(transformer, propValue)
    })

    return handleBreakpoints(props, props.rowGap, styleFromPropValue)
  }

  return null
}
rowGap.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        rowGap: responsivePropType
      }
    : {}
rowGap.filterProps = ['rowGap']
const gridColumn = style$1({
  prop: 'gridColumn'
})
const gridRow = style$1({
  prop: 'gridRow'
})
const gridAutoFlow = style$1({
  prop: 'gridAutoFlow'
})
const gridAutoColumns = style$1({
  prop: 'gridAutoColumns'
})
const gridAutoRows = style$1({
  prop: 'gridAutoRows'
})
const gridTemplateColumns = style$1({
  prop: 'gridTemplateColumns'
})
const gridTemplateRows = style$1({
  prop: 'gridTemplateRows'
})
const gridTemplateAreas = style$1({
  prop: 'gridTemplateAreas'
})
const gridArea = style$1({
  prop: 'gridArea'
})
const grid = compose(
  gap,
  columnGap,
  rowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea
)

const color = style$1({
  prop: 'color',
  themeKey: 'palette'
})
const bgcolor = style$1({
  prop: 'bgcolor',
  cssProperty: 'backgroundColor',
  themeKey: 'palette'
})
const backgroundColor = style$1({
  prop: 'backgroundColor',
  themeKey: 'palette'
})
const palette = compose(color, bgcolor, backgroundColor)

const position = style$1({
  prop: 'position'
})
const zIndex$1 = style$1({
  prop: 'zIndex',
  themeKey: 'zIndex'
})
const top = style$1({
  prop: 'top'
})
const right = style$1({
  prop: 'right'
})
const bottom = style$1({
  prop: 'bottom'
})
const left = style$1({
  prop: 'left'
})
var positions = compose(position, zIndex$1, top, right, bottom, left)

const boxShadow = style$1({
  prop: 'boxShadow',
  themeKey: 'shadows'
})

function transform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value
}

const width = style$1({
  prop: 'width',
  transform
})
const maxWidth = (props) => {
  if (props.maxWidth !== undefined && props.maxWidth !== null) {
    const styleFromPropValue = (propValue) => {
      var _props$theme, _props$theme$breakpoi, _props$theme$breakpoi2

      const breakpoint =
        ((_props$theme = props.theme) == null
          ? void 0
          : (_props$theme$breakpoi = _props$theme.breakpoints) == null
          ? void 0
          : (_props$theme$breakpoi2 = _props$theme$breakpoi.values) == null
          ? void 0
          : _props$theme$breakpoi2[propValue]) || values$1[propValue]
      return {
        maxWidth: breakpoint || transform(propValue)
      }
    }

    return handleBreakpoints(props, props.maxWidth, styleFromPropValue)
  }

  return null
}
maxWidth.filterProps = ['maxWidth']
const minWidth = style$1({
  prop: 'minWidth',
  transform
})
const height = style$1({
  prop: 'height',
  transform
})
const maxHeight = style$1({
  prop: 'maxHeight',
  transform
})
const minHeight = style$1({
  prop: 'minHeight',
  transform
})
style$1({
  prop: 'size',
  cssProperty: 'width',
  transform
})
style$1({
  prop: 'size',
  cssProperty: 'height',
  transform
})
const boxSizing = style$1({
  prop: 'boxSizing'
})
const sizing = compose(
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  boxSizing
)

const fontFamily = style$1({
  prop: 'fontFamily',
  themeKey: 'typography'
})
const fontSize = style$1({
  prop: 'fontSize',
  themeKey: 'typography'
})
const fontStyle = style$1({
  prop: 'fontStyle',
  themeKey: 'typography'
})
const fontWeight = style$1({
  prop: 'fontWeight',
  themeKey: 'typography'
})
const letterSpacing = style$1({
  prop: 'letterSpacing'
})
const lineHeight = style$1({
  prop: 'lineHeight'
})
const textAlign = style$1({
  prop: 'textAlign'
})
const typographyVariant = style$1({
  prop: 'typography',
  cssProperty: false,
  themeKey: 'typography'
})
const typography = compose(
  typographyVariant,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  letterSpacing,
  lineHeight,
  textAlign
)

const filterPropsMapping = {
  borders: borders.filterProps,
  display: display.filterProps,
  flexbox: flexbox.filterProps,
  grid: grid.filterProps,
  positions: positions.filterProps,
  palette: palette.filterProps,
  shadows: boxShadow.filterProps,
  sizing: sizing.filterProps,
  spacing: spacing.filterProps,
  typography: typography.filterProps
}
const styleFunctionMapping = {
  borders,
  display,
  flexbox,
  grid,
  positions,
  palette,
  shadows: boxShadow,
  sizing,
  spacing,
  typography
}
const propToStyleFunction = Object.keys(filterPropsMapping).reduce(
  (acc, styleFnName) => {
    filterPropsMapping[styleFnName].forEach((propName) => {
      acc[propName] = styleFunctionMapping[styleFnName]
    })
    return acc
  },
  {}
)

function getThemeValue(prop, value, theme) {
  const inputProps = {
    [prop]: value,
    theme
  }
  const styleFunction = propToStyleFunction[prop]
  return styleFunction
    ? styleFunction(inputProps)
    : {
        [prop]: value
      }
}

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce(
    (keys, object) => keys.concat(Object.keys(object)),
    []
  )
  const union = new Set(allKeys)
  return objects.every((object) => union.size === Object.keys(object).length)
}

function callIfFn(maybeFn, arg) {
  return typeof maybeFn === 'function' ? maybeFn(arg) : maybeFn
}

function styleFunctionSx(props) {
  const { sx, theme = {} } = props || {}

  if (!sx) {
    return null // emotion & styled-components will neglect null
  }
  /*
   * Receive `sxInput` as object or callback
   * and then recursively check keys & values to create media query object styles.
   * (the result will be used in `styled`)
   */

  function traverse(sxInput) {
    let sxObject = sxInput

    if (typeof sxInput === 'function') {
      sxObject = sxInput(theme)
    } else if (typeof sxInput !== 'object') {
      // value
      return sxInput
    }

    const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints)
    const breakpointsKeys = Object.keys(emptyBreakpoints)
    let css = emptyBreakpoints
    Object.keys(sxObject).forEach((styleKey) => {
      const value = callIfFn(sxObject[styleKey], theme)

      if (typeof value === 'object') {
        if (propToStyleFunction[styleKey]) {
          css = merge(css, getThemeValue(styleKey, value, theme))
        } else {
          const breakpointsValues = handleBreakpoints(
            {
              theme
            },
            value,
            (x) => ({
              [styleKey]: x
            })
          )

          if (objectsHaveSameKeys(breakpointsValues, value)) {
            css[styleKey] = styleFunctionSx({
              sx: value,
              theme
            })
          } else {
            css = merge(css, breakpointsValues)
          }
        }
      } else {
        css = merge(css, getThemeValue(styleKey, value, theme))
      }
    })
    return removeUnusedBreakpoints(breakpointsKeys, css)
  }

  return Array.isArray(sx) ? sx.map(traverse) : traverse(sx)
}

styleFunctionSx.filterProps = ['sx']

function toVal(mix) {
  var k,
    y,
    str = ''

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += ' ')
            str += y
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += ' ')
          str += k
        }
      }
    }
  }

  return str
}

function clsx() {
  var i = 0,
    tmp,
    x,
    str = ''
  while (i < arguments.length) {
    if ((tmp = arguments[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += ' ')
        str += x
      }
    }
  }
  return str
}

const _excluded$a = ['values', 'unit', 'step']

function createBreakpoints(breakpoints) {
  const {
      // The breakpoint **start** at this value.
      // For instance with the first breakpoint xs: [xs, sm).
      values = {
        xs: 0,
        // phone
        sm: 600,
        // tablet
        md: 900,
        // small laptop
        lg: 1200,
        // desktop
        xl: 1536 // large screen
      },
      unit = 'px',
      step = 5
    } = breakpoints,
    other = _objectWithoutPropertiesLoose(breakpoints, _excluded$a)

  const keys = Object.keys(values)

  function up(key) {
    const value = typeof values[key] === 'number' ? values[key] : key
    return `@media (min-width:${value}${unit})`
  }

  function down(key) {
    const value = typeof values[key] === 'number' ? values[key] : key
    return `@media (max-width:${value - step / 100}${unit})`
  }

  function between(start, end) {
    const endIndex = keys.indexOf(end)
    return (
      `@media (min-width:${
        typeof values[start] === 'number' ? values[start] : start
      }${unit}) and ` +
      `(max-width:${
        (endIndex !== -1 && typeof values[keys[endIndex]] === 'number'
          ? values[keys[endIndex]]
          : end) -
        step / 100
      }${unit})`
    )
  }

  function only(key) {
    if (keys.indexOf(key) + 1 < keys.length) {
      return between(key, keys[keys.indexOf(key) + 1])
    }

    return up(key)
  }

  return _extends(
    {
      keys,
      values,
      up,
      down,
      between,
      only,
      unit
    },
    other
  )
}

const shape = {
  borderRadius: 4
}

/* tslint:enable:unified-signatures */
function createSpacing(spacingInput = 8) {
  // Already transformed.
  if (spacingInput.mui) {
    return spacingInput
  } // Material Design layouts are visually balanced. Most measurements align to an 8dp grid, which aligns both spacing and the overall layout.
  // Smaller components, such as icons, can align to a 4dp grid.
  // https://material.io/design/layout/understanding-layout.html#usage

  const transform = createUnarySpacing({
    spacing: spacingInput
  })

  const spacing = (...argsInput) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!(argsInput.length <= 4)) {
        console.error(
          `MUI: Too many arguments provided, expected between 0 and 4, got ${argsInput.length}`
        )
      }
    }

    const args = argsInput.length === 0 ? [1] : argsInput
    return args
      .map((argument) => {
        const output = transform(argument)
        return typeof output === 'number' ? `${output}px` : output
      })
      .join(' ')
  }

  spacing.mui = true
  return spacing
}

const _excluded$9 = ['breakpoints', 'palette', 'spacing', 'shape']

function createTheme$1(options = {}, ...args) {
  const {
      breakpoints: breakpointsInput = {},
      palette: paletteInput = {},
      spacing: spacingInput,
      shape: shapeInput = {}
    } = options,
    other = _objectWithoutPropertiesLoose(options, _excluded$9)

  const breakpoints = createBreakpoints(breakpointsInput)
  const spacing = createSpacing(spacingInput)
  let muiTheme = deepmerge(
    {
      breakpoints,
      direction: 'ltr',
      components: {},
      // Inject component definitions.
      palette: _extends(
        {
          mode: 'light'
        },
        paletteInput
      ),
      spacing,
      shape: _extends({}, shape, shapeInput)
    },
    other
  )
  muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme)
  return muiTheme
}

const ThemeContext = /*#__PURE__*/ react.exports.createContext(null)

if (process.env.NODE_ENV !== 'production') {
  ThemeContext.displayName = 'ThemeContext'
}

var ThemeContext$1 = ThemeContext

function useTheme$2() {
  const theme = react.exports.useContext(ThemeContext$1)

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react.exports.useDebugValue(theme)
  }

  return theme
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

function useTheme$1(defaultTheme = null) {
  const contextTheme = useTheme$2()
  return !contextTheme || isObjectEmpty(contextTheme)
    ? defaultTheme
    : contextTheme
}

const systemDefaultTheme$1 = createTheme$1()

function useTheme(defaultTheme = systemDefaultTheme$1) {
  return useTheme$1(defaultTheme)
}

const _excluded$8 = ['variant']

function isEmpty$1(string) {
  return string.length === 0
}
/**
 * Generates string classKey based on the properties provided. It starts with the
 * variant if defined, and then it appends all other properties in alphabetical order.
 * @param {object} props - the properties for which the classKey should be created.
 */

function propsToClassKey(props) {
  const { variant } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$8)

  let classKey = variant || ''
  Object.keys(other)
    .sort()
    .forEach((key) => {
      if (key === 'color') {
        classKey += isEmpty$1(classKey) ? props[key] : capitalize(props[key])
      } else {
        classKey += `${isEmpty$1(classKey) ? key : capitalize(key)}${capitalize(
          props[key].toString()
        )}`
      }
    })
  return classKey
}

const _excluded$7 = [
    'name',
    'slot',
    'skipVariantsResolver',
    'skipSx',
    'overridesResolver'
  ],
  _excluded2 = ['theme'],
  _excluded3 = ['theme']

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

const getStyleOverrides = (name, theme) => {
  if (
    theme.components &&
    theme.components[name] &&
    theme.components[name].styleOverrides
  ) {
    return theme.components[name].styleOverrides
  }

  return null
}

const getVariantStyles = (name, theme) => {
  let variants = []

  if (
    theme &&
    theme.components &&
    theme.components[name] &&
    theme.components[name].variants
  ) {
    variants = theme.components[name].variants
  }

  const variantsStyles = {}
  variants.forEach((definition) => {
    const key = propsToClassKey(definition.props)
    variantsStyles[key] = definition.style
  })
  return variantsStyles
}

const variantsResolver = (props, styles, theme, name) => {
  var _theme$components, _theme$components$nam

  const { ownerState = {} } = props
  const variantsStyles = []
  const themeVariants =
    theme == null
      ? void 0
      : (_theme$components = theme.components) == null
      ? void 0
      : (_theme$components$nam = _theme$components[name]) == null
      ? void 0
      : _theme$components$nam.variants

  if (themeVariants) {
    themeVariants.forEach((themeVariant) => {
      let isMatch = true
      Object.keys(themeVariant.props).forEach((key) => {
        if (
          ownerState[key] !== themeVariant.props[key] &&
          props[key] !== themeVariant.props[key]
        ) {
          isMatch = false
        }
      })

      if (isMatch) {
        variantsStyles.push(styles[propsToClassKey(themeVariant.props)])
      }
    })
  }

  return variantsStyles
}

function shouldForwardProp(prop) {
  return (
    prop !== 'ownerState' && prop !== 'theme' && prop !== 'sx' && prop !== 'as'
  )
}
const systemDefaultTheme = createTheme$1()

const lowercaseFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

function createStyled(input = {}) {
  const {
    defaultTheme = systemDefaultTheme,
    rootShouldForwardProp = shouldForwardProp,
    slotShouldForwardProp = shouldForwardProp
  } = input
  return (tag, inputOptions = {}) => {
    const {
        name: componentName,
        slot: componentSlot,
        skipVariantsResolver: inputSkipVariantsResolver,
        skipSx: inputSkipSx,
        overridesResolver
      } = inputOptions,
      options = _objectWithoutPropertiesLoose(inputOptions, _excluded$7) // if skipVariantsResolver option is defined, take the value, otherwise, true for root and false for other slots.

    const skipVariantsResolver =
      inputSkipVariantsResolver !== undefined
        ? inputSkipVariantsResolver
        : (componentSlot && componentSlot !== 'Root') || false
    const skipSx = inputSkipSx || false
    let label

    if (process.env.NODE_ENV !== 'production') {
      if (componentName) {
        label = `${componentName}-${lowercaseFirstLetter(
          componentSlot || 'Root'
        )}`
      }
    }

    let shouldForwardPropOption = shouldForwardProp

    if (componentSlot === 'Root') {
      shouldForwardPropOption = rootShouldForwardProp
    } else if (componentSlot) {
      // any other slot specified
      shouldForwardPropOption = slotShouldForwardProp
    }

    const defaultStyledResolver = styled$1(
      tag,
      _extends(
        {
          shouldForwardProp: shouldForwardPropOption,
          label
        },
        options
      )
    )

    const muiStyledResolver = (styleArg, ...expressions) => {
      const expressionsWithDefaultTheme = expressions
        ? expressions.map((stylesArg) => {
            // On the server emotion doesn't use React.forwardRef for creating components, so the created
            // component stays as a function. This condition makes sure that we do not interpolate functions
            // which are basically components used as a selectors.
            // eslint-disable-next-line no-underscore-dangle
            return typeof stylesArg === 'function' &&
              stylesArg.__emotion_real !== stylesArg
              ? (_ref) => {
                  let { theme: themeInput } = _ref,
                    other = _objectWithoutPropertiesLoose(_ref, _excluded2)

                  return stylesArg(
                    _extends(
                      {
                        theme: isEmpty(themeInput) ? defaultTheme : themeInput
                      },
                      other
                    )
                  )
                }
              : stylesArg
          })
        : []
      let transformedStyleArg = styleArg

      if (componentName && overridesResolver) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = isEmpty(props.theme) ? defaultTheme : props.theme
          const styleOverrides = getStyleOverrides(componentName, theme)

          if (styleOverrides) {
            return overridesResolver(props, styleOverrides)
          }

          return null
        })
      }

      if (componentName && !skipVariantsResolver) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = isEmpty(props.theme) ? defaultTheme : props.theme
          return variantsResolver(
            props,
            getVariantStyles(componentName, theme),
            theme,
            componentName
          )
        })
      }

      if (!skipSx) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = isEmpty(props.theme) ? defaultTheme : props.theme
          return styleFunctionSx(
            _extends({}, props, {
              theme
            })
          )
        })
      }

      const numOfCustomFnsApplied =
        expressionsWithDefaultTheme.length - expressions.length

      if (Array.isArray(styleArg) && numOfCustomFnsApplied > 0) {
        const placeholders = new Array(numOfCustomFnsApplied).fill('') // If the type is array, than we need to add placeholders in the template for the overrides, variants and the sx styles.

        transformedStyleArg = [...styleArg, ...placeholders]
        transformedStyleArg.raw = [...styleArg.raw, ...placeholders]
      } else if (typeof styleArg === 'function') {
        // If the type is function, we need to define the default theme.
        transformedStyleArg = (_ref2) => {
          let { theme: themeInput } = _ref2,
            other = _objectWithoutPropertiesLoose(_ref2, _excluded3)

          return styleArg(
            _extends(
              {
                theme: isEmpty(themeInput) ? defaultTheme : themeInput
              },
              other
            )
          )
        }
      }

      const Component = defaultStyledResolver(
        transformedStyleArg,
        ...expressionsWithDefaultTheme
      )

      if (process.env.NODE_ENV !== 'production') {
        let displayName

        if (componentName) {
          displayName = `${componentName}${componentSlot || ''}`
        }

        if (displayName === undefined) {
          displayName = `Styled(${getDisplayName(tag)})`
        }

        Component.displayName = displayName
      }

      return Component
    }

    return muiStyledResolver
  }
}

/* eslint-disable no-restricted-syntax */
function getThemeProps(params) {
  const { theme, name, props } = params

  if (
    !theme ||
    !theme.components ||
    !theme.components[name] ||
    !theme.components[name].defaultProps
  ) {
    return props
  }

  const output = _extends({}, props) // Resolve default props, code borrow from React source.
  // https://github.com/facebook/react/blob/15a8f031838a553e41c0b66eb1bcf1da8448104d/packages/react/src/ReactElement.js#L221

  const defaultProps = theme.components[name].defaultProps
  let propName

  for (propName in defaultProps) {
    if (output[propName] === undefined) {
      output[propName] = defaultProps[propName]
    }
  }

  return output
}

function useThemeProps$1({ props, name, defaultTheme }) {
  const theme = useTheme(defaultTheme)
  const mergedProps = getThemeProps({
    theme,
    name,
    props
  })
  return mergedProps
}

/**
 * Returns a number whose value is limited to the given range.
 * @param {number} value The value to be clamped
 * @param {number} min The lower boundary of the output range
 * @param {number} max The upper boundary of the output range
 * @returns {number} A number in the range [min, max]
 */
function clamp(value, min = 0, max = 1) {
  if (process.env.NODE_ENV !== 'production') {
    if (value < min || value > max) {
      console.error(
        `MUI: The value provided ${value} is out of range [${min}, ${max}].`
      )
    }
  }

  return Math.min(Math.max(min, value), max)
}
/**
 * Converts a color from CSS hex format to CSS rgb format.
 * @param {string} color - Hex color, i.e. #nnn or #nnnnnn
 * @returns {string} A CSS rgb color string
 */

function hexToRgb(color) {
  color = color.substr(1)
  const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, 'g')
  let colors = color.match(re)

  if (colors && colors[0].length === 1) {
    colors = colors.map((n) => n + n)
  }

  return colors
    ? `rgb${colors.length === 4 ? 'a' : ''}(${colors
        .map((n, index) => {
          return index < 3
            ? parseInt(n, 16)
            : Math.round((parseInt(n, 16) / 255) * 1000) / 1000
        })
        .join(', ')})`
    : ''
}
/**
 * Returns an object with the type and values of a color.
 *
 * Note: Does not support rgb % values.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {object} - A MUI color object: {type: string, values: number[]}
 */

function decomposeColor(color) {
  // Idempotent
  if (color.type) {
    return color
  }

  if (color.charAt(0) === '#') {
    return decomposeColor(hexToRgb(color))
  }

  const marker = color.indexOf('(')
  const type = color.substring(0, marker)

  if (['rgb', 'rgba', 'hsl', 'hsla', 'color'].indexOf(type) === -1) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `MUI: Unsupported \`${color}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().`
        : formatMuiErrorMessage(9, color)
    )
  }

  let values = color.substring(marker + 1, color.length - 1)
  let colorSpace

  if (type === 'color') {
    values = values.split(' ')
    colorSpace = values.shift()

    if (values.length === 4 && values[3].charAt(0) === '/') {
      values[3] = values[3].substr(1)
    }

    if (
      ['srgb', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec-2020'].indexOf(
        colorSpace
      ) === -1
    ) {
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? `MUI: unsupported \`${colorSpace}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.`
          : formatMuiErrorMessage(10, colorSpace)
      )
    }
  } else {
    values = values.split(',')
  }

  values = values.map((value) => parseFloat(value))
  return {
    type,
    values,
    colorSpace
  }
}
/**
 * Converts a color object with type and values to a string.
 * @param {object} color - Decomposed color
 * @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla'
 * @param {array} color.values - [n,n,n] or [n,n,n,n]
 * @returns {string} A CSS color string
 */

function recomposeColor(color) {
  const { type, colorSpace } = color
  let { values } = color

  if (type.indexOf('rgb') !== -1) {
    // Only convert the first 3 values to int (i.e. not alpha)
    values = values.map((n, i) => (i < 3 ? parseInt(n, 10) : n))
  } else if (type.indexOf('hsl') !== -1) {
    values[1] = `${values[1]}%`
    values[2] = `${values[2]}%`
  }

  if (type.indexOf('color') !== -1) {
    values = `${colorSpace} ${values.join(' ')}`
  } else {
    values = `${values.join(', ')}`
  }

  return `${type}(${values})`
}
/**
 * Converts a color from hsl format to rgb format.
 * @param {string} color - HSL color values
 * @returns {string} rgb color values
 */

function hslToRgb(color) {
  color = decomposeColor(color)
  const { values } = color
  const h = values[0]
  const s = values[1] / 100
  const l = values[2] / 100
  const a = s * Math.min(l, 1 - l)

  const f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

  let type = 'rgb'
  const rgb = [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255)
  ]

  if (color.type === 'hsla') {
    type += 'a'
    rgb.push(values[3])
  }

  return recomposeColor({
    type,
    values: rgb
  })
}
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @returns {number} The relative brightness of the color in the range 0 - 1
 */

function getLuminance(color) {
  color = decomposeColor(color)
  let rgb =
    color.type === 'hsl' ? decomposeColor(hslToRgb(color)).values : color.values
  rgb = rgb.map((val) => {
    if (color.type !== 'color') {
      val /= 255 // normalized
    }

    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4
  }) // Truncate at 3 digits

  return Number(
    (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3)
  )
}
/**
 * Calculates the contrast ratio between two colors.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 * @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */

function getContrastRatio(foreground, background) {
  const lumA = getLuminance(foreground)
  const lumB = getLuminance(background)
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05)
}
/**
 * Sets the absolute transparency of a color.
 * Any existing alpha values are overwritten.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @param {number} value - value to set the alpha channel to in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */

function alpha(color, value) {
  color = decomposeColor(color)
  value = clamp(value)

  if (color.type === 'rgb' || color.type === 'hsl') {
    color.type += 'a'
  }

  if (color.type === 'color') {
    color.values[3] = `/${value}`
  } else {
    color.values[3] = value
  }

  return recomposeColor(color)
}
/**
 * Darkens a color.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */

function darken(color, coefficient) {
  color = decomposeColor(color)
  coefficient = clamp(coefficient)

  if (color.type.indexOf('hsl') !== -1) {
    color.values[2] *= 1 - coefficient
  } else if (
    color.type.indexOf('rgb') !== -1 ||
    color.type.indexOf('color') !== -1
  ) {
    for (let i = 0; i < 3; i += 1) {
      color.values[i] *= 1 - coefficient
    }
  }

  return recomposeColor(color)
}
/**
 * Lightens a color.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */

function lighten(color, coefficient) {
  color = decomposeColor(color)
  coefficient = clamp(coefficient)

  if (color.type.indexOf('hsl') !== -1) {
    color.values[2] += (100 - color.values[2]) * coefficient
  } else if (color.type.indexOf('rgb') !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color.values[i] += (255 - color.values[i]) * coefficient
    }
  } else if (color.type.indexOf('color') !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color.values[i] += (1 - color.values[i]) * coefficient
    }
  }

  return recomposeColor(color)
}

function composeClasses(slots, getUtilityClass, classes) {
  const output = {}
  Object.keys(slots).forEach(
    // `Objet.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    (slot) => {
      output[slot] = slots[slot]
        .reduce((acc, key) => {
          if (key) {
            if (classes && classes[key]) {
              acc.push(classes[key])
            }

            acc.push(getUtilityClass(key))
          }

          return acc
        }, [])
        .join(' ')
    }
  )
  return output
}

const defaultGenerator = (componentName) => componentName

const createClassNameGenerator = () => {
  let generate = defaultGenerator
  return {
    configure(generator) {
      generate = generator
    },

    generate(componentName) {
      return generate(componentName)
    },

    reset() {
      generate = defaultGenerator
    }
  }
}

const ClassNameGenerator = createClassNameGenerator()
var ClassNameGenerator$1 = ClassNameGenerator

const globalStateClassesMapping = {
  active: 'Mui-active',
  checked: 'Mui-checked',
  completed: 'Mui-completed',
  disabled: 'Mui-disabled',
  error: 'Mui-error',
  expanded: 'Mui-expanded',
  focused: 'Mui-focused',
  focusVisible: 'Mui-focusVisible',
  required: 'Mui-required',
  selected: 'Mui-selected'
}
function generateUtilityClass(componentName, slot) {
  const globalStateClass = globalStateClassesMapping[slot]
  return (
    globalStateClass ||
    `${ClassNameGenerator$1.generate(componentName)}-${slot}`
  )
}

function generateUtilityClasses(componentName, slots) {
  const result = {}
  slots.forEach((slot) => {
    result[slot] = generateUtilityClass(componentName, slot)
  })
  return result
}

function createMixins(breakpoints, spacing, mixins) {
  return _extends(
    {
      toolbar: {
        minHeight: 56,
        [`${breakpoints.up('xs')} and (orientation: landscape)`]: {
          minHeight: 48
        },
        [breakpoints.up('sm')]: {
          minHeight: 64
        }
      }
    },
    mixins
  )
}

const _excluded$6 = ['mode', 'contrastThreshold', 'tonalOffset']
const light = {
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: 'rgba(0, 0, 0, 0.87)',
    // Secondary text.
    secondary: 'rgba(0, 0, 0, 0.6)',
    // Disabled text have even lower visual prominence.
    disabled: 'rgba(0, 0, 0, 0.38)'
  },
  // The color used to divide different elements.
  divider: 'rgba(0, 0, 0, 0.12)',
  // The background colors used to style the surfaces.
  // Consistency between these values is important.
  background: {
    paper: common.white,
    default: common.white
  },
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: 'rgba(0, 0, 0, 0.54)',
    // The color of an hovered action.
    hover: 'rgba(0, 0, 0, 0.04)',
    hoverOpacity: 0.04,
    // The color of a selected action.
    selected: 'rgba(0, 0, 0, 0.08)',
    selectedOpacity: 0.08,
    // The color of a disabled action.
    disabled: 'rgba(0, 0, 0, 0.26)',
    // The background color of a disabled action.
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(0, 0, 0, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  }
}
const dark = {
  text: {
    primary: common.white,
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    icon: 'rgba(255, 255, 255, 0.5)'
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  background: {
    paper: '#121212',
    default: '#121212'
  },
  action: {
    active: common.white,
    hover: 'rgba(255, 255, 255, 0.08)',
    hoverOpacity: 0.08,
    selected: 'rgba(255, 255, 255, 0.16)',
    selectedOpacity: 0.16,
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(255, 255, 255, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  }
}

function addLightOrDark(intent, direction, shade, tonalOffset) {
  const tonalOffsetLight = tonalOffset.light || tonalOffset
  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5

  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade]
    } else if (direction === 'light') {
      intent.light = lighten(intent.main, tonalOffsetLight)
    } else if (direction === 'dark') {
      intent.dark = darken(intent.main, tonalOffsetDark)
    }
  }
}

function getDefaultPrimary(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: blue[200],
      light: blue[50],
      dark: blue[400]
    }
  }

  return {
    main: blue[700],
    light: blue[400],
    dark: blue[800]
  }
}

function getDefaultSecondary(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: purple[200],
      light: purple[50],
      dark: purple[400]
    }
  }

  return {
    main: purple[500],
    light: purple[300],
    dark: purple[700]
  }
}

function getDefaultError(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: red[500],
      light: red[300],
      dark: red[700]
    }
  }

  return {
    main: red[700],
    light: red[400],
    dark: red[800]
  }
}

function getDefaultInfo(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: lightBlue[400],
      light: lightBlue[300],
      dark: lightBlue[700]
    }
  }

  return {
    main: lightBlue[700],
    light: lightBlue[500],
    dark: lightBlue[900]
  }
}

function getDefaultSuccess(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: green[400],
      light: green[300],
      dark: green[700]
    }
  }

  return {
    main: green[800],
    light: green[500],
    dark: green[900]
  }
}

function getDefaultWarning(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: orange[400],
      light: orange[300],
      dark: orange[700]
    }
  }

  return {
    main: '#ed6c02',
    // closest to orange[800] that pass 3:1.
    light: orange[500],
    dark: orange[900]
  }
}

function createPalette(palette) {
  const { mode = 'light', contrastThreshold = 3, tonalOffset = 0.2 } = palette,
    other = _objectWithoutPropertiesLoose(palette, _excluded$6)

  const primary = palette.primary || getDefaultPrimary(mode)
  const secondary = palette.secondary || getDefaultSecondary(mode)
  const error = palette.error || getDefaultError(mode)
  const info = palette.info || getDefaultInfo(mode)
  const success = palette.success || getDefaultSuccess(mode)
  const warning = palette.warning || getDefaultWarning(mode) // Use the same logic as
  // Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
  // and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54

  function getContrastText(background) {
    const contrastText =
      getContrastRatio(background, dark.text.primary) >= contrastThreshold
        ? dark.text.primary
        : light.text.primary

    if (process.env.NODE_ENV !== 'production') {
      const contrast = getContrastRatio(background, contrastText)

      if (contrast < 3) {
        console.error(
          [
            `MUI: The contrast ratio of ${contrast}:1 for ${contrastText} on ${background}`,
            'falls below the WCAG recommended absolute minimum contrast ratio of 3:1.',
            'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast'
          ].join('\n')
        )
      }
    }

    return contrastText
  }

  const augmentColor = ({
    color,
    name,
    mainShade = 500,
    lightShade = 300,
    darkShade = 700
  }) => {
    color = _extends({}, color)

    if (!color.main && color[mainShade]) {
      color.main = color[mainShade]
    }

    if (!color.hasOwnProperty('main')) {
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? `MUI: The color${
              name ? ` (${name})` : ''
            } provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${mainShade}\` property.`
          : formatMuiErrorMessage(11, name ? ` (${name})` : '', mainShade)
      )
    }

    if (typeof color.main !== 'string') {
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? `MUI: The color${
              name ? ` (${name})` : ''
            } provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(
              color.main
            )}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });`
          : formatMuiErrorMessage(
              12,
              name ? ` (${name})` : '',
              JSON.stringify(color.main)
            )
      )
    }

    addLightOrDark(color, 'light', lightShade, tonalOffset)
    addLightOrDark(color, 'dark', darkShade, tonalOffset)

    if (!color.contrastText) {
      color.contrastText = getContrastText(color.main)
    }

    return color
  }

  const modes = {
    dark,
    light
  }

  if (process.env.NODE_ENV !== 'production') {
    if (!modes[mode]) {
      console.error(`MUI: The palette mode \`${mode}\` is not supported.`)
    }
  }

  const paletteOutput = deepmerge(
    _extends(
      {
        // A collection of common colors.
        common,
        // The palette mode, can be light or dark.
        mode,
        // The colors used to represent primary interface elements for a user.
        primary: augmentColor({
          color: primary,
          name: 'primary'
        }),
        // The colors used to represent secondary interface elements for a user.
        secondary: augmentColor({
          color: secondary,
          name: 'secondary',
          mainShade: 'A400',
          lightShade: 'A200',
          darkShade: 'A700'
        }),
        // The colors used to represent interface elements that the user should be made aware of.
        error: augmentColor({
          color: error,
          name: 'error'
        }),
        // The colors used to represent potentially dangerous actions or important messages.
        warning: augmentColor({
          color: warning,
          name: 'warning'
        }),
        // The colors used to present information to the user that is neutral and not necessarily important.
        info: augmentColor({
          color: info,
          name: 'info'
        }),
        // The colors used to indicate the successful completion of an action that user triggered.
        success: augmentColor({
          color: success,
          name: 'success'
        }),
        // The grey colors.
        grey,
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold,
        // Takes a background color and returns the text color that maximizes the contrast.
        getContrastText,
        // Generate a rich color object.
        augmentColor,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset
      },
      modes[mode]
    ),
    other
  )
  return paletteOutput
}

const _excluded$5 = [
  'fontFamily',
  'fontSize',
  'fontWeightLight',
  'fontWeightRegular',
  'fontWeightMedium',
  'fontWeightBold',
  'htmlFontSize',
  'allVariants',
  'pxToRem'
]

function round(value) {
  return Math.round(value * 1e5) / 1e5
}

const caseAllCaps = {
  textTransform: 'uppercase'
}
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif'
/**
 * @see @link{https://material.io/design/typography/the-type-system.html}
 * @see @link{https://material.io/design/typography/understanding-typography.html}
 */

function createTypography(palette, typography) {
  const _ref =
      typeof typography === 'function' ? typography(palette) : typography,
    {
      fontFamily = defaultFontFamily,
      // The default font size of the Material Specification.
      fontSize = 14,
      // px
      fontWeightLight = 300,
      fontWeightRegular = 400,
      fontWeightMedium = 500,
      fontWeightBold = 700,
      // Tell MUI what's the font-size on the html element.
      // 16px is the default font-size used by browsers.
      htmlFontSize = 16,
      // Apply the CSS properties to all the variants.
      allVariants,
      pxToRem: pxToRem2
    } = _ref,
    other = _objectWithoutPropertiesLoose(_ref, _excluded$5)

  if (process.env.NODE_ENV !== 'production') {
    if (typeof fontSize !== 'number') {
      console.error('MUI: `fontSize` is required to be a number.')
    }

    if (typeof htmlFontSize !== 'number') {
      console.error('MUI: `htmlFontSize` is required to be a number.')
    }
  }

  const coef = fontSize / 14

  const pxToRem = pxToRem2 || ((size) => `${(size / htmlFontSize) * coef}rem`)

  const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) =>
    _extends(
      {
        fontFamily,
        fontWeight,
        fontSize: pxToRem(size),
        // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
        lineHeight
      },
      fontFamily === defaultFontFamily
        ? {
            letterSpacing: `${round(letterSpacing / size)}em`
          }
        : {},
      casing,
      allVariants
    )

  const variants = {
    h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
    h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
    h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
    h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
    h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
    h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
    subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
    subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
    body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
    body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
    button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
    caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
    overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps)
  }
  return deepmerge(
    _extends(
      {
        htmlFontSize,
        pxToRem,
        fontFamily,
        fontSize,
        fontWeightLight,
        fontWeightRegular,
        fontWeightMedium,
        fontWeightBold
      },
      variants
    ),
    other,
    {
      clone: false // No need to clone deep
    }
  )
}

const shadowKeyUmbraOpacity = 0.2
const shadowKeyPenumbraOpacity = 0.14
const shadowAmbientShadowOpacity = 0.12

function createShadow(...px) {
  return [
    `${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`,
    `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`,
    `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`
  ].join(',')
} // Values from https://github.com/material-components/material-components-web/blob/be8747f94574669cb5e7add1a7c54fa41a89cec7/packages/mdc-elevation/_variables.scss

const shadows = [
  'none',
  createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0),
  createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0),
  createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0),
  createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
  createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
  createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
  createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
  createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
  createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
  createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
  createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
  createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
  createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
  createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
  createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
  createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
  createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
  createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
  createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
  createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
  createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
  createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
  createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
  createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)
]

const _excluded$4 = ['duration', 'easing', 'delay']
// Follow https://material.google.com/motion/duration-easing.html#duration-easing-natural-easing-curves
// to learn the context in which each easing should be used.
const easing = {
  // This is the most common easing curve.
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
} // Follow https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
// to learn when use what timing

const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
}

function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`
}

function getAutoHeightDuration(height) {
  if (!height) {
    return 0
  }

  const constant = height / 36 // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10

  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

function createTransitions(inputTransitions) {
  const mergedEasing = _extends({}, easing, inputTransitions.easing)

  const mergedDuration = _extends({}, duration, inputTransitions.duration)

  const create = (props = ['all'], options = {}) => {
    const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0
      } = options,
      other = _objectWithoutPropertiesLoose(options, _excluded$4)

    if (process.env.NODE_ENV !== 'production') {
      const isString = (value) => typeof value === 'string' // IE11 support, replace with Number.isNaN
      // eslint-disable-next-line no-restricted-globals

      const isNumber = (value) => !isNaN(parseFloat(value))

      if (!isString(props) && !Array.isArray(props)) {
        console.error('MUI: Argument "props" must be a string or Array.')
      }

      if (!isNumber(durationOption) && !isString(durationOption)) {
        console.error(
          `MUI: Argument "duration" must be a number or a string but found ${durationOption}.`
        )
      }

      if (!isString(easingOption)) {
        console.error('MUI: Argument "easing" must be a string.')
      }

      if (!isNumber(delay) && !isString(delay)) {
        console.error('MUI: Argument "delay" must be a number or a string.')
      }

      if (Object.keys(other).length !== 0) {
        console.error(
          `MUI: Unrecognized argument(s) [${Object.keys(other).join(',')}].`
        )
      }
    }

    return (Array.isArray(props) ? props : [props])
      .map(
        (animatedProp) =>
          `${animatedProp} ${
            typeof durationOption === 'string'
              ? durationOption
              : formatMs(durationOption)
          } ${easingOption} ${
            typeof delay === 'string' ? delay : formatMs(delay)
          }`
      )
      .join(',')
  }

  return _extends(
    {
      getAutoHeightDuration,
      create
    },
    inputTransitions,
    {
      easing: mergedEasing,
      duration: mergedDuration
    }
  )
}

// We need to centralize the zIndex definitions as they work
// like global values in the browser.
const zIndex = {
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
}

const _excluded$3 = [
  'breakpoints',
  'mixins',
  'spacing',
  'palette',
  'transitions',
  'typography',
  'shape'
]

function createTheme(options = {}, ...args) {
  const {
      mixins: mixinsInput = {},
      palette: paletteInput = {},
      transitions: transitionsInput = {},
      typography: typographyInput = {}
    } = options,
    other = _objectWithoutPropertiesLoose(options, _excluded$3)

  const palette = createPalette(paletteInput)
  const systemTheme = createTheme$1(options)
  let muiTheme = deepmerge(systemTheme, {
    mixins: createMixins(
      systemTheme.breakpoints,
      systemTheme.spacing,
      mixinsInput
    ),
    palette,
    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
    shadows: shadows.slice(),
    typography: createTypography(palette, typographyInput),
    transitions: createTransitions(transitionsInput),
    zIndex: _extends({}, zIndex)
  })
  muiTheme = deepmerge(muiTheme, other)
  muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme)

  if (process.env.NODE_ENV !== 'production') {
    const stateClasses = [
      'active',
      'checked',
      'completed',
      'disabled',
      'error',
      'expanded',
      'focused',
      'focusVisible',
      'required',
      'selected'
    ]

    const traverse = (node, component) => {
      let key // eslint-disable-next-line guard-for-in, no-restricted-syntax

      for (key in node) {
        const child = node[key]

        if (stateClasses.indexOf(key) !== -1 && Object.keys(child).length > 0) {
          if (process.env.NODE_ENV !== 'production') {
            const stateClass = generateUtilityClass('', key)
            console.error(
              [
                `MUI: The \`${component}\` component increases ` +
                  `the CSS specificity of the \`${key}\` internal state.`,
                'You can not override it like this: ',
                JSON.stringify(node, null, 2),
                '',
                `Instead, you need to use the '&.${stateClass}' syntax:`,
                JSON.stringify(
                  {
                    root: {
                      [`&.${stateClass}`]: child
                    }
                  },
                  null,
                  2
                ),
                '',
                'https://mui.com/r/state-classes-guide'
              ].join('\n')
            )
          } // Remove the style to prevent global conflicts.

          node[key] = {}
        }
      }
    }

    Object.keys(muiTheme.components).forEach((component) => {
      const styleOverrides = muiTheme.components[component].styleOverrides

      if (styleOverrides && component.indexOf('Mui') === 0) {
        traverse(styleOverrides, component)
      }
    })
  }

  return muiTheme
}

const defaultTheme = createTheme()

function useThemeProps({ props, name }) {
  return useThemeProps$1({
    props,
    name,
    defaultTheme
  })
}

const rootShouldForwardProp = (prop) =>
  shouldForwardProp(prop) && prop !== 'classes'
const styled = createStyled({
  defaultTheme,
  rootShouldForwardProp
})

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }

  return _setPrototypeOf(o, p)
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  _setPrototypeOf(subClass, superClass)
}

var TransitionGroupContext = React$1.createContext(null)

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }

  return self
}

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {*} children `this.props.children`
 * @return {object} Mapping of key to child
 */

function getChildMapping(children, mapFn) {
  var mapper = function mapper(child) {
    return mapFn && react.exports.isValidElement(child) ? mapFn(child) : child
  }

  var result = Object.create(null)
  if (children)
    react.exports.Children.map(children, function (c) {
      return c
    }).forEach(function (child) {
      // run the map function here instead so that the key is the computed one
      result[child.key] = mapper(child)
    })
  return result
}
/**
 * When you're adding or removing children some may be added or removed in the
 * same render pass. We want to show *both* since we want to simultaneously
 * animate elements in and out. This function takes a previous set of keys
 * and a new set of keys and merges them with its best guess of the correct
 * ordering. In the future we may expose some of the utilities in
 * ReactMultiChild to make this easy, but for now React itself does not
 * directly have this concept of the union of prevChildren and nextChildren
 * so we implement it here.
 *
 * @param {object} prev prev children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @param {object} next next children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @return {object} a key set that contains all keys in `prev` and all keys
 * in `next` in a reasonable order.
 */

function mergeChildMappings(prev, next) {
  prev = prev || {}
  next = next || {}

  function getValueForKey(key) {
    return key in next ? next[key] : prev[key]
  } // For each key of `next`, the list of keys to insert before that key in
  // the combined list

  var nextKeysPending = Object.create(null)
  var pendingKeys = []

  for (var prevKey in prev) {
    if (prevKey in next) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys
        pendingKeys = []
      }
    } else {
      pendingKeys.push(prevKey)
    }
  }

  var i
  var childMapping = {}

  for (var nextKey in next) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i]
        childMapping[nextKeysPending[nextKey][i]] =
          getValueForKey(pendingNextKey)
      }
    }

    childMapping[nextKey] = getValueForKey(nextKey)
  } // Finally, add the keys which didn't appear before any key in `next`

  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i])
  }

  return childMapping
}

function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop]
}

function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, function (child) {
    return react.exports.cloneElement(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, 'appear', props),
      enter: getProp(child, 'enter', props),
      exit: getProp(child, 'exit', props)
    })
  })
}
function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  var nextChildMapping = getChildMapping(nextProps.children)
  var children = mergeChildMappings(prevChildMapping, nextChildMapping)
  Object.keys(children).forEach(function (key) {
    var child = children[key]
    if (!react.exports.isValidElement(child)) return
    var hasPrev = key in prevChildMapping
    var hasNext = key in nextChildMapping
    var prevChild = prevChildMapping[key]
    var isLeaving =
      react.exports.isValidElement(prevChild) && !prevChild.props.in // item is new (entering)

    if (hasNext && (!hasPrev || isLeaving)) {
      // console.log('entering', key)
      children[key] = react.exports.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      })
    } else if (!hasNext && hasPrev && !isLeaving) {
      // item is old (exiting)
      // console.log('leaving', key)
      children[key] = react.exports.cloneElement(child, {
        in: false
      })
    } else if (hasNext && hasPrev && react.exports.isValidElement(prevChild)) {
      // item hasn't changed transition states
      // copy over the last transition props;
      // console.log('unchanged', key)
      children[key] = react.exports.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      })
    }
  })
  return children
}

var values =
  Object.values ||
  function (obj) {
    return Object.keys(obj).map(function (k) {
      return obj[k]
    })
  }

var defaultProps = {
  component: 'div',
  childFactory: function childFactory(child) {
    return child
  }
}
/**
 * The `<TransitionGroup>` component manages a set of transition components
 * (`<Transition>` and `<CSSTransition>`) in a list. Like with the transition
 * components, `<TransitionGroup>` is a state machine for managing the mounting
 * and unmounting of components over time.
 *
 * Consider the example below. As items are removed or added to the TodoList the
 * `in` prop is toggled automatically by the `<TransitionGroup>`.
 *
 * Note that `<TransitionGroup>`  does not define any animation behavior!
 * Exactly _how_ a list item animates is up to the individual transition
 * component. This means you can mix and match animations across different list
 * items.
 */

var TransitionGroup = /*#__PURE__*/ (function (_React$Component) {
  _inheritsLoose(TransitionGroup, _React$Component)

  function TransitionGroup(props, context) {
    var _this

    _this = _React$Component.call(this, props, context) || this

    var handleExited = _this.handleExited.bind(_assertThisInitialized(_this)) // Initial children should all be entering, dependent on appear

    _this.state = {
      contextValue: {
        isMounting: true
      },
      handleExited: handleExited,
      firstRender: true
    }
    return _this
  }

  var _proto = TransitionGroup.prototype

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true
    this.setState({
      contextValue: {
        isMounting: false
      }
    })
  }

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false
  }

  TransitionGroup.getDerivedStateFromProps = function getDerivedStateFromProps(
    nextProps,
    _ref
  ) {
    var prevChildMapping = _ref.children,
      handleExited = _ref.handleExited,
      firstRender = _ref.firstRender
    return {
      children: firstRender
        ? getInitialChildMapping(nextProps, handleExited)
        : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false
    }
  } // node is `undefined` when user provided `nodeRef` prop

  _proto.handleExited = function handleExited(child, node) {
    var currentChildMapping = getChildMapping(this.props.children)
    if (child.key in currentChildMapping) return

    if (child.props.onExited) {
      child.props.onExited(node)
    }

    if (this.mounted) {
      this.setState(function (state) {
        var children = _extends({}, state.children)

        delete children[child.key]
        return {
          children: children
        }
      })
    }
  }

  _proto.render = function render() {
    var _this$props = this.props,
      Component = _this$props.component,
      childFactory = _this$props.childFactory,
      props = _objectWithoutPropertiesLoose(_this$props, [
        'component',
        'childFactory'
      ])

    var contextValue = this.state.contextValue
    var children = values(this.state.children).map(childFactory)
    delete props.appear
    delete props.enter
    delete props.exit

    if (Component === null) {
      return /*#__PURE__*/ React$1.createElement(
        TransitionGroupContext.Provider,
        {
          value: contextValue
        },
        children
      )
    }

    return /*#__PURE__*/ React$1.createElement(
      TransitionGroupContext.Provider,
      {
        value: contextValue
      },
      /*#__PURE__*/ React$1.createElement(Component, props, children)
    )
  }

  return TransitionGroup
})(React$1.Component)

TransitionGroup.propTypes =
  process.env.NODE_ENV !== 'production'
    ? {
        /**
         * `<TransitionGroup>` renders a `<div>` by default. You can change this
         * behavior by providing a `component` prop.
         * If you use React v16+ and would like to avoid a wrapping `<div>` element
         * you can pass in `component={null}`. This is useful if the wrapping div
         * borks your css styles.
         */
        component: PropTypes.any,

        /**
         * A set of `<Transition>` components, that are toggled `in` and out as they
         * leave. the `<TransitionGroup>` will inject specific transition props, so
         * remember to spread them through if you are wrapping the `<Transition>` as
         * with our `<Fade>` example.
         *
         * While this component is meant for multiple `Transition` or `CSSTransition`
         * children, sometimes you may want to have a single transition child with
         * content that you want to be transitioned out and in when you change it
         * (e.g. routes, images etc.) In that case you can change the `key` prop of
         * the transition child as you change its content, this will cause
         * `TransitionGroup` to transition the child out and back in.
         */
        children: PropTypes.node,

        /**
         * A convenience prop that enables or disables appear animations
         * for all children. Note that specifying this will override any defaults set
         * on individual children Transitions.
         */
        appear: PropTypes.bool,

        /**
         * A convenience prop that enables or disables enter animations
         * for all children. Note that specifying this will override any defaults set
         * on individual children Transitions.
         */
        enter: PropTypes.bool,

        /**
         * A convenience prop that enables or disables exit animations
         * for all children. Note that specifying this will override any defaults set
         * on individual children Transitions.
         */
        exit: PropTypes.bool,

        /**
         * You may need to apply reactive updates to a child as it is exiting.
         * This is generally done by using `cloneElement` however in the case of an exiting
         * child the element has already been removed and not accessible to the consumer.
         *
         * If you do need to update a child as it leaves you can provide a `childFactory`
         * to wrap every child, even the ones that are leaving.
         *
         * @type Function(child: ReactElement) -> ReactElement
         */
        childFactory: PropTypes.func
      }
    : {}
TransitionGroup.defaultProps = defaultProps
var TransitionGroup$1 = TransitionGroup

function Ripple(props) {
  const {
    className,
    classes,
    pulsate = false,
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout
  } = props
  const [leaving, setLeaving] = react.exports.useState(false)
  const rippleClassName = clsx(
    className,
    classes.ripple,
    classes.rippleVisible,
    pulsate && classes.ripplePulsate
  )
  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  }
  const childClassName = clsx(
    classes.child,
    leaving && classes.childLeaving,
    pulsate && classes.childPulsate
  )

  if (!inProp && !leaving) {
    setLeaving(true)
  }

  react.exports.useEffect(() => {
    if (!inProp && onExited != null) {
      // react-transition-group#onExited
      const timeoutId = setTimeout(onExited, timeout)
      return () => {
        clearTimeout(timeoutId)
      }
    }

    return undefined
  }, [onExited, inProp, timeout])
  return /*#__PURE__*/ jsxRuntime.jsx('span', {
    className: rippleClassName,
    style: rippleStyles,
    children: /*#__PURE__*/ jsxRuntime.jsx('span', {
      className: childClassName
    })
  })
}

process.env.NODE_ENV !== 'production'
  ? (Ripple.propTypes = {
      /**
       * Override or extend the styles applied to the component.
       * See [CSS API](#css) below for more details.
       */
      classes: PropTypes.object.isRequired,
      className: PropTypes.string,

      /**
       * @ignore - injected from TransitionGroup
       */
      in: PropTypes.bool,

      /**
       * @ignore - injected from TransitionGroup
       */
      onExited: PropTypes.func,

      /**
       * If `true`, the ripple pulsates, typically indicating the keyboard focus state of an element.
       */
      pulsate: PropTypes.bool,

      /**
       * Diameter of the ripple.
       */
      rippleSize: PropTypes.number,

      /**
       * Horizontal position of the ripple center.
       */
      rippleX: PropTypes.number,

      /**
       * Vertical position of the ripple center.
       */
      rippleY: PropTypes.number,

      /**
       * exit delay
       */
      timeout: PropTypes.number.isRequired
    })
  : void 0

const touchRippleClasses = generateUtilityClasses('MuiTouchRipple', [
  'root',
  'ripple',
  'rippleVisible',
  'ripplePulsate',
  'child',
  'childLeaving',
  'childPulsate'
])

const _excluded$2 = ['center', 'classes', 'className']

let _ = (t) => t,
  _t,
  _t2,
  _t3,
  _t4
const DURATION = 550
const DELAY_RIPPLE = 80
const enterKeyframe = keyframes(
  _t ||
    (_t = _`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)
)
const exitKeyframe = keyframes(
  _t2 ||
    (_t2 = _`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)
)
const pulsateKeyframe = keyframes(
  _t3 ||
    (_t3 = _`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)
)
const TouchRippleRoot = styled('span', {
  name: 'MuiTouchRipple',
  slot: 'Root',
  skipSx: true
})({
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: 'inherit'
}) // This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.

const TouchRippleRipple = styled(Ripple, {
  name: 'MuiTouchRipple',
  slot: 'Ripple'
})(
  _t4 ||
    (_t4 = _`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`),
  touchRippleClasses.rippleVisible,
  enterKeyframe,
  DURATION,
  ({ theme }) => theme.transitions.easing.easeInOut,
  touchRippleClasses.ripplePulsate,
  ({ theme }) => theme.transitions.duration.shorter,
  touchRippleClasses.child,
  touchRippleClasses.childLeaving,
  exitKeyframe,
  DURATION,
  ({ theme }) => theme.transitions.easing.easeInOut,
  touchRippleClasses.childPulsate,
  pulsateKeyframe,
  ({ theme }) => theme.transitions.easing.easeInOut
)
/**
 * @ignore - internal component.
 *
 * TODO v5: Make private
 */

const TouchRipple = /*#__PURE__*/ react.exports.forwardRef(function TouchRipple(
  inProps,
  ref
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTouchRipple'
  })

  const { center: centerProp = false, classes = {}, className } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$2)

  const [ripples, setRipples] = react.exports.useState([])
  const nextKey = react.exports.useRef(0)
  const rippleCallback = react.exports.useRef(null)
  react.exports.useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current()
      rippleCallback.current = null
    }
  }, [ripples]) // Used to filter out mouse emulated events on mobile.

  const ignoringMouseDown = react.exports.useRef(false) // We use a timer in order to only show the ripples for touch "click" like events.
  // We don't want to display the ripple for touch scroll events.

  const startTimer = react.exports.useRef(null) // This is the hook called once the previous timeout is ready.

  const startTimerCommit = react.exports.useRef(null)
  const container = react.exports.useRef(null)
  react.exports.useEffect(() => {
    return () => {
      clearTimeout(startTimer.current)
    }
  }, [])
  const startCommit = react.exports.useCallback(
    (params) => {
      const { pulsate, rippleX, rippleY, rippleSize, cb } = params
      setRipples((oldRipples) => [
        ...oldRipples,
        /*#__PURE__*/ jsxRuntime.jsx(
          TouchRippleRipple,
          {
            classes: {
              ripple: clsx(classes.ripple, touchRippleClasses.ripple),
              rippleVisible: clsx(
                classes.rippleVisible,
                touchRippleClasses.rippleVisible
              ),
              ripplePulsate: clsx(
                classes.ripplePulsate,
                touchRippleClasses.ripplePulsate
              ),
              child: clsx(classes.child, touchRippleClasses.child),
              childLeaving: clsx(
                classes.childLeaving,
                touchRippleClasses.childLeaving
              ),
              childPulsate: clsx(
                classes.childPulsate,
                touchRippleClasses.childPulsate
              )
            },
            timeout: DURATION,
            pulsate: pulsate,
            rippleX: rippleX,
            rippleY: rippleY,
            rippleSize: rippleSize
          },
          nextKey.current
        )
      ])
      nextKey.current += 1
      rippleCallback.current = cb
    },
    [classes]
  )
  const start = react.exports.useCallback(
    (event = {}, options = {}, cb) => {
      const {
        pulsate = false,
        center = centerProp || options.pulsate,
        fakeElement = false // For test purposes
      } = options

      if (event.type === 'mousedown' && ignoringMouseDown.current) {
        ignoringMouseDown.current = false
        return
      }

      if (event.type === 'touchstart') {
        ignoringMouseDown.current = true
      }

      const element = fakeElement ? null : container.current
      const rect = element
        ? element.getBoundingClientRect()
        : {
            width: 0,
            height: 0,
            left: 0,
            top: 0
          } // Get the size of the ripple

      let rippleX
      let rippleY
      let rippleSize

      if (
        center ||
        (event.clientX === 0 && event.clientY === 0) ||
        (!event.clientX && !event.touches)
      ) {
        rippleX = Math.round(rect.width / 2)
        rippleY = Math.round(rect.height / 2)
      } else {
        const { clientX, clientY } = event.touches ? event.touches[0] : event
        rippleX = Math.round(clientX - rect.left)
        rippleY = Math.round(clientY - rect.top)
      }

      if (center) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3) // For some reason the animation is broken on Mobile Chrome if the size is even.

        if (rippleSize % 2 === 0) {
          rippleSize += 1
        }
      } else {
        const sizeX =
          Math.max(
            Math.abs((element ? element.clientWidth : 0) - rippleX),
            rippleX
          ) *
            2 +
          2
        const sizeY =
          Math.max(
            Math.abs((element ? element.clientHeight : 0) - rippleY),
            rippleY
          ) *
            2 +
          2
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2)
      } // Touche devices

      if (event.touches) {
        // check that this isn't another touchstart due to multitouch
        // otherwise we will only clear a single timer when unmounting while two
        // are running
        if (startTimerCommit.current === null) {
          // Prepare the ripple effect.
          startTimerCommit.current = () => {
            startCommit({
              pulsate,
              rippleX,
              rippleY,
              rippleSize,
              cb
            })
          } // Delay the execution of the ripple effect.

          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current()
              startTimerCommit.current = null
            }
          }, DELAY_RIPPLE) // We have to make a tradeoff with this value.
        }
      } else {
        startCommit({
          pulsate,
          rippleX,
          rippleY,
          rippleSize,
          cb
        })
      }
    },
    [centerProp, startCommit]
  )
  const pulsate = react.exports.useCallback(() => {
    start(
      {},
      {
        pulsate: true
      }
    )
  }, [start])
  const stop = react.exports.useCallback((event, cb) => {
    clearTimeout(startTimer.current) // The touch interaction occurs too quickly.
    // We still want to show ripple effect.

    if (event.type === 'touchend' && startTimerCommit.current) {
      startTimerCommit.current()
      startTimerCommit.current = null
      startTimer.current = setTimeout(() => {
        stop(event, cb)
      })
      return
    }

    startTimerCommit.current = null
    setRipples((oldRipples) => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1)
      }

      return oldRipples
    })
    rippleCallback.current = cb
  }, [])
  react.exports.useImperativeHandle(
    ref,
    () => ({
      pulsate,
      start,
      stop
    }),
    [pulsate, start, stop]
  )
  return /*#__PURE__*/ jsxRuntime.jsx(
    TouchRippleRoot,
    _extends(
      {
        className: clsx(classes.root, touchRippleClasses.root, className),
        ref: container
      },
      other,
      {
        children: /*#__PURE__*/ jsxRuntime.jsx(TransitionGroup$1, {
          component: null,
          exit: true,
          children: ripples
        })
      }
    )
  )
})
process.env.NODE_ENV !== 'production'
  ? (TouchRipple.propTypes = {
      /**
       * If `true`, the ripple starts at the center of the component
       * rather than at the point of interaction.
       */
      center: PropTypes.bool,

      /**
       * Override or extend the styles applied to the component.
       * See [CSS API](#css) below for more details.
       */
      classes: PropTypes.object,

      /**
       * @ignore
       */
      className: PropTypes.string
    })
  : void 0

function getButtonBaseUtilityClass(slot) {
  return generateUtilityClass('MuiButtonBase', slot)
}
const buttonBaseClasses = generateUtilityClasses('MuiButtonBase', [
  'root',
  'disabled',
  'focusVisible'
])

const _excluded$1 = [
  'action',
  'centerRipple',
  'children',
  'className',
  'component',
  'disabled',
  'disableRipple',
  'disableTouchRipple',
  'focusRipple',
  'focusVisibleClassName',
  'LinkComponent',
  'onBlur',
  'onClick',
  'onContextMenu',
  'onDragLeave',
  'onFocus',
  'onFocusVisible',
  'onKeyDown',
  'onKeyUp',
  'onMouseDown',
  'onMouseLeave',
  'onMouseUp',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  'tabIndex',
  'TouchRippleProps',
  'type'
]

const useUtilityClasses$1 = (ownerState) => {
  const { disabled, focusVisible, focusVisibleClassName, classes } = ownerState
  const slots = {
    root: ['root', disabled && 'disabled', focusVisible && 'focusVisible']
  }
  const composedClasses = composeClasses(
    slots,
    getButtonBaseUtilityClass,
    classes
  )

  if (focusVisible && focusVisibleClassName) {
    composedClasses.root += ` ${focusVisibleClassName}`
  }

  return composedClasses
}

const ButtonBaseRoot = styled('button', {
  name: 'MuiButtonBase',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'position': 'relative',
  'boxSizing': 'border-box',
  'WebkitTapHighlightColor': 'transparent',
  'backgroundColor': 'transparent',
  // Reset default value
  // We disable the focus ring for mouse, touch and keyboard users.
  'outline': 0,
  'border': 0,
  'margin': 0,
  // Remove the margin in Safari
  'borderRadius': 0,
  'padding': 0,
  // Remove the padding in Firefox
  'cursor': 'pointer',
  'userSelect': 'none',
  'verticalAlign': 'middle',
  'MozAppearance': 'none',
  // Reset
  'WebkitAppearance': 'none',
  // Reset
  'textDecoration': 'none',
  // So we take precedent over the style of a native <a /> element.
  'color': 'inherit',
  '&::-moz-focus-inner': {
    borderStyle: 'none' // Remove Firefox dotted outline.
  },
  [`&.${buttonBaseClasses.disabled}`]: {
    pointerEvents: 'none',
    // Disable link interactions
    cursor: 'default'
  },
  '@media print': {
    colorAdjust: 'exact'
  }
})
/**
 * `ButtonBase` contains as few styles as possible.
 * It aims to be a simple building block for creating a button.
 * It contains a load of style reset and some focus/ripple logic.
 */

const ButtonBase = /*#__PURE__*/ react.exports.forwardRef(function ButtonBase(
  inProps,
  ref
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiButtonBase'
  })

  const {
      action,
      centerRipple = false,
      children,
      className,
      component = 'button',
      disabled = false,
      disableRipple = false,
      disableTouchRipple = false,
      focusRipple = false,
      LinkComponent = 'a',
      onBlur,
      onClick,
      onContextMenu,
      onDragLeave,
      onFocus,
      onFocusVisible,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      tabIndex = 0,
      TouchRippleProps,
      type
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$1)

  const buttonRef = react.exports.useRef(null)
  const rippleRef = react.exports.useRef(null)
  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible()
  const [focusVisible, setFocusVisible] = react.exports.useState(false)

  if (disabled && focusVisible) {
    setFocusVisible(false)
  }

  react.exports.useImperativeHandle(
    action,
    () => ({
      focusVisible: () => {
        setFocusVisible(true)
        buttonRef.current.focus()
      }
    }),
    []
  )
  react.exports.useEffect(() => {
    if (focusVisible && focusRipple && !disableRipple) {
      rippleRef.current.pulsate()
    }
  }, [disableRipple, focusRipple, focusVisible])

  function useRippleHandler(
    rippleAction,
    eventCallback,
    skipRippleAction = disableTouchRipple
  ) {
    return useEventCallback((event) => {
      if (eventCallback) {
        eventCallback(event)
      }

      const ignore = skipRippleAction

      if (!ignore && rippleRef.current) {
        rippleRef.current[rippleAction](event)
      }

      return true
    })
  }

  const handleMouseDown = useRippleHandler('start', onMouseDown)
  const handleContextMenu = useRippleHandler('stop', onContextMenu)
  const handleDragLeave = useRippleHandler('stop', onDragLeave)
  const handleMouseUp = useRippleHandler('stop', onMouseUp)
  const handleMouseLeave = useRippleHandler('stop', (event) => {
    if (focusVisible) {
      event.preventDefault()
    }

    if (onMouseLeave) {
      onMouseLeave(event)
    }
  })
  const handleTouchStart = useRippleHandler('start', onTouchStart)
  const handleTouchEnd = useRippleHandler('stop', onTouchEnd)
  const handleTouchMove = useRippleHandler('stop', onTouchMove)
  const handleBlur = useRippleHandler(
    'stop',
    (event) => {
      handleBlurVisible(event)

      if (isFocusVisibleRef.current === false) {
        setFocusVisible(false)
      }

      if (onBlur) {
        onBlur(event)
      }
    },
    false
  )
  const handleFocus = useEventCallback((event) => {
    // Fix for https://github.com/facebook/react/issues/7769
    if (!buttonRef.current) {
      buttonRef.current = event.currentTarget
    }

    handleFocusVisible(event)

    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true)

      if (onFocusVisible) {
        onFocusVisible(event)
      }
    }

    if (onFocus) {
      onFocus(event)
    }
  })

  const isNonNativeButton = () => {
    const button = buttonRef.current
    return (
      component &&
      component !== 'button' &&
      !(button.tagName === 'A' && button.href)
    )
  }
  /**
   * IE11 shim for https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
   */

  const keydownRef = react.exports.useRef(false)
  const handleKeyDown = useEventCallback((event) => {
    // Check if key is already down to avoid repeats being counted as multiple activations
    if (
      focusRipple &&
      !keydownRef.current &&
      focusVisible &&
      rippleRef.current &&
      event.key === ' '
    ) {
      keydownRef.current = true
      rippleRef.current.stop(event, () => {
        rippleRef.current.start(event)
      })
    }

    if (
      event.target === event.currentTarget &&
      isNonNativeButton() &&
      event.key === ' '
    ) {
      event.preventDefault()
    }

    if (onKeyDown) {
      onKeyDown(event)
    } // Keyboard accessibility for non interactive elements

    if (
      event.target === event.currentTarget &&
      isNonNativeButton() &&
      event.key === 'Enter' &&
      !disabled
    ) {
      event.preventDefault()

      if (onClick) {
        onClick(event)
      }
    }
  })
  const handleKeyUp = useEventCallback((event) => {
    // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
    // https://codesandbox.io/s/button-keyup-preventdefault-dn7f0
    if (
      focusRipple &&
      event.key === ' ' &&
      rippleRef.current &&
      focusVisible &&
      !event.defaultPrevented
    ) {
      keydownRef.current = false
      rippleRef.current.stop(event, () => {
        rippleRef.current.pulsate(event)
      })
    }

    if (onKeyUp) {
      onKeyUp(event)
    } // Keyboard accessibility for non interactive elements

    if (
      onClick &&
      event.target === event.currentTarget &&
      isNonNativeButton() &&
      event.key === ' ' &&
      !event.defaultPrevented
    ) {
      onClick(event)
    }
  })
  let ComponentProp = component

  if (ComponentProp === 'button' && (other.href || other.to)) {
    ComponentProp = LinkComponent
  }

  const buttonProps = {}

  if (ComponentProp === 'button') {
    buttonProps.type = type === undefined ? 'button' : type
    buttonProps.disabled = disabled
  } else {
    if (!other.href && !other.to) {
      buttonProps.role = 'button'
    }

    if (disabled) {
      buttonProps['aria-disabled'] = disabled
    }
  }

  const handleOwnRef = useForkRef(focusVisibleRef, buttonRef)
  const handleRef = useForkRef(ref, handleOwnRef)
  const [mountedState, setMountedState] = react.exports.useState(false)
  react.exports.useEffect(() => {
    setMountedState(true)
  }, [])
  const enableTouchRipple = mountedState && !disableRipple && !disabled

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react.exports.useEffect(() => {
      if (enableTouchRipple && !rippleRef.current) {
        console.error(
          [
            'MUI: The `component` prop provided to ButtonBase is invalid.',
            'Please make sure the children prop is rendered in this custom component.'
          ].join('\n')
        )
      }
    }, [enableTouchRipple])
  }

  const ownerState = _extends({}, props, {
    centerRipple,
    component,
    disabled,
    disableRipple,
    disableTouchRipple,
    focusRipple,
    tabIndex,
    focusVisible
  })

  const classes = useUtilityClasses$1(ownerState)
  return /*#__PURE__*/ jsxRuntime.jsxs(
    ButtonBaseRoot,
    _extends(
      {
        as: ComponentProp,
        className: clsx(classes.root, className),
        ownerState: ownerState,
        onBlur: handleBlur,
        onClick: onClick,
        onContextMenu: handleContextMenu,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        onMouseDown: handleMouseDown,
        onMouseLeave: handleMouseLeave,
        onMouseUp: handleMouseUp,
        onDragLeave: handleDragLeave,
        onTouchEnd: handleTouchEnd,
        onTouchMove: handleTouchMove,
        onTouchStart: handleTouchStart,
        ref: handleRef,
        tabIndex: disabled ? -1 : tabIndex,
        type: type
      },
      buttonProps,
      other,
      {
        children: [
          children,
          enableTouchRipple
            ? /*#__PURE__*/

              /* TouchRipple is only needed client-side, x2 boost on the server. */
              jsxRuntime.jsx(
                TouchRipple,
                _extends(
                  {
                    ref: rippleRef,
                    center: centerRipple
                  },
                  TouchRippleProps
                )
              )
            : null
        ]
      }
    )
  )
})
process.env.NODE_ENV !== 'production'
  ? (ButtonBase.propTypes =
      /* remove-proptypes */
      {
        // ----------------------------- Warning --------------------------------
        // | These PropTypes are generated from the TypeScript type definitions |
        // |     To update them edit the d.ts file and run "yarn proptypes"     |
        // ----------------------------------------------------------------------

        /**
         * A ref for imperative actions.
         * It currently only supports `focusVisible()` action.
         */
        action: refType$1,

        /**
         * If `true`, the ripples are centered.
         * They won't start at the cursor interaction position.
         * @default false
         */
        centerRipple: PropTypes.bool,

        /**
         * The content of the component.
         */
        children: PropTypes.node,

        /**
         * Override or extend the styles applied to the component.
         */
        classes: PropTypes.object,

        /**
         * @ignore
         */
        className: PropTypes.string,

        /**
         * The component used for the root node.
         * Either a string to use a HTML element or a component.
         */
        component: elementTypeAcceptingRef$1,

        /**
         * If `true`, the component is disabled.
         * @default false
         */
        disabled: PropTypes.bool,

        /**
         * If `true`, the ripple effect is disabled.
         *
         * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
         * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
         * @default false
         */
        disableRipple: PropTypes.bool,

        /**
         * If `true`, the touch ripple effect is disabled.
         * @default false
         */
        disableTouchRipple: PropTypes.bool,

        /**
         * If `true`, the base button will have a keyboard focus ripple.
         * @default false
         */
        focusRipple: PropTypes.bool,

        /**
         * This prop can help identify which element has keyboard focus.
         * The class name will be applied when the element gains the focus through keyboard interaction.
         * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
         * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/master/explainer.md).
         * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
         * if needed.
         */
        focusVisibleClassName: PropTypes.string,

        /**
         * @ignore
         */
        href:
          /* @typescript-to-proptypes-ignore */
          PropTypes.any,

        /**
         * The component used to render a link when the `href` prop is provided.
         * @default 'a'
         */
        LinkComponent: PropTypes.elementType,

        /**
         * @ignore
         */
        onBlur: PropTypes.func,

        /**
         * @ignore
         */
        onClick: PropTypes.func,

        /**
         * @ignore
         */
        onContextMenu: PropTypes.func,

        /**
         * @ignore
         */
        onDragLeave: PropTypes.func,

        /**
         * @ignore
         */
        onFocus: PropTypes.func,

        /**
         * Callback fired when the component is focused with a keyboard.
         * We trigger a `onFocus` callback too.
         */
        onFocusVisible: PropTypes.func,

        /**
         * @ignore
         */
        onKeyDown: PropTypes.func,

        /**
         * @ignore
         */
        onKeyUp: PropTypes.func,

        /**
         * @ignore
         */
        onMouseDown: PropTypes.func,

        /**
         * @ignore
         */
        onMouseLeave: PropTypes.func,

        /**
         * @ignore
         */
        onMouseUp: PropTypes.func,

        /**
         * @ignore
         */
        onTouchEnd: PropTypes.func,

        /**
         * @ignore
         */
        onTouchMove: PropTypes.func,

        /**
         * @ignore
         */
        onTouchStart: PropTypes.func,

        /**
         * The system prop that allows defining system overrides as well as additional CSS styles.
         */
        sx: PropTypes.oneOfType([
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object])
          ),
          PropTypes.func,
          PropTypes.object
        ]),

        /**
         * @default 0
         */
        tabIndex: PropTypes.number,

        /**
         * Props applied to the `TouchRipple` element.
         */
        TouchRippleProps: PropTypes.object,

        /**
         * @ignore
         */
        type: PropTypes.oneOfType([
          PropTypes.oneOf(['button', 'reset', 'submit']),
          PropTypes.string
        ])
      })
  : void 0
var ButtonBase$1 = ButtonBase

function getButtonUtilityClass(slot) {
  return generateUtilityClass('MuiButton', slot)
}
const buttonClasses = generateUtilityClasses('MuiButton', [
  'root',
  'text',
  'textInherit',
  'textPrimary',
  'textSecondary',
  'outlined',
  'outlinedInherit',
  'outlinedPrimary',
  'outlinedSecondary',
  'contained',
  'containedInherit',
  'containedPrimary',
  'containedSecondary',
  'disableElevation',
  'focusVisible',
  'disabled',
  'colorInherit',
  'textSizeSmall',
  'textSizeMedium',
  'textSizeLarge',
  'outlinedSizeSmall',
  'outlinedSizeMedium',
  'outlinedSizeLarge',
  'containedSizeSmall',
  'containedSizeMedium',
  'containedSizeLarge',
  'sizeMedium',
  'sizeSmall',
  'sizeLarge',
  'fullWidth',
  'startIcon',
  'endIcon',
  'iconSizeSmall',
  'iconSizeMedium',
  'iconSizeLarge'
])

/**
 * @ignore - internal component.
 */
const ButtonGroupContext = /*#__PURE__*/ react.exports.createContext({})

if (process.env.NODE_ENV !== 'production') {
  ButtonGroupContext.displayName = 'ButtonGroupContext'
}

const _excluded = [
  'children',
  'className',
  'color',
  'component',
  'disabled',
  'disableElevation',
  'disableFocusRipple',
  'disableRipple',
  'endIcon',
  'focusVisibleClassName',
  'fullWidth',
  'size',
  'startIcon',
  'type',
  'variant'
]

const useUtilityClasses = (ownerState) => {
  const { color, disableElevation, fullWidth, size, variant, classes } =
    ownerState
  const slots = {
    root: [
      'root',
      variant,
      `${variant}${capitalize(color)}`,
      `size${capitalize(size)}`,
      `${variant}Size${capitalize(size)}`,
      color === 'inherit' && 'colorInherit',
      disableElevation && 'disableElevation',
      fullWidth && 'fullWidth'
    ],
    label: ['label'],
    startIcon: ['startIcon', `iconSize${capitalize(size)}`],
    endIcon: ['endIcon', `iconSize${capitalize(size)}`]
  }
  const composedClasses = composeClasses(slots, getButtonUtilityClass, classes)
  return _extends({}, classes, composedClasses)
}

const commonIconStyles = (ownerState) =>
  _extends(
    {},
    ownerState.size === 'small' && {
      '& > *:nth-of-type(1)': {
        fontSize: 18
      }
    },
    ownerState.size === 'medium' && {
      '& > *:nth-of-type(1)': {
        fontSize: 20
      }
    },
    ownerState.size === 'large' && {
      '& > *:nth-of-type(1)': {
        fontSize: 22
      }
    }
  )

const ButtonRoot = styled(ButtonBase$1, {
  shouldForwardProp: (prop) =>
    rootShouldForwardProp(prop) || prop === 'classes',
  name: 'MuiButton',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props
    return [
      styles.root,
      styles[ownerState.variant],
      styles[`${ownerState.variant}${capitalize(ownerState.color)}`],
      styles[`size${capitalize(ownerState.size)}`],
      styles[`${ownerState.variant}Size${capitalize(ownerState.size)}`],
      ownerState.color === 'inherit' && styles.colorInherit,
      ownerState.disableElevation && styles.disableElevation,
      ownerState.fullWidth && styles.fullWidth
    ]
  }
})(
  ({ theme, ownerState }) =>
    _extends(
      {},
      theme.typography.button,
      {
        'minWidth': 64,
        'padding': '6px 16px',
        'borderRadius': theme.shape.borderRadius,
        'transition': theme.transitions.create(
          ['background-color', 'box-shadow', 'border-color', 'color'],
          {
            duration: theme.transitions.duration.short
          }
        ),
        '&:hover': _extends(
          {
            'textDecoration': 'none',
            'backgroundColor': alpha(
              theme.palette.text.primary,
              theme.palette.action.hoverOpacity
            ),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: 'transparent'
            }
          },
          ownerState.variant === 'text' &&
            ownerState.color !== 'inherit' && {
              'backgroundColor': alpha(
                theme.palette[ownerState.color].main,
                theme.palette.action.hoverOpacity
              ),
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: 'transparent'
              }
            },
          ownerState.variant === 'outlined' &&
            ownerState.color !== 'inherit' && {
              'border': `1px solid ${theme.palette[ownerState.color].main}`,
              'backgroundColor': alpha(
                theme.palette[ownerState.color].main,
                theme.palette.action.hoverOpacity
              ),
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: 'transparent'
              }
            },
          ownerState.variant === 'contained' && {
            'backgroundColor': theme.palette.grey.A100,
            'boxShadow': theme.shadows[4],
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              boxShadow: theme.shadows[2],
              backgroundColor: theme.palette.grey[300]
            }
          },
          ownerState.variant === 'contained' &&
            ownerState.color !== 'inherit' && {
              'backgroundColor': theme.palette[ownerState.color].dark,
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: theme.palette[ownerState.color].main
              }
            }
        ),
        '&:active': _extends(
          {},
          ownerState.variant === 'contained' && {
            boxShadow: theme.shadows[8]
          }
        ),
        [`&.${buttonClasses.focusVisible}`]: _extends(
          {},
          ownerState.variant === 'contained' && {
            boxShadow: theme.shadows[6]
          }
        ),
        [`&.${buttonClasses.disabled}`]: _extends(
          {
            color: theme.palette.action.disabled
          },
          ownerState.variant === 'outlined' && {
            border: `1px solid ${theme.palette.action.disabledBackground}`
          },
          ownerState.variant === 'outlined' &&
            ownerState.color === 'secondary' && {
              border: `1px solid ${theme.palette.action.disabled}`
            },
          ownerState.variant === 'contained' && {
            color: theme.palette.action.disabled,
            boxShadow: theme.shadows[0],
            backgroundColor: theme.palette.action.disabledBackground
          }
        )
      },
      ownerState.variant === 'text' && {
        padding: '6px 8px'
      },
      ownerState.variant === 'text' &&
        ownerState.color !== 'inherit' && {
          color: theme.palette[ownerState.color].main
        },
      ownerState.variant === 'outlined' && {
        padding: '5px 15px',
        border: `1px solid ${
          theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.23)'
            : 'rgba(255, 255, 255, 0.23)'
        }`
      },
      ownerState.variant === 'outlined' &&
        ownerState.color !== 'inherit' && {
          color: theme.palette[ownerState.color].main,
          border: `1px solid ${alpha(
            theme.palette[ownerState.color].main,
            0.5
          )}`
        },
      ownerState.variant === 'contained' && {
        color: theme.palette.getContrastText(theme.palette.grey[300]),
        backgroundColor: theme.palette.grey[300],
        boxShadow: theme.shadows[2]
      },
      ownerState.variant === 'contained' &&
        ownerState.color !== 'inherit' && {
          color: theme.palette[ownerState.color].contrastText,
          backgroundColor: theme.palette[ownerState.color].main
        },
      ownerState.color === 'inherit' && {
        color: 'inherit',
        borderColor: 'currentColor'
      },
      ownerState.size === 'small' &&
        ownerState.variant === 'text' && {
          padding: '4px 5px',
          fontSize: theme.typography.pxToRem(13)
        },
      ownerState.size === 'large' &&
        ownerState.variant === 'text' && {
          padding: '8px 11px',
          fontSize: theme.typography.pxToRem(15)
        },
      ownerState.size === 'small' &&
        ownerState.variant === 'outlined' && {
          padding: '3px 9px',
          fontSize: theme.typography.pxToRem(13)
        },
      ownerState.size === 'large' &&
        ownerState.variant === 'outlined' && {
          padding: '7px 21px',
          fontSize: theme.typography.pxToRem(15)
        },
      ownerState.size === 'small' &&
        ownerState.variant === 'contained' && {
          padding: '4px 10px',
          fontSize: theme.typography.pxToRem(13)
        },
      ownerState.size === 'large' &&
        ownerState.variant === 'contained' && {
          padding: '8px 22px',
          fontSize: theme.typography.pxToRem(15)
        },
      ownerState.fullWidth && {
        width: '100%'
      }
    ),
  ({ ownerState }) =>
    ownerState.disableElevation && {
      'boxShadow': 'none',
      '&:hover': {
        boxShadow: 'none'
      },
      [`&.${buttonClasses.focusVisible}`]: {
        boxShadow: 'none'
      },
      '&:active': {
        boxShadow: 'none'
      },
      [`&.${buttonClasses.disabled}`]: {
        boxShadow: 'none'
      }
    }
)
const ButtonStartIcon = styled('span', {
  name: 'MuiButton',
  slot: 'StartIcon',
  overridesResolver: (props, styles) => {
    const { ownerState } = props
    return [styles.startIcon, styles[`iconSize${capitalize(ownerState.size)}`]]
  }
})(({ ownerState }) =>
  _extends(
    {
      display: 'inherit',
      marginRight: 8,
      marginLeft: -4
    },
    ownerState.size === 'small' && {
      marginLeft: -2
    },
    commonIconStyles(ownerState)
  )
)
const ButtonEndIcon = styled('span', {
  name: 'MuiButton',
  slot: 'EndIcon',
  overridesResolver: (props, styles) => {
    const { ownerState } = props
    return [styles.endIcon, styles[`iconSize${capitalize(ownerState.size)}`]]
  }
})(({ ownerState }) =>
  _extends(
    {
      display: 'inherit',
      marginRight: -4,
      marginLeft: 8
    },
    ownerState.size === 'small' && {
      marginRight: -2
    },
    commonIconStyles(ownerState)
  )
)
const Button = /*#__PURE__*/ react.exports.forwardRef(function Button(
  inProps,
  ref
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiButton'
  })
  const {
    className: classNameContext,
    color: colorContext,
    disabled: disabledContext,
    disableElevation: disableElevationContext,
    disableFocusRipple: disableFocusRippleContext,
    disableRipple: disableRippleContext,
    fullWidth: fullWidthContext,
    size: sizeContext,
    variant: variantContext
  } = react.exports.useContext(ButtonGroupContext)

  const {
      children,
      className,
      color: colorProp,
      component = 'button',
      disabled: disabledProp,
      disableElevation: disableElevationProp,
      disableFocusRipple: disableFocusRippleProp,
      disableRipple: disableRippleProp,
      endIcon: endIconProp,
      focusVisibleClassName,
      fullWidth: fullWidthProp,
      size: sizeProp,
      startIcon: startIconProp,
      type,
      variant: variantProp
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded)

  const color = colorProp || colorContext || 'primary' // TODO v6: Use nullish coalescing (??) instead of OR operator for these boolean props so that these boolean props for Button with ButtonGroup context take priority. See conversation from https://github.com/mui-org/material-ui/pull/28645#discussion_r738380902.

  const disabled = disabledProp || disabledContext || false
  const disableElevation =
    disableElevationProp || disableElevationContext || false
  const disableFocusRipple =
    disableFocusRippleProp || disableFocusRippleContext || false
  const fullWidth = fullWidthProp || fullWidthContext || false
  const size = sizeProp || sizeContext || 'medium'
  const variant = variantProp || variantContext || 'text'
  const disableRipple = disableRippleProp || disableRippleContext || false

  const ownerState = _extends({}, props, {
    color,
    component,
    disabled,
    disableElevation,
    disableFocusRipple,
    fullWidth,
    size,
    type,
    variant
  })

  const classes = useUtilityClasses(ownerState)

  const startIcon =
    startIconProp &&
    /*#__PURE__*/ jsxRuntime.jsx(ButtonStartIcon, {
      className: classes.startIcon,
      ownerState: ownerState,
      children: startIconProp
    })

  const endIcon =
    endIconProp &&
    /*#__PURE__*/ jsxRuntime.jsx(ButtonEndIcon, {
      className: classes.endIcon,
      ownerState: ownerState,
      children: endIconProp
    })

  return /*#__PURE__*/ jsxRuntime.jsxs(
    ButtonRoot,
    _extends(
      {
        ownerState: ownerState,
        className: clsx(className, classNameContext),
        component: component,
        disabled: disabled,
        disableRipple: disableRipple,
        focusRipple: !disableFocusRipple,
        focusVisibleClassName: clsx(
          classes.focusVisible,
          focusVisibleClassName
        ),
        ref: ref,
        type: type
      },
      other,
      {
        classes: classes,
        children: [startIcon, children, endIcon]
      }
    )
  )
})
process.env.NODE_ENV !== 'production'
  ? (Button.propTypes =
      /* remove-proptypes */
      {
        // ----------------------------- Warning --------------------------------
        // | These PropTypes are generated from the TypeScript type definitions |
        // |     To update them edit the d.ts file and run "yarn proptypes"     |
        // ----------------------------------------------------------------------

        /**
         * The content of the component.
         */
        children: PropTypes.node,

        /**
         * Override or extend the styles applied to the component.
         */
        classes: PropTypes.object,

        /**
         * @ignore
         */
        className: PropTypes.string,

        /**
         * The color of the component. It supports those theme colors that make sense for this component.
         * @default 'primary'
         */
        color: PropTypes
          /* @typescript-to-proptypes-ignore */
          .oneOfType([
            PropTypes.oneOf([
              'inherit',
              'primary',
              'secondary',
              'success',
              'error',
              'info',
              'warning'
            ]),
            PropTypes.string
          ]),

        /**
         * The component used for the root node.
         * Either a string to use a HTML element or a component.
         */
        component: PropTypes.elementType,

        /**
         * If `true`, the component is disabled.
         * @default false
         */
        disabled: PropTypes.bool,

        /**
         * If `true`, no elevation is used.
         * @default false
         */
        disableElevation: PropTypes.bool,

        /**
         * If `true`, the  keyboard focus ripple is disabled.
         * @default false
         */
        disableFocusRipple: PropTypes.bool,

        /**
         * If `true`, the ripple effect is disabled.
         *
         * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
         * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
         * @default false
         */
        disableRipple: PropTypes.bool,

        /**
         * Element placed after the children.
         */
        endIcon: PropTypes.node,

        /**
         * @ignore
         */
        focusVisibleClassName: PropTypes.string,

        /**
         * If `true`, the button will take up the full width of its container.
         * @default false
         */
        fullWidth: PropTypes.bool,

        /**
         * The URL to link to when the button is clicked.
         * If defined, an `a` element will be used as the root node.
         */
        href: PropTypes.string,

        /**
         * The size of the component.
         * `small` is equivalent to the dense button styling.
         * @default 'medium'
         */
        size: PropTypes
          /* @typescript-to-proptypes-ignore */
          .oneOfType([
            PropTypes.oneOf(['small', 'medium', 'large']),
            PropTypes.string
          ]),

        /**
         * Element placed before the children.
         */
        startIcon: PropTypes.node,

        /**
         * The system prop that allows defining system overrides as well as additional CSS styles.
         */
        sx: PropTypes.oneOfType([
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.func, PropTypes.object])
          ),
          PropTypes.func,
          PropTypes.object
        ]),

        /**
         * @ignore
         */
        type: PropTypes.oneOfType([
          PropTypes.oneOf(['button', 'reset', 'submit']),
          PropTypes.string
        ]),

        /**
         * The variant to use.
         * @default 'text'
         */
        variant: PropTypes
          /* @typescript-to-proptypes-ignore */
          .oneOfType([
            PropTypes.oneOf(['contained', 'outlined', 'text']),
            PropTypes.string
          ])
      })
  : void 0
var Button$1 = Button

var JGButton = function JGButton() {
  return /*#__PURE__*/ React.createElement(Button$1, null)
}

module.exports = JGButton
