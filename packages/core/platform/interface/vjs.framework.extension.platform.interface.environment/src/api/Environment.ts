import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

this._$v3platform_runtime_env = true
const token = 'ENVIRONMENT_V3_INFO',
  RUNNING_MODE = 'RUNNING_MODE',
  DEBUG_KEY = 'DEBUG_KEY',
  CTX_PATH = 'CTX_PATH',
  CTX_HOST = 'CTX_HOST',
  PLATFORM_TYPE = 'PLATFORM_TYPE',
  LOGIN_INFO = 'LOGIN_INFO',
  IS_ASYNC = 'IS_ASYNC',
  DEV_ID = 'DEV_ID',
  DEBUGGER_PORT = 'DEBUGGER_PORT',
  //�Ż���ַ
  OPTIMIZELINK_KEY = 'OPTIMIZELINK_KEY',
  //�Ƿ����token
  ENCRYPT_TOKEN_KEY = 'ENCRYPT_TOKEN_KEY',
  //�Ƿ��ڴ����������
  IS_WEB_DESIGN_KEY = 'IS_WEB_DESIGN_KEY',
  //�쳣ʵ����ʶ
  EXCEPTION_INSTANCE_IDEN_KEY = 'EXCEPTION_INSTANCE_IDEN_KEY',
  //�Ƿ�ʹ�ü���ģʽ
  COMPATIBLE_MODE_KEY = 'COMPATIBLE_MODE_KEY',
  DOMAIN_KEY = 'DOMAIN_KEY'

const storage = storageManager.get(storageManager.TYPES.MAP, token)

const init = function (params) {
  if (params) {
    setDomain(params.domain)
    setOptimizeLink(params.optimizeLink)
    storage.put(ENCRYPT_TOKEN_KEY, params.isEncryptToken ? true : false)
    storage.put(EXCEPTION_INSTANCE_IDEN_KEY, params.ExceptionInstanceIden)
    storage.put(COMPATIBLE_MODE_KEY, !!params.CompatibleMode)
  }
}

const useCompatibleMode = function () {
  let val = storage.get(COMPATIBLE_MODE_KEY)
  return false === val ? false : true
}

const getExceptionInstanceId = function () {
  let val = storage.get(EXCEPTION_INSTANCE_IDEN_KEY)
  return val
}

const isEncryptToken = function () {
  let val = storage.get(ENCRYPT_TOKEN_KEY)
  return val === true
}

const setRunningMode = function (mode) {
  storage.put(RUNNING_MODE, mode)
}

const getRunningMode = function () {
  return storage.get(RUNNING_MODE)
}

const setDebug = function (debug: boolean) {
  storage.put(DEBUG_KEY, debug)
}

const isDebug = function () {
  return storage.get(DEBUG_KEY)
}

const setContextPath = function (ctxPath: string) {
  storage.put(CTX_PATH, ctxPath)
}

const getContextPath = function () {
  let contextPath = storage.get(CTX_PATH)
  return contextPath ? contextPath : ''
}

const setPlatformType = function (type: string) {
  storage.put(PLATFORM_TYPE, type)
}

const getPlatformType = function () {
  return storage.get(PLATFORM_TYPE)
}

const isAsync = function () {
  return storage.containsKey(IS_ASYNC) ? storage.get(IS_ASYNC) : true
}

const setAsync = function (async: boolean) {
  storage.put(IS_ASYNC, async)
}

const setHost = function (host: string) {
  storage.put(CTX_HOST, host)
}

const getHost = function () {
  return storage.containsKey(CTX_HOST) ? storage.get(CTX_HOST) : ''
}

const setLoginInfo = function (params: any) {
  storage.put(LOGIN_INFO, params)
}

const getLoginInfo = function () {
  return storage.get(LOGIN_INFO)
}

let _getHostUrl = function () {
  let l = window.location
  return l.protocol + '//' + l.host + getContextPath()
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

const parseCssStr = function (css: string) {
  if (css && typeof document != 'undefined') {
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

const setDebugPort = function (port: number) {
  storage.put(DEBUGGER_PORT, port)
}

const getDebugPort = function () {
  return storage.get(DEBUGGER_PORT)
}

const setDevId = function (id: string) {
  storage.put(DEV_ID, id)
}

const getDevId = function () {
  return storage.get(DEV_ID)
}

let domainId: null | string = null

const getDomain = function () {
  // let vjsContext = VMetrix.getVjsContext()
  // if (vjsContext) {
  //   return vjsContext['domain']
  // }
  return domainId
}

const setDomain = function (domain: null | string) {
  if (!domain || null == domain) {
    domain = null
  }
  domainId = domain
  /*VMetrix.putAllVjsContext({
    domain: domain
  })*/
}

/**
 * �����Ż�����
 * @params	{Boolean}	optimize true���Ż���false�����Ż�
 * */
let setOptimizeLink = function (optimize) {
  storage.put(OPTIMIZELINK_KEY, optimize === true)
}

const isOptimizeLink = function () {
  return storage.get(OPTIMIZELINK_KEY)
}

const isWebDesign = function () {
  return storage.get(IS_WEB_DESIGN_KEY) == true
}

const setWebDesign = function () {
  storage.put(IS_WEB_DESIGN_KEY, true)
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
  return parseInt(minorVersion + '')
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
  getContextPath,
  getDebugPort,
  getDevId,
  getDomain,
  getExceptionInstanceId,
  getHost,
  getLoginInfo,
  getLoginUrl,
  getPlatformType,
  getRunningMode,
  init,
  isAsync,
  isChrome,
  isDebug,
  isEncryptToken,
  isIE,
  isIE10,
  isIE11,
  isIE8,
  isIE9,
  isLogin,
  isOptimizeLink,
  isWebDesign,
  parseCssStr,
  setAsync,
  setContextPath,
  setDebug,
  setDebugPort,
  setDevId,
  setDomain,
  setHost,
  setLoginInfo,
  setPlatformType,
  setRunningMode,
  setWebDesign,
  useCompatibleMode
}
