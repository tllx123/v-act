import { VersionService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.appversion'

export function initModule(sb: any) {
  VersionService.putInstance(exports)
}

/**
 * 初始化Cordova 获取版本号插件，注为全局对象
 * @param {Object} cordova.getAppVersion 全局调用对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.AppVersion = cordova.getAppVersion
}

const getVersionNumber = function (callback: Function) {
  if (typeof callback != 'function') {
    throw new Error('获取APP版本号服务传参错误!请指定一个回调函数')
    return
  }
  //@ts-ignore
  cordova.getAppVersion.getVersionNumber(function (version: string) {
    callback(version)
  })
}

const getAppName = function (callback: Function) {
  if (typeof callback != 'function') {
    throw new Error('获取AP名称服务传参错误!请指定一个回调函数')
    return
  }
  //@ts-ignore
  cordova.getAppVersion.getAppName(function (appName: string) {
    callback(appName)
  })
}

export { getAppName, getVersionNumber }
