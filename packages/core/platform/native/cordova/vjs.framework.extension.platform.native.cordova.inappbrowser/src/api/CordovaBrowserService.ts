import { BrowserService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.inappbrowser'

export function initModule(sb) {
  BrowserService.putInstance(exports)
}

/**
 * 初始化内置浏览器插件，注为全局对象
 * @param {Object} cordova.InAppBrowser 内置浏览器全局调用
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.InAppBrowser = cordova.InAppBrowser
}

const open = function (url, browerType) {
  cordova.InAppBrowser.open(encodeURI(url), browerType, 'location=yes')
}

export { open }
