let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const getDevicePlatform = function () {
  return instance.getDevicePlatform()
}

const getDevicePlatformVersion = function () {
  return instance.getDevicePlatformVersion()
}

const getDeviceModel = function () {
  return instance.getDeviceModel()
}

const getDeviceUUIDl = function () {
  return instance.getDeviceUUIDl()
}

const getDeviceManufacturer = function () {
  return instance.getDeviceManufacturer()
}

export {
  getDeviceManufacturer,
  getDeviceModel,
  getDevicePlatform,
  getDevicePlatformVersion,
  getDeviceUUIDl,
  putInstance
}
