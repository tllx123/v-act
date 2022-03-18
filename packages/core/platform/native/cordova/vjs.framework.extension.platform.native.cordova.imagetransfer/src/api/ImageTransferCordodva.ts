import { ImageTransfer } from '@v-act/vjs.framework.extension.platform.services.native.mobile.imagetransfer'

export function initModule(sb: any) {
  ImageTransfer.putInstance(exports)
}

/**
 * 初始化插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.imageTransfer =
    //@ts-ignore
    cordova.plugins.imageTransfer
}

const getImage = function (
  url: string,
  successCB: Function,
  errorCB: Function,
  opation: Record<string, any>
) {
  //@ts-ignore
  if (cordova.plugins.imageTransfer) {
    //@ts-ignore
    cordova.plugins.imageTransfer.getImage(url, successCB, errorCB, opation)
  } else {
    successCB(url)
  }
}

export { getImage }
