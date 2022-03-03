exports.initModule = function (sb) {
  let GeolocationService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Geolocation'
  )
  GeolocationService.putInstance(exports)
}

/**
 * 初始化cordova的获取地理位置，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Geolocation = navigator.location
}

const getCurrentPosition = function (successCB, errorCB) {
  let onSuccess = function (message) {
    if (typeof successCB == 'function') {
      successCB(message)
    }
  }
  function onError(message) {
    if (typeof errorCB == 'function') {
      errorCB(message.code, message.message)
    }
  }
  if (cordova.platformId == 'android') {
    navigator.location.getCurrentPosition(onSuccess, onError) // Android走自己写的插件
  } else {
    navigator.geolocation.getCurrentPosition(onSuccess, onError) // iOS走Cordova官方插件
  }
}

function isFunction(arg) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { getCurrentPosition }
