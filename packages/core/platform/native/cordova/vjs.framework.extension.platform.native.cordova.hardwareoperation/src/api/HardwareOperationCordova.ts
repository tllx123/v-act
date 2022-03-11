import * as HardwareOperationService from '@v-act/vjs.framework.extension.platform.services.native.mobile.HardwareOperation'

export function initModule(sb: any) {
  HardwareOperationService.putInstance(exports)
}

const openFlashLight = function () {
  //@ts-ignore
  toone.plugin.HardwareOperation.openFlashLight()
}

const closeFlashLight = function () {
  //@ts-ignore
  toone.plugin.HardwareOperation.closeFlashLight()
}

const setScreenBrightness = function (brightness: number) {
  if (!isNaN(brightness)) {
    if (brightness < 0) {
      brightness = 0
    } else if (brightness > 1) {
      brightness = 1
    }
    //@ts-ignore
    toone.plugin.HardwareOperation.setScreenBrightness(brightness)
  }
}

const getGPSStatus = function (success: Function, error: Function) {
  //@ts-ignore
  toone.plugin.HardwareOperation.getGPSStatus(success, error)
}

const getBluetoothStatus = function (success: Function, error: Function) {
  //@ts-ignore
  toone.plugin.HardwareOperation.getBluetoothStatus(success, error)
}

const getNetworkState = function (success: Function, error: Function) {
  //@ts-ignore
  toone.plugin.HardwareOperation.getNetworkState(success, error)
}

const openCamera = function (success: Function, error: Function) {
  //@ts-ignore
  toone.plugin.HardwareOperation.openCamera(success, error)
}

const vibrate = function (t: any) {
  //@ts-ignore
  toone.plugin.HardwareOperation.vibrate(t)
}

const getDeviceId = function (success: Function, error: Function) {
  //@ts-ignore
  toone.plugin.HardwareOperation.getDeviceId(success, error)
}

export {
  closeFlashLight,
  getBluetoothStatus,
  getDeviceId,
  getGPSStatus,
  getNetworkState,
  openCamera,
  openFlashLight,
  setScreenBrightness,
  vibrate
}
