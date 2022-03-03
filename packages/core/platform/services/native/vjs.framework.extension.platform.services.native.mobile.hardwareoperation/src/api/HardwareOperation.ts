let instance

const putInstance = function (ins) {
  instance = ins
}

const openFlashLight = function () {
  instance.openFlashLight()
}

const closeFlashLight = function () {
  instance.closeFlashLight()
}

const setScreenBrightness = function (brightness) {
  instance.setScreenBrightness(brightness)
}

const getGPSStatus = function (success, error) {
  instance.getGPSStatus(success, error)
}

const getBluetoothStatus = function (success, error) {
  instance.getBluetoothStatus(success, error)
}

const getNetworkState = function (success, error) {
  instance.getNetworkState(success, error)
}

const openCamera = function (success, error) {
  instance.openCamera(success, error)
}

const vibrate = function (t) {
  instance.vibrate(t)
}

const getDeviceId = function (success, error) {
  instance.getDeviceId(success, error)
}

export {
  putInstance,
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
