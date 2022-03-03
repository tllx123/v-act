exports.initModule = function (sb) {
  let UmengShareService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.umeng.Share'
  )
  UmengShareService.putInstance(exports)
}

/**
 * 初始化cordova的拍照插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.UmengShareService = navigator.UmengShare
}

const share = function (
  text,
  title,
  url,
  imgUrl,
  platforms,
  successCB,
  errorCB
) {
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

const auth = function (platformName, successCB, errorCB) {
  navigator.UmengShare.auth(platformName, successCB, errorCB)
}

const isInstall = function (platformName, callback) {
  if (navigator.UmengShare.isInstall) {
    navigator.UmengShare.isInstall(platformName, callback)
  } else {
    callback('true')
  }
}

export { share, auth, isInstall }
