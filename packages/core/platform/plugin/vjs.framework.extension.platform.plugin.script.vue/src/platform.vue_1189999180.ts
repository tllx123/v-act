;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.Vue = factory())
})(this, function () {
  let emptyObject = Object.freeze({})
  function isUndef(v) {
    return v === undefined || v === null
  }
  function isDef(v) {
    return v !== undefined && v !== null
  }
  function isTrue(v) {
    return v === true
  }
  function isFalse(v) {
    return v === false
  }
  function isPrimitive(value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }
  function isObject(obj) {
    return obj !== null && typeof obj === 'object'
  }
  let _toString = Object.prototype.toString
  function toRawType(value) {
    return _toString.call(value).slice(8, -1)
  }
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
  }
  function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
  }
  function isValidArrayIndex(val) {
    let n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }
  function toString(val) {
    return val == null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
  }
  function toNumber(val) {
    let n = parseFloat(val)
    return isNaN(n) ? val : n
  }
  function makeMap(str, expectsLowerCase) {
    let map = Object.create(null)
    let list = str.split(',')
    for (let i = 0; i < list.length; i++) map[list[i]] = true
    return expectsLowerCase
      ? function (val) {
          return map[val.toLowerCase()]
        }
      : function (val) {
          return map[val]
        }
  }
  let isBuiltInTag = makeMap('slot,component', true)
  let isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')
  function remove(arr, item) {
    if (arr.length) {
      let index = arr.indexOf(item)
      if (index > -1) return arr.splice(index, 1)
    }
  }
  let hasOwnProperty = Object.prototype.hasOwnProperty
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
  }
  function cached(fn) {
    let cache = Object.create(null)
    return function cachedFn(str) {
      let hit = cache[str]
      return hit || (cache[str] = fn(str))
    }
  }
  let camelizeRE = /-(\w)/g
  let camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : ''
    })
  })
  let capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })
  let hyphenateRE = /\B([A-Z])/g
  let hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  })
  function polyfillBind(fn, ctx) {
    function boundFn(a) {
      let l = arguments.length
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }
    boundFn._length = fn.length
    return boundFn
  }
  function nativeBind(fn, ctx) {
    return fn.bind(ctx)
  }
  let bind = Function.prototype.bind ? nativeBind : polyfillBind
  function toArray(list, start) {
    start = start || 0
    let i = list.length - start
    let ret = new Array(i)
    while (i--) ret[i] = list[i + start]
    return ret
  }
  function extend(to, _from) {
    for (let key in _from) to[key] = _from[key]
    return to
  }
  function toObject(arr) {
    let res = {}
    for (let i = 0; i < arr.length; i++) if (arr[i]) extend(res, arr[i])
    return res
  }
  function noop(a, b, c) {}
  let no = function (a, b, c) {
    return false
  }
  let identity = function (_) {
    return _
  }
  function genStaticKeys(modules) {
    return modules
      .reduce(function (keys, m) {
        return keys.concat(m.staticKeys || [])
      }, [])
      .join(',')
  }
  function looseEqual(a, b) {
    if (a === b) return true
    let isObjectA = isObject(a)
    let isObjectB = isObject(b)
    if (isObjectA && isObjectB)
      try {
        var isArrayA = Array.isArray(a)
        var isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB)
          return (
            a.length === b.length &&
            a.every(function (e, i) {
              return looseEqual(e, b[i])
            })
          )
        else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a)
          var keysB = Object.keys(b)
          return (
            keysA.length === keysB.length &&
            keysA.every(function (key) {
              return looseEqual(a[key], b[key])
            })
          )
        } else return false
      } catch (e) {
        return false
      }
    else if (!isObjectA && !isObjectB) return String(a) === String(b)
    else return false
  }
  function looseIndexOf(arr, val) {
    for (let i = 0; i < arr.length; i++) if (looseEqual(arr[i], val)) return i
    return -1
  }
  function once(fn) {
    let called = false
    return function () {
      if (!called) {
        called = true
        fn.apply(this, arguments)
      }
    }
  }
  let SSR_ATTR = 'data-server-rendered'
  let ASSET_TYPES = ['component', 'directive', 'filter']
  let LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
  ]
  let config = {
    optionMergeStrategies: Object.create(null),
    silent: false,
    productionTip: 'development' !== 'production',
    devtools: 'development' !== 'production',
    performance: false,
    errorHandler: null,
    warnHandler: null,
    ignoredElements: [],
    keyCodes: Object.create(null),
    isReservedTag: no,
    isReservedAttr: no,
    isUnknownElement: no,
    getTagNamespace: noop,
    parsePlatformTagName: identity,
    mustUseProp: no,
    _lifecycleHooks: LIFECYCLE_HOOKS
  }
  function isReserved(str) {
    let c = (str + '').charCodeAt(0)
    return c === 36 || c === 95
  }
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
  }
  let bailRE = /[^\w.$]/
  function parsePath(path) {
    if (bailRE.test(path)) return
    let segments = path.split('.')
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }
  let hasProto = '__proto__' in {}
  let inBrowser = typeof window !== 'undefined'
  let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
  let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
  let UA = inBrowser && window.navigator.userAgent.toLowerCase()
  let isIE = UA && /msie|trident/.test(UA)
  let isIE9 = UA && UA.indexOf('msie 9.0') > 0
  let isEdge = UA && UA.indexOf('edge/') > 0
  let isAndroid =
    (UA && UA.indexOf('android') > 0) || weexPlatform === 'android'
  let isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === 'ios'
  let isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
  let nativeWatch = {}.watch
  let supportsPassive = false
  if (inBrowser)
    try {
      var opts = {}
      Object.defineProperty(opts, 'passive', {
        get: function get() {
          supportsPassive = true
        }
      })
      window.addEventListener('test-passive', null, opts)
    } catch (e) {}
  let _isServer
  let isServerRendering = function () {
    if (_isServer === undefined)
      if (!inBrowser && !inWeex && typeof global !== 'undefined')
        _isServer = global['process'].env.VUE_ENV === 'server'
      else _isServer = false
    return _isServer
  }
  let devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__
  function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }
  let hasSymbol =
    typeof Symbol !== 'undefined' &&
    isNative(Symbol) &&
    typeof Reflect !== 'undefined' &&
    isNative(Reflect.ownKeys)
  let _Set
  if (typeof Set !== 'undefined' && isNative(Set)) _Set = Set
  else
    _Set = (function () {
      function Set() {
        this.set = Object.create(null)
      }
      Set.prototype.has = function has(key) {
        return this.set[key] === true
      }
      Set.prototype.add = function add(key) {
        this.set[key] = true
      }
      Set.prototype.clear = function clear() {
        this.set = Object.create(null)
      }
      return Set
    })()
  let warn = noop
  let tip = noop
  let generateComponentTrace = noop
  let formatComponentName = noop
  let hasConsole = typeof console !== 'undefined'
  let classifyRE = /(?:^|[-_])(\w)/g
  let classify = function (str) {
    return str
      .replace(classifyRE, function (c) {
        return c.toUpperCase()
      })
      .replace(/[-_]/g, '')
  }
  warn = function (msg, vm) {
    let trace = vm ? generateComponentTrace(vm) : ''
    if (config.warnHandler) config.warnHandler.call(null, msg, vm, trace)
    else if (hasConsole && !config.silent)
      console.error('[Vue warn]: ' + msg + trace)
  }
  tip = function (msg, vm) {
    if (hasConsole && !config.silent)
      console.warn('[Vue tip]: ' + msg + (vm ? generateComponentTrace(vm) : ''))
  }
  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) return '\x3cRoot\x3e'
    let options =
      typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {}
    let name = options.name || options._componentTag
    let file = options.__file
    if (!name && file) {
      let match = file.match(/([^/\\]+)\.vue$/)
      name = match && match[1]
    }
    return (
      (name ? '\x3c' + classify(name) + '\x3e' : '\x3cAnonymous\x3e') +
      (file && includeFile !== false ? ' at ' + file : '')
    )
  }
  let repeat = function (str, n) {
    let res = ''
    while (n) {
      if (n % 2 === 1) res += str
      if (n > 1) str += str
      n >>= 1
    }
    return res
  }
  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      let tree = []
      let currentRecursiveSequence = 0
      while (vm) {
        if (tree.length > 0) {
          let last = tree[tree.length - 1]
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++
            vm = vm.$parent
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence]
            currentRecursiveSequence = 0
          }
        }
        tree.push(vm)
        vm = vm.$parent
      }
      return (
        '\n\nfound in\n\n' +
        tree
          .map(function (vm, i) {
            return (
              '' +
              (i === 0 ? '---\x3e ' : repeat(' ', 5 + i * 2)) +
              (Array.isArray(vm)
                ? formatComponentName(vm[0]) +
                  '... (' +
                  vm[1] +
                  ' recursive calls)'
                : formatComponentName(vm))
            )
          })
          .join('\n')
      )
    } else return '\n\n(found in ' + formatComponentName(vm) + ')'
  }
  let uid = 0
  let Dep = function Dep() {
    this.id = uid++
    this.subs = []
  }
  Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub)
  }
  Dep.prototype.removeSub = function removeSub(sub) {
    remove(this.subs, sub)
  }
  Dep.prototype.depend = function depend() {
    if (Dep.target) Dep.target.addDep(this)
  }
  Dep.prototype.notify = function notify() {
    let subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) subs[i].update()
  }
  Dep.target = null
  let targetStack = []
  function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
  }
  function popTarget() {
    Dep.target = targetStack.pop()
  }
  let VNode = function VNode(
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }
  let prototypeAccessors = { child: { configurable: true } }
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  }
  Object.defineProperties(VNode.prototype, prototypeAccessors)
  let createEmptyVNode = function (text) {
    if (text === void 0) text = ''
    let node = new VNode()
    node.text = text
    node.isComment = true
    return node
  }
  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }
  function cloneVNode(vnode) {
    let cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children,
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    )
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    cloned.isComment = vnode.isComment
    cloned.fnContext = vnode.fnContext
    cloned.fnOptions = vnode.fnOptions
    cloned.fnScopeId = vnode.fnScopeId
    cloned.isCloned = true
    return cloned
  }
  let arrayProto = Array.prototype
  let arrayMethods = Object.create(arrayProto)
  let methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ]
  methodsToPatch.forEach(function (method) {
    let original = arrayProto[method]
    def(arrayMethods, method, function mutator() {
      let args = [],
        len = arguments.length
      while (len--) args[len] = arguments[len]
      let result = original.apply(this, args)
      let ob = this.__ob__
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    })
  })
  let arrayKeys = Object.getOwnPropertyNames(arrayMethods)
  let shouldObserve = true
  function toggleObserving(value) {
    shouldObserve = value
  }
  let Observer = function Observer(value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      let augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else this.walk(value)
  }
  Observer.prototype.walk = function walk(obj) {
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) defineReactive(obj, keys[i])
  }
  Observer.prototype.observeArray = function observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) observe(items[i])
  }
  function protoAugment(target, src, keys) {
    target.__proto__ = src
  }
  function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
      let key = keys[i]
      def(target, key, src[key])
    }
  }
  function observe(value, asRootData) {
    if (!isObject(value) || value instanceof VNode) return
    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer)
      ob = value.__ob__
    else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    )
      ob = new Observer(value)
    if (asRootData && ob) ob.vmCount++
    return ob
  }
  function defineReactive(obj, key, val, customSetter, shallow) {
    let dep = new Dep()
    let property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) return
    let getter = property && property.get
    if (!getter && arguments.length === 2) val = obj[key]
    let setter = property && property.set
    let childOb = !shallow && observe(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        let value = getter ? getter.call(obj) : val
        if (Dep.target) {
          dep.depend()
          if (childOb) {
            childOb.dep.depend()
            if (Array.isArray(value)) dependArray(value)
          }
        }
        return value
      },
      set: function reactiveSetter(newVal) {
        let value = getter ? getter.call(obj) : val
        if (newVal === value || (newVal !== newVal && value !== value)) return
        if ('development' !== 'production' && customSetter) customSetter()
        if (setter) setter.call(obj, newVal)
        else val = newVal
        childOb = !shallow && observe(newVal)
        dep.notify()
      }
    })
  }
  function set(target, key, val) {
    if (
      'development' !== 'production' &&
      !Array.isArray(target) &&
      !isObject(target)
    )
      warn('Cannot set reactive property on non-object/array value: ' + target)
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key)
      target.splice(key, 1, val)
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val
      return val
    }
    let ob = target.__ob__
    if (target._isVue || (ob && ob.vmCount)) {
      'development' !== 'production' &&
        warn(
          'Avoid adding reactive properties to a Vue instance or its root $data ' +
            'at runtime - declare it upfront in the data option.'
        )
      return val
    }
    if (!ob) {
      target[key] = val
      return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
  }
  function del(target, key) {
    if (
      'development' !== 'production' &&
      !Array.isArray(target) &&
      !isObject(target)
    )
      warn(
        'Cannot delete reactive property on non-object/array value: ' + target
      )
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1)
      return
    }
    let ob = target.__ob__
    if (target._isVue || (ob && ob.vmCount)) {
      'development' !== 'production' &&
        warn(
          'Avoid deleting properties on a Vue instance or its root $data ' +
            '- just set it to null.'
        )
      return
    }
    if (!hasOwn(target, key)) return
    delete target[key]
    if (!ob) return
    ob.dep.notify()
  }
  function dependArray(value) {
    for (let e = void 0, i = 0, l = value.length; i < l; i++) {
      e = value[i]
      e && e.__ob__ && e.__ob__.dep.depend()
      if (Array.isArray(e)) dependArray(e)
    }
  }
  let strats = config.optionMergeStrategies
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm)
      warn(
        'option "' +
          key +
          '" can only be used during instance ' +
          'creation with the `new` keyword.'
      )
    return defaultStrat(parent, child)
  }
  function mergeData(to, from) {
    if (!from || to === from) return to
    let key, toVal, fromVal
    let keys = Object.keys(from)
    for (let i = 0; i < keys.length; i++) {
      key = keys[i]
      toVal = to[key]
      fromVal = from[key]
      if (!hasOwn(to, key)) set(to, key, fromVal)
      else if (isPlainObject(toVal) && isPlainObject(fromVal))
        mergeData(toVal, fromVal)
    }
    return to
  }
  function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
      if (!childVal) return parentVal
      if (!parentVal) return childVal
      return function mergedDataFn() {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function'
            ? parentVal.call(this, this)
            : parentVal
        )
      }
    } else
      return function mergedInstanceDataFn() {
        var instanceData =
          typeof childVal === 'function' ? childVal.call(vm, vm) : childVal
        var defaultData =
          typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal
        if (instanceData) return mergeData(instanceData, defaultData)
        else return defaultData
      }
  }
  strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
        'development' !== 'production' &&
          warn(
            'The "data" option should be a function ' +
              'that returns a per-instance value in component ' +
              'definitions.',
            vm
          )
        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }
    return mergeDataOrFn(parentVal, childVal, vm)
  }
  function mergeHook(parentVal, childVal) {
    return childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
        ? childVal
        : [childVal]
      : parentVal
  }
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook
  })
  function mergeAssets(parentVal, childVal, vm, key) {
    let res = Object.create(parentVal || null)
    if (childVal) {
      'development' !== 'production' && assertObjectType(key, childVal, vm)
      return extend(res, childVal)
    } else return res
  }
  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets
  })
  strats.watch = function (parentVal, childVal, vm, key) {
    if (parentVal === nativeWatch) parentVal = undefined
    if (childVal === nativeWatch) childVal = undefined
    if (!childVal) return Object.create(parentVal || null)
    assertObjectType(key, childVal, vm)
    if (!parentVal) return childVal
    let ret = {}
    extend(ret, parentVal)
    for (let key$1 in childVal) {
      let parent = ret[key$1]
      let child = childVal[key$1]
      if (parent && !Array.isArray(parent)) parent = [parent]
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child)
        ? child
        : [child]
    }
    return ret
  }
  strats.props =
    strats.methods =
    strats.inject =
    strats.computed =
      function (parentVal, childVal, vm, key) {
        if (childVal && 'development' !== 'production')
          assertObjectType(key, childVal, vm)
        if (!parentVal) return childVal
        var ret = Object.create(null)
        extend(ret, parentVal)
        if (childVal) extend(ret, childVal)
        return ret
      }
  strats.provide = mergeDataOrFn
  let defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal
  }
  function checkComponents(options) {
    for (let key in options.components) validateComponentName(key)
  }
  function validateComponentName(name) {
    if (!/^[a-zA-Z][\w-]*$/.test(name))
      warn(
        'Invalid component name: "' +
          name +
          '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
      )
    if (isBuiltInTag(name) || config.isReservedTag(name))
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
          'id: ' +
          name
      )
  }
  function normalizeProps(options, vm) {
    let props = options.props
    if (!props) return
    let res = {}
    let i, val, name
    if (Array.isArray(props)) {
      i = props.length
      while (i--) {
        val = props[i]
        if (typeof val === 'string') {
          name = camelize(val)
          res[name] = { type: null }
        } else warn('props must be strings when using array syntax.')
      }
    } else if (isPlainObject(props))
      for (var key in props) {
        val = props[key]
        name = camelize(key)
        res[name] = isPlainObject(val) ? val : { type: val }
      }
    else
      warn(
        'Invalid value for option "props": expected an Array or an Object, ' +
          'but got ' +
          toRawType(props) +
          '.',
        vm
      )
    options.props = res
  }
  function normalizeInject(options, vm) {
    let inject = options.inject
    if (!inject) return
    let normalized = (options.inject = {})
    if (Array.isArray(inject))
      for (var i = 0; i < inject.length; i++)
        normalized[inject[i]] = { from: inject[i] }
    else if (isPlainObject(inject))
      for (var key in inject) {
        var val = inject[key]
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val }
      }
    else
      warn(
        'Invalid value for option "inject": expected an Array or an Object, ' +
          'but got ' +
          toRawType(inject) +
          '.',
        vm
      )
  }
  function normalizeDirectives(options) {
    let dirs = options.directives
    if (dirs)
      for (var key in dirs) {
        var def = dirs[key]
        if (typeof def === 'function') dirs[key] = { bind: def, update: def }
      }
  }
  function assertObjectType(name, value, vm) {
    if (!isPlainObject(value))
      warn(
        'Invalid value for option "' +
          name +
          '": expected an Object, ' +
          'but got ' +
          toRawType(value) +
          '.',
        vm
      )
  }
  function mergeOptions(parent, child, vm) {
    checkComponents(child)
    if (typeof child === 'function') child = child.options
    normalizeProps(child, vm)
    normalizeInject(child, vm)
    normalizeDirectives(child)
    let extendsFrom = child.extends
    if (extendsFrom) parent = mergeOptions(parent, extendsFrom, vm)
    if (child.mixins)
      for (var i = 0, l = child.mixins.length; i < l; i++)
        parent = mergeOptions(parent, child.mixins[i], vm)
    let options = {}
    let key
    for (key in parent) mergeField(key)
    for (key in child) if (!hasOwn(parent, key)) mergeField(key)
    function mergeField(key) {
      let strat = strats[key] || defaultStrat
      options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
  }
  function resolveAsset(options, type, id, warnMissing) {
    if (typeof id !== 'string') return
    let assets = options[type]
    if (hasOwn(assets, id)) return assets[id]
    let camelizedId = camelize(id)
    if (hasOwn(assets, camelizedId)) return assets[camelizedId]
    let PascalCaseId = capitalize(camelizedId)
    if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
    let res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
    if ('development' !== 'production' && warnMissing && !res)
      warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options)
    return res
  }
  function validateProp(key, propOptions, propsData, vm) {
    let prop = propOptions[key]
    let absent = !hasOwn(propsData, key)
    let value = propsData[key]
    let booleanIndex = getTypeIndex(Boolean, prop.type)
    if (booleanIndex > -1)
      if (absent && !hasOwn(prop, 'default')) value = false
      else if (value === '' || value === hyphenate(key)) {
        var stringIndex = getTypeIndex(String, prop.type)
        if (stringIndex < 0 || booleanIndex < stringIndex) value = true
      }
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key)
      let prevShouldObserve = shouldObserve
      toggleObserving(true)
      observe(value)
      toggleObserving(prevShouldObserve)
    }
    assertProp(prop, key, value, vm, absent)
    return value
  }
  function getPropDefaultValue(vm, prop, key) {
    if (!hasOwn(prop, 'default')) return undefined
    let def = prop.default
    if ('development' !== 'production' && isObject(def))
      warn(
        'Invalid default value for prop "' +
          key +
          '": ' +
          'Props with type Object/Array must use a factory function ' +
          'to return the default value.',
        vm
      )
    if (
      vm &&
      vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    )
      return vm._props[key]
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }
  function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
      warn('Missing required prop: "' + name + '"', vm)
      return
    }
    if (value == null && !prop.required) return
    let type = prop.type
    let valid = !type || type === true
    let expectedTypes = []
    if (type) {
      if (!Array.isArray(type)) type = [type]
      for (let i = 0; i < type.length && !valid; i++) {
        let assertedType = assertType(value, type[i])
        expectedTypes.push(assertedType.expectedType || '')
        valid = assertedType.valid
      }
    }
    if (!valid) {
      warn(
        'Invalid prop: type check failed for prop "' +
          name +
          '".' +
          ' Expected ' +
          expectedTypes.map(capitalize).join(', ') +
          ', got ' +
          toRawType(value) +
          '.',
        vm
      )
      return
    }
    let validator = prop.validator
    if (validator)
      if (!validator(value))
        warn(
          'Invalid prop: custom validator check failed for prop "' +
            name +
            '".',
          vm
        )
  }
  let simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/
  function assertType(value, type) {
    let valid
    let expectedType = getType(type)
    if (simpleCheckRE.test(expectedType)) {
      let t = typeof value
      valid = t === expectedType.toLowerCase()
      if (!valid && t === 'object') valid = value instanceof type
    } else if (expectedType === 'Object') valid = isPlainObject(value)
    else if (expectedType === 'Array') valid = Array.isArray(value)
    else valid = value instanceof type
    return { valid: valid, expectedType: expectedType }
  }
  function getType(fn) {
    let match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1] : ''
  }
  function isSameType(a, b) {
    return getType(a) === getType(b)
  }
  function getTypeIndex(type, expectedTypes) {
    if (!Array.isArray(expectedTypes))
      return isSameType(expectedTypes, type) ? 0 : -1
    for (let i = 0, len = expectedTypes.length; i < len; i++)
      if (isSameType(expectedTypes[i], type)) return i
    return -1
  }
  function handleError(err, vm, info) {
    if (vm) {
      let cur = vm
      while ((cur = cur.$parent)) {
        let hooks = cur.$options.errorCaptured
        if (hooks)
          for (var i = 0; i < hooks.length; i++)
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false
              if (capture) return
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook')
            }
      }
    }
    globalHandleError(err, vm, info)
  }
  function globalHandleError(err, vm, info) {
    if (config.errorHandler)
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        logError(e, null, 'config.errorHandler')
      }
    logError(err, vm, info)
  }
  function logError(err, vm, info) {
    warn('Error in ' + info + ': "' + err.toString() + '"', vm)
    if ((inBrowser || inWeex) && typeof console !== 'undefined')
      console.error(err)
    else throw err
  }
  let callbacks = []
  let pending = false
  function flushCallbacks() {
    pending = false
    let copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) copies[i]()
  }
  let microTimerFunc
  let macroTimerFunc
  let useMacroTask = false
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate))
    macroTimerFunc = function () {
      setImmediate(flushCallbacks)
    }
  else if (
    typeof MessageChannel !== 'undefined' &&
    (isNative(MessageChannel) ||
      MessageChannel.toString() === '[object MessageChannelConstructor]')
  ) {
    let channel = new MessageChannel()
    let port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = function () {
      port.postMessage(1)
    }
  } else
    macroTimerFunc = function () {
      setTimeout(flushCallbacks, 0)
    }
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    let p = Promise.resolve()
    microTimerFunc = function () {
      p.then(flushCallbacks)
      if (isIOS) setTimeout(noop)
    }
  } else microTimerFunc = macroTimerFunc
  function withMacroTask(fn) {
    return (
      fn._withTask ||
      (fn._withTask = function () {
        useMacroTask = true
        var res = fn.apply(null, arguments)
        useMacroTask = false
        return res
      })
    )
  }
  function nextTick(cb, ctx) {
    let _resolve
    callbacks.push(function () {
      if (cb)
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      else if (_resolve) _resolve(ctx)
    })
    if (!pending) {
      pending = true
      if (useMacroTask) macroTimerFunc()
      else microTimerFunc()
    }
    if (!cb && typeof Promise !== 'undefined')
      return new Promise(function (resolve) {
        _resolve = resolve
      })
  }
  let mark
  let measure
  let perf = inBrowser && window.performance
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) {
      return perf.mark(tag)
    }
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      perf.clearMeasures(name)
    }
  }
  let initProxy
  let allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require'
  )
  let warnNonPresent = function (target, key) {
    warn(
      'Property or method "' +
        key +
        '" is not defined on the instance but ' +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }
  let hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy)
  if (hasProxy) {
    let isBuiltInModifier = makeMap(
      'stop,prevent,self,ctrl,shift,alt,meta,exact'
    )
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(
            'Avoid overwriting built-in modifier in config.keyCodes: .' + key
          )
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }
  let hasHandler = {
    has: function has(target, key) {
      var has = key in target
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_'
      if (!has && !isAllowed) warnNonPresent(target, key)
      return has || !isAllowed
    }
  }
  let getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target))
        warnNonPresent(target, key)
      return target[key]
    }
  }
  initProxy = function initProxy(vm) {
    if (hasProxy) {
      let options = vm.$options
      let handlers =
        options.render && options.render._withStripped ? getHandler : hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } else vm._renderProxy = vm
  }
  let seenObjects = new _Set()
  function traverse(val) {
    _traverse(val, seenObjects)
    seenObjects.clear()
  }
  function _traverse(val, seen) {
    let i, keys
    let isA = Array.isArray(val)
    if (
      (!isA && !isObject(val)) ||
      Object.isFrozen(val) ||
      val instanceof VNode
    )
      return
    if (val.__ob__) {
      let depId = val.__ob__.dep.id
      if (seen.has(depId)) return
      seen.add(depId)
    }
    if (isA) {
      i = val.length
      while (i--) _traverse(val[i], seen)
    } else {
      keys = Object.keys(val)
      i = keys.length
      while (i--) _traverse(val[keys[i]], seen)
    }
  }
  let normalizeEvent = cached(function (name) {
    let passive = name.charAt(0) === '\x26'
    name = passive ? name.slice(1) : name
    let once$$1 = name.charAt(0) === '~'
    name = once$$1 ? name.slice(1) : name
    let capture = name.charAt(0) === '!'
    name = capture ? name.slice(1) : name
    return { name: name, once: once$$1, capture: capture, passive: passive }
  })
  function createFnInvoker(fns) {
    function invoker() {
      let arguments$1 = arguments
      let fns = invoker.fns
      if (Array.isArray(fns)) {
        let cloned = fns.slice()
        for (let i = 0; i < cloned.length; i++)
          cloned[i].apply(null, arguments$1)
      } else return fns.apply(null, arguments)
    }
    invoker.fns = fns
    return invoker
  }
  function updateListeners(on, oldOn, add, remove$$1, vm) {
    let name, def, cur, old, event
    for (name in on) {
      def = cur = on[name]
      old = oldOn[name]
      event = normalizeEvent(name)
      if (isUndef(cur))
        'development' !== 'production' &&
          warn(
            'Invalid handler for event "' +
              event.name +
              '": got ' +
              String(cur),
            vm
          )
      else if (isUndef(old)) {
        if (isUndef(cur.fns)) cur = on[name] = createFnInvoker(cur)
        add(
          event.name,
          cur,
          event.once,
          event.capture,
          event.passive,
          event.params
        )
      } else if (cur !== old) {
        old.fns = cur
        on[name] = old
      }
    }
    for (name in oldOn)
      if (isUndef(on[name])) {
        event = normalizeEvent(name)
        remove$$1(event.name, oldOn[name], event.capture)
      }
  }
  function mergeVNodeHook(def, hookKey, hook) {
    if (def instanceof VNode) def = def.data.hook || (def.data.hook = {})
    let invoker
    let oldHook = def[hookKey]
    function wrappedHook() {
      hook.apply(this, arguments)
      remove(invoker.fns, wrappedHook)
    }
    if (isUndef(oldHook)) invoker = createFnInvoker([wrappedHook])
    else if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      invoker = oldHook
      invoker.fns.push(wrappedHook)
    } else invoker = createFnInvoker([oldHook, wrappedHook])
    invoker.merged = true
    def[hookKey] = invoker
  }
  function extractPropsFromVNodeData(data, Ctor, tag) {
    let propOptions = Ctor.options.props
    if (isUndef(propOptions)) return
    let res = {}
    let attrs = data.attrs
    let props = data.props
    if (isDef(attrs) || isDef(props))
      for (var key in propOptions) {
        var altKey = hyphenate(key)
        var keyInLowerCase = key.toLowerCase()
        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase))
          tip(
            'Prop "' +
              keyInLowerCase +
              '" is passed to component ' +
              formatComponentName(tag || Ctor) +
              ', but the declared prop name is' +
              ' "' +
              key +
              '". ' +
              'Note that HTML attributes are case-insensitive and camelCased ' +
              'props need to use their kebab-case equivalents when using in-DOM ' +
              'templates. You should probably use "' +
              altKey +
              '" instead of "' +
              key +
              '".'
          )
        checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false)
      }
    return res
  }
  function checkProp(res, hash, key, altKey, preserve) {
    if (isDef(hash))
      if (hasOwn(hash, key)) {
        res[key] = hash[key]
        if (!preserve) delete hash[key]
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey]
        if (!preserve) delete hash[altKey]
        return true
      }
    return false
  }
  function simpleNormalizeChildren(children) {
    for (let i = 0; i < children.length; i++)
      if (Array.isArray(children[i]))
        return Array.prototype.concat.apply([], children)
    return children
  }
  function normalizeChildren(children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
  }
  function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }
  function normalizeArrayChildren(children, nestedIndex) {
    let res = []
    let i, c, lastIndex, last
    for (i = 0; i < children.length; i++) {
      c = children[i]
      if (isUndef(c) || typeof c === 'boolean') continue
      lastIndex = res.length - 1
      last = res[lastIndex]
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, (nestedIndex || '') + '_' + i)
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + c[0].text)
            c.shift()
          }
          res.push.apply(res, c)
        }
      } else if (isPrimitive(c))
        if (isTextNode(last)) res[lastIndex] = createTextVNode(last.text + c)
        else {
          if (c !== '') res.push(createTextVNode(c))
        }
      else if (isTextNode(c) && isTextNode(last))
        res[lastIndex] = createTextVNode(last.text + c.text)
      else {
        if (
          isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)
        )
          c.key = '__vlist' + nestedIndex + '_' + i + '__'
        res.push(c)
      }
    }
    return res
  }
  function ensureCtor(comp, base) {
    if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module'))
      comp = comp.default
    return isObject(comp) ? base.extend(comp) : comp
  }
  function createAsyncPlaceholder(factory, data, context, children, tag) {
    let node = createEmptyVNode()
    node.asyncFactory = factory
    node.asyncMeta = {
      data: data,
      context: context,
      children: children,
      tag: tag
    }
    return node
  }
  function resolveAsyncComponent(factory, baseCtor, context) {
    if (isTrue(factory.error) && isDef(factory.errorComp))
      return factory.errorComp
    if (isDef(factory.resolved)) return factory.resolved
    if (isTrue(factory.loading) && isDef(factory.loadingComp))
      return factory.loadingComp
    if (isDef(factory.contexts)) factory.contexts.push(context)
    else {
      let contexts = (factory.contexts = [context])
      let sync = true
      let forceRender = function () {
        for (let i = 0, l = contexts.length; i < l; i++)
          contexts[i].$forceUpdate()
      }
      let resolve = once(function (res) {
        factory.resolved = ensureCtor(res, baseCtor)
        if (!sync) forceRender()
      })
      let reject = once(function (reason) {
        'development' !== 'production' &&
          warn(
            'Failed to resolve async component: ' +
              String(factory) +
              (reason ? '\nReason: ' + reason : '')
          )
        if (isDef(factory.errorComp)) {
          factory.error = true
          forceRender()
        }
      })
      let res = factory(resolve, reject)
      if (isObject(res))
        if (typeof res.then === 'function') {
          if (isUndef(factory.resolved)) res.then(resolve, reject)
        } else if (
          isDef(res.component) &&
          typeof res.component.then === 'function'
        ) {
          res.component.then(resolve, reject)
          if (isDef(res.error))
            factory.errorComp = ensureCtor(res.error, baseCtor)
          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor)
            if (res.delay === 0) factory.loading = true
            else
              setTimeout(function () {
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true
                  forceRender()
                }
              }, res.delay || 200)
          }
          if (isDef(res.timeout))
            setTimeout(function () {
              if (isUndef(factory.resolved))
                reject('timeout (' + res.timeout + 'ms)')
            }, res.timeout)
        }
      sync = false
      return factory.loading ? factory.loadingComp : factory.resolved
    }
  }
  function isAsyncPlaceholder(node) {
    return node.isComment && node.asyncFactory
  }
  function getFirstComponentChild(children) {
    if (Array.isArray(children))
      for (var i = 0; i < children.length; i++) {
        var c = children[i]
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c)))
          return c
      }
  }
  function initEvents(vm) {
    vm._events = Object.create(null)
    vm._hasHookEvent = false
    let listeners = vm.$options._parentListeners
    if (listeners) updateComponentListeners(vm, listeners)
  }
  let target
  function add(event, fn, once) {
    if (once) target.$once(event, fn)
    else target.$on(event, fn)
  }
  function remove$1(event, fn) {
    target.$off(event, fn)
  }
  function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm
    updateListeners(listeners, oldListeners || {}, add, remove$1, vm)
    target = undefined
  }
  function eventsMixin(Vue) {
    let hookRE = /^hook:/
    Vue.prototype.$on = function (event, fn) {
      let this$1 = this
      let vm = this
      if (Array.isArray(event))
        for (var i = 0, l = event.length; i < l; i++) this$1.$on(event[i], fn)
      else {
        ;(vm._events[event] || (vm._events[event] = [])).push(fn)
        if (hookRE.test(event)) vm._hasHookEvent = true
      }
      return vm
    }
    Vue.prototype.$once = function (event, fn) {
      let vm = this
      function on() {
        vm.$off(event, on)
        fn.apply(vm, arguments)
      }
      on.fn = fn
      vm.$on(event, on)
      return vm
    }
    Vue.prototype.$off = function (event, fn) {
      let this$1 = this
      let vm = this
      if (!arguments.length) {
        vm._events = Object.create(null)
        return vm
      }
      if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) this$1.$off(event[i], fn)
        return vm
      }
      let cbs = vm._events[event]
      if (!cbs) return vm
      if (!fn) {
        vm._events[event] = null
        return vm
      }
      if (fn) {
        let cb
        let i$1 = cbs.length
        while (i$1--) {
          cb = cbs[i$1]
          if (cb === fn || cb.fn === fn) {
            cbs.splice(i$1, 1)
            break
          }
        }
      }
      return vm
    }
    Vue.prototype.$emit = function (event) {
      let vm = this
      let lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent])
        tip(
          'Event "' +
            lowerCaseEvent +
            '" is emitted in component ' +
            formatComponentName(vm) +
            ' but the handler is registered for "' +
            event +
            '". ' +
            'Note that HTML attributes are case-insensitive and you cannot use ' +
            'v-on to listen to camelCase events when using in-DOM templates. ' +
            'You should probably use "' +
            hyphenate(event) +
            '" instead of "' +
            event +
            '".'
        )
      let cbs = vm._events[event]
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs
        let args = toArray(arguments, 1)
        for (let i = 0, l = cbs.length; i < l; i++)
          try {
            cbs[i].apply(vm, args)
          } catch (e) {
            handleError(e, vm, 'event handler for "' + event + '"')
          }
      }
      return vm
    }
  }
  function resolveSlots(children, context) {
    let slots = {}
    if (!children) return slots
    for (let i = 0, l = children.length; i < l; i++) {
      let child = children[i]
      let data = child.data
      if (data && data.attrs && data.attrs.slot) delete data.attrs.slot
      if (
        (child.context === context || child.fnContext === context) &&
        data &&
        data.slot != null
      ) {
        let name = data.slot
        let slot = slots[name] || (slots[name] = [])
        if (child.tag === 'template')
          slot.push.apply(slot, child.children || [])
        else slot.push(child)
      } else (slots.default || (slots.default = [])).push(child)
    }
    for (let name$1 in slots)
      if (slots[name$1].every(isWhitespace)) delete slots[name$1]
    return slots
  }
  function isWhitespace(node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }
  function resolveScopedSlots(fns, res) {
    res = res || {}
    for (let i = 0; i < fns.length; i++)
      if (Array.isArray(fns[i])) resolveScopedSlots(fns[i], res)
      else res[fns[i].key] = fns[i].fn
    return res
  }
  let activeInstance = null
  let isUpdatingChildComponent = false
  function initLifecycle(vm) {
    let options = vm.$options
    let parent = options.parent
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) parent = parent.$parent
      parent.$children.push(vm)
    }
    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm
    vm.$children = []
    vm.$refs = {}
    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      let vm = this
      if (vm._isMounted) callHook(vm, 'beforeUpdate')
      let prevEl = vm.$el
      let prevVnode = vm._vnode
      let prevActiveInstance = activeInstance
      activeInstance = vm
      vm._vnode = vnode
      if (!prevVnode) {
        vm.$el = vm.__patch__(
          vm.$el,
          vnode,
          hydrating,
          false,
          vm.$options._parentElm,
          vm.$options._refElm
        )
        vm.$options._parentElm = vm.$options._refElm = null
      } else vm.$el = vm.__patch__(prevVnode, vnode)
      activeInstance = prevActiveInstance
      if (prevEl) prevEl.__vue__ = null
      if (vm.$el) vm.$el.__vue__ = vm
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode)
        vm.$parent.$el = vm.$el
    }
    Vue.prototype.$forceUpdate = function () {
      let vm = this
      if (vm._watcher) vm._watcher.update()
    }
    Vue.prototype.$destroy = function () {
      let vm = this
      if (vm._isBeingDestroyed) return
      callHook(vm, 'beforeDestroy')
      vm._isBeingDestroyed = true
      let parent = vm.$parent
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract)
        remove(parent.$children, vm)
      if (vm._watcher) vm._watcher.teardown()
      let i = vm._watchers.length
      while (i--) vm._watchers[i].teardown()
      if (vm._data.__ob__) vm._data.__ob__.vmCount--
      vm._isDestroyed = true
      vm.__patch__(vm._vnode, null)
      callHook(vm, 'destroyed')
      vm.$off()
      if (vm.$el) vm.$el.__vue__ = null
      if (vm.$vnode) vm.$vnode.parent = null
    }
  }
  function mountComponent(vm, el, hydrating) {
    vm.$el = el
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el ||
        el
      )
        warn(
          'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
          vm
        )
      else
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
    }
    callHook(vm, 'beforeMount')
    let updateComponent
    if ('development' !== 'production' && config.performance && mark)
      updateComponent = function () {
        var name = vm._name
        var id = vm._uid
        var startTag = 'vue-perf-start:' + id
        var endTag = 'vue-perf-end:' + id
        mark(startTag)
        var vnode = vm._render()
        mark(endTag)
        measure('vue ' + name + ' render', startTag, endTag)
        mark(startTag)
        vm._update(vnode, hydrating)
        mark(endTag)
        measure('vue ' + name + ' patch', startTag, endTag)
      }
    else
      updateComponent = function () {
        vm._update(vm._render(), hydrating)
      }
    new Watcher(vm, updateComponent, noop, null, true)
    hydrating = false
    if (vm.$vnode == null) {
      vm._isMounted = true
      callHook(vm, 'mounted')
    }
    return vm
  }
  function updateChildComponent(
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    isUpdatingChildComponent = true
    let hasChildren = !!(
      renderChildren ||
      vm.$options._renderChildren ||
      parentVnode.data.scopedSlots ||
      vm.$scopedSlots !== emptyObject
    )
    vm.$options._parentVnode = parentVnode
    vm.$vnode = parentVnode
    if (vm._vnode) vm._vnode.parent = parentVnode
    vm.$options._renderChildren = renderChildren
    vm.$attrs = parentVnode.data.attrs || emptyObject
    vm.$listeners = listeners || emptyObject
    if (propsData && vm.$options.props) {
      toggleObserving(false)
      let props = vm._props
      let propKeys = vm.$options._propKeys || []
      for (let i = 0; i < propKeys.length; i++) {
        let key = propKeys[i]
        let propOptions = vm.$options.props
        props[key] = validateProp(key, propOptions, propsData, vm)
      }
      toggleObserving(true)
      vm.$options.propsData = propsData
    }
    listeners = listeners || emptyObject
    let oldListeners = vm.$options._parentListeners
    vm.$options._parentListeners = listeners
    updateComponentListeners(vm, listeners, oldListeners)
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context)
      vm.$forceUpdate()
    }
    isUpdatingChildComponent = false
  }
  function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) if (vm._inactive) return true
    return false
  }
  function activateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = false
      if (isInInactiveTree(vm)) return
    } else if (vm._directInactive) return
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false
      for (let i = 0; i < vm.$children.length; i++)
        activateChildComponent(vm.$children[i])
      callHook(vm, 'activated')
    }
  }
  function deactivateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = true
      if (isInInactiveTree(vm)) return
    }
    if (!vm._inactive) {
      vm._inactive = true
      for (let i = 0; i < vm.$children.length; i++)
        deactivateChildComponent(vm.$children[i])
      callHook(vm, 'deactivated')
    }
  }
  function callHook(vm, hook) {
    pushTarget()
    let handlers = vm.$options[hook]
    if (handlers)
      for (var i = 0, j = handlers.length; i < j; i++)
        try {
          handlers[i].call(vm)
        } catch (e) {
          handleError(e, vm, hook + ' hook')
        }
    if (vm._hasHookEvent) vm.$emit('hook:' + hook)
    popTarget()
  }
  let MAX_UPDATE_COUNT = 100
  let queue = []
  let activatedChildren = []
  let has = {}
  let circular = {}
  let waiting = false
  let flushing = false
  let index = 0
  function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0
    has = {}
    circular = {}
    waiting = flushing = false
  }
  function flushSchedulerQueue() {
    flushing = true
    let watcher, id
    queue.sort(function (a, b) {
      return a.id - b.id
    })
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index]
      id = watcher.id
      has[id] = null
      watcher.run()
      if ('development' !== 'production' && has[id] != null) {
        circular[id] = (circular[id] || 0) + 1
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' +
              (watcher.user
                ? 'in watcher with expression "' + watcher.expression + '"'
                : 'in a component render function.'),
            watcher.vm
          )
          break
        }
      }
    }
    let activatedQueue = activatedChildren.slice()
    let updatedQueue = queue.slice()
    resetSchedulerState()
    callActivatedHooks(activatedQueue)
    callUpdatedHooks(updatedQueue)
    if (devtools && config.devtools) devtools.emit('flush')
  }
  function callUpdatedHooks(queue) {
    let i = queue.length
    while (i--) {
      let watcher = queue[i]
      let vm = watcher.vm
      if (vm._watcher === watcher && vm._isMounted) callHook(vm, 'updated')
    }
  }
  function queueActivatedComponent(vm) {
    vm._inactive = false
    activatedChildren.push(vm)
  }
  function callActivatedHooks(queue) {
    for (let i = 0; i < queue.length; i++) {
      queue[i]._inactive = true
      activateChildComponent(queue[i], true)
    }
  }
  function queueWatcher(watcher) {
    let id = watcher.id
    if (has[id] == null) {
      has[id] = true
      if (!flushing) queue.push(watcher)
      else {
        let i = queue.length - 1
        while (i > index && queue[i].id > watcher.id) i--
        queue.splice(i + 1, 0, watcher)
      }
      if (!waiting) {
        waiting = true
        nextTick(flushSchedulerQueue)
      }
    }
  }
  let uid$1 = 0
  let Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    if (isRenderWatcher) vm._watcher = this
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else this.deep = this.user = this.lazy = this.sync = false
    this.cb = cb
    this.id = ++uid$1
    this.active = true
    this.dirty = this.lazy
    this.deps = []
    this.newDeps = []
    this.depIds = new _Set()
    this.newDepIds = new _Set()
    this.expression = expOrFn.toString()
    if (typeof expOrFn === 'function') this.getter = expOrFn
    else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        'development' !== 'production' &&
          warn(
            'Failed watching path: "' +
              expOrFn +
              '" ' +
              'Watcher only accepts simple dot-delimited paths. ' +
              'For full control, use a function instead.',
            vm
          )
      }
    }
    this.value = this.lazy ? undefined : this.get()
  }
  Watcher.prototype.get = function get() {
    pushTarget(this)
    let value
    let vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user)
        handleError(e, vm, 'getter for watcher "' + this.expression + '"')
      else throw e
    } finally {
      if (this.deep) traverse(value)
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
  Watcher.prototype.addDep = function addDep(dep) {
    let id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) dep.addSub(this)
    }
  }
  Watcher.prototype.cleanupDeps = function cleanupDeps() {
    let this$1 = this
    let i = this.deps.length
    while (i--) {
      let dep = this$1.deps[i]
      if (!this$1.newDepIds.has(dep.id)) dep.removeSub(this$1)
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  Watcher.prototype.update = function update() {
    if (this.lazy) this.dirty = true
    else if (this.sync) this.run()
    else queueWatcher(this)
  }
  Watcher.prototype.run = function run() {
    if (this.active) {
      let value = this.get()
      if (value !== this.value || isObject(value) || this.deep) {
        let oldValue = this.value
        this.value = value
        if (this.user)
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(
              e,
              this.vm,
              'callback for watcher "' + this.expression + '"'
            )
          }
        else this.cb.call(this.vm, value, oldValue)
      }
    }
  }
  Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  Watcher.prototype.depend = function depend() {
    let this$1 = this
    let i = this.deps.length
    while (i--) this$1.deps[i].depend()
  }
  Watcher.prototype.teardown = function teardown() {
    let this$1 = this
    if (this.active) {
      if (!this.vm._isBeingDestroyed) remove(this.vm._watchers, this)
      let i = this.deps.length
      while (i--) this$1.deps[i].removeSub(this$1)
      this.active = false
    }
  }
  let sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  }
  function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
  }
  function initState(vm) {
    vm._watchers = []
    let opts = vm.$options
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) initData(vm)
    else observe((vm._data = {}), true)
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) initWatch(vm, opts.watch)
  }
  function initProps(vm, propsOptions) {
    let propsData = vm.$options.propsData || {}
    let props = (vm._props = {})
    let keys = (vm.$options._propKeys = [])
    let isRoot = !vm.$parent
    if (!isRoot) toggleObserving(false)
    let loop = function (key) {
      keys.push(key)
      let value = validateProp(key, propsOptions, propsData, vm)
      let hyphenatedKey = hyphenate(key)
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      )
        warn(
          '"' +
            hyphenatedKey +
            '" is a reserved attribute and cannot be used as component prop.',
          vm
        )
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent)
          warn(
            'Avoid mutating a prop directly since the value will be ' +
              'overwritten whenever the parent component re-renders. ' +
              "Instead, use a data or computed property based on the prop's " +
              'value. Prop being mutated: "' +
              key +
              '"',
            vm
          )
      })
      if (!(key in vm)) proxy(vm, '_props', key)
    }
    for (let key in propsOptions) loop(key)
    toggleObserving(true)
  }
  function initData(vm) {
    let data = vm.$options.data
    data = vm._data =
      typeof data === 'function' ? getData(data, vm) : data || {}
    if (!isPlainObject(data)) {
      data = {}
      'development' !== 'production' &&
        warn(
          'data functions should return an object:\n' +
            'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
          vm
        )
    }
    let keys = Object.keys(data)
    let props = vm.$options.props
    let methods = vm.$options.methods
    let i = keys.length
    while (i--) {
      let key = keys[i]
      if (methods && hasOwn(methods, key))
        warn(
          'Method "' + key + '" has already been defined as a data property.',
          vm
        )
      if (props && hasOwn(props, key))
        'development' !== 'production' &&
          warn(
            'The data property "' +
              key +
              '" is already declared as a prop. ' +
              'Use prop default value instead.',
            vm
          )
      else if (!isReserved(key)) proxy(vm, '_data', key)
    }
    observe(data, true)
  }
  function getData(data, vm) {
    pushTarget()
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, 'data()')
      return {}
    } finally {
      popTarget()
    }
  }
  let computedWatcherOptions = { lazy: true }
  function initComputed(vm, computed) {
    let watchers = (vm._computedWatchers = Object.create(null))
    let isSSR = isServerRendering()
    for (let key in computed) {
      let userDef = computed[key]
      let getter = typeof userDef === 'function' ? userDef : userDef.get
      if ('development' !== 'production' && getter == null)
        warn('Getter is missing for computed property "' + key + '".', vm)
      if (!isSSR)
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        )
      if (!(key in vm)) defineComputed(vm, key, userDef)
      else if (key in vm.$data)
        warn(
          'The computed property "' + key + '" is already defined in data.',
          vm
        )
      else if (vm.$options.props && key in vm.$options.props)
        warn(
          'The computed property "' + key + '" is already defined as a prop.',
          vm
        )
    }
  }
  function defineComputed(target, key, userDef) {
    let shouldCache = !isServerRendering()
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : userDef
      sharedPropertyDefinition.set = noop
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : userDef.get
        : noop
      sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
    }
    if ('development' !== 'production' && sharedPropertyDefinition.set === noop)
      sharedPropertyDefinition.set = function () {
        warn(
          'Computed property "' +
            key +
            '" was assigned to but it has no setter.',
          this
        )
      }
    Object.defineProperty(target, key, sharedPropertyDefinition)
  }
  function createComputedGetter(key) {
    return function computedGetter() {
      let watcher = this._computedWatchers && this._computedWatchers[key]
      if (watcher) {
        if (watcher.dirty) watcher.evaluate()
        if (Dep.target) watcher.depend()
        return watcher.value
      }
    }
  }
  function initMethods(vm, methods) {
    let props = vm.$options.props
    for (let key in methods) {
      if (methods[key] == null)
        warn(
          'Method "' +
            key +
            '" has an undefined value in the component definition. ' +
            'Did you reference the function correctly?',
          vm
        )
      if (props && hasOwn(props, key))
        warn('Method "' + key + '" has already been defined as a prop.', vm)
      if (key in vm && isReserved(key))
        warn(
          'Method "' +
            key +
            '" conflicts with an existing Vue instance method. ' +
            'Avoid defining component methods that start with _ or $.'
        )
      vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
    }
  }
  function initWatch(vm, watch) {
    for (let key in watch) {
      let handler = watch[key]
      if (Array.isArray(handler))
        for (var i = 0; i < handler.length; i++)
          createWatcher(vm, key, handler[i])
      else createWatcher(vm, key, handler)
    }
  }
  function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
      options = handler
      handler = handler.handler
    }
    if (typeof handler === 'string') handler = vm[handler]
    return vm.$watch(expOrFn, handler, options)
  }
  function stateMixin(Vue) {
    let dataDef = {}
    dataDef.get = function () {
      return this._data
    }
    let propsDef = {}
    propsDef.get = function () {
      return this._props
    }
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn('$props is readonly.', this)
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)
    Vue.prototype.$set = set
    Vue.prototype.$delete = del
    Vue.prototype.$watch = function (expOrFn, cb, options) {
      let vm = this
      if (isPlainObject(cb)) return createWatcher(vm, expOrFn, cb, options)
      options = options || {}
      options.user = true
      let watcher = new Watcher(vm, expOrFn, cb, options)
      if (options.immediate) cb.call(vm, watcher.value)
      return function unwatchFn() {
        watcher.teardown()
      }
    }
  }
  function initProvide(vm) {
    let provide = vm.$options.provide
    if (provide)
      vm._provided = typeof provide === 'function' ? provide.call(vm) : provide
  }
  function initInjections(vm) {
    let result = resolveInject(vm.$options.inject, vm)
    if (result) {
      toggleObserving(false)
      Object.keys(result).forEach(function (key) {
        defineReactive(vm, key, result[key], function () {
          warn(
            'Avoid mutating an injected value directly since the changes will be ' +
              'overwritten whenever the provided component re-renders. ' +
              'injection being mutated: "' +
              key +
              '"',
            vm
          )
        })
      })
      toggleObserving(true)
    }
  }
  function resolveInject(inject, vm) {
    if (inject) {
      let result = Object.create(null)
      let keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
            return Object.getOwnPropertyDescriptor(inject, key).enumerable
          })
        : Object.keys(inject)
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let provideKey = inject[key].from
        let source = vm
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey]
            break
          }
          source = source.$parent
        }
        if (!source)
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default
            result[key] =
              typeof provideDefault === 'function'
                ? provideDefault.call(vm)
                : provideDefault
          } else warn('Injection "' + key + '" not found', vm)
      }
      return result
    }
  }
  function renderList(val, render) {
    let ret, i, l, keys, key
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length)
      for (i = 0, l = val.length; i < l; i++) ret[i] = render(val[i], i)
    } else if (typeof val === 'number') {
      ret = new Array(val)
      for (i = 0; i < val; i++) ret[i] = render(i + 1, i)
    } else if (isObject(val)) {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
    }
    if (isDef(ret)) ret._isVList = true
    return ret
  }
  function renderSlot(name, fallback, props, bindObject) {
    let scopedSlotFn = this.$scopedSlots[name]
    let nodes
    if (scopedSlotFn) {
      props = props || {}
      if (bindObject) {
        if ('development' !== 'production' && !isObject(bindObject))
          warn('slot v-bind without argument expects an Object', this)
        props = extend(extend({}, bindObject), props)
      }
      nodes = scopedSlotFn(props) || fallback
    } else {
      let slotNodes = this.$slots[name]
      if (slotNodes) {
        if ('development' !== 'production' && slotNodes._rendered)
          warn(
            'Duplicate presence of slot "' +
              name +
              '" found in the same render tree ' +
              '- this will likely cause render errors.',
            this
          )
        slotNodes._rendered = true
      }
      nodes = slotNodes || fallback
    }
    let target = props && props.slot
    if (target) return this.$createElement('template', { slot: target }, nodes)
    else return nodes
  }
  function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }
  function isKeyNotMatch(expect, actual) {
    if (Array.isArray(expect)) return expect.indexOf(actual) === -1
    else return expect !== actual
  }
  function checkKeyCodes(
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    let mappedKeyCode = config.keyCodes[key] || builtInKeyCode
    if (builtInKeyName && eventKeyName && !config.keyCodes[key])
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    else if (mappedKeyCode) return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    else if (eventKeyName) return hyphenate(eventKeyName) !== key
  }
  function bindObjectProps(data, tag, value, asProp, isSync) {
    if (value)
      if (!isObject(value))
        'development' !== 'production' &&
          warn('v-bind without argument expects an Object or Array value', this)
      else {
        if (Array.isArray(value)) value = toObject(value)
        var hash
        var loop = function (key) {
          if (key === 'class' || key === 'style' || isReservedAttribute(key))
            hash = data
          else {
            var type = data.attrs && data.attrs.type
            hash =
              asProp || config.mustUseProp(tag, type, key)
                ? data.domProps || (data.domProps = {})
                : data.attrs || (data.attrs = {})
          }
          if (!(key in hash)) {
            hash[key] = value[key]
            if (isSync) {
              var on = data.on || (data.on = {})
              on['update:' + key] = function ($event) {
                value[key] = $event
              }
            }
          }
        }
        for (var key in value) loop(key)
      }
    return data
  }
  function renderStatic(index, isInFor) {
    let cached = this._staticTrees || (this._staticTrees = [])
    let tree = cached[index]
    if (tree && !isInFor) return tree
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this
    )
    markStatic(tree, '__static__' + index, false)
    return tree
  }
  function markOnce(tree, index, key) {
    markStatic(tree, '__once__' + index + (key ? '_' + key : ''), true)
    return tree
  }
  function markStatic(tree, key, isOnce) {
    if (Array.isArray(tree))
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string')
          markStaticNode(tree[i], key + '_' + i, isOnce)
      }
    else markStaticNode(tree, key, isOnce)
  }
  function markStaticNode(node, key, isOnce) {
    node.isStatic = true
    node.key = key
    node.isOnce = isOnce
  }
  function bindObjectListeners(data, value) {
    if (value)
      if (!isPlainObject(value))
        'development' !== 'production' &&
          warn('v-on without argument expects an Object value', this)
      else {
        var on = (data.on = data.on ? extend({}, data.on) : {})
        for (var key in value) {
          var existing = on[key]
          var ours = value[key]
          on[key] = existing ? [].concat(existing, ours) : ours
        }
      }
    return data
  }
  function installRenderHelpers(target) {
    target._o = markOnce
    target._n = toNumber
    target._s = toString
    target._l = renderList
    target._t = renderSlot
    target._q = looseEqual
    target._i = looseIndexOf
    target._m = renderStatic
    target._f = resolveFilter
    target._k = checkKeyCodes
    target._b = bindObjectProps
    target._v = createTextVNode
    target._e = createEmptyVNode
    target._u = resolveScopedSlots
    target._g = bindObjectListeners
  }
  function FunctionalRenderContext(data, props, children, parent, Ctor) {
    let options = Ctor.options
    this.data = data
    this.props = props
    this.children = children
    this.parent = parent
    this.listeners = data.on || emptyObject
    this.injections = resolveInject(options.inject, parent)
    this.slots = function () {
      return resolveSlots(children, parent)
    }
    let contextVm = Object.create(parent)
    let isCompiled = isTrue(options._compiled)
    let needNormalization = !isCompiled
    if (isCompiled) {
      this.$options = options
      this.$slots = this.slots()
      this.$scopedSlots = data.scopedSlots || emptyObject
    }
    if (options._scopeId)
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization)
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId
          vnode.fnContext = parent
        }
        return vnode
      }
    else
      this._c = function (a, b, c, d) {
        return createElement(contextVm, a, b, c, d, needNormalization)
      }
  }
  installRenderHelpers(FunctionalRenderContext.prototype)
  function createFunctionalComponent(
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    let options = Ctor.options
    let props = {}
    let propOptions = options.props
    if (isDef(propOptions))
      for (var key in propOptions)
        props[key] = validateProp(key, propOptions, propsData || emptyObject)
    else {
      if (isDef(data.attrs)) mergeProps(props, data.attrs)
      if (isDef(data.props)) mergeProps(props, data.props)
    }
    let renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    )
    let vnode = options.render.call(null, renderContext._c, renderContext)
    if (vnode instanceof VNode) {
      setFunctionalContextForVNode(vnode, data, contextVm, options)
      return vnode
    } else if (Array.isArray(vnode)) {
      let vnodes = normalizeChildren(vnode) || []
      for (let i = 0; i < vnodes.length; i++)
        setFunctionalContextForVNode(vnodes[i], data, contextVm, options)
      return vnodes
    }
  }
  function setFunctionalContextForVNode(vnode, data, vm, options) {
    vnode.fnContext = vm
    vnode.fnOptions = options
    if (data.slot) (vnode.data || (vnode.data = {})).slot = data.slot
  }
  function mergeProps(to, from) {
    for (let key in from) to[camelize(key)] = from[key]
  }
  let componentVNodeHooks = {
    init: function init(vnode, hydrating, parentElm, refElm) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        var mountedNode = vnode
        componentVNodeHooks.prepatch(mountedNode, mountedNode)
      } else {
        var child = (vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance,
          parentElm,
          refElm
        ))
        child.$mount(hydrating ? vnode.elm : undefined, hydrating)
      }
    },
    prepatch: function prepatch(oldVnode, vnode) {
      var options = vnode.componentOptions
      var child = (vnode.componentInstance = oldVnode.componentInstance)
      updateChildComponent(
        child,
        options.propsData,
        options.listeners,
        vnode,
        options.children
      )
    },
    insert: function insert(vnode) {
      var context = vnode.context
      var componentInstance = vnode.componentInstance
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true
        callHook(componentInstance, 'mounted')
      }
      if (vnode.data.keepAlive)
        if (context._isMounted) queueActivatedComponent(componentInstance)
        else activateChildComponent(componentInstance, true)
    },
    destroy: function destroy(vnode) {
      var componentInstance = vnode.componentInstance
      if (!componentInstance._isDestroyed)
        if (!vnode.data.keepAlive) componentInstance.$destroy()
        else deactivateChildComponent(componentInstance, true)
    }
  }
  let hooksToMerge = Object.keys(componentVNodeHooks)
  function createComponent(Ctor, data, context, children, tag) {
    if (isUndef(Ctor)) return
    let baseCtor = context.$options._base
    if (isObject(Ctor)) Ctor = baseCtor.extend(Ctor)
    if (typeof Ctor !== 'function') {
      warn('Invalid Component definition: ' + String(Ctor), context)
      return
    }
    let asyncFactory
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
      if (Ctor === undefined)
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
    }
    data = data || {}
    resolveConstructorOptions(Ctor)
    if (isDef(data.model)) transformModel(Ctor.options, data)
    let propsData = extractPropsFromVNodeData(data, Ctor, tag)
    if (isTrue(Ctor.options.functional))
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    let listeners = data.on
    data.on = data.nativeOn
    if (isTrue(Ctor.options.abstract)) {
      let slot = data.slot
      data = {}
      if (slot) data.slot = slot
    }
    mergeHooks(data)
    let name = Ctor.options.name || tag
    let vnode = new VNode(
      'vue-component-' + Ctor.cid + (name ? '-' + name : ''),
      data,
      undefined,
      undefined,
      undefined,
      context,
      {
        Ctor: Ctor,
        propsData: propsData,
        listeners: listeners,
        tag: tag,
        children: children
      },
      asyncFactory
    )
    return vnode
  }
  function createComponentInstanceForVnode(vnode, parent, parentElm, refElm) {
    let options = {
      _isComponent: true,
      parent: parent,
      _parentVnode: vnode,
      _parentElm: parentElm || null,
      _refElm: refElm || null
    }
    let inlineTemplate = vnode.data.inlineTemplate
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render
      options.staticRenderFns = inlineTemplate.staticRenderFns
    }
    return new vnode.componentOptions.Ctor(options)
  }
  function mergeHooks(data) {
    if (!data.hook) data.hook = {}
    for (let i = 0; i < hooksToMerge.length; i++) {
      let key = hooksToMerge[i]
      let fromParent = data.hook[key]
      let ours = componentVNodeHooks[key]
      data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours
    }
  }
  function mergeHook$1(one, two) {
    return function (a, b, c, d) {
      one(a, b, c, d)
      two(a, b, c, d)
    }
  }
  function transformModel(options, data) {
    let prop = (options.model && options.model.prop) || 'value'
    let event = (options.model && options.model.event) || 'input'
    ;(data.props || (data.props = {}))[prop] = data.model.value
    let on = data.on || (data.on = {})
    if (isDef(on[event])) on[event] = [data.model.callback].concat(on[event])
    else on[event] = data.model.callback
  }
  let SIMPLE_NORMALIZE = 1
  let ALWAYS_NORMALIZE = 2
  function createElement(
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children
      children = data
      data = undefined
    }
    if (isTrue(alwaysNormalize)) normalizationType = ALWAYS_NORMALIZE
    return _createElement(context, tag, data, children, normalizationType)
  }
  function _createElement(context, tag, data, children, normalizationType) {
    if (isDef(data) && isDef(data.__ob__)) {
      'development' !== 'production' &&
        warn(
          'Avoid using observed data object as vnode data: ' +
            JSON.stringify(data) +
            '\n' +
            'Always create fresh vnode data objects in each render!',
          context
        )
      return createEmptyVNode()
    }
    if (isDef(data) && isDef(data.is)) tag = data.is
    if (!tag) return createEmptyVNode()
    if (
      'development' !== 'production' &&
      isDef(data) &&
      isDef(data.key) &&
      !isPrimitive(data.key)
    )
      warn(
        'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
        context
      )
    if (Array.isArray(children) && typeof children[0] === 'function') {
      data = data || {}
      data.scopedSlots = { default: children[0] }
      children.length = 0
    }
    if (normalizationType === ALWAYS_NORMALIZE)
      children = normalizeChildren(children)
    else if (normalizationType === SIMPLE_NORMALIZE)
      children = simpleNormalizeChildren(children)
    let vnode, ns
    if (typeof tag === 'string') {
      let Ctor
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
      if (config.isReservedTag(tag))
        vnode = new VNode(
          config.parsePlatformTagName(tag),
          data,
          children,
          undefined,
          undefined,
          context
        )
      else if (
        isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
      )
        vnode = createComponent(Ctor, data, context, children, tag)
      else vnode = new VNode(tag, data, children, undefined, undefined, context)
    } else vnode = createComponent(tag, data, context, children)
    if (Array.isArray(vnode)) return vnode
    else if (isDef(vnode)) {
      if (isDef(ns)) applyNS(vnode, ns)
      if (isDef(data)) registerDeepBindings(data)
      return vnode
    } else return createEmptyVNode()
  }
  function applyNS(vnode, ns, force) {
    vnode.ns = ns
    if (vnode.tag === 'foreignObject') {
      ns = undefined
      force = true
    }
    if (isDef(vnode.children))
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i]
        if (
          isDef(child.tag) &&
          (isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))
        )
          applyNS(child, ns, force)
      }
  }
  function registerDeepBindings(data) {
    if (isObject(data.style)) traverse(data.style)
    if (isObject(data.class)) traverse(data.class)
  }
  function initRender(vm) {
    vm._vnode = null
    vm._staticTrees = null
    let options = vm.$options
    let parentVnode = (vm.$vnode = options._parentVnode)
    let renderContext = parentVnode && parentVnode.context
    vm.$slots = resolveSlots(options._renderChildren, renderContext)
    vm.$scopedSlots = emptyObject
    vm._c = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, false)
    }
    vm.$createElement = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, true)
    }
    let parentData = parentVnode && parentVnode.data
    defineReactive(
      vm,
      '$attrs',
      (parentData && parentData.attrs) || emptyObject,
      function () {
        !isUpdatingChildComponent && warn('$attrs is readonly.', vm)
      },
      true
    )
    defineReactive(
      vm,
      '$listeners',
      options._parentListeners || emptyObject,
      function () {
        !isUpdatingChildComponent && warn('$listeners is readonly.', vm)
      },
      true
    )
  }
  function renderMixin(Vue) {
    installRenderHelpers(Vue.prototype)
    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    }
    Vue.prototype._render = function () {
      let vm = this
      let ref = vm.$options
      let render = ref.render
      let _parentVnode = ref._parentVnode
      for (let key in vm.$slots) vm.$slots[key]._rendered = false
      if (_parentVnode)
        vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
      vm.$vnode = _parentVnode
      let vnode
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement)
      } catch (e) {
        handleError(e, vm, 'render')
        if (vm.$options.renderError)
          try {
            vnode = vm.$options.renderError.call(
              vm._renderProxy,
              vm.$createElement,
              e
            )
          } catch (e) {
            handleError(e, vm, 'renderError')
            vnode = vm._vnode
          }
        else vnode = vm._vnode
      }
      if (!(vnode instanceof VNode)) {
        if ('development' !== 'production' && Array.isArray(vnode))
          warn(
            'Multiple root nodes returned from render function. Render function ' +
              'should return a single root node.',
            vm
          )
        vnode = createEmptyVNode()
      }
      vnode.parent = _parentVnode
      return vnode
    }
  }
  let uid$3 = 0
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      let vm = this
      vm._uid = uid$3++
      let startTag, endTag
      if ('development' !== 'production' && config.performance && mark) {
        startTag = 'vue-perf-start:' + vm._uid
        endTag = 'vue-perf-end:' + vm._uid
        mark(startTag)
      }
      vm._isVue = true
      if (options && options._isComponent) initInternalComponent(vm, options)
      else
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        )
      initProxy(vm)
      vm._self = vm
      initLifecycle(vm)
      initEvents(vm)
      initRender(vm)
      callHook(vm, 'beforeCreate')
      initInjections(vm)
      initState(vm)
      initProvide(vm)
      callHook(vm, 'created')
      if ('development' !== 'production' && config.performance && mark) {
        vm._name = formatComponentName(vm, false)
        mark(endTag)
        measure('vue ' + vm._name + ' init', startTag, endTag)
      }
      if (vm.$options.el) vm.$mount(vm.$options.el)
    }
  }
  function initInternalComponent(vm, options) {
    let opts = (vm.$options = Object.create(vm.constructor.options))
    let parentVnode = options._parentVnode
    opts.parent = options.parent
    opts._parentVnode = parentVnode
    opts._parentElm = options._parentElm
    opts._refElm = options._refElm
    let vnodeComponentOptions = parentVnode.componentOptions
    opts.propsData = vnodeComponentOptions.propsData
    opts._parentListeners = vnodeComponentOptions.listeners
    opts._renderChildren = vnodeComponentOptions.children
    opts._componentTag = vnodeComponentOptions.tag
    if (options.render) {
      opts.render = options.render
      opts.staticRenderFns = options.staticRenderFns
    }
  }
  function resolveConstructorOptions(Ctor) {
    let options = Ctor.options
    if (Ctor.super) {
      let superOptions = resolveConstructorOptions(Ctor.super)
      let cachedSuperOptions = Ctor.superOptions
      if (superOptions !== cachedSuperOptions) {
        Ctor.superOptions = superOptions
        let modifiedOptions = resolveModifiedOptions(Ctor)
        if (modifiedOptions) extend(Ctor.extendOptions, modifiedOptions)
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
        if (options.name) options.components[options.name] = Ctor
      }
    }
    return options
  }
  function resolveModifiedOptions(Ctor) {
    let modified
    let latest = Ctor.options
    let extended = Ctor.extendOptions
    let sealed = Ctor.sealedOptions
    for (let key in latest)
      if (latest[key] !== sealed[key]) {
        if (!modified) modified = {}
        modified[key] = dedupe(latest[key], extended[key], sealed[key])
      }
    return modified
  }
  function dedupe(latest, extended, sealed) {
    if (Array.isArray(latest)) {
      let res = []
      sealed = Array.isArray(sealed) ? sealed : [sealed]
      extended = Array.isArray(extended) ? extended : [extended]
      for (let i = 0; i < latest.length; i++)
        if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0)
          res.push(latest[i])
      return res
    } else return latest
  }
  function Vue(options) {
    if ('development' !== 'production' && !(this instanceof Vue))
      warn('Vue is a constructor and should be called with the `new` keyword')
    this._init(options)
  }
  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue)
  lifecycleMixin(Vue)
  renderMixin(Vue)
  function initUse(Vue) {
    Vue.use = function (plugin) {
      let installedPlugins =
        this._installedPlugins || (this._installedPlugins = [])
      if (installedPlugins.indexOf(plugin) > -1) return this
      let args = toArray(arguments, 1)
      args.unshift(this)
      if (typeof plugin.install === 'function')
        plugin.install.apply(plugin, args)
      else if (typeof plugin === 'function') plugin.apply(null, args)
      installedPlugins.push(plugin)
      return this
    }
  }
  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin)
      return this
    }
  }
  function initExtend(Vue) {
    Vue.cid = 0
    let cid = 1
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {}
      let Super = this
      let SuperId = Super.cid
      let cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
      if (cachedCtors[SuperId]) return cachedCtors[SuperId]
      let name = extendOptions.name || Super.options.name
      if ('development' !== 'production' && name) validateComponentName(name)
      let Sub = function VueComponent(options) {
        this._init(options)
      }
      Sub.prototype = Object.create(Super.prototype)
      Sub.prototype.constructor = Sub
      Sub.cid = cid++
      Sub.options = mergeOptions(Super.options, extendOptions)
      Sub['super'] = Super
      if (Sub.options.props) initProps$1(Sub)
      if (Sub.options.computed) initComputed$1(Sub)
      Sub.extend = Super.extend
      Sub.mixin = Super.mixin
      Sub.use = Super.use
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type]
      })
      if (name) Sub.options.components[name] = Sub
      Sub.superOptions = Super.options
      Sub.extendOptions = extendOptions
      Sub.sealedOptions = extend({}, Sub.options)
      cachedCtors[SuperId] = Sub
      return Sub
    }
  }
  function initProps$1(Comp) {
    let props = Comp.options.props
    for (let key in props) proxy(Comp.prototype, '_props', key)
  }
  function initComputed$1(Comp) {
    let computed = Comp.options.computed
    for (let key in computed) defineComputed(Comp.prototype, key, computed[key])
  }
  function initAssetRegisters(Vue) {
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (!definition) return this.options[type + 's'][id]
        else {
          if ('development' !== 'production' && type === 'component')
            validateComponentName(id)
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id
            definition = this.options._base.extend(definition)
          }
          if (type === 'directive' && typeof definition === 'function')
            definition = { bind: definition, update: definition }
          this.options[type + 's'][id] = definition
          return definition
        }
      }
    })
  }
  function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }
  function matches(pattern, name) {
    if (Array.isArray(pattern)) return pattern.indexOf(name) > -1
    else if (typeof pattern === 'string')
      return pattern.split(',').indexOf(name) > -1
    else if (isRegExp(pattern)) return pattern.test(name)
    return false
  }
  function pruneCache(keepAliveInstance, filter) {
    let cache = keepAliveInstance.cache
    let keys = keepAliveInstance.keys
    let _vnode = keepAliveInstance._vnode
    for (let key in cache) {
      let cachedNode = cache[key]
      if (cachedNode) {
        let name = getComponentName(cachedNode.componentOptions)
        if (name && !filter(name)) pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
  function pruneCacheEntry(cache, key, keys, current) {
    let cached$$1 = cache[key]
    if (cached$$1 && (!current || cached$$1.tag !== current.tag))
      cached$$1.componentInstance.$destroy()
    cache[key] = null
    remove(keys, key)
  }
  let patternTypes = [String, RegExp, Array]
  let KeepAlive = {
    name: 'keep-alive',
    abstract: true,
    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },
    created: function created() {
      this.cache = Object.create(null)
      this.keys = []
    },
    destroyed: function destroyed() {
      var this$1 = this
      for (var key in this$1.cache)
        pruneCacheEntry(this$1.cache, key, this$1.keys)
    },
    watch: {
      include: function include(val) {
        pruneCache(this, function (name) {
          return matches(val, name)
        })
      },
      exclude: function exclude(val) {
        pruneCache(this, function (name) {
          return !matches(val, name)
        })
      }
    },
    render: function render() {
      var slot = this.$slots.default
      var vnode = getFirstComponentChild(slot)
      var componentOptions = vnode && vnode.componentOptions
      if (componentOptions) {
        var name = getComponentName(componentOptions)
        var ref = this
        var include = ref.include
        var exclude = ref.exclude
        if (
          (include && (!name || !matches(include, name))) ||
          (exclude && name && matches(exclude, name))
        )
          return vnode
        var ref$1 = this
        var cache = ref$1.cache
        var keys = ref$1.keys
        var key =
          vnode.key == null
            ? componentOptions.Ctor.cid +
              (componentOptions.tag ? '::' + componentOptions.tag : '')
            : vnode.key
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance
          remove(keys, key)
          keys.push(key)
        } else {
          cache[key] = vnode
          keys.push(key)
          if (this.max && keys.length > parseInt(this.max))
            pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        vnode.data.keepAlive = true
      }
      return vnode || (slot && slot[0])
    }
  }
  let builtInComponents = { KeepAlive: KeepAlive }
  function initGlobalAPI(Vue) {
    let configDef = {}
    configDef.get = function () {
      return config
    }
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
    Object.defineProperty(Vue, 'config', configDef)
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive
    }
    Vue.set = set
    Vue.delete = del
    Vue.nextTick = nextTick
    Vue.options = Object.create(null)
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null)
    })
    Vue.options._base = Vue
    extend(Vue.options.components, builtInComponents)
    initUse(Vue)
    initMixin$1(Vue)
    initExtend(Vue)
    initAssetRegisters(Vue)
  }
  initGlobalAPI(Vue)
  Object.defineProperty(Vue.prototype, '$isServer', { get: isServerRendering })
  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get() {
      return this.$vnode && this.$vnode.ssrContext
    }
  })
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  })
  Vue.version = '2.5.15'
  let isReservedAttr = makeMap('style,class')
  let acceptValue = makeMap('input,textarea,option,select,progress')
  let mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag) && type !== 'button') ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  }
  let isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck')
  let isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
      'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
      'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
      'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
      'required,reversed,scoped,seamless,selected,sortable,translate,' +
      'truespeed,typemustmatch,visible'
  )
  let xlinkNS = 'http://www.w3.org/1999/xlink'
  let isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  }
  let getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  }
  let isFalsyAttrValue = function (val) {
    return val == null || val === false
  }
  function genClassForVnode(vnode) {
    let data = vnode.data
    let parentNode = vnode
    let childNode = vnode
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode
      if (childNode && childNode.data)
        data = mergeClassData(childNode.data, data)
    }
    while (isDef((parentNode = parentNode.parent)))
      if (parentNode && parentNode.data)
        data = mergeClassData(data, parentNode.data)
    return renderClass(data.staticClass, data.class)
  }
  function mergeClassData(child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class) ? [child.class, parent.class] : parent.class
    }
  }
  function renderClass(staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass))
      return concat(staticClass, stringifyClass(dynamicClass))
    return ''
  }
  function concat(a, b) {
    return a ? (b ? a + ' ' + b : a) : b || ''
  }
  function stringifyClass(value) {
    if (Array.isArray(value)) return stringifyArray(value)
    if (isObject(value)) return stringifyObject(value)
    if (typeof value === 'string') return value
    return ''
  }
  function stringifyArray(value) {
    let res = ''
    let stringified
    for (let i = 0, l = value.length; i < l; i++)
      if (
        isDef((stringified = stringifyClass(value[i]))) &&
        stringified !== ''
      ) {
        if (res) res += ' '
        res += stringified
      }
    return res
  }
  function stringifyObject(value) {
    let res = ''
    for (let key in value)
      if (value[key]) {
        if (res) res += ' '
        res += key
      }
    return res
  }
  let namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  }
  let isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
      'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
      'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
      'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
      's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
      'embed,object,param,source,canvas,script,noscript,del,ins,' +
      'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
      'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
      'output,progress,select,textarea,' +
      'details,dialog,menu,menuitem,summary,' +
      'content,element,shadow,template,blockquote,iframe,tfoot'
  )
  let isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
      'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
      'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  )
  let isPreTag = function (tag) {
    return tag === 'pre'
  }
  let isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  }
  function getTagNamespace(tag) {
    if (isSVG(tag)) return 'svg'
    if (tag === 'math') return 'math'
  }
  let unknownElementCache = Object.create(null)
  function isUnknownElement(tag) {
    if (!inBrowser) return true
    if (isReservedTag(tag)) return false
    tag = tag.toLowerCase()
    if (unknownElementCache[tag] != null) return unknownElementCache[tag]
    let el = document.createElement(tag)
    if (tag.indexOf('-') > -1)
      return (unknownElementCache[tag] =
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement)
    else
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(
        el.toString()
      ))
  }
  let isTextInputType = makeMap('text,number,password,search,email,tel,url')
  function query(el) {
    if (typeof el === 'string') {
      let selected = document.querySelector(el)
      if (!selected) {
        'development' !== 'production' && warn('Cannot find element: ' + el)
        return document.createElement('div')
      }
      return selected
    } else return el
  }
  function createElement$1(tagName, vnode) {
    let elm = document.createElement(tagName)
    if (tagName !== 'select') return elm
    if (
      vnode.data &&
      vnode.data.attrs &&
      vnode.data.attrs.multiple !== undefined
    )
      elm.setAttribute('multiple', 'multiple')
    return elm
  }
  function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }
  function createTextNode(text) {
    return document.createTextNode(text)
  }
  function createComment(text) {
    return document.createComment(text)
  }
  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode)
  }
  function removeChild(node, child) {
    node.removeChild(child)
  }
  function appendChild(node, child) {
    node.appendChild(child)
  }
  function parentNode(node) {
    return node.parentNode
  }
  function nextSibling(node) {
    return node.nextSibling
  }
  function tagName(node) {
    return node.tagName
  }
  function setTextContent(node, text) {
    node.textContent = text
  }
  function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '')
  }
  let nodeOps = Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  })
  let ref = {
    create: function create(_, vnode) {
      registerRef(vnode)
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true)
        registerRef(vnode)
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true)
    }
  }
  function registerRef(vnode, isRemoval) {
    let key = vnode.data.ref
    if (!isDef(key)) return
    let vm = vnode.context
    let ref = vnode.componentInstance || vnode.elm
    let refs = vm.$refs
    if (isRemoval)
      if (Array.isArray(refs[key])) remove(refs[key], ref)
      else {
        if (refs[key] === ref) refs[key] = undefined
      }
    else if (vnode.data.refInFor)
      if (!Array.isArray(refs[key])) refs[key] = [ref]
      else {
        if (refs[key].indexOf(ref) < 0) refs[key].push(ref)
      }
    else refs[key] = ref
  }
  let emptyNode = new VNode('', {}, [])
  let hooks = ['create', 'activate', 'update', 'remove', 'destroy']
  function sameVnode(a, b) {
    return (
      a.key === b.key &&
      ((a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)) ||
        (isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)))
    )
  }
  function sameInputType(a, b) {
    if (a.tag !== 'input') return true
    let i
    let typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type
    let typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type
    return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB))
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, key
    let map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key
      if (isDef(key)) map[key] = i
    }
    return map
  }
  function createPatchFunction(backend) {
    let i, j
    let cbs = {}
    let modules = backend.modules
    let nodeOps = backend.nodeOps
    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = []
      for (j = 0; j < modules.length; ++j)
        if (isDef(modules[j][hooks[i]]))
          cbs[hooks[i]].push(modules[j][hooks[i]])
    }
    function emptyNodeAt(elm) {
      return new VNode(
        nodeOps.tagName(elm).toLowerCase(),
        {},
        [],
        undefined,
        elm
      )
    }
    function createRmCb(childElm, listeners) {
      function remove() {
        if (--remove.listeners === 0) removeNode(childElm)
      }
      remove.listeners = listeners
      return remove
    }
    function removeNode(el) {
      let parent = nodeOps.parentNode(el)
      if (isDef(parent)) nodeOps.removeChild(parent, el)
    }
    function isUnknownElement$$1(vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(function (ignore) {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }
    let creatingElmInVPre = 0
    function createElm(
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray))
        vnode = ownerArray[index] = cloneVNode(vnode)
      vnode.isRootInsert = !nested
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) return
      let data = vnode.data
      let children = vnode.children
      let tag = vnode.tag
      if (isDef(tag)) {
        if (data && data.pre) creatingElmInVPre++
        if (isUnknownElement$$1(vnode, creatingElmInVPre))
          warn(
            'Unknown custom element: \x3c' +
              tag +
              '\x3e - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
            vnode.context
          )
        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode)
        setScope(vnode)
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) invokeCreateHooks(vnode, insertedVnodeQueue)
        insert(parentElm, vnode.elm, refElm)
        if ('development' !== 'production' && data && data.pre)
          creatingElmInVPre--
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text)
        insert(parentElm, vnode.elm, refElm)
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text)
        insert(parentElm, vnode.elm, refElm)
      }
    }
    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      let i = vnode.data
      if (isDef(i)) {
        let isReactivated = isDef(vnode.componentInstance) && i.keepAlive
        if (isDef((i = i.hook)) && isDef((i = i.init)))
          i(vnode, false, parentElm, refElm)
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue)
          if (isTrue(isReactivated))
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
          return true
        }
      }
    }
    function initComponent(vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(
          insertedVnodeQueue,
          vnode.data.pendingInsert
        )
        vnode.data.pendingInsert = null
      }
      vnode.elm = vnode.componentInstance.$el
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
        setScope(vnode)
      } else {
        registerRef(vnode)
        insertedVnodeQueue.push(vnode)
      }
    }
    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      let i
      let innerNode = vnode
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode
        if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
          for (i = 0; i < cbs.activate.length; ++i)
            cbs.activate[i](emptyNode, innerNode)
          insertedVnodeQueue.push(innerNode)
          break
        }
      }
      insert(parentElm, vnode.elm, refElm)
    }
    function insert(parent, elm, ref$$1) {
      if (isDef(parent))
        if (isDef(ref$$1)) {
          if (ref$$1.parentNode === parent)
            nodeOps.insertBefore(parent, elm, ref$$1)
        } else nodeOps.appendChild(parent, elm)
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        checkDuplicateKeys(children)
        for (let i = 0; i < children.length; ++i)
          createElm(
            children[i],
            insertedVnodeQueue,
            vnode.elm,
            null,
            true,
            children,
            i
          )
      } else if (isPrimitive(vnode.text)) nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
    function isPatchable(vnode) {
      while (vnode.componentInstance) vnode = vnode.componentInstance._vnode
      return isDef(vnode.tag)
    }
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
      for (let i$1 = 0; i$1 < cbs.create.length; ++i$1)
        cbs.create[i$1](emptyNode, vnode)
      i = vnode.data.hook
      if (isDef(i)) {
        if (isDef(i.create)) i.create(emptyNode, vnode)
        if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
      }
    }
    function setScope(vnode) {
      let i
      if (isDef((i = vnode.fnScopeId))) nodeOps.setStyleScope(vnode.elm, i)
      else {
        let ancestor = vnode
        while (ancestor) {
          if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId)))
            nodeOps.setStyleScope(vnode.elm, i)
          ancestor = ancestor.parent
        }
      }
      if (
        isDef((i = activeInstance)) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef((i = i.$options._scopeId))
      )
        nodeOps.setStyleScope(vnode.elm, i)
    }
    function addVnodes(
      parentElm,
      refElm,
      vnodes,
      startIdx,
      endIdx,
      insertedVnodeQueue
    ) {
      for (; startIdx <= endIdx; ++startIdx)
        createElm(
          vnodes[startIdx],
          insertedVnodeQueue,
          parentElm,
          refElm,
          false,
          vnodes,
          startIdx
        )
    }
    function invokeDestroyHook(vnode) {
      let i, j
      let data = vnode.data
      if (isDef(data)) {
        if (isDef((i = data.hook)) && isDef((i = i.destroy))) i(vnode)
        for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
      }
      if (isDef((i = vnode.children)))
        for (j = 0; j < vnode.children.length; ++j)
          invokeDestroyHook(vnode.children[j])
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        let ch = vnodes[startIdx]
        if (isDef(ch))
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch)
            invokeDestroyHook(ch)
          } else removeNode(ch.elm)
      }
    }
    function removeAndInvokeRemoveHook(vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        let i
        let listeners = cbs.remove.length + 1
        if (isDef(rm)) rm.listeners += listeners
        else rm = createRmCb(vnode.elm, listeners)
        if (
          isDef((i = vnode.componentInstance)) &&
          isDef((i = i._vnode)) &&
          isDef(i.data)
        )
          removeAndInvokeRemoveHook(i, rm)
        for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](vnode, rm)
        if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) i(vnode, rm)
        else rm()
      } else removeNode(vnode.elm)
    }
    function updateChildren(
      parentElm,
      oldCh,
      newCh,
      insertedVnodeQueue,
      removeOnly
    ) {
      let oldStartIdx = 0
      let newStartIdx = 0
      let oldEndIdx = oldCh.length - 1
      let oldStartVnode = oldCh[0]
      let oldEndVnode = oldCh[oldEndIdx]
      let newEndIdx = newCh.length - 1
      let newStartVnode = newCh[0]
      let newEndVnode = newCh[newEndIdx]
      let oldKeyToIdx, idxInOld, vnodeToMove, refElm
      let canMove = !removeOnly
      checkDuplicateKeys(newCh)
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx)
        if (isUndef(oldStartVnode)) oldStartVnode = oldCh[++oldStartIdx]
        else if (isUndef(oldEndVnode)) oldEndVnode = oldCh[--oldEndIdx]
        else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
          oldStartVnode = oldCh[++oldStartIdx]
          newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
          oldEndVnode = oldCh[--oldEndIdx]
          newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
          canMove &&
            nodeOps.insertBefore(
              parentElm,
              oldStartVnode.elm,
              nodeOps.nextSibling(oldEndVnode.elm)
            )
          oldStartVnode = oldCh[++oldStartIdx]
          newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
          canMove &&
            nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
          oldEndVnode = oldCh[--oldEndIdx]
          newStartVnode = newCh[++newStartIdx]
        } else {
          if (isUndef(oldKeyToIdx))
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
          if (isUndef(idxInOld))
            createElm(
              newStartVnode,
              insertedVnodeQueue,
              parentElm,
              oldStartVnode.elm,
              false,
              newCh,
              newStartIdx
            )
          else {
            vnodeToMove = oldCh[idxInOld]
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
              oldCh[idxInOld] = undefined
              canMove &&
                nodeOps.insertBefore(
                  parentElm,
                  vnodeToMove.elm,
                  oldStartVnode.elm
                )
            } else
              createElm(
                newStartVnode,
                insertedVnodeQueue,
                parentElm,
                oldStartVnode.elm,
                false,
                newCh,
                newStartIdx
              )
          }
          newStartVnode = newCh[++newStartIdx]
        }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(
          parentElm,
          refElm,
          newCh,
          newStartIdx,
          newEndIdx,
          insertedVnodeQueue
        )
      } else if (newStartIdx > newEndIdx) removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
    function checkDuplicateKeys(children) {
      let seenKeys = {}
      for (let i = 0; i < children.length; i++) {
        let vnode = children[i]
        let key = vnode.key
        if (isDef(key))
          if (seenKeys[key])
            warn(
              "Duplicate keys detected: '" +
                key +
                "'. This may cause an update error.",
              vnode.context
            )
          else seenKeys[key] = true
      }
    }
    function findIdxInOld(node, oldCh, start, end) {
      for (let i = start; i < end; i++) {
        let c = oldCh[i]
        if (isDef(c) && sameVnode(node, c)) return i
      }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) return
      let elm = (vnode.elm = oldVnode.elm)
      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved))
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
        else vnode.isAsyncPlaceholder = true
        return
      }
      if (
        isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance
        return
      }
      let i
      let data = vnode.data
      if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch)))
        i(oldVnode, vnode)
      let oldCh = oldVnode.children
      let ch = vnode.children
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
        if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode)
      }
      if (isUndef(vnode.text))
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch)
            updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        } else if (isDef(oldCh)) removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        else {
          if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        }
      else if (oldVnode.text !== vnode.text)
        nodeOps.setTextContent(elm, vnode.text)
      if (isDef(data))
        if (isDef((i = data.hook)) && isDef((i = i.postpatch)))
          i(oldVnode, vnode)
    }
    function invokeInsertHook(vnode, queue, initial) {
      if (isTrue(initial) && isDef(vnode.parent))
        vnode.parent.data.pendingInsert = queue
      else
        for (var i = 0; i < queue.length; ++i)
          queue[i].data.hook.insert(queue[i])
    }
    let hydrationBailed = false
    let isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key')
    function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
      let i
      let tag = vnode.tag
      let data = vnode.data
      let children = vnode.children
      inVPre = inVPre || (data && data.pre)
      vnode.elm = elm
      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true
        return true
      }
      if (!assertNodeMatch(elm, vnode, inVPre)) return false
      if (isDef(data)) {
        if (isDef((i = data.hook)) && isDef((i = i.init))) i(vnode, true)
        if (isDef((i = vnode.componentInstance))) {
          initComponent(vnode, insertedVnodeQueue)
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children))
          if (!elm.hasChildNodes())
            createChildren(vnode, children, insertedVnodeQueue)
          else if (
            isDef((i = data)) &&
            isDef((i = i.domProps)) &&
            isDef((i = i.innerHTML))
          ) {
            if (i !== elm.innerHTML) {
              if (
                'development' !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true
                console.warn('Parent: ', elm)
                console.warn('server innerHTML: ', i)
                console.warn('client innerHTML: ', elm.innerHTML)
              }
              return false
            }
          } else {
            var childrenMatch = true
            var childNode = elm.firstChild
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (
                !childNode ||
                !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)
              ) {
                childrenMatch = false
                break
              }
              childNode = childNode.nextSibling
            }
            if (!childrenMatch || childNode) {
              if (
                'development' !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true
                console.warn('Parent: ', elm)
                console.warn(
                  'Mismatching childNodes vs. VNodes: ',
                  elm.childNodes,
                  children
                )
              }
              return false
            }
          }
        if (isDef(data)) {
          let fullInvoke = false
          for (let key in data)
            if (!isRenderedModule(key)) {
              fullInvoke = true
              invokeCreateHooks(vnode, insertedVnodeQueue)
              break
            }
          if (!fullInvoke && data['class']) traverse(data['class'])
        }
      } else if (elm.data !== vnode.text) elm.data = vnode.text
      return true
    }
    function assertNodeMatch(node, vnode, inVPre) {
      if (isDef(vnode.tag))
        return (
          vnode.tag.indexOf('vue-component') === 0 ||
          (!isUnknownElement$$1(vnode, inVPre) &&
            vnode.tag.toLowerCase() ===
              (node.tagName && node.tagName.toLowerCase()))
        )
      else return node.nodeType === (vnode.isComment ? 8 : 3)
    }
    return function patch(
      oldVnode,
      vnode,
      hydrating,
      removeOnly,
      parentElm,
      refElm
    ) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
        return
      }
      let isInitialPatch = false
      let insertedVnodeQueue = []
      if (isUndef(oldVnode)) {
        isInitialPatch = true
        createElm(vnode, insertedVnodeQueue, parentElm, refElm)
      } else {
        let isRealElement = isDef(oldVnode.nodeType)
        if (!isRealElement && sameVnode(oldVnode, vnode))
          patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
        else {
          if (isRealElement) {
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR)
              hydrating = true
            }
            if (isTrue(hydrating))
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true)
                return oldVnode
              } else
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                    'server-rendered content. This is likely caused by incorrect ' +
                    'HTML markup, for example nesting block-level elements inside ' +
                    '\x3cp\x3e, or missing \x3ctbody\x3e. Bailing hydration and performing ' +
                    'full client-side render.'
                )
            oldVnode = emptyNodeAt(oldVnode)
          }
          let oldElm = oldVnode.elm
          let parentElm$1 = nodeOps.parentNode(oldElm)
          createElm(
            vnode,
            insertedVnodeQueue,
            oldElm._leaveCb ? null : parentElm$1,
            nodeOps.nextSibling(oldElm)
          )
          if (isDef(vnode.parent)) {
            let ancestor = vnode.parent
            let patchable = isPatchable(vnode)
            while (ancestor) {
              for (let i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](ancestor)
              ancestor.elm = vnode.elm
              if (patchable) {
                for (let i$1 = 0; i$1 < cbs.create.length; ++i$1)
                  cbs.create[i$1](emptyNode, ancestor)
                let insert = ancestor.data.hook.insert
                if (insert.merged)
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++)
                    insert.fns[i$2]()
              } else registerRef(ancestor)
              ancestor = ancestor.parent
            }
          }
          if (isDef(parentElm$1)) removeVnodes(parentElm$1, [oldVnode], 0, 0)
          else if (isDef(oldVnode.tag)) invokeDestroyHook(oldVnode)
        }
      }
      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
      return vnode.elm
    }
  }
  let directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives(vnode) {
      updateDirectives(vnode, emptyNode)
    }
  }
  function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives)
      _update(oldVnode, vnode)
  }
  function _update(oldVnode, vnode) {
    let isCreate = oldVnode === emptyNode
    let isDestroy = vnode === emptyNode
    let oldDirs = normalizeDirectives$1(
      oldVnode.data.directives,
      oldVnode.context
    )
    let newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context)
    let dirsWithInsert = []
    let dirsWithPostpatch = []
    let key, oldDir, dir
    for (key in newDirs) {
      oldDir = oldDirs[key]
      dir = newDirs[key]
      if (!oldDir) {
        callHook$1(dir, 'bind', vnode, oldVnode)
        if (dir.def && dir.def.inserted) dirsWithInsert.push(dir)
      } else {
        dir.oldValue = oldDir.value
        callHook$1(dir, 'update', vnode, oldVnode)
        if (dir.def && dir.def.componentUpdated) dirsWithPostpatch.push(dir)
      }
    }
    if (dirsWithInsert.length) {
      let callInsert = function () {
        for (let i = 0; i < dirsWithInsert.length; i++)
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode)
      }
      if (isCreate) mergeVNodeHook(vnode, 'insert', callInsert)
      else callInsert()
    }
    if (dirsWithPostpatch.length)
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++)
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode)
      })
    if (!isCreate)
      for (key in oldDirs)
        if (!newDirs[key])
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
  }
  let emptyModifiers = Object.create(null)
  function normalizeDirectives$1(dirs, vm) {
    let res = Object.create(null)
    if (!dirs) return res
    let i, dir
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i]
      if (!dir.modifiers) dir.modifiers = emptyModifiers
      res[getRawDirName(dir)] = dir
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true)
    }
    return res
  }
  function getRawDirName(dir) {
    return (
      dir.rawName || dir.name + '.' + Object.keys(dir.modifiers || {}).join('.')
    )
  }
  function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
    let fn = dir.def && dir.def[hook]
    if (fn)
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy)
      } catch (e) {
        handleError(
          e,
          vnode.context,
          'directive ' + dir.name + ' ' + hook + ' hook'
        )
      }
  }
  let baseModules = [ref, directives]
  function updateAttrs(oldVnode, vnode) {
    let opts = vnode.componentOptions
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) return
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) return
    let key, cur, old
    let elm = vnode.elm
    let oldAttrs = oldVnode.data.attrs || {}
    let attrs = vnode.data.attrs || {}
    if (isDef(attrs.__ob__)) attrs = vnode.data.attrs = extend({}, attrs)
    for (key in attrs) {
      cur = attrs[key]
      old = oldAttrs[key]
      if (old !== cur) setAttr(elm, key, cur)
    }
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value)
      setAttr(elm, 'value', attrs.value)
    for (key in oldAttrs)
      if (isUndef(attrs[key]))
        if (isXlink(key)) elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
        else if (!isEnumeratedAttr(key)) elm.removeAttribute(key)
  }
  function setAttr(el, key, value) {
    if (el.tagName.indexOf('-') > -1) baseSetAttr(el, key, value)
    else if (isBooleanAttr(key))
      if (isFalsyAttrValue(value)) el.removeAttribute(key)
      else {
        value =
          key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key
        el.setAttribute(key, value)
      }
    else if (isEnumeratedAttr(key))
      el.setAttribute(
        key,
        isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true'
      )
    else if (isXlink(key))
      if (isFalsyAttrValue(value))
        el.removeAttributeNS(xlinkNS, getXlinkProp(key))
      else el.setAttributeNS(xlinkNS, key, value)
    else baseSetAttr(el, key, value)
  }
  function baseSetAttr(el, key, value) {
    if (isFalsyAttrValue(value)) el.removeAttribute(key)
    else {
      if (
        isIE &&
        !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' &&
        !el.__ieph
      ) {
        let blocker = function (e) {
          e.stopImmediatePropagation()
          el.removeEventListener('input', blocker)
        }
        el.addEventListener('input', blocker)
        el.__ieph = true
      }
      el.setAttribute(key, value)
    }
  }
  let attrs = { create: updateAttrs, update: updateAttrs }
  function updateClass(oldVnode, vnode) {
    let el = vnode.elm
    let data = vnode.data
    let oldData = oldVnode.data
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) &&
      (isUndef(oldData) ||
        (isUndef(oldData.staticClass) && isUndef(oldData.class)))
    )
      return
    let cls = genClassForVnode(vnode)
    let transitionClass = el._transitionClasses
    if (isDef(transitionClass))
      cls = concat(cls, stringifyClass(transitionClass))
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls)
      el._prevClass = cls
    }
  }
  let klass = { create: updateClass, update: updateClass }
  let validDivisionCharRE = /[\w).+\-_$\]]/
  function parseFilters(exp) {
    let inSingle = false
    let inDouble = false
    let inTemplateString = false
    let inRegex = false
    let curly = 0
    let square = 0
    let paren = 0
    let lastFilterIndex = 0
    let c, prev, i, expression, filters
    for (i = 0; i < exp.length; i++) {
      prev = c
      c = exp.charCodeAt(i)
      if (inSingle) {
        if (c === 39 && prev !== 92) inSingle = false
      } else if (inDouble) {
        if (c === 34 && prev !== 92) inDouble = false
      } else if (inTemplateString) {
        if (c === 96 && prev !== 92) inTemplateString = false
      } else if (inRegex) {
        if (c === 47 && prev !== 92) inRegex = false
      } else if (
        c === 124 &&
        exp.charCodeAt(i + 1) !== 124 &&
        exp.charCodeAt(i - 1) !== 124 &&
        !curly &&
        !square &&
        !paren
      )
        if (expression === undefined) {
          lastFilterIndex = i + 1
          expression = exp.slice(0, i).trim()
        } else pushFilter()
      else {
        switch (c) {
          case 34:
            inDouble = true
            break
          case 39:
            inSingle = true
            break
          case 96:
            inTemplateString = true
            break
          case 40:
            paren++
            break
          case 41:
            paren--
            break
          case 91:
            square++
            break
          case 93:
            square--
            break
          case 123:
            curly++
            break
          case 125:
            curly--
            break
        }
        if (c === 47) {
          let j = i - 1
          let p = void 0
          for (; j >= 0; j--) {
            p = exp.charAt(j)
            if (p !== ' ') break
          }
          if (!p || !validDivisionCharRE.test(p)) inRegex = true
        }
      }
    }
    if (expression === undefined) expression = exp.slice(0, i).trim()
    else if (lastFilterIndex !== 0) pushFilter()
    function pushFilter() {
      ;(filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim())
      lastFilterIndex = i + 1
    }
    if (filters)
      for (i = 0; i < filters.length; i++)
        expression = wrapFilter(expression, filters[i])
    return expression
  }
  function wrapFilter(exp, filter) {
    let i = filter.indexOf('(')
    if (i < 0) return '_f("' + filter + '")(' + exp + ')'
    else {
      let name = filter.slice(0, i)
      let args = filter.slice(i + 1)
      return '_f("' + name + '")(' + exp + (args !== ')' ? ',' + args : args)
    }
  }
  function baseWarn(msg) {
    console.error('[Vue compiler]: ' + msg)
  }
  function pluckModuleFunction(modules, key) {
    return modules
      ? modules
          .map(function (m) {
            return m[key]
          })
          .filter(function (_) {
            return _
          })
      : []
  }
  function addProp(el, name, value) {
    ;(el.props || (el.props = [])).push({ name: name, value: value })
    el.plain = false
  }
  function addAttr(el, name, value) {
    ;(el.attrs || (el.attrs = [])).push({ name: name, value: value })
    el.plain = false
  }
  function addRawAttr(el, name, value) {
    el.attrsMap[name] = value
    el.attrsList.push({ name: name, value: value })
  }
  function addDirective(el, name, rawName, value, arg, modifiers) {
    ;(el.directives || (el.directives = [])).push({
      name: name,
      rawName: rawName,
      value: value,
      arg: arg,
      modifiers: modifiers
    })
    el.plain = false
  }
  function addHandler(el, name, value, modifiers, important, warn) {
    modifiers = modifiers || emptyObject
    if (
      'development' !== 'production' &&
      warn &&
      modifiers.prevent &&
      modifiers.passive
    )
      warn(
        "passive and prevent can't be used together. " +
          "Passive handler can't prevent default event."
      )
    if (modifiers.capture) {
      delete modifiers.capture
      name = '!' + name
    }
    if (modifiers.once) {
      delete modifiers.once
      name = '~' + name
    }
    if (modifiers.passive) {
      delete modifiers.passive
      name = '\x26' + name
    }
    if (name === 'click')
      if (modifiers.right) {
        name = 'contextmenu'
        delete modifiers.right
      } else if (modifiers.middle) name = 'mouseup'
    let events
    if (modifiers.native) {
      delete modifiers.native
      events = el.nativeEvents || (el.nativeEvents = {})
    } else events = el.events || (el.events = {})
    let newHandler = { value: value.trim() }
    if (modifiers !== emptyObject) newHandler.modifiers = modifiers
    let handlers = events[name]
    if (Array.isArray(handlers))
      important ? handlers.unshift(newHandler) : handlers.push(newHandler)
    else if (handlers)
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
    else events[name] = newHandler
    el.plain = false
  }
  function getBindingAttr(el, name, getStatic) {
    let dynamicValue =
      getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name)
    if (dynamicValue != null) return parseFilters(dynamicValue)
    else if (getStatic !== false) {
      let staticValue = getAndRemoveAttr(el, name)
      if (staticValue != null) return JSON.stringify(staticValue)
    }
  }
  function getAndRemoveAttr(el, name, removeFromMap) {
    let val
    if ((val = el.attrsMap[name]) != null) {
      let list = el.attrsList
      for (let i = 0, l = list.length; i < l; i++)
        if (list[i].name === name) {
          list.splice(i, 1)
          break
        }
    }
    if (removeFromMap) delete el.attrsMap[name]
    return val
  }
  function genComponentModel(el, value, modifiers) {
    let ref = modifiers || {}
    let number = ref.number
    let trim = ref.trim
    let baseValueExpression = '$$v'
    let valueExpression = baseValueExpression
    if (trim)
      valueExpression =
        '(typeof ' +
        baseValueExpression +
        " \x3d\x3d\x3d 'string'" +
        '? ' +
        baseValueExpression +
        '.trim()' +
        ': ' +
        baseValueExpression +
        ')'
    if (number) valueExpression = '_n(' + valueExpression + ')'
    let assignment = genAssignmentCode(value, valueExpression)
    el.model = {
      value: '(' + value + ')',
      expression: '"' + value + '"',
      callback: 'function (' + baseValueExpression + ') {' + assignment + '}'
    }
  }
  function genAssignmentCode(value, assignment) {
    let res = parseModel(value)
    if (res.key === null) return value + '\x3d' + assignment
    else return '$set(' + res.exp + ', ' + res.key + ', ' + assignment + ')'
  }
  let len
  let str
  let chr
  let index$1
  let expressionPos
  let expressionEndPos
  function parseModel(val) {
    val = val.trim()
    len = val.length
    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      index$1 = val.lastIndexOf('.')
      if (index$1 > -1)
        return {
          exp: val.slice(0, index$1),
          key: '"' + val.slice(index$1 + 1) + '"'
        }
      else return { exp: val, key: null }
    }
    str = val
    index$1 = expressionPos = expressionEndPos = 0
    while (!eof()) {
      chr = next()
      if (isStringStart(chr)) parseString(chr)
      else if (chr === 91) parseBracket(chr)
    }
    return {
      exp: val.slice(0, expressionPos),
      key: val.slice(expressionPos + 1, expressionEndPos)
    }
  }
  function next() {
    return str.charCodeAt(++index$1)
  }
  function eof() {
    return index$1 >= len
  }
  function isStringStart(chr) {
    return chr === 34 || chr === 39
  }
  function parseBracket(chr) {
    let inBracket = 1
    expressionPos = index$1
    while (!eof()) {
      chr = next()
      if (isStringStart(chr)) {
        parseString(chr)
        continue
      }
      if (chr === 91) inBracket++
      if (chr === 93) inBracket--
      if (inBracket === 0) {
        expressionEndPos = index$1
        break
      }
    }
  }
  function parseString(chr) {
    let stringQuote = chr
    while (!eof()) {
      chr = next()
      if (chr === stringQuote) break
    }
  }
  let warn$1
  let RANGE_TOKEN = '__r'
  let CHECKBOX_RADIO_TOKEN = '__c'
  function model(el, dir, _warn) {
    warn$1 = _warn
    let value = dir.value
    let modifiers = dir.modifiers
    let tag = el.tag
    let type = el.attrsMap.type
    if (tag === 'input' && type === 'file')
      warn$1(
        '\x3c' +
          el.tag +
          ' v-model\x3d"' +
          value +
          '" type\x3d"file"\x3e:\n' +
          'File inputs are read only. Use a v-on:change listener instead.'
      )
    if (el.component) {
      genComponentModel(el, value, modifiers)
      return false
    } else if (tag === 'select') genSelect(el, value, modifiers)
    else if (tag === 'input' && type === 'checkbox')
      genCheckboxModel(el, value, modifiers)
    else if (tag === 'input' && type === 'radio')
      genRadioModel(el, value, modifiers)
    else if (tag === 'input' || tag === 'textarea')
      genDefaultModel(el, value, modifiers)
    else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers)
      return false
    } else
      warn$1(
        '\x3c' +
          el.tag +
          ' v-model\x3d"' +
          value +
          '"\x3e: ' +
          'v-model is not supported on this element type. ' +
          "If you are working with contenteditable, it's recommended to " +
          'wrap a library dedicated for that purpose inside a custom component.'
      )
    return true
  }
  function genCheckboxModel(el, value, modifiers) {
    let number = modifiers && modifiers.number
    let valueBinding = getBindingAttr(el, 'value') || 'null'
    let trueValueBinding = getBindingAttr(el, 'true-value') || 'true'
    let falseValueBinding = getBindingAttr(el, 'false-value') || 'false'
    addProp(
      el,
      'checked',
      'Array.isArray(' +
        value +
        ')' +
        '?_i(' +
        value +
        ',' +
        valueBinding +
        ')\x3e-1' +
        (trueValueBinding === 'true'
          ? ':(' + value + ')'
          : ':_q(' + value + ',' + trueValueBinding + ')')
    )
    addHandler(
      el,
      'change',
      'var $$a\x3d' +
        value +
        ',' +
        '$$el\x3d$event.target,' +
        '$$c\x3d$$el.checked?(' +
        trueValueBinding +
        '):(' +
        falseValueBinding +
        ');' +
        'if(Array.isArray($$a)){' +
        'var $$v\x3d' +
        (number ? '_n(' + valueBinding + ')' : valueBinding) +
        ',' +
        '$$i\x3d_i($$a,$$v);' +
        'if($$el.checked){$$i\x3c0\x26\x26(' +
        genAssignmentCode(value, '$$a.concat([$$v])') +
        ')}' +
        'else{$$i\x3e-1\x26\x26(' +
        genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))') +
        ')}' +
        '}else{' +
        genAssignmentCode(value, '$$c') +
        '}',
      null,
      true
    )
  }
  function genRadioModel(el, value, modifiers) {
    let number = modifiers && modifiers.number
    let valueBinding = getBindingAttr(el, 'value') || 'null'
    valueBinding = number ? '_n(' + valueBinding + ')' : valueBinding
    addProp(el, 'checked', '_q(' + value + ',' + valueBinding + ')')
    addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true)
  }
  function genSelect(el, value, modifiers) {
    let number = modifiers && modifiers.number
    let selectedVal =
      'Array.prototype.filter' +
      '.call($event.target.options,function(o){return o.selected})' +
      '.map(function(o){var val \x3d "_value" in o ? o._value : o.value;' +
      'return ' +
      (number ? '_n(val)' : 'val') +
      '})'
    let assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]'
    let code = 'var $$selectedVal \x3d ' + selectedVal + ';'
    code = code + ' ' + genAssignmentCode(value, assignment)
    addHandler(el, 'change', code, null, true)
  }
  function genDefaultModel(el, value, modifiers) {
    let type = el.attrsMap.type
    let value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value']
    let typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type']
    if (value$1 && !typeBinding) {
      let binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value'
      warn$1(
        binding +
          '\x3d"' +
          value$1 +
          '" conflicts with v-model on the same element ' +
          'because the latter already expands to a value binding internally'
      )
    }
    let ref = modifiers || {}
    let lazy = ref.lazy
    let number = ref.number
    let trim = ref.trim
    let needCompositionGuard = !lazy && type !== 'range'
    let event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input'
    let valueExpression = '$event.target.value'
    if (trim) valueExpression = '$event.target.value.trim()'
    if (number) valueExpression = '_n(' + valueExpression + ')'
    let code = genAssignmentCode(value, valueExpression)
    if (needCompositionGuard) code = 'if($event.target.composing)return;' + code
    addProp(el, 'value', '(' + value + ')')
    addHandler(el, event, code, null, true)
    if (trim || number) addHandler(el, 'blur', '$forceUpdate()')
  }
  function normalizeEvents(on) {
    if (isDef(on[RANGE_TOKEN])) {
      let event = isIE ? 'change' : 'input'
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || [])
      delete on[RANGE_TOKEN]
    }
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || [])
      delete on[CHECKBOX_RADIO_TOKEN]
    }
  }
  let target$1
  function createOnceHandler(handler, event, capture) {
    let _target = target$1
    return function onceHandler() {
      let res = handler.apply(null, arguments)
      if (res !== null) remove$2(event, onceHandler, capture, _target)
    }
  }
  function add$1(event, handler, once$$1, capture, passive) {
    handler = withMacroTask(handler)
    if (once$$1) handler = createOnceHandler(handler, event, capture)
    target$1.addEventListener(
      event,
      handler,
      supportsPassive ? { capture: capture, passive: passive } : capture
    )
  }
  function remove$2(event, handler, capture, _target) {
    ;(_target || target$1).removeEventListener(
      event,
      handler._withTask || handler,
      capture
    )
  }
  function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) return
    let on = vnode.data.on || {}
    let oldOn = oldVnode.data.on || {}
    target$1 = vnode.elm
    normalizeEvents(on)
    updateListeners(on, oldOn, add$1, remove$2, vnode.context)
    target$1 = undefined
  }
  let events = { create: updateDOMListeners, update: updateDOMListeners }
  function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) return
    let key, cur
    let elm = vnode.elm
    let oldProps = oldVnode.data.domProps || {}
    let props = vnode.data.domProps || {}
    if (isDef(props.__ob__)) props = vnode.data.domProps = extend({}, props)
    for (key in oldProps) if (isUndef(props[key])) elm[key] = ''
    for (key in props) {
      cur = props[key]
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) vnode.children.length = 0
        if (cur === oldProps[key]) continue
        if (elm.childNodes.length === 1) elm.removeChild(elm.childNodes[0])
      }
      if (key === 'value') {
        elm._value = cur
        let strCur = isUndef(cur) ? '' : String(cur)
        if (shouldUpdateValue(elm, strCur)) elm.value = strCur
      } else elm[key] = cur
    }
  }
  function shouldUpdateValue(elm, checkVal) {
    return (
      !elm.composing &&
      (elm.tagName === 'OPTION' ||
        isNotInFocusAndDirty(elm, checkVal) ||
        isDirtyWithModifiers(elm, checkVal))
    )
  }
  function isNotInFocusAndDirty(elm, checkVal) {
    let notInFocus = true
    try {
      notInFocus = document.activeElement !== elm
    } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }
  function isDirtyWithModifiers(elm, newVal) {
    let value = elm.value
    let modifiers = elm._vModifiers
    if (isDef(modifiers)) {
      if (modifiers.lazy) return false
      if (modifiers.number) return toNumber(value) !== toNumber(newVal)
      if (modifiers.trim) return value.trim() !== newVal.trim()
    }
    return value !== newVal
  }
  let domProps = { create: updateDOMProps, update: updateDOMProps }
  let parseStyleText = cached(function (cssText) {
    let res = {}
    let listDelimiter = /;(?![^(]*\))/g
    let propertyDelimiter = /:(.+)/
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        let tmp = item.split(propertyDelimiter)
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
      }
    })
    return res
  })
  function normalizeStyleData(data) {
    let style = normalizeStyleBinding(data.style)
    return data.staticStyle ? extend(data.staticStyle, style) : style
  }
  function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) return toObject(bindingStyle)
    if (typeof bindingStyle === 'string') return parseStyleText(bindingStyle)
    return bindingStyle
  }
  function getStyle(vnode, checkChild) {
    let res = {}
    let styleData
    if (checkChild) {
      let childNode = vnode
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode
        if (
          childNode &&
          childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        )
          extend(res, styleData)
      }
    }
    if ((styleData = normalizeStyleData(vnode.data))) extend(res, styleData)
    let parentNode = vnode
    while ((parentNode = parentNode.parent))
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data)))
        extend(res, styleData)
    return res
  }
  let cssVarRE = /^--/
  let importantRE = /\s*!important$/
  let setProp = function (el, name, val) {
    if (cssVarRE.test(name)) el.style.setProperty(name, val)
    else if (importantRE.test(val))
      el.style.setProperty(name, val.replace(importantRE, ''), 'important')
    else {
      let normalizedName = normalize(name)
      if (Array.isArray(val))
        for (var i = 0, len = val.length; i < len; i++)
          el.style[normalizedName] = val[i]
      else el.style[normalizedName] = val
    }
  }
  let vendorNames = ['Webkit', 'Moz', 'ms']
  let emptyStyle
  let normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style
    prop = camelize(prop)
    if (prop !== 'filter' && prop in emptyStyle) return prop
    let capName = prop.charAt(0).toUpperCase() + prop.slice(1)
    for (let i = 0; i < vendorNames.length; i++) {
      let name = vendorNames[i] + capName
      if (name in emptyStyle) return name
    }
  })
  function updateStyle(oldVnode, vnode) {
    let data = vnode.data
    let oldData = oldVnode.data
    if (
      isUndef(data.staticStyle) &&
      isUndef(data.style) &&
      isUndef(oldData.staticStyle) &&
      isUndef(oldData.style)
    )
      return
    let cur, name
    let el = vnode.elm
    let oldStaticStyle = oldData.staticStyle
    let oldStyleBinding = oldData.normalizedStyle || oldData.style || {}
    let oldStyle = oldStaticStyle || oldStyleBinding
    let style = normalizeStyleBinding(vnode.data.style) || {}
    vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style
    let newStyle = getStyle(vnode, true)
    for (name in oldStyle) if (isUndef(newStyle[name])) setProp(el, name, '')
    for (name in newStyle) {
      cur = newStyle[name]
      if (cur !== oldStyle[name]) setProp(el, name, cur == null ? '' : cur)
    }
  }
  let style = { create: updateStyle, update: updateStyle }
  function addClass(el, cls) {
    if (!cls || !(cls = cls.trim())) return
    if (el.classList)
      if (cls.indexOf(' ') > -1)
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.add(c)
        })
      else el.classList.add(cls)
    else {
      let cur = ' ' + (el.getAttribute('class') || '') + ' '
      if (cur.indexOf(' ' + cls + ' ') < 0)
        el.setAttribute('class', (cur + cls).trim())
    }
  }
  function removeClass(el, cls) {
    if (!cls || !(cls = cls.trim())) return
    if (el.classList) {
      if (cls.indexOf(' ') > -1)
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.remove(c)
        })
      else el.classList.remove(cls)
      if (!el.classList.length) el.removeAttribute('class')
    } else {
      let cur = ' ' + (el.getAttribute('class') || '') + ' '
      let tar = ' ' + cls + ' '
      while (cur.indexOf(tar) >= 0) cur = cur.replace(tar, ' ')
      cur = cur.trim()
      if (cur) el.setAttribute('class', cur)
      else el.removeAttribute('class')
    }
  }
  function resolveTransition(def) {
    if (!def) return
    if (typeof def === 'object') {
      let res = {}
      if (def.css !== false) extend(res, autoCssTransition(def.name || 'v'))
      extend(res, def)
      return res
    } else if (typeof def === 'string') return autoCssTransition(def)
  }
  let autoCssTransition = cached(function (name) {
    return {
      enterClass: name + '-enter',
      enterToClass: name + '-enter-to',
      enterActiveClass: name + '-enter-active',
      leaveClass: name + '-leave',
      leaveToClass: name + '-leave-to',
      leaveActiveClass: name + '-leave-active'
    }
  })
  let hasTransition = inBrowser && !isIE9
  let TRANSITION = 'transition'
  let ANIMATION = 'animation'
  let transitionProp = 'transition'
  let transitionEndEvent = 'transitionend'
  let animationProp = 'animation'
  let animationEndEvent = 'animationend'
  if (hasTransition) {
    if (
      window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition'
      transitionEndEvent = 'webkitTransitionEnd'
    }
    if (
      window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation'
      animationEndEvent = 'webkitAnimationEnd'
    }
  }
  let raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : function (fn) {
        return fn()
      }
  function nextFrame(fn) {
    raf(function () {
      raf(fn)
    })
  }
  function addTransitionClass(el, cls) {
    let transitionClasses =
      el._transitionClasses || (el._transitionClasses = [])
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls)
      addClass(el, cls)
    }
  }
  function removeTransitionClass(el, cls) {
    if (el._transitionClasses) remove(el._transitionClasses, cls)
    removeClass(el, cls)
  }
  function whenTransitionEnds(el, expectedType, cb) {
    let ref = getTransitionInfo(el, expectedType)
    let type = ref.type
    let timeout = ref.timeout
    let propCount = ref.propCount
    if (!type) return cb()
    let event = type === TRANSITION ? transitionEndEvent : animationEndEvent
    let ended = 0
    let end = function () {
      el.removeEventListener(event, onEnd)
      cb()
    }
    let onEnd = function (e) {
      if (e.target === el) if (++ended >= propCount) end()
    }
    setTimeout(function () {
      if (ended < propCount) end()
    }, timeout + 1)
    el.addEventListener(event, onEnd)
  }
  let transformRE = /\b(transform|all)(,|$)/
  function getTransitionInfo(el, expectedType) {
    let styles = window.getComputedStyle(el)
    let transitionDelays = styles[transitionProp + 'Delay'].split(', ')
    let transitionDurations = styles[transitionProp + 'Duration'].split(', ')
    let transitionTimeout = getTimeout(transitionDelays, transitionDurations)
    let animationDelays = styles[animationProp + 'Delay'].split(', ')
    let animationDurations = styles[animationProp + 'Duration'].split(', ')
    let animationTimeout = getTimeout(animationDelays, animationDurations)
    let type
    let timeout = 0
    let propCount = 0
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION
        timeout = transitionTimeout
        propCount = transitionDurations.length
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION
        timeout = animationTimeout
        propCount = animationDurations.length
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout)
      type =
        timeout > 0
          ? transitionTimeout > animationTimeout
            ? TRANSITION
            : ANIMATION
          : null
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0
    }
    let hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property'])
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) delays = delays.concat(delays)
    return Math.max.apply(
      null,
      durations.map(function (d, i) {
        return toMs(d) + toMs(delays[i])
      })
    )
  }
  function toMs(s) {
    return Number(s.slice(0, -1)) * 1e3
  }
  function enter(vnode, toggleDisplay) {
    let el = vnode.elm
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true
      el._leaveCb()
    }
    let data = resolveTransition(vnode.data.transition)
    if (isUndef(data)) return
    if (isDef(el._enterCb) || el.nodeType !== 1) return
    let css = data.css
    let type = data.type
    let enterClass = data.enterClass
    let enterToClass = data.enterToClass
    let enterActiveClass = data.enterActiveClass
    let appearClass = data.appearClass
    let appearToClass = data.appearToClass
    let appearActiveClass = data.appearActiveClass
    let beforeEnter = data.beforeEnter
    let enter = data.enter
    let afterEnter = data.afterEnter
    let enterCancelled = data.enterCancelled
    let beforeAppear = data.beforeAppear
    let appear = data.appear
    let afterAppear = data.afterAppear
    let appearCancelled = data.appearCancelled
    let duration = data.duration
    let context = activeInstance
    let transitionNode = activeInstance.$vnode
    while (transitionNode && transitionNode.parent) {
      transitionNode = transitionNode.parent
      context = transitionNode.context
    }
    let isAppear = !context._isMounted || !vnode.isRootInsert
    if (isAppear && !appear && appear !== '') return
    let startClass = isAppear && appearClass ? appearClass : enterClass
    let activeClass =
      isAppear && appearActiveClass ? appearActiveClass : enterActiveClass
    let toClass = isAppear && appearToClass ? appearToClass : enterToClass
    let beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter
    let enterHook = isAppear
      ? typeof appear === 'function'
        ? appear
        : enter
      : enter
    let afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter
    let enterCancelledHook = isAppear
      ? appearCancelled || enterCancelled
      : enterCancelled
    let explicitEnterDuration = toNumber(
      isObject(duration) ? duration.enter : duration
    )
    if ('development' !== 'production' && explicitEnterDuration != null)
      checkDuration(explicitEnterDuration, 'enter', vnode)
    let expectsCSS = css !== false && !isIE9
    let userWantsControl = getHookArgumentsLength(enterHook)
    let cb = (el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass)
        removeTransitionClass(el, activeClass)
      }
      if (cb.cancelled) {
        if (expectsCSS) removeTransitionClass(el, startClass)
        enterCancelledHook && enterCancelledHook(el)
      } else afterEnterHook && afterEnterHook(el)
      el._enterCb = null
    }))
    if (!vnode.data.show)
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode
        var pendingNode =
          parent && parent._pending && parent._pending[vnode.key]
        if (
          pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        )
          pendingNode.elm._leaveCb()
        enterHook && enterHook(el, cb)
      })
    beforeEnterHook && beforeEnterHook(el)
    if (expectsCSS) {
      addTransitionClass(el, startClass)
      addTransitionClass(el, activeClass)
      nextFrame(function () {
        removeTransitionClass(el, startClass)
        if (!cb.cancelled) {
          addTransitionClass(el, toClass)
          if (!userWantsControl)
            if (isValidDuration(explicitEnterDuration))
              setTimeout(cb, explicitEnterDuration)
            else whenTransitionEnds(el, type, cb)
        }
      })
    }
    if (vnode.data.show) {
      toggleDisplay && toggleDisplay()
      enterHook && enterHook(el, cb)
    }
    if (!expectsCSS && !userWantsControl) cb()
  }
  function leave(vnode, rm) {
    let el = vnode.elm
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true
      el._enterCb()
    }
    let data = resolveTransition(vnode.data.transition)
    if (isUndef(data) || el.nodeType !== 1) return rm()
    if (isDef(el._leaveCb)) return
    let css = data.css
    let type = data.type
    let leaveClass = data.leaveClass
    let leaveToClass = data.leaveToClass
    let leaveActiveClass = data.leaveActiveClass
    let beforeLeave = data.beforeLeave
    let leave = data.leave
    let afterLeave = data.afterLeave
    let leaveCancelled = data.leaveCancelled
    let delayLeave = data.delayLeave
    let duration = data.duration
    let expectsCSS = css !== false && !isIE9
    let userWantsControl = getHookArgumentsLength(leave)
    let explicitLeaveDuration = toNumber(
      isObject(duration) ? duration.leave : duration
    )
    if ('development' !== 'production' && isDef(explicitLeaveDuration))
      checkDuration(explicitLeaveDuration, 'leave', vnode)
    let cb = (el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending)
        el.parentNode._pending[vnode.key] = null
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass)
        removeTransitionClass(el, leaveActiveClass)
      }
      if (cb.cancelled) {
        if (expectsCSS) removeTransitionClass(el, leaveClass)
        leaveCancelled && leaveCancelled(el)
      } else {
        rm()
        afterLeave && afterLeave(el)
      }
      el._leaveCb = null
    }))
    if (delayLeave) delayLeave(performLeave)
    else performLeave()
    function performLeave() {
      if (cb.cancelled) return
      if (!vnode.data.show)
        (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] =
          vnode
      beforeLeave && beforeLeave(el)
      if (expectsCSS) {
        addTransitionClass(el, leaveClass)
        addTransitionClass(el, leaveActiveClass)
        nextFrame(function () {
          removeTransitionClass(el, leaveClass)
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass)
            if (!userWantsControl)
              if (isValidDuration(explicitLeaveDuration))
                setTimeout(cb, explicitLeaveDuration)
              else whenTransitionEnds(el, type, cb)
          }
        })
      }
      leave && leave(el, cb)
      if (!expectsCSS && !userWantsControl) cb()
    }
  }
  function checkDuration(val, name, vnode) {
    if (typeof val !== 'number')
      warn(
        '\x3ctransition\x3e explicit ' +
          name +
          ' duration is not a valid number - ' +
          'got ' +
          JSON.stringify(val) +
          '.',
        vnode.context
      )
    else if (isNaN(val))
      warn(
        '\x3ctransition\x3e explicit ' +
          name +
          ' duration is NaN - ' +
          'the duration expression might be incorrect.',
        vnode.context
      )
  }
  function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val)
  }
  function getHookArgumentsLength(fn) {
    if (isUndef(fn)) return false
    let invokerFns = fn.fns
    if (isDef(invokerFns))
      return getHookArgumentsLength(
        Array.isArray(invokerFns) ? invokerFns[0] : invokerFns
      )
    else return (fn._length || fn.length) > 1
  }
  function _enter(_, vnode) {
    if (vnode.data.show !== true) enter(vnode)
  }
  let transition = inBrowser
    ? {
        create: _enter,
        activate: _enter,
        remove: function remove$$1(vnode, rm) {
          if (vnode.data.show !== true) leave(vnode, rm)
          else rm()
        }
      }
    : {}
  let platformModules = [attrs, klass, events, domProps, style, transition]
  let modules = platformModules.concat(baseModules)
  let patch = createPatchFunction({ nodeOps: nodeOps, modules: modules })
  if (isIE9)
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement
      if (el && el.vmodel) trigger(el, 'input')
    })
  let directive = {
    inserted: function inserted(el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        if (oldVnode.elm && !oldVnode.elm._vOptions)
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode)
          })
        else setSelected(el, binding, vnode.context)
        el._vOptions = [].map.call(el.options, getValue)
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart)
          el.addEventListener('compositionend', onCompositionEnd)
          el.addEventListener('change', onCompositionEnd)
          if (isIE9) el.vmodel = true
        }
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context)
        var prevOptions = el._vOptions
        var curOptions = (el._vOptions = [].map.call(el.options, getValue))
        if (
          curOptions.some(function (o, i) {
            return !looseEqual(o, prevOptions[i])
          })
        ) {
          var needReset = el.multiple
            ? binding.value.some(function (v) {
                return hasNoMatchingOption(v, curOptions)
              })
            : binding.value !== binding.oldValue &&
              hasNoMatchingOption(binding.value, curOptions)
          if (needReset) trigger(el, 'change')
        }
      }
    }
  }
  function setSelected(el, binding, vm) {
    actuallySetSelected(el, binding, vm)
    if (isIE || isEdge)
      setTimeout(function () {
        actuallySetSelected(el, binding, vm)
      }, 0)
  }
  function actuallySetSelected(el, binding, vm) {
    let value = binding.value
    let isMultiple = el.multiple
    if (isMultiple && !Array.isArray(value)) {
      'development' !== 'production' &&
        warn(
          '\x3cselect multiple v-model\x3d"' +
            binding.expression +
            '"\x3e ' +
            'expects an Array value for its binding, but got ' +
            Object.prototype.toString.call(value).slice(8, -1),
          vm
        )
      return
    }
    let selected, option
    for (let i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i]
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1
        if (option.selected !== selected) option.selected = selected
      } else if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) el.selectedIndex = i
        return
      }
    }
    if (!isMultiple) el.selectedIndex = -1
  }
  function hasNoMatchingOption(value, options) {
    return options.every(function (o) {
      return !looseEqual(o, value)
    })
  }
  function getValue(option) {
    return '_value' in option ? option._value : option.value
  }
  function onCompositionStart(e) {
    e.target.composing = true
  }
  function onCompositionEnd(e) {
    if (!e.target.composing) return
    e.target.composing = false
    trigger(e.target, 'input')
  }
  function trigger(el, type) {
    let e = document.createEvent('HTMLEvents')
    e.initEvent(type, true, true)
    el.dispatchEvent(e)
  }
  function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }
  let show = {
    bind: function bind(el, ref, vnode) {
      var value = ref.value
      vnode = locateNode(vnode)
      var transition$$1 = vnode.data && vnode.data.transition
      var originalDisplay = (el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display)
      if (value && transition$$1) {
        vnode.data.show = true
        enter(vnode, function () {
          el.style.display = originalDisplay
        })
      } else el.style.display = value ? originalDisplay : 'none'
    },
    update: function update(el, ref, vnode) {
      var value = ref.value
      var oldValue = ref.oldValue
      if (!value === !oldValue) return
      vnode = locateNode(vnode)
      var transition$$1 = vnode.data && vnode.data.transition
      if (transition$$1) {
        vnode.data.show = true
        if (value)
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay
          })
        else
          leave(vnode, function () {
            el.style.display = 'none'
          })
      } else el.style.display = value ? el.__vOriginalDisplay : 'none'
    },
    unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
      if (!isDestroy) el.style.display = el.__vOriginalDisplay
    }
  }
  let platformDirectives = { model: directive, show: show }
  let transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  }
  function getRealChild(vnode) {
    let compOptions = vnode && vnode.componentOptions
    if (compOptions && compOptions.Ctor.options.abstract)
      return getRealChild(getFirstComponentChild(compOptions.children))
    else return vnode
  }
  function extractTransitionData(comp) {
    let data = {}
    let options = comp.$options
    for (let key in options.propsData) data[key] = comp[key]
    let listeners = options._parentListeners
    for (let key$1 in listeners) data[camelize(key$1)] = listeners[key$1]
    return data
  }
  function placeholder(h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag))
      return h('keep-alive', { props: rawChild.componentOptions.propsData })
  }
  function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) if (vnode.data.transition) return true
  }
  function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }
  let Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render: function render(h) {
      var this$1 = this
      var children = this.$slots.default
      if (!children) return
      children = children.filter(function (c) {
        return c.tag || isAsyncPlaceholder(c)
      })
      if (!children.length) return
      if ('development' !== 'production' && children.length > 1)
        warn(
          '\x3ctransition\x3e can only be used on a single element. Use ' +
            '\x3ctransition-group\x3e for lists.',
          this.$parent
        )
      var mode = this.mode
      if (
        'development' !== 'production' &&
        mode &&
        mode !== 'in-out' &&
        mode !== 'out-in'
      )
        warn('invalid \x3ctransition\x3e mode: ' + mode, this.$parent)
      var rawChild = children[0]
      if (hasParentTransition(this.$vnode)) return rawChild
      var child = getRealChild(rawChild)
      if (!child) return rawChild
      if (this._leaving) return placeholder(h, rawChild)
      var id = '__transition-' + this._uid + '-'
      child.key =
        child.key == null
          ? child.isComment
            ? id + 'comment'
            : id + child.tag
          : isPrimitive(child.key)
          ? String(child.key).indexOf(id) === 0
            ? child.key
            : id + child.key
          : child.key
      var data = ((child.data || (child.data = {})).transition =
        extractTransitionData(this))
      var oldRawChild = this._vnode
      var oldChild = getRealChild(oldRawChild)
      if (
        child.data.directives &&
        child.data.directives.some(function (d) {
          return d.name === 'show'
        })
      )
        child.data.show = true
      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        !(
          oldChild.componentInstance &&
          oldChild.componentInstance._vnode.isComment
        )
      ) {
        var oldData = (oldChild.data.transition = extend({}, data))
        if (mode === 'out-in') {
          this._leaving = true
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false
            this$1.$forceUpdate()
          })
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) return oldRawChild
          var delayedLeave
          var performLeave = function () {
            delayedLeave()
          }
          mergeVNodeHook(data, 'afterEnter', performLeave)
          mergeVNodeHook(data, 'enterCancelled', performLeave)
          mergeVNodeHook(oldData, 'delayLeave', function (leave) {
            delayedLeave = leave
          })
        }
      }
      return rawChild
    }
  }
  let props = extend({ tag: String, moveClass: String }, transitionProps)
  delete props.mode
  let TransitionGroup = {
    props: props,
    render: function render(h) {
      var tag = this.tag || this.$vnode.data.tag || 'span'
      var map = Object.create(null)
      var prevChildren = (this.prevChildren = this.children)
      var rawChildren = this.$slots.default || []
      var children = (this.children = [])
      var transitionData = extractTransitionData(this)
      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i]
        if (c.tag)
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c)
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData
          } else {
            var opts = c.componentOptions
            var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag
            warn(
              '\x3ctransition-group\x3e children must be keyed: \x3c' +
                name +
                '\x3e'
            )
          }
      }
      if (prevChildren) {
        var kept = []
        var removed = []
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1]
          c$1.data.transition = transitionData
          c$1.data.pos = c$1.elm.getBoundingClientRect()
          if (map[c$1.key]) kept.push(c$1)
          else removed.push(c$1)
        }
        this.kept = h(tag, null, kept)
        this.removed = removed
      }
      return h(tag, null, children)
    },
    beforeUpdate: function beforeUpdate() {
      this.__patch__(this._vnode, this.kept, false, true)
      this._vnode = this.kept
    },
    updated: function updated() {
      var children = this.prevChildren
      var moveClass = this.moveClass || (this.name || 'v') + '-move'
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) return
      children.forEach(callPendingCbs)
      children.forEach(recordPosition)
      children.forEach(applyTranslation)
      this._reflow = document.body.offsetHeight
      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm
          var s = el.style
          addTransitionClass(el, moveClass)
          s.transform = s.WebkitTransform = s.transitionDuration = ''
          el.addEventListener(
            transitionEndEvent,
            (el._moveCb = function cb(e) {
              if (!e || /transform$/.test(e.propertyName)) {
                el.removeEventListener(transitionEndEvent, cb)
                el._moveCb = null
                removeTransitionClass(el, moveClass)
              }
            })
          )
        }
      })
    },
    methods: {
      hasMove: function hasMove(el, moveClass) {
        if (!hasTransition) return false
        if (this._hasMove) return this._hasMove
        var clone = el.cloneNode()
        if (el._transitionClasses)
          el._transitionClasses.forEach(function (cls) {
            removeClass(clone, cls)
          })
        addClass(clone, moveClass)
        clone.style.display = 'none'
        this.$el.appendChild(clone)
        var info = getTransitionInfo(clone)
        this.$el.removeChild(clone)
        return (this._hasMove = info.hasTransform)
      }
    }
  }
  function callPendingCbs(c) {
    if (c.elm._moveCb) c.elm._moveCb()
    if (c.elm._enterCb) c.elm._enterCb()
  }
  function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect()
  }
  function applyTranslation(c) {
    let oldPos = c.data.pos
    let newPos = c.data.newPos
    let dx = oldPos.left - newPos.left
    let dy = oldPos.top - newPos.top
    if (dx || dy) {
      c.data.moved = true
      let s = c.elm.style
      s.transform = s.WebkitTransform = 'translate(' + dx + 'px,' + dy + 'px)'
      s.transitionDuration = '0s'
    }
  }
  let platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  }
  Vue.config.mustUseProp = mustUseProp
  Vue.config.isReservedTag = isReservedTag
  Vue.config.isReservedAttr = isReservedAttr
  Vue.config.getTagNamespace = getTagNamespace
  Vue.config.isUnknownElement = isUnknownElement
  extend(Vue.options.directives, platformDirectives)
  extend(Vue.options.components, platformComponents)
  Vue.prototype.__patch__ = inBrowser ? patch : noop
  Vue.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el, hydrating)
  }
  if (inBrowser)
    setTimeout(function () {
      if (config.devtools)
        if (devtools) devtools.emit('init', Vue)
        else if (
          'development' !== 'production' &&
          'development' !== 'test' &&
          isChrome
        )
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
              'https://github.com/vuejs/vue-devtools'
          )
      if (
        'development' !== 'production' &&
        'development' !== 'test' &&
        config.productionTip !== false &&
        typeof console !== 'undefined'
      )
        console[console.info ? 'info' : 'log'](
          'You are running Vue in development mode.\n' +
            'Make sure to turn on production mode when deploying for production.\n' +
            'See more tips at https://vuejs.org/guide/deployment.html'
        )
    }, 0)
  let defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
  let regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
  let buildRegex = cached(function (delimiters) {
    let open = delimiters[0].replace(regexEscapeRE, '\\$\x26')
    let close = delimiters[1].replace(regexEscapeRE, '\\$\x26')
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
  })
  function parseText(text, delimiters) {
    let tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
    if (!tagRE.test(text)) return
    let tokens = []
    let rawTokens = []
    let lastIndex = (tagRE.lastIndex = 0)
    let match, index, tokenValue
    while ((match = tagRE.exec(text))) {
      index = match.index
      if (index > lastIndex) {
        rawTokens.push((tokenValue = text.slice(lastIndex, index)))
        tokens.push(JSON.stringify(tokenValue))
      }
      let exp = parseFilters(match[1].trim())
      tokens.push('_s(' + exp + ')')
      rawTokens.push({ '@binding': exp })
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      rawTokens.push((tokenValue = text.slice(lastIndex)))
      tokens.push(JSON.stringify(tokenValue))
    }
    return { expression: tokens.join('+'), tokens: rawTokens }
  }
  function transformNode(el, options) {
    let warn = options.warn || baseWarn
    let staticClass = getAndRemoveAttr(el, 'class')
    if ('development' !== 'production' && staticClass) {
      let res = parseText(staticClass, options.delimiters)
      if (res)
        warn(
          'class\x3d"' +
            staticClass +
            '": ' +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of \x3cdiv class\x3d"{{ val }}"\x3e, use \x3cdiv :class\x3d"val"\x3e.'
        )
    }
    if (staticClass) el.staticClass = JSON.stringify(staticClass)
    let classBinding = getBindingAttr(el, 'class', false)
    if (classBinding) el.classBinding = classBinding
  }
  function genData(el) {
    let data = ''
    if (el.staticClass) data += 'staticClass:' + el.staticClass + ','
    if (el.classBinding) data += 'class:' + el.classBinding + ','
    return data
  }
  let klass$1 = {
    staticKeys: ['staticClass'],
    transformNode: transformNode,
    genData: genData
  }
  function transformNode$1(el, options) {
    let warn = options.warn || baseWarn
    let staticStyle = getAndRemoveAttr(el, 'style')
    if (staticStyle) {
      let res = parseText(staticStyle, options.delimiters)
      if (res)
        warn(
          'style\x3d"' +
            staticStyle +
            '": ' +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of \x3cdiv style\x3d"{{ val }}"\x3e, use \x3cdiv :style\x3d"val"\x3e.'
        )
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle))
    }
    let styleBinding = getBindingAttr(el, 'style', false)
    if (styleBinding) el.styleBinding = styleBinding
  }
  function genData$1(el) {
    let data = ''
    if (el.staticStyle) data += 'staticStyle:' + el.staticStyle + ','
    if (el.styleBinding) data += 'style:(' + el.styleBinding + '),'
    return data
  }
  let style$1 = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode$1,
    genData: genData$1
  }
  let decoder
  let he = {
    decode: function decode(html) {
      decoder = decoder || document.createElement('div')
      decoder.innerHTML = html
      return decoder.textContent
    }
  }
  let isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
      'link,meta,param,source,track,wbr'
  )
  let canBeLeftOpenTag = makeMap(
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
  )
  let isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
      'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
      'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
      'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
      'title,tr,track'
  )
  let attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
  let ncname = '[a-zA-Z_][\\w\\-\\.]*'
  let qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
  let startTagOpen = new RegExp('^\x3c' + qnameCapture)
  let startTagClose = /^\s*(\/?)>/
  let endTag = new RegExp('^\x3c\\/' + qnameCapture + '[^\x3e]*\x3e')
  let doctype = /^<!DOCTYPE [^>]+>/i
  let comment = /^<!\--/
  let conditionalComment = /^<!\[/
  let IS_REGEX_CAPTURING_BROKEN = false
  'x'.replace(/x(.)?/g, function (m, g) {
    IS_REGEX_CAPTURING_BROKEN = g === ''
  })
  let isPlainTextElement = makeMap('script,style,textarea', true)
  let reCache = {}
  let decodingMap = {
    '\x26lt;': '\x3c',
    '\x26gt;': '\x3e',
    '\x26quot;': '"',
    '\x26amp;': '\x26',
    '\x26#10;': '\n',
    '\x26#9;': '\t'
  }
  let encodedAttr = /&(?:lt|gt|quot|amp);/g
  let encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g
  let isIgnoreNewlineTag = makeMap('pre,textarea', true)
  let shouldIgnoreFirstNewline = function (tag, html) {
    return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'
  }
  function decodeAttr(value, shouldDecodeNewlines) {
    let re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
    return value.replace(re, function (match) {
      return decodingMap[match]
    })
  }
  function parseHTML(html, options) {
    let stack = []
    let expectHTML = options.expectHTML
    let isUnaryTag$$1 = options.isUnaryTag || no
    let canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no
    let index = 0
    let last, lastTag
    while (html) {
      last = html
      if (!lastTag || !isPlainTextElement(lastTag)) {
        let textEnd = html.indexOf('\x3c')
        if (textEnd === 0) {
          if (comment.test(html)) {
            let commentEnd = html.indexOf('--\x3e')
            if (commentEnd >= 0) {
              if (options.shouldKeepComment)
                options.comment(html.substring(4, commentEnd))
              advance(commentEnd + 3)
              continue
            }
          }
          if (conditionalComment.test(html)) {
            let conditionalEnd = html.indexOf(']\x3e')
            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2)
              continue
            }
          }
          let doctypeMatch = html.match(doctype)
          if (doctypeMatch) {
            advance(doctypeMatch[0].length)
            continue
          }
          let endTagMatch = html.match(endTag)
          if (endTagMatch) {
            let curIndex = index
            advance(endTagMatch[0].length)
            parseEndTag(endTagMatch[1], curIndex, index)
            continue
          }
          let startTagMatch = parseStartTag()
          if (startTagMatch) {
            handleStartTag(startTagMatch)
            if (shouldIgnoreFirstNewline(lastTag, html)) advance(1)
            continue
          }
        }
        let text = void 0,
          rest = void 0,
          next = void 0
        if (textEnd >= 0) {
          rest = html.slice(textEnd)
          while (
            !endTag.test(rest) &&
            !startTagOpen.test(rest) &&
            !comment.test(rest) &&
            !conditionalComment.test(rest)
          ) {
            next = rest.indexOf('\x3c', 1)
            if (next < 0) break
            textEnd += next
            rest = html.slice(textEnd)
          }
          text = html.substring(0, textEnd)
          advance(textEnd)
        }
        if (textEnd < 0) {
          text = html
          html = ''
        }
        if (options.chars && text) options.chars(text)
      } else {
        let endTagLength = 0
        let stackedTag = lastTag.toLowerCase()
        let reStackedTag =
          reCache[stackedTag] ||
          (reCache[stackedTag] = new RegExp(
            '([\\s\\S]*?)(\x3c/' + stackedTag + '[^\x3e]*\x3e)',
            'i'
          ))
        let rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length
          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript')
            text = text
              .replace(/<!\--([\s\S]*?)--\x3e/g, '$1')
              .replace(/<!\[CDATA\[([\s\S]*?)]]\x3e/g, '$1')
          if (shouldIgnoreFirstNewline(stackedTag, text)) text = text.slice(1)
          if (options.chars) options.chars(text)
          return ''
        })
        index += html.length - rest$1.length
        html = rest$1
        parseEndTag(stackedTag, index - endTagLength, index)
      }
      if (html === last) {
        options.chars && options.chars(html)
        if ('development' !== 'production' && !stack.length && options.warn)
          options.warn('Mal-formatted tag at end of template: "' + html + '"')
        break
      }
    }
    parseEndTag()
    function advance(n) {
      index += n
      html = html.substring(n)
    }
    function parseStartTag() {
      let start = html.match(startTagOpen)
      if (start) {
        let match = { tagName: start[1], attrs: [], start: index }
        advance(start[0].length)
        let end, attr
        while (
          !(end = html.match(startTagClose)) &&
          (attr = html.match(attribute))
        ) {
          advance(attr[0].length)
          match.attrs.push(attr)
        }
        if (end) {
          match.unarySlash = end[1]
          advance(end[0].length)
          match.end = index
          return match
        }
      }
    }
    function handleStartTag(match) {
      let tagName = match.tagName
      let unarySlash = match.unarySlash
      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) parseEndTag(lastTag)
        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName)
          parseEndTag(tagName)
      }
      let unary = isUnaryTag$$1(tagName) || !!unarySlash
      let l = match.attrs.length
      let attrs = new Array(l)
      for (let i = 0; i < l; i++) {
        let args = match.attrs[i]
        if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
          if (args[3] === '') delete args[3]
          if (args[4] === '') delete args[4]
          if (args[5] === '') delete args[5]
        }
        let value = args[3] || args[4] || args[5] || ''
        let shouldDecodeNewlines =
          tagName === 'a' && args[1] === 'href'
            ? options.shouldDecodeNewlinesForHref
            : options.shouldDecodeNewlines
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        }
      }
      if (!unary) {
        stack.push({
          tag: tagName,
          lowerCasedTag: tagName.toLowerCase(),
          attrs: attrs
        })
        lastTag = tagName
      }
      if (options.start)
        options.start(tagName, attrs, unary, match.start, match.end)
    }
    function parseEndTag(tagName, start, end) {
      let pos, lowerCasedTagName
      if (start == null) start = index
      if (end == null) end = index
      if (tagName) lowerCasedTagName = tagName.toLowerCase()
      if (tagName)
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) break
        }
      else pos = 0
      if (pos >= 0) {
        for (let i = stack.length - 1; i >= pos; i--) {
          if (
            'development' !== 'production' &&
            (i > pos || !tagName) &&
            options.warn
          )
            options.warn(
              'tag \x3c' + stack[i].tag + '\x3e has no matching end tag.'
            )
          if (options.end) options.end(stack[i].tag, start, end)
        }
        stack.length = pos
        lastTag = pos && stack[pos - 1].tag
      } else if (lowerCasedTagName === 'br') {
        if (options.start) options.start(tagName, [], true, start, end)
      } else if (lowerCasedTagName === 'p') {
        if (options.start) options.start(tagName, [], false, start, end)
        if (options.end) options.end(tagName, start, end)
      }
    }
  }
  let onRE = /^@|^v-on:/
  let dirRE = /^v-|^@|^:/
  let forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
  let stripParensRE = /^\(|\)$/g
  let argRE = /:(.*)$/
  let bindRE = /^:|^v-bind:/
  let modifierRE = /\.[^.]+/g
  let decodeHTMLCached = cached(he.decode)
  let warn$2
  let delimiters
  let transforms
  let preTransforms
  let postTransforms
  let platformIsPreTag
  let platformMustUseProp
  let platformGetTagNamespace
  function createASTElement(tag, attrs, parent) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      parent: parent,
      children: []
    }
  }
  function parse(template, options) {
    warn$2 = options.warn || baseWarn
    platformIsPreTag = options.isPreTag || no
    platformMustUseProp = options.mustUseProp || no
    platformGetTagNamespace = options.getTagNamespace || no
    transforms = pluckModuleFunction(options.modules, 'transformNode')
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')
    delimiters = options.delimiters
    let stack = []
    let preserveWhitespace = options.preserveWhitespace !== false
    let root
    let currentParent
    let inVPre = false
    let inPre = false
    let warned = false
    function warnOnce(msg) {
      if (!warned) {
        warned = true
        warn$2(msg)
      }
    }
    function closeElement(element) {
      if (element.pre) inVPre = false
      if (platformIsPreTag(element.tag)) inPre = false
      for (let i = 0; i < postTransforms.length; i++)
        postTransforms[i](element, options)
    }
    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      canBeLeftOpenTag: options.canBeLeftOpenTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
      shouldKeepComment: options.comments,
      start: function start(tag, attrs, unary) {
        let ns =
          (currentParent && currentParent.ns) || platformGetTagNamespace(tag)
        if (isIE && ns === 'svg') attrs = guardIESVGBug(attrs)
        let element = createASTElement(tag, attrs, currentParent)
        if (ns) element.ns = ns
        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true
          'development' !== 'production' &&
            warn$2(
              'Templates should only be responsible for mapping the state to the ' +
                'UI. Avoid placing tags with side-effects in your templates, such as ' +
                '\x3c' +
                tag +
                '\x3e' +
                ', as they will not be parsed.'
            )
        }
        for (let i = 0; i < preTransforms.length; i++)
          element = preTransforms[i](element, options) || element
        if (!inVPre) {
          processPre(element)
          if (element.pre) inVPre = true
        }
        if (platformIsPreTag(element.tag)) inPre = true
        if (inVPre) processRawAttrs(element)
        else if (!element.processed) {
          processFor(element)
          processIf(element)
          processOnce(element)
          processElement(element, options)
        }
        function checkRootConstraints(el) {
          if (el.tag === 'slot' || el.tag === 'template')
            warnOnce(
              'Cannot use \x3c' +
                el.tag +
                '\x3e as component root element because it may ' +
                'contain multiple nodes.'
            )
          if (el.attrsMap.hasOwnProperty('v-for'))
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
                'it renders multiple elements.'
            )
        }
        if (!root) {
          root = element
          checkRootConstraints(root)
        } else if (!stack.length)
          if (root.if && (element.elseif || element.else)) {
            checkRootConstraints(element)
            addIfCondition(root, { exp: element.elseif, block: element })
          } else
            warnOnce(
              'Component template should contain exactly one root element. ' +
                'If you are using v-if on multiple elements, ' +
                'use v-else-if to chain them instead.'
            )
        if (currentParent && !element.forbidden)
          if (element.elseif || element.else)
            processIfConditions(element, currentParent)
          else if (element.slotScope) {
            currentParent.plain = false
            var name = element.slotTarget || '"default"'
            ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[
              name
            ] = element
          } else {
            currentParent.children.push(element)
            element.parent = currentParent
          }
        if (!unary) {
          currentParent = element
          stack.push(element)
        } else closeElement(element)
      },
      end: function end() {
        let element = stack[stack.length - 1]
        let lastNode = element.children[element.children.length - 1]
        if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre)
          element.children.pop()
        stack.length -= 1
        currentParent = stack[stack.length - 1]
        closeElement(element)
      },
      chars: function chars(text) {
        if (!currentParent) {
          if (text === template)
            warnOnce(
              'Component template requires a root element, rather than just text.'
            )
          else if ((text = text.trim()))
            warnOnce(
              'text "' + text + '" outside root element will be ignored.'
            )
          return
        }
        if (
          isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text
        )
          return
        let children = currentParent.children
        text =
          inPre || text.trim()
            ? isTextTag(currentParent)
              ? text
              : decodeHTMLCached(text)
            : preserveWhitespace && children.length
            ? ' '
            : ''
        if (text) {
          let res
          if (!inVPre && text !== ' ' && (res = parseText(text, delimiters)))
            children.push({
              type: 2,
              expression: res.expression,
              tokens: res.tokens,
              text: text
            })
          else if (
            text !== ' ' ||
            !children.length ||
            children[children.length - 1].text !== ' '
          )
            children.push({ type: 3, text: text })
        }
      },
      comment: function comment(text) {
        currentParent.children.push({ type: 3, text: text, isComment: true })
      }
    })
    return root
  }
  function processPre(el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) el.pre = true
  }
  function processRawAttrs(el) {
    let l = el.attrsList.length
    if (l) {
      let attrs = (el.attrs = new Array(l))
      for (let i = 0; i < l; i++)
        attrs[i] = {
          name: el.attrsList[i].name,
          value: JSON.stringify(el.attrsList[i].value)
        }
    } else if (!el.pre) el.plain = true
  }
  function processElement(element, options) {
    processKey(element)
    element.plain = !element.key && !element.attrsList.length
    processRef(element)
    processSlot(element)
    processComponent(element)
    for (let i = 0; i < transforms.length; i++)
      element = transforms[i](element, options) || element
    processAttrs(element)
  }
  function processKey(el) {
    let exp = getBindingAttr(el, 'key')
    if (exp) {
      if ('development' !== 'production' && el.tag === 'template')
        warn$2(
          '\x3ctemplate\x3e cannot be keyed. Place the key on real elements instead.'
        )
      el.key = exp
    }
  }
  function processRef(el) {
    let ref = getBindingAttr(el, 'ref')
    if (ref) {
      el.ref = ref
      el.refInFor = checkInFor(el)
    }
  }
  function processFor(el) {
    let exp
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      let res = parseFor(exp)
      if (res) extend(el, res)
      else warn$2('Invalid v-for expression: ' + exp)
    }
  }
  function parseFor(exp) {
    let inMatch = exp.match(forAliasRE)
    if (!inMatch) return
    let res = {}
    res.for = inMatch[2].trim()
    let alias = inMatch[1].trim().replace(stripParensRE, '')
    let iteratorMatch = alias.match(forIteratorRE)
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '')
      res.iterator1 = iteratorMatch[1].trim()
      if (iteratorMatch[2]) res.iterator2 = iteratorMatch[2].trim()
    } else res.alias = alias
    return res
  }
  function processIf(el) {
    let exp = getAndRemoveAttr(el, 'v-if')
    if (exp) {
      el.if = exp
      addIfCondition(el, { exp: exp, block: el })
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) el.else = true
      let elseif = getAndRemoveAttr(el, 'v-else-if')
      if (elseif) el.elseif = elseif
    }
  }
  function processIfConditions(el, parent) {
    let prev = findPrevElement(parent.children)
    if (prev && prev.if) addIfCondition(prev, { exp: el.elseif, block: el })
    else
      warn$2(
        'v-' +
          (el.elseif ? 'else-if\x3d"' + el.elseif + '"' : 'else') +
          ' ' +
          'used on element \x3c' +
          el.tag +
          '\x3e without corresponding v-if.'
      )
  }
  function findPrevElement(children) {
    let i = children.length
    while (i--)
      if (children[i].type === 1) return children[i]
      else {
        if ('development' !== 'production' && children[i].text !== ' ')
          warn$2(
            'text "' +
              children[i].text.trim() +
              '" between v-if and v-else(-if) ' +
              'will be ignored.'
          )
        children.pop()
      }
  }
  function addIfCondition(el, condition) {
    if (!el.ifConditions) el.ifConditions = []
    el.ifConditions.push(condition)
  }
  function processOnce(el) {
    let once$$1 = getAndRemoveAttr(el, 'v-once')
    if (once$$1 != null) el.once = true
  }
  function processSlot(el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name')
      if ('development' !== 'production' && el.key)
        warn$2(
          '`key` does not work on \x3cslot\x3e because slots are abstract outlets ' +
            'and can possibly expand into multiple elements. ' +
            'Use the key on a wrapping element instead.'
        )
    } else {
      let slotScope
      if (el.tag === 'template') {
        slotScope = getAndRemoveAttr(el, 'scope')
        if ('development' !== 'production' && slotScope)
          warn$2(
            'the "scope" attribute for scoped slots have been deprecated and ' +
              'replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ' +
              'can also be used on plain elements in addition to \x3ctemplate\x3e to ' +
              'denote scoped slots.',
            true
          )
        el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
      } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
        if ('development' !== 'production' && el.attrsMap['v-for'])
          warn$2(
            'Ambiguous combined usage of slot-scope and v-for on \x3c' +
              el.tag +
              '\x3e ' +
              '(v-for takes higher priority). Use a wrapper \x3ctemplate\x3e for the ' +
              'scoped slot to make it clearer.',
            true
          )
        el.slotScope = slotScope
      }
      let slotTarget = getBindingAttr(el, 'slot')
      if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
        if (el.tag !== 'template' && !el.slotScope)
          addAttr(el, 'slot', slotTarget)
      }
    }
  }
  function processComponent(el) {
    let binding
    if ((binding = getBindingAttr(el, 'is'))) el.component = binding
    if (getAndRemoveAttr(el, 'inline-template') != null)
      el.inlineTemplate = true
  }
  function processAttrs(el) {
    let list = el.attrsList
    let i, l, name, rawName, value, modifiers, isProp
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name
      value = list[i].value
      if (dirRE.test(name)) {
        el.hasBindings = true
        modifiers = parseModifiers(name)
        if (modifiers) name = name.replace(modifierRE, '')
        if (bindRE.test(name)) {
          name = name.replace(bindRE, '')
          value = parseFilters(value)
          isProp = false
          if (modifiers) {
            if (modifiers.prop) {
              isProp = true
              name = camelize(name)
              if (name === 'innerHtml') name = 'innerHTML'
            }
            if (modifiers.camel) name = camelize(name)
            if (modifiers.sync)
              addHandler(
                el,
                'update:' + camelize(name),
                genAssignmentCode(value, '$event')
              )
          }
          if (
            isProp ||
            (!el.component &&
              platformMustUseProp(el.tag, el.attrsMap.type, name))
          )
            addProp(el, name, value)
          else addAttr(el, name, value)
        } else if (onRE.test(name)) {
          name = name.replace(onRE, '')
          addHandler(el, name, value, modifiers, false, warn$2)
        } else {
          name = name.replace(dirRE, '')
          let argMatch = name.match(argRE)
          let arg = argMatch && argMatch[1]
          if (arg) name = name.slice(0, -(arg.length + 1))
          addDirective(el, name, rawName, value, arg, modifiers)
          if ('development' !== 'production' && name === 'model')
            checkForAliasModel(el, value)
        }
      } else {
        let res = parseText(value, delimiters)
        if (res)
          warn$2(
            name +
              '\x3d"' +
              value +
              '": ' +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of \x3cdiv id\x3d"{{ val }}"\x3e, use \x3cdiv :id\x3d"val"\x3e.'
          )
        addAttr(el, name, JSON.stringify(value))
        if (
          !el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)
        )
          addProp(el, name, 'true')
      }
    }
  }
  function checkInFor(el) {
    let parent = el
    while (parent) {
      if (parent.for !== undefined) return true
      parent = parent.parent
    }
    return false
  }
  function parseModifiers(name) {
    let match = name.match(modifierRE)
    if (match) {
      let ret = {}
      match.forEach(function (m) {
        ret[m.slice(1)] = true
      })
      return ret
    }
  }
  function makeAttrsMap(attrs) {
    let map = {}
    for (let i = 0, l = attrs.length; i < l; i++) {
      if (
        'development' !== 'production' &&
        map[attrs[i].name] &&
        !isIE &&
        !isEdge
      )
        warn$2('duplicate attribute: ' + attrs[i].name)
      map[attrs[i].name] = attrs[i].value
    }
    return map
  }
  function isTextTag(el) {
    return el.tag === 'script' || el.tag === 'style'
  }
  function isForbiddenTag(el) {
    return (
      el.tag === 'style' ||
      (el.tag === 'script' &&
        (!el.attrsMap.type || el.attrsMap.type === 'text/javascript'))
    )
  }
  let ieNSBug = /^xmlns:NS\d+/
  let ieNSPrefix = /^NS\d+:/
  function guardIESVGBug(attrs) {
    let res = []
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i]
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '')
        res.push(attr)
      }
    }
    return res
  }
  function checkForAliasModel(el, value) {
    let _el = el
    while (_el) {
      if (_el.for && _el.alias === value)
        warn$2(
          '\x3c' +
            el.tag +
            ' v-model\x3d"' +
            value +
            '"\x3e: ' +
            'You are binding v-model directly to a v-for iteration alias. ' +
            'This will not be able to modify the v-for source array because ' +
            'writing to the alias is like modifying a function local variable. ' +
            'Consider using an array of objects and use v-model on an object property instead.'
        )
      _el = _el.parent
    }
  }
  function preTransformNode(el, options) {
    if (el.tag === 'input') {
      let map = el.attrsMap
      if (!map['v-model']) return
      let typeBinding
      if (map[':type'] || map['v-bind:type'])
        typeBinding = getBindingAttr(el, 'type')
      if (!typeBinding && map['v-bind'])
        typeBinding = '(' + map['v-bind'] + ').type'
      if (typeBinding) {
        let ifCondition = getAndRemoveAttr(el, 'v-if', true)
        let ifConditionExtra = ifCondition
          ? '\x26\x26(' + ifCondition + ')'
          : ''
        let hasElse = getAndRemoveAttr(el, 'v-else', true) != null
        let elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true)
        let branch0 = cloneASTElement(el)
        processFor(branch0)
        addRawAttr(branch0, 'type', 'checkbox')
        processElement(branch0, options)
        branch0.processed = true
        branch0.if =
          '(' + typeBinding + ")\x3d\x3d\x3d'checkbox'" + ifConditionExtra
        addIfCondition(branch0, { exp: branch0.if, block: branch0 })
        let branch1 = cloneASTElement(el)
        getAndRemoveAttr(branch1, 'v-for', true)
        addRawAttr(branch1, 'type', 'radio')
        processElement(branch1, options)
        addIfCondition(branch0, {
          exp: '(' + typeBinding + ")\x3d\x3d\x3d'radio'" + ifConditionExtra,
          block: branch1
        })
        let branch2 = cloneASTElement(el)
        getAndRemoveAttr(branch2, 'v-for', true)
        addRawAttr(branch2, ':type', typeBinding)
        processElement(branch2, options)
        addIfCondition(branch0, { exp: ifCondition, block: branch2 })
        if (hasElse) branch0.else = true
        else if (elseIfCondition) branch0.elseif = elseIfCondition
        return branch0
      }
    }
  }
  function cloneASTElement(el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
  }
  let model$2 = { preTransformNode: preTransformNode }
  let modules$1 = [klass$1, style$1, model$2]
  function text(el, dir) {
    if (dir.value) addProp(el, 'textContent', '_s(' + dir.value + ')')
  }
  function html(el, dir) {
    if (dir.value) addProp(el, 'innerHTML', '_s(' + dir.value + ')')
  }
  let directives$1 = { model: model, text: text, html: html }
  let baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  }
  let isStaticKey
  let isPlatformReservedTag
  let genStaticKeysCached = cached(genStaticKeys$1)
  function optimize(root, options) {
    if (!root) return
    isStaticKey = genStaticKeysCached(options.staticKeys || '')
    isPlatformReservedTag = options.isReservedTag || no
    markStatic$1(root)
    markStaticRoots(root, false)
  }
  function genStaticKeys$1(keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
        (keys ? ',' + keys : '')
    )
  }
  function markStatic$1(node) {
    node.static = isStatic(node)
    if (node.type === 1) {
      if (
        !isPlatformReservedTag(node.tag) &&
        node.tag !== 'slot' &&
        node.attrsMap['inline-template'] == null
      )
        return
      for (let i = 0, l = node.children.length; i < l; i++) {
        let child = node.children[i]
        markStatic$1(child)
        if (!child.static) node.static = false
      }
      if (node.ifConditions)
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          var block = node.ifConditions[i$1].block
          markStatic$1(block)
          if (!block.static) node.static = false
        }
    }
  }
  function markStaticRoots(node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) node.staticInFor = isInFor
      if (
        node.static &&
        node.children.length &&
        !(node.children.length === 1 && node.children[0].type === 3)
      ) {
        node.staticRoot = true
        return
      } else node.staticRoot = false
      if (node.children)
        for (var i = 0, l = node.children.length; i < l; i++)
          markStaticRoots(node.children[i], isInFor || !!node.for)
      if (node.ifConditions)
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++)
          markStaticRoots(node.ifConditions[i$1].block, isInFor)
    }
  }
  function isStatic(node) {
    if (node.type === 2) return false
    if (node.type === 3) return true
    return !!(
      node.pre ||
      (!node.hasBindings &&
        !node.if &&
        !node.for &&
        !isBuiltInTag(node.tag) &&
        isPlatformReservedTag(node.tag) &&
        !isDirectChildOfTemplateFor(node) &&
        Object.keys(node).every(isStaticKey))
    )
  }
  function isDirectChildOfTemplateFor(node) {
    while (node.parent) {
      node = node.parent
      if (node.tag !== 'template') return false
      if (node.for) return true
    }
    return false
  }
  let fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/
  let simplePathRE =
    /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/
  let keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    delete: [8, 46]
  }
  let keyNames = {
    esc: 'Escape',
    tab: 'Tab',
    enter: 'Enter',
    space: ' ',
    up: 'ArrowUp',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    down: 'ArrowDown',
    delete: ['Backspace', 'Delete']
  }
  let genGuard = function (condition) {
    return 'if(' + condition + ')return null;'
  }
  let modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard('$event.target !\x3d\x3d $event.currentTarget'),
    ctrl: genGuard('!$event.ctrlKey'),
    shift: genGuard('!$event.shiftKey'),
    alt: genGuard('!$event.altKey'),
    meta: genGuard('!$event.metaKey'),
    left: genGuard("'button' in $event \x26\x26 $event.button !\x3d\x3d 0"),
    middle: genGuard("'button' in $event \x26\x26 $event.button !\x3d\x3d 1"),
    right: genGuard("'button' in $event \x26\x26 $event.button !\x3d\x3d 2")
  }
  function genHandlers(events, isNative, warn) {
    let res = isNative ? 'nativeOn:{' : 'on:{'
    for (let name in events)
      res += '"' + name + '":' + genHandler(name, events[name]) + ','
    return res.slice(0, -1) + '}'
  }
  function genHandler(name, handler) {
    if (!handler) return 'function(){}'
    if (Array.isArray(handler))
      return (
        '[' +
        handler
          .map(function (handler) {
            return genHandler(name, handler)
          })
          .join(',') +
        ']'
      )
    let isMethodPath = simplePathRE.test(handler.value)
    let isFunctionExpression = fnExpRE.test(handler.value)
    if (!handler.modifiers) {
      if (isMethodPath || isFunctionExpression) return handler.value
      return 'function($event){' + handler.value + '}'
    } else {
      let code = ''
      let genModifierCode = ''
      let keys = []
      for (let key in handler.modifiers)
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key]
          if (keyCodes[key]) keys.push(key)
        } else if (key === 'exact') {
          var modifiers = handler.modifiers
          genModifierCode += genGuard(
            ['ctrl', 'shift', 'alt', 'meta']
              .filter(function (keyModifier) {
                return !modifiers[keyModifier]
              })
              .map(function (keyModifier) {
                return '$event.' + keyModifier + 'Key'
              })
              .join('||')
          )
        } else keys.push(key)
      if (keys.length) code += genKeyFilter(keys)
      if (genModifierCode) code += genModifierCode
      let handlerCode = isMethodPath
        ? 'return ' + handler.value + '($event)'
        : isFunctionExpression
        ? 'return (' + handler.value + ')($event)'
        : handler.value
      return 'function($event){' + code + handlerCode + '}'
    }
  }
  function genKeyFilter(keys) {
    return (
      "if(!('button' in $event)\x26\x26" +
      keys.map(genFilterCode).join('\x26\x26') +
      ')return null;'
    )
  }
  function genFilterCode(key) {
    let keyVal = parseInt(key, 10)
    if (keyVal) return '$event.keyCode!\x3d\x3d' + keyVal
    let keyCode = keyCodes[key]
    let keyName = keyNames[key]
    return (
      '_k($event.keyCode,' +
      JSON.stringify(key) +
      ',' +
      JSON.stringify(keyCode) +
      ',' +
      '$event.key,' +
      '' +
      JSON.stringify(keyName) +
      ')'
    )
  }
  function on(el, dir) {
    if ('development' !== 'production' && dir.modifiers)
      warn('v-on without argument does not support modifiers.')
    el.wrapListeners = function (code) {
      return '_g(' + code + ',' + dir.value + ')'
    }
  }
  function bind$1(el, dir) {
    el.wrapData = function (code) {
      return (
        '_b(' +
        code +
        ",'" +
        el.tag +
        "'," +
        dir.value +
        ',' +
        (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') +
        (dir.modifiers && dir.modifiers.sync ? ',true' : '') +
        ')'
      )
    }
  }
  let baseDirectives = { on: on, bind: bind$1, cloak: noop }
  let CodegenState = function CodegenState(options) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    this.directives = extend(extend({}, baseDirectives), options.directives)
    let isReservedTag = options.isReservedTag || no
    this.maybeComponent = function (el) {
      return !isReservedTag(el.tag)
    }
    this.onceId = 0
    this.staticRenderFns = []
  }
  function generate(ast, options) {
    let state = new CodegenState(options)
    let code = ast ? genElement(ast, state) : '_c("div")'
    return {
      render: 'with(this){return ' + code + '}',
      staticRenderFns: state.staticRenderFns
    }
  }
  function genElement(el, state) {
    if (el.staticRoot && !el.staticProcessed) return genStatic(el, state)
    else if (el.once && !el.onceProcessed) return genOnce(el, state)
    else if (el.for && !el.forProcessed) return genFor(el, state)
    else if (el.if && !el.ifProcessed) return genIf(el, state)
    else if (el.tag === 'template' && !el.slotTarget)
      return genChildren(el, state) || 'void 0'
    else if (el.tag === 'slot') return genSlot(el, state)
    else {
      let code
      if (el.component) code = genComponent(el.component, el, state)
      else {
        let data = el.plain ? undefined : genData$2(el, state)
        let children = el.inlineTemplate ? null : genChildren(el, state, true)
        code =
          "_c('" +
          el.tag +
          "'" +
          (data ? ',' + data : '') +
          (children ? ',' + children : '') +
          ')'
      }
      for (let i = 0; i < state.transforms.length; i++)
        code = state.transforms[i](el, code)
      return code
    }
  }
  function genStatic(el, state) {
    el.staticProcessed = true
    state.staticRenderFns.push(
      'with(this){return ' + genElement(el, state) + '}'
    )
    return (
      '_m(' +
      (state.staticRenderFns.length - 1) +
      (el.staticInFor ? ',true' : '') +
      ')'
    )
  }
  function genOnce(el, state) {
    el.onceProcessed = true
    if (el.if && !el.ifProcessed) return genIf(el, state)
    else if (el.staticInFor) {
      let key = ''
      let parent = el.parent
      while (parent) {
        if (parent.for) {
          key = parent.key
          break
        }
        parent = parent.parent
      }
      if (!key) {
        'development' !== 'production' &&
          state.warn('v-once can only be used inside v-for that is keyed. ')
        return genElement(el, state)
      }
      return (
        '_o(' + genElement(el, state) + ',' + state.onceId++ + ',' + key + ')'
      )
    } else return genStatic(el, state)
  }
  function genIf(el, state, altGen, altEmpty) {
    el.ifProcessed = true
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }
  function genIfConditions(conditions, state, altGen, altEmpty) {
    if (!conditions.length) return altEmpty || '_e()'
    let condition = conditions.shift()
    if (condition.exp)
      return (
        '(' +
        condition.exp +
        ')?' +
        genTernaryExp(condition.block) +
        ':' +
        genIfConditions(conditions, state, altGen, altEmpty)
      )
    else return '' + genTernaryExp(condition.block)
    function genTernaryExp(el) {
      return altGen
        ? altGen(el, state)
        : el.once
        ? genOnce(el, state)
        : genElement(el, state)
    }
  }
  function genFor(el, state, altGen, altHelper) {
    let exp = el.for
    let alias = el.alias
    let iterator1 = el.iterator1 ? ',' + el.iterator1 : ''
    let iterator2 = el.iterator2 ? ',' + el.iterator2 : ''
    if (
      'development' !== 'production' &&
      state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    )
      state.warn(
        '\x3c' +
          el.tag +
          ' v-for\x3d"' +
          alias +
          ' in ' +
          exp +
          '"\x3e: component lists rendered with ' +
          'v-for should have explicit keys. ' +
          'See https://vuejs.org/guide/list.html#key for more info.',
        true
      )
    el.forProcessed = true
    return (
      (altHelper || '_l') +
      '((' +
      exp +
      '),' +
      'function(' +
      alias +
      iterator1 +
      iterator2 +
      '){' +
      'return ' +
      (altGen || genElement)(el, state) +
      '})'
    )
  }
  function genData$2(el, state) {
    let data = '{'
    let dirs = genDirectives(el, state)
    if (dirs) data += dirs + ','
    if (el.key) data += 'key:' + el.key + ','
    if (el.ref) data += 'ref:' + el.ref + ','
    if (el.refInFor) data += 'refInFor:true,'
    if (el.pre) data += 'pre:true,'
    if (el.component) data += 'tag:"' + el.tag + '",'
    for (let i = 0; i < state.dataGenFns.length; i++)
      data += state.dataGenFns[i](el)
    if (el.attrs) data += 'attrs:{' + genProps(el.attrs) + '},'
    if (el.props) data += 'domProps:{' + genProps(el.props) + '},'
    if (el.events) data += genHandlers(el.events, false, state.warn) + ','
    if (el.nativeEvents)
      data += genHandlers(el.nativeEvents, true, state.warn) + ','
    if (el.slotTarget && !el.slotScope) data += 'slot:' + el.slotTarget + ','
    if (el.scopedSlots) data += genScopedSlots(el.scopedSlots, state) + ','
    if (el.model)
      data +=
        'model:{value:' +
        el.model.value +
        ',callback:' +
        el.model.callback +
        ',expression:' +
        el.model.expression +
        '},'
    if (el.inlineTemplate) {
      let inlineTemplate = genInlineTemplate(el, state)
      if (inlineTemplate) data += inlineTemplate + ','
    }
    data = data.replace(/,$/, '') + '}'
    if (el.wrapData) data = el.wrapData(data)
    if (el.wrapListeners) data = el.wrapListeners(data)
    return data
  }
  function genDirectives(el, state) {
    let dirs = el.directives
    if (!dirs) return
    let res = 'directives:['
    let hasRuntime = false
    let i, l, dir, needRuntime
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i]
      needRuntime = true
      let gen = state.directives[dir.name]
      if (gen) needRuntime = !!gen(el, dir, state.warn)
      if (needRuntime) {
        hasRuntime = true
        res +=
          '{name:"' +
          dir.name +
          '",rawName:"' +
          dir.rawName +
          '"' +
          (dir.value
            ? ',value:(' +
              dir.value +
              '),expression:' +
              JSON.stringify(dir.value)
            : '') +
          (dir.arg ? ',arg:"' + dir.arg + '"' : '') +
          (dir.modifiers ? ',modifiers:' + JSON.stringify(dir.modifiers) : '') +
          '},'
      }
    }
    if (hasRuntime) return res.slice(0, -1) + ']'
  }
  function genInlineTemplate(el, state) {
    let ast = el.children[0]
    if (
      'development' !== 'production' &&
      (el.children.length !== 1 || ast.type !== 1)
    )
      state.warn(
        'Inline-template components must have exactly one child element.'
      )
    if (ast.type === 1) {
      let inlineRenderFns = generate(ast, state.options)
      return (
        'inlineTemplate:{render:function(){' +
        inlineRenderFns.render +
        '},staticRenderFns:[' +
        inlineRenderFns.staticRenderFns
          .map(function (code) {
            return 'function(){' + code + '}'
          })
          .join(',') +
        ']}'
      )
    }
  }
  function genScopedSlots(slots, state) {
    return (
      'scopedSlots:_u([' +
      Object.keys(slots)
        .map(function (key) {
          return genScopedSlot(key, slots[key], state)
        })
        .join(',') +
      '])'
    )
  }
  function genScopedSlot(key, el, state) {
    if (el.for && !el.forProcessed) return genForScopedSlot(key, el, state)
    let fn =
      'function(' +
      String(el.slotScope) +
      '){' +
      'return ' +
      (el.tag === 'template'
        ? el.if
          ? el.if + '?' + (genChildren(el, state) || 'undefined') + ':undefined'
          : genChildren(el, state) || 'undefined'
        : genElement(el, state)) +
      '}'
    return '{key:' + key + ',fn:' + fn + '}'
  }
  function genForScopedSlot(key, el, state) {
    let exp = el.for
    let alias = el.alias
    let iterator1 = el.iterator1 ? ',' + el.iterator1 : ''
    let iterator2 = el.iterator2 ? ',' + el.iterator2 : ''
    el.forProcessed = true
    return (
      '_l((' +
      exp +
      '),' +
      'function(' +
      alias +
      iterator1 +
      iterator2 +
      '){' +
      'return ' +
      genScopedSlot(key, el, state) +
      '})'
    )
  }
  function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
    let children = el.children
    if (children.length) {
      let el$1 = children[0]
      if (
        children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot'
      )
        return (altGenElement || genElement)(el$1, state)
      let normalizationType = checkSkip
        ? getNormalizationType(children, state.maybeComponent)
        : 0
      let gen = altGenNode || genNode
      return (
        '[' +
        children
          .map(function (c) {
            return gen(c, state)
          })
          .join(',') +
        ']' +
        (normalizationType ? ',' + normalizationType : '')
      )
    }
  }
  function getNormalizationType(children, maybeComponent) {
    let res = 0
    for (let i = 0; i < children.length; i++) {
      let el = children[i]
      if (el.type !== 1) continue
      if (
        needsNormalization(el) ||
        (el.ifConditions &&
          el.ifConditions.some(function (c) {
            return needsNormalization(c.block)
          }))
      ) {
        res = 2
        break
      }
      if (
        maybeComponent(el) ||
        (el.ifConditions &&
          el.ifConditions.some(function (c) {
            return maybeComponent(c.block)
          }))
      )
        res = 1
    }
    return res
  }
  function needsNormalization(el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
  }
  function genNode(node, state) {
    if (node.type === 1) return genElement(node, state)
    if (node.type === 3 && node.isComment) return genComment(node)
    else return genText(node)
  }
  function genText(text) {
    return (
      '_v(' +
      (text.type === 2
        ? text.expression
        : transformSpecialNewlines(JSON.stringify(text.text))) +
      ')'
    )
  }
  function genComment(comment) {
    return '_e(' + JSON.stringify(comment.text) + ')'
  }
  function genSlot(el, state) {
    let slotName = el.slotName || '"default"'
    let children = genChildren(el, state)
    let res = '_t(' + slotName + (children ? ',' + children : '')
    let attrs =
      el.attrs &&
      '{' +
        el.attrs
          .map(function (a) {
            return camelize(a.name) + ':' + a.value
          })
          .join(',') +
        '}'
    let bind$$1 = el.attrsMap['v-bind']
    if ((attrs || bind$$1) && !children) res += ',null'
    if (attrs) res += ',' + attrs
    if (bind$$1) res += (attrs ? '' : ',null') + ',' + bind$$1
    return res + ')'
  }
  function genComponent(componentName, el, state) {
    let children = el.inlineTemplate ? null : genChildren(el, state, true)
    return (
      '_c(' +
      componentName +
      ',' +
      genData$2(el, state) +
      (children ? ',' + children : '') +
      ')'
    )
  }
  function genProps(props) {
    let res = ''
    for (let i = 0; i < props.length; i++) {
      let prop = props[i]
      res += '"' + prop.name + '":' + transformSpecialNewlines(prop.value) + ','
    }
    return res.slice(0, -1)
  }
  function transformSpecialNewlines(text) {
    return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  }
  let prohibitedKeywordRE = new RegExp(
    '\\b' +
      (
        'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
        'super,throw,while,yield,delete,export,import,return,switch,default,' +
        'extends,finally,continue,debugger,function,arguments'
      )
        .split(',')
        .join('\\b|\\b') +
      '\\b'
  )
  let unaryOperatorsRE = new RegExp(
    '\\b' +
      'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') +
      '\\s*\\([^\\)]*\\)'
  )
  let stripStringRE =
    /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g
  function detectErrors(ast) {
    let errors = []
    if (ast) checkNode(ast, errors)
    return errors
  }
  function checkNode(node, errors) {
    if (node.type === 1) {
      for (let name in node.attrsMap)
        if (dirRE.test(name)) {
          var value = node.attrsMap[name]
          if (value)
            if (name === 'v-for')
              checkFor(node, 'v-for\x3d"' + value + '"', errors)
            else if (onRE.test(name))
              checkEvent(value, name + '\x3d"' + value + '"', errors)
            else checkExpression(value, name + '\x3d"' + value + '"', errors)
        }
      if (node.children)
        for (var i = 0; i < node.children.length; i++)
          checkNode(node.children[i], errors)
    } else if (node.type === 2) checkExpression(node.expression, node.text, errors)
  }
  function checkEvent(exp, text, errors) {
    let stipped = exp.replace(stripStringRE, '')
    let keywordMatch = stipped.match(unaryOperatorsRE)
    if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$')
      errors.push(
        'avoid using JavaScript unary operator as property name: ' +
          '"' +
          keywordMatch[0] +
          '" in expression ' +
          text.trim()
      )
    checkExpression(exp, text, errors)
  }
  function checkFor(node, text, errors) {
    checkExpression(node.for || '', text, errors)
    checkIdentifier(node.alias, 'v-for alias', text, errors)
    checkIdentifier(node.iterator1, 'v-for iterator', text, errors)
    checkIdentifier(node.iterator2, 'v-for iterator', text, errors)
  }
  function checkIdentifier(ident, type, text, errors) {
    if (typeof ident === 'string')
      try {
        new Function('var ' + ident + '\x3d_')
      } catch (e) {
        errors.push(
          'invalid ' + type + ' "' + ident + '" in expression: ' + text.trim()
        )
      }
  }
  function checkExpression(exp, text, errors) {
    try {
      new Function('return ' + exp)
    } catch (e) {
      let keywordMatch = exp
        .replace(stripStringRE, '')
        .match(prohibitedKeywordRE)
      if (keywordMatch)
        errors.push(
          'avoid using JavaScript keyword as property name: ' +
            '"' +
            keywordMatch[0] +
            '"\n  Raw expression: ' +
            text.trim()
        )
      else
        errors.push(
          'invalid expression: ' +
            e.message +
            ' in\n\n' +
            '    ' +
            exp +
            '\n\n' +
            '  Raw expression: ' +
            text.trim() +
            '\n'
        )
    }
  }
  function createFunction(code, errors) {
    try {
      return new Function(code)
    } catch (err) {
      errors.push({ err: err, code: code })
      return noop
    }
  }
  function createCompileToFunctionFn(compile) {
    let cache = Object.create(null)
    return function compileToFunctions(template, options, vm) {
      options = extend({}, options)
      let warn$$1 = options.warn || warn
      delete options.warn
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/))
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
          )
      }
      let key = options.delimiters
        ? String(options.delimiters) + template
        : template
      if (cache[key]) return cache[key]
      let compiled = compile(template, options)
      if (compiled.errors && compiled.errors.length)
        warn$$1(
          'Error compiling template:\n\n' +
            template +
            '\n\n' +
            compiled.errors
              .map(function (e) {
                return '- ' + e
              })
              .join('\n') +
            '\n',
          vm
        )
      if (compiled.tips && compiled.tips.length)
        compiled.tips.forEach(function (msg) {
          return tip(msg, vm)
        })
      let res = {}
      let fnGenErrors = []
      res.render = createFunction(compiled.render, fnGenErrors)
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
        return createFunction(code, fnGenErrors)
      })
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length)
        warn$$1(
          'Failed to generate render function:\n\n' +
            fnGenErrors
              .map(function (ref) {
                var err = ref.err
                var code = ref.code
                return err.toString() + ' in\n\n' + code + '\n'
              })
              .join('\n'),
          vm
        )
      return (cache[key] = res)
    }
  }
  function createCompilerCreator(baseCompile) {
    return function createCompiler(baseOptions) {
      function compile(template, options) {
        let finalOptions = Object.create(baseOptions)
        let errors = []
        let tips = []
        finalOptions.warn = function (msg, tip) {
          ;(tip ? tips : errors).push(msg)
        }
        if (options) {
          if (options.modules)
            finalOptions.modules = (baseOptions.modules || []).concat(
              options.modules
            )
          if (options.directives)
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            )
          for (let key in options)
            if (key !== 'modules' && key !== 'directives')
              finalOptions[key] = options[key]
        }
        let compiled = baseCompile(template, finalOptions)
        errors.push.apply(errors, detectErrors(compiled.ast))
        compiled.errors = errors
        compiled.tips = tips
        return compiled
      }
      return {
        compile: compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }
  let createCompiler = createCompilerCreator(function baseCompile(
    template,
    options
  ) {
    let ast = parse(template.trim(), options)
    if (options.optimize !== false) optimize(ast, options)
    let code = generate(ast, options)
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  })
  let ref$1 = createCompiler(baseOptions)
  let compileToFunctions = ref$1.compileToFunctions
  let div
  function getShouldDecode(href) {
    div = div || document.createElement('div')
    div.innerHTML = href ? '\x3ca href\x3d"\n"/\x3e' : '\x3cdiv a\x3d"\n"/\x3e'
    return div.innerHTML.indexOf('\x26#10;') > 0
  }
  let shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false
  let shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false
  let idToTemplate = cached(function (id) {
    let el = query(id)
    return el && el.innerHTML
  })
  let mount = Vue.prototype.$mount
  Vue.prototype.$mount = function (el, hydrating) {
    el = el && query(el)
    if (el === document.body || el === document.documentElement) {
      'development' !== 'production' &&
        warn(
          'Do not mount Vue to \x3chtml\x3e or \x3cbody\x3e - mount to normal elements instead.'
        )
      return this
    }
    let options = this.$options
    if (!options.render) {
      let template = options.template
      if (template)
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template)
            if ('development' !== 'production' && !template)
              warn(
                'Template element not found or is empty: ' + options.template,
                this
              )
          }
        } else if (template.nodeType) template = template.innerHTML
        else {
          warn('invalid template option:' + template, this)
          return this
        }
      else if (el) template = getOuterHTML(el)
      if (template) {
        if ('development' !== 'production' && config.performance && mark)
          mark('compile')
        let ref = compileToFunctions(
          template,
          {
            shouldDecodeNewlines: shouldDecodeNewlines,
            shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
            delimiters: options.delimiters,
            comments: options.comments
          },
          this
        )
        let render = ref.render
        let staticRenderFns = ref.staticRenderFns
        options.render = render
        options.staticRenderFns = staticRenderFns
        if ('development' !== 'production' && config.performance && mark) {
          mark('compile end')
          measure('vue ' + this._name + ' compile', 'compile', 'compile end')
        }
      }
    }
    return mount.call(this, el, hydrating)
  }
  function getOuterHTML(el) {
    if (el.outerHTML) return el.outerHTML
    else {
      let container = document.createElement('div')
      container.appendChild(el.cloneNode(true))
      return container.innerHTML
    }
  }
  Vue.compile = compileToFunctions
  return Vue
})
var enhanceUrl = function (target, attr, url) {
  var val = target.getAttribute(attr)
  if (val !== url) target.setAttribute(attr, url)
}
Vue.directive('res', function (el, binding, node) {
  if (
    binding.value == undefined ||
    binding.value == null ||
    !binding.value ||
    binding.value == ''
  )
    return
  let vue = node.context
  let getComponentCode = function (node) {
    if (typeof node._getComponentCode == 'function')
      return node._getComponentCode()
    if (undefined != node.$parent) return getComponentCode(node.$parent)
    return null
  }
  let componentCode = getComponentCode(vue)
  if (!componentCode)
    throw new Error('\u65e0\u6cd5\u83b7\u53d6\u6784\u4ef6\u7f16\u7801.')
  let path = ''
  let valueArray = binding.value.split('.')
  if (valueArray.length > 2) {
    let tempPath = [valueArray[1], valueArray[2]].join('.')
    path = 'itop/resources/' + valueArray[0] + '_' + tempPath
  } else path = 'itop/resources/' + componentCode + '_' + binding.value
  let val = window.GlobalVariables
    ? GlobalVariables.getServerUrl() + '/' + path
    : path
  enhanceUrl(el, binding.arg, val)
})
Vue.directive('url', function (el, binding) {
  if (
    binding.value == undefined ||
    binding.value == null ||
    !binding.value ||
    binding.value == ''
  )
    return
  let val = window.GlobalVariables
    ? GlobalVariables.getServerUrl() + '/' + binding.value
    : binding.value
  enhanceUrl(el, binding.arg, val)
})
Vue.directive('id2url', function (el, binding) {
  if (
    binding.value == undefined ||
    binding.value == null ||
    !binding.value ||
    binding.value == ''
  )
    return
  let url =
    'module-operation!executeOperation?operation\x3dFileDown\x26token\x3d%7B%22data%22%3A%7B%22dataId%22%3A%22' +
    binding.value +
    '%22%2C%22ImageObj%22%3A%22' +
    binding.value +
    '%22%7D%7D'
  let val = window.GlobalVariables
    ? GlobalVariables.getServerUrl() + '/' + url
    : url
  enhanceUrl(el, binding.arg, val)
})
Vue.directive('current', function (el, binding, node) {
  let vue = node.context,
    dsName = binding.arg,
    rd = binding.value
  el.addEventListener(
    'click',
    function () {
      vue.$root._$synCurrentRecordToDs(dsName, rd)
    },
    true
  )
})
window._$V3Vue = function (params) {
  var globalCode = params.element
  if (!_$V3Vue.instance) _$V3Vue.instance = {}
  _$V3Vue.instance[globalCode] = this
  var pros = params.pros
  this.html = (pros && pros.Html) || params.Html || null
  this.javascript =
    (pros && pros.ModuleJavaScript) || params.ModuleJavaScript || null
  this.globalCss = (pros && pros.Css) || params.Css || null
  this.globalJavascript = (pros && pros.JavaScript) || params.JavaScript || null
  this.css = (pros && pros.ModuleCss) || params.ModuleCss || null
  this.entityMapping =
    (pros && pros.entityMapping) || params.entityMapping || {}
  this.windowEntitys =
    (pros && pros.windowEntitys) || params.windowEntitys || {}
  this.fieldTypes =
    (pros && pros.windowEntityFieldTypes) || params.windowEntityFieldTypes || {}
  this.treeMapping = (pros && pros.treeMapping) || params.treeMapping || {}
  this.cssSymbol =
    (pros && pros.cssSymbol) ||
    params.cssSymbol ||
    params.css_prefix_symbol ||
    null
  this.entities = (pros && pros.Entities) || params.entities || []
  this.componentCode = params.componentCode
  this.parseCss = params.parseCss || true
  this.parseJavascript = params.parseJavascript || true
  this.processHtml = params.processHtml || true
  this.widgetCode = params.widgetCode || null
  this.eventTargetCode = params.eventTargetCode || null
  this.element = params.element || null
  this.datas = params.datas || null
  this.moduleScriptId = params.moduleScriptId || null
  this.autoMoutStyle =
    typeof params.autoMoutStyle == 'boolean' ? params.autoMoutStyle : true
  this.forEntities = params.forEntities || []
  this.processedHtml = params.processedHtml || null
  this.hanleEventFunc = params.handleEvent || null
  this.eventHandlers = {}
  this.moduleDefineFunc = {}
  this.sandbox = null
  this.duringDS2Vue = {}
  this.dsEventRegisterFunc = []
  this._init()
}
window._$V3Vue.getInstance = function (globalCode) {
  return _$V3Vue.instance ? _$V3Vue.instance[globalCode] : null
}
window._$V3Vue.prototype = {
  _init: function () {
    this._injectCss()
    this._injectScript()
  },
  _injectCss: function () {
    if (this.parseCss) {
      var cssStr = []
      if (this.globalCss) cssStr.push(this.globalCss)
      if (this.css) cssStr.push(this.css)
      if (cssStr.length > 0) {
        var css = cssStr.join('')
        var style = document.createElement('style')
        style.innerHTML = css
        document.getElementsByTagName('head')[0].appendChild(style)
      }
      this.globalCss = null
      this.css = null
    }
  },
  _defaultModuleScript:
    'var _$hanleEventFunc$_,sandbox,_$V3Vue,vdk;vdk \x3d window[_vdk];window[_vdk]\x3dnull;exports._$putV3Vue\x3dfunction(v3Vue){this._$V3Vue\x3dv3Vue};exports._$putSandbox\x3dfunction(sb){sandbox\x3dsb};var getSandbox\x3dfunction(){return this._$V3Vue.sandbox;};exports._$putHandleEventFunc\x3dfunction(func){_$hanleEventFunc$_\x3dfunc;};var handleEvent\x3dfunction(){if(_$hanleEventFunc$_)_$hanleEventFunc$_.apply(this,arguments)};',
  _injectScript: function () {
    if (this.parseJavascript) {
      var javascriptStr = []
      if (this.globalJavascript) javascriptStr.push(this.globalJavascript)
      if (this.javascript) {
        if (javascriptStr.length > 0) javascriptStr.push(';')
        this.moduleScriptId = this._generate()
        javascriptStr.push('(function(exports,_vdk){')
        javascriptStr.push(this._defaultModuleScript)
        javascriptStr.push(this.javascript)
        var uuid = this._generate()
        window[uuid] = this
        javascriptStr.push(
          "})(window._$V3Vue.getInstance('" +
            this.element +
            "')._getCallFunc(),'" +
            uuid +
            "');"
        )
      }
      if (javascriptStr.length > 0) {
        var script = ['\x3cscript type\x3d"text/javascript"\x3e']
        script = script.concat(javascriptStr)
        script.push('\x3c/script\x3e')
        $('head').append(script.join(''))
      }
      this.globalJavascript = null
      this.javascript = null
    }
  },
  _getCallFunc: function () {
    return this.moduleDefineFunc
  },
  _existFunc: function (name) {
    var funcs = this._getCallFunc()
    if (funcs && typeof funcs[name] == 'function') return true
    return false
  },
  _generate: function () {
    var S4 = function () {
      return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
  },
  _extendDiff: function (aim, source) {
    for (var f in source)
      if (source.hasOwnProperty(f) && source[f] !== aim[f]) aim[f] = source[f]
  },
  _createVueData: function () {
    var data = {
      _$v3paltformData: {
        setCurrentHandlers: [],
        setSelectHandlers: [],
        multipleSelect: []
      },
      _$EntityFieldTypes: this.fieldTypes
    }
    var entitys = this.windowEntitys
    if (entitys)
      for (var entityCode in entitys) {
        var fieldList = entitys[entityCode]
        var fieldMap = {}
        for (var j = 0, len = fieldList.length; j < len; j++)
          fieldMap[fieldList[j]] = null
        data[entityCode] = fieldMap
      }
    for (var oldEntiyCode in this.entityMapping)
      if (this.entityMapping.hasOwnProperty(oldEntiyCode)) {
        var newEntityCode = this.entityMapping[oldEntiyCode]
        data[newEntityCode] = []
      }
    for (var oldEntiyCode in this.treeMapping)
      if (this.treeMapping.hasOwnProperty(oldEntiyCode)) {
        var singleInfo = this.treeMapping[oldEntiyCode]
        var newEntityCode = singleInfo['newEntityCode']
        data[newEntityCode] = []
      }
    return data
  },
  _createVueMethod: function () {
    var handleEvent =
      this.hanleEventFunc ||
      (function (nowVue) {
        return function (eventName) {
          var func = nowVue._$handleEvent
          if (func) func.apply(nowVue, arguments)
        }
      })(this)
    var _moduleDefineFunc = this.moduleDefineFunc
    if (_moduleDefineFunc)
      if (typeof _moduleDefineFunc._$putHandleEventFunc == 'function')
        _moduleDefineFunc._$putHandleEventFunc(handleEvent)
    var _$registerVuiTagEvent = function (widgetCode, eventName, handle) {
      if (!this._$vuiTagEventStorage) this._$vuiTagEventStorage = {}
      var _vuiTagEventStorage = this._$vuiTagEventStorage
      if (!_vuiTagEventStorage[widgetCode]) _vuiTagEventStorage[widgetCode] = {}
      var _event = _vuiTagEventStorage[widgetCode]
      _event[eventName] = handle
    }
    var _$fireVuiTagEvent = function (widgetCode, eventName, params) {
      var _vuiTagEventStorage = this._$vuiTagEventStorage
      if (_vuiTagEventStorage && _vuiTagEventStorage[widgetCode]) {
        var tagEvents = _vuiTagEventStorage[widgetCode]
        if (typeof tagEvents[eventName] == 'function') {
          var handle = tagEvents[eventName]
          handle(params)
        }
      }
    }
    var _refFn = (function (v3Vue) {
      return function (func) {
        if (v3Vue._existFunc(func)) {
          var _func = v3Vue._getCallFunc()[func]
          return _func
        } else
          throw Error(
            '\u672a\u627e\u5230\u65b9\u6cd5[' +
              func +
              ']\uff0c\u8bf7\u68c0\u67e5\uff01'
          )
      }
    })(this)
    var _$getEntityFieldType = function (entityCode) {
      var types = this._data._$EntityFieldTypes
      if (entityCode && types && types[entityCode]) return types[entityCode]
      return {}
    }
    var parseDsData = function (params) {
      var newRecord = []
      var changeValue = []
      var resultSet = params.resultSet
      var eventName = params.eventName
      if (eventName == 'CURRENT') newRecord.push(params.currentRecord.toMap())
      else if (resultSet)
        resultSet.iterate(function (rd) {
          changeValue.push(rd.getChangedData())
          newRecord.push(rd.toMap())
        })
      return { changeValue: changeValue, newRecord: newRecord }
    }
    var handlerCellFunc = function (handler, field, tmpVue) {
      return function (params) {
        if (typeof handler == 'function') {
          var result = []
          var datas = parseDsData(params)
          var newRecord = datas.newRecord
          var changeValue = datas.changeValue
          newRecord = newRecord.length > 0 ? newRecord[0] : newRecord
          if (params.eventName == 'LOAD') handler.apply(tmpVue, result)
          else if (changeValue.length > 0) {
            var tmp = changeValue[0]
            if (tmp && tmp.hasOwnProperty(field)) {
              changeValue = tmp[field]
              result.push(changeValue)
              result.push(newRecord)
              handler.apply(tmpVue, result)
            }
          }
        }
        return handler
      }
    }
    var handlerCallBackParamFunc = function (handler, controlType, tmpVue) {
      return function (params) {
        if (typeof handler == 'function') {
          var result = []
          var datas = parseDsData(params)
          var eventName = params.eventName
          var newRecord = []
          if (eventName == 'CURRENT') newRecord = params.currentRecord.toMap()
          else if (eventName == 'SELECT')
            newRecord = { isSelect: params.isSelect, records: datas.newRecord }
          else {
            newRecord = datas.newRecord
            var changeValue = datas.changeValue
            if (changeValue.length > 0) {
              if (controlType == 'record') changeValue = changeValue[0]
              result.push(changeValue)
            }
          }
          result.push(newRecord)
          handler.apply(tmpVue, result)
        }
        return handler
      }
    }
    return {
      handleEvent: handleEvent,
      call: (function (nowVue) {
        return function (func) {
          nowVue._$callEvent.apply(nowVue, arguments)
        }
      })(this),
      _$getEntityFieldType: function (entityCode) {
        var types = this._data._$EntityFieldTypes
        if (entityCode && types && types[entityCode]) return types[entityCode]
        return {}
      },
      _$getDatasource: (function (nowVue) {
        return function (func) {
          return nowVue._$getDatasource.apply(nowVue, arguments)
        }
      })(this),
      refFn: _refFn,
      _$registerDsEvent: (function (nowVue) {
        return function (param) {
          if (typeof nowVue._$registerDsEvent != 'function')
            if (typeof param == 'function')
              nowVue.dsEventRegisterFunc.push(param)
            else {
              if (typeof param == 'object' && param.dsName && param.eventType)
                nowVue.dsEventRegisterFunc.push(
                  (function (param) {
                    return function () {
                      var dsName = param.dsName
                      var eventType = param.eventType
                      var handler = param.handler
                      var controlType = param.controlType
                      var datasource
                      var tmpVue = param.vueObj
                      if (
                        tmpVue &&
                        typeof tmpVue.$root._$getDatasource == 'function'
                      ) {
                        if (controlType == 'cell') {
                          if (tmpVue.$vnode.data && tmpVue.$vnode.data.model) {
                            var vModel = tmpVue.$vnode.data.model.expression
                            if (vModel) {
                              var tmp = vModel.split('.')
                              dsName = tmp[0]
                              var field = tmp[tmp.length - 1]
                              handler = handlerCellFunc(
                                param.handler,
                                field,
                                tmpVue
                              )
                            }
                          }
                        } else {
                          handler = handlerCallBackParamFunc(
                            param.handler,
                            controlType,
                            tmpVue
                          )
                          dsName = tmpVue.entityCode
                        }
                        if (dsName)
                          datasource = tmpVue.$root._$getDatasource(dsName)
                      }
                      if (datasource) {
                        switch (eventType) {
                          case 'load':
                            eventType = datasource.Events.LOAD
                            break
                          case 'change':
                            eventType = datasource.Events.UPDATE
                            break
                          case 'currentChange':
                            eventType = datasource.Events.CURRENT
                            break
                          case 'selectionChange':
                            eventType = datasource.Events.SELECT
                            break
                          default:
                            eventType = null
                            break
                        }
                        if (eventType)
                          datasource.on({
                            eventName: eventType,
                            handler: handler
                          })
                      }
                    }
                  })(param)
                )
            }
          else nowVue._$registerDsEvent.apply(nowVue, arguments)
        }
      })(this),
      _$registerDataLoadedEvent: (function (nowVue) {
        return function (func) {
          nowVue._$registerDataLoadedEvent.apply(nowVue, arguments)
        }
      })(this),
      _$registerVuiTagEvent: _$registerVuiTagEvent,
      _$fireVuiTagEvent: _$fireVuiTagEvent,
      _getComponentCode: (function (componentCode) {
        return function () {
          return componentCode
        }
      })(this.componentCode),
      _$v3platform: function () {
        var _this = this
        return {
          datasource: {
            synCurrentRecordToDs: function (entityCode, current, oldCurrent) {
              var func = _this._$synCurrentRecordToDs
              if (func) func.apply(_this, [entityCode, current, oldCurrent])
            },
            synCurrentIdToDs: function (entityCode, current, oldCurrent) {
              var func = _this._$synCurrentIdToDs
              if (func) func.apply(_this, [entityCode, current, oldCurrent])
            },
            synSelectRecordToDs: function (entityCode, data, isSel) {
              var func = _this._$synSelectRecordToDs
              if (func) func.apply(_this, [entityCode, data, isSel])
            },
            synCurrentRecordToUi: function (entityCode, current) {
              var funcs = _this._data._$v3paltformData.setCurrentHandlers
              if (funcs.length > 0)
                for (var i = 0, len = funcs.length; i < len; i++) {
                  var func = funcs[i]
                  func(entityCode, current)
                }
            },
            synSelectRecordToUi: function (entityCode, datas, isSel) {
              var funcs = _this._data._$v3paltformData.setSelectHandlers
              if (funcs.length > 0)
                for (var i = 0, len = funcs.length; i < len; i++) {
                  var func = funcs[i]
                  func(entityCode, datas, isSel)
                }
            },
            registerCurrentHandler: function (handler) {
              _this._data._$v3paltformData.setCurrentHandlers.push(handler)
            },
            registerSelectHandler: function (handler) {
              _this._data._$v3paltformData.setSelectHandlers.push(handler)
            },
            markDsMultipleSelect: function (entityCode) {
              _this._data._$v3paltformData.multipleSelect.push(entityCode)
            }
          }
        }
      }
    }
  },
  _createVueWatcher: function () {
    var watchers = {}
    var getWatcher = function (code, nowV) {
      return {
        deep: true,
        sync: true,
        handler: (function (entityCode, nowVue) {
          return function (val) {
            var func = nowVue._$synData
            if (func) func.apply(nowVue, [entityCode, val])
          }
        })(code, nowV)
      }
    }
    var entitys = this.windowEntitys
    for (var entityCode in entitys)
      watchers[entityCode] = getWatcher(entityCode, this)
    if (this.entityMapping)
      for (var entityCode in this.entityMapping)
        if (this.entityMapping.hasOwnProperty(entityCode)) {
          var newEntityCode = this.entityMapping[entityCode]
          if (!watchers[newEntityCode])
            watchers[newEntityCode] = getWatcher(entityCode, this)
        }
    return watchers
  },
  render: function () {
    if (this.moduleDefineFunc && this.moduleDefineFunc._$putV3Vue)
      this.moduleDefineFunc._$putV3Vue(this)
    this.analyEntity(this.html)
    var el =
      typeof this.element == 'string'
        ? document.getElementById(this.element)
        : this.element
    if (this.autoMoutStyle) el.setAttribute('symbol', this.cssSymbol)
    if (this.html) el.innerHTML = this.html
    var vm = new Vue({
      el: el,
      data: this._createVueData(),
      methods: this._createVueMethod(),
      watch: this._createVueWatcher()
    })
    this._$vue_vm = vm
  },
  strTrim: function (str) {
    return str ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : str
  },
  toNewEntityCode: function (entityCode) {
    return entityCode + '_' + new Date().getTime()
  },
  _getNewEntityCode: function (pool, entityCode) {
    entityCode = this.strTrim(entityCode)
    if (!pool[entityCode]) pool[entityCode] = this.toNewEntityCode(entityCode)
    return pool[entityCode]
  },
  analyEntity: function (html) {
    if (!html) return
    var template = html
    var entityMapping = {}
    var treeMapping = this.treeMapping ? this.treeMapping : {}
    var tmpThis = this
    var entitys = this.windowEntitys ? this.windowEntitys : []
    var analyFunc = (function (tmp_this) {
      return function (childNode) {
        var components
        var nodeName = childNode.nodeName
        if (window._$V3Vue && window._$V3Vue._getComponents)
          components = window._$V3Vue._getComponents(nodeName)
        if (components && components.length > 0)
          for (var i = 0, len = components.length; i < len; i++) {
            var component = components[i]
            var dataPro = component.getDataProp()
            var attrName = childNode.hasAttribute(':' + dataPro)
              ? ':' + dataPro
              : childNode.hasAttribute('v-bind:' + dataPro)
              ? 'v-bind:' + dataPro
              : null
            var dataType = component.getDataType()
            if (dataType == 'Array') {
              if (attrName) {
                var entityCode = childNode.getAttribute(attrName)
                var newEntityCode = this._getNewEntityCode(
                  entityMapping,
                  entityCode
                )
                childNode.setAttribute(attrName, newEntityCode)
                childNode.setAttribute(':entity-code', "'" + entityCode + "'")
              }
            } else if (dataType == 'Tree') {
              if (attrName) {
                var entityCode = childNode.getAttribute(attrName)
                var newEntityCode = this.toNewEntityCode(entityCode)
                var newMappingInfo = { newEntityCode: newEntityCode }
                var treeStructProp = component.getTreeStructProp()
                if (childNode.hasAttribute(':' + treeStructProp)) {
                  var _fieldMapping = childNode.getAttribute(
                    ':' + treeStructProp
                  )
                  try {
                    newMappingInfo.fieldMapping = eval(
                      '(' + _fieldMapping + ')'
                    )
                  } catch (e) {
                    newMappingInfo.fieldMapping = {
                      id: 'id',
                      parentField: 'pid',
                      title: 'title'
                    }
                  }
                } else
                  newMappingInfo.fieldMapping = {
                    id: 'id',
                    parentField: 'pid',
                    title: 'title'
                  }
                treeMapping[entityCode] = newMappingInfo
                childNode.setAttribute(attrName, newEntityCode)
                childNode.setAttribute(':entity-code', "'" + entityCode + "'")
              }
            } else if (dataType == 'Object')
              if (attrName) {
                var entityCode = childNode.getAttribute(attrName)
                var tagName = component.getComponentName()
                var value_field_attr_name = ''
                var text_field_attr_name = ''
                switch (tagName) {
                  case 'vui-dict-box':
                  case 'vui-radio-list':
                  case 'vui-checkbox-list':
                  case 'vui-combo-box':
                    value_field_attr_name = 'value-field'
                    break
                }
                if (
                  value_field_attr_name != '' &&
                  childNode.hasAttribute(value_field_attr_name)
                ) {
                  childNode.setAttribute('___ds___', entityCode)
                  var _$fields = []
                  _$fields.push(childNode.getAttribute(value_field_attr_name))
                  childNode.setAttribute('___field___', _$fields.join(','))
                }
              }
          }
        var attrName = 'v-for'
        if (childNode.hasAttribute(attrName)) {
          var expArray = childNode.getAttribute(attrName).split(' in ')
          var varName = expArray[0],
            entityCode = expArray[1]
          if (entitys[entityCode]) {
            childNode.setAttribute(
              attrName,
              varName +
                ' in ' +
                this._getNewEntityCode(entityMapping, entityCode)
            )
            childNode.setAttribute(':entity-code', "'" + entityCode + "'")
            childNode.setAttribute(':key', varName + '.id')
          }
        }
        attrName = 'v-model'
        if (childNode.hasAttribute(attrName)) {
          var expArray = childNode.getAttribute(attrName).split('.')
          var entityCode = expArray[0],
            fieldCode = expArray[1]
          if (entitys[entityCode]) {
            childNode.setAttribute('___ds___', entityCode)
            childNode.setAttribute('___field___', fieldCode)
          }
        }
        var tagName = nodeName.toLowerCase()
        if (tagName.substring(0, 4) == 'vui-')
          childNode.setAttribute('vui-type', tagName)
        var childs = childNode.children
        if (childs && childs.length > 0)
          for (var i = 0, l = childs.length; i < l; i++)
            analyFunc.call(tmp_this, childs[i])
      }
    })(tmpThis)
    var tmpDom = document.createElement('div')
    tmpDom.innerHTML = template
    analyFunc(tmpDom)
    var _tmplate = tmpDom.outerHTML
    this.html = _tmplate.substring(5, _tmplate.length - 6)
    this.treeMapping = treeMapping
    this.entityMapping = entityMapping
  },
  on: function (params) {
    var eventName = params.eventName,
      handler = params.handler
    var handlers = this.eventHandlers[eventName]
    if (!handlers) {
      handlers = []
      this.eventHandlers[eventName] = handlers
    }
    handlers.push(handler)
  },
  Events: { Rendered: 'Rendered' }
}
if (!('classList' in document.documentElement))
  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function () {
      var self = this
      function update(fn) {
        return function (value) {
          var classes = self.className.split(/\s+/g),
            index = classes.indexOf(value)
          fn(classes, index, value)
          self.className = classes.join(' ')
        }
      }
      return {
        add: update(function (classes, index, value) {
          if (!~index) classes.push(value)
        }),
        remove: update(function (classes, index) {
          if (~index) classes.splice(index, 1)
        }),
        toggle: update(function (classes, index, value) {
          if (~index) classes.splice(index, 1)
          else classes.push(value)
        }),
        contains: function (value) {
          return !!~self.className.split(/\s+/g).indexOf(value)
        },
        item: function (i) {
          return self.className.split(/\s+/g)[i] || null
        }
      }
    }
  })
