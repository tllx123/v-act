export function initModule(sb) {
  let StatusBarService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.StatusBar'
  )
  StatusBarService.putInstance(exports)
}

/**
 * 初始化cordova的状态栏，注为全局对象
 * @param {Object} StatusBar 状态栏全局调用
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.StatusBar = StatusBar
}

const changeStatusBarColor = function (colorName) {
  if (cordova.platformId == 'ios') {
    if (colorName == 'black') {
      StatusBar.styleDefault()
    }
    if (colorName == 'white') {
      StatusBar.styleBlackTranslucent()
    }
  }
}

const isShow = function (isShow) {
  if (isShow) {
    StatusBar.show()
  } else {
    StatusBar.hide()
  }
}

export { changeStatusBarColor, isShow }
