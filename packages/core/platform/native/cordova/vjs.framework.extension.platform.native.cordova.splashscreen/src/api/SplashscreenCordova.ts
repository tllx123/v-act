/**
 * 初始化cordova的闪屏插件，注为全局对象
 * 另：window.VJSBridge.plugins.vplatform对象已在客户端模板页初始化，PC端没有
 */
//@ts-nocheck
if (window.VJSBridge && window.VJSBridge.plugins.vplatform) {
  window.VJSBridge.plugins.vplatform.Splashscreen =
    window.navigator.splashscreen
}
