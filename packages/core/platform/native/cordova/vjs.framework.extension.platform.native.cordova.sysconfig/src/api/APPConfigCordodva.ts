import { APPConfig } from '@v-act/vjs.framework.extension.platform.services.native.mobile.sysconfig'

export function initModule(sb) {
  APPConfig.putInstance(exports)
}

/**
 * 初始化插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.sysConfig = cordova.plugins.system.config
}

const isAwakeByURL = function (callback) {
  cordova.plugins.system.config.isAwakeByURL(callback)
}

const getAwakeParams = function (callback) {
  cordova.plugins.system.config.getAwakeParams(callback)
}

const clear = function () {
  cordova.plugins.system.config.clear()
}

const pasteBoard = function (content) {
  cordova.plugins.system.config.pasteBoard(content)
}

const call = function (phoneNum) {
  cordova.plugins.system.config.call(phoneNum)
}

const setPreferences = function (param) {
  cordova.plugins.system.config.setPreferences(param)
}

const getPreferences = function (successCallback, param) {
  cordova.plugins.system.config.getPreferences(successCallback, param)
}

export {
  call,
  clear,
  getAwakeParams,
  getPreferences,
  isAwakeByURL,
  pasteBoard,
  setPreferences
}
