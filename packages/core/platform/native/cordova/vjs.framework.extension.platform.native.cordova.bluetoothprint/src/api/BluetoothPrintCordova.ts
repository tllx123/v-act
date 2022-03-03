exports.initModule = function (sb) {
  let BluetoothPrintService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.BluetoothPrint'
  )
  BluetoothPrintService.putInstance(exports)
}

/**
 * 初始化cordova的蓝牙打印插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.BluetoothPrint = window.navigator
}

const bluetoothPrint = function (successCallback, errorCallback, params) {
  cordova.plugins.bluetoothPrint.execute(
    function (success) {
      if (isFunction(successCallback)) {
        successCallback(success)
      }
    },
    function (fail) {
      if (isFunction(errorCallback)) {
        errorCallback(fail)
      }
    },
    params
  )
}

function isFunction(arg) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}

export { bluetoothPrint }
