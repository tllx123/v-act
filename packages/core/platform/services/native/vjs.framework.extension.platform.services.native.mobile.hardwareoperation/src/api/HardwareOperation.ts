let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const openFlashLight = function () {
  instance.openFlashLight()
}

const closeFlashLight = function () {
  instance.closeFlashLight()
}

const setScreenBrightness = function (brightness: any) {
  instance.setScreenBrightness(brightness)
}

const getGPSStatus = function (success: any, error: any) {
  instance.getGPSStatus(success, error)
}

const getBluetoothStatus = function (success: any, error: any) {
  instance.getBluetoothStatus(success, error)
}

const getNetworkState = function (success: any, error: any) {
  instance.getNetworkState(success, error)
}

const openCamera = function (success: any, error: any) {
  instance.openCamera(success, error)
}

const vibrate = function (t: any) {
  instance.vibrate(t)
}

const getDeviceId = function (success: any, error: any) {
  instance.getDeviceId(success, error)
}

export {
  closeFlashLight,
  getBluetoothStatus,
  getDeviceId,
  getGPSStatus,
  getNetworkState,
  openCamera,
  openFlashLight,
  putInstance,
  setScreenBrightness,
  vibrate
}
