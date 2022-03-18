import { Qrcode as QrcodeService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.qrcode'

export function initModule(sb: any) {
  QrcodeService.putInstance(exports)
}

/**
 * 初始化cordova的二维码扫描插件，注为全局对象
 * @param {Object} cordova.plugins.barcodeScanner 二维码全局调用
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.QRcode = cordova.plugins.barcodeScanner
}

const scanQRCode = function (callback: Function) {
  //@ts-ignore
  cordova.plugins.barcodeScanner.scan(
    function (result: Record<string, any>) {
      if (isFunction(callback)) {
        callback(result.text)
      }
    },
    function (error: any) {
      alert('扫描失败: ' + error)
    }
  )
}

function isFunction(arg: any) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { scanQRCode }
