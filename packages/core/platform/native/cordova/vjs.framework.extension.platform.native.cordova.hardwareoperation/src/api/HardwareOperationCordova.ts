export function initModule(sb) {
  let HardwareOperationService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.HardwareOperation'
  )
  HardwareOperationService.putInstance(exports)
}

const openFlashLight = function () {
  toone.plugin.HardwareOperation.openFlashLight()
}

const closeFlashLight = function () {
  toone.plugin.HardwareOperation.closeFlashLight()
}

const setScreenBrightness = function (brightness) {
  if (!isNaN(brightness)) {
    if (brightness < 0) {
      brightness = 0
    } else if (brightness > 1) {
      brightness = 1
    }
    toone.plugin.HardwareOperation.setScreenBrightness(brightness)
  }
}

const getGPSStatus = function (success, error) {
  toone.plugin.HardwareOperation.getGPSStatus(success, error)
}

const getBluetoothStatus = function (success, error) {
  toone.plugin.HardwareOperation.getBluetoothStatus(success, error)
}

const getNetworkState = function (success, error) {
  toone.plugin.HardwareOperation.getNetworkState(success, error)
}

const openCamera = function (success, error) {
  toone.plugin.HardwareOperation.openCamera(success, error)
}

const vibrate = function (t) {
  toone.plugin.HardwareOperation.vibrate(t)
}

const getDeviceId = function (success, error) {
  toone.plugin.HardwareOperation.getDeviceId(success, error)
}

export {
  openFlashLight,
  closeFlashLight,
  setScreenBrightness,
  getGPSStatus,
  getBluetoothStatus,
  getNetworkState,
  openCamera,
  vibrate,
  getDeviceId
}
