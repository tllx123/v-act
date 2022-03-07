export function initModule(sb) {
  let QrcodeService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Qrcode'
  )
  QrcodeService.putInstance(exports)
}

/**
 * 初始化cordova的二维码扫描插件，注为全局对象
 * @param {Object} cordova.plugins.barcodeScanner 二维码全局调用
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.QRcode = cordova.plugins.barcodeScanner
}

const scanQRCode = function (callback) {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      if (isFunction(callback)) {
        callback(result.text)
      }
    },
    function (error) {
      alert('扫描失败: ' + error)
    }
  )
}

function isFunction(arg) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { scanQRCode }
