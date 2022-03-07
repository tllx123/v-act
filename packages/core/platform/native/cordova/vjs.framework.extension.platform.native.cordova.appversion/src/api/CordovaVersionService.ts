import { AppVersion as VersionService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

export function initModule(sb) {
  VersionService.putInstance(exports)
}

/**
 * 初始化Cordova 获取版本号插件，注为全局对象
 * @param {Object} cordova.getAppVersion 全局调用对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.AppVersion = cordova.getAppVersion
}

const getVersionNumber = function (callback) {
  if (typeof callback != 'function') {
    throw new Error('获取APP版本号服务传参错误!请指定一个回调函数')
    return
  }
  cordova.getAppVersion.getVersionNumber(function (version) {
    callback(version)
  })
}

const getAppName = function (callback) {
  if (typeof callback != 'function') {
    throw new Error('获取AP名称服务传参错误!请指定一个回调函数')
    return
  }
  cordova.getAppVersion.getAppName(function (appName) {
    callback(appName)
  })
}

export { getAppName, getVersionNumber }