var __isOpera =
  navigator.appName == 'Opera' || navigator.userAgent.indexOf('Opera') != -1
var __isIE =
  (navigator.appName == 'Microsoft Internet Explorer' && !__isOpera) ||
  navigator.userAgent.indexOf('Trident/') != -1
if (__isIE && window.HTMLElement)
  if (
    Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1
  )
    Object.defineProperty(HTMLElement.prototype, 'dataset', {
      get: function () {
        var attributes = this.attributes
        var name = [],
          value = []
        var obj = {}
        for (var i = 0; i < attributes.length; i++)
          if (attributes[i].nodeName.slice(0, 5) == 'data-') {
            name.push(attributes[i].nodeName.slice(5))
            value.push(attributes[i].nodeValue)
          }
        for (var j = 0; j < name.length; j++) obj[name[j]] = value[j]
        return obj
      }
    })
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : (t.VueI18n = e())
})(this, function () {
  function t(t, e) {
    'undefined' != typeof console &&
      (console.warn('[vue-i18n] ' + t), e && console.warn(e.stack))
  }
  function e(t) {
    return null !== t && 'object' == typeof t
  }
  function n(t) {
    return N.call(t) === M
  }
  function r(t) {
    return null === t || void 0 === t
  }
  function i() {
    for (let t = [], n = arguments.length; n--; ) t[n] = arguments[n]
    let r = null,
      i = null
    return (
      1 === t.length
        ? e(t[0]) || Array.isArray(t[0])
          ? (i = t[0])
          : 'string' == typeof t[0] && (r = t[0])
        : 2 === t.length &&
          ('string' == typeof t[0] && (r = t[0]),
          (e(t[1]) || Array.isArray(t[1])) && (i = t[1])),
      { locale: r, params: i }
    )
  }
  function a(t) {
    return t ? (t > 1 ? 1 : 0) : 1
  }
  function o(t, e) {
    return (t = Math.abs(t)), 2 === e ? a(t) : t ? Math.min(t, 2) : 0
  }
  function s(t, e) {
    if (!t && 'string' != typeof t) return null
    let n = t.split('|')
    return (e = o(e, n.length)), n[e] ? n[e].trim() : t
  }
  function c(t) {
    return JSON.parse(JSON.stringify(t))
  }
  function l(t, e) {
    if (t.length) {
      let n = t.indexOf(e)
      if (n > -1) return t.splice(n, 1)
    }
  }
  function u(t, e) {
    return W.call(t, e)
  }
  function f(t) {
    for (let n = arguments, r = Object(t), i = 1; i < arguments.length; i++) {
      let a = n[i]
      if (void 0 !== a && null !== a) {
        let o = void 0
        for (o in a)
          u(a, o) && (e(a[o]) ? (r[o] = f(r[o], a[o])) : (r[o] = a[o]))
      }
    }
    return r
  }
  function h(t, n) {
    if (t === n) return !0
    let r = e(t),
      i = e(n)
    if (!r || !i) return !r && !i && String(t) === String(n)
    try {
      let a = Array.isArray(t),
        o = Array.isArray(n)
      if (a && o)
        return (
          t.length === n.length &&
          t.every(function (t, e) {
            return h(t, n[e])
          })
        )
      if (a || o) return !1
      let s = Object.keys(t),
        c = Object.keys(n)
      return (
        s.length === c.length &&
        s.every(function (e) {
          return h(t[e], n[e])
        })
      )
    } catch (t) {
      return !1
    }
  }
  function p(t) {
    Object.defineProperty(t.prototype, '$i18n', {
      get: function () {
        return this._i18n
      }
    }),
      (t.prototype.$t = function (t) {
        for (var e = [], n = arguments.length - 1; n-- > 0; )
          e[n] = arguments[n + 1]
        var r = this.$i18n
        return r._t.apply(r, [t, r.locale, r._getMessages(), this].concat(e))
      }),
      (t.prototype.$tc = function (t, e) {
        for (var n = [], r = arguments.length - 2; r-- > 0; )
          n[r] = arguments[r + 2]
        var i = this.$i18n
        return i._tc.apply(
          i,
          [t, i.locale, i._getMessages(), this, e].concat(n)
        )
      }),
      (t.prototype.$te = function (t, e) {
        var n = this.$i18n
        return n._te(t, n.locale, n._getMessages(), e)
      }),
      (t.prototype.$d = function (t) {
        for (var e, n = [], r = arguments.length - 1; r-- > 0; )
          n[r] = arguments[r + 1]
        return (e = this.$i18n).d.apply(e, [t].concat(n))
      }),
      (t.prototype.$n = function (t) {
        for (var e, n = [], r = arguments.length - 1; r-- > 0; )
          n[r] = arguments[r + 1]
        return (e = this.$i18n).n.apply(e, [t].concat(n))
      })
  }
  function m(t, e, n) {
    v(t, n) && d(t, e, n)
  }
  function _(t, e, n, r) {
    v(t, n) && ((y(t, n) && h(e.value, e.oldValue)) || d(t, e, n))
  }
  function g(e, n, r, i) {
    if (!r.context)
      return void t('Vue instance does not exists in VNode context')
    ;(e.textContent = ''),
      (e._vt = void 0),
      delete e._vt,
      (e._locale = void 0),
      delete e._locale
  }
  function v(e, n) {
    let r = n.context
    return r
      ? !!r.$i18n || (t('VueI18n instance does not exists in Vue instance'), !1)
      : (t('Vue instance doest not exists in VNode context'), !1)
  }
  function y(t, e) {
    let n = e.context
    return t._locale === n.$i18n.locale
  }
  function d(e, n, r) {
    let i,
      a,
      o = n.value,
      s = b(o),
      c = s.path,
      l = s.locale,
      u = s.args,
      f = s.choice
    if (!c && !l && !u) return void t('value type not supported')
    if (!c) return void t('`path` is required in v-t directive')
    let h = r.context
    ;(e._vt = e.textContent =
      f
        ? (i = h.$i18n).tc.apply(i, [c, f].concat($(l, u)))
        : (a = h.$i18n).t.apply(a, [c].concat($(l, u)))),
      (e._locale = h.$i18n.locale)
  }
  function b(t) {
    let e, r, i, a
    return (
      'string' == typeof t
        ? (e = t)
        : n(t) && ((e = t.path), (r = t.locale), (i = t.args), (a = t.choice)),
      { path: e, locale: r, args: i, choice: a }
    )
  }
  function $(t, e) {
    let r = []
    return t && r.push(t), e && (Array.isArray(e) || n(e)) && r.push(e), r
  }
  function F(t) {
    j = t
    j.version && Number(j.version.split('.')[0])
    ;(F.installed = !0),
      p(j),
      j.mixin(V),
      j.directive('t', { bind: m, update: _, unbind: g }),
      j.component(C.name, C),
      (j.config.optionMergeStrategies.i18n = function (t, e) {
        return void 0 === e ? t : e
      })
  }
  function w(t) {
    for (let e = [], n = 0, r = ''; n < t.length; ) {
      let i = t[n++]
      if ('{' === i) {
        r && e.push({ type: 'text', value: r }), (r = '')
        let a = ''
        for (i = t[n++]; '}' !== i; ) (a += i), (i = t[n++])
        let o = R.test(a) ? 'list' : P.test(a) ? 'named' : 'unknown'
        e.push({ value: a, type: o })
      } else '%' === i ? '{' !== t[n] && (r += i) : (r += i)
    }
    return r && e.push({ type: 'text', value: r }), e
  }
  function k(t, n) {
    let r = [],
      i = 0,
      a = Array.isArray(n) ? 'list' : e(n) ? 'named' : 'unknown'
    if ('unknown' === a) return r
    for (; i < t.length; ) {
      let o = t[i]
      switch (o.type) {
        case 'text':
          r.push(o.value)
          break
        case 'list':
          r.push(n[parseInt(o.value, 10)])
          break
        case 'named':
          'named' === a && r.push(n[o.value])
      }
      i++
    }
    return r
  }
  function T(t) {
    return Z.test(t)
  }
  function x(t) {
    let e = t.charCodeAt(0)
    return e !== t.charCodeAt(t.length - 1) || (34 !== e && 39 !== e)
      ? t
      : t.slice(1, -1)
  }
  function D(t) {
    if (void 0 === t || null === t) return 'eof'
    let e = t.charCodeAt(0)
    switch (e) {
      case 91:
      case 93:
      case 46:
      case 34:
      case 39:
      case 48:
        return t
      case 95:
      case 36:
      case 45:
        return 'ident'
      case 32:
      case 9:
      case 10:
      case 13:
      case 160:
      case 65279:
      case 8232:
      case 8233:
        return 'ws'
    }
    return (e >= 97 && e <= 122) || (e >= 65 && e <= 90)
      ? 'ident'
      : e >= 49 && e <= 57
      ? 'number'
      : 'else'
  }
  function A(t) {
    let e = t.trim()
    return ('0' !== t.charAt(0) || !isNaN(t)) && (T(e) ? x(e) : '*' + e)
  }
  function L(t) {
    let e,
      n,
      r,
      i,
      a,
      o,
      s,
      c = [],
      l = -1,
      u = G,
      f = 0,
      h = []
    for (
      h[J] = function () {
        void 0 !== n && (c.push(n), (n = void 0))
      },
        h[z] = function () {
          void 0 === n ? (n = r) : (n += r)
        },
        h[U] = function () {
          h[z](), f++
        },
        h[q] = function () {
          if (f > 0) f--, (u = B), h[z]()
          else {
            if (((f = 0), !1 === (n = A(n)))) return !1
            h[J]()
          }
        };
      null !== u;

    )
      if (
        (l++,
        '\\' !== (e = t[l]) ||
          !(function () {
            var e = t[l + 1]
            if ((u === H && "'" === e) || (u === K && '"' === e))
              return l++, (r = '\\' + e), h[z](), !0
          })())
      ) {
        if (((i = D(e)), (s = Y[u]), (a = s[i] || s.else || X) === X)) return
        if (
          ((u = a[0]),
          (o = h[a[1]]) && ((r = a[2]), (r = void 0 === r ? e : r), !1 === o()))
        )
          return
        if (u === Q) return c
      }
  }
  function O(t) {
    return !!Array.isArray(t) && 0 === t.length
  }
  let j,
    N = Object.prototype.toString,
    M = '[object Object]',
    W = Object.prototype.hasOwnProperty,
    I = 'undefined' != typeof Intl && void 0 !== Intl.DateTimeFormat,
    S = 'undefined' != typeof Intl && void 0 !== Intl.NumberFormat,
    V = {
      beforeCreate: function () {
        var t = this.$options
        if (((t.i18n = t.i18n || (t.__i18n ? {} : null)), t.i18n))
          if (t.i18n instanceof nt) {
            if (t.__i18n)
              try {
                var e = {}
                t.__i18n.forEach(function (t) {
                  e = f(e, JSON.parse(t))
                }),
                  Object.keys(e).forEach(function (n) {
                    t.i18n.mergeLocaleMessage(n, e[n])
                  })
              } catch (t) {}
            ;(this._i18n = t.i18n),
              (this._i18nWatcher = this._i18n.watchI18nData()),
              this._i18n.subscribeDataChanging(this),
              (this._subscribing = !0)
          } else {
            if (n(t.i18n)) {
              if (
                (this.$root &&
                  this.$root.$i18n &&
                  this.$root.$i18n instanceof nt &&
                  ((t.i18n.root = this.$root.$i18n),
                  (t.i18n.formatter = this.$root.$i18n.formatter),
                  (t.i18n.fallbackLocale = this.$root.$i18n.fallbackLocale),
                  (t.i18n.silentTranslationWarn =
                    this.$root.$i18n.silentTranslationWarn)),
                t.__i18n)
              )
                try {
                  var r = {}
                  t.__i18n.forEach(function (t) {
                    r = f(r, JSON.parse(t))
                  }),
                    (t.i18n.messages = r)
                } catch (t) {}
              ;(this._i18n = new nt(t.i18n)),
                (this._i18nWatcher = this._i18n.watchI18nData()),
                this._i18n.subscribeDataChanging(this),
                (this._subscribing = !0),
                (void 0 === t.i18n.sync || t.i18n.sync) &&
                  (this._localeWatcher = this.$i18n.watchLocale())
            }
          }
        else
          this.$root && this.$root.$i18n && this.$root.$i18n instanceof nt
            ? ((this._i18n = this.$root.$i18n),
              this._i18n.subscribeDataChanging(this),
              (this._subscribing = !0))
            : t.parent &&
              t.parent.$i18n &&
              t.parent.$i18n instanceof nt &&
              ((this._i18n = t.parent.$i18n),
              this._i18n.subscribeDataChanging(this),
              (this._subscribing = !0))
      },
      beforeDestroy: function () {
        this._i18n &&
          (this._subscribing &&
            (this._i18n.unsubscribeDataChanging(this),
            delete this._subscribing),
          this._i18nWatcher && (this._i18nWatcher(), delete this._i18nWatcher),
          this._localeWatcher &&
            (this._localeWatcher(), delete this._localeWatcher),
          (this._i18n = null))
      }
    },
    C = {
      name: 'i18n',
      functional: !0,
      props: {
        tag: { type: String, default: 'span' },
        path: { type: String, required: !0 },
        locale: { type: String },
        places: { type: [Array, Object] }
      },
      render: function (e, n) {
        var r = n.props,
          i = n.data,
          a = n.children,
          o = n.parent,
          s = o.$i18n
        if (
          ((a = (a || []).filter(function (t) {
            return t.tag || (t.text = t.text.trim())
          })),
          !s)
        )
          return a
        var c = r.path,
          l = r.locale,
          u = {},
          f = r.places || {},
          h = Array.isArray(f) ? f.length > 0 : Object.keys(f).length > 0,
          p = a.every(function (t) {
            if (t.data && t.data.attrs) {
              var e = t.data.attrs.place
              return void 0 !== e && '' !== e
            }
          })
        return (
          h &&
            a.length > 0 &&
            !p &&
            t(
              'If places prop is set, all child elements must have place prop set.'
            ),
          Array.isArray(f)
            ? f.forEach(function (t, e) {
                u[e] = t
              })
            : Object.keys(f).forEach(function (t) {
                u[t] = f[t]
              }),
          a.forEach(function (t, e) {
            var n = p ? '' + t.data.attrs.place : '' + e
            u[n] = t
          }),
          e(r.tag, i, s.i(c, l, u))
        )
      }
    },
    E = function () {
      this._caches = Object.create(null)
    }
  E.prototype.interpolate = function (t, e) {
    if (!e) return [t]
    let n = this._caches[t]
    return n || ((n = w(t)), (this._caches[t] = n)), k(n, e)
  }
  let R = /^(\d)+/,
    P = /^(\w)+/,
    z = 0,
    J = 1,
    U = 2,
    q = 3,
    G = 0,
    B = 4,
    H = 5,
    K = 6,
    Q = 7,
    X = 8,
    Y = []
  ;(Y[G] = { 'ws': [G], 'ident': [3, z], '[': [B], 'eof': [Q] }),
    (Y[1] = { 'ws': [1], '.': [2], '[': [B], 'eof': [Q] }),
    (Y[2] = { ws: [2], ident: [3, z], 0: [3, z], number: [3, z] }),
    (Y[3] = {
      'ident': [3, z],
      0: [3, z],
      'number': [3, z],
      'ws': [1, J],
      '.': [2, J],
      '[': [B, J],
      'eof': [Q, J]
    }),
    (Y[B] = {
      "'": [H, z],
      '"': [K, z],
      '[': [B, U],
      ']': [1, q],
      'eof': X,
      'else': [B, z]
    }),
    (Y[H] = { "'": [B, z], 'eof': X, 'else': [H, z] }),
    (Y[K] = { '"': [B, z], 'eof': X, 'else': [K, z] })
  let Z = /^\s?(true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/,
    tt = function () {
      this._cache = Object.create(null)
    }
  ;(tt.prototype.parsePath = function (t) {
    var e = this._cache[t]
    return e || ((e = L(t)) && (this._cache[t] = e)), e || []
  }),
    (tt.prototype.getPathValue = function (t, n) {
      if (!e(t)) return null
      var r = this.parsePath(n)
      if (O(r)) return null
      for (var i = r.length, a = t, o = 0; o < i; ) {
        var s = a[r[o]]
        if (void 0 === s) {
          a = null
          break
        }
        ;(a = s), o++
      }
      return a
    })
  let et = [
      'style',
      'currency',
      'currencyDisplay',
      'useGrouping',
      'minimumIntegerDigits',
      'minimumFractionDigits',
      'maximumFractionDigits',
      'minimumSignificantDigits',
      'maximumSignificantDigits',
      'localeMatcher',
      'formatMatcher'
    ],
    nt = function (t) {
      let e = this
      void 0 === t && (t = {}),
        !j && 'undefined' != typeof window && window.Vue && F(window.Vue)
      let n = t.locale || 'en-US',
        i = t.fallbackLocale || 'en-US',
        a = t.messages || {},
        o = t.dateTimeFormats || {},
        s = t.numberFormats || {}
      ;(this._vm = null),
        (this._formatter = t.formatter || new E()),
        (this._missing = t.missing || null),
        (this._root = t.root || null),
        (this._sync = void 0 === t.sync || !!t.sync),
        (this._fallbackRoot = void 0 === t.fallbackRoot || !!t.fallbackRoot),
        (this._silentTranslationWarn =
          void 0 !== t.silentTranslationWarn && !!t.silentTranslationWarn),
        (this._dateTimeFormatters = {}),
        (this._numberFormatters = {}),
        (this._path = new tt()),
        (this._dataListeners = []),
        (this._exist = function (t, n) {
          return !(!t || !n) && !r(e._path.getPathValue(t, n))
        }),
        this._initVM({
          locale: n,
          fallbackLocale: i,
          messages: a,
          dateTimeFormats: o,
          numberFormats: s
        })
    },
    rt = {
      vm: { configurable: !0 },
      messages: { configurable: !0 },
      dateTimeFormats: { configurable: !0 },
      numberFormats: { configurable: !0 },
      locale: { configurable: !0 },
      fallbackLocale: { configurable: !0 },
      missing: { configurable: !0 },
      formatter: { configurable: !0 },
      silentTranslationWarn: { configurable: !0 }
    }
  return (
    (nt.prototype._initVM = function (t) {
      var e = j.config.silent
      ;(j.config.silent = !0),
        (this._vm = new j({ data: t })),
        (j.config.silent = e)
    }),
    (nt.prototype.subscribeDataChanging = function (t) {
      this._dataListeners.push(t)
    }),
    (nt.prototype.unsubscribeDataChanging = function (t) {
      l(this._dataListeners, t)
    }),
    (nt.prototype.watchI18nData = function () {
      var t = this
      return this._vm.$watch(
        '$data',
        function () {
          for (var e = t._dataListeners.length; e--; )
            j.nextTick(function () {
              t._dataListeners[e] && t._dataListeners[e].$forceUpdate()
            })
        },
        { deep: !0 }
      )
    }),
    (nt.prototype.watchLocale = function () {
      if (!this._sync || !this._root) return null
      var t = this._vm
      return this._root.vm.$watch(
        'locale',
        function (e) {
          t.$set(t, 'locale', e), t.$forceUpdate()
        },
        { immediate: !0 }
      )
    }),
    (rt.vm.get = function () {
      return this._vm
    }),
    (rt.messages.get = function () {
      return c(this._getMessages())
    }),
    (rt.dateTimeFormats.get = function () {
      return c(this._getDateTimeFormats())
    }),
    (rt.numberFormats.get = function () {
      return c(this._getNumberFormats())
    }),
    (rt.locale.get = function () {
      return this._vm.locale
    }),
    (rt.locale.set = function (t) {
      this._vm.$set(this._vm, 'locale', t)
    }),
    (rt.fallbackLocale.get = function () {
      return this._vm.fallbackLocale
    }),
    (rt.fallbackLocale.set = function (t) {
      this._vm.$set(this._vm, 'fallbackLocale', t)
    }),
    (rt.missing.get = function () {
      return this._missing
    }),
    (rt.missing.set = function (t) {
      this._missing = t
    }),
    (rt.formatter.get = function () {
      return this._formatter
    }),
    (rt.formatter.set = function (t) {
      this._formatter = t
    }),
    (rt.silentTranslationWarn.get = function () {
      return this._silentTranslationWarn
    }),
    (rt.silentTranslationWarn.set = function (t) {
      this._silentTranslationWarn = t
    }),
    (nt.prototype._getMessages = function () {
      return this._vm.messages
    }),
    (nt.prototype._getDateTimeFormats = function () {
      return this._vm.dateTimeFormats
    }),
    (nt.prototype._getNumberFormats = function () {
      return this._vm.numberFormats
    }),
    (nt.prototype._warnDefault = function (t, e, n, i, a) {
      if (!r(n)) return n
      if (this._missing) {
        var o = this._missing.apply(null, [t, e, i, a])
        if ('string' == typeof o) return o
      }
      return e
    }),
    (nt.prototype._isFallbackRoot = function (t) {
      return !t && !r(this._root) && this._fallbackRoot
    }),
    (nt.prototype._interpolate = function (t, e, i, a, o, s) {
      if (!e) return null
      var c = this._path.getPathValue(e, i)
      if (Array.isArray(c) || n(c)) return c
      var l
      if (r(c)) {
        if (!n(e)) return null
        if ('string' != typeof (l = e[i])) return null
      } else {
        if ('string' != typeof c) return null
        l = c
      }
      return (
        l.indexOf('@:') >= 0 && (l = this._link(t, e, l, a, o, s)),
        this._render(l, o, s)
      )
    }),
    (nt.prototype._link = function (t, e, n, r, i, a) {
      var o = this,
        s = n,
        c = s.match(/(@:[\w\-_|.]+)/g)
      for (var l in c)
        if (c.hasOwnProperty(l)) {
          var u = c[l],
            f = u.substr(2),
            h = o._interpolate(
              t,
              e,
              f,
              r,
              'raw' === i ? 'string' : i,
              'raw' === i ? void 0 : a
            )
          if (o._isFallbackRoot(h)) {
            if (!o._root) throw Error('unexpected error')
            var p = o._root
            h = p._translate(
              p._getMessages(),
              p.locale,
              p.fallbackLocale,
              f,
              r,
              i,
              a
            )
          }
          ;(h = o._warnDefault(t, f, h, r, Array.isArray(a) ? a : [a])),
            (s = h ? s.replace(u, h) : s)
        }
      return s
    }),
    (nt.prototype._render = function (t, e, n) {
      var r = this._formatter.interpolate(t, n)
      return 'string' === e ? r.join('') : r
    }),
    (nt.prototype._translate = function (t, e, n, i, a, o, s) {
      var c = this._interpolate(e, t[e], i, a, o, s)
      return r(c)
        ? ((c = this._interpolate(n, t[n], i, a, o, s)), r(c) ? null : c)
        : c
    }),
    (nt.prototype._t = function (t, e, n, r) {
      for (var a, o = [], s = arguments.length - 4; s-- > 0; )
        o[s] = arguments[s + 4]
      if (!t) return ''
      var c = i.apply(void 0, o),
        l = c.locale || e,
        u = this._translate(n, l, this.fallbackLocale, t, r, 'string', c.params)
      if (this._isFallbackRoot(u)) {
        if (!this._root) throw Error('unexpected error')
        return (a = this._root).t.apply(a, [t].concat(o))
      }
      return this._warnDefault(l, t, u, r, o)
    }),
    (nt.prototype.t = function (t) {
      for (var e, n = [], r = arguments.length - 1; r-- > 0; )
        n[r] = arguments[r + 1]
      return (e = this)._t.apply(
        e,
        [t, this.locale, this._getMessages(), null].concat(n)
      )
    }),
    (nt.prototype._i = function (t, e, n, r, i) {
      var a = this._translate(n, e, this.fallbackLocale, t, r, 'raw', i)
      if (this._isFallbackRoot(a)) {
        if (!this._root) throw Error('unexpected error')
        return this._root.i(t, e, i)
      }
      return this._warnDefault(e, t, a, r, [i])
    }),
    (nt.prototype.i = function (t, e, n) {
      return t
        ? ('string' != typeof e && (e = this.locale),
          this._i(t, e, this._getMessages(), null, n))
        : ''
    }),
    (nt.prototype._tc = function (t, e, n, r, i) {
      for (var a, o = [], c = arguments.length - 5; c-- > 0; )
        o[c] = arguments[c + 5]
      return t
        ? (void 0 === i && (i = 1),
          s((a = this)._t.apply(a, [t, e, n, r].concat(o)), i))
        : ''
    }),
    (nt.prototype.tc = function (t, e) {
      for (var n, r = [], i = arguments.length - 2; i-- > 0; )
        r[i] = arguments[i + 2]
      return (n = this)._tc.apply(
        n,
        [t, this.locale, this._getMessages(), null, e].concat(r)
      )
    }),
    (nt.prototype._te = function (t, e, n) {
      for (var r = [], a = arguments.length - 3; a-- > 0; )
        r[a] = arguments[a + 3]
      var o = i.apply(void 0, r).locale || e
      return this._exist(n[o], t)
    }),
    (nt.prototype.te = function (t, e) {
      return this._te(t, this.locale, this._getMessages(), e)
    }),
    (nt.prototype.getLocaleMessage = function (t) {
      return c(this._vm.messages[t] || {})
    }),
    (nt.prototype.setLocaleMessage = function (t, e) {
      this._vm.$set(this._vm.messages, t, e)
    }),
    (nt.prototype.mergeLocaleMessage = function (t, e) {
      this._vm.$set(
        this._vm.messages,
        t,
        j.util.extend(this._vm.messages[t] || {}, e)
      )
    }),
    (nt.prototype.getDateTimeFormat = function (t) {
      return c(this._vm.dateTimeFormats[t] || {})
    }),
    (nt.prototype.setDateTimeFormat = function (t, e) {
      this._vm.$set(this._vm.dateTimeFormats, t, e)
    }),
    (nt.prototype.mergeDateTimeFormat = function (t, e) {
      this._vm.$set(
        this._vm.dateTimeFormats,
        t,
        j.util.extend(this._vm.dateTimeFormats[t] || {}, e)
      )
    }),
    (nt.prototype._localizeDateTime = function (t, e, n, i, a) {
      var o = e,
        s = i[o]
      if (((r(s) || r(s[a])) && ((o = n), (s = i[o])), r(s) || r(s[a])))
        return null
      var c = s[a],
        l = o + '__' + a,
        u = this._dateTimeFormatters[l]
      return (
        u || (u = this._dateTimeFormatters[l] = new Intl.DateTimeFormat(o, c)),
        u.format(t)
      )
    }),
    (nt.prototype._d = function (t, e, n) {
      if (!n) return new Intl.DateTimeFormat(e).format(t)
      var r = this._localizeDateTime(
        t,
        e,
        this.fallbackLocale,
        this._getDateTimeFormats(),
        n
      )
      if (this._isFallbackRoot(r)) {
        if (!this._root) throw Error('unexpected error')
        return this._root.d(t, n, e)
      }
      return r || ''
    }),
    (nt.prototype.d = function (t) {
      for (var n = [], r = arguments.length - 1; r-- > 0; )
        n[r] = arguments[r + 1]
      var i = this.locale,
        a = null
      return (
        1 === n.length
          ? 'string' == typeof n[0]
            ? (a = n[0])
            : e(n[0]) &&
              (n[0].locale && (i = n[0].locale), n[0].key && (a = n[0].key))
          : 2 === n.length &&
            ('string' == typeof n[0] && (a = n[0]),
            'string' == typeof n[1] && (i = n[1])),
        this._d(t, i, a)
      )
    }),
    (nt.prototype.getNumberFormat = function (t) {
      return c(this._vm.numberFormats[t] || {})
    }),
    (nt.prototype.setNumberFormat = function (t, e) {
      this._vm.$set(this._vm.numberFormats, t, e)
    }),
    (nt.prototype.mergeNumberFormat = function (t, e) {
      this._vm.$set(
        this._vm.numberFormats,
        t,
        j.util.extend(this._vm.numberFormats[t] || {}, e)
      )
    }),
    (nt.prototype._localizeNumber = function (t, e, n, i, a, o) {
      var s = e,
        c = i[s]
      if (((r(c) || r(c[a])) && ((s = n), (c = i[s])), r(c) || r(c[a])))
        return null
      var l,
        u = c[a]
      if (o) l = new Intl.NumberFormat(s, Object.assign({}, u, o))
      else {
        var f = s + '__' + a
        ;(l = this._numberFormatters[f]),
          l || (l = this._numberFormatters[f] = new Intl.NumberFormat(s, u))
      }
      return l.format(t)
    }),
    (nt.prototype._n = function (t, e, n, r) {
      if (!n)
        return (
          r ? new Intl.NumberFormat(e, r) : new Intl.NumberFormat(e)
        ).format(t)
      var i = this._localizeNumber(
        t,
        e,
        this.fallbackLocale,
        this._getNumberFormats(),
        n,
        r
      )
      if (this._isFallbackRoot(i)) {
        if (!this._root) throw Error('unexpected error')
        return this._root.n(t, Object.assign({}, { key: n, locale: e }, r))
      }
      return i || ''
    }),
    (nt.prototype.n = function (t) {
      for (var n = [], r = arguments.length - 1; r-- > 0; )
        n[r] = arguments[r + 1]
      var i = this.locale,
        a = null,
        o = null
      return (
        1 === n.length
          ? 'string' == typeof n[0]
            ? (a = n[0])
            : e(n[0]) &&
              (n[0].locale && (i = n[0].locale),
              n[0].key && (a = n[0].key),
              (o = Object.keys(n[0]).reduce(function (t, e) {
                var r
                return et.includes(e)
                  ? Object.assign({}, t, ((r = {}), (r[e] = n[0][e]), r))
                  : t
              }, null)))
          : 2 === n.length &&
            ('string' == typeof n[0] && (a = n[0]),
            'string' == typeof n[1] && (i = n[1])),
        this._n(t, i, a, o)
      )
    }),
    Object.defineProperties(nt.prototype, rt),
    (nt.availabilities = { dateTimeFormat: I, numberFormat: S }),
    (nt.install = F),
    (nt.version = '8.1.0'),
    nt
  )
})
!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(require('VueI18n'), require('Vue')))
    : 'function' == typeof define && define.amd
    ? define(['VueI18n', 'Vue'], t)
    : 'object' == typeof exports
    ? (exports.Vui18n = t(require('VueI18n'), require('Vue')))
    : (e.Vui18n = t(e.VueI18n, e.Vue))
})('undefined' != typeof self ? self : this, function (e, t) {
  return (function (e) {
    function t(r) {
      if (n[r]) return n[r].exports
      var o = (n[r] = { i: r, l: !1, exports: {} })
      return e[r].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
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
      t((t.s = 0))
    )
  })([
    function (e, t, n) {
      function r(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function o(e, t) {
        for (var n = Object.getOwnPropertyNames(t), r = 0; r < n.length; r++) {
          var o = n[r],
            u = Object.getOwnPropertyDescriptor(t, o)
          u &&
            u.configurable &&
            void 0 === e[o] &&
            Object.defineProperty(e, o, u)
        }
        return e
      }
      function u(e, t) {
        if (!(e instanceof t))
          throw new TypeError('Cannot call a class as a function')
      }
      function i(e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !t || ('object' != typeof t && 'function' != typeof t) ? e : t
      }
      function f(e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof t
          )
        ;(e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })),
          t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : o(e, t))
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var c = n(1),
        s = r(c),
        a = n(2),
        l = r(a),
        p = (function (e) {
          function t(n) {
            u(this, t)
            var r = i(this, e.call(this, n))
            return (
              (l.default.prototype.i18n = r.handleKey),
              l.default.mixin({ i18n: r }),
              r
            )
          }
          return (
            f(t, e),
            (t.prototype.handleKey = function (e) {
              if (!e || e.trim().length < 1) return this.$t(e)
              var t = e.split('.')
              return (
                1 == t.length
                  ? (e = 'message.' + e)
                  : 'message' != t[0] && (e = e.replace(t[0], 'message')),
                this.$t(e)
              )
            }),
            (t.prototype.setLocale = function (e) {
              return (this.locale = e), this
            }),
            t
          )
        })(s.default)
      l.default.use(p), (t.default = p)
    },
    function (t, n) {
      t.exports = e
    },
    function (e, n) {
      e.exports = t
    }
  ])
})
