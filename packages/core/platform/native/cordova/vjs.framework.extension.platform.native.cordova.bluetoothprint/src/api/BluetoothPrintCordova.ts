import * as BluetoothPrintService from '@v-act/vjs.framework.extension.platform.services.native.mobile.BluetoothPrint'

export function initModule(sb: any) {
  BluetoothPrintService.putInstance(exports)
}

/**
 * 初始化cordova的蓝牙打印插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.BluetoothPrint = window.navigator
}

const bluetoothPrint = function (
  successCallback: Function,
  errorCallback: Function,
  params: Record<string, any>
) {
  //@ts-ignore
  cordova.plugins.bluetoothPrint.execute(
    function (success: any) {
      if (isFunction(successCallback)) {
        successCallback(success)
      }
    },
    function (fail: any) {
      if (isFunction(errorCallback)) {
        errorCallback(fail)
      }
    },
    params
  )
}

function isFunction(arg: any) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}

export { bluetoothPrint }
