import { APPConfig } from '@v-act/vjs.framework.extension.platform.services.native.mobile.sysconfig'

export function initModule(sb: any) {
  APPConfig.putInstance(exports)
}

/**
 * 初始化插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.sysConfig = cordova.plugins.system.config
}

const isAwakeByURL = function (callback: Function) {
  //@ts-ignore
  cordova.plugins.system.config.isAwakeByURL(callback)
}

const getAwakeParams = function (callback: Function) {
  //@ts-ignore
  cordova.plugins.system.config.getAwakeParams(callback)
}

const clear = function () {
  //@ts-ignore
  cordova.plugins.system.config.clear()
}

const pasteBoard = function (content: any) {
  //@ts-ignore
  cordova.plugins.system.config.pasteBoard(content)
}

const call = function (phoneNum: string | number) {
  //@ts-ignore
  cordova.plugins.system.config.call(phoneNum)
}

const setPreferences = function (param: Record<string, any>) {
  //@ts-ignore
  cordova.plugins.system.config.setPreferences(param)
}

const getPreferences = function (
  successCallback: Function,
  param: Record<string, any>
) {
  //@ts-ignore
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
