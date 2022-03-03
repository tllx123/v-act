window._$v3platform_runtime_env = true
let storage,
  token = 'ENVIRONMENT_V3_INFO',
  RUNNING_MODE = 'RUNNING_MODE',
  DEBUG_KEY = 'DEBUG_KEY',
  CTX_PATH = 'CTX_PATH',
  CTX_HOST = 'CTX_HOST',
  PLATFORM_TYPE = 'PLATFORM_TYPE',
  LOGIN_INFO = 'LOGIN_INFO',
  IS_ASYNC = 'IS_ASYNC',
  DEV_ID = 'DEV_ID',
  DEBUGGER_PORT = 'DEBUGGER_PORT'

exports.initModule = function (sb) {
  let storageManager = sb.getService(
    'vjs.framework.extension.platform.interface.storage.StorageManager'
  )
  storage = storageManager.get(storageManager.TYPES.MAP, token)
}

const setRunningMode = function (mode) {
  storage.put(RUNNING_MODE, mode)
}

const getRunningMode = function () {
  return storage.get(RUNNING_MODE)
}

const setDebug = function (debug) {
  storage.put(DEBUG_KEY, debug)
}

const isDebug = function () {
  return storage.get(DEBUG_KEY)
}

const setContextPath = function (ctxPath) {
  storage.put(CTX_PATH, ctxPath)
}

const getContextPath = function () {
  return storage.get(CTX_PATH)
}

const setPlatformType = function (type) {
  storage.put(PLATFORM_TYPE, type)
}

const getPlatformType = function () {
  return storage.get(PLATFORM_TYPE)
}

const isAsync = function () {
  return storage.containsKey(IS_ASYNC) ? storage.get(IS_ASYNC) : true
}

const setAsync = function (async) {
  storage.put(IS_ASYNC, async)
}

const setHost = function (host) {
  storage.put(CTX_HOST, host)
}

const getHost = function () {
  return storage.containsKey(CTX_HOST) ? storage.get(CTX_HOST) : ''
}

const setLoginInfo = function (params) {
  storage.put(LOGIN_INFO, params)
}

const getLoginInfo = function () {
  return storage.get(LOGIN_INFO)
}

let _getHostUrl = function () {
  let l = window.location
  return l.protocol + '//' + l.host + exports.getContextPath()
}

const getLoginUrl = function () {
  if (storage.containsKey(LOGIN_INFO)) {
    let info = storage.get(LOGIN_INFO)
    let type = info.type ? info.type : 'platform'
    if (type == 'platform') {
      return (
        _getHostUrl() +
        '/module-operation!executeOperation?operation=Form&componentCode=' +
        info.componentCode +
        '&windowCode=' +
        info.windowCode
      )
    } else {
      return info.url
    }
  } else {
    return _getHostUrl()
  }
}

const isLogin = function () {
  return storage.containsKey(LOGIN_INFO)
}

const parseCssStr = function (css) {
  if (css) {
    let wrapDiv = document.getElementById('_$styleWrapDiv')
    if (!wrapDiv) {
      wrapDiv = document.createElement('div')
      wrapDiv.setAttribute('id', '_$styleWrapDiv')
      wrapDiv.setAttribute('style', 'display:none;')
      document.body.appendChild(wrapDiv)
    }
    let styleDom = wrapDiv.children[0]
    if (styleDom) {
      css = styleDom.innerHTML + css
    }
    let html = "_<style id='cslk'>" + css + '</style>'
    wrapDiv.innerHTML = html
  }
}

const setDebugPort = function (port) {
  storage.put(DEBUGGER_PORT, port)
}

const getDebugPort = function () {
  return storage.get(DEBUGGER_PORT)
}

const setDevId = function (id) {
  storage.put(DEV_ID, id)
}

const getDevId = function () {
  return storage.get(DEV_ID)
}

let isOpera = function () {
  return (
    navigator.appName == 'Opera' || navigator.userAgent.indexOf('Opera') != -1
  )
}

let isNS = function () {
  return navigator.appName == 'Netscape' && !isOpera()
}

