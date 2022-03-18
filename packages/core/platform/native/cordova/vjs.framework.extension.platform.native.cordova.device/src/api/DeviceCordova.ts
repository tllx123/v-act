import { Device as DeviceService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.device'

export function initModule(sb: any) {
  DeviceService.putInstance(exports)
}

/**
 * 初始化cordova的device对象，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Device = device
}

const getDevicePlatform = function () {
  return device.platform
}

const getDevicePlatformVersion = function () {
  return device.version
}

const getDeviceModel = function () {
  return device.model
}

const getDeviceUUIDl = function () {
  return device.uuid
}

const getDeviceManufacturer = function () {
  return device.manufacturer
}

export {
  getDeviceManufacturer,
  getDeviceModel,
  getDevicePlatform,
  getDevicePlatformVersion,
  getDeviceUUIDl
}
