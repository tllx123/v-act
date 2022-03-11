import { ProgressBarUtil as StatusBarService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.StatusBar'

export function initModule(sb: any) {
  StatusBarService.putInstance(exports)
}

/**
 * 初始化cordova的状态栏，注为全局对象
 * @param {Object} StatusBar 状态栏全局调用
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.StatusBar = StatusBar
}

const changeStatusBarColor = function (colorName: string) {
  //@ts-ignore
  if (cordova.platformId == 'ios') {
    if (colorName == 'black') {
      StatusBar.styleDefault()
    }
    if (colorName == 'white') {
      StatusBar.styleBlackTranslucent()
    }
  }
}

const isShow = function (isShow: boolean) {
  if (isShow) {
    StatusBar.show()
  } else {
    StatusBar.hide()
  }
}

export { changeStatusBarColor, isShow }