let isIE = function () {
  return (
    (navigator.appName == 'Microsoft Internet Explorer' && !isOpera()) ||
    navigator.userAgent.indexOf('Trident/') != -1
  )
}

let isMSN = function () {
  return isIE() && navigator.userAgent.indexOf('MSN') != -1
}

let isMoz = function () {
  return (
    navigator.userAgent.indexOf('Gecko') != -1 &&
    navigator.userAgent.indexOf('Safari') == -1 &&
    navigator.userAgent.indexOf('AppleWebKit') == -1 &&
    !isIE()
  )
}

let isCamino = function () {
  return isMoz() && navigator.userAgent.indexOf('Camino/') != -1
}

let isFirefox = function () {
  return isMoz() && navigator.userAgent.indexOf('Firefox/') != -1
}

let isAIR = function () {
  return navigator.userAgent.indexOf('AdobeAIR') != -1
}

let isWebKit = function () {
  return navigator.userAgent.indexOf('WebKit') != -1
}

let version = function () {
  let minorVersion
  if (
    navigator.userAgent.indexOf('Trident/') >= 0 &&
    navigator.userAgent.lastIndexOf('rv:') >= 0
  ) {
    minorVersion = parseFloat(
      navigator.userAgent.substring(
        navigator.userAgent.lastIndexOf('rv:') + 'rv:'.length
      )
    )
  } else {
    minorVersion = parseFloat(
      isIE()
        ? navigator.appVersion.substring(
            navigator.appVersion.indexOf('MSIE') + 5
          )
        : navigator.appVersion
    )
  }
  if (!isIE())
    (function () {
      var needle, pos
      if (navigator.appVersion) {
        needle = 'Version/'
        pos = navigator.appVersion.indexOf(needle)
        if (pos >= 0) {
          minorVersion = parseFloat(
            navigator.appVersion.substring(pos + needle.length)
          )
          return
        }
      }

      var ua = navigator.userAgent

      needle = 'Chrome/'
      pos = ua.indexOf(needle)
      if (pos >= 0) {
        minorVersion = parseFloat(ua.substring(pos + needle.length))
        return
      }

      needle = 'Camino/'
      pos = ua.indexOf(needle)
      if (pos >= 0) {
        minorVersion = parseFloat(ua.substring(pos + needle.length))
        return
      }

      needle = 'Firefox/'
      pos = ua.indexOf(needle)
      if (pos >= 0) {
        minorVersion = parseFloat(ua.substring(pos + needle.length))
        return
      }

      if (ua.indexOf('Opera/') >= 0) {
        needle = 'Version/'
        pos = ua.indexOf(needle)
        if (pos >= 0) {
          minorVersion = parseFloat(ua.substring(pos + needle.length))
          return
        } else {
          // Opera 9.64
          needle = 'Opera/'
          pos = ua.indexOf(needle)
          minorVersion = parseFloat(ua.substring(pos + needle.length))
          return
        }
      }
    })()
  return parseInt(minorVersion)
}

let isSafari = function () {
  return (
    isAIR() ||
    navigator.userAgent.indexOf('Safari') != -1 ||
    navigator.userAgent.indexOf('AppleWebKit') != -1
  )
}

let isChrome = function () {
  return isSafari() && navigator.userAgent.indexOf('Chrome/') != -1
}

let isIE8 = function () {
  return isIE() && version() >= 8 && document.documentMode == 8
}

let isIE9 = function () {
  return isIE() && version() >= 9 && document.documentMode >= 9
}

let isIE10 = function () {
  return isIE() && version() >= 10
}

let isIE11 = function () {
  return isIE() && version() >= 11
}

export {
  setRunningMode,
  getRunningMode,
  setDebug,
  isDebug,
  setContextPath,
  getContextPath,
  setPlatformType,
  getPlatformType,
  isAsync,
  setAsync,
  setHost,
  getHost,
  setLoginInfo,
  getLoginInfo,
  getLoginUrl,
  isLogin,
  parseCssStr,
  setDebugPort,
  getDebugPort,
  setDevId,
  getDevId,
  isIE,
  isIE8,
  isIE9,
  isIE10,
  isIE11,
  isChrome
}
