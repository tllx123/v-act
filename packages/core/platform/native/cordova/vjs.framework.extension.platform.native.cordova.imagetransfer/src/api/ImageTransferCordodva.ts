import { ImageTransfer } from '@v-act/vjs.framework.extension.platform.services.native.mobile.imagetransfer'

export function initModule(sb) {
  ImageTransfer.putInstance(exports)
}

/**
 * 初始化插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.imageTransfer =
    cordova.plugins.imageTransfer
}

const getImage = function (url, successCB, errorCB, opation) {
  if (cordova.plugins.imageTransfer) {
    cordova.plugins.imageTransfer.getImage(url, successCB, errorCB, opation)
  } else {
    successCB(url)
  }
}

export { getImage }
