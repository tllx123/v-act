import * as GeolocationService from '@v-act/vjs.framework.extension.platform.services.native.mobile.Geolocation'

export function initModule(sb: any) {
  GeolocationService.putInstance(exports)
}

/**
 * 初始化cordova的获取地理位置，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Geolocation = navigator.location
}

const getCurrentPosition = function (successCB: Function, errorCB: Function) {
  let onSuccess = function (message: any) {
    if (typeof successCB == 'function') {
      successCB(message)
    }
  }
  function onError(message: any) {
    if (typeof errorCB == 'function') {
      errorCB(message.code, message.message)
    }
  }
  //@ts-ignore
  if (cordova.platformId == 'android') {
    //@ts-ignore
    navigator.location.getCurrentPosition(onSuccess, onError) // Android走自己写的插件
  } else {
    navigator.geolocation.getCurrentPosition(onSuccess, onError) // iOS走Cordova官方插件
  }
}

function isFunction(arg: any) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { getCurrentPosition }
