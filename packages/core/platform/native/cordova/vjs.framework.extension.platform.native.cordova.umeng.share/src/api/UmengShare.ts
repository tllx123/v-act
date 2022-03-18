import { Share as UmengShareService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.umeng.share'

export function initModule(sb: any) {
  UmengShareService.putInstance(exports)
}

/**
 * 初始化cordova的拍照插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.UmengShareService = navigator.UmengShare
}

const share = function (
  text: string,
  title: string,
  url: string,
  imgUrl: string,
  platforms: any,
  successCB: Function,
  errorCB: Function
) {
  //@ts-ignore
  navigator.UmengShare.share(
    text,
    title,
    url,
    imgUrl,
    platforms,
    successCB,
    errorCB
  )
}

const auth = function (
  platformName: string,
  successCB: Function,
  errorCB: Function
) {
  //@ts-ignore
  navigator.UmengShare.auth(platformName, successCB, errorCB)
}

const isInstall = function (platformName: Function, callback: Function) {
  //@ts-ignore
  if (navigator.UmengShare.isInstall) {
    //@ts-ignore
    navigator.UmengShare.isInstall(platformName, callback)
  } else {
    callback('true')
  }
}

export { auth, isInstall, share }
