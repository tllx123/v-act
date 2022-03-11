import { BrowserService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.inappbrowser'

export function initModule(sb: any) {
  BrowserService.putInstance(exports)
}

/**
 * 初始化内置浏览器插件，注为全局对象
 * @param {Object} cordova.InAppBrowser 内置浏览器全局调用
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.InAppBrowser = cordova.InAppBrowser
}

const open = function (url: string, browerType: string) {
  //@ts-ignore
  cordova.InAppBrowser.open(encodeURI(url), browerType, 'location=yes')
}

export { open }
