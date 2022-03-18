/**
 * 初始化cordova的提示框插件，注为全局对象
 *
 */
//@ts-nocheck
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Dialogs = window.navigator.notification
}
